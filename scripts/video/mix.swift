// Lays the voiceover clips onto a finished film with AVFoundation. Each clip is
// levelled to the same loudness, because two voices from the same generator still
// land several dB apart, then mixed to AAC and joined to the film. The picture is
// passed through untouched.
//
//   mix <film.mp4> <out.mp4> <clip.mp3@seconds> [<clip.mp3@seconds> ...]
import AVFoundation
import Foundation

/// RMS the speech is levelled to, in dBFS. Loud for a mix with no music under it.
let targetDb: Float = -19
/// Never let a clip's peak go above this.
let ceilingDb: Float = -1.5

struct Clip {
  let url: URL
  let start: Double
}

func decibels(_ linear: Float) -> Float { 20 * log10(max(linear, 1e-6)) }

/// The gain that brings a clip to the target without clipping its peak.
func gain(for asset: AVURLAsset) async throws -> Float {
  let track = try await asset.loadTracks(withMediaType: .audio)[0]
  let reader = try AVAssetReader(asset: asset)
  let output = AVAssetReaderTrackOutput(
    track: track,
    outputSettings: [
      AVFormatIDKey: kAudioFormatLinearPCM,
      AVLinearPCMBitDepthKey: 32,
      AVLinearPCMIsFloatKey: true,
      AVLinearPCMIsBigEndianKey: false,
      AVLinearPCMIsNonInterleaved: false,
    ])
  reader.add(output)
  reader.startReading()

  var sum: Float = 0
  var peak: Float = 0
  var count = 0
  while let sample = output.copyNextSampleBuffer(), let block = CMSampleBufferGetDataBuffer(sample) {
    let bytes = CMBlockBufferGetDataLength(block)
    var data = [Float](repeating: 0, count: bytes / 4)
    CMBlockBufferCopyDataBytes(block, atOffset: 0, dataLength: bytes, destination: &data)
    for value in data {
      sum += value * value
      peak = max(peak, abs(value))
    }
    count += data.count
  }
  let rms = (sum / Float(max(count, 1))).squareRoot()
  let wanted = targetDb - decibels(rms)
  let allowed = ceilingDb - decibels(peak)
  let applied = min(wanted, allowed)
  print(
    String(
      format: "%@ rms %.1f dB, peak %.1f dB, gain %+.1f dB", asset.url.lastPathComponent,
      decibels(rms), decibels(peak), applied))
  return pow(10, applied / 20)
}

func mixVoice(_ clips: [Clip], length: CMTime, to url: URL) async throws {
  let composition = AVMutableComposition()
  var parameters: [AVMutableAudioMixInputParameters] = []

  for clip in clips {
    let asset = AVURLAsset(url: clip.url)
    let source = try await asset.loadTracks(withMediaType: .audio)[0]
    let duration = try await asset.load(.duration)
    guard
      let track = composition.addMutableTrack(
        withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid)
    else { fatalError("no audio track") }
    try track.insertTimeRange(
      CMTimeRange(start: .zero, duration: duration), of: source,
      at: CMTime(seconds: clip.start, preferredTimescale: 44100))

    let level = AVMutableAudioMixInputParameters(track: track)
    level.setVolume(try await gain(for: asset), at: .zero)
    parameters.append(level)
  }

  let mix = AVMutableAudioMix()
  mix.inputParameters = parameters

  guard
    let session = AVAssetExportSession(
      asset: composition, presetName: AVAssetExportPresetAppleM4A)
  else { fatalError("no audio export") }
  session.audioMix = mix
  session.timeRange = CMTimeRange(start: .zero, duration: length)
  try await session.export(to: url, as: .m4a)
}

func join(film: AVURLAsset, voice: URL, to url: URL) async throws {
  let length = try await film.load(.duration)
  let composition = AVMutableComposition()
  let picture = try await film.loadTracks(withMediaType: .video)[0]
  guard
    let videoTrack = composition.addMutableTrack(
      withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid),
    let audioTrack = composition.addMutableTrack(
      withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid)
  else { fatalError("no output tracks") }

  try videoTrack.insertTimeRange(CMTimeRange(start: .zero, duration: length), of: picture, at: .zero)
  let audio = AVURLAsset(url: voice)
  let sound = try await audio.loadTracks(withMediaType: .audio)[0]
  let soundLength = try await audio.load(.duration)
  try audioTrack.insertTimeRange(
    CMTimeRange(start: .zero, duration: min(length, soundLength)), of: sound, at: .zero)

  guard
    let session = AVAssetExportSession(
      asset: composition, presetName: AVAssetExportPresetPassthrough)
  else { fatalError("no passthrough export") }
  session.shouldOptimizeForNetworkUse = true
  try await session.export(to: url, as: .mp4)
}

let args = CommandLine.arguments
guard args.count > 3 else { fatalError("usage: mix <film.mp4> <out.mp4> <clip@seconds>...") }

let clips = args.dropFirst(3).map { spec -> Clip in
  let parts = spec.split(separator: "@", omittingEmptySubsequences: false)
  return Clip(url: URL(fileURLWithPath: String(parts[0])), start: Double(parts[1])!)
}
let film = AVURLAsset(url: URL(fileURLWithPath: args[1]))
let out = URL(fileURLWithPath: args[2])
let temporary = FileManager.default.temporaryDirectory
  .appendingPathComponent(UUID().uuidString)
  .appendingPathExtension("m4a")

let done = DispatchSemaphore(value: 0)
Task {
  defer { done.signal() }
  do {
    try? FileManager.default.removeItem(at: out)
    let length = try await film.load(.duration)
    try await mixVoice(clips, length: length, to: temporary)
    try await join(film: film, voice: temporary, to: out)
    try? FileManager.default.removeItem(at: temporary)
    print("mixed \(clips.count) clips into \(out.lastPathComponent)")
  } catch {
    print("mix failed: \(error)")
    exit(1)
  }
}
done.wait()

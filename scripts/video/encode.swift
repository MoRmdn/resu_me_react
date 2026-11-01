// Encodes a folder of numbered PNG frames to an H.264 MP4 with AVFoundation, so
// `npm run video` needs Xcode's command line tools rather than ffmpeg.
//
//   encode <framesDir> <out.mp4> <fps> <bitsPerSecond>
import AVFoundation
import CoreGraphics
import Foundation
import ImageIO

let args = CommandLine.arguments
guard args.count == 5, let fps = Int32(args[3]), let bitrate = Int(args[4]) else {
  fatalError("usage: encode <framesDir> <out.mp4> <fps> <bitsPerSecond>")
}

let dir = URL(fileURLWithPath: args[1])
let out = URL(fileURLWithPath: args[2])
try? FileManager.default.removeItem(at: out)

let frames = try FileManager.default
  .contentsOfDirectory(at: dir, includingPropertiesForKeys: nil)
  .filter { $0.pathExtension == "png" }
  .sorted { $0.lastPathComponent < $1.lastPathComponent }

func image(at url: URL) -> CGImage {
  guard let source = CGImageSourceCreateWithURL(url as CFURL, nil),
    let frame = CGImageSourceCreateImageAtIndex(source, 0, nil)
  else { fatalError("unreadable frame \(url.path)") }
  return frame
}

let first = image(at: frames[0])
let width = first.width
let height = first.height

let writer = try AVAssetWriter(outputURL: out, fileType: .mp4)
writer.shouldOptimizeForNetworkUse = true

let input = AVAssetWriterInput(
  mediaType: .video,
  outputSettings: [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: width,
    AVVideoHeightKey: height,
    AVVideoColorPropertiesKey: [
      AVVideoColorPrimariesKey: AVVideoColorPrimaries_ITU_R_709_2,
      AVVideoTransferFunctionKey: AVVideoTransferFunction_ITU_R_709_2,
      AVVideoYCbCrMatrixKey: AVVideoYCbCrMatrix_ITU_R_709_2,
    ],
    AVVideoCompressionPropertiesKey: [
      AVVideoAverageBitRateKey: bitrate,
      AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
      AVVideoExpectedSourceFrameRateKey: fps,
      AVVideoMaxKeyFrameIntervalKey: fps * 2,
    ],
  ])
input.expectsMediaDataInRealTime = false

let adaptor = AVAssetWriterInputPixelBufferAdaptor(
  assetWriterInput: input,
  sourcePixelBufferAttributes: [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
    kCVPixelBufferWidthKey as String: width,
    kCVPixelBufferHeightKey as String: height,
  ])

writer.add(input)
guard writer.startWriting() else { fatalError("\(String(describing: writer.error))") }
writer.startSession(atSourceTime: .zero)

let space = CGColorSpace(name: CGColorSpace.sRGB)!
let info = CGBitmapInfo.byteOrder32Little.rawValue | CGImageAlphaInfo.noneSkipFirst.rawValue

for (index, url) in frames.enumerated() {
  autoreleasepool {
    while !input.isReadyForMoreMediaData { Thread.sleep(forTimeInterval: 0.002) }

    var buffer: CVPixelBuffer?
    CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &buffer)
    guard let pixels = buffer else { fatalError("no pixel buffer") }

    CVPixelBufferLockBaseAddress(pixels, [])
    let context = CGContext(
      data: CVPixelBufferGetBaseAddress(pixels), width: width, height: height,
      bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(pixels),
      space: space, bitmapInfo: info)!
    context.draw(image(at: url), in: CGRect(x: 0, y: 0, width: width, height: height))
    CVPixelBufferUnlockBaseAddress(pixels, [])

    let time = CMTime(value: CMTimeValue(index), timescale: fps)
    if !adaptor.append(pixels, withPresentationTime: time) {
      fatalError("\(String(describing: writer.error))")
    }
  }
}

input.markAsFinished()
let done = DispatchSemaphore(value: 0)
writer.finishWriting { done.signal() }
done.wait()
guard writer.status == .completed else { fatalError("\(String(describing: writer.error))") }
print("\(frames.count) frames, \(width)x\(height), \(out.lastPathComponent)")

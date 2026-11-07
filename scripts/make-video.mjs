/**
 * Renders the reviews-and-client-map film: the planet from the banners, one
 * chapter per marketplace. Each chapter flies a line from Mansoura to every
 * country that site's clients are in, next to a real review from that site.
 *
 * The film is scripts/video/stage.js, a pure function of time. This drives it in
 * headless Chrome over the DevTools protocol, one screenshot per frame, then
 * hands the frames to scripts/video/encode.swift. No ffmpeg, no capture of real
 * time, so a slow machine can't drop a frame. If the voice clips are in
 * exports/video/voice/, scripts/video/mix.swift lays them on as a second file.
 *
 * Quotes come from content/reviews.json untouched, so they stay verbatim. The
 * lines come from the per-site counts in content/clients.json. Upwork, Mostaql
 * and Khamsat show no country on a review, so a chapter must never read as "this
 * reviewer is in that country": the card names the site, the map shows the site.
 *
 *   npm run video
 *   npm run video -- --format=portrait
 *   npm run video -- --stills=6,14.5,40        write PNGs instead of encoding
 *
 * Outputs land in exports/video/ (gitignored).
 */
import { execFileSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

const CHROME =
  process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = path.resolve("exports/video");
const FPS = 30;
const BITRATE = 12_000_000;
const WORKERS = 6;
const WORLD_COUNTRIES = 195;
/** Mansoura. Same point as scripts/generate-world-map.mjs. */
const HOME = [31.38, 31.04];

const FORMATS = {
  landscape: { width: 1920, height: 1080 },
  portrait: { width: 1080, height: 1920 },
};

/**
 * Smallest reach first, so every chapter lights more of the map. `hold` is reading
 * time, and `view` and `r` frame that site's countries clear of the card.
 */
const STOPS = [
  { site: "mostaql", review: "mostaql-hussein", hold: 6.5, view: [36, 23], r: 1250 },
  { site: "upwork", review: "upwork-graduation", hold: 8.5, view: [16, 14], r: 900 },
  { site: "freelancer", review: "freelancer-moath", hold: 10.1, view: [18, 20], r: 980 },
  { site: "khamsat", review: "khamsat-bassam", hold: 8.5, view: [32, 12], r: 720 },
  { site: "fiverr", review: "fiverr-nathan-genius", hold: 5.5, view: [-10, 24], r: 620 },
];

/**
 * The ElevenLabs narration, by file in exports/video/voice/ and start in seconds.
 * The film is timed to these lengths: a new take means checking the holds above.
 * The chapter names land on each fly-out, and the long quote fills its chapter.
 */
const VOICE = [
  ["01.mp3", 0.3],
  ["02.mp3", 2.1],
  ["03.mp3", 5.0],
  ["04.mp3", 13.6],
  ["05.mp3", 23.8],
  ["06.mp3", 25.5],
  ["07.mp3", 35.6],
  ["08.mp3", 45.8],
  ["09.mp3", 53.4],
  ["10.mp3", 56.9],
  ["11.mp3", 59.4],
];

/** Hand-kept in step with content/reviews.ts, which a plain .mjs can't import. */
const PLATFORMS = {
  upwork: { label: "Upwork", color: "#14A800", count: 8, countLabel: "jobs" },
  fiverr: { label: "Fiverr", color: "#1DBF73", count: 26, countLabel: "reviews" },
  freelancer: { label: "Freelancer", color: "#29B2FE", count: 9, countLabel: "reviews" },
  mostaql: { label: "Mostaql", color: "#2F9BE0", count: 4, countLabel: "reviews" },
  khamsat: { label: "Khamsat", color: "#FDB128", count: 88, countLabel: "tech reviews" },
};

const json = async (file) => JSON.parse(await readFile(file, "utf8"));

async function stageData(format) {
  const { countries } = await json("content/clients.json");
  const reviews = await json("content/reviews.json");
  const counted = countries.map((country) => ({
    ...country,
    count: Object.values(country.clients).reduce((a, b) => a + b, 0),
  }));

  return {
    format,
    home: HOME,
    world: WORLD_COUNTRIES,
    countries: counted,
    marks: await json("content/platform-marks.json"),
    topology: await json("node_modules/world-atlas/countries-50m.json"),
    totals: {
      clients: counted.reduce((sum, country) => sum + country.count, 0),
      countries: counted.length,
      reviews: Object.values(PLATFORMS).reduce((sum, platform) => sum + platform.count, 0),
    },
    stops: STOPS.map((stop) => {
      const review = reviews.find((r) => r.id === stop.review);
      if (!review) throw new Error(`No review ${stop.review}`);
      const platform = PLATFORMS[review.platform];
      if (review.platform !== stop.site) throw new Error(`${stop.review} is not on ${stop.site}`);
      return {
        ...stop,
        siteLabel: platform.label,
        siteCount: `${platform.count} ${platform.countLabel}`,
        review: {
          ...review,
          meta: [review.country, review.project, review.date].filter(Boolean).join(" · "),
          platformLabel: platform.label,
          brandColor: platform.color,
          ratingValue: "5.0",
          translatedLabel: "Translated from Arabic",
          repeatLabel: "Repeat client",
        },
      };
    }),
  };
}

/** Writes the stage to a folder Chrome can open from disk. */
async function buildStage(dir, format) {
  const deps = {
    "d3-array.min.js": "node_modules/d3-array/dist/d3-array.min.js",
    "d3-geo.min.js": "node_modules/d3-geo/dist/d3-geo.min.js",
    "topojson-client.min.js": "node_modules/topojson-client/dist/topojson-client.min.js",
  };
  await Promise.all(Object.entries(deps).map(([name, from]) => copyFile(from, path.join(dir, name))));
  await copyFile("scripts/video/stage.js", path.join(dir, "stage.js"));
  const html = await readFile("scripts/video/stage.html", "utf8");
  await writeFile(path.join(dir, "index.html"), html.replaceAll("DEPS/", ""));
  await writeFile(path.join(dir, "data.js"), `window.DATA = ${JSON.stringify(await stageData(format))};`);
  return pathToFileURL(path.join(dir, "index.html")).href;
}

/** A headless Chrome and just enough DevTools protocol to seek and screenshot. */
async function openPage(url, { width, height }, profile) {
  const chrome = spawn(CHROME, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--remote-debugging-port=0",
    "--allow-file-access-from-files",
    `--user-data-dir=${profile}`,
    `--window-size=${width},${height}`,
    "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });

  const port = await new Promise((resolve, reject) => {
    let log = "";
    chrome.once("error", reject);
    chrome.stderr.on("data", (chunk) => {
      log += chunk;
      const match = log.match(/DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)\//);
      if (match) resolve(match[1]);
    });
  });

  const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  const socket = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let nextId = 0;
  const pending = new Map();
  const events = new Map();
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.method) events.get(message.method)?.(message.params);
    const waiter = pending.get(message.id);
    if (!waiter) return;
    pending.delete(message.id);
    if (message.error) waiter.reject(new Error(message.error.message));
    else waiter.resolve(message.result);
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      nextId += 1;
      pending.set(nextId, { resolve, reject });
      socket.send(JSON.stringify({ id: nextId, method, params }));
    });

  const evaluate = async (expression) => {
    const { result, exceptionDetails } = await send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (exceptionDetails) {
      throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
    }
    return result.value;
  };

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  const loaded = new Promise((resolve) => events.set("Page.loadEventFired", resolve));
  await send("Page.navigate", { url });
  await loaded;
  await evaluate("window.ready");

  return {
    duration: () => evaluate("window.DURATION"),
    async frame(t) {
      await evaluate(
        `seek(${t}); new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))`,
      );
      const { data } = await send("Page.captureScreenshot", {
        format: "png",
        optimizeForSpeed: true,
      });
      return Buffer.from(data, "base64");
    },
    close() {
      socket.close();
      // Its profile is deleted next, and Chrome writes to it until it has gone.
      const exited = new Promise((resolve) => chrome.once("exit", resolve));
      chrome.kill();
      return exited;
    },
  };
}

async function stills(name, url, format, dir, times) {
  const page = await openPage(url, format, path.join(dir, "profile"));
  for (const t of times) {
    const file = path.join(OUT, "stills", `${name}-${t.toFixed(1)}s.png`);
    await writeFile(file, await page.frame(t));
    console.log(file);
  }
  await page.close();
}

function mixVoice(name, mixer) {
  const clips = VOICE.map(([file, start]) => `${path.join(OUT, "voice", file)}@${start}`);
  console.log(
    execFileSync(
      mixer,
      [path.join(OUT, `${name}.mp4`), path.join(OUT, `${name}-voice.mp4`), ...clips],
      { encoding: "utf8" },
    ).trim(),
  );
}

async function film(name, url, format, dir, encoder) {
  const framesDir = path.join(dir, "frames");
  await mkdir(framesDir);

  const pages = await Promise.all(
    Array.from({ length: WORKERS }, (_, i) => openPage(url, format, path.join(dir, `profile-${i}`))),
  );
  const total = Math.round((await pages[0].duration()) * FPS);

  let next = 0;
  await Promise.all(
    pages.map(async (page) => {
      while (next < total) {
        const index = next;
        next += 1;
        const png = await page.frame(index / FPS);
        await writeFile(path.join(framesDir, `${String(index).padStart(6, "0")}.png`), png);
        if (index % 150 === 0) console.log(`${name} ${index}/${total}`);
      }
    }),
  );
  await Promise.all(pages.map((page) => page.close()));

  console.log(
    execFileSync(encoder, [framesDir, path.join(OUT, `${name}.mp4`), String(FPS), String(BITRATE)], {
      encoding: "utf8",
    }).trim(),
  );
}

const { values } = parseArgs({
  options: { format: { type: "string" }, stills: { type: "string" } },
});
const names = values.format ? [values.format] : Object.keys(FORMATS);

await mkdir(path.join(OUT, "stills"), { recursive: true });

const build = await mkdtemp(path.join(tmpdir(), "film-"));
let encoder;
let mixer;
if (!values.stills) {
  encoder = path.join(build, "encode");
  mixer = path.join(build, "mix");
  execFileSync("swiftc", ["-O", "scripts/video/encode.swift", "-o", encoder], { stdio: "inherit" });
  execFileSync("swiftc", ["-O", "scripts/video/mix.swift", "-o", mixer], { stdio: "inherit" });
}
const hasVoice = VOICE.every(([file]) => existsSync(path.join(OUT, "voice", file)));

try {
  for (const name of names) {
    const format = FORMATS[name];
    const dir = await mkdtemp(path.join(build, `${name}-`));
    const url = await buildStage(dir, format);
    const file = `client-map-reviews-${name}`;
    if (values.stills) {
      await stills(name, url, format, dir, values.stills.split(",").map(Number));
    } else {
      await film(file, url, format, dir, encoder);
      if (hasVoice) mixVoice(file, mixer);
    }
    await rm(dir, { recursive: true, force: true });
  }
} finally {
  await rm(build, { recursive: true, force: true });
}

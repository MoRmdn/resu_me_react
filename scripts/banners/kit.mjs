/**
 * What the banner generators share: the palette, the mark, the client figures and
 * the headless-Chrome screenshot. Used by scripts/make-banners.mjs and
 * scripts/make-linkedin-banners.mjs.
 *
 * The colours mirror the tokens in app/globals.css. These scripts render outside
 * the site, so they cannot read the CSS; change a token there, change it here.
 */
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

export const CHROME =
  process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

export const FONTS =
  "https://fonts.googleapis.com/css2?family=Archivo:wght@500;600&family=JetBrains+Mono:wght@400;500&display=block";

export const INK_900 = "#0A0A0C";
export const INK_800 = "#101013";
export const INK_700 = "#16161B";
export const INK_600 = "#1E1E24";
export const BONE = "#F2EEE7";
export const COPPER = "#F2762E";
export const COPPER_BRIGHT = "#FF8A45";
export const JADE = "#3FD8C0";

/** `--color-bone-NN` as an rgb() string, for CSS. */
export const bone = (alpha) => `rgb(242 238 231 / ${alpha})`;

/** Mansoura. Lines start here. Same point as scripts/generate-world-map.mjs. */
export const HOME = [31.38, 31.04];
/** UN members plus the two observer states. Same as content/clients.ts. */
export const WORLD_COUNTRIES = 195;
export const ANTARCTICA = "010";
export const EARTH_KM = 6371;

/** The composed M, geometry locked. See design/LOGO.md. */
export const MARK = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none"
  stroke-width="4.4" stroke-linecap="square" stroke-linejoin="miter">
  <path d="M6 39 L17 9 L24 26 L31 9 L42 39" stroke="${BONE}"/>
  <path d="M24 26 L31 9 L42 39" stroke="${COPPER}"/>
</svg>`;

/** Film grain over the whole banner, as on the existing covers. */
export const GRAIN = (width, height) => `<svg class="grain" width="${width}" height="${height}">
    <filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/></filter>
    <rect width="100%" height="100%" filter="url(#g)"/>
  </svg>`;

export const round = (n) => Math.round(n * 10) / 10;

/** Numbers from a TypeScript content file, which a plain .mjs cannot import. */
export async function tsNumbers(file, key) {
  const source = await readFile(file, "utf8");
  const found = [...source.matchAll(new RegExp(`\\b${key}:\\s*(\\d+)`, "g"))].map((m) => +m[1]);
  if (!found.length) throw new Error(`No ${key} in ${file}`);
  return found;
}

/** The first string literal under `key` in a TypeScript content file. */
export async function tsString(file, key) {
  const source = await readFile(file, "utf8");
  const found = source.match(new RegExp(`\\b${key}:\\s*"([^"]+)"`));
  if (!found) throw new Error(`No ${key} in ${file}`);
  return found[1];
}

/** The job title the site uses, from content/site.ts. */
export const loadTitle = () => tsString("content/site.ts", "title");

export const countOf = (country) => Object.values(country.clients).reduce((a, b) => a + b, 0);

/**
 * Every figure the banners print, from content/clients.json. `total` includes the
 * clients with no public country: they count towards the total and stay off the
 * map (see content/clients.ts).
 */
export async function loadClients() {
  const { countries, unplaced } = JSON.parse(await readFile("content/clients.json", "utf8"));
  const placed = countries.reduce((sum, country) => sum + countOf(country), 0);
  const unplacedTotal = Object.values(unplaced).reduce((a, b) => a + b, 0);
  const lit = countries.length;
  return {
    countries,
    unplaced,
    placed,
    unplacedTotal,
    total: placed + unplacedTotal,
    lit,
    most: Math.max(...countries.map(countOf)),
    percent: Math.round((lit / WORLD_COUNTRIES) * 100),
  };
}

/**
 * Screenshots `html` in a local Chrome at `scale`, then downsamples to the
 * banner's real size so hairlines survive the network's own scaling.
 */
export async function shoot(html, { width, height, file, scale = 2 }) {
  const dir = await mkdtemp(path.join(tmpdir(), "banner-"));
  const page = path.join(dir, "page.html");
  const shot = path.join(dir, "shot.png");
  await writeFile(page, html);

  execFileSync(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-first-run",
      `--user-data-dir=${path.join(dir, "profile")}`,
      `--force-device-scale-factor=${scale}`,
      `--window-size=${width},${height}`,
      "--virtual-time-budget=6000",
      `--screenshot=${shot}`,
      pathToFileURL(page).href,
    ],
    { stdio: "ignore" },
  );

  const info = await sharp(shot)
    .resize(width, height, { kernel: "lanczos3" })
    .png({ compressionLevel: 9 })
    .toFile(file);
  await rm(dir, { recursive: true, force: true });
  return info;
}

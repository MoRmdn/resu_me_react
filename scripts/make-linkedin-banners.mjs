/**
 * Twelve LinkedIn banner styles to choose from: six built on the client numbers
 * and six on the client map. Every figure comes from content/ (clients.json for
 * the clients and countries, site.ts for the title and years, reviews.ts for the
 * review count), so a new client moves every banner: `npm run banners:linkedin`.
 *
 * LinkedIn's profile photo covers the bottom-left of the banner (PHOTO below), so
 * every style keeps its words right of x = 404, the same line the existing
 * linkedin-banner.png uses. contact-sheet.png puts all twelve side by side with
 * the photo drawn in, to judge them as they will sit on the profile.
 *
 * Rendered by a local Chrome at 2x and downsampled; see scripts/banners/kit.mjs.
 * Outputs land in exports/social-banners/linkedin/ (gitignored).
 *
 *   npm run banners:linkedin
 *   npm run banners:linkedin -- --only=numbers-1,map-3
 */
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import {
  geoAzimuthalEquidistant,
  geoCentroid,
  geoContains,
  geoDistance,
  geoEquirectangular,
  geoGraticule,
  geoMercator,
  geoNaturalEarth1,
  geoOrthographic,
  geoPath,
} from "d3-geo";
import { feature, merge } from "topojson-client";
import {
  ANTARCTICA,
  BONE,
  COPPER,
  COPPER_BRIGHT,
  EARTH_KM,
  FONTS,
  GRAIN,
  HOME,
  INK_600,
  INK_700,
  INK_800,
  INK_900,
  JADE,
  MARK,
  WORLD_COUNTRIES,
  bone,
  countOf,
  loadClients,
  loadTitle,
  round,
  shoot,
  tsNumbers,
} from "./banners/kit.mjs";

const W = 1584;
const H = 396;
const OUT = path.resolve("exports/social-banners/linkedin");
/** Where words may start: clear of the profile photo. */
const LEFT = 404;
const RIGHT = W - 64;

/**
 * The desktop profile photo, in banner pixels: 152px plus its border, 24px in
 * from the card edge, overlapping the bottom 112px of a 201px-tall banner.
 * Only the contact sheet draws it.
 */
const PHOTO = { cx: 205, cy: 332, r: 158 };

const LABELS = {
  khamsat: "Khamsat",
  fiverr: "Fiverr",
  freelancer: "Freelancer",
  upwork: "Upwork",
  mostaql: "Mostaql",
};

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const spell = (n) => WORDS[n] ?? String(n);
const fmt = (n) => n.toLocaleString("en-US");
const capital = (s) => s[0].toUpperCase() + s.slice(1);

const { countries, unplaced, unplacedTotal, total, lit, most, percent } = await loadClients();
const [years] = await tsNumbers("content/site.ts", "yearsExperience");
const title = await loadTitle();
const reviewCounts = await tsNumbers("content/reviews.ts", "count");
if (reviewCounts.length !== Object.keys(LABELS).length) {
  throw new Error(`Expected one review count per platform in content/reviews.ts`);
}
const reviews = reviewCounts.reduce((a, b) => a + b, 0);
const marks = JSON.parse(await readFile("content/platform-marks.json", "utf8"));

const ranked = [...countries].sort((a, b) => countOf(b) - countOf(a));
const platforms = Object.entries(LABELS)
  .map(([id, label]) => ({
    id,
    label,
    count: countries.reduce((sum, c) => sum + (c.clients[id] ?? 0), 0) + (unplaced[id] ?? 0),
  }))
  .sort((a, b) => b.count - a.count);
const kmTo = (c) => Math.round((geoDistance(HOME, [c.lon, c.lat]) * EARTH_KM) / 10) * 10;
const farthest = countries.reduce((a, b) => (kmTo(b) > kmTo(a) ? b : a));
const weight = (c) => Math.log(countOf(c) + 1) / Math.log(most + 1);
const abroad = countries.filter((c) => c.id !== "EG").sort((a, b) => countOf(a) - countOf(b));

async function atlas(name) {
  const topology = JSON.parse(await readFile(`node_modules/world-atlas/${name}.json`, "utf8"));
  const geometries = topology.objects.countries.geometries.filter((g) => g.id !== ANTARCTICA);
  const shapes = new Map(
    countries.map((c) => {
      const geometry = geometries.find((g) => g.id === c.iso);
      if (!geometry) throw new Error(`No ${name} shape for ${c.name} (${c.iso})`);
      return [c.id, feature(topology, geometry)];
    }),
  );
  return { land: merge(topology, geometries), shapes };
}
const fine = await atlas("countries-50m");
const coarse = await atlas("countries-110m");

// ───────────────────────────── shared pieces ─────────────────────────────

const BASE_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: ${INK_900}; }
  body { position: relative; color: ${BONE}; font-family: Archivo, sans-serif;
    -webkit-font-smoothing: antialiased; }
  svg { display: block; }
  .layer { position: absolute; inset: 0; }
  .copy { position: absolute; left: ${LEFT}px; }
  .eyebrow { font: 500 15px/1 "JetBrains Mono", monospace; letter-spacing: .18em;
    text-transform: uppercase; color: ${bone(0.62)}; }
  h1 { font-weight: 600; letter-spacing: -.035em; line-height: .98; }
  h1 b, .accent { font-weight: 600; color: ${COPPER_BRIGHT}; }
  .sub { font-size: 21px; line-height: 1.32; font-weight: 500; letter-spacing: -.01em;
    color: ${bone(0.7)}; }
  .mono { font-family: "JetBrains Mono", monospace; }
  .tabular { font-variant-numeric: tabular-nums; }
  .brand { position: absolute; right: 96px; top: 34px; display: flex; align-items: center;
    gap: .55em; font: 500 21px/1 "JetBrains Mono", monospace; letter-spacing: .02em;
    color: ${bone(0.78)}; }
  .brand svg { flex: none; }
  .grain { position: absolute; inset: 0; opacity: .07; mix-blend-mode: overlay; }
`;

const brand = (extra = "") => `<div class="brand" ${extra}>${MARK(28)}mormdn.com</div>`;

function page({ css = "", body }) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${FONTS}">
<style>${BASE_CSS}${css}</style></head><body>
${body}
${GRAIN(W, H)}
</body></html>`;
}

/** A marketplace logo in one colour, sized like PlatformMark on the site. */
function platformMark(id, size, color) {
  const mark = marks[id];
  const [, , w, h] = mark.viewBox.split(" ").map(Number);
  const height = round((mark.height / 19) * size);
  return `<svg viewBox="${mark.viewBox}" height="${height}" width="${round((w / h) * height)}"
    fill="currentColor" style="color:${color}">${mark.markup}</svg>`;
}

/** The mark in one colour, its second layer at 55%: LOGO.md variation 6. */
const MARK_MONO = (size, color) => `<svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none"
  stroke-width="4.4" stroke-linecap="square" stroke-linejoin="miter">
  <path d="M6 39 L17 9 L24 26" stroke="${color}"/>
  <path d="M24 26 L31 9 L42 39" stroke="${color}" stroke-opacity=".55"/>
</svg>`;

/**
 * Scales and moves `projection` so two longitudes land on two x positions along
 * one latitude, with that latitude at `y`.
 */
function frame(projection, { lon: [a, b], lat, x: [xa, xb], y }) {
  projection.scale(1).translate([0, 0]);
  const k = (xb - xa) / (projection([b, lat])[0] - projection([a, lat])[0]);
  projection.scale(k);
  const [qa, qy] = projection([a, lat]);
  return projection.translate([xa - qa, y - qy]).precision(0.3);
}

/** A flight on a flat map, bowing upwards. Same curve as scripts/generate-world-map.mjs. */
function bow([x0, y0], [x, y], amount = 0.22) {
  const dx = x - x0;
  const dy = y - y0;
  const sign = dx >= 0 ? 1 : -1;
  const cx = (x0 + x) / 2 + dy * amount * sign;
  const cy = (y0 + y) / 2 - Math.abs(dx) * amount - Math.abs(dy) * 0.04;
  return `M${round(x0)} ${round(y0)}Q${round(cx)} ${round(cy)} ${round(x)} ${round(y)}`;
}

const fillOpacity = (c) => round(0.24 + 0.5 * weight(c));

function homePin([x, y], size = 4) {
  return `<circle cx="${round(x)}" cy="${round(y)}" r="${size * 3}" fill="${JADE}" fill-opacity=".16"/>
  <circle cx="${round(x)}" cy="${round(y)}" r="${size * 1.9}" fill="none" stroke="${JADE}" stroke-opacity=".6" stroke-width="1.2"/>
  <circle cx="${round(x)}" cy="${round(y)}" r="${size}" fill="${JADE}"/>`;
}

// ───────────────────────────── the numbers ─────────────────────────────

/** One number, as large as the banner allows. */
function numbersHeadline() {
  const sites = platforms
    .map(
      (p) =>
        `<span>${platformMark(p.id, 20, bone(0.7))}<b class="tabular">${p.count}</b></span>`,
    )
    .join("");
  return page({
    css: `
      .copy { top: 54px; }
      .row { display: flex; align-items: flex-end; gap: 34px; margin-top: 26px; }
      .big { font-size: 232px; line-height: .74; font-weight: 600; letter-spacing: -.06em;
        color: ${COPPER_BRIGHT}; margin-left: -12px; }
      .label h1 { font-size: 80px; letter-spacing: -.04em; line-height: .9; }
      .label .sub { margin-top: 14px; }
      .sites { position: absolute; left: ${LEFT}px; bottom: 38px; display: flex; align-items: center;
        gap: 30px; }
      .sites span { display: flex; align-items: center; gap: 10px; }
      .sites b { font: 500 17px/1 "JetBrains Mono", monospace; color: ${bone(0.78)}; }
      .watermark { position: absolute; right: -70px; top: -70px; opacity: .06; }
    `,
    body: `
      <div class="watermark">${MARK_MONO(560, BONE)}</div>
      <div class="copy">
        <div class="eyebrow">${title}</div>
        <div class="row">
          <div class="big tabular">${total}</div>
          <div class="label">
            <h1>clients.</h1>
            <p class="sub">${capital(spell(platforms.length))} marketplaces. ${lit} countries.<br>One desk in Mansoura.</p>
          </div>
        </div>
      </div>
      <div class="sites">${sites}</div>
      ${brand()}
    `,
  });
}

/** Four figures on offset planes, the site's track record as cards. */
function numbersLedger() {
  const cells = [
    { n: total, label: "Clients", note: `on ${spell(platforms.length)} marketplaces` },
    { n: lit, label: "Countries", note: `${percent}% of the world, so far` },
    { n: reviews, label: "Reviews", note: "all five stars" },
    { n: years, label: "Years", note: "shipping Flutter apps" },
  ];
  return page({
    css: `
      .copy { top: 44px; }
      .grid { position: absolute; left: ${LEFT}px; right: ${W - RIGHT + 10}px; top: 86px;
        display: grid; grid-template-columns: repeat(${cells.length}, 1fr); gap: 22px; }
      .card { position: relative; height: 252px; padding: 26px 26px 0; border-radius: 16px;
        background: ${INK_800}; border: 1px solid ${bone(0.1)}; }
      .card::before { content: ""; position: absolute; inset: 0; transform: translate(10px, 10px);
        border: 1px solid ${bone(0.1)}; border-radius: 16px; z-index: -1; }
      .label { font: 500 14px/1 "JetBrains Mono", monospace; letter-spacing: .16em;
        text-transform: uppercase; color: ${bone(0.52)}; }
      .n { margin-top: 34px; font-size: 118px; line-height: .8; font-weight: 600;
        letter-spacing: -.05em; }
      .note { margin-top: 24px; font-size: 19px; line-height: 1.3; font-weight: 500;
        color: ${bone(0.7)}; }
    `,
    body: `
      <div class="copy"><div class="eyebrow">Track record · ${title}</div></div>
      <div class="grid">
        ${cells
          .map(
            (c, i) => `<div class="card">
          <div class="label">0${i + 1} / ${c.label}</div>
          <div class="n tabular ${i === 0 ? "accent" : ""}">${c.n}</div>
          <div class="note">${c.note}</div>
        </div>`,
          )
          .join("")}
      </div>
      ${brand()}
    `,
  });
}

/** One bar, split by marketplace, labels fanned out underneath. */
function numbersMarketplaces() {
  const x0 = LEFT;
  const x1 = RIGHT;
  const gap = 4;
  const barTop = 178;
  const barH = 40;
  const unit = (x1 - x0 - gap * (platforms.length - 1)) / total;
  const shades = [COPPER, bone(0.55), bone(0.4), bone(0.28), bone(0.18)];

  let x = x0;
  const segments = platforms.map((p, i) => {
    const w = p.count * unit;
    const s = { ...p, x, w, fill: shades[i] ?? bone(0.18) };
    x += w + gap;
    return s;
  });

  // Labels sit under their segment when there is room, and fan left when not.
  const labelW = 136;
  const labelGap = 18;
  const at = segments.map((s, i) => (i === 0 ? x0 : s.x));
  for (let i = at.length - 1, limit = x1 - labelW; i > 0; i -= 1) {
    at[i] = Math.min(at[i], limit);
    limit = at[i] - labelW - labelGap;
  }
  const labelTop = 262;
  const leaders = segments
    .map((s, i) => {
      const cx = round(s.x + s.w / 2);
      const lx = round(at[i] + 1);
      // Deeper to the right: each leader turns below the ones to its left.
      const knee = barTop + barH + 10 + i * 7;
      return `<path d="M${cx} ${barTop + barH + 4}V${knee}H${lx}V${labelTop - 8}" fill="none" stroke="${bone(0.28)}" stroke-width="1"/>
        <circle cx="${cx}" cy="${barTop + barH + 4}" r="2" fill="${bone(0.52)}"/>`;
    })
    .join("");

  return page({
    css: `
      .copy { top: 46px; }
      h1 { margin-top: 18px; font-size: 56px; }
      .label { position: absolute; top: ${labelTop}px; width: ${labelW}px; }
      .label .logo { height: 22px; display: flex; align-items: center; }
      .label .count { margin-top: 12px; display: flex; align-items: baseline; gap: 10px; }
      .label .count b { font-size: 46px; line-height: .8; font-weight: 600; letter-spacing: -.04em; }
      .label .count span { font: 500 15px/1 "JetBrains Mono", monospace; color: ${bone(0.52)}; }
    `,
    body: `
      <svg class="layer" width="${W}" height="${H}">
        ${segments
          .map(
            (s) =>
              `<rect x="${round(s.x)}" y="${barTop}" width="${round(s.w)}" height="${barH}" rx="6" fill="${s.fill}"/>`,
          )
          .join("")}
        ${leaders}
      </svg>
      <div class="copy">
        <div class="eyebrow">Where they hired me</div>
        <h1>${total} clients. ${capital(spell(platforms.length))} marketplaces.</h1>
      </div>
      ${segments
        .map(
          (s, i) => `<div class="label" style="left:${round(at[i])}px">
        <div class="logo">${platformMark(s.id, 19, i === 0 ? BONE : bone(0.78))}</div>
        <div class="count"><b class="tabular">${s.count}</b><span>${Math.round((s.count / total) * 100)}%</span></div>
      </div>`,
        )
        .join("")}
      ${brand()}
    `,
  });
}

/** One dot per client, grouped by country, and an empty one for the next. */
function numbersTally() {
  const rows = 4;
  const cols = Math.ceil((total + 1) / rows);
  const pitch = Math.min((RIGHT - LEFT) / cols, 44);
  const r = round(pitch * 0.29);
  const top = 184;
  const [first, second] = ranked;
  const rest = countries.length - 2;
  const restCount = total - countOf(first) - countOf(second) - unplacedTotal;
  const groups = [
    { n: countOf(first), fill: COPPER, label: `${first.name} ${countOf(first)}` },
    { n: countOf(second), fill: BONE, label: `${second.name} ${countOf(second)}` },
    { n: restCount, fill: bone(0.52), label: `${rest} more countries ${restCount}` },
    { n: unplacedTotal, fill: bone(0.28), label: `No public country ${unplacedTotal}` },
  ];
  const fills = groups.flatMap((g) => Array(g.n).fill(g.fill));
  const dots = [];
  for (let i = 0; i < cols * rows; i += 1) {
    const cx = round(LEFT + pitch * (Math.floor(i / rows) + 0.5));
    const cy = round(top + pitch * ((i % rows) + 0.5));
    dots.push(
      i < fills.length
        ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fills[i]}"/>`
        : `<circle cx="${cx}" cy="${cy}" r="${r - 0.75}" fill="none" stroke="${bone(0.52)}" stroke-width="1.5" stroke-dasharray="3 3"/>`,
    );
  }
  const key = (fill, hollow) =>
    hollow
      ? `<svg width="14" height="14"><circle cx="7" cy="7" r="5.5" fill="none" stroke="${bone(0.52)}" stroke-width="1.5" stroke-dasharray="2.5 2.5"/></svg>`
      : `<svg width="14" height="14"><circle cx="7" cy="7" r="6" fill="${fill}"/></svg>`;

  return page({
    css: `
      .copy { top: 44px; }
      h1 { margin-top: 18px; font-size: 54px; }
      .legend { position: absolute; left: ${LEFT}px; top: 146px; display: flex; gap: 28px;
        font: 500 14px/1 "JetBrains Mono", monospace; letter-spacing: .1em; text-transform: uppercase;
        color: ${bone(0.7)}; }
      .legend span { display: flex; align-items: center; gap: 9px; }
    `,
    body: `
      <svg class="layer" width="${W}" height="${H}">${dots.join("")}</svg>
      <div class="copy">
        <div class="eyebrow">Every client, counted by hand</div>
        <h1>${total} clients. One dot each.</h1>
      </div>
      <div class="legend">
        ${groups.map((g) => `<span>${key(g.fill)}${g.label}</span>`).join("")}
        <span>${key(null, true)}Yours, next</span>
      </div>
      ${brand()}
    `,
  });
}

/** The figures as a shell session, on a plane over a plane. */
function numbersTerminal() {
  const bar = (n, of, width = 10) => {
    const on = Math.max(1, Math.round((n / of) * width));
    return `<span class="blocks">${Array.from({ length: width }, (_, i) => `<i class="${i < on ? "on" : ""}"></i>`).join("")}</span>`;
  };
  const line = (key, value, extra = "") => {
    const dots = ".".repeat(Math.max(2, 16 - key.length));
    return `<div>  <span class="k">${key} <span class="d">${dots}</span></span> <span class="v">${value}</span>${extra}</div>`;
  };
  const top = ranked[0];
  return page({
    css: `
      .copy { top: 56px; width: 500px; }
      .copy .eyebrow { white-space: nowrap; }
      h1 { margin-top: 18px; font-size: 62px; }
      .copy .sub { margin-top: 18px; }
      .term { position: absolute; left: 924px; right: 64px; top: 40px; bottom: 50px;
        background: ${INK_800}; border: 1px solid ${bone(0.1)}; border-radius: 16px; }
      .term::before { content: ""; position: absolute; inset: 0; transform: translate(12px, 12px);
        border: 1px solid ${bone(0.1)}; border-radius: 16px; z-index: -1; }
      .bar { height: 46px; padding: 0 22px; display: flex; align-items: center; gap: 12px;
        border-bottom: 1px solid ${bone(0.1)}; font: 500 15px/1 "JetBrains Mono", monospace;
        color: ${bone(0.62)}; }
      .bar .tab { margin-left: auto; color: ${bone(0.52)}; }
      pre { padding: 18px 26px; font: 400 18px/30px "JetBrains Mono", monospace; color: ${BONE};
        white-space: pre; }
      .k { color: ${bone(0.52)}; }
      .d { color: ${bone(0.28)}; }
      .v { color: ${BONE}; }
      .blocks { display: inline-flex; gap: 3px; vertical-align: -2px; }
      .blocks i { width: 8px; height: 16px; background: ${bone(0.18)}; }
      .blocks i.on { background: ${BONE}; }
      .cursor { display: inline-block; width: 11px; height: 21px; background: ${BONE};
        vertical-align: -4px; }
    `,
    body: `
      <div class="copy">
        <div class="eyebrow">${title}</div>
        <h1>Shipped for<br><b class="tabular">${total}</b> clients.</h1>
        <p class="sub">In ${lit} countries, on ${spell(platforms.length)} marketplaces,<br>from one desk in Mansoura.</p>
      </div>
      <div class="term">
        <div class="bar">${MARK(22)}mormdn.com<span class="tab">zsh · 80×8</span></div>
        <pre><div><span class="k">$</span> mormdn clients --summary</div>${line("clients", total)}${line("countries", lit, `   ${bar(lit, WORLD_COUNTRIES)} <span class="k">${percent}%</span>`)}${line("marketplaces", platforms.length)}${line("top country", `${top.name}, ${countOf(top)}`)}${line("farthest", `${farthest.name}, ${fmt(kmTo(farthest))} km`)}<div><span class="k">$</span> <span class="cursor"></span></div></pre>
      </div>
    `,
  });
}

/** A split-flap counter and a departures board out of Mansoura. */
function numbersDepartures() {
  const cells = (text, n, align = "left", cls = "") => {
    const padded = (align === "right" ? text.padStart(n) : text.padEnd(n)).slice(0, n);
    return `<span class="cells ${cls}">${[...padded]
      .map((ch) => `<i>${ch === " " ? "&nbsp;" : ch}</i>`)
      .join("")}</span>`;
  };
  const shown = ranked.slice(0, 5);
  const others = countries.length - shown.length;
  const othersCount = countries
    .filter((c) => !shown.includes(c))
    .reduce((sum, c) => sum + countOf(c), 0);
  const rows = [
    ...shown.map((c) => [c.name.toUpperCase(), countOf(c)]),
    [`+${others} COUNTRIES`, othersCount],
    ["NOT DISCLOSED", unplacedTotal],
  ];
  const digits = String(total).split("");

  return page({
    css: `
      .copy { top: 48px; }
      .flaps { position: absolute; left: ${LEFT}px; top: 84px; display: flex; gap: 10px; }
      .flap { position: relative; width: 120px; height: 172px; border-radius: 10px;
        background: ${INK_700}; border: 1px solid ${bone(0.1)}; overflow: hidden;
        font: 600 158px/172px Archivo, sans-serif; letter-spacing: -.04em; text-align: center;
        color: ${COPPER_BRIGHT}; }
      .flap::before { content: ""; position: absolute; left: 0; right: 0; top: 50%; bottom: 0;
        background: rgb(0 0 0 / .2); }
      .flap::after { content: ""; position: absolute; left: 0; right: 0; top: calc(50% - 1px);
        height: 2px; background: ${INK_900}; }
      .caption { position: absolute; left: ${LEFT}px; top: 280px; font: 500 15px/1.6 "JetBrains Mono", monospace;
        letter-spacing: .16em; text-transform: uppercase; color: ${bone(0.62)}; }
      .board { position: absolute; left: 872px; right: 64px; top: 92px; }
      .head, .row { display: flex; gap: 22px; align-items: center; }
      .head { font: 500 13px/1 "JetBrains Mono", monospace; letter-spacing: .16em;
        color: ${bone(0.52)}; margin-bottom: 10px; }
      .row { margin-top: 5px; }
      .cells { display: inline-flex; gap: 2px; }
      .cells i { position: relative; width: 19px; height: 27px; display: grid; place-items: center;
        font: 500 16px/1 "JetBrains Mono", monospace; font-style: normal; color: ${BONE};
        background: ${INK_700}; border-radius: 3px; }
      .cells i::after { content: ""; position: absolute; left: 0; right: 0; top: 50%; height: 1px;
        background: ${INK_900}; }
      .status i { color: ${JADE}; }
      .c1 { width: ${14 * 21 - 2}px; } .c2 { width: ${3 * 21 - 2}px; text-align: right; }
    `,
    body: `
      <div class="copy"><div class="eyebrow">Clients served</div></div>
      <div class="flaps">${digits.map((d) => `<div class="flap tabular">${d}</div>`).join("")}</div>
      <div class="caption">Across ${lit} countries<br>on ${spell(platforms.length)} marketplaces</div>
      <div class="board">
        <div class="head"><span class="c1">DEPARTURES · MANSOURA</span><span class="c2">QTY</span><span>STATUS</span></div>
        ${rows
          .map(
            ([name, n]) =>
              `<div class="row">${cells(name, 14)}${cells(String(n), 3, "right")}${cells("DELIVERED", 9, "left", "status")}</div>`,
          )
          .join("")}
      </div>
      ${brand()}
    `,
  });
}

// ───────────────────────────── the maps ─────────────────────────────

/** Natural Earth, filled clients and flights, the words over the Atlantic. */
function mapRoutes() {
  const projection = frame(geoNaturalEarth1(), {
    lon: [-60, 77.2],
    lat: 30,
    x: [452, 1498],
    y: 214,
  });
  const path = geoPath(projection).digits(1);
  const home = projection(HOME);
  const grads = [];
  const flights = abroad.map((c) => {
    const to = projection([c.lon, c.lat]);
    grads.push(`<linearGradient id="f-${c.id}" gradientUnits="userSpaceOnUse" x1="${round(home[0])}" y1="${round(home[1])}" x2="${round(to[0])}" y2="${round(to[1])}">
      <stop offset="0" stop-color="${COPPER}" stop-opacity=".2"/>
      <stop offset="1" stop-color="${COPPER_BRIGHT}" stop-opacity=".95"/>
    </linearGradient>`);
    return `<path d="${bow(home, to)}" fill="none" stroke="url(#f-${c.id})" stroke-width="${round(1.1 + 1.5 * weight(c))}" stroke-linecap="round"/>`;
  });
  const landings = abroad
    .map((c) => {
      const [x, y] = projection([c.lon, c.lat]);
      return `<circle cx="${round(x)}" cy="${round(y)}" r="2.6" fill="${BONE}"/>`;
    })
    .join("");

  return page({
    // Low enough that the flight to the farthest client passes over the words.
    css: `
      .copy { top: 112px; }
      h1 { margin-top: 18px; font-size: 56px; }
      .copy .sub { margin-top: 16px; }
    `,
    body: `
      <svg class="layer" width="${W}" height="${H}">
        <defs>
          ${grads.join("")}
          <radialGradient id="hush" cx="560" cy="170" r="330" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="${INK_900}" stop-opacity=".94"/>
            <stop offset=".6" stop-color="${INK_900}" stop-opacity=".75"/>
            <stop offset="1" stop-color="${INK_900}" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <path d="${path(geoGraticule().step([15, 15])())}" fill="none" stroke="${BONE}" stroke-opacity=".04" stroke-width=".8"/>
        <path d="${path(fine.land)}" fill="${INK_600}" stroke="${BONE}" stroke-opacity=".09" stroke-width=".6"/>
        ${countries
          .map(
            (c) =>
              `<path d="${path(fine.shapes.get(c.id))}" fill="${COPPER}" fill-opacity="${fillOpacity(c)}" stroke="${COPPER_BRIGHT}" stroke-opacity=".45" stroke-width=".7"/>`,
          )
          .join("")}
        ${flights.join("")}
        <rect x="200" y="0" width="720" height="${H}" fill="url(#hush)"/>
        ${landings}
        ${homePin(home)}
      </svg>
      <div class="copy">
        <div class="eyebrow">Where the clients are</div>
        <h1>Lit in<br>${lit} countries.</h1>
        <p class="sub">${total} clients. Every line<br>starts in Mansoura.</p>
      </div>
      ${brand()}
    `,
  });
}

/** The world as a dot screen, client countries lit copper. */
function mapHalftone() {
  const projection = frame(geoNaturalEarth1(), {
    lon: [-77, 77.2],
    lat: 30,
    x: [430, 1080],
    y: 200,
  });
  const pitch = 8;
  const dots = [];
  const hit = new Set();
  for (let y = pitch / 2; y < H; y += pitch) {
    for (let x = pitch / 2; x < W; x += pitch) {
      const p = projection.invert([x, y]);
      if (!p || !Number.isFinite(p[0]) || Math.abs(p[0]) > 180 || Math.abs(p[1]) > 90) continue;
      const back = projection(p);
      if (Math.hypot(back[0] - x, back[1] - y) > 0.5) continue;
      if (!geoContains(coarse.land, p)) continue;
      const c = countries.find((country) => geoContains(coarse.shapes.get(country.id), p));
      if (c) hit.add(c.id);
      dots.push(
        c
          ? `<circle cx="${x}" cy="${y}" r="2.9" fill="${COPPER}" fill-opacity="${round(0.5 + 0.5 * weight(c))}"/>`
          : `<circle cx="${x}" cy="${y}" r="1.9" fill="${BONE}" fill-opacity=".15"/>`,
      );
    }
  }
  // Kuwait and Palestine fall between grid points: give each its dot.
  for (const c of countries.filter((country) => !hit.has(country.id))) {
    const [x, y] = projection([c.lon, c.lat]).map((v) => Math.round(v / pitch - 0.5) * pitch + pitch / 2);
    dots.push(`<circle cx="${x}" cy="${y}" r="2.9" fill="${COPPER}" fill-opacity="${round(0.5 + 0.5 * weight(c))}"/>`);
  }

  return page({
    css: `
      .copy { left: auto; right: 64px; top: 98px; width: 360px; }
      h1 { margin-top: 18px; font-size: 52px; }
      .copy .sub { margin-top: 16px; }
    `,
    body: `
      <svg class="layer" width="${W}" height="${H}">
        <defs>
          <linearGradient id="hush" gradientUnits="userSpaceOnUse" x1="1060" y1="0" x2="1210" y2="0">
            <stop offset="0" stop-color="${INK_900}" stop-opacity="0"/>
            <stop offset="1" stop-color="${INK_900}" stop-opacity=".93"/>
          </linearGradient>
        </defs>
        ${dots.join("")}
        <rect x="1060" y="0" width="${W - 1060}" height="${H}" fill="url(#hush)"/>
        ${homePin(projection(HOME), 3.5)}
      </svg>
      <div class="copy">
        <div class="eyebrow">Client map</div>
        <h1>${total} clients.<br>${lit} countries.</h1>
        <p class="sub">${percent}% of the world lit,<br>one dot at a time.</p>
      </div>
      ${brand()}
    `,
  });
}

/** Distance from the desk: an azimuthal map centred on Mansoura, with range rings. */
function mapRadar() {
  const cx = 1180;
  const cy = 304;
  const maxKm = 10000;
  const R = 300;
  const projection = geoAzimuthalEquidistant()
    .rotate([-HOME[0], -HOME[1]])
    .translate([cx, cy])
    .scale(R / (maxKm / EARTH_KM))
    .clipAngle(((maxKm / EARTH_KM) * 180) / Math.PI)
    .precision(0.3);
  const path = geoPath(projection).digits(1);
  const bearing = (deg, r) => {
    const a = (deg * Math.PI) / 180;
    return [cx + Math.sin(a) * r, cy - Math.cos(a) * r];
  };

  const rings = [2500, 5000, 7500, 10000].map((km) => {
    const r = (km / maxKm) * R;
    const [lx, ly] = bearing(32, r);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${BONE}" stroke-opacity="${km === maxKm ? 0.22 : 0.1}" stroke-width="1"/>
      <text x="${round(lx + 6)}" y="${round(ly - 4)}" class="ring">${fmt(km)} km</text>`;
  });

  // The sweep: copper fading to nothing behind its leading edge, ≤14%.
  const sweepFrom = 268;
  const sweepTo = 322;
  const slices = [];
  for (let i = 0; i < 24; i += 1) {
    const a0 = sweepFrom + ((sweepTo - sweepFrom) * i) / 24;
    const a1 = sweepFrom + ((sweepTo - sweepFrom) * (i + 1)) / 24;
    const [x0, y0] = bearing(a0, R);
    const [x1, y1] = bearing(a1, R);
    slices.push(
      `<path d="M${cx} ${cy}L${round(x0)} ${round(y0)}A${R} ${R} 0 0 1 ${round(x1)} ${round(y1)}Z" fill="${COPPER}" fill-opacity="${round((0.14 * (i + 1)) / 24 * 100) / 100}"/>`,
    );
  }

  const blips = countries
    .filter((c) => c.id !== "EG")
    .map((c) => {
      const [x, y] = projection([c.lon, c.lat]);
      return `<circle cx="${round(x)}" cy="${round(y)}" r="${round(2.2 + 3 * weight(c))}" fill="${BONE}"/>
        <circle cx="${round(x)}" cy="${round(y)}" r="${round(5 + 6 * weight(c))}" fill="none" stroke="${COPPER_BRIGHT}" stroke-opacity=".5"/>`;
    })
    .join("");

  const callouts = [
    { id: ranked[0].id, dx: 16, dy: 18, anchor: "start" },
    { id: farthest.id, dx: 14, dy: -8, anchor: "start", km: true },
    { id: "IN", dx: 14, dy: 5, anchor: "start" },
    { id: "GB", dx: -12, dy: -8, anchor: "end" },
    { id: "MA", dx: -12, dy: 4, anchor: "end" },
  ]
    .map((call) => ({ ...call, c: countries.find((c) => c.id === call.id) }))
    .filter(({ c }) => c)
    .map(({ c, dx, dy, anchor, km }) => {
      const [x, y] = projection([c.lon, c.lat]);
      const label = `${c.name.toUpperCase()} · ${countOf(c)}${km ? ` · ${fmt(kmTo(c))} KM` : ""}`;
      return `<text x="${round(x + dx)}" y="${round(y + dy)}" text-anchor="${anchor}" class="call">${label}</text>`;
    })
    .join("");

  return page({
    css: `
      .copy { top: 58px; width: 420px; }
      h1 { margin-top: 18px; font-size: 54px; }
      .copy .sub { margin-top: 16px; }
      text { font-family: "JetBrains Mono", monospace; }
      .ring { font-size: 12px; letter-spacing: .08em; fill: ${bone(0.52)}; }
      .call { font-size: 12.5px; font-weight: 500; letter-spacing: .1em; fill: ${bone(0.78)}; }
      .brand { top: auto; bottom: 40px; right: auto; left: ${LEFT}px; }
    `,
    body: `
      <svg class="layer" width="${W}" height="${H}">
        <defs><clipPath id="disc"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath></defs>
        <circle cx="${cx}" cy="${cy}" r="${R}" fill="${INK_800}"/>
        <g clip-path="url(#disc)">
          <path d="${path(fine.land)}" fill="${INK_600}" stroke="${BONE}" stroke-opacity=".08" stroke-width=".6"/>
          ${countries
            .map(
              (c) =>
                `<path d="${path(fine.shapes.get(c.id))}" fill="${COPPER}" fill-opacity="${fillOpacity(c)}" stroke="${COPPER_BRIGHT}" stroke-opacity=".4" stroke-width=".6"/>`,
            )
            .join("")}
          ${slices.join("")}
          <line x1="${cx - R}" y1="${cy}" x2="${cx + R}" y2="${cy}" stroke="${BONE}" stroke-opacity=".08"/>
          <line x1="${cx}" y1="${cy - R}" x2="${cx}" y2="${cy + R}" stroke="${BONE}" stroke-opacity=".08"/>
        </g>
        ${rings.join("")}
        ${blips}
        ${callouts}
        ${homePin([cx, cy], 4)}
      </svg>
      <div class="copy">
        <div class="eyebrow">Range from Mansoura, Egypt</div>
        <h1>${lit} countries,<br>${fmt(kmTo(farthest))} km out.</h1>
        <p class="sub">${total} clients, each one measured<br>from the same desk.</p>
      </div>
      ${brand()}
    `,
  });
}

/** Two orthographic hemispheres, an atlas plate. */
function mapHemispheres() {
  const r = 154;
  const globes = [
    { cx: 1032, cy: 196, view: [-32, 28], caption: "Plate I · West" },
    { cx: 1372, cy: 196, view: [52, 24], caption: "Plate II · East" },
  ];
  const svg = globes
    .map(({ cx, cy, view, caption }, gi) => {
      const projection = geoOrthographic()
        .rotate([-view[0], -view[1]])
        .translate([cx, cy])
        .scale(r)
        .clipAngle(90)
        .precision(0.3);
      const path = geoPath(projection).digits(1);
      const visible = (p) => geoDistance(view, p) < Math.PI / 2 - 0.02;
      const ticks = [];
      for (let d = 0; d < 360; d += 5) {
        const a = (d * Math.PI) / 180;
        const long = d % 30 === 0;
        const r0 = r + 8;
        const r1 = r + (long ? 18 : d % 10 === 0 ? 13 : 11);
        ticks.push(
          `<line x1="${round(cx + Math.sin(a) * r0)}" y1="${round(cy - Math.cos(a) * r0)}" x2="${round(cx + Math.sin(a) * r1)}" y2="${round(cy - Math.cos(a) * r1)}" stroke="${BONE}" stroke-opacity="${long ? 0.38 : 0.18}"/>`,
        );
      }
      const flights = abroad
        .map(
          (c) =>
            `<path d="${path({ type: "LineString", coordinates: [HOME, [c.lon, c.lat]] }) ?? ""}" fill="none" stroke="${COPPER_BRIGHT}" stroke-opacity=".55" stroke-width="${round(0.9 + 1.2 * weight(c))}"/>`,
        )
        .join("");
      const dots = abroad
        .filter((c) => visible([c.lon, c.lat]))
        .map((c) => {
          const [x, y] = projection([c.lon, c.lat]);
          return `<circle cx="${round(x)}" cy="${round(y)}" r="2.4" fill="${BONE}"/>`;
        })
        .join("");
      return `
        <defs>
          <radialGradient id="sea${gi}" cx="${cx}" cy="${cy}" r="${r}" gradientUnits="userSpaceOnUse" fx="${cx - r * 0.3}" fy="${cy - r * 0.4}">
            <stop offset="0" stop-color="${INK_700}"/><stop offset="1" stop-color="${INK_800}"/>
          </radialGradient>
          <clipPath id="g${gi}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
        </defs>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#sea${gi})"/>
        <g clip-path="url(#g${gi})">
          <path d="${path(geoGraticule().step([15, 15])())}" fill="none" stroke="${BONE}" stroke-opacity=".06" stroke-width=".7"/>
          <path d="${path(fine.land)}" fill="${INK_600}" stroke="${BONE}" stroke-opacity=".1" stroke-width=".5"/>
          ${countries
            .map((c) => `<path d="${path(fine.shapes.get(c.id)) ?? ""}" fill="${COPPER}" fill-opacity="${fillOpacity(c)}" stroke="${COPPER_BRIGHT}" stroke-opacity=".45" stroke-width=".6"/>`)
            .join("")}
          ${flights}
          ${dots}
        </g>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${BONE}" stroke-opacity=".22"/>
        ${ticks.join("")}
        ${visible(HOME) ? homePin(projection(HOME), 3.4) : ""}
        <text x="${cx}" y="${cy + r + 38}" text-anchor="middle" class="cap">${caption.toUpperCase()}</text>`;
    })
    .join("");

  return page({
    css: `
      .copy { top: 60px; width: 470px; }
      h1 { margin-top: 18px; font-size: 54px; }
      .copy .sub { margin-top: 16px; }
      .cap { font: 500 12px "JetBrains Mono", monospace; letter-spacing: .16em; fill: ${bone(0.52)}; }
      .brand { top: auto; bottom: 40px; right: auto; left: ${LEFT}px; }
    `,
    body: `
      <svg class="layer" width="${W}" height="${H}">${svg}</svg>
      <div class="copy">
        <div class="eyebrow">Clients of the world</div>
        <h1>Two hemispheres.<br>${lit} countries.</h1>
        <p class="sub">${total} clients, and every line<br>leaves from Mansoura.</p>
      </div>
      ${brand()}
    `,
  });
}

/** A technical drawing: outlines, graticule, hatched clients, a dimension line. */
function mapBlueprint() {
  const box = { x: 764, y: 40, w: RIGHT - 764, h: 316 };
  const projection = frame(geoEquirectangular(), {
    lon: [-84, 84],
    lat: 31,
    x: [box.x, box.x + box.w],
    y: box.y + 150,
  });
  const path = geoPath(projection).digits(1);
  const home = projection(HOME);
  const [lonL, latT] = projection.invert([box.x, box.y]);
  const [lonR, latB] = projection.invert([box.x + box.w, box.y + box.h]);

  const ticks = [];
  for (let lon = Math.ceil(lonL / 10) * 10; lon <= lonR; lon += 10) {
    const [x] = projection([lon, 0]);
    const long = lon % 30 === 0;
    ticks.push(
      `<line x1="${round(x)}" y1="${box.y}" x2="${round(x)}" y2="${box.y - (long ? 8 : 4)}" class="tick"/>`,
      `<line x1="${round(x)}" y1="${box.y + box.h}" x2="${round(x)}" y2="${box.y + box.h + (long ? 8 : 4)}" class="tick"/>`,
    );
    if (long)
      ticks.push(
        `<text x="${round(x)}" y="${box.y + box.h + 22}" text-anchor="middle" class="deg">${Math.abs(lon)}°${lon < 0 ? "W" : lon > 0 ? "E" : ""}</text>`,
      );
  }
  for (let lat = Math.ceil(latB / 10) * 10; lat <= latT; lat += 10) {
    const [, y] = projection([0, lat]);
    ticks.push(
      `<line x1="${box.x + box.w}" y1="${round(y)}" x2="${box.x + box.w + (lat % 30 === 0 ? 8 : 4)}" y2="${round(y)}" class="tick"/>`,
    );
  }

  const far = projection([farthest.lon, farthest.lat]);
  const mid = [(home[0] + far[0]) / 2, (home[1] + far[1]) / 2];
  const angle = (Math.atan2(far[1] - home[1], far[0] - home[0]) * 180) / Math.PI + 180;

  const callouts = [
    { id: ranked[0].id, dx: 46, dy: 58 },
    { id: "EG", dx: -64, dy: 74, home: true },
    { id: "MA", dx: -40, dy: 50 },
    { id: "GB", dx: -46, dy: -14 },
    { id: "IN", dx: -14, dy: -46 },
  ]
    .map((call) => ({ ...call, c: countries.find((c) => c.id === call.id) }))
    .filter(({ c }) => c)
    .map(({ c, dx, dy }) => {
      const [x, y] = projection([c.lon, c.lat]);
      const tx = x + dx;
      const ty = y + dy;
      const end = dx < 0;
      return `<path d="M${round(x)} ${round(y)}L${round(tx)} ${round(ty - 4)}H${round(tx + (end ? -6 : 6))}" fill="none" stroke="${BONE}" stroke-opacity=".45"/>
        <circle cx="${round(x)}" cy="${round(y)}" r="2" fill="${BONE}"/>
        <text x="${round(tx + (end ? -10 : 10))}" y="${round(ty)}" text-anchor="${end ? "end" : "start"}" class="call">${c.id} · ${countOf(c)}</text>`;
    })
    .join("");

  return page({
    css: `
      .copy { top: 58px; width: 340px; }
      h1 { margin-top: 18px; font-size: 52px; }
      .spec { margin-top: 18px; font: 500 13px/1.75 "JetBrains Mono", monospace; letter-spacing: .1em;
        text-transform: uppercase; color: ${bone(0.62)}; }
      text { font-family: "JetBrains Mono", monospace; }
      .tick { stroke: ${BONE}; stroke-opacity: .38; }
      .deg { font-size: 11px; letter-spacing: .06em; fill: ${bone(0.38)}; }
      .call { font-size: 12px; font-weight: 500; letter-spacing: .1em; fill: ${bone(0.78)}; }
      .dim { font-size: 12px; font-weight: 500; letter-spacing: .1em; fill: ${BONE}; }
      .brand { top: auto; bottom: 40px; right: auto; left: ${LEFT}px; font-size: 19px; }
    `,
    body: `
      <svg class="layer" width="${W}" height="${H}">
        <defs>
          <clipPath id="sheet"><rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}"/></clipPath>
          <pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="${COPPER_BRIGHT}" stroke-opacity=".75" stroke-width="1.4"/>
          </pattern>
        </defs>
        <g clip-path="url(#sheet)">
          <path d="${path(geoGraticule().step([10, 10])())}" fill="none" stroke="${BONE}" stroke-opacity=".06"/>
          <path d="${path(geoGraticule().step([30, 30])())}" fill="none" stroke="${BONE}" stroke-opacity=".1"/>
          <path d="${path(fine.land)}" fill="none" stroke="${BONE}" stroke-opacity=".32" stroke-width=".7"/>
          ${countries
            .map((c) => `<path d="${path(fine.shapes.get(c.id))}" fill="url(#hatch)" stroke="${COPPER_BRIGHT}" stroke-width=".9"/>`)
            .join("")}
          <line x1="${box.x}" y1="${round(home[1])}" x2="${box.x + box.w}" y2="${round(home[1])}" stroke="${BONE}" stroke-opacity=".3" stroke-dasharray="2 4"/>
          <line x1="${round(home[0])}" y1="${box.y}" x2="${round(home[0])}" y2="${box.y + box.h}" stroke="${BONE}" stroke-opacity=".3" stroke-dasharray="2 4"/>
          <line x1="${round(home[0])}" y1="${round(home[1])}" x2="${round(far[0])}" y2="${round(far[1])}" stroke="${BONE}" stroke-opacity=".7" stroke-dasharray="6 4"/>
          <text transform="translate(${round(mid[0])} ${round(mid[1])}) rotate(${round(angle)})" y="-8" text-anchor="middle" class="dim">${fmt(kmTo(farthest))} KM TO ${farthest.name.toUpperCase()}</text>
          ${callouts}
          <circle cx="${round(home[0])}" cy="${round(home[1])}" r="7" fill="none" stroke="${JADE}" stroke-width="1.4"/>
          <circle cx="${round(home[0])}" cy="${round(home[1])}" r="2.6" fill="${JADE}"/>
        </g>
        <rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" fill="none" stroke="${BONE}" stroke-opacity=".38"/>
        ${ticks.join("")}
      </svg>
      <div class="copy">
        <div class="eyebrow">Fig. 1 · Client survey</div>
        <h1>${total} clients.<br>${lit} countries.</h1>
        <p class="spec">Origin ${HOME[1].toFixed(2)}°N ${HOME[0].toFixed(2)}°E<br>Mansoura, Egypt</p>
      </div>
      ${brand()}
    `,
  });
}

/** Every client country as a specimen tile; the biggest takes four slots. */
function mapSpecimens() {
  /** Drops overseas territories: Alaska, Hawaii, French Guiana. */
  const mainland = (shape, c) => {
    if (shape.geometry.type !== "MultiPolygon") return shape;
    const near = shape.geometry.coordinates.filter(
      (polygon) => geoDistance(geoCentroid({ type: "Polygon", coordinates: polygon }), [c.lon, c.lat]) < 0.35,
    );
    return { ...shape, geometry: { type: "MultiPolygon", coordinates: near } };
  };

  const rows = 2;
  const slots = countries.length - 1 + 4 + (unplacedTotal ? 1 : 0);
  const cols = Math.ceil(slots / rows);
  const gap = 10;
  const top = 96;
  const tileW = (RIGHT - LEFT - gap * (cols - 1)) / cols;
  const tileH = (H - 36 - top - gap) / rows;
  const at = (col, row, span = 1) => ({
    x: LEFT + col * (tileW + gap),
    y: top + row * (tileH + gap),
    w: tileW * span + gap * (span - 1),
    h: tileH * span + gap * (span - 1),
  });

  const tiles = [];
  let slot = 2; // the hero takes columns 0-1 of both rows
  const place = () => {
    const col = 2 + Math.floor((slot - 2) / rows);
    const row = (slot - 2) % rows;
    slot += 1;
    return at(col, row);
  };

  ranked.forEach((c, i) => {
    const t = i === 0 ? at(0, 0, 2) : place();
    const pad = i === 0 ? 30 : 12;
    const shape = mainland(fine.shapes.get(c.id), c);
    const projection = geoMercator().fitExtent(
      [
        [t.x + pad, t.y + (i === 0 ? 46 : 30)],
        [t.x + t.w - pad, t.y + t.h - (i === 0 ? 70 : 38)],
      ],
      shape,
    );
    const path = geoPath(projection).digits(1);
    tiles.push(`<rect x="${round(t.x)}" y="${round(t.y)}" width="${round(t.w)}" height="${round(t.h)}" rx="10" fill="${i === 0 ? INK_800 : "none"}" stroke="${BONE}" stroke-opacity=".1"/>
      <path d="${path(shape)}" fill="${i === 0 ? COPPER : BONE}" fill-opacity="${i === 0 ? 0.9 : 0.62}"/>
      <text x="${round(t.x + (i === 0 ? 22 : 10))}" y="${round(t.y + (i === 0 ? 30 : 20))}" class="${i === 0 ? "name" : "id"}">${i === 0 ? c.name.toUpperCase() : c.id}</text>
      <text x="${round(t.x + (i === 0 ? 22 : 10))}" y="${round(t.y + t.h - (i === 0 ? 22 : 12))}" class="${i === 0 ? "hero" : "n"}">${countOf(c)}</text>`);
  });
  if (unplacedTotal) {
    const t = place();
    tiles.push(`<rect x="${round(t.x + 0.5)}" y="${round(t.y + 0.5)}" width="${round(t.w - 1)}" height="${round(t.h - 1)}" rx="10" fill="none" stroke="${BONE}" stroke-opacity=".38" stroke-dasharray="4 4"/>
      <text x="${round(t.x + t.w / 2)}" y="${round(t.y + t.h / 2 + 8)}" text-anchor="middle" class="q">?</text>
      <text x="${round(t.x + 10)}" y="${round(t.y + 20)}" class="id">N/A</text>
      <text x="${round(t.x + 10)}" y="${round(t.y + t.h - 12)}" class="n">${unplacedTotal}</text>`);
  }

  return page({
    css: `
      .copy { top: 36px; display: flex; align-items: baseline; gap: 26px; }
      h1 { font-size: 40px; }
      text { font-family: "JetBrains Mono", monospace; }
      .id { font-size: 12px; font-weight: 500; letter-spacing: .12em; fill: ${bone(0.62)}; }
      .name { font-size: 13px; font-weight: 500; letter-spacing: .14em; fill: ${bone(0.78)}; }
      .n { font: 600 22px Archivo, sans-serif; letter-spacing: -.02em; fill: ${BONE}; }
      .hero { font: 600 64px Archivo, sans-serif; letter-spacing: -.05em; fill: ${COPPER_BRIGHT}; }
      .q { font: 600 30px Archivo, sans-serif; fill: ${bone(0.38)}; }
    `,
    body: `
      <svg class="layer" width="${W}" height="${H}">${tiles.join("")}</svg>
      <div class="copy">
        <h1>${lit} countries. ${total} clients.</h1>
        <div class="eyebrow">Specimens, not to scale</div>
      </div>
      ${brand()}
    `,
  });
}

// ───────────────────────────── run ─────────────────────────────

const STYLES = [
  { id: "numbers-1-headline", build: numbersHeadline },
  { id: "numbers-2-ledger", build: numbersLedger },
  { id: "numbers-3-marketplaces", build: numbersMarketplaces },
  { id: "numbers-4-tally", build: numbersTally },
  { id: "numbers-5-terminal", build: numbersTerminal },
  { id: "numbers-6-departures", build: numbersDepartures },
  { id: "map-1-routes", build: mapRoutes },
  { id: "map-2-halftone", build: mapHalftone },
  { id: "map-3-radar", build: mapRadar },
  { id: "map-4-hemispheres", build: mapHemispheres },
  { id: "map-5-blueprint", build: mapBlueprint },
  { id: "map-6-specimens", build: mapSpecimens },
];

/** All twelve, two columns, each with LinkedIn's profile photo drawn over it. */
function contactSheet() {
  const scale = 0.5;
  const card = (style) => `<figure>
      <div class="frame">
        <img src="${pathToFileURL(path.join(OUT, `${style.id}.png`)).href}" width="${W * scale}" height="${H * scale}">
        <span class="photo" style="left:${(PHOTO.cx - PHOTO.r) * scale}px;top:${(PHOTO.cy - PHOTO.r) * scale}px;width:${PHOTO.r * 2 * scale}px;height:${PHOTO.r * 2 * scale}px"></span>
      </div>
      <figcaption>${style.id}</figcaption>
    </figure>`;
  const column = (prefix) => STYLES.filter((s) => s.id.startsWith(prefix)).map(card).join("");
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${FONTS}">
<style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1712px; padding: 48px 48px 24px; background: ${INK_900}; color: ${BONE};
    font-family: Archivo, sans-serif; }
  h1 { font-size: 30px; font-weight: 600; letter-spacing: -.02em; }
  p { margin-top: 8px; font: 500 14px/1.4 "JetBrains Mono", monospace; color: ${bone(0.62)}; }
  .cols { margin-top: 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
  h2 { font: 500 14px/1 "JetBrains Mono", monospace; letter-spacing: .16em; text-transform: uppercase;
    color: ${bone(0.62)}; margin-bottom: 18px; }
  figure { margin-bottom: 26px; }
  .frame { position: relative; width: ${W * scale}px; height: ${H * scale + 48}px; overflow: hidden;
    border-radius: 10px; background: ${INK_700}; border: 1px solid ${bone(0.1)}; }
  img { display: block; }
  .photo { position: absolute; border-radius: 50%; background: ${INK_600};
    border: 3px solid ${INK_700}; outline: 1px dashed ${bone(0.38)}; }
  figcaption { margin-top: 10px; font: 500 13px/1 "JetBrains Mono", monospace; color: ${bone(0.7)}; }
</style></head><body>
  <h1>LinkedIn banners, ${STYLES.length} styles</h1>
  <p>${total} clients · ${lit} countries · ${platforms.length} marketplaces. The circle is where LinkedIn puts the profile photo on desktop.</p>
  <div class="cols">
    <section><h2>Client numbers</h2>${column("numbers")}</section>
    <section><h2>Client map</h2>${column("map")}</section>
  </div>
</body></html>`;
}

const { values } = parseArgs({ options: { only: { type: "string" } } });
const only = values.only?.split(",").map((s) => s.trim());
const picked = only ? STYLES.filter((s) => only.some((o) => s.id.startsWith(o))) : STYLES;
if (!picked.length) throw new Error(`No style matches --only=${values.only}`);

await mkdir(OUT, { recursive: true });
for (const style of picked) {
  const info = await shoot(style.build(), {
    width: W,
    height: H,
    file: path.join(OUT, `${style.id}.png`),
  });
  console.log(`${style.id.padEnd(24)} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB`);
}
if (!only) {
  const rowsPerColumn = Math.max(...["numbers", "map"].map((p) => STYLES.filter((s) => s.id.startsWith(p)).length));
  const height = Math.ceil(48 + 80 + 32 + rowsPerColumn * (H * 0.5 + 48 + 2 + 10 + 13 + 26) + 24);
  const info = await shoot(contactSheet(), {
    width: 1712,
    height,
    scale: 1,
    file: path.join(OUT, "contact-sheet.png"),
  });
  console.log(`${"contact-sheet".padEnd(24)} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB`);
}

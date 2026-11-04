/**
 * Composes the LinkedIn, Facebook and X profile banners from the client map.
 *
 * The site's headline is "World domination 10%", so the banner makes it literal:
 * the client map on a planet seen from orbit, with a loading ring around it that
 * has one tick per country in the world and one lit tick per client country. The
 * ring, the fills and the arcs all come from content/clients.json, so a new
 * client country moves the bar: `npm run banners`.
 *
 * Rendered by a local Chrome at 2x and downsampled, because the ring is hairlines
 * and it has to survive LinkedIn's scaling. The fonts load at render time only.
 * Outputs land in exports/social-banners/ (gitignored).
 *
 *   npm run banners
 */
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { geoGraticule, geoOrthographic, geoPath, geoRotation } from "d3-geo";
import { feature, merge } from "topojson-client";
import {
  ANTARCTICA,
  BONE,
  COPPER,
  COPPER_BRIGHT,
  FONTS,
  GRAIN,
  HOME,
  INK_600,
  INK_800,
  INK_900,
  JADE,
  MARK,
  WORLD_COUNTRIES,
  countOf,
  loadClients,
  round,
  shoot,
} from "./banners/kit.mjs";

const OUT = path.resolve("exports/social-banners");

const { countries, total: clientTotal, most, lit, percent } = await loadClients();
const topology = JSON.parse(await readFile("node_modules/world-atlas/countries-50m.json", "utf8"));
const geometries = topology.objects.countries.geometries.filter((g) => g.id !== ANTARCTICA);
const land = merge(topology, geometries);

/**
 * `view` is the point of the planet facing the camera, plus a roll. `ring.start`
 * is the clock angle of the first lit tick, 0 at twelve, running clockwise.
 */
const BANNERS = [
  {
    out: "linkedin-banner",
    width: 1584,
    height: 396,
    globe: { cx: 1262, cy: 706, r: 566, view: [46, -24], roll: -8 },
    ring: { start: -30, label: 19 },
    text: { left: 404, top: 58, headline: 70, sub: 25, eyebrow: 17, gap: 14 },
    brand: { right: 136, top: 26, size: 24 },
    eyebrow: "Flutter Developer · Mansoura, Egypt",
    sub: `${lit} of ${WORLD_COUNTRIES} countries lit. Yours could be ${lit + 1}.`,
  },
  {
    out: "x-header",
    width: 1500,
    height: 500,
    globe: { cx: 1120, cy: 812, r: 640, view: [44, -20], roll: -8 },
    ring: { start: -31, label: 20 },
    text: { left: 72, top: 76, headline: 84, sub: 28, eyebrow: 18, gap: 16 },
    brand: { right: 48, top: 70, size: 22 },
    eyebrow: "Mission status · Mansoura, Egypt",
    sub: `${lit} of ${WORLD_COUNTRIES} countries. ETA ${etaYear()}.`,
  },
  {
    out: "facebook-cover",
    width: 1640,
    height: 924,
    globe: { cx: 1372, cy: 1058, r: 800, view: [47, -13], roll: -8 },
    ring: { start: -30, label: 24 },
    text: { left: 110, top: 262, headline: 100, sub: 33, eyebrow: 21, gap: 22 },
    brand: { left: 110, top: 594, size: 24 },
    eyebrow: "Flutter Developer · Mansoura, Egypt",
    sub: `${clientTotal} clients. ${lit} countries. One desk.`,
  },
];

/** Countries per year so far, run forward. It is a joke, but it is arithmetic. */
function etaYear() {
  const yearsSoFar = 5;
  return new Date().getFullYear() + Math.ceil((WORLD_COUNTRIES - lit) / (lit / yearsSoFar));
}

const toXyz = ([lon, lat]) => {
  const l = (lon * Math.PI) / 180;
  const p = (lat * Math.PI) / 180;
  return [Math.cos(p) * Math.sin(l), Math.sin(p), Math.cos(p) * Math.cos(l)];
};

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** Great-circle interpolation between two unit vectors. */
function slerp(a, b, t) {
  const angle = Math.acos(Math.min(1, dot(a, b)));
  if (angle < 1e-6) return a;
  const s = Math.sin(angle);
  const ka = Math.sin((1 - t) * angle) / s;
  const kb = Math.sin(t * angle) / s;
  return [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb, a[2] * ka + b[2] * kb];
}

function planet({ cx, cy, r, view, roll }) {
  const rotate = [-view[0], -view[1], roll];
  const projection = geoOrthographic()
    .rotate(rotate)
    .scale(r)
    .translate([cx, cy])
    .clipAngle(90)
    .precision(0.3);
  const spin = geoRotation(rotate);

  /** Rotated into camera space, where z points out of the screen. */
  const camera = (xyz) => {
    const lon = Math.atan2(xyz[0], xyz[2]);
    const lat = Math.asin(Math.max(-1, Math.min(1, xyz[1])));
    const [l, p] = spin([(lon * 180) / Math.PI, (lat * 180) / Math.PI]);
    return toXyz([l, p]);
  };

  return { projection, path: geoPath(projection).digits(1), camera };
}

/**
 * A flight from Mansoura, drawn as one tapered ribbon rather than a stroke so it
 * can swell towards the client. It stops where it passes behind the planet, so
 * the far clients read as lines leaving over the horizon.
 */
function arcRibbon(globe, target, weight, id) {
  const { camera } = planet(globe);
  const from = toXyz(HOME);
  const to = toXyz(target);
  const distance = Math.acos(Math.min(1, dot(from, to)));
  const lift = 0.19 * Math.sqrt(distance / Math.PI);
  const steps = 120;
  const points = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const p = camera(slerp(from, to, t));
    const k = 1 + lift * Math.sin(Math.PI * t);
    const x = p[0] * k;
    const y = p[1] * k;
    if (p[2] < 0 && Math.hypot(x, y) < 1) break;
    points.push({ x: globe.cx + globe.r * x, y: globe.cy - globe.r * y, t });
  }
  if (points.length < 3) return { defs: "", shape: "" };

  const unit = globe.r / 600;
  const edge = (side) =>
    points.map((point, i) => {
      const a = points[Math.max(0, i - 1)];
      const b = points[Math.min(points.length - 1, i + 1)];
      const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
      const half = unit * (0.3 + point.t * 0.75) * (0.75 + weight * 0.95);
      return `${round(point.x - (side * half * (b.y - a.y)) / length)} ${round(point.y + (side * half * (b.x - a.x)) / length)}`;
    });

  const head = points[0];
  const tail = points[points.length - 1];
  return {
    defs: `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${round(head.x)}" y1="${round(head.y)}" x2="${round(tail.x)}" y2="${round(tail.y)}">
      <stop offset="0" stop-color="${COPPER}" stop-opacity=".3"/>
      <stop offset=".55" stop-color="${COPPER}" stop-opacity=".62"/>
      <stop offset="1" stop-color="${COPPER_BRIGHT}"/>
    </linearGradient>`,
    shape: `<path d="M${edge(1).join("L")}L${edge(-1).reverse().join("L")}Z" fill="url(#${id})"/>`,
  };
}

function ring({ cx, cy, r }, { start, label }) {
  const inner = r + r * 0.03;
  const step = 360 / WORLD_COUNTRIES;
  const ticks = [];
  for (let i = 0; i < WORLD_COUNTRIES; i += 1) {
    const on = i < lit;
    const angle = ((start + i * step) * Math.PI) / 180;
    const length = on ? r * 0.034 : r * 0.016;
    const x1 = cx + Math.sin(angle) * inner;
    const y1 = cy - Math.cos(angle) * inner;
    const x2 = cx + Math.sin(angle) * (inner + length);
    const y2 = cy - Math.cos(angle) * (inner + length);
    ticks.push(
      `<line x1="${round(x1)}" y1="${round(y1)}" x2="${round(x2)}" y2="${round(y2)}" stroke="${on ? COPPER_BRIGHT : BONE}" stroke-opacity="${on ? 1 : 0.2}" stroke-width="${on ? 3 : 1.25}"/>`,
    );
  }
  const last = ((start + (lit - 1) * step) * Math.PI) / 180;
  const reach = inner + r * 0.034 + label * 0.6;
  const x = cx + Math.sin(last) * reach;
  const y = cy - Math.cos(last) * reach;
  return `${ticks.join("")}<text x="${round(x)}" y="${round(y)}" fill="${COPPER_BRIGHT}"
    font-family="JetBrains Mono, monospace" font-weight="500" font-size="${label}"
    letter-spacing="${label * 0.04}">${lit}/${WORLD_COUNTRIES}</text>`;
}

/** An arc of the limb, for the sunrise that sits behind the lit ticks. */
function limbArc({ cx, cy, r }, from, to) {
  const point = (deg) => {
    const a = (deg * Math.PI) / 180;
    return `${round(cx + Math.sin(a) * r)} ${round(cy - Math.cos(a) * r)}`;
  };
  const large = to - from > 180 ? 1 : 0;
  return `M${point(from)}A${r} ${r} 0 ${large} 1 ${point(to)}`;
}

function scene(banner) {
  const { width, height, globe, ring: ringSpec } = banner;
  const { path, projection, camera } = planet(globe);
  const { cx, cy, r } = globe;
  const litSweep = (lit / WORLD_COUNTRIES) * 360;

  const graticule = path(geoGraticule().step([15, 15])());
  const countryShapes = countries
    .map((country) => {
      const geometry = geometries.find((g) => g.id === country.iso);
      const weight = Math.log(countOf(country) + 1) / Math.log(most + 1);
      return `<path d="${path(feature(topology, geometry))}" fill="${COPPER}" fill-opacity="${round(0.26 + 0.5 * weight)}" stroke="${COPPER_BRIGHT}" stroke-opacity=".5" stroke-width=".8"/>`;
    })
    .join("");

  const flights = countries
    .filter((country) => country.id !== "EG")
    .sort((a, b) => countOf(a) - countOf(b))
    .map((country) => {
      const weight = Math.log(countOf(country) + 1) / Math.log(most + 1);
      return arcRibbon(globe, [country.lon, country.lat], weight, `flight-${country.id}`);
    });

  // Skips the far side: d3 projects a point there straight through the planet.
  const dots = countries
    .filter((country) => country.id !== "EG" && camera(toXyz([country.lon, country.lat]))[2] > 0)
    .map((country) => {
      const [x, y] = projection([country.lon, country.lat]);
      return `<circle cx="${round(x)}" cy="${round(y)}" r="${round(r * 0.0044)}" fill="${BONE}"/>`;
    })
    .join("");

  const [homeX, homeY] = projection(HOME);
  const pin = r * 0.0085;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <radialGradient id="sea" cx="${cx}" cy="${cy}" r="${r}" gradientUnits="userSpaceOnUse"
      fx="${cx - r * 0.2}" fy="${cy - r * 0.55}">
      <stop offset="0" stop-color="#17171D"/>
      <stop offset=".7" stop-color="${INK_800}"/>
      <stop offset="1" stop-color="${INK_900}"/>
    </radialGradient>
    <radialGradient id="halo" cx="${cx}" cy="${cy}" r="${r * 1.32}" gradientUnits="userSpaceOnUse">
      <stop offset=".74" stop-color="${COPPER}" stop-opacity="0"/>
      <stop offset=".757" stop-color="${COPPER}" stop-opacity=".2"/>
      <stop offset=".81" stop-color="${COPPER}" stop-opacity=".05"/>
      <stop offset="1" stop-color="${COPPER}" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="disc"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
    <linearGradient id="night" gradientUnits="userSpaceOnUse" x1="${cx - r * 0.9}" y1="${cy}" x2="${cx + r * 0.1}" y2="${cy - r}">
      <stop offset="0" stop-color="${INK_900}" stop-opacity=".92"/>
      <stop offset=".62" stop-color="${INK_900}" stop-opacity=".2"/>
      <stop offset="1" stop-color="${INK_900}" stop-opacity="0"/>
    </linearGradient>
    <filter id="soft" filterUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}"><feGaussianBlur stdDeviation="${r * 0.05}"/></filter>
    <filter id="softer" filterUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}"><feGaussianBlur stdDeviation="${r * 0.012}"/></filter>
    ${flights.map((flight) => flight.defs).join("")}
  </defs>
  <rect width="${width}" height="${height}" fill="${INK_900}"/>

  <circle cx="${cx}" cy="${cy}" r="${r * 1.32}" fill="url(#halo)"/>
  <path d="${limbArc(globe, ringSpec.start - 8, ringSpec.start + litSweep + 8)}" fill="none"
    stroke="${COPPER}" stroke-width="${r * 0.11}" stroke-opacity=".5" filter="url(#soft)"/>

  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#sea)"/>
  <g clip-path="url(#disc)">
    <path d="${graticule}" fill="none" stroke="${BONE}" stroke-opacity=".035" stroke-width=".8"/>
    <path d="${path(land)}" fill="${INK_600}" stroke="${BONE}" stroke-opacity=".1" stroke-width=".6"/>
    ${countryShapes}
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#night)"/>
  </g>
  <path d="${limbArc(globe, ringSpec.start - 3, ringSpec.start + litSweep + 3)}" fill="none"
    stroke="${COPPER_BRIGHT}" stroke-width="${r * 0.012}" stroke-opacity=".85" filter="url(#softer)"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${BONE}" stroke-opacity=".16" stroke-width="1"/>

  ${ring(globe, ringSpec)}

  ${flights.map((flight) => flight.shape).join("")}
  ${dots}

  <circle cx="${round(homeX)}" cy="${round(homeY)}" r="${round(pin * 3)}" fill="${JADE}" fill-opacity=".18"/>
  <circle cx="${round(homeX)}" cy="${round(homeY)}" r="${round(pin * 1.9)}" fill="none" stroke="${JADE}" stroke-opacity=".6" stroke-width="1.2"/>
  <circle cx="${round(homeX)}" cy="${round(homeY)}" r="${round(pin)}" fill="${JADE}"/>
</svg>`;
}

function html(banner) {
  const { width, height, text, brand } = banner;
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${FONTS}">
<style>
  * { box-sizing: border-box; margin: 0; }
  html, body { width: ${width}px; height: ${height}px; overflow: hidden; background: ${INK_900}; }
  body { position: relative; color: ${BONE}; font-family: Archivo, sans-serif; }
  svg { position: absolute; inset: 0; display: block; }
  .copy { position: absolute; left: ${text.left}px; top: ${text.top}px; }
  .eyebrow { font: 500 ${text.eyebrow}px/1 "JetBrains Mono", monospace; letter-spacing: .16em;
    text-transform: uppercase; color: rgb(242 238 231 / .62); }
  h1 { margin-top: ${text.gap}px; font-size: ${text.headline}px; line-height: 1; font-weight: 600;
    letter-spacing: -.035em; white-space: nowrap; }
  h1 b { font-weight: 600; color: ${COPPER_BRIGHT}; font-variant-numeric: tabular-nums; }
  p { margin-top: ${text.gap}px; font-size: ${text.sub}px; line-height: 1.25; font-weight: 500;
    letter-spacing: -.01em; color: rgb(242 238 231 / .78); white-space: nowrap; }
  .brand { position: absolute; display: flex; align-items: center; gap: .55em;
    ${"left" in brand ? `left: ${brand.left}px` : `right: ${brand.right}px`}; top: ${brand.top}px;
    font: 500 ${brand.size}px/1 "JetBrains Mono", monospace; letter-spacing: .02em;
    color: rgb(242 238 231 / .78); }
  .brand svg { position: static; }
  .grain { position: absolute; inset: 0; opacity: .07; mix-blend-mode: overlay; }
</style></head><body>
  ${scene(banner)}
  <div class="copy">
    <div class="eyebrow">${banner.eyebrow}</div>
    <h1>World<br>domination <b>${percent}%</b></h1>
    <p>${banner.sub}</p>
  </div>
  <div class="brand">${MARK(brand.size * 1.35)}mormdn.com</div>
  ${GRAIN(width, height)}
</body></html>`;
}

async function render(banner) {
  const info = await shoot(html(banner), {
    width: banner.width,
    height: banner.height,
    file: path.join(OUT, `${banner.out}.png`),
  });
  console.log(
    `${banner.out.padEnd(18)} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB`,
  );
}

await mkdir(OUT, { recursive: true });
for (const banner of BANNERS) {
  await render(banner);
}

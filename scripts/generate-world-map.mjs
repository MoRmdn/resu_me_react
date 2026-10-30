// Draws the client map from Natural Earth (public domain) via world-atlas.
// Run at author time, `npm run map`, when content/clients.json gains a country.
//
// The land is a separate cached image rather than inline SVG: it is the bulk of
// the data and never changes, and inline it would ship twice, once in the HTML
// and once in the RSC payload. Only the client countries are inlined.
import { readFile, writeFile } from "node:fs/promises";
import { geoDistance, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature, merge } from "topojson-client";

const WIDTH = 1000;
/** Mansoura. Lines start here. */
const HOME = [31.38, 31.04];
const LAND = "#1E1E24";
const LAND_EDGE = "rgba(242,238,231,0.07)";
const ANTARCTICA = "010";
/** How far a line bows, as a share of its length. */
const BOW = 0.22;

const { countries } = JSON.parse(await readFile("content/clients.json", "utf8"));
const topology = JSON.parse(await readFile("node_modules/world-atlas/countries-110m.json", "utf8"));
const geometries = topology.objects.countries.geometries.filter((g) => g.id !== ANTARCTICA);

const land = merge(topology, geometries);
const projection = geoNaturalEarth1().fitWidth(WIDTH, land);
const path = geoPath(projection).digits(1);

const [, [, bottom]] = path.bounds(land);
const HEIGHT = Math.ceil(bottom);

const round = (n) => Math.round(n * 10) / 10;

const [homeX, homeY] = projection(HOME).map(round);

function arcTo([x, y]) {
  const dx = x - homeX;
  const dy = y - homeY;
  // Perpendicular to the chord, always bowing up so lines read as flights.
  const sign = dx >= 0 ? 1 : -1;
  const cx = (homeX + x) / 2 + dy * BOW * sign;
  const cy = (homeY + y) / 2 - Math.abs(dx) * BOW - Math.abs(dy) * 0.04;
  return `M${homeX} ${homeY}Q${round(cx)} ${round(cy)} ${x} ${y}`;
}

const placed = countries
  .map((country) => {
    const geometry = geometries.find((g) => g.id === country.iso);
    if (!geometry) throw new Error(`No map shape for ${country.name} (${country.iso})`);
    const [x, y] = projection([country.lon, country.lat]).map(round);
    return {
      id: country.id,
      x,
      y,
      path: path(feature(topology, geometry)),
      // Egypt is home: it is filled, but no line leaves for it.
      arc: country.id === "EG" ? null : arcTo([x, y]),
    };
  });

// Nearest first, so the lines spread outward from Mansoura.
const byDistance = (id) => {
  const { lon, lat } = countries.find((c) => c.id === id);
  return geoDistance(HOME, [lon, lat]);
};
placed.sort((a, b) => byDistance(a.id) - byDistance(b.id));
placed.forEach((country, order) => {
  country.order = order;
});

await writeFile(
  "public/images/world-land.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}"><path fill="${LAND}" stroke="${LAND_EDGE}" stroke-width=".5" d="${path(land)}"/></svg>\n`,
);
await writeFile(
  "content/world-map.json",
  `${JSON.stringify({ width: WIDTH, height: HEIGHT, home: { x: homeX, y: homeY }, countries: placed }, null, 2)}\n`,
);

console.log(`${placed.length} countries, ${WIDTH}x${HEIGHT}`);

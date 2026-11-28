// Renders the 1200x630 share cards from the brand tokens: public/og.png for
// English pages and public/og-ar.png for Arabic ones. This is the preview
// WhatsApp, X and LinkedIn show when a link is forwarded, so it says what a
// client gets, not a CV line.
//
// Run at author time (`npm run og`); the PNGs are committed to public/. The
// numbers are read from content/, so run it again when reviews or clients change.
import { readFileSync } from "node:fs";
import sharp from "sharp";

const INK = "#0A0A0C";
const INK_700 = "#16161B";
const BONE = "#F2EEE7";
const COPPER = "#F2762E";
const LINE = "rgba(242,238,231,0.10)";

// The same totals the hero shows: reviewTotal and clientCountries.length.
const reviewsSource = readFileSync("content/reviews.ts", "utf8");
const platformCounts = [...reviewsSource.matchAll(/^\s+count: (\d+),$/gm)].map((m) => Number(m[1]));
const reviews = platformCounts.reduce((sum, n) => sum + n, 0);
const platforms = platformCounts.length;
const countries = JSON.parse(readFileSync("content/clients.json", "utf8")).countries.length;
if (!reviews || !platforms || !countries) throw new Error("Could not read the totals from content/");

const LATIN = "Archivo, Helvetica, Arial, sans-serif";
const MONO = "JetBrains Mono, Menlo, monospace";
const ARABIC = "IBM Plex Sans Arabic, Geeza Pro, Arial, sans-serif";

const mark = (x, y, scale) => `
  <g transform="translate(${x},${y}) scale(${scale})" stroke-width="4.4"
     stroke-linecap="square" stroke-linejoin="miter" fill="none">
    <path d="M6 39 L17 9 L24 26 L31 9 L42 39" stroke="${BONE}"/>
    <path d="M24 26 L31 9 L42 39" stroke="${COPPER}"/>
  </g>`;

const cards = {
  en: {
    file: "public/og.png",
    headline: ["Mobile apps, dashboards", "and internal systems"],
    sub: "Built Arabic-first · Mohamed Ramadan",
    stats: [`${reviews} REVIEWS AND JOBS`, `${platforms} MARKETPLACES`, `CLIENTS IN ${countries} COUNTRIES`],
  },
  ar: {
    file: "public/og-ar.png",
    headline: ["تطبيقات جوال ولوحات تحكم", "وأنظمة داخلية"],
    sub: "بالعربية أولًا · محمد رمضان",
    stats: [`${reviews} تقييمًا وعملًا`, `${platforms} منصات`, `عملاء في ${countries} دولة`],
  },
};

function card(locale) {
  const { headline, sub, stats } = cards[locale];
  const rtl = locale === "ar";
  // Arabic sets from the right edge; Latin from the left.
  const x = rtl ? 1128 : 72;
  // With direction="rtl" the start edge is the right one, so "start" anchors
  // the line at x and lets it run leftwards.
  const anchor = rtl ? 'direction="rtl" text-anchor="start"' : "";
  const family = rtl ? ARABIC : LATIN;
  const size = rtl ? 78 : 80;
  const spacing = rtl ? "0" : "-3";
  const statFamily = rtl ? ARABIC : MONO;
  const statAttrs = rtl ? 'font-size="26"' : 'font-size="21" letter-spacing="3.2"';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${INK}"/>
  <rect x="72" y="150" width="1056" height="1" fill="${LINE}"/>
  ${mark(72, 64, 1.15)}
  <text x="140" y="103" fill="${BONE}" font-family="${LATIN}"
        font-size="30" font-weight="600" letter-spacing="-0.9">MoRmdn</text>
  <text x="1128" y="103" text-anchor="end" fill="${COPPER}" font-family="${MONO}"
        font-size="21" letter-spacing="2">mormdn.com</text>

  <text x="${x}" y="262" ${anchor} fill="${BONE}" font-family="${family}"
        font-size="${size}" font-weight="600" letter-spacing="${spacing}">${headline[0]}</text>
  <text x="${x}" y="352" ${anchor} fill="${BONE}" font-family="${family}"
        font-size="${size}" font-weight="600" letter-spacing="${spacing}">${headline[1]}</text>
  <text x="${x}" y="418" ${anchor} fill="${BONE}" font-family="${family}"
        font-size="34" font-weight="500" opacity="0.7">${sub}</text>

  <rect x="72" y="470" width="1056" height="1" fill="${LINE}"/>
  ${stats
    .map(
      (stat, i) =>
        `<text x="${x}" y="${522 + i * 38}" ${anchor} fill="${BONE}" font-family="${statFamily}" ${statAttrs} opacity="${i === 0 ? 0.9 : 0.55}">${stat}</text>`,
    )
    .join("\n  ")}

  <rect x="${rtl ? 72 : 1040}" y="494" width="88" height="88" rx="19" fill="${INK_700}" stroke="${LINE}"/>
  ${mark(rtl ? 92 : 1060, 514, 1)}
</svg>`;
}

for (const locale of Object.keys(cards)) {
  await sharp(Buffer.from(card(locale))).png().toFile(cards[locale].file);
  console.log(`wrote ${cards[locale].file}`);
}

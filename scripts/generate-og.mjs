// Renders the 1200x630 Open Graph card from the brand tokens.
// Run at author time; the PNG is committed to public/.
import sharp from "sharp";

const INK = "#0A0A0C";
const INK_700 = "#16161B";
const BONE = "#F2EEE7";
const COPPER = "#F2762E";
const LINE = "rgba(242,238,231,0.10)";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${INK}"/>
  <rect x="72" y="150" width="1056" height="1" fill="${LINE}"/>

  <g transform="translate(72,64) scale(1.15)" stroke-width="4.4"
     stroke-linecap="square" stroke-linejoin="miter" fill="none">
    <path d="M6 39 L17 9 L24 26 L31 9 L42 39" stroke="${BONE}"/>
    <path d="M24 26 L31 9 L42 39" stroke="${COPPER}"/>
  </g>
  <text x="140" y="103" fill="${BONE}" font-family="Archivo, Helvetica, sans-serif"
        font-size="30" font-weight="600" letter-spacing="-0.9">MoRmdn</text>

  <text x="72" y="290" fill="${BONE}" font-family="Archivo, Helvetica, sans-serif"
        font-size="92" font-weight="600" letter-spacing="-3.6">Mohamed Ramadan</text>
  <text x="72" y="372" fill="${BONE}" font-family="Archivo, Helvetica, sans-serif"
        font-size="44" font-weight="500" letter-spacing="-1.2" opacity="0.7">Flutter Developer</text>

  <rect x="72" y="430" width="1056" height="1" fill="${LINE}"/>

  <g font-family="JetBrains Mono, monospace" font-size="21" letter-spacing="3.2" fill="${BONE}" opacity="0.45">
    <text x="72" y="490">5 YEARS</text>
    <text x="262" y="490">7 TEAMS</text>
    <text x="452" y="490">6 COUNTRIES</text>
  </g>
  <text x="72" y="556" fill="${COPPER}" font-family="JetBrains Mono, monospace"
        font-size="21" letter-spacing="3.2">FLUTTER · DART · BLOC · FIREBASE</text>

  <rect x="1040" y="470" width="88" height="88" rx="19" fill="${INK_700}" stroke="${LINE}"/>
  <g transform="translate(1060,490)" stroke-width="4.4" stroke-linecap="square"
     stroke-linejoin="miter" fill="none">
    <path d="M6 39 L17 9 L24 26 L31 9 L42 39" stroke="${BONE}"/>
    <path d="M24 26 L31 9 L42 39" stroke="${COPPER}"/>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile("public/og.png");
console.log("wrote public/og.png");

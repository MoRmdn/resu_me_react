// Packages the review cards for reuse outside this site: PNGs, a self-contained
// animated page, the logos, the data and the React component.
//
// Run at author time, after a build: `npm run export:reviews`. The card markup
// is lifted from out/index.html and the styles from the marked block in
// globals.css, so the bundle can only ever match what the site renders.
import { execFile } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import sharp from "sharp";

const run = promisify(execFile);

const OUT = "exports/review-cards";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const FONTS =
  "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&family=IBM+Plex+Sans+Arabic:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap";
const BRAND = {
  upwork: "#14a800",
  fiverr: "#1dbf73",
  freelancer: "#29b2fe",
  mostaql: "#2f9be0",
  khamsat: "#fdb128",
};

const globals = await readFile("app/globals.css", "utf8");
const html = await readFile("out/index.html", "utf8");
const reviews = JSON.parse(await readFile("content/reviews.json", "utf8"));
const marks = JSON.parse(await readFile("content/platform-marks.json", "utf8"));

/* -- CSS: the marked block, the marquee it leans on, and only the tokens used. */
const between = (start, end) => {
  const from = globals.indexOf(start);
  const to = globals.indexOf(end, from);
  if (from < 0 || to < 0) throw new Error(`globals.css: cannot find ${start}`);
  return globals.slice(from, to).trim();
};

const cardCss = between("/* review-cards:start */", "/* review-cards:end */")
  .replace("/* review-cards:start */", "")
  .trim();
const marqueeCss = between("@keyframes marquee-scroll", '/* Slow pulse for the "open to work"');

const SKIP = new Set(["--review-brand", "--star", "--font-sans", "--font-mono", "--marquee-duration"]);
const used = new Set(`${cardCss}\n${marqueeCss}`.match(/--[a-z0-9-]+/g));
const tokens = [...used]
  .filter((name) => !SKIP.has(name))
  .map((name) => {
    const found = globals.match(new RegExp(`^\\s*${name}:\\s*([^;]+);`, "m"));
    return found ? `  ${name}: ${found[1].trim()};` : null;
  })
  .filter(Boolean);

const css = `/* Review cards. Copy this file; every colour and curve is a variable below. */
:root {
${tokens.join("\n")}
  --font-sans: "Archivo", "IBM Plex Sans Arabic", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}

${marqueeCss}

${cardCss}
`;

/* -- Markup: the real, non-duplicated track of each row. */
const rows = [...html.matchAll(/<ul class="review-list">([\s\S]*?)<\/ul>/g)].map((m) =>
  [...m[1].matchAll(/<li class="review-slot">([\s\S]*?)<\/li>/g)].map((c) => c[1]),
);
const cards = rows.flat();
if (cards.length !== reviews.length) {
  throw new Error(`Found ${cards.length} cards in out/index.html, expected ${reviews.length}. Build first.`);
}

const track = (items) => {
  const list = items.map((card) => `<li class="review-slot">${card}</li>`).join("");
  return `<div class="marquee-track"><ul class="review-list">${list}</ul><ul class="review-list" aria-hidden="true" inert>${list}</ul></div>`;
};

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Review cards</title>
<link rel="stylesheet" href="${FONTS.replaceAll("&", "&amp;")}">
<style>
${css}
  body { margin: 0; padding: 48px 0; background: var(--color-ink-900); overflow-x: hidden; }
  .controls { display: flex; justify-content: center; margin-top: 24px; }
  .controls button { padding: 10px 16px; border: 1px solid var(--color-line); border-radius: 10px; background: none; color: var(--color-bone-70); font: 13px var(--font-sans); cursor: pointer; }
</style>
</head>
<body>
<main id="wall" class="review-wall">
  <div class="marquee review-row" style="--marquee-duration: 260s">${track(rows[0])}</div>
  <div class="marquee review-row" data-direction="reverse" style="--marquee-duration: 300s">${track(rows[1])}</div>
</main>
<div class="controls"><button type="button" class="marquee-toggle" aria-pressed="false">Pause</button></div>
<script>
  const button = document.querySelector(".marquee-toggle");
  button.addEventListener("click", () => {
    const paused = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(paused));
    button.textContent = paused ? "Play" : "Pause";
    document.getElementById("wall").dataset.marqueePaused = String(paused);
  });
</script>
</body>
</html>
`;

/* -- React: the site's own files, with the imports made relative. */
const portable = (source) =>
  source
    .replaceAll("@/components/brand/PlatformMark", "./PlatformMark")
    .replaceAll("@/content/platform-marks.json", "./platform-marks.json")
    .replaceAll("@/content/reviews", "./reviews");

await rm(OUT, { recursive: true, force: true });
await mkdir(join(OUT, "png"), { recursive: true });
await mkdir(join(OUT, "logos"), { recursive: true });
await mkdir(join(OUT, "react"), { recursive: true });

await writeFile(join(OUT, "review-cards.css"), css);
await writeFile(join(OUT, "review-cards.html"), page);
await cp("content/reviews.json", join(OUT, "reviews.json"));

await cp("content/reviews.json", join(OUT, "react/reviews.json"));
await cp("content/platform-marks.json", join(OUT, "react/platform-marks.json"));
await writeFile(join(OUT, "react/review-cards.css"), css);
await writeFile(join(OUT, "react/reviews.ts"), await readFile("content/reviews.ts", "utf8"));
for (const [from, to] of [
  ["components/ui/ReviewCard.tsx", "ReviewCard.tsx"],
  ["components/brand/PlatformMark.tsx", "PlatformMark.tsx"],
]) {
  await writeFile(join(OUT, "react", to), portable(await readFile(from, "utf8")));
}

for (const [id, mark] of Object.entries(marks)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${mark.viewBox}" fill="${BRAND[id]}" color="${BRAND[id]}">${mark.markup}</svg>\n`;
  await writeFile(join(OUT, "logos", `${id}.svg`), svg);
}

await writeFile(
  join(OUT, "README.md"),
  `# Review cards

${reviews.length} client reviews as reusable cards.

| | |
|---|---|
| \`review-cards.html\` | Open it: the two animated rows, hover states and a pause button. |
| \`review-cards.css\` | Every style and animation, with its tokens at the top. |
| \`png/\` | One transparent PNG per card at 2x, for slides, posts and proposals. |
| \`logos/\` | The five marketplace marks as SVG. |
| \`reviews.json\` | The data: quote, translation, author, project, date. |
| \`react/\` | \`ReviewCard\` and everything it imports. |

## Use in another React project

Copy \`react/\` in, import \`review-cards.css\` once, then:

\`\`\`tsx
import { ReviewCard } from "./react/ReviewCard";
import { reviews } from "./react/reviews";

{reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
\`\`\`

Load Archivo, IBM Plex Sans Arabic and JetBrains Mono, or change \`--font-sans\`
and \`--font-mono\` at the top of the CSS. To change the look, change the
variables; the cards inherit them.

Quotes are verbatim. Keep them that way: a review you edit is a review nobody
wrote.
`,
);

/* -- PNGs: each card alone on a transparent page, rendered by real Chrome so
      Arabic shapes properly, then trimmed to the card's edge. */
const temp = await mkdtemp(join(tmpdir(), "review-cards-"));
const queue = reviews.map((review, i) => ({ review, i }));

async function renderNext(worker) {
  for (let job = queue.shift(); job; job = queue.shift()) {
    const { review, i } = job;
    const card = cards.find((c) => c.includes(`data-review="${review.id}"`));
    const source = join(temp, `${review.id}.html`);
    const shot = join(temp, `${review.id}.png`);
    await writeFile(
      source,
      `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${FONTS.replaceAll("&", "&amp;")}"><style>${css}
       html, body { margin: 0; background: transparent; }
       body { padding: 24px; width: max-content; }</style></head><body>${card}</body></html>`,
    );
    await run(CHROME, [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=2",
      "--default-background-color=00000000",
      "--window-size=1000,900",
      "--virtual-time-budget=5000",
      `--user-data-dir=${join(temp, `profile-${worker}`)}`,
      `--screenshot=${shot}`,
      `file://${source}`,
    ]);
    const name = `${String(i + 1).padStart(2, "0")}-${review.id}.png`;
    await sharp(shot).trim().png({ compressionLevel: 9 }).toFile(join(OUT, "png", name));
  }
}

await Promise.all([0, 1, 2, 3].map(renderNext));
await rm(temp, { recursive: true, force: true });

console.log(`${reviews.length} cards exported to ${OUT}`);

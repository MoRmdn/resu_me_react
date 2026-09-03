/**
 * Generates responsive AVIF/WebP display variants from the committed masters.
 *
 * Static export has no image-optimisation server, so this runs at author time
 * and the components reference the output through <picture>.
 *
 *   npm run images
 */
import { readdir, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const MASTERS = "assets/projects";
const OUT = "public/images/projects";

/**
 * Render widths per role, from DESIGN-SYSTEM §5.2: the CSS width and a 2x for
 * retina. Nothing on the page renders wider than 280 CSS pixels, so a 3x
 * variant is pure weight for no visible gain.
 */
const ROLES = [
  [/-icon$/, [64, 128]], // 96px tile, source inset at 64px
  [/-shot$/, [240, 480]], // device plate, ~230-240px
  [/-promo$/, [280, 560]], // promo plate, 240-280px
  [/-social-\d$/, [300, 600]], // 1:1 strip
];

function widthsFor(slug, sourceWidth) {
  const widths = ROLES.find(([re]) => re.test(slug))?.[1] ?? [240, 480];
  const usable = widths.filter((w) => w <= sourceWidth);
  // A source narrower than its role's 1x (Saber Yamen and O'Permis are both
  // 288px) would otherwise emit nothing at all. Fall back to native width.
  return usable.length ? usable : [sourceWidth];
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const masters = (await readdir(MASTERS)).filter((f) => f.endsWith(".webp")).sort();
let total = 0;
let largest = { size: 0, name: "" };
/** slug -> the widths that actually exist on disk. */
const manifest = {};

for (const file of masters) {
  const slug = path.basename(file, ".webp");
  const input = path.join(MASTERS, file);
  const meta = await sharp(input).metadata();
  await mkdir(path.join(OUT, slug), { recursive: true });

  const made = [];
  const emitted = [];
  for (const w of widthsFor(slug, meta.width ?? 480)) {
    emitted.push(w);
    const base = path.join(OUT, slug, `${slug}-${w}`);
    const resized = sharp(input).resize({ width: w, withoutEnlargement: true });
    for (const [fmt, opts] of [
      ["avif", { quality: 52 }],
      ["webp", { quality: 78 }],
    ]) {
      const info = await resized.clone()[fmt](opts).toFile(`${base}.${fmt}`);
      total += info.size;
      if (info.size > largest.size) largest = { size: info.size, name: `${slug}-${w}.${fmt}` };
      made.push(`${w}${fmt === "avif" ? "a" : "w"}:${(info.size / 1024).toFixed(0)}K`);
    }
  }
  manifest[slug] = emitted;
  console.log(`${slug.padEnd(22)} ${meta.width}x${meta.height}  ${made.join("  ")}`);
}

// Published so the components use the widths that exist rather than the widths
// a role would like. A source narrower than its 1x (Saber Yamen and O'Permis
// are both 288px) emits fewer, and a srcset naming a file that was never
// written is a broken image.
await writeFile(
  "content/media-manifest.json",
  JSON.stringify(manifest, Object.keys(manifest).sort(), 2) + "\n",
);

console.log(`\n${masters.length} masters -> ${(total / 1024).toFixed(0)} KB of variants`);
console.log(`largest single file: ${largest.name} at ${(largest.size / 1024).toFixed(0)} KB`);

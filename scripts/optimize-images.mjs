// Pre-generates responsive AVIF/WebP variants for the project screenshots.
// Static export has no image-optimisation server, so this runs at author time
// and the components reference the output via <picture>.
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC_DIR = "public/images";
const WIDTHS = [480, 800, 1200];

const sources = (await readdir(SRC_DIR)).filter((f) => f.endsWith("-src.png"));
if (sources.length === 0) console.warn("no *-src.png files in", SRC_DIR);

for (const file of sources) {
  const slug = path.basename(file, "-src.png");
  const input = path.join(SRC_DIR, file);
  const meta = await sharp(input).metadata();
  await mkdir(path.join(SRC_DIR, slug), { recursive: true });

  for (const w of WIDTHS) {
    if (meta.width && w > meta.width) continue;
    const resized = sharp(input).resize({ width: w, withoutEnlargement: true });
    const base = path.join(SRC_DIR, slug, `${slug}-${w}`);
    await resized.clone().avif({ quality: 55 }).toFile(`${base}.avif`);
    await resized.clone().webp({ quality: 78 }).toFile(`${base}.webp`);
  }
  console.log(`${slug}: ${meta.width}x${meta.height} -> ${WIDTHS.join(", ")}`);
}

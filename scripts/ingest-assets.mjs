/**
 * One-time ingest: pull chosen source images into assets/projects/ as capped
 * WebP masters.
 *
 * Sources live outside the repo (a design handoff and a folder of store
 * captures). Committing capped masters rather than the raw PNGs keeps the repo
 * self-contained when those folders are cleaned, at about a twentieth of the
 * weight: nothing renders wider than 840px, so 1200px is already generous
 * headroom.
 *
 *   node scripts/ingest-assets.mjs
 */
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const HANDOFF = "/Users/dark/Downloads/MoRmdn-v2-handoff 2/assets/projects";
const SCREENS = "/Users/dark/Downloads/apps-screens";

/** [source, output slug]. Everything lands in assets/projects/<slug>.webp */
const SOURCES = [
  // Store icons.
  [`${HANDOFF}/ayco-icon.png`, "ayco-icon"],
  [`${HANDOFF}/mismar-logo.jpg`, "mismar-icon"],
  [`${HANDOFF}/lpermis-icon.png`, "lpermis-icon"],
  [`${HANDOFF}/lpermis-pro-icon.png`, "lpermis-pro-icon"],
  [`${HANDOFF}/mutabbib-icon.png`, "mutabbib-icon"],
  [`${HANDOFF}/arcit-ai-icon.png`, "arcit-ai-icon"],
  [`${HANDOFF}/saber-yamen-icon.png`, "saber-yamen-icon"],
  [`${HANDOFF}/dental-diner-icon.png`, "dental-dinar-icon"],
  [`${SCREENS}/freeDoc/play_store_512.png`, "freedoc-icon"],
  [`${SCREENS}/O'Permis/unnamed.png`, "opermis-icon"],

  // Device captures.
  [`${HANDOFF}/ayco-shot.png`, "ayco-shot"],
  [`${HANDOFF}/mismar-shot.png`, "mismar-shot"],
  [`${HANDOFF}/arcit-ai-shot.webp`, "arcit-ai-shot"],
  // The only FreeDoc capture that is product UI rather than a QA screenshot:
  // the rest carry Lorem Ipsum, a Google Maps error, or the notification shade.
  [`${SCREENS}/freeDoc/image_original (1).png`, "freedoc-shot"],

  // Store promos — brand field, device and a baked headline, composed by the
  // client's designer. Shown whole, never cropped.
  [`${HANDOFF}/lpermis-promo.png`, "lpermis-promo"],
  [`${HANDOFF}/lpermis-pro-promo.png`, "lpermis-pro-promo"],
  [`${HANDOFF}/mutabbib-promo.png`, "mutabbib-promo"],
  [`${SCREENS}/dental/01.png`, "dental-dinar-promo"],
  [`${SCREENS}/O'Permis/unnamed (2).png`, "opermis-promo"],

  // Field plate — its own brand ground, goes full bleed.
  [`${HANDOFF}/saber-yamen-shot.jpg`, "saber-yamen-shot"],

  // 1:1 social posts — a separate register from the tall promos.
  [`${HANDOFF}/arcit-ai-promo-1.jpg`, "arcit-ai-social-1"],
  [`${HANDOFF}/arcit-ai-promo-2.jpg`, "arcit-ai-social-2"],
];

await mkdir("assets/projects", { recursive: true });

let total = 0;
for (const [src, slug] of SOURCES) {
  const out = `assets/projects/${slug}.webp`;
  const meta = await sharp(src).metadata();
  const info = await sharp(src)
    .resize({ width: Math.min(1200, meta.width ?? 1200), withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(out);
  total += info.size;
  console.log(
    `${slug.padEnd(22)} ${String(meta.width).padStart(4)}x${String(meta.height).padEnd(4)} -> ` +
      `${String(info.width).padStart(4)}x${String(info.height).padEnd(4)} ${(info.size / 1024).toFixed(0)}KB`,
  );
}
console.log(`\n${SOURCES.length} masters, ${(total / 1024 / 1024).toFixed(2)} MB total`);

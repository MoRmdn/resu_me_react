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
 *   node scripts/ingest-assets.mjs            everything
 *   node scripts/ingest-assets.mjs -screen-   only the slugs containing that
 *
 * The filter exists because the handoff folder has since been cleaned: a full
 * run needs it back, adding a new source does not.
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
  [`${HANDOFF}/mismar-shot.png`, "mismar-shot"],
  [`${HANDOFF}/arcit-ai-shot.webp`, "arcit-ai-shot"],
  // The only FreeDoc capture that is product UI rather than a QA screenshot:
  // the rest carry Lorem Ipsum, a Google Maps error, or the notification shade.
  // Patient home screen: product UI with no Lorem Ipsum or QA artefacts.
  [`${SCREENS}/freeDoc/image_original (10).png`, "freedoc-shot"],

  // Store promos — brand field, device and a baked headline, composed by the
  // client's designer. Shown whole, never cropped.
  [`${HANDOFF}/lpermis-promo.png`, "lpermis-promo"],
  [`${HANDOFF}/lpermis-pro-promo.png`, "lpermis-pro-promo"],
  [`${HANDOFF}/mutabbib-promo.png`, "mutabbib-promo"],
  [`${SCREENS}/dental/Iphone/02.png`, "dental-dinar-promo"],
  [`${SCREENS}/O'Permis/unnamed (3).png`, "opermis-promo"],
  [`${SCREENS}/saber/unnamed (4).jpg`, "saber-yamen-promo"],


  // Store listings: three screens per featured project, shown as a set. All of
  // a set comes from one listing, so the strip stays a uniform set.
  // Lpermis comes from the O'Permis folder on purpose: that is the blue set on
  // the live Lpermis listing. The Lpermis/ folder holds the old yellow one.
  [`${SCREENS}/O'Permis/unnamed (2).png`, "lpermis-screen-1"],
  [`${SCREENS}/O'Permis/unnamed (4).png`, "lpermis-screen-2"],
  [`${SCREENS}/O'Permis/unnamed (5).png`, "lpermis-screen-3"],
  [`${SCREENS}/saber/unnamed.jpg`, "saber-yamen-screen-1"],
  [`${SCREENS}/saber/unnamed (4).jpg`, "saber-yamen-screen-2"],
  [`${SCREENS}/saber/unnamed (2).jpg`, "saber-yamen-screen-3"],
  [`${SCREENS}/mutabbib/AR-1.png`, "mutabbib-screen-1"],
  [`${SCREENS}/mutabbib/AR-3.png`, "mutabbib-screen-2"],
  [`${SCREENS}/mutabbib/AR-6.png`, "mutabbib-screen-3"],

  // 1:1 social posts — a separate register from the tall promos.
  [`${HANDOFF}/arcit-ai-promo-1.jpg`, "arcit-ai-social-1"],
  [`${HANDOFF}/arcit-ai-promo-2.jpg`, "arcit-ai-social-2"],
];

await mkdir("assets/projects", { recursive: true });

const only = process.argv[2];
const chosen = SOURCES.filter(([, slug]) => !only || slug.includes(only));

let total = 0;
for (const [src, slug] of chosen) {
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
console.log(`\n${chosen.length} masters, ${(total / 1024 / 1024).toFixed(2)} MB total`);

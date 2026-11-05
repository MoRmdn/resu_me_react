/**
 * Composes store-style promos for projects whose listing has only raw captures:
 * a brand ground, a headline, and the capture seated in a drawn device.
 *
 * Outputs are masters in assets/projects/, so `npm run images` picks them up.
 * Inputs are in assets/promo-src/. Rendered by a local Chrome rather than sharp
 * because librsvg cannot shape Arabic, and the fonts below load at render time
 * only: nothing here reaches the site.
 *
 *   npm run promos && npm run images
 *   npm run promos -- freedoc             only the outputs containing that
 *
 * The status bar and home band are drawn over the capture on purpose. They
 * replace the phone's own, which is how AYCO's dev-flavour ribbon, the camera
 * cutout and the black corner masks go without touching the app's UI. Never feed this a
 * capture showing client data: AYCO's list screens carry real hospital names.
 */
import { execFileSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

const CHROME =
  process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const SRC = path.resolve("assets/promo-src");
const OUT = path.resolve("assets/projects");
const src = (file) => pathToFileURL(path.join(SRC, file)).href;

const FONTS =
  "https://fonts.googleapis.com/css2?family=Cairo:wght@600;800&family=Manrope:wght@600;800&display=block";

const BRANDS = {
  ayco: {
    ground: "linear-gradient(170deg, #4d6a6b 0%, #233a3b 46%, #142324 100%)",
    ink: "#f3ece1",
    soft: "#d9c7b3",
    font: "Cairo",
    mark: "ayco-mark.webp",
    screenBg: "#faf6ef",
    statusInk: "#2b2622",
  },
  "js-quest": {
    ground: "linear-gradient(170deg, #5b52f0 0%, #3a2fd0 42%, #17134a 100%)",
    ink: "#ffffff",
    soft: "#d5d2ff",
    font: "Manrope",
    screenBg: "#f6f5ff",
    statusInk: "#17134a",
  },
  freedoc: {
    ground: "linear-gradient(170deg, #3414d0 0%, #1e009e 46%, #0d0348 100%)",
    ink: "#ffffff",
    soft: "#c9c4ff",
    font: "Cairo",
    mark: "freedoc-mark.webp",
    screenBg: "#ffffff",
    statusInk: "#1e009e",
  },
  naas: {
    ground: "linear-gradient(170deg, #e2363b 0%, #b5181e 46%, #4f0709 100%)",
    ink: "#ffffff",
    soft: "#ffd3d4",
    font: "Cairo",
    screenBg: "#ffffff",
    statusInk: "#4f0709",
  },
};

const PROMOS = [
  {
    out: "ayco-screen-1",
    brand: "ayco",
    dir: "rtl",
    headline: "تقارير صيانة بدون أوراق",
    sub: "مرقمة وموقعة وجاهزة للمشاركة",
    screen: "ayco-home.webp",
  },
  {
    out: "ayco-screen-2",
    brand: "ayco",
    dir: "rtl",
    headline: "دفعة تقارير بتوقيع واحد",
    sub: "لأجهزة متعددة في موقع واحد",
    screen: "ayco-batch.webp",
  },
  {
    out: "ayco-screen-3",
    brand: "ayco",
    dir: "rtl",
    headline: "بالعربية أو الإنجليزية",
    sub: "واجهة كاملة من اليمين إلى اليسار",
    screen: "ayco-settings.webp",
  },
  {
    out: "js-quest-promo",
    brand: "js-quest",
    dir: "ltr",
    headline: "100 questions.<br>Five chapters.",
    sub: "Answers the browser never sees until you earn them.",
    screen: "js-quest-landing.webp",
    url: "js-basics-quiz.vercel.app",
  },
  {
    out: "freedoc-promo",
    brand: "freedoc",
    dir: "rtl",
    headline: "ابحث عن طبيبك واحجز موعدك",
    sub: "بالعربية والفرنسية والإنجليزية",
    // The patient home screen, the only capture that is clean product UI: the
    // rest carry Lorem Ipsum, a Google Maps error or the notification shade.
    // Cropped to the app's own content, so it starts under the drawn status bar.
    screen: "freedoc-home.webp",
    appTop: 118,
  },
  {
    out: "naas-promo",
    brand: "naas",
    dir: "rtl",
    // A desktop web app, so a browser window rather than a phone, on a shorter
    // canvas. The capture is the app area only: Chrome's toolbar and the dev URL
    // are cropped off and the DEVELOPMENT ribbon and avatar painted over.
    layout: "browser",
    size: [1200, 1420],
    headline: "صيانة الأساطيل ومطالبات التأمين",
    sub: "شركات التأمين والأساطيل والورش والموردين في مسار واحد",
    screen: "naas-dashboard.webp",
  },
];

/** The site's own JS tile, which it only ever draws in CSS. */
const ICONS = [
  {
    out: "js-quest-icon",
    size: 512,
    html: `<div style="width:512px;height:512px;display:grid;place-items:center;
      background:linear-gradient(145deg,#5b52f0,#2a1fb0);color:#fff;
      font:800 216px/1 Manrope,sans-serif;letter-spacing:-.04em">JS</div>`,
  },
];

const STATUS_ICONS = `
  <svg width="104" height="34" viewBox="0 0 104 34" fill="currentColor" aria-hidden="true">
    <rect x="0" y="22" width="6" height="10" rx="2"/><rect x="10" y="16" width="6" height="16" rx="2"/>
    <rect x="20" y="9" width="6" height="23" rx="2"/><rect x="30" y="2" width="6" height="30" rx="2"/>
    <rect x="52" y="4" width="46" height="26" rx="7" fill="none" stroke="currentColor" stroke-width="3" opacity=".5"/>
    <rect x="56" y="8" width="38" height="18" rx="4"/><rect x="100" y="12" width="4" height="10" rx="2" opacity=".5"/>
  </svg>`;

function promoHtml(promo) {
  const b = BRANDS[promo.brand];
  // A site's capture is a viewport onto a long page, so it runs under the
  // browser bar and clips at the foot. An app's capture is the whole screen.
  const screen = promo.url
    ? `<div class="bar"><span>${promo.url}</span></div>
       <img class="page" src="${src(promo.screen)}" alt="">`
    : `<img class="app" src="${src(promo.screen)}" alt="">`;

  return `<!doctype html><html dir="${promo.dir}"><head><meta charset="utf-8">
<link rel="stylesheet" href="${FONTS}">
<style>
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 2600px; overflow: hidden; }
  body { position: relative; background: ${b.ground}; color: ${b.ink};
    font-family: ${b.font}, sans-serif; text-align: center; }
  .watermark { position: absolute; top: 300px; inset-inline-start: -260px; width: 1500px;
    opacity: .05; filter: brightness(10); }
  .head { position: absolute; top: 96px; inset-inline: 70px; }
  .mark { display: block; height: 104px; margin: 0 auto 36px; }
  h1, p { text-wrap: balance; }
  h1 { font-size: 92px; line-height: 1.2; font-weight: 800; letter-spacing: ${promo.dir === "ltr" ? "-.03em" : "0"}; }
  p { margin-top: 18px; font-size: 48px; line-height: 1.3; font-weight: 600; color: ${b.soft}; }
  .phone { position: absolute; left: 160px; bottom: 90px; width: 880px; height: 1932px;
    padding: 18px; border-radius: 104px; background: #0c0c0e;
    box-shadow: 0 0 0 3px rgb(255 255 255 / .16), 0 44px 90px rgb(0 0 0 / .45); }
  .screen { position: relative; width: 100%; height: 100%; overflow: hidden;
    border-radius: 88px; background: ${b.screenBg}; }
  .screen .app { display: block; width: 100%; margin-top: ${promo.appTop ?? 0}px; }
  .screen .page { display: block; width: 100%; margin-top: 208px; }
  .status { position: absolute; inset: 0 0 auto; height: 118px; display: flex; direction: ltr;
    align-items: center; justify-content: space-between; padding: 26px 60px 0;
    background: ${b.screenBg}; color: ${b.statusInk}; font: 600 40px Manrope, sans-serif; }
  .home { position: absolute; inset: auto 0 0; height: 84px; background: ${b.screenBg}; }
  .home::after { content: ""; position: absolute; left: 50%; bottom: 22px; width: 280px;
    height: 9px; margin-left: -140px; border-radius: 5px; background: ${b.statusInk}; opacity: .45; }
  .island { position: absolute; top: 24px; left: 50%; width: 220px; height: 58px;
    margin-left: -110px; border-radius: 30px; background: #0c0c0e; }
  .bar { position: absolute; top: 118px; inset-inline: 0; height: 90px; padding: 0 36px;
    background: ${b.screenBg}; }
  .bar span { display: block; height: 66px; line-height: 66px; border-radius: 33px;
    background: rgb(23 19 74 / .07); color: ${b.statusInk}; font: 600 32px Manrope, sans-serif; }
</style></head><body>
  ${b.mark ? `<img class="watermark" src="${src(b.mark)}" alt="">` : ""}
  <div class="head">
    ${b.mark ? `<img class="mark" src="${src(b.mark)}" alt="">` : ""}
    <h1>${promo.headline}</h1>
    <p>${promo.sub}</p>
  </div>
  <div class="phone"><div class="screen">
    ${screen}
    <div class="status"><span>9:41</span>${STATUS_ICONS}</div>
    <div class="island"></div>
    <div class="home"></div>
  </div></div>
</body></html>`;
}

/**
 * A desktop capture in a browser window. The window runs off the left and
 * bottom edges: the app is right-to-left, so its sidebar and headline numbers
 * sit on the right, and the window shows them at a size a phone frame cannot.
 */
function browserHtml(promo) {
  const b = BRANDS[promo.brand];
  const [width, height] = promo.size;
  return `<!doctype html><html dir="${promo.dir}"><head><meta charset="utf-8">
<link rel="stylesheet" href="${FONTS}">
<style>
  * { box-sizing: border-box; margin: 0; }
  html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
  body { position: relative; background: ${b.ground}; color: ${b.ink};
    font-family: ${b.font}, sans-serif; text-align: center; }
  .head { position: absolute; top: 88px; inset-inline: 70px; }
  h1, p { text-wrap: balance; }
  h1 { font-size: 84px; line-height: 1.2; font-weight: 800; }
  p { margin-top: 16px; font-size: 44px; line-height: 1.3; font-weight: 600; color: ${b.soft}; }
  .window { position: absolute; top: 450px; right: 70px; width: 1500px; direction: ltr;
    border-radius: 26px 26px 0 0; overflow: hidden; background: ${b.screenBg};
    box-shadow: 0 0 0 3px rgb(255 255 255 / .18), 0 44px 90px rgb(0 0 0 / .45); }
  .bar { height: 58px; background: #ececee; border-bottom: 2px solid #dcdcdf; }
  .window img { display: block; width: 100%; }
</style></head><body>
  <div class="head">
    <h1>${promo.headline}</h1>
    <p>${promo.sub}</p>
  </div>
  <div class="window"><div class="bar"></div><img src="${src(promo.screen)}" alt=""></div>
</body></html>`;
}

async function render(html, width, height, out) {
  const dir = await mkdtemp(path.join(tmpdir(), "promo-"));
  const page = path.join(dir, "page.html");
  const shot = path.join(dir, "shot.png");
  await writeFile(page, html);

  execFileSync(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-first-run",
      `--user-data-dir=${path.join(dir, "profile")}`,
      "--force-device-scale-factor=1",
      `--window-size=${width},${height}`,
      "--virtual-time-budget=6000",
      "--allow-file-access-from-files",
      `--screenshot=${shot}`,
      pathToFileURL(page).href,
    ],
    { stdio: "ignore" },
  );

  const info = await sharp(shot)
    .webp({ quality: 88 })
    .toFile(path.join(OUT, `${out}.webp`));
  console.log(`${out.padEnd(20)} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB`);
  await rm(dir, { recursive: true, force: true });
}

const only = process.argv[2];
const chosen = (list) => list.filter(({ out }) => !only || out.includes(only));

for (const promo of chosen(PROMOS)) {
  const [width, height] = promo.size ?? [1200, 2600];
  const html = promo.layout === "browser" ? browserHtml(promo) : promoHtml(promo);
  await render(html, width, height, promo.out);
}

for (const icon of chosen(ICONS)) {
  const html = `<!doctype html><link rel="stylesheet" href="${FONTS}">
    <style>*{margin:0}html,body{overflow:hidden}</style>${icon.html}`;
  await render(html, icon.size, icon.size, icon.out);
}

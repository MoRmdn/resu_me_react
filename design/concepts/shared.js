/* Helpers shared by the layout concepts. Reads window.DATA from data.js. */
const D = window.DATA;
const IMAGE_ROOT = "../../public/images/projects";

/** The largest variant of an image at or under `want` pixels wide. */
function img(file, want = 560) {
  const widths = (window.IMAGES || {})[file] || [];
  if (!widths.length) return "";
  const fit = widths.filter((w) => w <= want);
  const w = fit.length ? fit[fit.length - 1] : widths[0];
  return `${IMAGE_ROOT}/${file}/${file}-${w}.webp`;
}

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/** A marketplace logo in currentColor, sized like PlatformMark on the site. */
function mark(id, size = 16) {
  const m = D.marks[id];
  if (!m) return "";
  const [, , w, h] = m.viewBox.split(" ").map(Number);
  const height = Math.round((m.height / 19) * size * 10) / 10;
  return `<svg viewBox="${m.viewBox}" height="${height}" width="${Math.round((w / h) * height * 10) / 10}" fill="currentColor" aria-hidden="true">${m.markup}</svg>`;
}

const STAR = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.4l-6.1 3.5 1.5-6.8L2.2 9.5l6.9-.7z"/></svg>';
const stars = () => `<span class="stars" aria-label="5 out of 5">${STAR.repeat(5)}</span>`;

/** The composed M. Geometry locked: design/LOGO.md. */
const MARK = (size = 24) => `<svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke-width="4.4" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><path d="M6 39 L17 9 L24 26 L31 9 L42 39" stroke="#F2EEE7"/><path d="M24 26 L31 9 L42 39" stroke="#F2762E"/></svg>`;

const platformLabel = (id) => (D.platforms.find((p) => p.id === id) || {}).label || id;
const projectName = (p) => p.title.split("|")[0].replace(/—.*$/, "").trim();
const hasStore = (p) => !!(p.links && (p.links.appStore || p.links.playStore));

/** Picks reviews that read well large: English, short enough for one card. */
function shortReviews(max = 220) {
  return D.reviews.filter((r) => r.lang === "en" && r.quote.length <= max);
}

/** The world map: land image plus every client country's shape, inline. */
function worldSvg({ arcs = true, className = "", extra = [] } = {}) {
  const m = D.map;
  const most = Math.max(...D.clients.map((c) => c.total));
  const weight = (id) => {
    const n = (D.clients.find((c) => c.id === id) || {}).total || 1;
    return (0.2 + 0.45 * (Math.log(n) / Math.log(most))).toFixed(2);
  };
  const shapes = m.countries
    .map((c) => `<path class="map-country" style="--w:${weight(c.id)}" data-id="${c.id}" d="${c.path}"/>`)
    .join("");
  const more = extra
    .map((id) => window.EXTRA_SHAPES[id])
    .filter(Boolean)
    .map((c) => `<path class="map-country map-extra" data-id="${c.id}" d="${c.path}"/>`)
    .join("");
  const lines = arcs
    ? m.countries.filter((c) => c.arc).map((c, i) => `<path class="map-arc" style="--i:${i}" data-id="${c.id}" d="${c.arc}" pathLength="1"/>`).join("")
    : "";
  const dots = m.countries
    .filter((c) => c.id !== "EG")
    .map((c) => `<circle class="map-dot" data-id="${c.id}" cx="${c.x}" cy="${c.y}" r="2.4"/>`)
    .join("");
  return `<svg class="${className}" viewBox="0 0 ${m.width} ${m.height}" aria-hidden="true">
    <image href="../../public/images/world-land.svg" width="${m.width}" height="${m.height}"/>
    ${shapes}${more}${lines}${dots}
    <circle cx="${m.home.x}" cy="${m.home.y}" r="7" fill="none" stroke="#3FD8C0" stroke-opacity=".6"/>
    <circle cx="${m.home.x}" cy="${m.home.y}" r="3.2" fill="#3FD8C0"/>
  </svg>`;
}

function badge(text) {
  document.body.insertAdjacentHTML("beforeend", `<div class="concept-badge">${esc(text)}</div><div class="grain"></div>`);
}

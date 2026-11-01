/**
 * The film, as a pure function of time. `seek(t)` draws any moment from nothing,
 * so frames can be rendered out of order, in parallel, and exactly the same way
 * twice. Nothing in here may depend on the previous frame or on the clock.
 */
/* global d3, topojson */
const { format, countries, stops: stopSpec, home, world, topology, marks, totals } = window.DATA;

const COPPER = "#F2762E";
const COPPER_BRIGHT = "#FF8A45";
const BONE = "#F2EEE7";
const JADE = "#3FD8C0";
const INK_900 = "#0A0A0C";
const INK_800 = "#101013";
const INK_600 = "#1E1E24";

const W = format.width;
const H = format.height;
const portrait = H > W;
document.body.classList.toggle("portrait", portrait);
document.body.style.width = `${W}px`;
document.body.style.height = `${H}px`;

const canvas = document.getElementById("scene");
canvas.width = W;
canvas.height = H;
const ctx = canvas.getContext("2d");

const LAYOUT = portrait
  ? {
      anchor: [540, 1470],
      span: 300,
      rMin: 520,
      finale: { cx: 540, cy: 1640, r: 640, view: [44, -4] },
      intro: { from: 620, to: 900 },
      px: 1.25,
    }
  : {
      anchor: [1380, 590],
      span: 400,
      rMin: 610,
      finale: { cx: 1385, cy: 800, r: 640, view: [46, -6] },
      intro: { from: 560, to: 1050 },
      px: 1,
    };

const ROLL = -8;
const FLY = 1.7;
const INTRO = 5.2;
const FINALE_LENGTH = 11.2;
const ARC_LIFT = 0.19;
const RING_START = -30;

const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const inOut = (p) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);
const out = (p) => 1 - (1 - p) ** 3;
const lerp = (a, b, p) => a + (b - a) * p;
const RAD = Math.PI / 180;

const toXyz = ([lon, lat]) => [
  Math.cos(lat * RAD) * Math.sin(lon * RAD),
  Math.sin(lat * RAD),
  Math.cos(lat * RAD) * Math.cos(lon * RAD),
];
const toLonLat = ([x, y, z]) => [Math.atan2(x, z) / RAD, Math.asin(clamp(y, -1, 1)) / RAD];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const angleBetween = (a, b) => Math.acos(clamp(dot(a, b), -1, 1));

function slerp(a, b, p) {
  const angle = angleBetween(a, b);
  if (angle < 1e-6) return a;
  const s = Math.sin(angle);
  const ka = Math.sin((1 - p) * angle) / s;
  const kb = Math.sin(p * angle) / s;
  return [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb, a[2] * ka + b[2] * kb];
}

const HOME_XYZ = toXyz(home);
const most = Math.max(...countries.map((c) => c.count));
const weightOf = (country) => Math.log(country.count + 1) / Math.log(most + 1);

/* ------------------------------------------------------------ the schedule */

let cursor = INTRO;
const flights = [];
const distanceFromHome = (c) => angleBetween(HOME_XYZ, toXyz([c.lon, c.lat]));

const stops = stopSpec.map((spec, chapter) => {
  const flyStart = cursor;
  const land = flyStart + FLY;
  const leave = land + spec.hold;
  cursor = leave;

  // Egypt is home: it is lit, but no line leaves for it.
  const targets = countries
    .filter((c) => c.id !== "EG" && c.clients[spec.site])
    .sort((a, b) => distanceFromHome(a) - distanceFromHome(b));
  const stagger = Math.min(0.22, 1.7 / targets.length);
  targets.forEach((country, i) => {
    const launch = flyStart + 0.5 + i * stagger;
    flights.push({ chapter, country, launch, land: launch + 0.9 });
  });

  return {
    ...spec,
    flyStart,
    land,
    leave,
    pose: { view: spec.view, r: spec.r * (portrait ? 0.88 : 1) },
  };
});

const FINALE = cursor;
const END = FINALE + FINALE_LENGTH;
window.DURATION = END;

/** When each country first lights. A country can have clients on several sites. */
const landings = new Map([["EG", 3.1]]);
flights.forEach((flight) => {
  flight.first = !landings.has(flight.country.id);
  if (flight.first) landings.set(flight.country.id, flight.land);
});

const litCount = (t) => [...landings.values()].filter((at) => at <= t).length;
const chapterAt = (t) => stops.findLastIndex((stop) => t >= stop.flyStart);
/** The ring counts itself up at the end, one tick per lit country. */
const ringValue = (t) => countries.length * inOut(seg(t, FINALE + 1, FINALE + 2.8));

/* ---------------------------------------------------------------- the camera */

const introPose = { view: home, r: LAYOUT.intro.to };
const finalePose = { view: LAYOUT.finale.view, r: LAYOUT.finale.r };

/** Keeps a held shot alive: a slow push in and a slight turn of the planet. */
const drift = (pose, p) => ({
  view: [pose.view[0] - 1.4 * p, pose.view[1]],
  r: pose.r * (1 + 0.035 * p),
});

function fly(from, to, p, dip) {
  const eased = inOut(p);
  const a = toXyz(from.view);
  const b = toXyz(to.view);
  // Long moves lift off: the camera pulls back a little on the way over.
  const lift = 1 - dip * Math.min(1, angleBetween(a, b) / 0.5) * Math.sin(Math.PI * p);
  return {
    view: toLonLat(slerp(a, b, eased)),
    r: Math.exp(lerp(Math.log(from.r), Math.log(to.r), eased)) * lift,
  };
}

function poseAt(t) {
  if (t < INTRO) {
    const start = { view: [104, 16], r: LAYOUT.intro.from };
    const p = seg(t, 0, INTRO - 0.5);
    return fly(start, introPose, p, 0);
  }
  let previous = introPose;
  for (const stop of stops) {
    if (t < stop.land) return fly(previous, stop.pose, seg(t, stop.flyStart, stop.land), 0.2);
    if (t < stop.leave) return drift(stop.pose, seg(t, stop.land, stop.leave));
    previous = drift(stop.pose, 1);
  }
  return drift(fly(previous, finalePose, seg(t, FINALE, FINALE + 2.2), 0.1), seg(t, FINALE + 2.2, END) * 0.5);
}

function cameraAt(t) {
  const pose = poseAt(t);
  const p = inOut(seg(t, FINALE, FINALE + 2.2));
  const cx = lerp(LAYOUT.anchor[0], LAYOUT.finale.cx, p);
  const cy = lerp(LAYOUT.anchor[1], LAYOUT.finale.cy, p);
  const rotate = [-pose.view[0], -pose.view[1], ROLL];
  const projection = d3
    .geoOrthographic()
    .rotate(rotate)
    .scale(pose.r)
    .translate([cx, cy])
    .clipAngle(90)
    .precision(0.5);
  const spin = d3.geoRotation(rotate);
  return {
    cx,
    cy,
    r: pose.r,
    projection,
    path: d3.geoPath(projection, ctx),
    camera: (xyz) => toXyz(spin(toLonLat(xyz))),
  };
}

/* --------------------------------------------------------------- the geometry */

const geometries = topology.objects.countries.geometries.filter((g) => g.id !== "010");
const land = topojson.merge(topology, geometries);
const borders = topojson.mesh(topology, topology.objects.countries, (a, b) => a !== b);
const graticule = d3.geoGraticule().step([15, 15])();
const shapes = new Map(
  countries.map((c) => [c.id, topojson.feature(topology, geometries.find((g) => g.id === c.iso))]),
);

/** Fixed dither, so the dark gradients survive the platforms' compression. */
const grain = (() => {
  const tile = document.createElement("canvas");
  tile.width = tile.height = 256;
  const tileCtx = tile.getContext("2d");
  const image = tileCtx.createImageData(256, 256);
  let seed = 2021;
  for (let i = 0; i < image.data.length; i += 4) {
    seed = (seed * 16807) % 2147483647;
    const v = seed % 256;
    image.data[i] = image.data[i + 1] = image.data[i + 2] = v;
    image.data[i + 3] = 255;
  }
  tileCtx.putImageData(image, 0, 0);
  return ctx.createPattern(tile, "repeat");
})();

/* ---------------------------------------------------------------- the drawing */

function flightPoints(view, target, progress) {
  const from = HOME_XYZ;
  const to = toXyz(target);
  // Up close a true height would be invisible, so it grows with the zoom.
  const lift = ARC_LIFT * Math.sqrt(angleBetween(from, to) / Math.PI) * (view.r / LAYOUT.finale.r);
  const steps = 72;
  const points = [];
  for (let i = 0; i <= steps; i += 1) {
    const s = (i / steps) * progress;
    const p = view.camera(slerp(from, to, s));
    const k = 1 + lift * Math.sin(Math.PI * s);
    const x = p[0] * k;
    const y = p[1] * k;
    if (p[2] < 0 && Math.hypot(x, y) < 1) break;
    points.push({ x: view.cx + view.r * x, y: view.cy - view.r * y, s });
  }
  return points;
}

function drawFlight(view, country, progress) {
  const points = flightPoints(view, [country.lon, country.lat], progress);
  if (points.length < 3) return;
  const weight = weightOf(country);
  const head = points[0];
  const tip = points[points.length - 1];
  const side = (sign) =>
    points.map((point, i) => {
      const a = points[Math.max(0, i - 1)];
      const b = points[Math.min(points.length - 1, i + 1)];
      const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
      const half = LAYOUT.px * (0.45 + (point.s / progress) * 1.1) * (0.8 + weight);
      return [
        point.x - (sign * half * (b.y - a.y)) / length,
        point.y + (sign * half * (b.x - a.x)) / length,
      ];
    });

  const gradient = ctx.createLinearGradient(head.x, head.y, tip.x, tip.y);
  gradient.addColorStop(0, "rgba(242,118,46,.3)");
  gradient.addColorStop(0.55, "rgba(242,118,46,.65)");
  gradient.addColorStop(1, COPPER_BRIGHT);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  [...side(1), ...side(-1).reverse()].forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fill();

  if (progress < 1) {
    const glow = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 26 * LAYOUT.px);
    glow.addColorStop(0, "rgba(255,138,69,.9)");
    glow.addColorStop(1, "rgba(255,138,69,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(tip.x, tip.y, 26 * LAYOUT.px, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = BONE;
    ctx.beginPath();
    ctx.arc(tip.x, tip.y, 4 * LAYOUT.px, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPlanet(view, t, ringAlpha, sweep) {
  const { cx, cy, r, path } = view;

  const haloR = r * 1.32;
  const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, haloR);
  halo.addColorStop(0.74, "rgba(242,118,46,0)");
  halo.addColorStop(0.757, "rgba(242,118,46,.2)");
  halo.addColorStop(0.81, "rgba(242,118,46,.05)");
  halo.addColorStop(1, "rgba(242,118,46,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H);

  if (ringAlpha > 0) {
    const from = (RING_START - 8 - 90) * RAD;
    const to = (RING_START + sweep + 8 - 90) * RAD;
    ctx.save();
    ctx.filter = `blur(${r * 0.05}px)`;
    ctx.globalAlpha = 0.5 * ringAlpha;
    ctx.strokeStyle = COPPER;
    ctx.lineWidth = r * 0.11;
    ctx.beginPath();
    ctx.arc(cx, cy, r, from, to);
    ctx.stroke();
    ctx.restore();
  }

  const sea = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.55, 0, cx, cy, r);
  sea.addColorStop(0, "#17171D");
  sea.addColorStop(0.7, INK_800);
  sea.addColorStop(1, INK_900);
  ctx.fillStyle = sea;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  ctx.beginPath();
  path(graticule);
  ctx.strokeStyle = "rgba(242,238,231,.035)";
  ctx.lineWidth = 0.8;
  ctx.stroke();

  ctx.beginPath();
  path(land);
  ctx.fillStyle = INK_600;
  ctx.fill();
  ctx.strokeStyle = "rgba(242,238,231,.1)";
  ctx.lineWidth = 0.6;
  ctx.stroke();

  ctx.beginPath();
  path(borders);
  ctx.strokeStyle = "rgba(242,238,231,.05)";
  ctx.stroke();

  countries.forEach((country) => {
    const lit = seg(t, landings.get(country.id), landings.get(country.id) + 0.5);
    if (!lit) return;
    ctx.beginPath();
    path(shapes.get(country.id));
    ctx.fillStyle = `rgba(242,118,46,${(0.26 + 0.5 * weightOf(country)) * lit})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(255,138,69,${0.5 * lit})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  });

  const night = ctx.createLinearGradient(cx - r * 0.9, cy, cx + r * 0.1, cy - r);
  night.addColorStop(0, "rgba(10,10,12,.92)");
  night.addColorStop(0.62, "rgba(10,10,12,.2)");
  night.addColorStop(1, "rgba(10,10,12,0)");
  ctx.globalAlpha = seg(t, FINALE, FINALE + 2);
  ctx.fillStyle = night;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(242,238,231,.16)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawRing(view, alpha, value) {
  const { cx, cy, r } = view;
  const inner = r * 1.03;
  const step = 360 / world;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineCap = "butt";
  for (let i = 0; i < world; i += 1) {
    const on = clamp(value - i);
    const angle = (RING_START + i * step) * RAD;
    const length = lerp(r * 0.016, r * 0.034, on);
    ctx.beginPath();
    ctx.moveTo(cx + Math.sin(angle) * inner, cy - Math.cos(angle) * inner);
    ctx.lineTo(cx + Math.sin(angle) * (inner + length), cy - Math.cos(angle) * (inner + length));
    ctx.strokeStyle = on ? COPPER_BRIGHT : "rgba(242,238,231,.2)";
    ctx.lineWidth = lerp(1.25, 3, on);
    ctx.stroke();
  }
  ctx.restore();
}

/** The same 195 ticks as the ring, unrolled, for the shots too close to see it. */
function drawHud(count, alpha) {
  if (!alpha) return;
  const left = portrait ? 64 : 96;
  const right = W - left;
  const y = portrait ? 288 : H - 78;
  const step = (right - left) / (world - 1);
  ctx.save();
  if (!portrait) {
    const scrim = ctx.createLinearGradient(0, H - 220, 0, H);
    scrim.addColorStop(0, "rgba(10,10,12,0)");
    scrim.addColorStop(0.6, "rgba(10,10,12,.92)");
    ctx.globalAlpha = alpha;
    ctx.fillStyle = scrim;
    ctx.fillRect(0, H - 220, W, 220);
  }
  ctx.globalAlpha = alpha;
  for (let i = 0; i < world; i += 1) {
    const on = i < count;
    ctx.fillStyle = on ? COPPER_BRIGHT : "rgba(242,238,231,.22)";
    const width = on ? 3 : 1.5;
    const height = on ? 22 : 12;
    ctx.fillRect(left + i * step - width / 2, y - height / 2, width, height);
  }
  ctx.restore();
}

/* -------------------------------------------------------------------- the DOM */

const STAR = '<svg viewBox="0 0 20 20"><path d="m10 1.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z"/></svg>';
const MARK = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none"
  stroke-width="4.4" stroke-linecap="square" stroke-linejoin="miter">
  <path d="M6 39 L17 9 L24 26 L31 9 L42 39" stroke="${BONE}"/>
  <path d="M24 26 L31 9 L42 39" stroke="${COPPER}"/></svg>`;

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const cards = stops.map((stop) => {
  const { review } = stop;
  const card = el("article", "card layer");
  card.style.setProperty("--brand", review.brandColor);
  card.append(el("div", "card__wipe"), el("span", "card__glyph", "“"));

  const top = el("div", "card__top");
  const mark = el("div", "card__mark");
  const logo = marks[review.platform];
  mark.innerHTML = `<svg viewBox="${logo.viewBox}" aria-hidden="true">${logo.markup}</svg>`;
  const rating = el("div", "card__rating");
  const stars = el("div", "card__stars");
  stars.innerHTML = STAR.repeat(5);
  rating.append(stars, el("span", "", review.ratingValue));
  top.append(mark, rating);
  card.append(top);

  const quote = el("blockquote", "card__quote", review.quote);
  quote.classList.toggle("is-long", review.quote.length > 160);
  quote.lang = review.lang;
  quote.dir = review.lang === "ar" ? "rtl" : "ltr";
  card.append(quote);
  if (review.translation) {
    card.append(el("p", "card__label", review.translatedLabel), el("p", "card__translation", review.translation));
  }

  const foot = el("div", "card__foot");
  const who = el("div");
  // Its own direction, so the full stop in an Arabic name stays at its end.
  const author = el("p", "card__author");
  author.append(el("bdi", "", review.author));
  if (review.repeat) author.append(el("span", "card__repeat", review.repeatLabel));
  who.append(author, el("p", "card__meta", `${review.meta} · on ${review.platformLabel}`));
  foot.append(who);
  card.append(foot);

  const tag = el("div", "tag layer", stop.siteLabel);
  tag.append(el("span", "", stop.siteCount));

  document.getElementById("cards").append(tag, card);
  return { root: card, tag, wipe: card.querySelector(".card__wipe"), stars: [...stars.children] };
});

const $ = (id) => document.getElementById(id);
$("brand").innerHTML = `${MARK(portrait ? 42 : 36)}<span>mormdn.com</span>`;
$("site").innerHTML = `${MARK(portrait ? 50 : 46)}<span>mormdn.com</span>`;
$("stats").append(
  `${totals.clients} clients. ${totals.countries} countries.`,
  el("br"),
  `${totals.reviews} reviews, all five stars.`,
);
$("next").textContent = `Yours could be ${totals.countries + 1}.`;

/**
 * Fixed to whole pixels once, with the fonts in. A card must never be placed by
 * percent or `will-change`: each Chrome rendering frames would then rasterise it
 * at its own sub-pixel offset, and the interleaved frames shake.
 */
function placeCards() {
  stops.forEach((stop, i) => {
    const { root, tag } = cards[i];
    const height = root.offsetHeight;
    const top = portrait ? 340 : Math.round((H - height) / 2) + 6;
    root.style.top = `${top}px`;
    tag.style.top = `${portrait ? top + height + 20 : top - 62}px`;
  });
}

const show = (node, opacity, transform = "") => {
  node.style.opacity = opacity;
  node.style.transform = transform;
};

function updateDom(t) {
  show($("brand"), seg(t, 0.3, 0.9) * (1 - seg(t, FINALE + 5.8, FINALE + 6.4)));
  show($("intro"), seg(t, 0.15, 0.7) * (1 - seg(t, INTRO - 0.4, INTRO)));
  show($("intro-sub"), seg(t, 2.1, 2.7));

  stops.forEach((stop, i) => {
    const { root, tag, wipe, stars } = cards[i];
    const enter = out(seg(t, stop.land - 0.2, stop.land + 0.35));
    const exit = inOut(seg(t, stop.leave - 0.4, stop.leave));
    show(root, enter * (1 - exit), `translateY(${lerp(30, 0, enter) - exit * 14}px)`);
    show(tag, seg(t, stop.land, stop.land + 0.3) * (1 - exit));
    wipe.style.transform = `scaleX(${out(seg(t, stop.land, stop.land + 0.6))})`;
    stars.forEach((star, j) => {
      const pop = seg(t, stop.land + 0.15 + j * 0.06, stop.land + 0.4 + j * 0.06);
      star.style.opacity = pop;
      star.style.transform = `scale(${1 + 0.4 * Math.sin(Math.PI * pop)})`;
    });
  });

  show($("hud"), seg(t, 3.1, 3.6) * (1 - seg(t, FINALE + 0.2, FINALE + 0.9)));
  $("hud-count").textContent = `${litCount(t)}/${world}`;

  const shown = seg(t, FINALE + 0.8, FINALE + 1.5);
  show($("finale"), shown, `translateY(${lerp(24, 0, out(shown))}px)`);
  $("percent").textContent = `${Math.round((ringValue(t) / world) * 100)}%`;
  show($("stats"), seg(t, FINALE + 3.2, FINALE + 3.8));
  const cta = seg(t, FINALE + 6.4, FINALE + 7);
  show($("cta"), cta, `translateY(${lerp(16, 0, out(cta))}px)`);
}

/* -------------------------------------------------------------------- the seek */

window.seek = (t) => {
  const view = cameraAt(t);
  const ringAlpha = seg(t, FINALE + 0.7, FINALE + 1.7);
  const count = litCount(t);
  const ring = ringValue(t);
  const sweep = (ring / world) * 360;

  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = INK_900;
  ctx.fillRect(0, 0, W, H);

  drawPlanet(view, t, ringAlpha, sweep);
  if (ringAlpha) drawRing(view, ringAlpha, ring);

  // Earlier chapters step back so the current site reads. At the end every
  // country is one line again, however many sites its clients came through.
  const chapter = chapterAt(t);
  const closing = seg(t, FINALE, FINALE + 1.2);
  flights.forEach((flight) => {
    const progress = inOut(seg(t, flight.launch, flight.land));
    if (!progress) return;
    const during = flight.chapter === chapter ? 1 : 0.32;
    ctx.globalAlpha = lerp(during, flight.first ? 1 : 0, closing);
    if (ctx.globalAlpha > 0) drawFlight(view, flight.country, progress);
  });
  ctx.globalAlpha = 1;

  countries.forEach((country) => {
    if (country.id === "EG" || t < landings.get(country.id)) return;
    if (view.camera(toXyz([country.lon, country.lat]))[2] <= 0) return;
    const [x, y] = view.projection([country.lon, country.lat]);
    ctx.fillStyle = BONE;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(3.2, view.r * 0.0044) * LAYOUT.px, 0, Math.PI * 2);
    ctx.fill();
  });

  flights.forEach((flight) => {
    const since = t - flight.land;
    if (since < 0 || since >= 1) return;
    const { lon, lat } = flight.country;
    if (view.camera(toXyz([lon, lat]))[2] <= 0) return;
    const [x, y] = view.projection([lon, lat]);
    ctx.strokeStyle = `rgba(255,138,69,${1 - since})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, out(since) * 70 * LAYOUT.px, 0, Math.PI * 2);
    ctx.stroke();
  });

  const pinShown = out(seg(t, 2.6, 3.1));
  if (pinShown) {
    const [x, y] = view.projection(home);
    const pin = 8 * LAYOUT.px * pinShown;
    const pulse = (t % 2.4) / 2.4;
    ctx.fillStyle = `rgba(63,216,192,${0.28 * (1 - pulse)})`;
    ctx.beginPath();
    ctx.arc(x, y, pin * (1.6 + pulse * 3), 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(63,216,192,.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, pin * 1.8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = JADE;
    ctx.beginPath();
    ctx.arc(x, y, pin, 0, Math.PI * 2);
    ctx.fill();
  }

  drawHud(count, seg(t, 3.1, 3.6) * (1 - seg(t, FINALE + 0.2, FINALE + 0.9)));

  ctx.save();
  ctx.globalCompositeOperation = "overlay";
  ctx.globalAlpha = 0.045;
  ctx.fillStyle = grain;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  updateDom(t);
};

window.ready = document.fonts.ready.then(async () => {
  await Promise.all([
    document.fonts.load('500 40px "IBM Plex Sans Arabic"', "مهندس"),
    document.fonts.load('400 30px "Archivo"'),
    document.fonts.load('500 40px "Archivo"'),
    document.fonts.load('600 100px "Archivo"'),
    document.fonts.load('400 20px "JetBrains Mono"'),
    document.fonts.load('500 20px "JetBrains Mono"'),
  ]);
  placeCards();
});

# MoRmdn — Logo & Identity

> Implemented in `lib/widgets/mo_rmdn_logo.dart` as `MoRmdnMark` (icon) and
> `MoRmdnLockup` (mark + wordmark). Drawn with a `CustomPainter`, no asset.

## Concept: **The Composed M**

Flutter builds interfaces by *composing layers*. The mark is an **M** drawn as a single continuous
folded stroke — one path, four folds — where the right half is rendered in copper as if a second
layer were laid over the first. It reads simultaneously as:

- **M** for Mohamed / Mobile,
- a **chevron pair** (`\/\/`) — the developer's bracket, forward motion,
- two **stacked planes** meeting at a seam — the widget tree.

Geometry: 48×48 optical box, stroke weight 4.4 (≈9% of box), square caps, mitred joins, apex angles
locked to 30°/60° so the mark stays crisp at 16px. No container shape, no rounded corners, no gradient.

### The path

```
bone  (full stroke): M6 39 L17 9 L24 26 L31 9 L42 39
copper (second layer):        M24 26 L31 9 L42 39
```

The copper path is the last three points of the bone path, drawn over it. In Dart both are painted
by `_MarkPainter` scaled from the 48×48 box to the requested `size`.

## Variations

| # | Variation | Spec | Use | Built? |
|---|---|---|---|---|
| 1 | **Primary lockup** | Mark + `MoRmdn` in Archivo 600, −0.03em, gap 10px | Site header, résumé header, email signature | ✅ `MoRmdnLockup` |
| 2 | **Stacked lockup** | Mark above wordmark, centred, wordmark tracking +0.08em | Social profile art, business card back | ❌ |
| 3 | **Icon only** | Mark alone, 8% padding inside its box | Favicon, app icon, avatar, watermark | ✅ `MoRmdnMark` |
| 4 | **Tile** | Icon centred on `#0A0A0C`, radius 22% of tile (iOS-style) | App store icon, PWA maskable icon | ⚠️ HTML splash only |
| 5 | **Mono / dark-on-light** | Entire mark in `#131316` on `#F2EEE7`; second-layer half at 55% opacity instead of copper | Print, invoices, single-colour stamping | ✅ via `boneColor`/`copperColor` params |
| 6 | **Mono / light-on-dark** | Entire mark in `#F2EEE7`, second half 55% | Photography overlays, merch, embossing | ✅ via params |
| 7 | **Signature** | Wordmark only, `MoRmdn` in JetBrains Mono 500, uppercase, +0.18em | Footers, metadata, code comments | ❌ |

### Where it appears in the app

| Location | Variation | File |
|---|---|---|
| Nav pill, top-left | Primary lockup, 26px mark | `lib/widgets/navigation_bar.dart` |
| Hero watermark, right | Icon only, 560px @ 5.5% opacity bone | `lib/widgets/hero_section.dart` |
| Footer | Icon only, 16px | `lib/widgets/site_footer.dart` |
| System appendix card | Dark + light icon pair, primary lockup | `lib/widgets/system_section.dart` |
| Web splash screen | Tile (inline SVG on `#16161B`, radius 22px) | `web/index.html` |

## Usage

- **Clear space:** minimum = stroke weight × 2 (≈9px at 48px) on all sides. Nothing enters it.
- **Minimum size:** 16px icon, 96px wide for the primary lockup.
- **Placement:** top-left of the header, and once as an oversized 8%-opacity watermark behind the hero. Never twice at full strength on one screen.
- **Backgrounds:** `#0A0A0C`, `#16161B`, `#F2EEE7`, or a photograph at ≤35% luminance. Never on copper.
- **Never:** re-colour the bone half, add a stroke outline, skew, rotate, apply a shadow, place inside a circle, or animate the fold on every page load (once, on first visit only).
- **Animated form (not built):** the stroke draws itself in 640ms (`m-slow`) via path-metric extraction; the copper half draws 90ms behind the bone half. In Flutter: `CustomPainter` + `AnimatedBuilder` over `PathMetric.extractPath`.
- **Favicon set:** 16 / 32 / 180 (apple-touch) / 512 (maskable, tile variant #4).

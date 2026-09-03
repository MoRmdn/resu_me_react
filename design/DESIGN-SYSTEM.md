# MoRmdn — Design System v1.0
Personal brand system for **Mohamed Ramadan**, Flutter Developer — Mansoura, Egypt.
Codename: **Obsidian & Copper**.

> Source of truth for this repo's visual language. Implemented in
> `lib/utils/app_colors.dart` (tokens) and `lib/main.dart` (theme).
> See `design/IMPLEMENTATION-MAP.md` for the token → Dart mapping.

---

## 0. Brand posture

| | |
|---|---|
| Feeling | Engineered, warm, precise. A workshop, not a landing page. |
| Anti-pattern | Purple/blue gradient dev portfolio, glassmorphism cards, generic template rhythm. |
| Metaphor | **Layers.** Flutter builds UI by composing layers — the whole system is built from stacked planes, hairlines and offsets rather than shadows and blur. |
| Voice | First person, short sentences, numbers over adjectives. "4 years. 5 shipped apps. 6 countries." |

---

## 1. Color

Dark is the primary theme. Light ("Bone") is a supported inverse for print/résumé and system-light users.

### 1.1 Dark theme (default)

| Token | Value | Use |
|---|---|---|
| `--ink-900` | `#0A0A0C` | Page background |
| `--ink-800` | `#101013` | Section alternate background |
| `--ink-700` | `#16161B` | Surface / card |
| `--ink-600` | `#1E1E24` | Raised surface, input fill |
| `--line` | `rgba(242,238,231,0.10)` | Hairline borders, dividers |
| `--line-strong` | `rgba(242,238,231,0.20)` | Hover borders, focus ring base |
| `--bone` | `#F2EEE7` | Primary text (warm off-white, never pure `#fff`) |
| `--bone-70` | `rgba(242,238,231,0.70)` | Body text |
| `--bone-45` | `rgba(242,238,231,0.45)` | Secondary / captions |
| `--bone-28` | `rgba(242,238,231,0.28)` | Disabled, decorative numerals |
| `--copper` | `#F2762E` | **Primary accent** — links, active state, key numbers |
| `--copper-dim` | `#C25A1E` | Pressed accent |
| `--copper-wash` | `rgba(242,118,46,0.12)` | Accent fill, tag background |
| `--jade` | `#3FD8C0` | Status only: "available", success, live |
| `--rose` | `#FF6B6B` | Error / destructive only |

### 1.2 Light theme ("Bone")

| Token | Value |
|---|---|
| `--bg` | `#F2EEE7` |
| `--surface` | `#FFFFFF` |
| `--surface-alt` | `#E8E2D8` |
| `--text` | `#131316` |
| `--text-70` | `rgba(19,19,22,0.70)` |
| `--line` | `rgba(19,19,22,0.12)` |
| `--copper` | `#D95A15` (darkened for AA on bone) |

> Not yet implemented in the Flutter app — dark only. See "Not yet built" below.

### 1.3 Rules
- **One accent per viewport.** Copper marks the single most important thing on screen; if two things are copper, one is wrong.
- Never gradient two hues. The only permitted gradient is copper → transparent at ≤14% opacity (glow, underlines).
- Text contrast: body ≥ 4.5:1, large display ≥ 3:1. `--bone-28` is decorative only, never information.

---

## 2. Typography

Families (both Google Fonts):

- **Display / UI:** `Archivo` — 400 / 500 / 600 / 700. Wide-set grotesk with real personality at large sizes.
- **Mono / labels:** `JetBrains Mono` — 400 / 500. Used for eyebrows, indices, metadata, code.
- Arabic fallback: `IBM Plex Sans Arabic`.

> **Loading:** fonts come from a `<link>` in `web/index.html`, *not* the
> `google_fonts` package (it does not compile on this Flutter SDK — see
> `CLAUDE.md` § Known constraints). Dart-side, reference them by the exact
> family names `'Archivo'` and `'JetBrains Mono'`.

### 2.1 Scale (desktop → mobile)

| Role | Size / Line | Weight | Tracking | Notes |
|---|---|---|---|---|
| `display-xl` | 116 / 0.90 → 52 / 0.94 | 600 | −0.04em | Hero only, one per page |
| `display-l` | 72 / 0.95 → 38 | 600 | −0.035em | Section openers |
| `h1` | 44 / 1.05 → 30 | 600 | −0.03em | |
| `h2` | 30 / 1.15 → 24 | 600 | −0.02em | Card titles |
| `h3` | 21 / 1.25 → 19 | 600 | −0.01em | |
| `body-l` | 18 / 1.6 → 17 | 400 | 0 | Intro paragraphs, max 62ch |
| `body` | 15.5 / 1.65 | 400 | 0 | Default |
| `caption` | 13 / 1.5 | 400 | 0 | Secondary |
| `eyebrow` | 11 / 1 | 500 mono | **0.18em**, uppercase | Section labels, `01 / ABOUT` |
| `metric` | 46 / 1 | 600 | −0.03em | Stat numbers, copper |

> Implementation note: the app renders the hero at 84px desktop / 46px mobile
> rather than the 116px spec ceiling, to keep three lines on one screen at
> common laptop heights. Section openers render at 40px.

### 2.2 Rules
- Headings are tight (−0.02 to −0.04em) and never centred except on the hero.
- Measure caps at **62ch** for body, 46ch for intros.
- Numbers in metadata always mono, tabular figures (`FontFeature.tabularFigures()`).

---

## 3. Spacing & layout

4px base. Steps: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 176`.

- **Grid:** 12 columns, 24px gutter, max content width **1240px**, page padding 32px desktop / 20px mobile.
- **Section rhythm:** 128px vertical padding desktop, 76px mobile.
- **Breakpoints:** the app uses `sm 680 · md 900` (`AppConstants.mobileBreakpoint` / `tabletBreakpoint`); design reference used `sm 480 · md 768 · lg 1024 · xl 1440`.
- Asymmetry is the signature: content sits on a 7/5 or 8/4 split, not centred boxes.

---

## 4. Shape, border & elevation

| Token | Value |
|---|---|
| `--r-sm` | 6px (tags, inputs) |
| `--r-md` | 10px (buttons, small cards) |
| `--r-lg` | 16px (cards, panels) |
| `--r-xl` | 28px (hero panels, media) |
| `--r-pill` | 999px (status chips, nav) |

**Elevation is drawn with hairlines and offsets, not blur.**

- `e0` — flat: `1px solid --line`
- `e1` — card: `1px solid --line` + `0 1px 0 rgba(255,255,255,0.03) inset`
- `e2` — hover: `1px solid --line-strong` + `0 12px 32px rgba(0,0,0,0.45)`
- `e3` — overlay/menu: `0 24px 60px rgba(0,0,0,0.6)`
- `glow` — accent focus: `0 0 0 1px --copper, 0 0 40px rgba(242,118,46,0.18)`

Texture: a 3% film grain overlay across the whole page keeps the dark from feeling flat.
*(Not implemented in Flutter — see "Not yet built".)*

---

## 5. Components

### Buttons
| Variant | Idle | Hover | Pressed |
|---|---|---|---|
| **Primary** | copper fill, `#0A0A0C` label, `--r-md`, 14px/24px padding, 500 weight | brightness 1.08, lift `translateY(-2px)` | `translateY(0)`, copper-dim |
| **Ghost** | transparent, 1px `--line`, bone label | border `--line-strong`, bg `rgba(255,255,255,.04)` | bg `rgba(255,255,255,.02)` |
| **Text/link** | bone label + copper 1px underline offset 4px | underline grows from left (200ms) | — |

Height 44px min (touch target), icon 18px, gap 8px.

### Cards
Surface `--ink-700`, `--r-lg`, `e1`, 28px padding. Hover: `e2` + border warms to `rgba(242,118,46,.35)`. Card index in mono top-right at `--bone-28`.

### Navigation
Fixed pill bar, 58px tall, `rgba(22,22,27,0.72)` + `backdrop-filter: blur(20px)`, 1px `--line`, `--r-pill`. A 2px copper scroll-progress line sits at the very top of the viewport.

### Inputs
Fill `--ink-600`, 1px `--line`, `--r-md`, 14px padding, 15.5px Archivo. Label above in `eyebrow` mono. Focus: border copper. Error: `--rose` border + 13px message.

### Tags / chips
`--copper-wash` fill, copper label at 11px mono uppercase, `--r-sm`, 5/11 padding.

### Timeline (experience)
Each entry marked by a 8px square node (rotated 45°) that fills copper when the row is open. Rows are expanders: role + company + mono date range collapsed; responsibilities revealed on open.

### Metric block
Mono eyebrow above, `metric` number in copper, caption below in `--bone-45`. Always in groups of 3 or 4 with hairline dividers between.

---

## 6. Motion & animation

**Principles:** motion explains layout, never decorates. One thing moves at a time. Everything is interruptible.

| Token | Duration | Curve | Flutter equivalent |
|---|---|---|---|
| `m-instant` | 90ms | `cubic-bezier(.4,0,1,1)` | `Curves.easeIn` |
| `m-fast` | 180ms | `cubic-bezier(.2,0,.2,1)` | `Curves.easeOutCubic` |
| `m-base` | 320ms | `cubic-bezier(.22,1,.36,1)` | `Curves.easeOutExpo` |
| `m-slow` | 620ms | `cubic-bezier(.16,1,.3,1)` | `Curves.easeOutQuint` |

### Named behaviours (as built)
0. **Cursor field** — a 640px copper radial at 16% follows the pointer with
   0.075 lerp easing; desktop only, fades out when the pointer leaves.
   `lib/widgets/cursor_glow.dart`. Rebuild-free by construction: the position
   lives in a `ValueNotifier` passed to the painter as its `repaint`
   `Listenable`, so a move repaints one `RepaintBoundary` and never calls
   `setState` — see the warning in §"Not yet built" history and CLAUDE.md.
1. **Accordion** — 280ms `SizeTransition` + node fills copper, chevron rotates 90°. `lib/widgets/experience_timeline.dart`
2. **Marquee** — infinite horizontal tech strip, ~34px/s, pauses on hover. Ticker-driven `ScrollController` offset. `lib/widgets/tech_marquee.dart`
3. **Number roll** — metrics count up once on load, 900ms `easeOutQuart`, mono tabular so width never jitters. `lib/widgets/hero_section.dart`
4. **Card lift** — 220ms `AnimatedContainer`: `translateY(-3)` + border warms to copper + drop shadow.
5. **Button lift** — 180ms: `translateY(-2)` + fill brightens to `--copper-bright` `#FF8A45`.
6. **Scroll progress** — 2px copper bar at viewport top, width tracks scroll fraction.
7. **Section scroll** — 700ms `easeOutCubic` via `Scrollable.ensureVisible`.

---

## 7. Accessibility
- Hit targets ≥ 44×44.
- Colour never the sole carrier of meaning — status chips pair colour with a text label ("CURRENT", "Open to work").
- Contrast: body ≥ 4.5:1, large display ≥ 3:1.

---

## Not yet built

Tracked gaps between this spec and the Flutter implementation:

- **Light ("Bone") theme** — tokens specced in §1.2, no Flutter implementation.
- **Film grain overlay** — §4, would need a tiled `CustomPainter` or asset.
- **`prefers-reduced-motion`** — §6 principle; Flutter web can read
  `MediaQuery.disableAnimations`, not currently wired up.
- **Focus rings** — the `glow` token is specced but no `FocusNode` styling exists.
- **Logo draw-on animation** — §LOGO.md specs a 640ms stroke draw; the mark
  renders statically.

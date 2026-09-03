# MoRmdn — Design System v2.0
Personal brand system for **Mohamed Ramadan**, Flutter Developer — Mansoura, Egypt.
Codename: **Obsidian & Copper**.

> Source of truth for this repo's visual language. Implemented in
> `lib/utils/app_colors.dart` (tokens) and `lib/main.dart` (theme).
> See `design/IMPLEMENTATION-MAP.md` for the token → Dart mapping.

> **v2.0 — structural redesign (Sept 2026).** Palette, type, logo and motion
> tokens are unchanged from v1.0. What changed: the accent rule is now tiered
> (§1.3), the page is built from overlapping planes rather than stacked
> sections (§3.1), three new components are specced (§5.1), the motion system
> is fully specified per section with reduced-motion fallbacks (§6.1), and the
> film grain is specced for build (§4). Reference artboards:
> `Portfolio Redesign.dc.html` — 1a desktop 1440, 1b mobile 390,
> 1c components, 1d interaction, 1e the AYCO private card.

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

**Accent tiers (v2.0).** v1.0's "one accent per viewport" was contradicted by
the same document's copper primary buttons and copper metric numbers — a hero
built to spec carried four copper elements. The rule is now tiered, and the
*tier* is what's limited, not the hue:

| Tier | What | Limit |
|---|---|---|
| **1** | Solid copper fill (`--copper` background) | **Max one per viewport.** It is always the primary action. |
| **2** | Full-chroma copper text or stroke | **Max one per viewport**, and never in the same viewport as a Tier 1. |
| **3** | `--copper-wash`, copper hairlines, any copper at ≤38% | Unlimited. This is material, not accent. |

Consequences, applied across both artboards:

- The hero headline no longer accents its final word — the CTA is that
  viewport's Tier 1. `hero.headlineAccentIndex` in `content/copy.ts` is
  retained for data fidelity but not rendered.
- All three track-record metrics are `--bone`, not copper.
- Live values (page views, "Open to work", "CURRENT") are `--jade` — jade is
  the status hue and is exempt from the accent count.
- The logo's copper half is exempt as identity.
- The AYCO private card carries **zero** copper at any tier. Copper marks the
  reachable; nothing on that card is reachable.
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

### 3.1 Plane rhythm (v2.0)

The page is composed of overlapping planes, not stacked full-bleed sections —
the same layer metaphor the brand is built on.

- **Held hero.** The hero occupies one viewport height and is *held*: the
  following plane slides up over it. The marquee's top hairline is the seam.
- **Overlap, don't butt.** Consecutive planes overlap by `-40px` (About over
  the marquee by `-1px`) with their own background, so the join reads as one
  surface passing under another. Never two flush slabs.
- **Two backgrounds only.** Planes alternate `--ink-900` / `--ink-800`. No third.
- **Section padding** 112–128px desktop / 76px mobile, measured to the plane, not the overlap.
- The oversized logo watermark appears exactly once, behind the hero, at 5.5%.

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

### Film grain (specced v2.0)

A single tiled fractal-noise layer across the page keeps the dark from
flattening. Exact spec:

- One 180×180 SVG `feTurbulence` tile — `type="fractalNoise"`,
  `baseFrequency="0.85"`, `numOctaves="3"` — repeated as a background image.
- `position: fixed; inset: 0; pointer-events: none;` at **3% opacity**.
- Stacking: above section backgrounds, **below body text and the nav pill**, so
  type stays crisp.
- Excluded from the flagship device screenshot so the shot is not degraded.
- **Static. Never animated, never per-section, never parallaxed.**
- `prefers-reduced-motion`: unaffected — it does not move.

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
Mono eyebrow above, `metric` number in **`--bone`** (v2.0 — was copper; see
§1.3 tiers), caption below in `--bone-45`. Always in groups of 3 or 4 with
hairline dividers between. Live/streamed values take `--jade`.

## 5.1 New components (v2.0)

### Career band (Experience index)
A duration-weighted bar chart that doubles as an index into the timeline below.

- Seven columns, oldest → newest left to right, `flex` proportional to months served.
- Height `40 + months × 2.2` px desktop (×0.6 mobile), 104px container, 4px gaps.
- `--r-sm` on the top corners only; no bottom border — the columns sit on the axis hairline.
- Idle `rgba(242,238,231,.06)` + `--line`. Selected: `--copper-wash` fill,
  `rgba(242,118,46,.35)` border, +14px height (Tier 3 — not an accent).
- Start year in 10px mono at the foot of each column; axis labelled `2021` / `NOW`.
- Clicking a column opens the matching timeline row. Keyboard: arrow keys move
  selection, Enter opens.

### Skills plate
Replaces v1.0's flat hairline table.

- Six plates, one per capability group, stacked with 10px gaps.
- Staggered on the 7/5 split: odd-indexed plates indent 88px.
- Inside each: index numeral in 56px mono at `--line` (decorative), group name in
  **26px JetBrains Mono** `--bone`, capability count in eyebrow mono, then the
  items as hairline tags on the 5-column side.
- Group 01 (Languages & frameworks) takes the section's single Tier 2 copper on
  its group name. No other plate is accented.
- Card surface `--ink-700`, `--r-lg`, `e1`. Hover: border → `rgba(242,118,46,.35)`, fill → `--ink-600`.

### Private-project card
For work with no public listing (AYCO). Must read as deliberate, never as a broken card.

- **Dashed** hairline border, `--ink-800` fill — the border itself says "unlisted".
  Every other card is solid.
- Store buttons are **replaced, not removed**: a build ledger (files / tests /
  functions) occupies the slot the links hold on every other card.
- Always expanded — no Open affordance, since there is nothing behind it.
- The longest card in the section, not the thinnest: absence of links must read
  as depth, not gap.
- Closes with an explicit line naming the NDA. Unexplained absence looks broken;
  stated absence looks professional.
- Zero copper at any tier. No hover warm, no lift.

---

## 6. Motion & animation

**Principles:** motion explains layout, never decorates. One thing moves at a time. Everything is interruptible.

| Token | Duration | Curve | Flutter equivalent |
|---|---|---|---|
| `m-instant` | 90ms | `cubic-bezier(.4,0,1,1)` | `Curves.easeIn` |
| `m-fast` | 180ms | `cubic-bezier(.2,0,.2,1)` | `Curves.easeOutCubic` |
| `m-base` | 320ms | `cubic-bezier(.22,1,.36,1)` | `Curves.easeOutExpo` |
| `m-slow` | 620ms | `cubic-bezier(.16,1,.3,1)` | `Curves.easeOutQuint` |

### 6.1 Specification (v2.0)

**Entrance baseline.** Section children rise 24px and fade in, 60ms stagger in
source order, `m-base`, fired by an `IntersectionObserver` **once** at 18% into
the viewport — never replayed on scroll-up. Reveals animate transform and
opacity only, never height or layout, so any reveal can be interrupted
mid-flight without reflow. Scroll-linked values are clamped and lerped, never
driven off raw scroll position.

**The one memorable moment — a project card opens spatially.** Clicking a
project row does not navigate, modal, or crossfade. In one 320ms `m-base`
curve the card un-indents to the grid's left edge, scales to 1.012, lifts to
`e3`, and unfolds its detail plane from zero height, while its four siblings
drop to 38% opacity and 0.985 scale in the same beat — the page recedes so one
plane can come forward. Clicking again reverses exactly; clicking a different
card hands state over mid-flight with no snap. Nothing else on the page
animates while a card is open. This is the *only* signature moment; the rest of
the system stays quiet.

**Global reduced-motion fallback.** One media query zeroes every duration and
iteration count to 0.001ms; the per-effect fallbacks below then restore end
states so nothing is left mid-transform. Count-ups render final values, the
logo renders complete, the marquee holds still and becomes a horizontally
scrollable strip.

| Section | What animates | Trigger | Duration · curve | Reduced motion |
|---|---|---|---|---|
| Global | Section reveal — children rise 24px, fade, 60ms stagger | IO once, 18% into viewport | 320ms · `m-base` | Final state on first paint |
| Global | Scroll-progress line, 2px copper, width = scroll fraction | Scroll, rAF-throttled, clamped | Continuous, no easing | Static at 0%; orientation only |
| Global | Film grain, 3% fixed tile | Painted once on load | Static | Unaffected |
| Nav | Pill blur + border resolve as the hero seam passes under | Scroll past 60px | 180ms · `m-fast` | Permanently on |
| Nav | Active-link pill — 4% white fill slides between links | Scroll-spy change | 180ms · `m-fast` | Fill jumps, no slide |
| Nav | Hire me — brightens to `--copper-bright`, lifts 2px | Hover / focus | 180ms · `m-fast` | Colour only, no lift |
| Nav | Mobile sheet drops from the pill, links stagger 40ms | Hamburger tap | 320ms · `m-base` | Sheet in place; scrim cross-fades |
| Hero | Logo draws itself — bone stroke, copper half 90ms behind | First visit only (localStorage flag) | 640ms · `m-slow` | Renders complete |
| Hero | Headline lines rise 32px, fade, 80ms stagger | On load, after fonts settle | 620ms · `m-slow` | Final state |
| Hero | Track-record numbers count up, tabular figures | On load, once | 900ms · easeOutQuart | Final values immediately |
| Hero | Live view count — jade dot pulses, number ticks | Firebase stream | 90ms · `m-instant` on change | Dot steady, no transition |
| Hero | Hero held at viewport height; next plane slides over it | Scroll | Scroll-linked, clamped | Hero scrolls away normally |
| Marquee | Strip translates −50% of doubled width | Autoplay on load | 34s linear, infinite | Stops; becomes scrollable row |
| Marquee | Pauses on hover | Pointer enter / leave | Instant play-state change | N/A |
| About | Four metric cells wipe in L→R, 60ms stagger | Grid enters viewport | 320ms · `m-base` | All visible at once |
| Experience | Band columns grow from baseline, 40ms stagger oldest→newest | Band enters viewport | 620ms · `m-slow` | Final height |
| Experience | Active column grows 14px, fills copper-wash | Click / keyboard select | 320ms · `m-base` | No transition |
| Experience | Row expands, node fills copper, ＋ rotates 45° | Click / Enter | 320ms · `m-base` | Toggles instantly |
| Projects | Flagship screenshot parallaxes 40px slower than its panel | Scroll in view | Scroll-linked, lerp 0.1 | Static in frame |
| Projects | **Card opens spatially** (see above) | Click / Enter | 320ms · `m-base` | Instant at final size; siblings 100% |
| Projects | AYCO dashed border draws around the perimeter once | Card enters viewport, +120ms | 620ms · `m-slow` | Fully drawn from first paint |
| Skills | Plates slide in from their stagger side, 60ms apart | Plate enters viewport | 320ms · `m-base` | Render in place |
| Skills | Plate hover — border warms, fill → `--ink-600` | Hover | 180ms · `m-fast` | Colour only |
| Contact | Field border → copper | Focus | 180ms · `m-fast` | Instant |
| Contact | Error drops in 6px + fades, border → `--rose` | Failed validation, submit or blur | 180ms · `m-fast` | Appears in place |
| Contact | Social rows nudge 10px right | Hover | 180ms · `m-fast` | Background tint only |
| Contact | Submit → sending → success label cross-fade, jade confirm drops in | Submit | 180ms · `m-fast` per step | Labels swap instantly |
| Footer | Back to top | Click | 700ms · easeOutCubic | Instant jump |

**Cut in v2.0:** the cursor-glow field (§6 behaviour 0). It decorated rather
than explained, and competed with the film grain for the same job.

### Named behaviours (v1.0, as built in Flutter)
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

Tracked gaps between this spec and the Next.js implementation:

- **Light ("Bone") theme** — tokens specced in §1.2, no implementation.
- **Film grain overlay** — now fully specced in §4; not yet in the app.
- **`prefers-reduced-motion`** — the global query plus the 28 per-effect
  fallbacks in §6.1 are specced; not yet wired.
- **Focus rings** — the `glow` token is specced but no focus styling exists.
  The artboards draw a `0 0 0 1px copper, 0 0 0 4px copper-28` ring on the
  primary button as the reference.
- **Logo draw-on animation** — LOGO.md specs a 640ms stroke draw; drawn in the
  artboards, static in the app. Must be gated to first visit only.
- **Career band, Skills plates, private-project card** — specced in §5.1,
  drawn in the artboards, not yet built.
- **Held hero / plane overlap** — §3.1; the app is still a flush vertical stack.

---

## Change log

**v2.0 — Sept 2026.** Tiered accent rule (§1.3) resolving the one-accent
contradiction · plane rhythm and held hero (§3.1) · film grain fully specced
(§4) · career band, Skills plate and private-project card (§5.1) · complete
per-section motion spec with reduced-motion fallbacks (§6.1) · cursor glow cut.
Palette, type scale, spacing base, shape tokens, elevation and motion tokens
unchanged.

**v1.0.** Initial system, implemented in Flutter.

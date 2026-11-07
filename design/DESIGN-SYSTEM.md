# MoRmdn — Design System v2.0
Personal brand system for **Mohamed Ramadan**, Software Engineer — Mansoura, Egypt.
Codename: **Obsidian & Copper**.

> Source of truth for this repo's visual language. Implemented in
> `app/globals.css` (tokens and the animation layer), Tailwind utilities and the
> React components. Historical Flutter artboards remain design references, not
> implementation guidance.

> **v2.0 — structural redesign (Sept 2026).** Palette, type, logo and motion
> tokens are unchanged from v1.0. What changed: the accent rule is now tiered
> (§1.3), the page is built from overlapping planes rather than stacked
> sections (§3.1), three new components are specced (§5.1), the motion system
> is fully specified per section with reduced-motion fallbacks (§6.1), and the
> film grain is implemented (§4). Reference artboards:
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
| `--bone-52` | `rgba(242,238,231,0.52)` | Contrast floor for secondary text / captions |
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

> Light-theme tokens remain a design specification; the Next.js site currently
> ships dark only. See "Implementation status" below.

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

Families:

- **Display / UI:** `Archivo` — 400 / 500 / 600 / 700. Wide-set grotesk with real personality at large sizes.
- **Mono / labels:** `JetBrains Mono` — 400 / 500. Used for eyebrows, indices, metadata, code.
- **Arabic:** `IBM Plex Sans Arabic` — 400 / 500, with its own heading rhythm and RTL layout.

> **Loading:** variable font files are committed under `app/fonts/` and loaded
> with `next/font/local` in `components/DocumentShell.tsx`. Do not add a Google
> Fonts `<link>` or switch to `next/font/google`; self-hosting keeps the export
> reproducible and avoids a render-blocking third-party request.

### 2.1 Scale (desktop → mobile)

| Role | Size / Line | Weight | Tracking | Notes |
|---|---|---|---|---|
| `display-xl` | 116 / 0.90 → 52 / 0.94 | 600 | −0.04em | Hero only, one per page |
| `display-l` | 72 / 0.95 → 38 | 600 | −0.035em | Section openers |
| `h1` | 44 / 1.05 → 30 | 600 | −0.03em | |
| `h2` | 30 / 1.15 → 24 | 600 | −0.02em | Card titles |
| `h3` | 21 / 1.25 → 19 | 600 | −0.01em | |
| `body-l` | 18 / 1.6 → 17 | 400 | 0 | Intro paragraphs, max 62ch |
| `body` | 16 / 1.65 | 400 | 0 | Default |
| `caption` | 13 / 1.5 | 400 | 0 | Secondary |
| `eyebrow` | 11 / 1 | 500 mono | **0.18em**, uppercase | Section labels, `01 / ABOUT` |
| `metric` | 46 / 1 | 600 | −0.03em | Stat numbers, bone |

> Implementation note: the app renders the hero at 84px desktop / 46px mobile
> rather than the 116px spec ceiling, to keep three lines on one screen at
> common laptop heights. Section openers render at 40px.

### 2.2 Rules
- Headings are tight (−0.02 to −0.04em) and never centred except on the hero.
- Measure caps at **62ch** for body, 46ch for intros.
- Numbers in metadata always use mono, tabular figures (`font-variant-numeric: tabular-nums`).

---

## 3. Spacing & layout

4px base. Steps: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 176`.

- **Grid:** 12 columns, 24px gutter, max content width **1240px**, page padding 32px desktop / 20px mobile.
- **Section rhythm:** 128px vertical padding desktop, 76px mobile.
- **Breakpoints:** the Tailwind tokens are `sm 680 · md 900 · lg 1040 · xl 1240`; the Arabic desktop hero also has a targeted adjustment from 768px.
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

### Film grain

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
Reserved for future forms: fill `--ink-600`, 1px `--line`, `--r-md`, 14px padding, 16px Archivo. Label above in `eyebrow` mono. Focus: border copper. Error: `--rose` border + 13px message. Contact currently ships no form.

### Tags / chips
`--copper-wash` fill, copper label at 11px mono uppercase, `--r-sm`, 5/11 padding.

### Timeline (experience)
Each entry marked by a 8px square node (rotated 45°) that fills copper when the row is open. Rows are expanders: role + company + mono date range collapsed; responsibilities revealed on open.

### Metric block
Mono eyebrow above, `metric` number in **`--bone`** (v2.0 — was copper; see
§1.3 tiers), caption below in `--bone-52`. Always in groups of 3 or 4 with
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

- Shares the featured-panel layout, screens included. What stays its own is below.
- **Dashed** hairline border, `--ink-800` fill — the border itself says "unlisted".
  Every other card is solid.
- Store buttons are **replaced, not removed**: a capability ledger (offline visits / Arabic reports /
  devices per batch) occupies the slot the links hold on every other card.
- Closed by default like every featured panel. Its highlights are the depth, so
  absence of links must read as more behind the click, not less.
- Names private delivery explicitly. Do not claim an NDA without evidence.
- Zero copper at any tier. No hover warm, no lift.

### Featured panel
The big projects, closed to a face by default so the section can be scanned.
The face is the pitch: art, name, one line, outcome, store links. The long story,
highlights, stack and application ID unfold under it.

- Full width on a 5/7 split from `md`, with the art changing sides from one panel
  to the next. Surface `--ink-700`, `--r-lg`, `e1`. Hover warms the border
  (Tier 3), and it stays warm while open.
- The whole face opens it, store links excepted. Panels open independently and
  nothing recedes: §6.1's dimming belongs to the gallery alone.
- Closed details stay in the DOM so the copy is in the served HTML. CSS hides
  them before hydration, then they become `inert`; without JavaScript every
  panel stands open and remains keyboard-accessible.
- Three store-listing screens from one listing, whole, on a stepped baseline
  (0 / 28 / 14px), capped at 560px across. Hover squares the set up. Below `sm`
  the set becomes a scroller of its own, with no stepped baseline.
- A project with raw captures and no store art goes through `npm run promos`:
  brand ground, headline, the capture in a drawn device. Headlines come from the
  project's own listing copy.
- Outcome reads at `h3`. Links are ghost buttons. No copper at rest: the art is
  the colour on these panels.

### Project gallery
Everything that is not a featured panel, as a wall of art.

- Four columns from `lg`, two below. The first tile spans two, which is what
  fills both grids with seven tiles. Plates are 5:6, or 4:3 between `sm` and `lg`,
  where two columns would otherwise make them taller than the screen.
- Art is shown whole on `--ink-800`, never cropped. A project with no art gets a
  two-letter mono monogram in `--bone-18`, so the plate reads as set rather than
  as an image that failed to load.
- Opens in place. See §6.1.

### Review card
A client's words, attributed to the marketplace that collected them.

- Surface `--ink-700`, `--r-lg`, `e1`, 24px padding. Two portable widths: 372 base
  and 520 wide. The site grid stretches cards to equal columns.
- Under 90 characters a quote is set as a 24px pull quote, so it does not strand
  in an empty card.
- The platform's logo is identity, like our own mark, and exempt from the accent
  tiers. Its `--color-brand-*` appears only on that mark and that card's hover.
  **No copper on a review card at any tier.**
- Five CSS-shaped stars are `--bone-70` at rest. They share one clip-path in the
  portable stylesheet rather than repeating inline SVG paths. Colour never
  carries the rating alone: the accessible label and visible `5.0` remain.
- Arabic quotes render RTL in IBM Plex Sans Arabic. Translations are labelled
  and the verbatim original lives in a native disclosure at every width.
- Hover: lift 4px, border warms to the brand at 45%, a 2px hairline wipes in from
  the left, stars fill and pop in 50ms sequence. The site grid has no looping
  motion; rows pause on hover only in the standalone export's animated wall.

### Client map
Fiverr's "World Domination" panel, for all five marketplaces at once.

- Land is `--ink-600`. Client countries are copper at 16–38%, log-scaled so one
  large market cannot wash out the rest. That keeps the whole map Tier 3.
- Mansoura is the `--jade` pin. It is a status, not an accent, and every line
  starts there.
- The percentage is countries out of 195, in `--bone`. Filtering by site recounts
  it, so the Fiverr view matches Fiverr's own figure.
- Everything on the map is also in the ranked list, which is what keyboards,
  screen readers and crawlers use. Hovering either one lights both.
- Clients with no public country stay off the map and are stated in a note.

---

## 6. Motion & animation

**Principles:** motion explains layout, never decorates. One thing moves at a time. Everything is interruptible.

| Token | Duration | Curve |
|---|---|---|
| `m-instant` | 90ms | `cubic-bezier(.4,0,1,1)` |
| `m-fast` | 180ms | `cubic-bezier(.2,0,.2,1)` |
| `m-base` | 320ms | `cubic-bezier(.22,1,.36,1)` |
| `m-slow` | 620ms | `cubic-bezier(.16,1,.3,1)` |

### 6.1 Specification (v2.0)

**Entrance baseline.** Section children rise 24px and fade in, 60ms stagger in
source order, `m-base`, fired by an `IntersectionObserver` **once** at 18% into
the viewport — never replayed on scroll-up. Reveals animate transform and
opacity only, never height or layout, so any reveal can be interrupted
mid-flight without reflow. Scroll-linked values are clamped and lerped, never
driven off raw scroll position.

**The one memorable moment — a gallery tile opens spatially.** Clicking a
tile does not navigate, modal, or crossfade. In one 320ms `m-base` curve the
tile scales to 1.012, lifts to `e3`, and a detail plane unfolds from zero height
under its row, while its siblings drop to 38% opacity and 0.985 scale in the
same beat — the page recedes so one plane can come forward. Clicking again
reverses exactly; clicking a different tile hands state over mid-flight with no
snap. Nothing else on the page animates while a tile is open. This is the *only*
signature moment; the rest of the system stays quiet.

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
| Projects | **Tile opens spatially** (see above) | Click / Enter | 320ms · `m-base` | Instant at final size; siblings 100% |
| Projects | Store screens square up from their stepped baseline | Panel hover | 320ms · `m-base` | Stay stepped; no movement |
| Projects | AYCO dashed border draws around the perimeter once | Card enters viewport, +120ms | 620ms · `m-slow` | Fully drawn from first paint |
| Skills | Plates slide in from their stagger side, 60ms apart | Plate enters viewport | 320ms · `m-base` | Render in place |
| Skills | Plate hover — border warms, fill → `--ink-600` | Hover | 180ms · `m-fast` | Colour only |
| Reviews | Static grid, six reviews followed by native disclosure | User opens more reviews | No looping motion | Same static grid |
| Reviews | Card lifts, hairline wipes, stars pop in sequence | Hover | 320ms · `m-base` | Colour only |
| Reviews | Platform counts roll up | Ledger enters viewport | 900ms · easeOutQuart | Final values immediately |
| Reviews | Map intro: pin lands, lines leave nearest-first at 70ms apart, each country fills as its line arrives | Block enters viewport | 620ms · `m-slow` per line | Finished map on first paint |
| Reviews | Filter by site: countries, lines and bars cross-fade, percentage recounts | Chip click | 320ms · `m-base` | Colour only; final value |
| Reviews | Country, line and list row light together, tooltip appears | Hover, focus or tap | 180ms · `m-fast` | Colour only |
| Reviews | Jade ring pulses on Mansoura | Continuous | 2.4s | Ring static |
| Contact | Social rows nudge 10px right | Hover | 180ms · `m-fast` | Background tint only |
| Footer | Back to top | Click | 700ms · easeOutCubic | Instant jump |

**Cut in v2.0:** the cursor-glow field (§6 behaviour 0). It decorated rather
than explained, and competed with the film grain for the same job.

### Current implementation notes
0. **Cursor field** — cut. No pointer-follow effect ships; pointer movement must
   never drive React state if a future effect is reconsidered.
1. **Accordion** — CSS grid rows animate over 280ms; the node fills copper and
   the chevron rotates. Closed content remains server-rendered and becomes
   inert only after hydration.
2. **Marquee** — CSS translates an exactly doubled max-content track, pauses on
   hover/focus, and becomes a static horizontal scroller under reduced motion.
3. **Number roll** — metrics count up once when observed, 900ms, with mono
   tabular figures so width never jitters.
4. **Card lift** — 320ms transform plus a brand/copper hairline; reduced motion
   retains the final visual state without movement.
5. **Button lift** — 180ms transform and colour change; reduced motion removes
   the lift.
6. **Scroll progress** — a 2px copper bar at viewport top, transform updated in
   a passive, rAF-throttled scroll listener.
7. **Section scroll** — native smooth anchors with an instant reduced-motion
   fallback and scroll margins for the fixed nav.

---

## 7. Accessibility
- Hit targets ≥ 44×44.
- Colour never the sole carrier of meaning — status chips pair colour with a text label ("CURRENT", "Open to work").
- Contrast: body ≥ 4.5:1, large display ≥ 3:1.

---

## Implementation status

The Next.js implementation includes the film grain, global and per-effect
reduced-motion fallbacks, focus rings, first-load hero logo drawing, career band,
Skills plates, private-project card and held hero/plane overlap described above.
The cursor-glow field remains intentionally cut, and Contact uses direct channels
rather than the old form.

- **Light ("Bone") theme** — tokens remain specced in §1.2, with no implementation.

---

## Change log

**v2.0 — Sept 2026.** Tiered accent rule (§1.3) resolving the one-accent
contradiction · plane rhythm and held hero (§3.1) · film grain fully specced
(§4) · career band, Skills plate and private-project card (§5.1) · complete
per-section motion spec with reduced-motion fallbacks (§6.1) · cursor glow cut.
Palette, type scale, spacing base, shape tokens, elevation and motion tokens
unchanged.

**v1.0.** Initial system, implemented in Flutter.


### Portfolio enhancement — November 2026

- A compact marketplace summary follows the technology strip. The first featured
  project leads with its artwork; three verbatim testimonials follow it as
  supporting evidence, before the remaining featured projects.
- Featured projects show their outcome and availability on the face, followed by problem, responsibility, decisions and result inside the existing detail plane.
- Reviews use a static 1/2/3-column grid at phone/768px/1024px widths. Six appear initially; native disclosure contains the remaining server-rendered reviews. No loop or cloned review tracks remain on the site.
- Reviews show the document language first. Translations are labelled, with originals in an accessible native disclosure; no original is rewritten.
- Five rating stars share a portable CSS clip-path rather than repeating inline SVG paths; rating text and reduced-motion behavior remain unchanged.
- Skills retain all content with 18px plate padding, tighter tags and smaller headings below 768px. Desktop plates retain their arrangement.
- English remains at `/`; Arabic lives at `/ar/`. Arabic uses IBM Plex Sans Arabic, logical layout properties and RTL text. Logos, screenshots and geographic coordinates are not mirrored.
- Languages share project identifiers, assets, metrics and contact links. Availability labels describe supplied links rather than promising current store availability.

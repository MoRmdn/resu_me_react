# MoRmdn — Design System v3.0
Personal brand system for **Mohamed Ramadan**, Software Engineer — Mansoura, Egypt.
Codename: **Obsidian & Copper**.

> Source of truth for this repo's visual language. Implemented in
> `app/globals.css` (tokens and the animation layer), Tailwind utilities and the
> React components. Historical Flutter artboards remain design references, not
> implementation guidance.

> **v3.0 — Ledger (November 2026).** Direction A of the Claude Design project
> "Flutter portfolio redesign" (page *Portfolio Directions*). Light ruled paper
> by default with the Obsidian dark theme a toggle away, wide Archivo for
> display, mono figures, and one signature: Ledger numbering, `01–06`, on the
> section eyebrows, the left rail and the menu sheet, and nowhere else.

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

Light ("Ledger") and dark ("Obsidian") follow the system setting by default
(auto). The nav toggle cycles auto → light → dark, and a manual choice is kept. The token **names** are roles shared by both themes:
`ink-*` are the ground planes, `bone*` the foreground ramp. Values live in
`app/globals.css`: light in `@theme`, dark under `:root[data-theme="dark"]`
and `@media (prefers-color-scheme: dark)` for visitors without JavaScript.

### 1.1 Values

| Token | Ledger (light) | Obsidian (dark) | Use |
|---|---|---|---|
| `ink-900` | `#F5F5F2` | `#100E0D` | Page: ruled paper |
| `ink-800` | `#E8E9E4` | `#171412` | Alternate band |
| `ink-700` | `#FFFFFF` | `#201C19` | Sheet / card |
| `ink-600` | `#EEEEE9` | `#292420` | Raised surface, input fill |
| `bone` | `#16181C` | `#F2EEE7` | Primary text |
| `bone-70` | ink at 0.78 | bone at 0.70 | Body text |
| `bone-62` | ink at 0.72 | bone at 0.62 | Secondary text |
| `bone-52` | ink at 0.66 | bone at 0.52 | **Contrast floor** (≥ 4.5:1 on every ground of its theme) |
| `bone-38 … 06` | — | — | Decoration only, never a word a reader needs |
| `line` / `line-strong` | ink at 0.10 / 0.18 | bone at 0.10 / 0.20 | Hairlines |
| `copper` | `#A3460F` | `#F2762E` | The one accent |
| `copper-bright` | `#8C3C0C` | `#FF8A45` | Hover |
| `on-copper` | `#FFFFFF` | `#100E0D` | Text on a copper fill |
| `jade` | `#0B655A` | `#3FD8C0` | Status only: available, current, live |
| `shadow` | ink at 0.14 | black at 0.55 | The few things that float |

Light copper and jade are darker than the Ledger artboard's `#B04E17` and
`#0D7366` so each holds 4.5:1 as text on every light ground.

### 1.2 The ink band

Contact and the footer carry the `band` class, which applies the Obsidian
values in both themes: the ledger's closing page. In the dark theme the band
steps up to `#171412` so it still reads apart.

### 1.3 Rules

- **One copper fill per viewport, and it is the primary action.** The hero's
  Start a project and Contact's WhatsApp cell. The island's Hire me is ink-solid
  (`bg-bone text-ink-900`), never copper, because it shares the first viewport
  with the hero CTA.
- Copper may also mark one thing in a component: the open timeline bar, the
  progress ring, the focus ring.
- The logo's copper half is identity and exempt.
- The AYCO private card carries **zero** copper.
- Jade is status only and always paired with a word.
- Text contrast: body ≥ 4.5:1, large display ≥ 3:1. Check both themes.

---

## 2. Typography

- **Display / UI:** `Archivo`, variable `wght 400–600` × `wdth 100–118`.
  Page and section titles (`h1`, `h2`) set
  `font-variation-settings: "wdth" 118`; card and project names (`h3`) and body
  stay at 100, because wide type at 24px reads as squashed. The `wide` utility applies 118 elsewhere. The committed file is
  instanced to exactly that range (Latin subset, ~37 KB).
- **Mono:** `JetBrains Mono` 400 / 500 for figures, dates, counts and the
  Ledger numbers. Always `tabular`.
- **Arabic:** `IBM Plex Sans Arabic` 400 / 500. No width axis, tracking 0,
  heading line height 1.4.

> **Loading:** files are committed under `app/fonts/` and loaded with
> `next/font/local` in `components/DocumentShell.tsx`. No Google Fonts `<link>`,
> no `next/font/google`.

### 2.1 Scale

| Role | Size | Weight | Tracking | Notes |
|---|---|---|---|---|
| `.hero-headline` | 42 → 88 | 500 | −0.045em | Hero only, line height 0.98 |
| `display-xl` | 40 → 88 | 500 | −0.045em | Contact title |
| `display-l` | 32 → 54 | 500 | −0.035em | Section titles, line height 1.02 |
| `h1` | 30 → 44 | 500 | −0.03em | |
| `h2` | 24 → 30 | 600 | −0.02em | Card titles |
| `h3` | 19 → 21 | 600 | −0.01em | |
| `body-l` | 17 → 18 | 400 | 0 | Intro paragraphs, max 62ch |
| `body` | 16 | 400 | 0 | Default |
| `caption` / `eyebrow` | 13 | 400 / 500 | 0 | Sentence case, never tracked uppercase |

### 2.2 Rules

- Hierarchy is size and colour, not weight. 700 is not loaded.
- No trailing period on headlines, labels or buttons.
- Numbers are mono and tabular, in one format across the page.

---

## 3. Spacing & layout

4px base. Steps: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 176`.

- **Grid:** 12 columns, 24px gutter, max content width **1240px**, page padding 32px desktop / 20px mobile.
- **Section rhythm:** 128px vertical padding desktop, 76px mobile.
- **Breakpoints:** the Tailwind tokens are `sm 680 · md 900 · lg 1040 · xl 1240`; the Arabic desktop hero also has a targeted adjustment from 768px.
- Asymmetry is the signature: content sits on a 7/5 or 8/4 split, not centred boxes.

### 3.1 Ledger hero and section rhythm

- Hero: a status line (jade dot, "Taking new projects", role and place), the
  headline, then a 5/7 split: intro and two actions on the start side, the
  figure on the end side (Lpermis and Mutabbib store promos and AYCO's home screen on a white
  sheet at staggered tops 0 / 32 / 16px). Under it the ledger strip: a
  four-cell hairline `<dl>` (based in, shipping since, teams, now) with mono
  values derived from `content/`.
- Sections sit flush, 120px vertical padding desktop and 80px mobile, divided by
  hairlines. Grounds: hero paper, tech strip band, proof line sheet, About paper,
  Experience band, Projects paper, Skills band, Reviews paper, Contact ink band.
- Every section title is preceded by its Ledger number. Nothing else on the
  page uses `01–06`.

---

## 4. Shape, border & elevation

| Token | Value |
|---|---|
| `--r-sm` | 6px (tags, inputs) |
| `--r-md` | 10px (buttons, small cards) |
| `--r-lg` | 16px (cards, panels) |
| `--r-xl` | 28px (hero panels, media) |
| `--r-pill` | 999px (status chips, nav) |

**Elevation is drawn with hairlines and surface steps.** A soft neutral
`--color-shadow` appears only on what floats: the nav island and its sheet,
the hero figure, the map tooltip. No coloured shadows, no glow, no grain.

---

## 5. Components

### Buttons
| Variant | Idle | Hover | Pressed |
|---|---|---|---|
| **Primary** | copper fill, `on-copper` label, `--r-md`, 600 weight | `copper-bright` | `copper-dim` |
| **Ghost** | transparent, 1px `line-strong`, bone label | border `bone` | — |
| **Ink** | `bone` fill, `ink-900` label, pill (the island's Hire me) | `bone-70` | — |

Height 44px min (touch target), icon 18px, gap 8px.

### Cards
Use the `--ink-700` surface, `--r-lg` radius, and a neutral hairline. Interactive cards use a stronger hairline or a surface step to show state.

### Navigation
- **Island.** A fixed 56px pill, centred, on `ink-800` with a hairline and the
  soft shadow: the mark, the section toggle (progress ring, active section,
  `n/6`), the section links that slide open beside it (with the auto / light / dark theme toggle),
  the language switch and the ink Hire me. The progress ring is a conic
  gradient fed by a `--progress` variable written in a rAF scroll callback, with
  no React state. Below `lg` the links open as a sheet under the island
  (numbered rows, language, theme). Escape closes it and returns focus.
- **Rail.** From 1600px, a fixed column at the inline start lists
  `01 About … 06 Contact`, the active one in full `bone`.

### Inputs
Reserved for future forms: fill `--ink-600`, 1px `--line`, `--r-md`, 14px padding, 16px Archivo. Label above in `eyebrow` mono. Focus: border copper. Error: `--rose` border + 13px message. Contact currently ships no form.

### Tags / chips
Use a quiet hairline and a sentence-case label. Use a status colour for meaningful status.

### Timeline (experience)
One 2021 → now axis in mono over the list. Each row is an expander:
company · country and role, then a pill track with the role's bar placed by its
real start and end (`lib/careerLanes.ts`), the date range (with a jade Current
chip) and a `+` that turns 45°. The open row's bar is copper; the rest are
`bone`. Time runs left to right in both languages. Below `lg` the bar hides and
the dates fold under the company.

### Metric block
Sentence-case label with the `metric` number in **`--bone`** (v2.0 — was copper; see
§1.3 tiers), caption below in `--bone-52`. Always in groups of 3 or 4 with
hairline dividers between. Live/streamed values take `--jade`.

## 5.1 New components (v2.0)

### Skills plates

One white plate per group on a two-column grid, every second plate 40px lower
from `sm`. Chips are hairline outlines; the core skills (`coreSkills` in
`content/skills.ts`) are the only filled ones.

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
- Opens in place. See §6.

### Review card
A client's words, attributed to the marketplace that collected them.

- Surface `--ink-700`, `--r-lg`, `e1`, 24px padding. Two portable widths: 372 base
  and 520 wide. The site grid stretches cards to equal columns.
- Under 90 characters a quote is set as a 24px pull quote, so it does not strand
  in an empty card.
- The platform's logo is identity, like our own mark, and exempt from the accent
  tiers. Its `--color-brand-*` appears on that mark.
  **No copper on a review card at any tier.**
- Five CSS-shaped stars are `--bone-70` at rest. They share one clip-path in the
  portable stylesheet rather than repeating inline SVG paths. Colour never
  carries the rating alone: the accessible label and visible `5.0` remain.
- Arabic quotes render RTL in IBM Plex Sans Arabic. Translations are labelled
  and the verbatim original lives in a native disclosure at every width.
- Reviews appear in a static grid.

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

- The hero headline moves 8px into place over 360ms at full opacity. Reduced
  motion starts with the headline in place.
- The mobile menu has a short, motion-safe entrance. Disclosure panels open
  immediately at their natural height.
- Interactive controls use brief colour, opacity, or border transitions. Map
  transitions communicate a change of filter or the country being inspected.
- The nav island's links slide open (max-width and opacity, 420ms).
- **Hero entrance** (`.enter`): status line, intro, figure, each promo and the
  ledger strip fade up 20px over 720ms, 90ms apart. The headline itself only
  moves (`.rise-lcp`), so it stays the LCP element.
- **Scroll reveal** (`[data-reveal]`): section headers, About blocks, timeline
  rows, featured panels, skill plates, review cards and the Contact columns
  fade up once on first view, 70ms apart within a group. Hairline grids reveal
  as a whole, never cell by cell, or the line colour shows through.
- **Timeline bars** (`.timeline-bar`) draw along the axis when their row
  appears.
- Hero promos lift 4px under the pointer.
- **Client map intro** (runs once when the map scrolls into view): the Mansoura
  pin drops in, lines draw outward nearest-first, each country fills and its
  dot pops as its line arrives. `--i` is the order from
  `scripts/generate-world-map.mjs`. The pin ring pulses slowly: the one loop.
- Every one of these uses `--ease-slow`, and reduced motion and print get the
  finished page. The
  standalone review export retains its own animated wall and reduced-motion mode.

## 7. Accessibility
- Hit targets ≥ 44×44.
- Pair status colour with a text label.
- Contrast: body ≥ 4.5:1, large display ≥ 3:1.

---

## Implementation status

Ledger is built in both themes and both languages.

---

## Change log

**v3.0 — November 2026.** Ledger: light default with the Obsidian dark theme on
a toggle, ink band for Contact and the footer, wide Archivo display, nav island
and section rail, store-art hero figure and ledger strip, per-row experience
timeline, skills plates. The workbench photograph, film grain and career band
are gone.

**v2.1 — November 2026.** Workshop hero, single real app preview, warm ink
range, simplified typography and navigation, and motion focused on interaction.

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
- English remains at `/`; Arabic lives at `/ar/`. Arabic uses IBM Plex Sans Arabic, logical layout properties and RTL text. Logos, screenshots and geographic coordinates are not mirrored.
- Languages share project identifiers, assets, metrics and contact links. Availability labels describe supplied links rather than promising current store availability.

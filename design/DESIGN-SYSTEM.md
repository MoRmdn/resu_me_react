# MoRmdn — Design System v2.1
Personal brand system for **Mohamed Ramadan**, Software Engineer — Mansoura, Egypt.
Codename: **Obsidian & Copper**.

> Source of truth for this repo's visual language. Implemented in
> `app/globals.css` (tokens and the animation layer), Tailwind utilities and the
> React components. Historical Flutter artboards remain design references, not
> implementation guidance.

> **v2.1 — workbench direction (November 2026).** A graphite workbench
> frames the hero. Warm neutrals, sentence-case labels, and quiet controls
> carry the rest of the page. The v2.0 artboards record the earlier direction.

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
| `--ink-900` | `#100E0D` | Page background |
| `--ink-800` | `#171412` | Section alternate background |
| `--ink-700` | `#201C19` | Surface / card |
| `--ink-600` | `#292420` | Raised surface, input fill |
| `--line` | `rgba(242,238,231,0.10)` | Hairline borders, dividers |
| `--line-strong` | `rgba(242,238,231,0.20)` | Hover borders, focus ring base |
| `--bone` | `#F2EEE7` | Primary text (warm off-white, never pure `#fff`) |
| `--bone-70` | `rgba(242,238,231,0.70)` | Body text |
| `--bone-52` | `rgba(242,238,231,0.52)` | Contrast floor for secondary text / captions |
| `--bone-28` | `rgba(242,238,231,0.28)` | Disabled, decorative numerals |
| `--copper` | `#F2762E` | **Primary accent** — links, active state, key numbers |
| `--copper-dim` | `#C86023` | Pressed accent |
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

Accent use:

- The hero CTA carries the solid copper fill. Copper in the photograph is
  a material colour. The fixed header's contact action stays neutral.
- Track-record metrics are bone. Jade is reserved for status.
- The logo's copper half is exempt as identity.
- The AYCO private card carries **zero** copper at any tier. Copper marks the
  reachable; nothing on that card is reachable.
- Use a neutral-to-transparent fade to blend the workbench photograph into the page.
- Text contrast: body ≥ 4.5:1, large display ≥ 3:1. `--bone-28` is decorative only, never information.

---

## 2. Typography

Families:

- **Display / UI:** `Archivo` — 400 / 500 / 600 / 700. Wide-set grotesk with real personality at large sizes.
- **Mono:** `JetBrains Mono` — 400 / 500. Used for code and compact technical values.
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
| `eyebrow` | 13 / 1.45 | 500 sans | Normal tracking | Sentence-case section labels |
| `metric` | 46 / 1 | 600 | −0.03em | Stat numbers, bone |

### 2.2 Rules

- Use the hero clamp in `.hero-headline`. Arabic uses its own size and line height.
- Align headings to the start of the reading direction. Body copy is capped at 62ch.
- Use tabular figures for metrics.

---

## 3. Spacing & layout

4px base. Steps: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 176`.

- **Grid:** 12 columns, 24px gutter, max content width **1240px**, page padding 32px desktop / 20px mobile.
- **Section rhythm:** 128px vertical padding desktop, 76px mobile.
- **Breakpoints:** the Tailwind tokens are `sm 680 · md 900 · lg 1040 · xl 1240`; the Arabic desktop hero also has a targeted adjustment from 768px.
- Asymmetry is the signature: content sits on a 7/5 or 8/4 split, not centred boxes.

### 3.1 Workbench hero and section rhythm

- The full-width photograph keeps its subject at the end of the reading direction.
  Arabic mirrors the photograph and its edge shading. The actual project screenshot
  keeps its original orientation.
- Mobile puts the photograph after the two main actions. The SAAD preview and
  track record sit at the bottom of the hero, with the CV and live views in the footer.
- Use the responsive AVIF and WebP variants in `public/images/hero-workbench-*`.
  The photograph and actual SAAD listing capture are separate assets.
- Section grounds alternate between `--ink-900` and `--ink-800`. Projects
  and Contact overlap their preceding sections by 40px.

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
- Stacking: above section backgrounds, **below body text and the fixed header**, so
  type stays crisp.
- Excluded from the flagship device screenshot so the shot is not degraded.
- **Static. Never animated, never per-section, never parallaxed.**
- `prefers-reduced-motion`: unaffected — it does not move.

---

## 5. Components

### Buttons
| Variant | Idle | Hover | Pressed |
|---|---|---|---|
| **Primary** | copper fill, `#100E0D` label, `--r-md`, 14px/24px padding, 500 weight | brightness 1.08, lift `translateY(-2px)` | `translateY(0)`, copper-dim |
| **Ghost** | transparent, 1px `--line`, bone label | border `--line-strong`, bg `rgba(255,255,255,.04)` | bg `rgba(255,255,255,.02)` |
| **Text/link** | bone label + copper 1px underline offset 4px | underline grows from left (200ms) | — |

Height 44px min (touch target), icon 18px, gap 8px.

### Cards
Use the `--ink-700` surface, `--r-lg` radius, and a neutral hairline. Interactive cards use a stronger hairline or a surface step to show state.

### Navigation
A fixed 64px header uses an opaque ink ground and one bottom hairline. The active link has a short underline. On mobile the menu opens a keyboard-trapped sheet.

### Inputs
Reserved for future forms: fill `--ink-600`, 1px `--line`, `--r-md`, 14px padding, 16px Archivo. Label above in `eyebrow` mono. Focus: border copper. Error: `--rose` border + 13px message. Contact currently ships no form.

### Tags / chips
Use a quiet hairline and a sentence-case label. Use a status colour for meaningful status.

### Timeline (experience)
Each entry marked by a 8px square node (rotated 45°) that fills copper when the row is open. Rows are expanders: role, company, and date range collapsed; responsibilities revealed on open.

### Metric block
Sentence-case label with the `metric` number in **`--bone`** (v2.0 — was copper; see
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

### Skills rows

Use a hairline between groups. On desktop, the group heading sits beside
a wrapping list of skills. On narrow screens the skills sit under the heading.

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
- The technology strip, career band, skills, and review cards are static. The
  standalone review export retains its own animated wall and reduced-motion mode.

## 7. Accessibility
- Hit targets ≥ 44×44.
- Pair status colour with a text label.
- Contrast: body ≥ 4.5:1, large display ≥ 3:1.

---

## Implementation status

The static export renders the workshop hero, the career band, the client
map, and the project and review details in HTML. Contact uses direct channels.

- **Light ("Bone") theme** — tokens remain specced in §1.2, with no implementation.

---

## Change log

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

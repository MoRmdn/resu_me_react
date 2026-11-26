# Implementation map — React

Spec → code, plus the decisions taken during the port from Flutter Web. Read
this and `DESIGN-SYSTEM.md` before changing anything visual.

## Tokens → code

Every token in `DESIGN-SYSTEM.md` is a CSS custom property in the `@theme` block
at the top of `app/globals.css`, which is what generates the Tailwind utilities.
There is no `tailwind.config.js` — Tailwind v4 is configured in CSS.

| Spec | Utility |
|---|---|
| `--ink-900 … --ink-600` | `bg-ink-900`, `bg-ink-700`, … |
| `--bone`, `--bone-70`, `--bone-62`, `--bone-52` | `text-bone`, `text-bone-70`, … |
| `--line`, `--line-strong` | `border-line`, `border-line-strong` |
| `--copper`, `--copper-bright`, `--copper-dim`, `--copper-wash` | `text-copper`, `bg-copper`, … |
| `--jade`, `--rose` | status only |
| type scale | `text-display-xl`, `text-display-l`, `text-h1…h3`, `text-body-l`, `text-body`, `text-caption`, `text-metric`, `.eyebrow` |
| radii | `rounded-sm/md/lg/xl/pill` |
| motion | `duration-instant/fast/base/slow`, `ease-instant/fast/base/slow` |
| elevation | `elevation-flat/card/hover/overlay` |

Flutter's `letterSpacing` is absolute px; every value was divided by its font
size to reach `em`. `-3.8` on 96px became `-0.04em`.

## Section → file

| Band | File | Ground |
|---|---|---|
| Hero | `components/sections/Hero.tsx` | ink-900 |
| Tech strip | `components/sections/TechStrip.tsx` | ink-800 |
| Proof line | `components/sections/SocialProof.tsx` | ink-700 |
| About | `components/sections/About.tsx` | ink-900 |
| Experience | `components/sections/Experience.tsx` | ink-800 |
| Projects | `components/sections/Projects.tsx` | ink-900 |
| Skills | `components/sections/Skills.tsx` | ink-800 |
| Reviews | `components/sections/Reviews.tsx` | ink-900 |
| Contact | `components/sections/Contact.tsx` | ink band (`.band`) |
| Footer | `components/sections/Footer.tsx` | ink band (`.band`) |
| Nav | `components/sections/Nav.tsx` | island (ink-800) + section rail |

Bands sit flush, divided by hairlines. The Ledger reference is direction A of
the Claude Design project "Flutter portfolio redesign", page *Portfolio
Directions*.

## Deliberate deviations from DESIGN-SYSTEM.md

**`--bone-45` became `--bone-52`.** At 0.45 the token measured 4.04:1 on
ink-900 — under the 4.5:1 the design system itself requires for body text.
0.52 is the lowest alpha that clears 4.5:1 on every ink ground. Everything that
had been `bone-38` and carried information moved up to `bone-52` too.

`--bone-38` and `--bone-28` are kept but are now **decoration only**, which is
what §Colour always said about `bone-28`. They survive on dividers, the nav
underline, the accordion node border, and the project card index — and where
they render as text the element is `aria-hidden`, so "decorative" is enforced
rather than asserted.

**Accent allocation.** The hero and Contact each use copper for their primary
action. The island's Hire me is ink-solid, not the artboard's copper, because it
shares the first viewport with the hero CTA. The map uses copper to encode
client locations.

**Ledger departures.** Light copper and jade are a step darker than the
artboard (`#A3460F`, `#0B655A`) to hold 4.5:1 as text. The artboard's "UTC+3"
is dropped (Egypt is UTC+2 half the year) and every figure comes from
`content/`. The section rail appears from 1600px, not 1440px, where it would
touch the content column. Skill plates carry no number: `01–07` is reserved
for sections.

## Motion inventory (v2.1)

| Behaviour | Where | Reduced motion |
|---|---|---|
| Headline entrance | `.rise-lcp` | In place at first paint |
| Mobile sheet entrance | `Nav.tsx` | In place on opening |
| Map filter and active country | `ClientMapExplorer`, `.map-*` | Immediate state |
| Review export wall | `scripts/export-review-cards.mjs` | Horizontal scroller |

The portfolio's content is visible at first paint. Its disclosure panels open
at natural height. The gallery keeps its detail planes in the grid and changes
the open tile's surface.

## Layout invariants

These replace the Flutter-specific ones, which no longer apply — no
`heightFactor`, no `MainAxisSize.min`, no `Container` colour-vs-decoration
assert, no ticker guards.

- **The hairline grid** (`.hairline-grid`) is `display:grid; gap:1px` over a
  `--color-line` background, with ink-filled children. That is how the about
  stat grid, the skills table, and the contact link panel get their 1px rules.
- **Wide content scrolls inside its own container.** The page body must never
  scroll horizontally; the mobile project screenshot strips scroll within their own containers.
- **Collapsed accordion panels stay rendered** and take `inert`. Conditional
  rendering would strip the achievement bullets out of the page source, which
  is the one thing this rebuild exists to prevent.


## Where this build departs from the artboard, and why

The artboard (`Portfolio Redesign.dc.html` in the v2.0 handoff) is the
implementation target. Four deliberate departures:

1. **The timeline shows real concurrency.** Four engagements ran concurrently
   through 2024 and most were part-time. Each row's bar is placed on one true
   axis by `lib/careerLanes.ts` from the ISO `start`/`end` in
   `content/experience.ts`, so overlaps read as overlaps. `content/experience.ts` also carries
   an `engagement` field the artboard never rendered; the row panel renders it.
2. **`grid-template-rows: 0fr → 1fr`, not `max-height`.** The artboard capped
   panels at 420–560px, which clips. JS Quest's open panel measures 705px.
3. **No indented rows.** The artboard stacked every project as an alternating
   indented row. That section reached 7,000px with most of the work hidden, so
   four projects are full-width panels and the rest are a gallery. The panels
   were always open at first, which took the section past 8,000px, so they now
   close to a face that keeps the art, pitch, outcome and links in view. The
   artboard's opening gesture moved to the gallery tile, minus the un-indent.
4. **`--bone-52`, not the artboard's literal `.45`.** The artboard writes
   `rgba(242,238,231,.45)` on information-carrying text; that measures 4.04:1
   and fails the 4.5:1 the design system itself requires. Treat every artboard
   `.45` on text as nominal.



**`support.js` from the handoff is not ported.** It is generated canvas runtime
— React 18 + Babel from unpkg, an expression parser, and the shim that turns
`style-hover=` attributes into real CSS. It contains no portfolio content.

**The handoff's `DESIGN-SYSTEM.md` and `LOGO.md` still cite Flutter paths**
(`lib/utils/app_colors.dart`, `lib/widgets/…`, `Curves.easeOutExpo`). Read those
as historical; this file is the React mapping.


## Project imagery (v2.2, §5.2)

Masters live in `assets/projects/` as WebP capped at 1200px — committed, so the
repo survives the source folders being cleaned, at about a twentieth of their
weight. `npm run ingest` rebuilds them from the handoff and
`~/Downloads/apps-screens`; `npm run images` generates AVIF + WebP display
variants into `public/images/projects/<slug>/`.

`npm run images` also writes `content/media-manifest.json`, and `ProjectImage`
reads its srcset widths from there rather than from a hardcoded list. That is
load-bearing: Saber Yamen and O'Permis are only 288px wide, so they cannot emit
a 480 or 560 variant, and a srcset naming a file that was never written renders
as a broken image.

Five plates, all obeying one rule — **no supplied asset ever touches the page
background directly**:

| Plate | Fit | Used by |
|---|---|---|
| Icon tile | 96px ink-600 tile, source inset at 64px | every project with an icon |
| Device | intrinsic height, bezel drawn by the frame | AYCO, MisMar, Arcit-AI, FreeDoc |
| Field | `cover` | Saber Yamen |
| Promo | `contain`, never cropped | Lpermis, Lpermis Pro, Mutabbib, Dental Dinar, O'Permis |
| Icon-only | — | none currently |

`bezel: false` on MisMar because the supplied mockup already carries its own
device frame; drawing a second one around it looks like a mistake.

The promos keep their baked Arabic headlines. They are evidence of shipping
RTL products for Arabic-speaking markets, which is a differentiator, and Plate
04 exists precisely so another designer's composition is shown whole.

### Asset provenance, and a trap

Three icons **changed identity under stable filenames** between the v2.1 and
v2.2 handoffs: the old `lpermis-icon.png` was a steering wheel (now parked as
`_superseded-steering-icon.png`) and the old `mutabbib-icon.png` was the blue
ECG "FD" mark. Ingest from the v2.2 export only.

That "FD" mark, which the handoff lists as unidentified, is **FreeDoc** —
matched against `~/Downloads/apps-screens/freeDoc/play_store_512.png`.

**FreeDoc ships icon-and-one-screen.** Most of its captures are QA builds
carrying Lorem Ipsum, a Google Maps error banner, or the Android notification
shade. Only the language-settings screen is product UI, and it happens to show
the Arabic/French/English switch. Vet any replacement the same way.


## Bilingual portfolio (November 2026)

The English and Arabic route groups each own a root layout. `components/DocumentShell.tsx` supplies fonts, metadata, JSON-LD and analytics; `PortfolioPage` and `PrivacyPage` share the actual page composition. Content dictionaries under `content/*-i18n.ts` supply translated presentation data, while source identifiers and URLs remain shared.

`SocialProof` supplies the early summary and the curated testimonials. `Reviews` renders the canonical static review grid and native disclosure; review exports deduplicate by the stable review ID. `ReviewCard` retains the verbatim source quote behind a labelled translation. Mobile Skills compact below 768px without removing capabilities.

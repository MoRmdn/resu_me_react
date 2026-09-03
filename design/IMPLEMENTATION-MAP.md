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
| About | `components/sections/About.tsx` | ink-900 |
| Experience | `components/sections/Experience.tsx` | ink-800 |
| Projects | `components/sections/Projects.tsx` | ink-900 |
| Skills | `components/sections/Skills.tsx` | ink-800 |
| Contact | `components/sections/Contact.tsx` | ink-900 |
| Footer | `components/sections/Footer.tsx` | ink-900 |
| Nav | `components/sections/Nav.tsx` | fixed pill |

Grounds alternate so sections separate without rules between them.

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

**Settled: the accent rule is tiered (DESIGN-SYSTEM v2 §1.3).** Tier 1 is a
solid copper fill — max one per viewport, always the primary action. Tier 2 is
full-chroma copper text or stroke — max one, and never beside a Tier 1. Tier 3
is wash, hairlines and copper at ≤38%, unlimited, because that is material
rather than accent. The logo's copper half and the scroll-progress bar are
chrome and exempt.

Applied in pixels, not just prose — the artboard resolves the rule in a panel
but still draws three Tier 1 fills in the hero:

- The hero headline no longer accents its final word. `headlineAccentIndex`
  stays in `content/copy.ts` for data fidelity and is not rendered.
- All three track-record metrics are bone. Live values are jade — jade is the
  status hue and is exempt from the count.
- The nav "Hire me" renders **ghost while the hero is on screen** and takes the
  copper fill only once the hero's own CTA has scrolled away, so the two are
  never lit together (`components/sections/Nav.tsx`).
- Contact spends its Tier 1 on the copper email button, so the form's submit is
  a ghost button.
- Experience spends its one full-chroma copper on the open row's node; the row
  label and the active band label are bone.
- The AYCO card carries zero copper at any tier. Copper marks the reachable.
- The nav "Hire me" is copper only in the stretch between the other two Tier 1
  fills: ghost over the hero (whose CTA holds it), copper mid-page, ghost again
  at Contact (where the WhatsApp card holds it). Being ghost at Contact is also
  simply correct — a button whose only job is to scroll you to Contact has
  nothing to offer once you are there.

**Three documented exemptions**, all non-actions: the logo's copper half
(identity), the 2px scroll-progress bar (chrome), and Experience's 9px
accordion node (a state marker, specified as a copper fill in §5.1). A sweep of
44 viewport positions finds no viewport with two competing copper *actions*; the
node co-occurs with the nav pill and is deliberately not counted against it.

**Auditing this correctly requires occlusion.** The hero is sticky and stays in
the viewport behind the opaque sheet for the whole page, so a check based on
`getBoundingClientRect` alone reports its CTA as visible everywhere and gives
false positives. Test the element at its own centre with
`document.elementFromPoint` and only count it if it is the topmost thing there.

**Built, that the spec listed as missing:** the 3% film grain overlay
(`.grain`, pure CSS, no image request); the logo draw-on (`MoRmdnMarkDraw`,
`pathLength="100"` + `stroke-dashoffset`, hero only, once); `prefers-reduced-motion`
throughout; and the focus ring (the `glow` token) on `:focus-visible`.

## Motion inventory (v2.0)

| Behaviour | Where | Mechanism | Reduced-motion fallback |
|---|---|---|---|
| Hero entrance | `.rise` + `--rise-delay` | CSS keyframes, staggered 90ms | no animation, content present |
| Logo draw-on | `.draw-path` | `stroke-dashoffset`, once on load | fully drawn |
| Scroll reveal | `.reveal` + `RevealRoot` | CSS transition, one shared IntersectionObserver | visible, no transition |
| Scroll progress | `.scroll-progress` | `animation-timeline: scroll()`, rAF fallback | listener not installed |
| Marquee | `.marquee-track` | CSS `translate3d(-50%)`, duplicated track | stops, becomes scrollable |
| Accordion | `.disclosure` | `grid-template-rows: 0fr → 1fr` | instant |
| Cursor glow | `CursorGlow` | rAF lerp writing a transform | not installed |
| Count-up | `CountUp` | rAF, easeOutQuart, once in view | final value rendered |
| Card / button lift | Tailwind | `transition-transform` | duration collapsed to 0 |
| Status dot | `.pulse-dot` | CSS keyframes | duration collapsed to 0 |
| Held hero | `.hero-held` | `position: sticky`, planes slide over | released to normal flow |
| Career band grow | `.band-bar` | `scaleY` from the baseline, 40ms stagger | final height, no grow |
| Skills plate slide | `.plate` | `translateX`, alternating side | in place |
| AYCO perimeter draw | `.perimeter` | SVG `stroke-dashoffset` | fully drawn from first paint |
| **Project card opens spatially** | `.proj-card` | `translateX` + `scale` + `grid-template-rows`, siblings to .38 | instant at final size, siblings stay 100% |

**No animation library.** Motion (framer-motion) was used during the build and
then removed: it was 183 KB raw for effects that CSS and three small rAF helpers
cover. Think hard before adding one back.

**The cursor glow is gone** (DESIGN-SYSTEM v2 §6, "Cut in v2.0") — it decorated
rather than explained, and competed with the film grain for the same job.

## Layout invariants

These replace the Flutter-specific ones, which no longer apply — no
`heightFactor`, no `MainAxisSize.min`, no `Container` colour-vs-decoration
assert, no ticker guards.

- **The hairline grid** (`.hairline-grid`) is `display:grid; gap:1px` over a
  `--color-line` background, with ink-filled children. That is how the about
  stat grid, the skills table, and the contact link panel get their 1px rules.
- **Wide content scrolls inside its own container.** The page body must never
  scroll horizontally; the marquee and the hero watermark are both inside
  `overflow-hidden`.
- **Collapsed accordion panels stay rendered** and take `inert`. Conditional
  rendering would strip the achievement bullets out of the page source, which
  is the one thing this rebuild exists to prevent.


## Where this build departs from the artboard, and why

The artboard (`Portfolio Redesign.dc.html` in the v2.0 handoff) is the
implementation target. Four deliberate departures:

1. **The career band shows real concurrency.** The artboard laid seven roles
   side by side against a `2021 → NOW` axis, but its months sum to 110 against
   ~65 months of actual elapsed time — four engagements ran concurrently through
   2024 and most were part-time. As drawn it inflated the career by 1.7× and
   read concurrent contracts as consecutive ones. `lib/careerLanes.ts` packs
   bars from the ISO `start`/`end` in `content/experience.ts` into four lanes on
   a true axis, so the overlap is visible. `content/experience.ts` also carries
   an `engagement` field the artboard never rendered; the row panel renders it.
2. **`grid-template-rows: 0fr → 1fr`, not `max-height`.** The artboard capped
   panels at 420–560px, which clips. JS Quest's open panel measures 705px.
3. **`translateX`, not `margin-left`.** The artboard animates a layout property,
   against its own "transform + opacity only" rule.
4. **`--bone-52`, not the artboard's literal `.45`.** The artboard writes
   `rgba(242,238,231,.45)` on information-carrying text; that measures 4.04:1
   and fails the 4.5:1 the design system itself requires. Treat every artboard
   `.45` on text as nominal.

Two smaller ones: the film grain is `position: fixed` **below** the nav per §4,
not the artboard's `z-index:60` above it (an artefact of it being
`position:absolute` inside a bounded canvas frame); and the Skills stagger only
applies from 900px up, because an 88px indent eats a quarter of a 375px screen.

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

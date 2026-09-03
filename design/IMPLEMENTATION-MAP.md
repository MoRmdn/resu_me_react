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

**Unresolved: the one-copper-accent rule.** `DESIGN-SYSTEM.md` says "one copper
accent per viewport", and also specifies copper-filled primary buttons *and*
copper metric numbers. Those cannot all hold. The hero currently shows four
copper elements (the headline word "ship.", the primary CTA, the nav "Hire me"
pill, and the first track-record metric). The Flutter original had the same
contradiction. **This is for the redesign pass to settle** — do not silently
pick a rule here.

**Built, that the spec listed as missing:** the 3% film grain overlay
(`.grain`, pure CSS, no image request); the logo draw-on (`MoRmdnMarkDraw`,
`pathLength="100"` + `stroke-dashoffset`, hero only, once); `prefers-reduced-motion`
throughout; and the focus ring (the `glow` token) on `:focus-visible`.

## Motion inventory

| Behaviour | Where | Mechanism | Reduced-motion fallback |
|---|---|---|---|
| Hero entrance | `.rise` + `--rise-delay` | CSS keyframes, staggered 90ms | no animation, content present |
| Logo draw-on | `.draw-path` | `stroke-dashoffset`, once on load | fully drawn |
| Scroll reveal | `.reveal` + `RevealRoot` | CSS transition, one shared IntersectionObserver | visible, no transition |
| Scroll progress | `.scroll-progress` | `animation-timeline: scroll()`, rAF fallback | listener not installed |
| Marquee | `.marquee-track` | CSS `translate3d(-50%)`, duplicated track | stops, becomes scrollable |
| Accordion | `.collapse` | `grid-template-rows: 0fr → 1fr` | instant |
| Cursor glow | `CursorGlow` | rAF lerp writing a transform | not installed |
| Count-up | `CountUp` | rAF, easeOutQuart, once in view | final value rendered |
| Card / button lift | Tailwind | `transition-transform` | duration collapsed to 0 |
| Status dot | `.pulse-dot` | CSS keyframes | duration collapsed to 0 |

**No animation library.** Motion (framer-motion) was used during the build and
then removed: it was 183 KB raw for effects that CSS and three small rAF helpers
cover. Think hard before adding one back.

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

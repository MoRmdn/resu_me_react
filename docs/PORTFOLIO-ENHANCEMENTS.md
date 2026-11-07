# Portfolio enhancement verification

Implemented on `codex/portfolio-enhancements`, based on freshly fetched `origin/main` (including SAAD). English remains at `/`; Arabic is at `/ar/`, with matching privacy pages.

## Delivered

- Marketplace summary immediately after the technology strip, three attributed testimonials after the first featured project, explicit project availability, and problem/responsibility/decisions/result stories for featured work.
- Six initial reviews in a static responsive grid; remaining reviews and original-language quotes use native disclosures. All 43 source reviews remain verbatim in exported HTML. Review-loop clones and controls have been removed from the site.
- Compact mobile Skills, complete professional Arabic presentation, correct document direction, localized metadata, language alternatives, sitemap and hosting headers.
- Catalogued interaction tracking, updated privacy copy, regenerated analytics/content documentation, and `npm run check:portfolio` to verify the actual static export.

## Validation

Passed `npm run typecheck`, `npm run lint`, `npm run analytics:docs -- --check`, `npm run build`, `npm run check:portfolio`, and `git diff --check`.

Isolated headless Chrome checked both languages at 390, 768 and 1440 pixels: no page overflow or runtime/hydration errors. Verified project/gallery expansion, Escape focus restoration, mobile-menu focus and Escape, review expansion and original-text disclosure, reduced motion, and Arabic content with page scripting disabled. Switching from English to Arabic preserved `#projects`. Consent acceptance persisted to Arabic privacy controls and could be changed to decline.

Analytics debug output verified open/close events and stable project parameters in both languages. Static checks reject untracked controls and review identity/text parameters. Tests ran locally, with external analytics and Firebase requests blocked; no production GA reports were changed.

`node scripts/export-review-cards.mjs` generated all 43 PNGs and the portable package. Its exported React component passed an independent TypeScript check. Existing video generation reads review data directly and does not depend on the removed wall markup.

## Measured comparison

Baseline is the saved production export from the branch base, using the same local browser and viewport. HTML bytes include Next.js's embedded RSC data. Gzip figures use Node's default gzip settings, not a measurement of Firebase transfer sizes.

| Measurement | Baseline English | Enhanced English | Enhanced Arabic |
| --- | ---: | ---: | ---: |
| Initial HTML bytes | 673,218 | 711,732 | 728,329 |
| Gzip bytes | 95,347 | 106,606 | 107,293 |
| DOM elements after hydration, 1440px | 4,410 | 3,361 | 3,340 |
| Rendered review cards, including early testimonials | 86 | 46 | 46 |

English HTML increased 5.7%; its hydrated element count fell 23.8%. Additional stories and bilingual support have a payload cost; removing review clones reduces eventual DOM work. These measurements do not establish any LCP improvement. No live deployment or new Lighthouse audit was performed.

## Outstanding GA configuration

Register **`target_locale`** as an event-scoped custom dimension (display name: **Target language**) in the site's GA4 property. Values are `en` and `ar`. No connected GA administration capability was available; plugin discovery found reporting integrations but no usable registration capability. The parameter is already declared, documented and sent by `language_switch`.

---

## Follow-up review and fixes (2026-11-06, Kimi)

Independent UI review of this branch, followed by four fixes. Six files
changed, +33/−7, all gate commands green.

### Review method

- Full gate: `npm run typecheck`, `npm run lint`, `npm run analytics:docs -- --check`, `npm run agents:check`, `npm run build` — all passed on the unmodified branch before any fix.
- Visual sweep of both locales: full-page headless-Chrome captures at 1440px with `--force-prefers-reduced-motion` (every animation degrades to its finished state, so one capture shows the whole page; without the flag, `.reveal` elements below the fold stay at `opacity: 0` in screenshots).
- Real mobile emulation over CDP (`Emulation.setDeviceMetricsOverride`, 390×844): `scrollWidth === innerWidth`, so no horizontal overflow in either locale. **Plain `--window-size=390` headless captures are unreliable — Chrome enforces a 500px minimum layout viewport and the shot silently crops a 500px layout to 390px.** That artifact was initially misread as a mobile overflow bug; it is not one.

### Findings and fixes

1. **Arabic hero was clipped (the one real bug).** The hero is sticky-held (`.hero-held`) with `items-center` and `overflow-hidden`, and had a fixed `md:h-[880px]`. The Arabic headline wraps one line taller than the English one, so the centred content overflowed symmetrically and the "متاح للعمل" eyebrow badge was pushed up behind the nav and cut in half. Fixed in `components/sections/Hero.tsx`: `md:h-[880px] md:py-0` → `md:min-h-[880px] md:py-16`. The section now grows for taller content; the slide-over mechanic is unaffected. Verified by capture: English hero pixel-identical, Arabic eyebrow fully visible.
2. **About learning-card label wrapped as "BUILT WITH / IT".** The eyebrow label ("Built with it", 11px / 0.18em tracking ≈ 114px) exceeded its `w-24` definition-term column. `components/sections/About.tsx`: `w-24` → `w-32` on all three rows, alignment preserved.
3. **Nav scroll-spy observer churn.** `getProfile("ar")` builds fresh arrays on every call, and `Nav` recomputed `SECTION_IDS` per render, so `useScrollSpy` destroyed and recreated its `IntersectionObserver` on every scroll-spy state change. `components/sections/Nav.tsx`: the `getProfile` call and the id list are now memoised by locale.
4. **Untracked workspace copy broke repo-root lint.** The local agent workspace `My Portfolio/` is a full nested copy of this repo (including `node_modules` and `.next`); it appeared as untracked content and `npm run lint` from the repo root linted its build output (235 foreign errors). Added `/My Portfolio/` to `.gitignore` and `My Portfolio/**` to ESLint's global ignores. The copy also lacks `.env` (gitignored, never copied) — always run the site from the real repo root.

### House-keeping

`AGENTS.md` gained two entries under "Things that will bite you": the held
hero takes `min-h`, never a fixed `h`; and `getProfile("ar")` returns fresh
arrays, so memoise it before its results feed a hook dependency list.

### Validation

Gate re-run after the fixes: typecheck ✓, lint ✓, analytics:docs --check ✓,
agents:check ✓, build ✓. Visual re-verification of the Arabic hero, the
English hero (unchanged) and the About learning card. No live deployment
performed.

---

## Phase 1 merge-blocker fixes (2026-11-06)

- **Arabic hero:** retained the growing `min-h` hero, added enough tablet /
  small-desktop top padding to clear the fixed nav, and scoped the Arabic
  desktop headline to an 84px ceiling with 1.15 line-height and balanced
  wrapping. Mobile type and the LCP animation remain unchanged.
- **Scroll spy:** `useScrollSpy` now retains all intersecting sections across
  observer callbacks, so exit-only events select the remaining topmost section
  or clear a stale highlight. Nav's locale-memoised ID array remains in place.
- **Disclosures:** server HTML no longer emits `inert`. Closed panels are
  CSS-hidden before hydration, then `useHydrated` applies `inert`; no-JS CSS
  opens every panel with no `inert`, preserving readable and focusable content.
  `check-portfolio` now enforces the server-markup contract in both locales.
- **Dependencies:** Next.js and `eslint-config-next` are 16.4.5; Sharp is
  0.35.5. Safe transitive updates cleared re2js, source-map-js, zod and
  brace-expansion advisories. No force-fix or major downgrade was used.
- **Marquee containment:** paint containment and clipping keep the transformed
  max-content track from contributing transient document overflow at tablet
  width. Reduced motion retains its intentional horizontal scroller.

### Validation

The complete required gate, production build, `check:portfolio` and
`git diff --check` pass. Headless Chrome/CDP verified English and Arabic at
375, 390, 768, 1024 and 1440px: hero/nav clearance, no persistent horizontal
overflow or horizontal scrolling, active navigation in both scroll directions,
anchor jumps and deep links, and no application console errors or local 404s.

All 19 project/experience disclosures per locale were checked with JavaScript
disabled: every panel is visible and non-inert, and every detail link is
focusable. With framework scripts blocked but CSS active, closed panels remain
hidden, zero-height and unfocusable. Hydrated open/close, Escape focus
restoration, mobile-menu focus/Escape, review disclosures, language hash
preservation, consent acceptance and reduced-motion finished states pass.

`npm audit` now reports 12 package entries (4 high, 8 moderate), down from 18.
They are the upstream Firebase/gRPC and TypeScript-ESLint/minimatch chains.
npm's suggested fixes would downgrade Firebase or `eslint-config-next`
incompatibly, so they were deliberately not applied. No analytics parameters,
GA configuration or live deployment changed.

---

## Phase 2 UI and conversion hierarchy (2026-11-06)

- **Work leads Projects.** AYCO's first featured panel now follows the section
  header directly. The three testimonial cards sit between AYCO and SAAD, so
  supporting evidence no longer occupies the opening Projects viewport.
- **No opening-review repetition.** The six initial Reviews cards are disjoint
  from the three Projects testimonials, while all 43 verbatim reviews remain in
  the server-rendered Reviews disclosure. The export check compares rendered
  IDs in both locales and enforces the new project/testimonial ordering.
- **Readable metadata.** The default body token is 16px. Project availability,
  category/country metadata and story labels use the 13px caption scale rather
  than 11px uppercase eyebrows. Tokens, asymmetry, elevation and motion rules
  are unchanged.

### Validation

TypeScript, ESLint, analytics docs, agent checks, production build,
`check:portfolio` and `git diff --check` pass. Chrome/CDP verified the new DOM
order, disjoint review IDs and computed font sizes in English and Arabic at 390
and 1440px, with screenshots showing project art in the opening viewport. The
full Phase 1 browser matrix and interaction/no-JS/reduced-motion regression
suite also passes. No analytics parameters or live deployment changed.

---

## Phase 3 maintenance and payload costs (2026-11-07)

- **Obsolete review code removed.** Production CSS no longer carries the old
  marquee wall, translation toggle, split layout or unused translation styles.
  The standalone export intentionally retains its animated wall; those layout
  rules now live in `scripts/export-review-cards.mjs`, while card appearance
  still comes from the marked portable block in `globals.css`.
- **Repeated rating SVGs removed.** Each card's five 14px stars now share one
  CSS clip-path instead of repeating five inline SVG/path pairs. Accessible
  rating labels, visible `5.0`, hover sequencing and reduced-motion behavior
  remain. This removes 230 inline SVGs from each locale's rendered document.
- **Cache lifetime matches asset identity.** Only fingerprinted
  `/_next/static/**` files receive immutable year-long caching. `/images/**`,
  `/icons/**` and root images/icons use `max-age=86400` (one day): replaceable
  by a deploy, without a revalidation request per image on every visit. The
  public rules do not overlap Next's static path.
- **Documentation reconciled.** README scripts, routes, content/layout maps and
  font references now match the repo. The design system no longer uses Flutter
  implementation instructions or lists completed Next.js features as unbuilt.

### Measured result

Baseline is the Phase 2 production export immediately before these changes.
Gzip uses Node's default settings and includes Next's embedded RSC data.

| Measurement | English before | English after | Arabic before | Arabic after |
| --- | ---: | ---: | ---: | ---: |
| HTML bytes | 710,585 | 655,545 | 727,175 | 672,135 |
| Gzip bytes | 105,235 | 103,626 | 106,106 | 103,248 |
| Inline SVG elements | 287 | 57 | 287 | 57 |

English HTML is 7.7% smaller and Arabic 7.6%; gzip falls 1.5% and 2.7%
respectively. This is a payload measurement, not a claim of improved LCP.

### Validation

`npm run export:reviews` rebuilt the site and generated all 43 non-empty PNGs,
the standalone animated HTML wall, CSS, data, logos and portable React source.
The standalone wall and an individual exported card were visually checked.
TypeScript, ESLint, analytics docs, agent docs, `check:portfolio` and
`git diff --check` pass. Firebase's local Hosting emulator confirms immutable
caching on a fingerprinted Next font and revalidation on `og.png`, root icons,
`/images/**`, `/icons/**` and `/`. The complete Chrome/CDP matrix passes in both
locales, including explicit five-star geometry/clip-path checks, all earlier
interaction, no-JS, pre-hydration and reduced-motion checks. No analytics
parameters or live deployment changed.

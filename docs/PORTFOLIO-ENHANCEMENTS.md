# Portfolio enhancement verification

Implemented on `codex/portfolio-enhancements`, based on freshly fetched `origin/main` (including SAAD). English remains at `/`; Arabic is at `/ar/`, with matching privacy pages.

## Delivered

- Marketplace summary immediately after the technology strip, three attributed testimonials before the project cards, explicit project availability, and problem/responsibility/decisions/result stories for featured work.
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

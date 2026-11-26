# resu_me (React) — Mohamed Ramadan's portfolio

A single-page Next.js portfolio, statically exported and deployed to Firebase
Hosting (project `m0rmdn`), live at **https://mormdn.com**. One scrolling page,
eight sections, plus a `noindex` privacy page that Google Analytics' terms require.

This replaces a Flutter Web app that still lives at `/Users/dark/Dev/resu_me`.
The reason for the port: Flutter Web paints text into a `<canvas>`, so the page
was invisible to search engines, screen readers and Cmd+F. **Anything that puts
content back out of reach of a crawler defeats the point of this repo.**

Design direction: **Ledger** (light) and **Obsidian** (dark), one copper accent
in both. The default theme mode is **auto**: it follows the system setting. `design/` is the authority for anything
visual — read `design/DESIGN-SYSTEM.md` before touching UI.

---

## This file is the one project guide

Every agent (Claude Code, Codex, Kimi, Cursor, Copilot, Gemini, anything else) and
every person working here follows this file. There is no second copy: `CLAUDE.md`
is the single line `@AGENTS.md`, so Claude Code loads this same text, and
`npm run agents:check` fails if it ever becomes anything else.

**Keep it current. That is part of every change, whichever agent makes it.**

- Edit `AGENTS.md`. Never write project rules into `CLAUDE.md`, `GEMINI.md`,
  `KIMI.md`, `.cursorrules`, `.github/copilot-instructions.md` or any other
  tool-specific file. If a tool needs one, make it point here.
- When you learn something durable (a trap, a rule, a new or changed command, a
  closed open item), update the right section in the same change as the code.
  Do not leave it only in tool-private memory such as Claude's auto-memory or a
  Codex or Kimi session.
- Correct or delete what is no longer true instead of appending a contradiction.
- Do not hand-edit the `nextjs-agent-rules` block at the bottom. `next dev`
  owns it.

---

## Quick start

```bash
npm install
npm run dev
```

| Command | |
|---|---|
| `npm run dev` | dev server on :3000 |
| `npm run build` | static export to `out/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | eslint |
| `npm run analytics:docs` | regenerate `docs/ANALYTICS-EVENTS.md` from the catalog; `-- --check` validates it (CI runs this) |
| `npm run agents:check` | fail if `CLAUDE.md` or another tool's instruction file stops pointing at `AGENTS.md` (CI runs this) |
| `npm run images` | regenerate AVIF/WebP variants from `public/images/*-src.png` |
| `npm run promos` | compose store-style promos into `assets/projects/` (needs Chrome), then run `npm run images` |
| `npm run banners` | compose the LinkedIn, Facebook and X banners into `exports/social-banners/` (gitignored, needs Chrome) |
| `npm run video` | render the reviews and client map film into `exports/video/` (gitignored, needs Chrome and Xcode command line tools); words and chapters live in `scripts/video/reel.json`, guide in `docs/REEL.md` |
| `npm run og` | regenerate `public/og.png` |
| `npm run map` | redraw the client map from `content/clients.json` |
| `npm run export:reviews` | build, then package the review cards into `exports/review-cards/` (gitignored) |

Deploy:

```bash
npx firebase hosting:channel:deploy preview --project m0rmdn   # throwaway URL
npx firebase deploy --only hosting --project m0rmdn            # live
```

CI is `.github/workflows/firebase-deploy.yml`: PRs get a 7-day preview channel,
`main` goes live.

---

## Architecture

Server components by default. `"use client"` only where something genuinely
needs the browser: `Nav`, `Experience`, `FeaturedPanel`, `ProjectGallery`, `Contact`,
`Footer`, the consent and language controls, and `ClientMapExplorer`. No state library, no router — it is one page.

```
app/
├── (english)/       English root layout, home and privacy routes
├── (arabic)/        Arabic root layout, /ar/ and /ar/privacy/
│                    shared composition: components/PortfolioPage.tsx
│                    shared document: components/DocumentShell.tsx
├── llms.txt/         /llms.txt, built from content/ — never hand-edit a copy of it
└── globals.css       ALL design tokens (@theme) + the animation layer
components/
├── analytics/        AnalyticsRoot, ConsentNotice
├── brand/            MoRmdnMark, MoRmdnLockup — SVG, geometry locked
├── ui/               Section, Eyebrow, Button, Tag, ReviewCard
└── sections/         one file per band of the page
content/              every word and number the site renders
lib/                  firebase, hooks, cn
lib/analytics/        the event catalog, the tag, the listeners, the dwell engine
docs/                 ANALYTICS.md (the rules), ANALYTICS-EVENTS.md (generated)
                      marketplaces/ one file per marketplace: what the site shows, where it lives, how to refresh
scripts/              image + OG generation, run by hand
                      video/reel.json is the one file to edit to change the reel's words (docs/REEL.md)
```

### Content

**All copy lives in `content/`, never inline in a component.** `site.ts`
(identity, links, metrics), `projects.ts`, `experience.ts`, `skills.ts`,
`copy.ts` (section prose), `types.ts`, `reviews.ts` + `reviews.json` (client
reviews), `platform-marks.json` (marketplace logos), `clients.ts` + `clients.json`
(clients by country) and `world-map.json` (generated, do not edit).

Reconciled against `Mohamed_Ramadan_CV_EN.pdf`. If the CV changes, change
`content/` — not the components.

### Firebase

Realtime Database, one live path:

- `views/total` — a counter incremented once per load and streamed live in the footer.
- `contact_submissions/` — **closed.** There is no contact form; enquiries go to
  the channels in `content/site.ts`. `.write` is `false` in
  `database.rules.json`. Do not reopen it without App Check in front.

**The SDK is imported dynamically, never at module scope** (`lib/firebase.ts`).
It is ~350 KB; a static import puts it on the critical path and roughly triples
first-load JS. If you add a Firebase feature, follow the same pattern. `getDb()` also waits
for `load` and an idle callback, so the SDK never runs during hydration, and it
calls `forceWebSockets()`: the long-polling fallback uses `document.write`.

Local config is `.env` (gitignored). Copy `.env.example` and fill it from the
Firebase console. The web SDK still ships these values in the client bundle;
they stay out of git so GitHub secret scanning does not flag the API key.
`output: "export"` inlines `NEXT_PUBLIC_*` at build time, so CI injects the same
keys from GitHub Actions secrets. Security comes from `database.rules.json`.

### Analytics

Google Analytics 4 through `gtag.js`, not the Firebase SDK. **Every person and agent
working here must read [docs/ANALYTICS.md](docs/ANALYTICS.md) before adding a link,
button, event, section or page.** Analytics is not optional: it applies to every
change that adds or changes something a visitor can interact with.

- Every link and button spreads `{...trackAttrs(event, params)}`. ESLint fails one
  that does not. It is data attributes and one delegated listener, so it works in
  server components and adds no JavaScript.
- Every event and parameter is declared in `lib/analytics/catalog.ts` with a full
  description of what it means and why it matters. Undeclared ones do not
  compile. Every event has a readable sentence in `lib/analytics/sentences.ts`.
- Run `npm run analytics:docs` after changing the catalog, and commit
  `docs/ANALYTICS-EVENTS.md`. CI fails on stale docs.
- Never send personal data: no names, emails, phone numbers, reviewer names,
  copied or typed text, or fingerprints. Review ids contain first names, so
  events send a hash.
- Never call `gtag` or `dataLayer` directly outside `lib/analytics/gtag.ts`, and
  never add another analytics tool or tag.
- If what is collected changes, update `privacyCopy` in `content/copy.ts`.
- New parameters must be registered in GA, or they do not appear in reports. If
  you cannot register them, say so in your final report and name them.

---

## House rules

- **No raw hex in components.** Every colour is a token in `app/globals.css`.
  Need a new shade? Add it there first.
- **One copper accent per viewport.** If two things are copper, one is wrong.
- **Elevation is hairlines and offsets, not blur.** Use the `elevation-*`
  utilities.
- **Token names are roles, and every token has a light and a dark value.**
  `ink-*` are the ground planes (paper in light, ink in dark) and `bone*` is
  the foreground. Light values live in `@theme`, dark ones under
  `:root[data-theme="dark"]` and the `prefers-color-scheme` fallback in
  `app/globals.css`. A new token needs both. `.band` (Contact, footer) applies
  the dark values in both themes.
- **`--color-bone-52` is the contrast floor for text** in both themes: ink at
  0.66 on paper, bone at 0.52 on ink, each the lowest alpha that clears 4.5:1
  on every ground of its theme. `bone-38` and below are decoration only —
  dividers, watermarks. Never put a word a reader needs in one of them, and
  mark them `aria-hidden` when they render as text. Copper on a fill takes
  `text-on-copper`, never `text-ink-900`.
- **Ledger numbering (`01–06`) is the page's one signature.** It marks the
  section eyebrows (`<Eyebrow index>`), the section rail and the menu sheet.
  Do not number anything else.
- **Every animation needs a `prefers-reduced-motion` fallback**, and it must
  degrade to the finished state, never a half-played one.
- Fonts are `next/font/local` files committed in `app/fonts/`. Do not add a
  Google Fonts `<link>`, and do not switch back to `next/font/google`: Google
  sometimes serves `/l/font?kit=…&skey=…` URLs, which Turbopack cannot parse,
  and the build fails.
- **Every control is tracked, and nothing bypasses the catalog.** No `gtag()` or
  `dataLayer` outside `lib/analytics/gtag.ts`. See `docs/ANALYTICS.md`.
- Before calling something done, run:

  ```bash
  npm run typecheck && npm run lint && npm run analytics:docs -- --check && npm run agents:check && npm run build
  ```

---

## Things that will bite you

**Collapsed accordion panels stay in the DOM.** That is what puts every
achievement bullet in the served HTML. Closed `.disclosure` panels use
`visibility: hidden` before hydration, then `useHydrated` applies `inert`. The
server HTML must not emit `inert`: `@media (scripting: none)` opens every panel
visually, but CSS cannot undo that attribute, so no-JS links would remain
unfocusable and outside the accessibility tree. Do not swap this for
conditional rendering — it would strip the content from the page source.

**The gallery's `row-gap` must stay 0.** Each detail plane is a grid item of its
own, and `grid-flow-dense` lets the tiles backfill the row it would have broken.
A closed plane is a zero-height row, so any row gap would show as a stack of
empty gaps. The space between rows is `pb-4` on the tile's slot. The first tile
spans two columns, which only fills the grid at seven tiles: move the span if the
count changes.

**Keep the review export wall paint-contained.** Its animated max-content track
can widen the document unless the rows clip and use `contain: paint`. The site
uses a wrapping technology list and static review grids.

**Never drive state from pointer-move.** Pointer-follow effects must write a
transform inside a rAF loop and hold zero React state. A `setState` per pointer
move would re-render the page on every mouse twitch.

**Static export has no server.** No API routes, no server actions, no
`next/image` optimisation (`images.unoptimized` is set, and
`scripts/optimize-images.mjs` generates the variants ahead of time).

**Do not add a catch-all rewrite to `firebase.json`.** A
`{"source": "**", "destination": "/index.html"}` rewrite makes every URL on the
site return `200` with the homepage, which hands a crawler an unbounded space
of duplicate pages. With no rewrite, Hosting serves `out/404.html` with a real
`404`. The site is one static page with in-page anchors and no client router,
so nothing needs the rewrite.

**`**/*.html` header rules do not match `/`.** Firebase matches the *request*
path, not the file it resolves to, and `cleanUrls` means the homepage is
requested as `/`. The `must-revalidate` rule therefore names `/`, `/404` and
`/privacy/` explicitly. Add any new page to that list or it ships with a one-hour
cache.

**Next's RSC payloads are public.** `/__next._full.txt` and friends are the
whole page again as plain text at their own URLs. `firebase.json` sends them
`X-Robots-Tag: noindex`. It is deliberately not a `robots.txt` `Disallow` — a
disallowed URL is never fetched, so the directive would never be read.

**The hero headline paints at full opacity from the first frame.** `.rise-lcp`
uses a short translation so the headline is eligible for LCP as soon as it
paints. The three images in the hero figure (Lpermis and Mutabbib promos,
AYCO's home screen) load eagerly. The ledger
strip's values are derived from `content/` (first experience year, current
role), so they move with the data.

**The theme is set before first paint.** `themeScript` in `lib/theme.ts` runs
inline, first in `<body>` (`components/DocumentShell.tsx`). It reads
`localStorage.theme` (`light` or `dark`; absent means auto), sets the resolved
`data-theme` and the choice `data-theme-mode` on `<html>`, which carries
`suppressHydrationWarning` for that reason, and stays subscribed so auto
follows an OS theme change live. The nav toggle cycles auto → light → dark;
choosing auto removes the key. Do not move the theme into React state that
renders on the server: the HTML would ship one theme and flash to the other.

**The Archivo file is instanced, not the Google original.** It carries only
`wght 400–600` and `wdth 100–118` (Ledger's display width). A heavier weight or
another width means regenerating it with fontTools `varLib.instancer` from the
Google Fonts variable file; nothing outside that range renders.

**Scroll reveals hide nothing until JavaScript says so.** `[data-reveal]`
elements are only hidden under `html.reveal-on`, which
`components/motion/RevealObserver.tsx` adds after load, and never under
reduced motion. The served HTML, crawlers and no-JS visitors get the finished
page. Do not put `data-reveal` on a cell of a `.hairline-grid`: a hidden cell
shows the line colour. Reveal the grid. Staggers use `stagger(i)` from
`lib/motion.ts`.

**The nav island writes its progress ring outside React.** The ring is a CSS
variable set in a rAF scroll callback. Its links stay in the served HTML and,
without scripting, stand open (`.island-links` under `@media (scripting: none)`).

**Scroll-spy observer entries are changes, not a snapshot.** Keep a set of all
intersecting sections across callbacks and choose from it after both entries
and exits. Filtering only the current callback loses the section that remained
visible whenever another section exits, stranding a stale active link.

**`getProfile("ar")` returns fresh arrays on every call.** In a client
component, memoise the call by locale before its results feed a hook
dependency list — an unstable `ids` array makes `useScrollSpy` destroy and
recreate its `IntersectionObserver` on every render.

---

**Review quotes are verbatim.** `content/reviews.json` is copied word for word
from the marketplaces, typos included. Fix nothing. An Arabic review keeps the
original and carries a labelled `translation`. Khamsat is limited to the
programming services, and a quote that appears on two platforms is used once.

**Marketplace review pages hide their content from a quick scrape.** Fiverr shows
no reviews on the profile while the gigs are paused; the signed-in owner can
read them on the gig page (`/mormdn/fix-flutter-app-source-code`). Upwork
truncates quotes behind "See more" and Freelancer lists the last four only in a
modal. Khamsat lists every service, paused ones included, only on
`/user/m0rmdn/reviews`, not on the services page, and it answers scripted
requests with a block, so it needs a browser too. To refresh them, drive a
signed-in browser.

**Client counts come from a person reading profiles, not an API.** Khamsat and
Mostaql show a buyer's country on their profile, and Upwork in a job's "About the
client" panel. Mostaql hides most client profiles, so `unplaced` in
`content/clients.json` exists: those clients count towards the total and stay off
the map. Never guess a country to fill it.

Each marketplace has its own file in `docs/marketplaces/` (start at its README):
the current numbers, the four places that change together, how to read the
profile, and what went wrong before. Update the file in the same change as the
numbers. When the site and a profile disagree, ask which is current before
editing either.

**`npm run images` rewrites every variant.** The output bytes differ from the
committed files, so running it to add one image dirties all of them. Commit the
new folders and `git checkout -- public/images/projects` the rest.

**`apps-screens/Lpermis/` is the old yellow listing.** The blue set on the live
Lpermis listing is in `apps-screens/O'Permis/`. Check the store page before
trusting a folder name.

**AYCO's Play listing is invite-only and carries client data.** It 404s for
everyone but invited accounts, so do not link it until it is public: then add
`playStore`, `bundleId` and drop `isPrivate`. Its report and device-list
screenshots show real hospital names, so only the home, batch and settings
screens are used. Every screenshot there also has the dev-flavour ribbon, which
`scripts/make-promos.mjs` covers with a drawn status bar.

**The land is an image on purpose, used as a CSS mask.** `public/images/world-land.svg` is 50 KB of
path data; inline it would ship twice, in the HTML and again in the RSC payload.
Only the client countries are inline, and they are rendered by the server
component `ClientMap`, so no geometry reaches the client bundle. If you add a
country, run `npm run map` or it has no shape. The mask (`.map-land`) paints
it in `bone-10`, so the file's own fill colour never shows and the land
follows the theme.

**The map renders its finished geometry on the server.** Only filter and hover
state change in `ClientMapExplorer`.

**`.review-card` is deliberately not Tailwind.** Everything between the
`review-cards:start` and `:end` markers in `globals.css` is lifted into the
export, so it can use tokens but no utilities. Rating stars are CSS clip-paths,
not repeated inline SVG paths. The standalone export's animated wall layout
lives in `scripts/export-review-cards.mjs`, not in the production stylesheet;
the card block itself must remain self-contained. The export reads the card
markup out of `out/index.html`, so it needs a build first.

**Only fingerprinted assets are immutable.** `/_next/static/**` gets year-long
immutable caching. Stable public files such as `og.png`, project images, icons
and `world-land.svg` get `max-age=86400`: never `immutable`, so regeneration and
deployment replace them within a day, but long enough that a returning visitor
does not pay a revalidation request per image. Hosting purges its own
CDN on every deploy, so only browser caches can lag.

**Reviews use a static grid.** Six selected reviews appear first; the rest stay in
server-rendered HTML inside a native disclosure. Translations are labelled and
originals remain accessible. The six opening Reviews IDs must stay disjoint from
the three Projects testimonial IDs so the same cards do not greet visitors twice.
The export still deduplicates by review ID. Do not reintroduce cloned review tracks.

**Locale is explicit.** English is `/`, Arabic is `/ar/`, with matching privacy
pages. Root layouts render `lang` and `dir` before JavaScript. Copy lives under
`content/`; project IDs, links, assets and analytics identity are shared.

## Open items

- **`views/total` is still world-writable** — anyone can set it to any number.
  Embarrassing rather than dangerous. Fix with App Check (reCAPTCHA v3) required
  in the rules; a static export has no server route to hide behind.
- **`m0rmdn.web.app` is a duplicate host.** It serves the identical build at
  `200` alongside `mormdn.com` (same etag). Firebase Hosting has no
  host-conditional redirect for its own `.web.app` address, so there is no
  `301` to give it and Search Console's Change of Address tool does not apply.
  Both hosts serve `rel="canonical"` pointing at `mormdn.com`; that is the
  whole consolidation mechanism. Do not "fix" this with a JS redirect.
- **`www.mormdn.com` does not resolve.** Console + registrar work; steps are in
  `README.md` under "Custom domain".
- **The `Person` has no `image`.** The only candidates under `public/` are
  project art and the text-composition `og.png`, and pointing `image` at that
  is worse than omitting it. A real portrait is the one remaining
  structured-data gap that feeds a knowledge panel.
- Only Arcit-AI has a screenshot. Drop a PNG at
  `public/images/<slug>-src.png`, run `npm run images`, and set `image` on that
  project in `content/projects.ts`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

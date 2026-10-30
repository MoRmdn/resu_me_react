# resu_me (React) — Mohamed Ramadan's portfolio

A single-page Next.js portfolio, statically exported and deployed to Firebase
Hosting (project `m0rmdn`), live at **https://mormdn.com**. One scrolling page,
eight sections.

This replaces a Flutter Web app that still lives at `/Users/dark/Dev/resu_me`.
The reason for the port: Flutter Web paints text into a `<canvas>`, so the page
was invisible to search engines, screen readers and Cmd+F. **Anything that puts
content back out of reach of a crawler defeats the point of this repo.**

Design codename: **Obsidian & Copper**. `design/` is the authority for anything
visual — read it before touching UI.

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
| `npm run images` | regenerate AVIF/WebP variants from `public/images/*-src.png` |
| `npm run promos` | compose store-style promos into `assets/projects/` (needs Chrome), then run `npm run images` |
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
needs the browser: `Nav`, `Hero`, `Experience`, `ProjectGallery`, `Contact`,
`Footer`, the motion primitives, the two small Reviews toggles, and
`ClientMapExplorer`. No state library, no router — it is one page.

```
app/
├── layout.tsx        fonts, metadata, Open Graph, JSON-LD Person, grain, skip link
├── page.tsx          section composition
└── globals.css       ALL design tokens (@theme) + the animation layer
components/
├── brand/            MoRmdnMark, MoRmdnLockup, MoRmdnMarkDraw — SVG, geometry locked
├── ui/               Section, Eyebrow, Button, Tag, ReviewCard
├── motion/           Reveal, RevealRoot, CountUp, ScrollProgress, CursorGlow, Marquee, MarqueeToggle
└── sections/         one file per band of the page
content/              every word and number the site renders
lib/                  firebase, hooks, cn
scripts/              image + OG generation, run by hand
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

- `views/total` — a counter incremented once per load and streamed live.
- `contact_submissions/` — **closed.** There is no contact form; enquiries go to
  the channels in `content/site.ts`. `.write` is `false` in
  `database.rules.json`. Do not reopen it without App Check in front.

**The SDK is imported dynamically, never at module scope** (`lib/firebase.ts`).
It is ~350 KB; a static import puts it on the critical path and roughly triples
first-load JS. If you add a Firebase feature, follow the same pattern.

Local config is `.env` (gitignored). Copy `.env.example` and fill it from the
Firebase console. The web SDK still ships these values in the client bundle;
they stay out of git so GitHub secret scanning does not flag the API key.
`output: "export"` inlines `NEXT_PUBLIC_*` at build time, so CI injects the same
keys from GitHub Actions secrets. Security comes from `database.rules.json`.

---

## House rules

- **No raw hex in components.** Every colour is a token in `app/globals.css`.
  Need a new shade? Add it there first.
- **One copper accent per viewport.** If two things are copper, one is wrong.
- **Elevation is hairlines and offsets, not blur.** Use the `elevation-*`
  utilities.
- **`--color-bone-52` is the contrast floor for text.** It is the lowest alpha
  that clears 4.5:1 on every ink ground. `bone-38` and `bone-28` are below it
  and are decoration only — dividers, watermarks, the card index. Never put a
  word a reader needs in one of them, and mark them `aria-hidden` when they
  render as text.
- **Every animation needs a `prefers-reduced-motion` fallback**, and it must
  degrade to the finished state, never a half-played one.
- Fonts are `next/font` (self-hosted). Do not add a Google Fonts `<link>`.
- Run `npm run typecheck && npm run lint && npm run build` before calling
  something done.

---

## Things that will bite you

**Reveal-on-scroll must never permanently hide content.** `.reveal` starts at
`opacity: 0`, so if the observer misses an element it disappears for good. Two
guards exist and both matter: the observer's `rootMargin` has a huge *top*
value so anything the viewport jumps past (anchor link, deep link, scroll
restoration) reveals immediately; and `@media (scripting: none)` shows
everything when JS is off. Do not "tidy" either away.

**Collapsed accordion panels stay in the DOM.** That is what puts every
achievement bullet in the served HTML. They carry `inert` when closed so they
leave the tab order and the accessibility tree. Do not swap this for
conditional rendering — it would strip the content from the page source.

**The gallery's `row-gap` must stay 0.** Each detail plane is a grid item of its
own, and `grid-flow-dense` lets the tiles backfill the row it would have broken.
A closed plane is a zero-height row, so any row gap would show as a stack of
empty gaps. The space between rows is `pb-3.5` on the tile's slot. The first tile
spans two columns, which only fills the grid at seven tiles: move the span if the
count changes.

**Never drive state from pointer-move.** `CursorGlow` writes a transform inside
a rAF loop and holds zero React state. A `setState` per pointer move would
re-render the page on every mouse twitch.

**`IntersectionObserver` and `requestAnimationFrame` are suspended in hidden
tabs.** Reveals and count-ups will not run until the tab is foregrounded. That
is correct, but it makes automated screenshot testing unreliable if the browser
pane is collapsed — verify structurally (`getBoundingClientRect`,
`getComputedStyle`) when you cannot see the page.

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
requested as `/`. The `must-revalidate` rule therefore names `/` and `/404`
explicitly. Add any new page to that list or it ships with a one-hour cache.

**Next's RSC payloads are public.** `/__next._full.txt` and friends are the
whole page again as plain text at their own URLs. `firebase.json` sends them
`X-Robots-Tag: noindex`. It is deliberately not a `robots.txt` `Disallow` — a
disallowed URL is never fetched, so the directive would never be read.

**The hero headline is the LCP element.** It uses `.rise-lcp`, not `.rise`:
`rise-in` starts at `opacity: 0` with `both` fill, and Chrome will not accept a
transparent element as an LCP candidate, so a `.rise` headline delays LCP by
its own `--rise-delay` on every load. `rise-lcp` keeps the movement and drops
the fade. Do not "unify" it back into `.rise`.

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

**The land is an image on purpose.** `public/images/world-land.svg` is 50 KB of
path data; inline it would ship twice, in the HTML and again in the RSC payload.
Only the client countries are inline, and they are rendered by the server
component `ClientMap`, so no geometry reaches the client bundle. If you add a
country, run `npm run map` or it has no shape.

**The map's finished state is the base style.** Its intro is an animation keyed
off Reveal's `data-visible`, not a hidden start state, so a missed observer or
reduced motion shows a complete map rather than an empty one.

**`.review-card` is deliberately not Tailwind.** Everything between the
`review-cards:start` and `:end` markers in `globals.css` is lifted into the
export, so it can use tokens and the marquee but no utilities. The export reads
the card markup out of `out/index.html`, so it needs a build first.

**The review wall duplicates its track.** Only the first `<ul>` in a row is
content. The second is `aria-hidden` + `inert`, exists only to make the loop
seamless, and is dropped under reduced motion. Keep focusable elements out of
the cards: the second copy would still need to swallow them.

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
- Light ("Bone") theme is specced in `design/DESIGN-SYSTEM.md` §1.2, not built.
- Only Arcit-AI has a screenshot. Drop a PNG at
  `public/images/<slug>-src.png`, run `npm run images`, and set `image` on that
  project in `content/projects.ts`.

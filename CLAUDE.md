# resu_me (React) — Mohamed Ramadan's portfolio

A single-page Next.js portfolio, statically exported and deployed to Firebase
Hosting (project `m0rmdn`). One scrolling page, seven sections.

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
| `npm run og` | regenerate `public/og.png` |

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
needs the browser: `Nav`, `Hero`, `Experience`, `Contact`, `Footer`, and the
motion primitives. No state library, no router — it is one page.

```
app/
├── layout.tsx        fonts, metadata, Open Graph, JSON-LD Person, grain, skip link
├── page.tsx          section composition
└── globals.css       ALL design tokens (@theme) + the animation layer
components/
├── brand/            MoRmdnMark, MoRmdnLockup, MoRmdnMarkDraw — SVG, geometry locked
├── ui/               Section, Eyebrow, Button, Tag
├── motion/           Reveal, RevealRoot, CountUp, ScrollProgress, CursorGlow, Marquee
└── sections/         one file per band of the page
content/              every word and number the site renders
lib/                  firebase, hooks, cn
scripts/              image + OG generation, run by hand
```

### Content

**All copy lives in `content/`, never inline in a component.** `site.ts`
(identity, links, metrics), `projects.ts`, `experience.ts`, `skills.ts`,
`copy.ts` (section prose), `types.ts`.

Reconciled against `Mohamed_Ramadan_CV_EN.pdf`. If the CV changes, change
`content/` — not the components.

### Firebase

Realtime Database, two paths, unchanged from the Flutter app so the existing
rules still apply:

- `contact_submissions/` — pushed by the contact form.
- `views/total` — a counter incremented once per load and streamed live.

**The SDK is imported dynamically, never at module scope** (`lib/firebase.ts`).
It is ~350 KB; a static import puts it on the critical path and roughly triples
first-load JS. If you add a Firebase feature, follow the same pattern.

Config is in `.env`, checked in on purpose — the web SDK ships those values in
the client bundle regardless, and `output: "export"` inlines them at build time
so CI needs them present. Security comes from `database.rules.json`.

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

---

## Open items

- **`contact_submissions` has `.read: false`,** so no client-side admin inbox is
  possible. The Flutter `admin_page.dart` could not read them either. Submissions
  are visible only in the Firebase console until auth and rules are added. Not
  ported for that reason.
- **The RTDB is unauthenticated-writable.** Anyone can spam the contact form or
  set `views/total` to any number. Fix with App Check (reCAPTCHA v3) required in
  the rules. Static export gives no server route to hide behind.
- Light ("Bone") theme is specced in `design/DESIGN-SYSTEM.md` §1.2, not built.
- Only Arcit-AI has a screenshot. Drop a PNG at
  `public/images/<slug>-src.png`, run `npm run images`, and set `image` on that
  project in `content/projects.ts`.

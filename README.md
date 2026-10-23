# Mohamed Ramadan — portfolio

Single-page portfolio. Next.js 16, statically exported, hosted on Firebase.

**Live:** [mormdn.com](https://mormdn.com)

Flutter developer in Mansoura. Five years of cross-platform apps. The page is
one scroll: Hero, About, Experience, Projects, Skills, Contact.

## Why React

The previous version was Flutter Web. Flutter paints text into a `<canvas>`, so
search engines, link previews, screen readers, and Cmd+F all saw an empty
document. For a portfolio, being unfindable is a product defect.

This export ships the CV as HTML. The page still reads with JavaScript off.

Do not put copy behind a canvas, a closed accordion that unmounts, or a
client-only fetch. That would undo the port.

## Stack

| | |
|---|---|
| App | Next.js 16 (App Router), React 19, TypeScript |
| Style | Tailwind 4, design tokens in `app/globals.css` |
| Hosting | Firebase Hosting, project `m0rmdn` |
| Data | Firebase Realtime Database — live view counter only |
| Node | 22 |

No router, no state library. It is one page. `"use client"` only where the
browser is required (nav, motion, the live counter).

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Fill `.env` from Firebase → Project settings → Your apps → SDK config.
`.env` is gitignored on purpose: GitHub secret scanning flags the web API key
even though it ships in the client bundle anyway.

| Variable | |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Web API key |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `m0rmdn` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `m0rmdn.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL` | Realtime Database URL |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Analytics (`G-…`) |

Access control is `database.rules.json`, not the API key.

## Scripts

| Command | |
|---|---|
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Static export to `out/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run images` | AVIF/WebP from `public/images/*-src.png` |
| `npm run og` | Regenerate `public/og.png` |
| `npm run brief` | Print a content dump for review |

Before calling a change done:

```bash
npm run typecheck && npm run lint && npm run build
```

## Editing content

Every word and number lives in `content/`. Change the files, not the components.

| File | |
|---|---|
| `site.ts` | Name, title, links, metrics |
| `copy.ts` | Section prose |
| `experience.ts` | Roles and achievement bullets |
| `projects.ts` | Case studies |
| `skills.ts` | Skill groups |
| `types.ts` | Shared shapes |

If the CV changes, update `content/` so the page stays the source of truth.

Project screenshots: drop `public/images/<slug>-src.png`, run `npm run images`,
set `image` on that project in `projects.ts`.

## Layout

```
app/            layout, page, design tokens
components/
  brand/        logo SVGs
  ui/           Section, Eyebrow, Button, Tag
  motion/       reveal, count-up, cursor glow, marquee
  sections/     one file per band of the page
content/        copy and numbers
lib/            Firebase (dynamic import), hooks
design/         Obsidian & Copper — visual authority
scripts/        image and OG generation
```

## Design

Codename **Obsidian & Copper**. Read `design/` before touching UI.

Short rules that leak into code:

- No raw hex in components — tokens live in `app/globals.css`
- One copper accent per viewport
- `--color-bone-52` is the contrast floor for readable text
- Every animation has a `prefers-reduced-motion` fallback to the finished state
- Fonts are `next/font`. Do not add a Google Fonts `<link>`

## Firebase

The SDK is loaded dynamically in `lib/firebase.ts` (~350 KB). A static import
would put it on the first-load path.

Realtime Database paths:

- `views/total` — incremented once per visit, streamed live
- `contact_submissions/` — closed. There is no form; enquiries go to the
  channels in `content/site.ts`

## Deploy

Local:

```bash
npm run build
npx firebase hosting:channel:deploy preview --project m0rmdn   # throwaway URL
npx firebase deploy --only hosting --project m0rmdn            # https://mormdn.com
```

A preview channel does not update production. Use the second command for
[mormdn.com](https://mormdn.com). Firebase's `m0rmdn.web.app` address remains
available as a hosting fallback.

### Custom domain

The canonical production URL is `https://mormdn.com`. The Firebase project ID
remains `m0rmdn`; changing it would create a different backend rather than
change the site's public address.

The apex is live. The DNS zone currently holds:

| Host | Type | Value | Status |
|---|---|---|---|
| `@` | `A` | `199.36.158.100` | live |
| `@` | `TXT` | `hosting-site=m0rmdn` | live |
| `www` | — | — | **not configured** |

Remove the registrar's parking `A` records before adding the Firebase `A`
record. Firebase provisions and renews the TLS certificate after DNS propagates.

**`www.mormdn.com` does not resolve yet.** To add it: Firebase console →
Hosting → site `m0rmdn` → *Add custom domain* → `www.mormdn.com` → **Redirect
to an existing URL** → `mormdn.com`, permanent (301). Add whichever record the
console then issues — take it from the console rather than assuming a `CNAME`,
because the redirect flow does not always issue the same record type as a
served domain. Update the table above once it is in place, and confirm with:

```bash
curl -sSI https://www.mormdn.com/   # expect 301 → https://mormdn.com/
```

### Search Console

`mormdn.com` supports a **Domain** property, verified by a DNS `TXT` record.
**Add** the `google-site-verification=…` record alongside the existing
`hosting-site=m0rmdn` one — several `TXT` records can coexist at `@`, and
replacing the Firebase record breaks hosting.

`GOOGLE_SITE_VERIFICATION` in `.env` covers a separate URL-prefix property via
the meta tag in `app/layout.tsx`; the two are independent.

The old `m0rmdn.web.app` address still serves the same build at `200`. Search
Console's Change of Address tool cannot be used for it: that tool requires the
old site to `301` to the new one, and Firebase Hosting has no host-conditional
redirect for its own `.web.app` domain. Consolidation happens through the
`rel="canonical"` pointing at `mormdn.com`, which both hosts serve.

CI (`.github/workflows/firebase-deploy.yml`):

- Pull requests → 7-day preview channel
- Push to `main` → live hosting

GitHub Actions secrets required:

- Every `NEXT_PUBLIC_FIREBASE_*` variable above
- `FIREBASE_SERVICE_ACCOUNT` — JSON key for the Firebase deploy action

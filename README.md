# Mohamed Ramadan — portfolio

Single-page portfolio for a Flutter developer. Next.js 16, statically exported,
served from Firebase Hosting.

**Live:** https://m0rmdn.web.app

## Why this exists in React

The previous version was a Flutter Web app. Flutter Web renders text into a
`<canvas>`, which meant the page had no readable markup: search engines, link
previews, screen readers and browser find-in-page all saw an empty document.
For a portfolio, being unfindable is a product defect.

The static export ships the whole CV as HTML, so the content is readable with
JavaScript switched off.

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```

Fill `.env` from Firebase → Project settings → Your apps. Then http://localhost:3000.

## Scripts

| | |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | static export to `out/` |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint |
| `npm run images` | regenerate responsive AVIF/WebP from `public/images/*-src.png` |
| `npm run og` | regenerate the Open Graph card |

## Editing content

Everything the page says lives in `content/` — `site.ts`, `projects.ts`,
`experience.ts`, `skills.ts`, `copy.ts`. Nothing is written inline in a
component, so a content change never means touching layout code.

## Design

`design/` holds the Obsidian & Copper design system, the logo specification, and
the original artboard. It is the authority for anything visual.

## Deploying

```bash
npx firebase hosting:channel:deploy preview --project m0rmdn   # throwaway URL
npx firebase deploy --only hosting --project m0rmdn            # live
```

Pushing to `main` deploys via GitHub Actions; pull requests get a preview
channel that expires after seven days.

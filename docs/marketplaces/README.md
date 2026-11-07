# Marketplaces

One file per marketplace the portfolio draws numbers, reviews and client
countries from. Each says what the site shows, where it lives in `content/`,
how to refresh it, and what went wrong before.

| Marketplace | File | Site shows | Client map |
|---|---|---|---|
| Upwork | [upwork.md](upwork.md) | 8 jobs | 7 placed |
| Fiverr | [fiverr.md](fiverr.md) | 26 reviews | 15 placed |
| Freelancer | [freelancer.md](freelancer.md) | 9 reviews | 6 placed, 1 unplaced |
| Mostaql | [mostaql.md](mostaql.md) | 4 reviews | 1 placed, 3 unplaced |
| Khamsat | [khamsat.md](khamsat.md) | 88 tech reviews | 74 placed, 1 unplaced |

(Counts as of 2026-11-07. The source of truth is `content/reviews.ts` and
`content/clients.json`, not this table.)

## The same four places change every time

1. **`content/reviews.ts`**: `reviewPlatforms[].count` and `countLabel`. The total
   (`reviewTotal`) and every "N reviews and jobs" sentence derive from it.
2. **`content/reviews.json`**: new reviews, copied word for word, typos included.
   An Arabic review keeps the original and adds a labelled `translation`. A quote
   on two platforms is used once.
3. **`content/clients.json`**: clients per country per platform. A new country
   needs `npm run map`. A client whose country the platform hides goes in
   `unplaced`. Never guess one.
4. **`scripts/make-video.mjs`**: carries its own copy of the platform counts. Keep
   it equal to `reviews.ts`.

Then bump `contentLastChanged` in `content/site.ts` and run the full gate from
`AGENTS.md`.

## Rules that apply everywhere

- **The site is the source of truth.** When site and profile disagree, ask which
  is current before changing either. The MisMar entry is the example: the site was
  updated to NAAS and the Upwork profile lagged behind.
- **Clients are counted per account, once per platform.** Someone who hired on two
  sites counts twice; two jobs from one client count once.
- **Profile text on a marketplace is public content.** Editing it is an
  outward-facing change: say what will change before saving.
- Do not store passwords, API keys or session cookies in these files.

## Driving a signed-in marketplace from a browser

Reading and editing profiles needs the user's own signed-in browser. With the
Claude in Chrome extension, list the connected browsers and check which one is
the right one before touching anything: the names are only "Browser 1" and
"Browser 2". `navigator.brave.isBrave()` tells Brave apart from Chrome. Record
which browser held the sign-in in the platform's file when it matters.

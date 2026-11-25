# The reel

The 58-second vertical film (1080×1920): the planet, one chapter per marketplace with a real
review, then "World domination" and a closing line. It is made by `scripts/make-video.mjs` and
`scripts/video/stage.js`, in headless Chrome, with no ffmpeg. Output goes to `exports/video/`
(gitignored).

**To change what it says, edit one file: `scripts/video/reel.json`.** Nothing else needs touching,
and no code changes.

## Make it

```bash
npm run video -- --format=portrait                      # the reel, as reel.json says
npm run video -- --format=portrait --preview-openers    # one still of every opening, in seconds
npm run video -- --format=portrait --opener=clients     # try an opening, written to its own file
npm run video -- --format=portrait --closer=hello       # same for the closing line
npm run video -- --format=portrait --stills=3.4,20,50   # PNGs of exact moments
```

A full render takes a few minutes. `--preview-openers` takes about 20 seconds and writes
`exports/video/stills/portrait-opener-<name>-3.4s.png`, so pick the opening from the stills and
only then render. A run with `--opener` or `--closer` is saved as
`client-map-reviews-portrait-<name>.mp4` and never overwrites the main film.

## What to edit in `reel.json`

| To change | Edit |
|---|---|
| The opening ("One desk.") | `opener` names the one in use. Each entry in `openers` has `eyebrow`, `headline`, `sub`. Add your own entry and set `opener` to its name. |
| The last line ("Yours could be 21.") | `closer` names the one in use; add to `closers`. |
| The "World domination" screen | `finale`: `eyebrow`, `headline` (one string per line), `percent` (`false` hides the counting number), `stats` (the two lines under it). |
| The progress label at the top | `hud` |
| The brand line | `brand` |
| Which reviews, in what order, for how long | `chapters`: `site`, `review`, `hold`, `view`, `r` |

### Numbers are tokens, never typed

Write `{clients}`, `{countries}`, `{reviews}`, `{world}` or `{next}` (countries + 1) and the render
fills them from `content/clients.json` and the review counts. When a number changes there, the reel
is right on the next render with no edit. An unknown token fails the render with a message, so a typo
cannot ship.

- `{clients}` includes clients with no country on the map (`unplaced`), the same total as the site.
- `{reviews}` comes from the `PLATFORMS` table in `scripts/make-video.mjs`, which is hand-kept in
  step with `content/reviews.ts`. If a marketplace's review count changes, change it in both.

### Openings that are ready

`desk` One desk. · `clients` 108 clients. · `countries` 20 countries. · `reviews` 135 reviews. ·
`start` Start here. · `mansoura` Mansoura.

Keep a headline to about 12 characters. It is one line at 150px and must not reach the planet. The
render warns when one is longer than 13.

### Chapters

One chapter is one review card, in the order listed. The reel now runs eight.

- `site` is `mostaql`, `upwork`, `freelancer`, `khamsat` or `fiverr`. The card shows that marketplace's logo
  in a chip at the top, with the site's name beside a symbol-only logo (Upwork, Freelancer, Khamsat).
- `review` is an id in `content/reviews.json` and must be on that same `site`, or the render stops.
  Quotes are verbatim: fix nothing in the review, change which one is used.
- To add a review, add a line with its `site` and `review` id. Two cards from one site are fine: the first draws
  that site's lines across the map, the next ones only settle the camera and keep the lines lit.
- `view` is `[longitude, latitude]` of the planet and `r` its size, framed so that site's countries sit clear of
  the card. Give them on the **first** chapter of a site; later chapters of that site reuse them. Change them only
  if a country is out of frame, and check with `--stills`.
- `hold` is reading time in seconds. Leave it out and it is worked out from the quote (4.2 to 8 seconds); set it
  to give a card more or less time.
- List the site with the smallest reach first, so each site lights more of the map than the last.
- The small tag under each card reads site, count and position, such as `UPWORK 8 jobs 2/8`.

## Voice

Set `"voice": true` in `reel.json` and, if `exports/video/voice/01.mp3` to `11.mp3` exist, the render also
writes a `-voice.mp4` mixed from them. The clips are timed to a particular film, so it stays `false`
for any new chapter list until new clips are recorded and the `VOICE` start times in
`scripts/make-video.mjs` are matched to them.

## Landscape

`--format=landscape` renders the 1920×1080 film from the same file.

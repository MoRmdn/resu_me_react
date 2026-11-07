# Fiverr

- **Profile:** https://www.fiverr.com/mormdn (handle `mormdn`)
- **Site shows:** **26 reviews**; client map: 15 placed. Quotes in
  `content/reviews.json` with `platform: "fiverr"` (11 used on the site).

## How to refresh

- The profile page shows **no reviews while the gigs are paused**. The signed-in
  owner can read them on the gig page, for example
  `/mormdn/fix-flutter-app-source-code`.
- Buyer country is shown on the review. Count each buyer once per platform.
- Update the four places in [README.md](README.md).

## Traps

- A scrape of the public profile will undercount. Use a signed-in browser.
- Never fix typos in a quote.

## Profile text, last synced to the site 2026-11-07

- **Occupation title:** "Software Engineer". Fiverr rejects `·`, `&`, `-` and
  `,` in it ("Tagline can only contain letters, numbers, spaces, and basic
  punctuation"), so a longer tagline did not save.
- **About** (600-character limit, now 560): software engineer, 5+ years, Flutter,
  Firebase and React; published apps; now building NAAS.
- **Work experience, MisMar:** the site's NAAS wording (limit 2,000, now 806).
  Fiverr flags the Ebdda LTD entry **"Rejected"** (not verified): worth a look.

## Editing through a browser

- The editable profile is `https://www.fiverr.com/sellers/mormdn/edit`.
- **About and title save on blur**: click empty space after typing. There is no
  Save button. Set values with the native value setter plus `input` and `change`
  events, as on Upwork.
- A work-experience entry: its "..." menu, then Edit, set the textarea, **Update**.
- Reload and check the text afterwards; the rendered page can lag the saved state.

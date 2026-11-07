# Khamsat

- **Profile:** https://khamsat.com/user/m0rmdn (handle `m0rmdn`); reviews at
  `/user/m0rmdn/reviews`
- **Site shows:** **88 tech reviews**; client map: 74 placed, 1 unplaced (a
  suspended account). Quotes in `content/reviews.json` with
  `platform: "khamsat"` (18 used on the site). It is the biggest source of
  Arabic-speaking clients.

## Scope

**Programming services only.** The CV and D-U-N-S orders on the profile say
nothing about mobile work and are not counted, which is why the label is "tech
reviews" and not "reviews".

## How to refresh

- Every service, paused ones included, is listed **only on
  `/user/m0rmdn/reviews`**, not on the services page.
- Khamsat **answers scripted requests with a block**, so it needs a real browser.
- A buyer's country is on their profile.
- Reviews are in Arabic: keep the original and add a labelled `translation`.
- Update the four places in [README.md](README.md).

## Bio rewritten from scratch, 2026-11-07

The text is in [bio-ar.md](bio-ar.md). Edit page: `https://khamsat.com/account`;
field `details` ("النبذة التعريفية", 3,000 characters; the page says no links or
outside contact details); button "حفظ". It held the same old bio as Mostaql.

**Open issue:** after saving, the server-rendered form contains the new text, but the
public page `/user/m0rmdn` still says "لم يكتب نبذة شخصية" (no bio written), and it
said so before the edit too. Not yet explained (moderation, a different field, or
caching). Check the live page while signed out.

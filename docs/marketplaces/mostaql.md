# Mostaql

- **Profile:** https://mostaql.com/u/MoRmdn/reviews (handle `MoRmdn`)
- **Site shows:** **4 reviews**; client map: 1 placed, 3 unplaced. Quotes in
  `content/reviews.json` with `platform: "mostaql"` (3 used on the site).

## How to refresh

- A buyer's country appears on their profile, but **Mostaql hides most client
  profiles**. Those clients count towards the total and stay off the map
  (`unplaced`). Never guess one.
- Reviews are in Arabic: keep the original and add a labelled `translation`.
- Update the four places in [README.md](README.md).

## Profile text, last synced to the site 2026-11-07

- **Job title:** already "مهندس برمجيات" (Software Engineer).
- **Bio** (`brief`, no length limit seen, now 2,837 characters), in Arabic:
  "4+ years" became "5+ years", the specialty now says mobile **and web**, and a
  bullet under "أعمال وإسهامات" says the current work is NAAS at MisMar. The rest
  of the bio is the user's own text and was left alone.
- There is **no separate work-experience section** on the Mostaql profile; the
  bio carries it.

## Editing through a browser

- Edit page: `https://mostaql.com/account/profile`. The bio is the `brief`
  textarea; the button is "حفظ". Set the value with the native setter and fire
  `input` and `change`, then click it.
- Verify by fetching the public `/u/MoRmdn` page, not by trusting the flash text.
- Match the bullet style: the bio's bullet lines start with a single space.
- Arabic wording for NAAS should follow `content/profile-i18n.ts`.

## Bio rewritten from scratch, 2026-11-07

Replaces the 2026-11-07 morning patch above. The full text is in
[bio-ar.md](bio-ar.md). **Mostaql rejects links in the bio.** The first attempt
included `mormdn.com` and the whole form failed validation (the page then also
flagged the speciality, job title and skills fields as empty because the page had
not finished loading). Reload, wait about six seconds, confirm `speciality_id`,
`job_title` and `skills` are populated, then set `brief` and click "حفظ". Verify
by fetching `/u/MoRmdn` and looking for a heading from the new text.

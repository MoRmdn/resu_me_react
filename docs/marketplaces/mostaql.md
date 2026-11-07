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

## Portfolio, 2026-11-07

**The portfolio is capped (10 items on the current plan).** At the cap, `/portfolio/create`
redirects back with "لقد تجاوزت الحد الأقصى لعدد الأعمال المسموح بها" and a paid plan upgrade
is the only way to add more. The user chose to delete two items instead:

- **Deleted: Cavour** (a salon-booking template listing, not on mormdn.com) and **Aera** (the
  Flutter e-commerce item). Both are saved locally in `~/Downloads/apps-screens/cavour/` and
  `aera/` with their images and descriptions.
- That left 8 items; the aim was to add NAAS and SAAD (10). Still missing from Mostaql: SAAD, JS
  Quest, NAAS, O'Permis. With a 10 cap, only two of the four fit.

### The add-work form (`https://mostaql.com/portfolio/create`)

- Fields: `title`, thumbnail upload, `details`, extra files (up to 20), `url` (preview link,
  optional), `completed_date` (dd/mm/yyyy), `skills` (optional), and a **required rights tick-box**
  ("I confirm I made this work myself and have the right to publish it"). That tick-box is the
  user's statement: do not tick it for them. An automated attempt was blocked.
- Two real `input[type=file]` exist (`find` returns two refs). The **second one (images only) is
  the thumbnail**; the first takes any file type. `file_upload` works on them.
- Title and description: native value setter plus `input`/`change`. Titles follow "Name - Arabic
  descriptor". No links in the description.
- **Skills** is a selectize list loaded from a fixed set; it has "برمجة أندرويد" (225),
  "أندرويد ستوديو" (735), "جافا سكريبت" (461), "HTML", "PHP" and design/marketing skills, but
  nothing for Flutter, Firebase or web apps, so NAAS was left without skills.
- Delete: on the item page, "حذف العمل", then the same button in the confirmation dialog.

### State at the end of the session

The user ticked the rights box and submitted NAAS (9 items). SAAD was then filled the same way
(thumbnail `02-saad.png`, Arabic title and description, completion date 04/11/2026, the day its
Play screenshots were captured) and left for the user to tick the box and submit, which makes 10.

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

- **Occupation title:** "Software Engineer Cross Platform Mobile and Web Applications" (the site title, punctuation dropped). Fiverr rejects `·`, `&`, `-` and
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

## Portfolio synced to the site, 2026-11-07 (14 items)

Added by browser: Arcit-AI, Mutabbib, Lpermis, Lpermis Pro, Dental Dinar, NAAS, SAAD, JS Quest,
O'Permis (AYCO, Saber, FreeDoc were already there, plus Aera and Wassalny, which are not on the
site). Each carries one cover (the 4:3 PNG in `~/Downloads/apps-screens/fiverr-covers/`), the
text from `fiverr-portfolio-text.md`, **$4,000** (Fiverr shows it as a range, "$2500-$5000"),
and the category "Mobile App Development" (JS Quest: "Software Development").

Dates and duration used (confirm if they matter): Arcit-AI Dec 2023, Mutabbib Jan 2024,
Lpermis / Lpermis Pro / Dental Dinar / O'Permis Mar 2023, NAAS Jan 2025, SAAD Oct 2025,
JS Quest Jun 2026. Duration is "6+ months" everywhere except JS Quest ("3-6 months").
The $4,000 and the SAAD, JS Quest and O'Permis dates came from the user.

### How the form behaves (what worked)

- Form: `https://www.fiverr.com/users/mormdn/portfolio/new`. Step 1 "Create project", step 2
  "Link to catalog" (a category, then "Publish project").
- **Fiverr's file input is a real `input[type=file]`**: `find` returns `ref_261` and
  `file_upload` works (unlike Upwork). Max 5 files, the first is the thumbnail.
- **Project cost is required** and public. Name is 50 characters, description 1,400.
- Title and description: set with the native value setter plus `input`/`change`. Setting the
  cost that way threw "Illegal invocation": click the field and type instead.
- The dropdowns are custom widgets. Clicking an option in duration/month/year does nothing:
  **open the field, then use the keyboard** (Down N, Enter). Month: January is 0 Downs. Year:
  2026 is 0 Downs, 2025 is 1. Duration: 6+ months needs 5 or more Downs; check the result.
- Industry and category are typeahead lists where a mouse click on the option works. Fiverr's
  wording: "Health Care & Medical Center", "Driving School", "Dental Care", "Insurance",
  "Education", "Architecture", "Social Media"; categories "Mobile App Development",
  "Software Development". There is no plain "Healthcare".
- The browser window size changed mid-session and every coordinate moved. Take a screenshot
  and recompute before clicking by coordinates.

### Why the profile showed only the old five (2026-11-07)

The **profile's Portfolio section shows only the first five projects, in the order set under
"Reorganize"** on `/users/mormdn/portfolio` ("Showing 14 projects" there is the full list). New
items are added at the end, so the profile kept showing the original five (AYCO, Saber, Wassalny,
Aera, FreeDoc). The order is now NAAS, AYCO, SAAD, Saber, Mutabbib, JS Quest, O'Permis, Dental
Dinar, Arcit-AI, Lpermis, Lpermis Pro, FreeDoc, Aera, Wassalny, so the profile shows the first five.

- "Reorganize" is a drag-and-drop list that shows about ten rows. Dragging an item to a row that is
  scrolled out of view fails (an attempt dropped Mutabbib at the bottom); drag one item at a time
  and take a screenshot after each, or reorder from a taller window.
- Do not put non-site items (Wassalny, Aera) in the first five.

### Saber (older item) and image order

- Saber now uses the mockup (`upwork-covers/07-saber-yamen.png`) as its first image, followed by its
  four original Play screenshots, saved in `~/Downloads/apps-screens/saber/fiverr-originals/`.
- **Fiverr uses the first attachment as the thumbnail and cannot reorder attachments**: to put a new
  image first, delete the others, upload the new one, then re-upload the rest after it. Max 5 files.
- **An item created before the required fields existed cannot be saved until it has them**: Saber needed
  a title of at least 15 characters ("Saber Yamen: Multi-Vendor Marketplace"), an industry
  ("Ecommerce"), duration ("6+ months"), cost ($4,000, flat like the others) and a start date
  (March 2023, from the Eleven Stars role). Confirm these if they matter.
- The edit page for any item is `/users/mormdn/portfolio/<id>/edit`; the id is in the item's URL.


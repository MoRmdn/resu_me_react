# Portfolio gaps (checked 2026-11-07)

mormdn.com is the source of truth. Two lists: site projects missing from a marketplace,
and marketplace projects missing from the site. Khamsat's portfolio and Freelancer's
"show all" list were not checked.

Prepared covers and per-project text live **outside the repo**, in
`~/Downloads/apps-screens/upwork-covers/` (`01-ayco.png` to `11-freedoc.png`, plus
`upwork-portfolio-text.md`). Marketplace-only projects have a folder each in
`~/Downloads/apps-screens/` (aera, wassalny, cavour, mismar) with a README.

## Site projects (12)

Arcit-AI, AYCO, SAAD, JS Quest, Mutabbib, Lpermis, Lpermis Pro, Saber Yamen, NAAS,
Dental Dinar, FreeDoc, O'Permis.

## On the site, missing from a marketplace

| Marketplace | Has | Missing |
|---|---|---|
| Upwork (11 items) | AYCO, NAAS, Lpermis, Lpermis Pro, Mutabbib, Saber Yamen, Dental Dinar, O'Permis, JS Quest | Arcit-AI, SAAD, FreeDoc (FreeDoc was removed on purpose, per `upwork-portfolio-text.md`) |
| Fiverr (14) | all 12 site projects (the nine below were added 2026-11-07: Arcit-AI, SAAD, JS Quest, Mutabbib, Lpermis, Lpermis Pro, NAAS, Dental Dinar, O'Permis) | nothing |
| Freelancer (6 seen) | AYCO, Lpermis, Lpermis Pro, Mutabbib, Arcit-AI | SAAD, JS Quest, Saber Yamen, NAAS, Dental Dinar, FreeDoc, O'Permis |
| Mostaql (10) | Lpermis, Lpermis Pro, AYCO, Mutabbib, Arcit-AI, Dental Dinar, Saber Yamen, FreeDoc | SAAD, JS Quest, NAAS, O'Permis |

SAAD is on no marketplace. NAAS is only on Upwork.

## On a marketplace, missing from the site

| Project | Where | Local folder |
|---|---|---|
| MisMar driver app | Upwork, Freelancer | `mismar/` |
| Aera (multi-vendor e-commerce, Flutter, 2022) | Upwork, Fiverr, Mostaql | `aera/` |
| Wassalny | Fiverr | `wassalny/` (cover only) |
| Cavour (salon booking template) | Mostaql | `cavour/` |

Cavour reads like a ready-made product listing, not client work: confirm it is the user's
own before putting it on the site.

## Why items were not added to the marketplaces

Every portfolio form needs an image uploaded through a hidden file input. Browser
automation cannot reach it, and fetching the image from a local server hung in Brave.
Adding an item means the user picks the file by hand in the upload dialog; the title,
role, skills and description can be pasted. Upwork limits: title ~70, description 600
characters, 6 skills.

## Fiverr: ready to paste (2026-11-07)

`~/Downloads/apps-screens/fiverr-covers/` holds nine 1600x1200 covers (the first file
Fiverr uses as the thumbnail) and `fiverr-portfolio-text.md` with the name, industries,
start date, extra screens and description for each missing project. SAAD and NAAS covers
were generated (screens on the site's ink background). Fiverr's form: name 50 characters,
description 1,400, up to 5 attachments, no URL field. Items marked "confirm" have no date,
or no role, in the CV.

**Update 2026-11-07:** Fiverr now has all nine items (see `fiverr.md`). Fiverr's file input turned
out to be reachable, so the "cannot upload" note above applies to Upwork only. Remaining gaps:
Upwork (Arcit-AI, SAAD), Freelancer, Mostaql.

## NAAS image: use the mockup, not the screenshot

NAAS is shown everywhere as the **mockup** (red promo with the Arabic headline), never the raw
dashboard screenshot. Source: `assets/projects/naas-promo.webp` (1200x1420) in the repo. The
local copies are in `~/Downloads/apps-screens/naas/`: `naas-mockup.png`, the 4:3 cover
`cover-4x3-mockup.png` (mockup centred on the dark background, 1600x1200) and the raw
screenshot (`naas-dashboard-screenshot.webp`, do not use as a cover). `fiverr-covers/07-naas.png`
was regenerated from the mockup on 2026-11-07. Upwork already used the mockup. On Fiverr the
NAAS item was edited to the mockup; on Mostaql the new thumbnail is uploaded but needs the
user's rights tick-box and "حفظ", which an edit also requires.

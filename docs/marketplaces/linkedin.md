# LinkedIn

- **Profile:** https://www.linkedin.com/in/mormdn/ (shows as "Mohamed (MoRmdn) Ramadan"). Not a marketplace:
  no counts or reviews here, but the same text rules as the site.
- **Browser:** the user's Brave was signed in.

## State, synced to the site 2026-11-07

- **Headline:** already "Software Engineer · Flutter at MisMar, building NAAS for fleet repair and insurance
  claims | Mobile and web apps for iOS, Android & the web | 5 years, 6 countries" (set by the user).
- **About:** kept the user's text and changed two phrases: "building its vehicle-service app for drivers in
  Egypt" is now "building NAAS, its B2B platform for fleet repair and car insurance claims", and in "Selected
  products", "MisMar (vehicle service, Egypt)" is now "NAAS (fleet repair and insurance claims, Saudi
  Arabia)". 2,207 of 2,600 characters.
- **Experience, MisMar:** the Highlights now carry the site's NAAS wording (core contributor, driver app as one
  earlier clause, the five bullets, the stack), 807 of 2,000 characters. Source: `content/experience.ts`.
- **Not changed, and worth checking:** LinkedIn dates MisMar "Mar 2025 - Present"; the site and Upwork say
  January 2025. Other roles' dates also differ slightly from the site (Mutabbib "Nov 2023 - Dec 2025" vs
  Ebdda "Jan 2024 - Jan 2026"; Arcit-AI ends Mar 2025 vs Dec 2024). Ask the user which is right.

## Editing through a browser

- About: the pencil ("Edit about") opens `/in/mormdn/edit/forms/summary/new/`. The box is a rich-text
  `contenteditable` div, not a textarea. To change a phrase without touching the rest, select it with a DOM
  Range and call `document.execCommand('insertText', false, newText)`. Then "Save". A save redirects to an
  upsell page (premium or people-you-may-know): ignore it and go back to the profile.
- A role: `/in/mormdn/edit/forms/position/<id>/` (ids are in the links on the profile). The form is in a shadow
  DOM, so `find` returns a DIV and `form_input` fails: click into the Highlights field, `cmd+a`, and type.
  Check that **"Notify network" is off** before saving, so connections are not alerted.
- LinkedIn limits: About 2,600 characters, role Highlights 2,000.

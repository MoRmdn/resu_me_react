# Upwork

- **Profile:** https://www.upwork.com/freelancers/~010d028f2b8e318fec
  (the site's contact button uses the vanity link `/freelancers/mormdn`)
- **Name shown:** Mohamed R., Top Rated, 100% Job Success
- **Browser:** the user's Brave was signed in; Chrome ("Browser 2" in the
  extension) was not. Check before assuming.

## What the site shows

| What | Value (2026-11-07) | Where |
|---|---|---|
| Jobs | **8** (6 completed + 2 in progress), label "jobs" | `content/reviews.ts` and `scripts/make-video.mjs` |
| Client map | 7 clients: Saudi Arabia 4, Morocco 1, Palestine 1, India 1 | `content/clients.json` |
| Reviews on the page | 4 Upwork quotes | `content/reviews.json` |

"Completed jobs" was wrong once the in-progress ones counted, so the label is
"jobs". Total jobs on the profile header (the "8 Total jobs" figure) matches.

## Profile text, last synced to the site 2026-11-07

- **Overview** (profile description, 1,892 characters): kept the user's own text
  and added "insurance and fleet repair" to the domains list plus one sentence
  about NAAS.
- **Employment history, MisMar (Jan 2025 to present):** the site's wording: core
  contributor to NAAS, the B2B Flutter Web platform for fleet repair and car
  insurance claims, with the driver app as one earlier clause, then the five
  achievement bullets and the stack line. Source: `content/experience.ts`.
- **Portfolio:** AYCO, MisMar (the driver app: keep it, do not delete), Lpermis,
  Lpermis Pro and others. **NAAS Dashboard** is the item to add: title "NAAS
  Dashboard — Fleet Repair & Insurance Claims", role "Flutter Developer (current
  role)", skills Flutter, Dart, Firebase, Web Application Development, image from
  `assets/projects/naas-promo.webp` converted to PNG (Upwork takes jpg, png, gif).
  Check the live profile to see whether it was published.
- **Headline** (70-character limit): "Software Engineer | Cross-Platform Mobile and Web
  Applications", the site's title. Upwork rejects `·` ("unsupported special
  characters") but accepts `|`. It was "Software Engineer | Flutter, Firebase &
  React | Mobile and Web Apps" until 2026-11-07. Use `form_input` on the title box:
  setting the value from page JavaScript threw "Illegal invocation".
- The **"Summary" block under Work history** is written by Upwork's AI from
  completed jobs. It cannot be edited. Only the overview can.

## How to refresh

1. **Jobs and clients.** Open the profile, scroll to Work history on Upwork. The
   tabs read "Completed jobs (n)" and "In progress (n)". Click a job's title: a
   dialog opens with **About the client**, which shows the country and city.
   Private jobs use the country of the project they belong to. A client listed
   under Gaza counts as Palestine.
2. **Reviews.** A completed job can carry a quote, truncated behind "See more".
   Open the dialog for the full text. A job with two reviews shows both.
   Ongoing contract reviews (the Saudi client's two, Dec 2025 and May 2026) are
   not on the site yet.
3. Update the four places in [README.md](README.md), then the gate.

## Editing the profile through a browser (what worked)

- **Overview:** pencil beside the description. It is a `textarea`; set it with the
  native value setter and dispatch `input` and `change`, then click Save.
- **Employment:** pencil beside the entry, the `description` textarea, Save.
  There is no length limit on it.
- **Portfolio item:** the "+" next to Portfolio. Title, role and description are
  all `textarea`s, so find each by its placeholder, not with
  `querySelector('textarea')`, which returns the title. Description limit is **600
  characters**; skills limit is **6**; the skills box is a typeahead (type, then
  click the exact option).
- **Image upload.** The file inputs are hidden, `file_upload` cannot reach them,
  and fetching from a localhost server hung in Brave (likely a local-network
  permission prompt). Click the image icon and pick the file by hand.
- Browser tab dialogs: the job dialog may not close on a scripted click, so
  re-navigate to the profile before reading another job.

## Traps

- The profile page renders late. Wait a few seconds before reading text.
- "Total jobs" counts in-progress jobs. The completed count is separate.
- A profile edit is public the moment it is saved.

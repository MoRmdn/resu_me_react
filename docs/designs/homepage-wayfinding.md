# Homepage: help visitors keep their place

* **Author:** Mohamed Ramadan
* **Date:** 2026-11-28

## Overview

Several people who browsed mormdn.com said they felt a bit lost in the details
as they went down the homepage. None said the offer was unclear at first
glance. The homepage exists so a prospective client, usually Arab and usually
on a phone, trusts the work and sends a WhatsApp message.

The idea under review was: keep service summaries, project outcomes, six
featured reviews and WhatsApp links visible, collapse secondary details behind
a tap, keep every word in the homepage HTML, then re-test with three tasks
(find a service, find a project or review that gives confidence, find
WhatsApp).

Seven independent reviewers read the code against that idea. All seven reached
the same conclusion: as stated, it is not ready to build. The reviewers read
code and did not run the site, so screen savings below are estimates.

## Analysis

### Why collapsing alone will not fix it

1. **The longest half of the page is already collapsed.** Projects and Reviews
   are 15.5 of the 32 phone screens. Featured project panels, gallery planes,
   the reviews beyond six and the Experience rows all start closed. What still
   shows there is what the idea says must stay. Their height comes from
   images, card padding, 80px section padding and single-column stacking, not
   from text. Collapsing text would save an estimated 4 to 5 screens, almost
   all in Services, About and Skills.

2. **The cause is not located.** "Lost in the details" can mean too much text,
   or it can mean "I don't know which section I am in". The evidence does not
   separate the two. On a phone the page gives weak position cues:
   - the `n/7` counter is hidden below the `sm` width and the section label
     truncates; the side rail only exists from 1600px;
   - three review cards sit inside Projects, between the first and second
     featured project, and the first quote is about Lpermis but sits under
     AYCO;
   - the homepage therefore shows nine review cards, not six;
   - the client map sits inside Reviews with its own large heading;
   - one small label style is used for section labels, sub-headings, field
     labels and toggle labels;
   - Projects runs 9.2 screens with no cue for how far along you are.

3. **The re-test cannot fail.** The WhatsApp task passes on any version,
   because the nav island shows a WhatsApp button at every width. The service
   task targets the first section after the hero, which nobody complained
   about. The complaint came from browsing, and the tasks measure searching.
   There is no baseline on the current page.

### Problems found in what is visible today

- **The same fact is said two or three times on one card.** AYCO's face gives
  the same three facts as description, outcome and ledger. The project
  "achievement" equals "The result" word for word for AYCO and SAAD in
  English, and for four of five featured projects in Arabic. "Store links
  provided" sits directly above the store buttons. Each review card names its
  platform twice. The review total appears in the hero intro, the hero strip
  and the Reviews headline.
- **"Details" means two things.** In Services it goes to another page. In
  Projects it opens a panel in place. Both are "التفاصيل" in Arabic. Only two
  of the four service cards have it.
- **No contact link for about 23 screens.** Projects, Reviews, About,
  Experience and Skills contain no WhatsApp link in the flow of the page.
  Seven of the eight in-flow links come before any project or review. In
  Contact on a phone, three social links appear before the WhatsApp cell.
- **Opened panels are a place to get lost.** Panels open with no scroll
  margin, so a tall one can land under the nav island. "Show more reviews"
  opens 37 cards with its only control at the top. The whole featured project
  face is the toggle, so tapping the text to read it opens the panel.
- **Links into closed content dead-end.** The "Bracket Media" proof link
  jumps to Experience, where that row is closed. Nothing opens a panel from
  the URL hash.
- **An existing phone defect.** On the wide gallery tile, the description and
  outcome are hidden below 680px and the opened plane suppresses them too, so
  phone visitors never see them. Four gallery tiles on a phone read only a
  name, a category and "Public links unavailable" or "No longer listed".

### Costs any new collapse would carry

- A closed `.disclosure` panel is `visibility: hidden` and then `inert`.
  Find-in-page probably cannot reach it, and Cmd+F is one of the reasons this
  repo exists. Native `<details>` works before JavaScript loads and is already
  used on the site (Reviews, ReviewCard, ServicePage).
- Services, About, Skills and Reviews are server components. Using
  `.disclosure` there needs a new client boundary. `<details>` does not.
- Each new toggle needs an analytics catalog entry, a sentence and
  regenerated docs. `scroll_depth` is a percentage of page height, so its
  baseline breaks when the page gets shorter. Compare `section_view` and
  `contact_channel_click` by placement instead, and snapshot them first.
- Several Arabic lists bind to English by array position. Slicing a list is
  safe. Reordering or deleting an item silently shifts the Arabic.
- The review export and `check:portfolio` match exact strings in the review
  markup. A wrapper or an added class breaks them. `check:portfolio` is not
  in the pre-done command or CI.

### The contradiction and how to remove it

The idea accepts a trade: less to read through costs more tapping. Three
changes give less to read through with nothing hidden and no tap:

1. **Cut restatement.** Show a fact once per card.
2. **Name controls by what they do.** The project toggle says what opens. The
   service link says it leaves the page. "Show more reviews" carries a count.
3. **Fix orientation.** Move the three testimonials out of the middle of
   Projects. Add a WhatsApp link at the end of Projects and Reviews. Put the
   WhatsApp card before the social links on phones. Add a close control at
   the foot of long panels and a scroll margin on panel targets. Show `n/7`
   on phones.

Collapse only after those, and only where the block has no links and no
anchor targets.

**Best collapse candidates, in order:**
1. Experience: current role closed by default (one line, no new control).
2. "How a project runs" in Services (no links, already on the service pages).
   It answers "what happens after I message", so test it before hiding it.
3. About: credentials and the "Currently" card.

**Do not collapse:** "Seen in" and "Ask about this" (the proof path and the
conversion link), the per-card "Includes" lists (four taps to compare four
services), the gallery grid, featured outcomes and store buttons, the
platform grid and the six reviews, the hero and the Contact channels.

**Reviewers disagreed on "Ways to work together".** It holds six contact
links including WhatsApp, which become unreachable when closed. It also adds
five non-WhatsApp exits early on the page. A middle path is to merge it with
Contact.

## Goals vs. Non-Goals

* **In-Scope Goals:**
  - A visitor on a phone, in Arabic or English, can tell which section they
    are in and how far along.
  - Each fact appears once per card.
  - A WhatsApp link is reachable in the flow of the page after the proof.
  - Every fact stays in the served homepage HTML.
  - A baseline test on the current page, then the same test on the new one.
* **Out-of-Scope Non-Goals:**
  - Moving content to sub-pages or adding new sub-pages.
  - Scroll animation and page transitions.
  - Adding backend, SAAD API, SEO and analytics to Skills (a separate content
    change).
  - A shared `Disclosure` component refactor.

## Alternatives Weighed

- **Move service and project detail to the sub-pages.** Rejected by author:
  the sub-pages have no Search Console impressions yet, so moving keywords
  off the strongest page is premature.
- **Show three reviews instead of six.** Rejected by author: the six featured
  reviews stay visible.
- **Collapse secondary details as the first and only change.** Not ready:
  about half the page is already collapsed, so it cannot reach the longest
  sections.
- **`.disclosure` for every new collapse.** Rejected by review: it needs
  client components and hides text from find-in-page. Native `<details>` is
  already sanctioned.
- **One toggle per service card for "Includes".** Rejected by review: four
  taps to compare four services for about twelve lines.
- **`content-visibility: auto`, `:target` to open panels, a horizontal snap
  row for the four offers, line-clamp on review quotes.** Rejected by review.
  Review quotes are verbatim and must not be cut.
- **Move the three testimonials to the end of Projects under a heading.**
  Rejected by author: only one of the three has a project on the site, and
  the block would sit directly above Reviews as a second review heading.
- **Feature three projects and move two to gallery tiles.** Open. It breaks
  the seven-tile grid rule in `AGENTS.md`.
- **Horizontal snap row for the three testimonials on phones.** Open. It
  conflicts with the static-grid rule for reviews.

## Key Decisions & Staging for Next Steps

Resolved:
- Nothing moves off the homepage. Six featured reviews stay visible.
- Skills content and animation are separate, later changes.

- **Once per card (owner, 2026-11-28).** When the same fact appears twice on
  a card, show it once, in the clearest place, and that place must be visible
  on a phone. When the second mention adds a metric or useful context, keep
  that information.

- **The three-card testimonial block is removed (owner, 2026-11-28).** This
  replaces an earlier decision the same day to move the block to the end of
  Projects under its own heading.
  - The Lpermis quote (`upwork-lpermis`) goes inside the Lpermis project
    details, under "Client review" / "تقييم العميل".
  - The two fix-job reviews (`khamsat-bassam`, `fiverr-nathan-invaluable`)
    appear only in the full Reviews list, behind "Show more reviews".
  - The same six featured reviews stay at the top of Reviews.
  - Each quote appears once on the homepage. `Reviews.tsx` builds the full
    list as every review outside the six, so `upwork-lpermis` must be
    excluded there once it lives in the Lpermis details.

  What this changes in code and rules:
  - `Testimonials` in `components/sections/SocialProof.tsx` and
    `testimonialIds` in `content/reviews.ts` have no other use and can go,
    with the `ui.testimonials` strings in both languages.
  - `ProjectDetail` in `components/ui/ProjectMeta.tsx` gets an optional
    "Client review" block. Lpermis has a `story`, so the block sits after
    "The result". The link from project to review should be an id on the
    project, checked by `assertClosedSet`, not a string match.
  - The `AGENTS.md` rule that the six opening review ids stay disjoint from
    the three testimonial ids is rewritten: a review shown in a project's
    details is left out of the Reviews list.
  - `scripts/check-portfolio.mjs` and the review export read the review
    markup; both need a run after the change.

  Consequence to accept: all three quotes are visible without a tap today.
  After the change none of them is. The Lpermis quote is inside a closed
  panel and the other two are behind "Show more reviews". Visible review
  cards on the homepage go from nine to six.

  Superseded analysis, kept for the record. Checked in `content/reviews.json`:

  | Review | Job as the marketplace names it | Project on this site |
  |---|---|---|
  | `upwork-lpermis` | Lpermis enhancements | Lpermis (confirmed) |
  | `khamsat-bassam` | Flutter app changes & fixes | None. A fix job for an app that is not on the site. |
  | `fiverr-nathan-invaluable` | Flutter app fixes | None. A repeat client's own app, not on the site. |

  Only one of the three has a project on the site, which is why a shared
  heading over all three was dropped.

### How the once-per-card rule applies (checked in code)

| Card | Today | Proposed |
|---|---|---|
| AYCO face | Description, then an outcome sentence ("Offline-ready visits, signed Arabic PDF reports and batches of up to 100 devices"), then a three-cell ledger with the same three facts (Offline / RTL / 100). All three show on phones. | Keep the description and the ledger. Drop the outcome sentence from the face. The sentence stays once, as "The result" inside the panel. |
| AYCO face | "Private client" in the country line and again in "Private client · no public listing". | Keep the second line. The top line shows the category only. |
| SAAD, and in Arabic also Lpermis and Mutabbib | The face outcome and the panel's "The result" are the same sentence. | Keep the face outcome. Leave "The result" out of the panel when it is identical. |
| Arabic Lpermis and Saber Yamen | The outcome restates the description. Saber Yamen's Arabic outcome also drops the 20% figure the English one has. | Rewrite the Arabic outcome so it carries the metric. Needs the owner's wording. |
| Featured faces with store buttons | "Store links provided" directly above the store buttons. | Drop the line when buttons are present. |
| Review cards | Platform named twice. | Name it once. Must not change the `review-card` markup strings the export script matches. |
| NAAS (the wide gallery tile) | Description and outcome ("20+ user roles on one platform") are hidden below 680px, and the opened plane leaves them out too, so a phone never shows them. | Show both on phones. This is where the phone bug is. |

Correction to an earlier note: the phone visibility bug is on the wide
gallery tile, which is NAAS, not on AYCO. AYCO is a featured panel and its
face text shows at every width. The rule above still covers both.

- **Baseline first (owner, 2026-11-28).** The test below runs on the current
  live page before any change is built, then again on the changed page.

### Test plan (draft, for the owner to adjust)

Who and how:
- Five people close to the target client, each on their own phone, on the
  Arabic page (`/ar/`). Prefer people who have not seen the site. The people
  who gave the first feedback already know the page, so their second visit
  is easier and should be noted as such.
- Sit beside them or record the screen. Do not help. Ask them to say what
  they are thinking.
- The same script, word for word, for the baseline and the re-test. Use
  different people for the re-test, or the second run measures memory.

Part 1, browsing (this is where the complaint came from):
- "Look through this page as if you were thinking of hiring him." Give two
  minutes with no task.
- Stop them twice, once in Projects and once in Reviews, and ask: which part
  of the page are you in, what is this block about, and how much of the page
  do you think is left?
- Note every time they scroll back up, say they are lost, or skip a block.

Part 2, tasks:
1. "You have an app that keeps crashing. Find what he offers for that and
   tell me what it includes." This targets the second service card, not the
   first thing on the page.
2. "Find one project or one review that would make you trust him. Tell me
   which and why." Note whether they open a details panel, and whether they
   find their place again after closing it.
3. Asked while they are in Reviews: "You have decided to contact him. Do it
   from here." This replaces "find the WhatsApp link", which cannot fail.
   Record the route: the button in the top bar, scrolling down to Contact, or
   scrolling back up. Record the time and how far they scrolled.

What to write down per person: done or not done for each task, seconds
taken, wrong turns, the answers to the three "where are you" questions, and
their own words whenever they hesitate.

Reading the result:
- Five people give patterns, not percentages. A problem seen in three or
  more of five is treated as real.
- The change is kept if fewer people report being lost or answer the "where
  are you" questions wrongly, and no task gets slower. It is reverted or
  reworked if either gets worse.
- If the baseline shows people are not lost in Services, About or Skills,
  the three collapse candidates are dropped from the change.

Numbers to save before release, from GA, for the last 28 days:
`section_view` per section, `project_toggle`, `reviews_expand`, and
`contact_channel_click` by placement. Do not compare `scroll_depth` or
`section_dwell` across the change; a shorter page moves both on its own.

Defaults taken unless the owner objects:
- Other Projects and Reviews layout (featured card count, image height) is
  not touched in this change. It is looked at again after the re-test.
- Native `<details>` is used for any new collapse. It is already on the site
  and works before JavaScript loads.
- A collapse applies at every width, so the server HTML and the hydrated
  page match.
- No "2 of 5" counter in Projects. Section numbers stay the only numbering.

Open, for the owner:
1. Arabic outcome wording for Lpermis and Saber Yamen.

Suggested order: run the baseline and read existing analytics, cut
restatement and fix orientation, collapse at most the three candidates above,
then re-measure before touching Projects or Reviews layout.

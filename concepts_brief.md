# Concepts Brief: a portfolio site that wins project enquiries from Middle East clients

- **Author:** Mohamed Ramadan
- **Date:** 2026-11-27
- **Mode:** BRAINSTORM (seven-lens review, synthesised)
- **Target:** `/Users/dark/Dev/resu_me_react`, branch `claude/case-studies-services`, including the uncommitted services and case-study pages
- **Concept under review:** review and improve the site so that a Middle East business owner, on a phone, reading Arabic first, who has never heard of the owner, sends a WhatsApp message or an email about a project

All file paths below are relative to the repository root. Line numbers are those of the working tree on 2026-11-27.

## Reviewer status

| Reviewer | Status |
| --- | --- |
| `egm-design` | completed |
| `egm-codebase-details` | completed |
| `egm-zoom-out` | completed |
| `egm-comprehension` | completed |
| `egm-implementation-readiness` | completed |
| `egm-structural` | completed |
| `egm-inventive-catalyst` | completed |

No reviewer failed or was retried. Each reviewer listed files it did not open; the gaps that matter are in [Coverage gaps](#coverage-gaps).

## How to read the evidence

- The reviewers rendered, built and ran nothing. No reviewer opened a browser, a phone, Search Console, Google Analytics or a marketplace page. Every reviewer statement about rendered layout, search behaviour, live traffic or marketplace policy is marked **UNVERIFIED**.
- The main session then checked some of those statements in a browser. The results are in [Rendered checks](#rendered-checks), and they overrule a reviewer estimate where the two disagree.
- The synthesiser re-read these lines directly and confirmed them: `components/sections/Hero.tsx:14-119`, `content/copy.ts:11-60`, `components/PortfolioPage.tsx:17-39`, `components/sections/Nav.tsx:76-210`, `content/clients.json:1-25`, `content/reviews.ts:48-86`, `components/DocumentShell.tsx:49-61` and `:212-233`, `lib/analytics/catalog.ts:304-331`, and every occurrence of "within a day", "خلال يوم", "10%", "15%" and "20%" in `content/*.ts`.
- Every other citation rests on the reviewers. Where it matters, the entry says how many of the seven cited it independently.
- Client counts are sums the reviewers and the synthesiser made by hand from `content/clients.json:3-24`: 103 placed client accounts in 20 countries, 5 unplaced, 108 in total; 56 in Saudi Arabia; 93 of the 103 placed in 11 Arab countries. These are per-platform account counts, so one client on two platforms counts twice. The owner must confirm them before they are published.

## Rendered checks

Made by the main session on 2026-11-27, after the reviewers finished. Search checks used Google in a desktop browser. Layout checks used the branch's dev server at a 375x812 phone viewport. Nothing here was measured on a real phone, in production, or at any other width.

| Check | Result |
| --- | --- |
| Google search for "mormdn" | **Confirmed.** The page is headed "These are results for mormon" and every result is about the religion. The site appears only after choosing "Search instead for mormdn"; it is then first, followed by the Instagram, Google Play, Facebook, GitHub and Mostaql profiles. |
| Google `site:mormdn.com` | One result: the English home page. `/ar/` is not listed. A `site:` search is an approximation of the index, so confirm in Search Console. |
| Google search for "Mohamed Ramadan software engineer" | The site is second, among eight other engineers of the same name. The name alone does not identify the owner. |
| Hero button on a phone, `/ar/`, 375x812 | **The reviewers' estimate is wrong at this size.** The status line, the headline, the intro, both buttons and the top of the three screenshots are all on the first screen. The WhatsApp button's top edge is at about 512px of 812px. 360x640 was not tested. |
| Hero entrance animation | The intro, the buttons and the screenshots are invisible until their staggered entrance plays; the last one finishes about 1.4 seconds after the animation starts. A screenshot taken straight after load, on the live site and on the dev server, showed the headline alone. For that interval the first screen has no contact action. How long this lasts on a slow phone in production was not measured. |
| Home page length on a phone, `/ar/` | 24,638px, about 30 screens. Heading order as rendered: the owner's education, seven employers, projects, skills, reviews, services, contact. Three employer rows carry the title "مطور Flutter مبتدئ" (junior Flutter developer). |
| Language switch on a phone | Confirmed absent from the nav island at 375px. It shows the mark, the section name with "0/7", and the contact button. |
| Horizontal overflow at 375px | None on `/ar/`, `/ar/services/fix-existing-app/` or `/ar/projects/ayco/`. Narrower widths were not tested. |
| Tap targets on `/ar/` at 375px | 15 links are 20px tall, under the 24px minimum in WCAG 2.2: the five marketplace rating links and the project name links (Lpermis, Mutabbib, Saber Yamen, SAAD, Bracket Media, NAAS, JS Quest, AYCO, Dental Dinar). |
| First screen of the service page on a phone | A breadcrumb, a category label, the heading and one paragraph, then about 40% of the screen empty. No image, rating, review count or client name. The first WhatsApp action in the body is on the second screen. |
| First screen of the AYCO case study on a phone | Text only, then about half the screen empty. No screenshot of the app, although the project has screenshots. The summary says "بنيته بمفردي" (I built it alone). The only contact action in the body is on the sixth of six screens. |
| Sub-page header on a phone | Shows the mark, the language switch, the theme toggle and a "ابدأ مشروعًا" button, so finding M11 is right about the missing name and navigation and wrong about there being no contact action at the top. The mark link is 22px wide. |
| Structured data on the new pages | Parses. The service page has `Service`, `FAQPage` and `BreadcrumbList`; the case study has `Article`, `MobileApplication` and `BreadcrumbList`. Rich-result eligibility was not checked. |

Not checked: a real device, a screen reader, keyboard focus order, contrast by measurement, dark mode, the English pages at phone width, and production load timing.

---

## Executive summary

The site is built and ordered for a recruiter reading an engineer's CV. The stated visitor is a business owner who wants something built. Seven reviewers working separately reached the same four conclusions.

1. **The first screen does not answer its three questions.** The headline says "apps" only. A visitor who needs a website or an internal tool sees no matching word. The trust line counts employers ("7 teams in 6 countries"), and the ledger strip ends "Now: NAAS at MisMar", which tells a buyer the owner has a full-time job. The site's real proof is 135 reviews and jobs and 108 client accounts, 56 of them in Saudi Arabia. None of it is in the hero. The main button opens an empty WhatsApp chat and does not say it is WhatsApp.
2. **The page answers "what can you build for me" ninth of ten bands.** Before it come a strip of framework names, a degree, a "currently learning" card, seven employment rows with titles such as "Junior Flutter Developer", and a wall of skill chips. Between the hero and the Services band there is no contact action at all.
3. **The win cannot be observed, and there is no path in.** Analytics records a click, not a message. The hero and Contact WhatsApp links carry no prefilled text, so a message that arrives cannot be tied to the site. Khamsat and Mostaql hold 92 of the 135 reviews and forbid links to the site. The brand word is in no title, heading or site name. The sitemap has six URLs.
4. **The branch's two new pages are not ready to publish.** They do not link to each other. Their "related" blocks name pages that do not exist and are silently dropped. The only service page is "Fix or extend your Flutter app", which addresses someone who already owns a Flutter codebase. The pages also repeat a figure that contradicts another page (Cyparta: 10% in four places, 20% in two) and a response-time promise ("within a day", ten places) that the content file's own rule forbids until the owner states it.

Of the four problems the owner reported, changes in this repository can fully move only one: visitors leaving within a minute. Low traffic and the "mormon" correction need work outside the repository. "No client yet" follows from the other three.

---

## The three changes to make first

The order is the synthesiser's, from the reviewers' own top-three lists. All seven put the first screen first. Six of seven put publishing the sub-pages as they stand last or advised against it.

### 1. Rebuild the first screen in both locales, and make every contact link a prefilled message in the page's language

**Reason.** It is review priority 1, it is the only screen most visitors see, and it is the only change that acts directly on the definition of a win. It needs no new content: every number is already in `content/`.

**What is wrong, with evidence.**

| Problem | Evidence |
| --- | --- |
| The headline names "apps" only. No "website", "dashboard" or "internal system" appears on the first screen. | `content/copy.ts:16`: `"I build Arabic‑first apps for businesses from Morocco to Oman"`. Arabic at `content/copy-i18n.ts:103`. |
| The one trust sentence counts employers and ends on a developer's concern. | `content/copy.ts:17`: `"...for ${metrics.teams} teams in ${metrics.countries} countries, on a clean architecture the next developer can pick up."` |
| The ledger strip is CV data and ends by saying he is employed. | `components/sections/Hero.tsx:21-28` builds "Based in / Shipping since / Teams / Now"; `content/copy.ts:24-33` supplies `nowProduct: "NAAS"`. The role is "Remote, contract, full-time" at `content/experience.ts:25`, beside `status: "Taking new projects"` at `content/copy.ts:13`. |
| The strongest proof is absent from the hero. | `content/reviews.ts:48-86` sums to 135. `content/clients.json:3-24` sums to 108 accounts, 56 in Saudi Arabia. The first appearance is one caption line two bands down: `components/sections/SocialProof.tsx:16`. |
| The primary button opens an empty chat and its label does not say WhatsApp. | `content/copy.ts:20`: `primaryCta: { label: "Start a project", href: "https://wa.me/201281100168" }`, rendered raw at `components/sections/Hero.tsx:49-50`. Arabic inherits the same href at `content/copy-i18n.ts:106`. |
| Two more WhatsApp links and the email link are also bare. | `components/sections/Contact.tsx:116-117`, `components/sections/ServiceParts.tsx:36-37`, `content/site.ts:33` (mailto with no subject). The helper that prefills already exists: `lib/paths.ts:19-21`. |
| The one always-visible action is two steps from a channel. | `components/sections/Nav.tsx:164-170`: `href="#contact"`, the last band of the page. |
| On a phone the language switch is not visible. | `components/sections/Nav.tsx:160-162`: `<span className="hidden lg:contents">` around `LanguageSwitch`. Below `lg` it exists only inside the sheet (`:203-204`), opened by a button whose visible label is the section name and a counter, "Intro 0/7" (`:109-115`). `x-default` is English: `components/DocumentShell.tsx:223`. |
| Four reviewers estimated from classes that the button sits at or below the fold on a phone. **Refuted at 375x812 in Arabic** by the rendered check: the button is on the first screen. 360x640 is still unchecked. The real first-screen cost is the entrance animation, which keeps the buttons and screenshots invisible for about 1.4 seconds. | `components/sections/Hero.tsx:31` (`pt-32`), `:43` (headline capped at `16ch`), `:45` (`mt-12`), `:47-48` (intro, then `mt-8`), `:46` and `:32` (`enter` with `stagger`). Headline is 42px minimum, 40px in Arabic: `app/globals.css:895-911`. The three screenshots come after the buttons: `Hero.tsx:77-104`. |

**What to do.**

- Headline names what is built: mobile apps, web apps or dashboards, and internal systems. Whether "websites" may be claimed is an owner decision (see finding M10).
- Replace the intro's employer count and the "Teams" and "Now" ledger cells with client facts derived from `reviewTotal` and `clients.json`, the way the current ledger is derived.
- Route every WhatsApp link through `whatsappWith` with a first line in the page's language that names the site and the page. Add a localised subject to the mailto. This is the only attribution that survives into the actual message.
- Label the button as WhatsApp. The string already exists: `content/copy-i18n.ts:350`.
- Point the nav button at the same prefilled WhatsApp link. `SubpageHeader` already does this (`components/SubpageHeader.tsx:60-74`). It needs a new `channel_placement` value in `lib/analytics/catalog.ts:304`.
- Show the language switch in the nav island at every width. It can take the place of the "0/7" counter on phones.
- The button already fits on a 375x812 screen, so the layout needs no rescue there. Check 360x640 in both locales before changing padding. Make the buttons paint with the headline instead of after the staggered entrance, so a contact action is on screen from the first frame.

### 2. Reorder the home page to offer, proof, contact, and take the CV and the self-contradicting facts off the client path

**Reason.** It is the one reported problem the repository fully controls (visits under a minute), and it is the structural core of the software-house step. It needs no new claim, only a different order and the removal of material that argues against hiring.

**What is wrong, with evidence.**

| Problem | Evidence |
| --- | --- |
| Services is band 9 of 10. Three CV bands come first. | `components/PortfolioPage.tsx:24-33`: Hero, TechStrip, SocialProof, About, Experience, Projects, Skills, Reviews, Services, Contact. |
| The second thing a buyer sees is a list of framework names, untranslated on `/ar/`. | `content/skills.ts:85-98`; `components/sections/TechStrip.tsx:9-11`. |
| About leads with education and tells a web buyer the owner is still learning the stack the site sells. | `content/copy.ts:47` (`"Computer science degree,", "mobile obsession"`); `content/site.ts:132` ("Learn JavaScript · Learn React — Scrimba, 2026") and `:147` ("Next.js fundamentals", "in progress"); against the offer `"Flutter Web, React or Next.js"` at `content/copy.ts:217`. |
| Recruiter wording sits on the client path. | `content/copy.ts:258-263` ("A seat on your team"); `:348-349` ("Full-time, contract or a second pair of hands..."); `content/site.ts:66` ("Full-time and long briefs"); `components/sections/Footer.tsx:32-41` (Download CV); `content/copy-i18n.ts:15` ("Hire me"). |
| Job titles and a caption undercut the offer. | "Junior Flutter Developer" at `content/experience.ts:121,141`, rendered in Arabic as "مطور Flutter مبتدئ" (beginner) at `content/profile-i18n.ts:71,82`; `content/copy.ts:73-74`: "Four of these ran at once through 2024, most of them remote and part-time". |
| The same fact has two values. | Cyparta app size: 10% at `content/copy.ts:51,58`, `content/services.ts:122`, `content/services-i18n.ts:107`; 20% at `content/experience.ts:153`, `content/profile-i18n.ts:88`. |
| A response time is promised in ten places against the file's own rule. | Rule at `content/services.ts:12-13`: "No prices, timelines, response times or support terms until Mohamed states them". Promise at `content/copy.ts:171,316,349`, `content/copy-i18n.ts:230,349,379`, `content/services.ts:143,148`, `content/services-i18n.ts:116,120`. The marketplace bio it restates has no time limit: `docs/marketplaces/bio-ar.md:50`. |

**What to do.**

- Order the home page: Hero, Services, Projects with testimonials, Reviews and client map, how a project runs, Contact.
- Move About, Experience, Skills, credentials, the learning card, the team-seat model and the CV download to one "who does the work" block at the end of the page, or to an `/about/` page with an Arabic twin. Drop `TechStrip` from the client page.
- Before reordering, fix the hazard the structural reviewer found: Arabic labels are bound to English content by array position, and section order has four sources of truth. Reordering without fixing this mislabels the Arabic site with no build error. Evidence: `content/profile-i18n.ts:156-171`, `content/site.ts:120-128`, the hard-coded `index` props (`components/sections/Services.tsx:37`, `components/sections/Contact.tsx:33`), and `components/PortfolioPage.tsx:24-33`.
- Get the owner's answer on each contradicting fact, then use one value everywhere. He must also confirm or remove "within a day". These are decisions only he can make; see [Owner decisions](#owner-decisions).

### 3. Do not publish the branch as two dead-end pages; ship a small closed set with buyer-language titles, then move effort outside the repository

**Reason.** Merging is publishing: the sitemap, `llms.txt` and the home page pick up whatever is in the arrays, and the slugs become permanent once indexed (`app/sitemap.ts:16-17`; `firebase.json` has no `redirects` block). As built, the two pages cannot send a visitor onward, they target the wrong reader, and no on-page work reaches a visitor who cannot arrive.

**What is wrong, with evidence.**

| Problem | Evidence |
| --- | --- |
| The service page's related links name pages that do not exist and are dropped silently. | `content/services.ts:175`: `related: ["maintenance", "code_review", "store_release"]`; filtered at `components/pages/ServicePage.tsx:67-69`, so the block at `:325` never renders. |
| The case study's service and related links do the same. The two new pages never link to each other. | `content/case-studies.ts:66-67`; filtered at `components/pages/CaseStudyPage.tsx:65-70`, so `:285` and `:312` render nothing. |
| The only service page addresses a developer-literate buyer. | `content/services.ts:38`: "Fix or extend your Flutter app"; `:50-52`: "Xcode and Gradle now reject what used to work". |
| The plan is 19 service ids (18 plus the legacy `hard_parts`) against one page, and several ids have no proof on the site. | `lib/analytics/catalog.ts:311-331` lists `seo`, `hosting`, `speed`, `website`, `ui_ux` among them; the catalogue's own rule at `content/services.ts:11`: "`proof` names only work on this site that did this kind of work". |
| There are no index routes and no not-found page; breadcrumbs point at fragments. | Only `[slug]` routes exist under `app/(english)/services/`, `app/(english)/projects/` and the Arabic twins. `components/pages/ServicePage.tsx:59,76`; `components/pages/CaseStudyPage.tsx:60,99`; `lib/structured-data.ts:186-196`. |
| No title carries a buyer phrase or the brand word. | `components/DocumentShell.tsx:76-79` and `:213`: "Mohamed Ramadan — Software Engineer" / "محمد رمضان — مهندس برمجيات". Arabic description opens "معرض أعمال محمد رمضان" at `:216`. Case-study title is spent on a private codename: `lib/page-metadata.ts:11-21`. |
| The share card for every route and both locales is an English CV card. | `lib/seo.ts:29`; `components/DocumentShell.tsx:121-128`. Three reviewers opened `public/og.png`: "Mohamed Ramadan / Software Engineer / 5 YEARS 7 TEAMS 6 COUNTRIES / FLUTTER · DART · BLOC · FIREBASE". This is the preview WhatsApp shows when a link is forwarded. |
| The largest proof source cannot link in. | `docs/marketplaces/bio-ar.md:9-11`: "No links of any kind. Mostaql rejects the whole form"; `docs/marketplaces/khamsat.md:34-35`. Khamsat and Mostaql hold 88 and 4 of the 135 reviews: `content/reviews.ts:70-83`. |
| The project guide still describes a one-page site. | `AGENTS.md:3-5`, `:79`, `:81-101`, `:231-233`, `:237-239`. Its own rule (`AGENTS.md:30-34`) requires it to change in the same change as the code. |

**What to do.**

- Cap the catalogue at services with delivered proof. The reviewers converge on: the existing fix-or-extend page, a new-app page, and a company-system or dashboard page (AYCO and NAAS are the proof), in buyer language in both locales. See [Where reviewers disagree](#where-reviewers-disagree) for how far to go beyond that.
- Do not ship an id that resolves to nothing. Add a build-time check that every published page has at least one onward internal link, and cross-link the service page and the AYCO study.
- Write titles and descriptions per locale from buyer phrases, with the brand word in them. Make an Arabic share image; `npm run og` already exists.
- Add `/services/` and `/projects/` index pages, or remove `services_hub` from `lib/analytics/catalog.ts:91` until they exist.
- Update `AGENTS.md` in the same change. On the PR preview channel, check `Cache-Control` and `X-Robots-Tag` on the new routes before going live (`firebase.json:155-174`; the globs are untested, **UNVERIFIED**).
- Then stop writing pages until Search Console shows impressions, and spend the time outside the repository: verify Search Console (the token is optional and silently omitted, `components/DocumentShell.tsx:157-159`; whether it is set is **UNVERIFIED**), and put the URL on every profile that allows links.

---

## Which of the four reported problems this repository can move

| Reported problem | Movable here? | What it needs |
| --- | --- | --- |
| 1. Almost nobody visits | Barely | Distribution outside the repository. The repository can only supply indexable pages and buyer-language titles. |
| 2. Visitors leave within a minute | Yes | Changes 1 and 2. With near-zero traffic the figure itself is statistically weak, and who those visitors are (owner, bots, recruiters) is **UNVERIFIED**. |
| 3. "mormdn" corrected to "mormon" | Almost not | It is the search engine's query-side behaviour (confirmed by a search; see [Rendered checks](#rendered-checks)). It affects only people who already know the name, not the stated visitor. It still matters because the Arabic marketplaces can send people only by name. |
| 4. No client yet | Indirectly | It follows from 1. Fixing 2 first stops wasting whatever traffic 1 produces. |

---

## Findings

Severity is judged against the definition of a win. "Lenses" names the reviewers that raised the finding. Where reviewers rated a finding differently, the entry says so.

### Blocker

#### B1. The first screen does not say what can be built and shows employment facts in place of client proof
- **Lenses:** all seven.
- **Evidence and change:** see change 1.
- **Also:** the hero says "6 countries" (`content/site.ts:114-118`) while the client map shows 20 (`content/clients.json:3-22`); a visitor who sees both reads a contradiction. No portrait exists anywhere (`AGENTS.md:392-395`, an open item).

#### B2. The home page is ordered as a CV; the offer is band 9 of 10
- **Lenses:** all seven.
- **Evidence and change:** see change 2.
- **Counts from the structural reviewer:** five bands pass before the first client quote (`components/sections/Projects.tsx:30`); seven before the per-marketplace review counts and the map; bands 2 to 8 contain no contact action.
- **UNVERIFIED:** that this order causes the one-minute exits. No analytics were read.

#### B3. The win cannot be observed, and the busiest contact links open an empty chat
- **Lenses:** codebase-details (Blocker), inventive-catalyst (Blocker), design, comprehension, structural (Major), zoom-out (Nit).
- **Evidence:** change 1, rows 5 to 7. The only key event is a click: `contact_channel_click`, `lib/analytics/catalog.ts:628-636`.
- **Change:** change 1. Keep a plain enquiry log keyed on the first line of each message.

#### B4. There is no path in for a stranger
- **Lenses:** zoom-out (Blocker), design (Blocker), structural (Blocker), codebase-details, inventive-catalyst (Major).
- **Evidence:** Khamsat and Mostaql forbid links (`docs/marketplaces/bio-ar.md:9-11`, `docs/marketplaces/khamsat.md:34-35`). Fiverr's portfolio form has no URL field (`docs/marketplaces/portfolio-gaps.md:53-54`). The sitemap has six URLs (`app/sitemap.ts:14-18`). The site sends its visitors out to marketplaces (`content/site.ts:54-89`) and nothing documented sends buyers in.
- **Change:** outside the repository. Search Console and the sitemap; the URL on LinkedIn, GitHub, X, the Upwork and Freelancer portfolios, the Google Play developer page for the `com.mormdn` apps (`content/site.ts:109`), and a WhatsApp Business profile; the UTM links already documented at `docs/ANALYTICS.md:212-217`. Mostaql portfolio items have an optional preview `url` field (`docs/marketplaces/mostaql.md:64`).
- **UNVERIFIED:** the current state of every one of those profiles, and each marketplace's terms. A suspension would destroy the proof base, so read the terms before linking from a marketplace.

#### B5. The software-house step has no honest substrate yet; every signal says one employed individual
- **Lenses:** design (Blocker), inventive-catalyst (Blocker for scope item 6), zoom-out, comprehension, structural, codebase-details, implementation-readiness (Major).
- **Evidence:**
  - Recruiter affordances and job-seeker wording: change 2, rows 4 and 5.
  - The hero's "Now: NAAS at MisMar" and `worksFor` in the JSON-LD: `lib/structured-data.ts:83-91`.
  - Schema is `Person` and `ProfilePage` only (`lib/structured-data.ts:50-56,167`); Open Graph type is `profile` (`components/DocumentShell.tsx:115`).
  - Contact is a free-mail address on a site that owns its domain: `content/site.ts:30`.
  - Most featured work was done inside employers' teams: Mutabbib at Ebdda (`content/projects.ts:248-249`), Lpermis at Demeter (`:310`), Saber Yamen at Eleven Stars (`:400`), NAAS as "Current role" (`:468`). Only AYCO and SAAD are stated as solo end-to-end builds (`:65,144`).
  - No named collaborator exists anywhere in the source.
- **Change:** needs the owner's positioning decision before any code. What is true today and usable:
  - Keep first person singular. Say plainly that one engineer handles the project from first message to release, and present that as the benefit.
  - Answer the questions a buyer asks a team with evidence one person can back: who owns the code (`content/services.ts:161-163`, `content/copy.ts:287`), what happens if he becomes unavailable, how progress is reported.
  - Label each project as a direct client delivery or work built inside another company's team.
  - Add a portrait and an address on the domain.
- **Do not claim:** "we", "our team", "فريقنا", "company", "شركة", a headcount or an office; the 7 employers as clients; employer metrics as vendor results; that the 135 reviews are for full builds (the service FAQ says fixing other people's apps "is most of this work", `content/services.ts:138`).

#### B6. The branch's two new pages are dead ends, and the one service page addresses the wrong visitor
- **Lenses:** implementation-readiness (Blocker), structural (Blocker), design, codebase-details, zoom-out, comprehension, inventive-catalyst (Major).
- **Evidence and change:** see change 3.
- **Also:**
  - Service-page proof links go to `/#experience`, where rows have no ids and all but the current one are collapsed (`components/sections/Experience.tsx:27-29,60`; `lib/proof.ts:13-16`). Give each role an anchor and open the targeted row.
  - The AYCO study cannot be checked by a stranger: unnamed client, invite-only listing, no period, no client quote (`content/case-studies.ts:18-22`; `content/projects.ts:87-92`). Its "What changed" lists capabilities, not results (`content/case-studies.ts:49-54`). The next study should be a store-listed app with a client review; Lpermis has both (`content/projects.ts:329-332`).

### Major

#### M1. An Arabic-first phone visitor who lands on `/` sees English and no visible switch
- **Lenses:** all seven (comprehension rated it Blocker).
- **Evidence:** change 1, row 8. No locale detection exists: a search for `navigator.language` in `app/`, `components/` and `lib/` found nothing.
- **Change:** show the switch at every width. Optionally show a one-line Arabic link on `/` when the browser lists Arabic: a link, never a redirect.
- **UNVERIFIED:** which URL the owner shares, and what a search engine serves for Arabic queries.

#### M2. The Contact band gives six channels equal weight, four of them marketplaces, and addresses employers
- **Lenses:** design, zoom-out, comprehension, structural, inventive-catalyst, codebase-details.
- **Evidence:** `content/site.ts:45-90` lists WhatsApp, Upwork, Email, Freelancer, Fiverr, Khamsat under "Pick whichever is easiest" (`content/copy.ts:353`). The Arabic order is the English one, with Khamsat last and Mostaql absent (`content/profile-i18n.ts:157-171`), although Khamsat holds 88 reviews and Mostaql is a review source (`content/reviews.ts:70-83`). The email note in Arabic is "للعمل بدوام كامل والتفاصيل المطولة" (`content/profile-i18n.ts:160`).
- **Risk:** Fiverr shows no reviews while the gigs are paused (`AGENTS.md:307-309`), and the site links that profile as proof of 26 reviews (`content/reviews.ts:56-62`) and as a channel (`content/site.ts:76-82`). **UNVERIFIED** whether the gigs are still paused.
- **Change:** WhatsApp and email are the two primary actions, both prefilled. Marketplaces become one secondary "prefer escrow?" row, ordered per locale with خمسات and مستقل first on `/ar/`.

#### M3. One contact intent has seven labels and three destinations, and none says what happens next
- **Lenses:** structural, comprehension.
- **Evidence:** "Hire me" to `#contact` (`components/sections/Nav.tsx:164-170`); "Start a project" to bare WhatsApp (`content/copy.ts:20`); "Start a project" to prefilled WhatsApp on sub-pages (`components/SubpageHeader.tsx:60-74`); "Send me your idea", "Ask about this" (`content/copy.ts:172,176`); "Message me on WhatsApp" (`content/copy.ts:317,341`).
- **Change:** one primary label per locale that names the channel, and one line saying who replies, in which languages and what to send. The reply time depends on M8.

#### M4. Titles and descriptions target the owner's name and stack; Arabic pages lack the words buyers type
- **Lenses:** all seven.
- **Evidence:**
  - Titles: `components/DocumentShell.tsx:76-79,213`.
  - English description ends "Bloc, GetX, Cubit, Firebase, clean architecture" (`content/site.ts:11-12`) and runs past 300 characters with the app list (`components/DocumentShell.tsx:85`).
  - Across `content/*.ts`, "برمجة" appears only in a review translation and a code comment; "الجوال" once (`content/copy-i18n.ts:357`); "موبايل", "مبرمج", "موقع إلكتروني", "شركة برمجة" not at all. The hero says "للهاتف والويب" (`content/copy-i18n.ts:105`).
  - A comment claims the Arabic service headline carries "برمجة" (`content/services-i18n.ts:8-9`); the headline at `:34` does not.
- **Change:** one buyer phrase in each title and H1 per locale; "تطبيقات الجوال" as the primary Arabic term, since most clients are in the Gulf.
- **UNVERIFIED:** search volume for any phrase. Candidate phrases to validate in Search Console or a keyword tool before writing pages: "برمجة تطبيقات الجوال", "تصميم تطبيق جوال", "مبرمج تطبيقات فلاتر", "إصلاح تطبيق فلاتر", "نظام إدارة للشركات", "تطبيق حجز", "تكلفة تطبيق جوال"; "mobile app developer Saudi Arabia", "Arabic app development", "Flutter developer for hire", "fix Flutter app".
- **UNVERIFIED, from general knowledge:** the personal name "محمد رمضان" is shared with a very well-known Egyptian performer, so a name search is unlikely to be winnable. A new domain with no links is unlikely to rank for head terms; only specific long-tail queries are plausible.

#### M5. The brand word is missing where it counts, is spelled three ways and has no Arabic form
- **Lenses:** all seven.
- **Evidence:**
  - Not in any title, H1, `og:site_name` (`components/DocumentShell.tsx:116`, `lib/seo.ts:39`) or `WebSite.name` (`lib/structured-data.ts:103-110`). `Person.alternateName` is the single string "MoRmdn" (`:54`).
  - Visible text only in the footer (`components/sections/Footer.tsx:22`); the nav shows a mark with an `aria-label` (`components/sections/Nav.tsx:81-88`).
  - Spellings: `mormdn`, `MoRmdn`, `m0rmdn` (`content/site.ts:57,72,79,86`); the duplicate host `m0rmdn.web.app` (`AGENTS.md:384-389`).
  - On `/ar/`, `Person` and `WebSite` name and description are English (`lib/structured-data.ts:53-56,107,171`).
  - `sameAs` includes a `wa.me` link, omits Mostaql, and Upwork has two URLs (`content/site.ts:58`, `content/reviews.ts:52`).
- **Change now:** the brand in titles, `WebSite.name`, `og:site_name` and as visible text beside the mark; every variant, an Arabic spelling and the Arabic name in `alternateName`; Mostaql in `sameAs`; one Upwork URL.
- **UNVERIFIED:** whether any of this stops the "mormon" correction. Reviewers agree it follows query volume and cannot be forced by markup. Check Search Console Performance for the query "mormdn" before and after.
- **Owner decision:** whether to keep the name with a descriptor or adopt a pronounceable, Arabic-writable trading name. See [Owner decisions](#owner-decisions).

#### M6. Every share card is an English CV card
- **Lenses:** design, zoom-out, comprehension, codebase-details, inventive-catalyst, implementation-readiness.
- **Evidence:** change 3, row 7.
- **Change:** an Arabic card, and cards per service and case study that state the offer.

#### M7. Facts disagree with each other on a site whose pitch is verifiable claims
- **Lenses:** all except structural.
- **Evidence:**
  - Cyparta, 10% against 20%: change 2, row 6. The Arabic About paragraph drops the 10% (`content/copy-i18n.ts:132`).
  - Bracket Media "15%" is on the site (`content/experience.ts:131`, `content/profile-i18n.ts:75`); `docs/marketplaces/bio-ar.md:15-17` says it was left out of the bio as not verifiable.
  - Mutabbib's 25% is hedged at `content/projects.ts:256` and in Arabic at `content/projects-i18n.ts:94`, unhedged at `content/projects.ts:268` and `content/copy.ts:56`.
  - "Lpermis enhancements" is counted among reviews for "an app someone else started" (`content/services.ts:26,138`), but he led Lpermis (`content/profile-i18n.ts:30`).
- **Change:** one value per fact, confirmed by the owner; remove any he cannot defend.

#### M8. "Within a day" is promised in ten places against the content rule
- **Lenses:** all except structural.
- **Evidence:** change 2, row 7. The FAQ answers are also published as `FAQPage` structured data (`lib/structured-data.ts:249-258`).
- **Change:** the owner confirms it, and whether it covers a reply or a full plan and estimate, and the bio changes in the same commit; or the phrase is removed from all ten places. If it is true, it belongs on the first screen.

#### M9. Price, timeline and after-delivery terms are absent
- **Lenses:** design, zoom-out, comprehension, inventive-catalyst.
- **Evidence:** `content/services.ts:12-13`; the cost FAQ answers "It depends" (`:146-149`). A range is already public on Fiverr: `docs/marketplaces/fiverr.md:50,56` records `$4,000`, shown as "$2500-$5000".
- **Change:** the owner states typical ranges and durations from past work and a support term. Publish them as "typical", not as quotes. Until he does, nothing is added (`AGENTS.md:298-299`).

#### M10. The site sells web work while saying the owner learned React this year
- **Lenses:** design, zoom-out, comprehension, structural, codebase-details, implementation-readiness.
- **Evidence:** change 2, row 3; `content/copy.ts:52`: "This year I took the same habits to the web". The web proof is an employer's product and a two-day learning project (`content/copy.ts:221-224`, `content/projects.ts:220`). No offer says "website" anywhere in `content/copy.ts`; its only occurrence is the label "Visit site" (`:98`).
- **Change:** sell web as dashboards and internal tools, backed by NAAS and the Flutter Web experience. Move the learning card off the client path. Whether plain websites are offered is an owner decision.

#### M11. A stranger landing on a sub-page gets no identity, no navigation and no persistent contact action
- **Lenses:** design, structural, implementation-readiness.
- **Evidence:** `components/SubpageHeader.tsx:38` (not sticky), `:51` (name is `hidden sm:inline`), `:40-74` (home, language, theme and WhatsApp only). The case-study hero has no contact action in its body: `components/pages/CaseStudyPage.tsx:119-127`; AYCO has `links: {}` (`content/projects.ts:91`), so `components/ui/ProjectMeta.tsx:219-224` renders an empty row.
- **Change:** one global header with absolute, locale-aware links and the name visible at all widths; a short "who you are talking to" strip with the review total on both page types; a WhatsApp action under the case-study summary. The structural reviewer notes there are now three unrelated page chromes (`Nav`, `SubpageHeader`, the privacy back-link) and each new page type will fork again.

#### M12. No index routes, no not-found page, breadcrumbs that point at fragments
- **Lenses:** design, structural, codebase-details, implementation-readiness, zoom-out, inventive-catalyst.
- **Evidence:** change 3, row 5. No `not-found` file exists under `app/`; the fallback is the framework's English page (**UNVERIFIED** rendering).
- **Change:** index pages in both locales, added to the sitemap; a bilingual not-found page with tracked Home and WhatsApp links.

#### M13. The home offers and the service catalogue are two sources with drifting ids, and Arabic text is bound by array position
- **Lenses:** structural, implementation-readiness, codebase-details.
- **Evidence:**
  - Home offer ids `new_app`, `existing_app`, `web`, `hard_parts` (`content/copy.ts:179,196,212,228`); the case study uses `arabic_offline`, `firebase`, `company_system`, `healthcare_app` (`content/case-studies.ts:66`). `components/sections/Services.tsx:61` looks pages up by `offer.id`.
  - Each service card exists four times: `content/copy.ts:196-210`, `content/services.ts:37-47,176`, `content/copy-i18n.ts:249-260`, `content/services-i18n.ts:33-43`.
  - Positional binding: `content/profile-i18n.ts:156-171`, `content/copy-i18n.ts:135-143,119-123,236-303`, `content/projects-i18n.ts:180-184`.
- **Change:** decide the taxonomy first; derive the home offers from the catalogue; key every translatable list by a stable id and fail the build on a missing key, as `content/services-i18n.ts:150-153` already does. Changing home offer ids later splits analytics history for `service_id`.

#### M14. Structured data states platforms and authorship that are not true
- **Lenses:** codebase-details, implementation-readiness, inventive-catalyst.
- **Evidence:** `lib/structured-data.ts:135-141` types any project without `links.website` as `MobileApplication` with `operatingSystem: "Android, iOS"`. AYCO is Android only (`content/case-studies.ts:21`). NAAS is a web platform (`content/projects.ts:456-457`). `author` is the Person for employer-owned products (`lib/structured-data.ts:132`).
- **Change:** a `platforms` field on `Project`; derive the type and `operatingSystem` from it; omit when unknown.

#### M15. Arabic pages are thinner than English and keep English strings
- **Lenses:** comprehension, structural, codebase-details.
- **Evidence:**
  - Country beside every employer stays English: `components/sections/Experience.tsx:80`; the override type omits `country` (`content/profile-i18n.ts:7-10`).
  - Descriptive tech chips stay English: `content/projects-i18n.ts:5-8`.
  - First featured project title "AYCO — Maintenance Reports": `content/projects.ts:73`.
  - "Mostaql" and "Khamsat" in Latin where readers know مستقل and خمسات: `content/profile-i18n.ts:167-170`.
  - Arabic project highlights dropped entirely: `content/projects-i18n.ts:178-179`.
  - Arabic alt text is generic ("واجهة التطبيق", "شاشة من التطبيق 1") where English is descriptive: `content/projects-i18n.ts:185-195`.
  - Outcome lines differ between locales for Lpermis, Saber Yamen and JS Quest: `content/projects.ts:328,419,220` against `content/projects-i18n.ts:56,74,130`.
  - The CV, `llms.txt` (`app/llms.txt/route.ts:130-141`), meta keywords and OG image alt (`components/DocumentShell.tsx:89-112,220-232`) are English only.
- **Not a gap:** all 20 English reviews have Arabic translations, and the service and case-study Arabic files match English one to one.

#### M16. Arabic copy reads as translation in places
- **Lenses:** comprehension, design, inventive-catalyst. One reviewer's judgement; it needs a native editor's pass.
- **Evidence and proposals** (all in `content/` unless noted):

  | Text | Problem | Proposed |
  | --- | --- | --- |
  | "لأعمال من المغرب إلى عُمان" (`copy-i18n.ts:103`) | "أعمال" is both "businesses" and "works" | "لشركات من المغرب إلى عُمان" |
  | "تطبيقات تضع العربية أولًا" (`copy-i18n.ts:103`) | Literal "Arabic-first" | "تطبيقات مصمَّمة للعربية من الأساس" |
  | "أُطلق التطبيقات منذ" (`copy-i18n.ts:111`) | A verb used as a label | "أنشر التطبيقات منذ" |
  | "أين فعلت ذلك" (`copy-i18n.ts:362`) | Literal "Where I've done it" | "أعمال سابقة من هذا النوع" |
  | "دفعات تصل إلى 100 جهاز" (`case-studies-i18n.ts:27`) | "دفعات" also means payments | "حتى 100 جهاز في الزيارة الواحدة" |
  | "كسرت البناء" (`services-i18n.ts:47`) | Calque of "broke the build" | "عطّلت بناء التطبيق" |
  | "مهندس برمجيات, المنصورة" | Latin comma hard-coded at `components/sections/Hero.tsx:39` | Use "،" in Arabic |

- **Inconsistent terms:** mobile is "الهاتف" (`copy-i18n.ts:105`), "الجوال" (`:357`) and "الموبايل" in the bio (`docs/marketplaces/bio-ar.md:22`); architecture is "بنية", "المعمارية" and "Clean Architecture" (`copy-i18n.ts:105,241,319`); "فلاتر" appears once (`services-i18n.ts:36`).
- **Number agreement:** "عميل" and "دولة" are fixed for every count (`copy-i18n.ts:219-220`); "عملاء آخرين" should be "آخرون" (`:223`).

#### M17. Insider language on buyer-facing surfaces
- **Lenses:** comprehension, design, zoom-out.
- **Evidence:** "empty `main.dart`", "Bloc or Cubit", "null safety", "row-level security" (`content/copy.ts:48-52`); the client process step "Clean architecture, tests where they earn their keep" (`content/copy.ts:280`, `content/copy-i18n.ts:319`); "Firebase, REST or GraphQL back end" in an offer (`content/copy.ts:185`); "RTL" as a headline value on Arabic pages (`content/projects-i18n.ts:182`, `content/case-studies-i18n.ts:61`); "Application ID" on project cards (`components/ui/ProjectMeta.tsx:87-101`); "Intro 0/7" (`components/sections/Nav.tsx:111-115`).
- **Change:** state benefits on client-facing surfaces; keep stack names in one technical block low on the page.

#### M18. The Arabic font is not preloaded on Arabic pages and ships no semibold
- **Lenses:** design, codebase-details, comprehension, implementation-readiness, inventive-catalyst.
- **Evidence:** `components/DocumentShell.tsx:49-61`: `preload: false`, weights 400 and 500 only, with the comment "none of them above the fold", which is untrue on `/ar/`. Buttons use `font-semibold` (`components/sections/Hero.tsx:53`, `components/sections/Nav.tsx:166`).
- **Change:** preload the Arabic font in the Arabic layout only; add a 600 file or cap Arabic semibold at 500.
- **UNVERIFIED:** the rendered weight, font swap on the largest element and any layout shift.

#### M19. The service plan is too large for the proof and the traffic
- **Lenses:** design, zoom-out, structural, inventive-catalyst.
- **Evidence:** 19 ids at `lib/analytics/catalog.ts:311-331`; one service is about 145 lines of English and 115 of Arabic (`content/services.ts:33-177`, `content/services-i18n.ts:32-144`), all governed by "Change one, change the other" (`content/services.ts:9-10`).
- **UNVERIFIED:** that many near-identical pages from a domain with no links would be treated as doorway pages.
- **Change:** see change 3 and [Where reviewers disagree](#where-reviewers-disagree).

#### M20. Accessibility gaps found in code
- **Lenses:** codebase-details, implementation-readiness, design, comprehension. Coverage here is partial; see [Coverage gaps](#coverage-gaps).
- **Focus ring on the primary contact card.** The global ring is copper (`app/globals.css:288-292`) and the WhatsApp card is `bg-copper` with its link inside (`components/sections/Contact.tsx:112-121`). Derived from code, not rendered. One reviewer found this; two others checked the focus rule and reported no defect, without examining this card.
- **Contrast.** `text-on-copper/70` at 12px on copper (`components/sections/Contact.tsx:153`) is about 4.2:1 by one reviewer's hand calculation, under the 4.5:1 floor in `AGENTS.md:174-179`. **UNVERIFIED** by measurement.
- **Nav island overflow at 360px and below.** Every child is `shrink-0` or `whitespace-nowrap` (`components/sections/Nav.tsx:79,84,96,109,166`). **UNVERIFIED**; estimated at about 338px against 336px available.
- **Menu sheet.** It sits outside the `<nav>` landmark (`components/sections/Nav.tsx:171-212`); focus is not moved into it; there is no outside-tap close, though the catalog declares a `backdrop` method (`lib/analytics/catalog.ts:209`); it has no `max-h` or `overflow-y`, so the language and theme controls can be cut off in landscape.
- **Targets under 44px.** "Copy address" (`components/sections/Contact.tsx:190`), which also sits inside a full-cell link; the sub-page logo link (`components/SubpageHeader.tsx:43,50-51`); offer title and "Seen in" links (`components/sections/Services.tsx:67-77,101-111`).
- **No defect found** by the reviewers who checked: `lang` and `dir`, the skip link's presence, a `main` landmark on all four page types, one `h1` per page with no skipped levels, reduced-motion fallbacks (`app/globals.css:315-328,772-808`), and `aria-expanded` on toggles.

#### M21. `/ar/` opens with translated English reviews, and "5.0" is a constant
- **Lenses:** inventive-catalyst.
- **Evidence:** the same lead ids serve both locales (`content/reviews.ts:100-110`), though 23 of 43 quotes are Arabic originals (count from `content/reviews.json`, one reviewer). "5.0" is hard-coded at `components/ui/ReviewCard.tsx:66` and `content/copy.ts:124`; the `Review` type has no rating field (`content/reviews.ts:18-35`).
- **Change:** per-locale lead lists, so `/ar/` opens with Arabic originals. Order changes; no quote does. Make the rating data, or state its basis.
- **UNVERIFIED:** that every review is 5.0.

#### M22. The project guide and docs were not updated with the branch
- **Lenses:** implementation-readiness, structural, codebase-details.
- **Evidence:** change 3, last row. Also stale: `docs/ANALYTICS.md:56,118-120` and the comment at `components/PrivacyPage.tsx:11-13`.

#### M23. `faq_toggle` sends the localised question text and always reports "open"
- **Lenses:** codebase-details, implementation-readiness, design.
- **Evidence:** `components/pages/ServicePage.tsx:271-275` sends `link_text: item.q`, though `content/types.ts:192-193` gives each question a stable id.
- **Change:** add a `faq_id` parameter, regenerate the docs, register it in GA.
- **UNVERIFIED:** whether `service_id` and the new placement values are registered in GA (`AGENTS.md:156-157`).

### Nit

| # | Finding | Evidence | Lenses |
| --- | --- | --- | --- |
| N1 | The footer view counter shows a low number publicly, is world-writable and is the only reason the Firebase SDK loads. Design rated this Major. Owner decision: remove it. | `components/sections/Footer.tsx:14,25-29`; `AGENTS.md:123-127,381-383` | design, zoom-out, comprehension, implementation-readiness |
| N2 | Physical positioning in right-to-left. | `components/DocumentShell.tsx:196` (`focus:left-4`); `components/analytics/ConsentNotice.tsx:72`; `app/globals.css:810-812` (**UNVERIFIED**) | design, codebase-details, comprehension, implementation-readiness |
| N3 | Arrows mirrored in some places and not others; an unmirrored back arrow on privacy. | `components/sections/Contact.tsx:69-71`; `components/sections/ServiceParts.tsx:48`; `components/ui/ProjectMeta.tsx:247,272`; `components/PrivacyPage.tsx:31` | codebase-details, comprehension, implementation-readiness |
| N4 | `HighlightList` prints 01, 02, 03 on project details and the case study, against "Do not number anything else". | `components/ui/ProjectMeta.tsx:42-64`; `components/pages/CaseStudyPage.tsx:46-47,224`; `AGENTS.md:180-182` | structural, implementation-readiness |
| N5 | Hero screenshots lift on hover but are not links. | `components/sections/Hero.tsx:80-102`; `app/globals.css:802-807` | structural, implementation-readiness |
| N6 | The Arabic hero intro hard-codes numbers the English derives. | `content/copy-i18n.ts:104-105` against `content/copy.ts:17` | zoom-out, implementation-readiness |
| N7 | Timezone "UTC+3" is wrong for Egypt outside summer time. | `content/site.ts:9`; `app/llms.txt/route.ts:35` | design, zoom-out, comprehension |
| N8 | The catalog describes surfaces that do not exist, and one listener matches a stale id. | `lib/analytics/catalog.ts:91,309,650`; `lib/analytics/listeners.ts:39` against `components/sections/Nav.tsx:175` | codebase-details |
| N9 | Dwell and impression events hard-code `section_id: "projects"` on the case-study page. | `lib/analytics/attention.ts:68,149` | implementation-readiness |
| N10 | `Article` has no `datePublished`; service pages are `og:type: "article"`. `FAQPage` rich-result eligibility is **UNVERIFIED**. | `lib/structured-data.ts:210-223,249-258`; `lib/seo.ts:38` | design, codebase-details, implementation-readiness |
| N11 | `index.txt` RSC payloads are not covered by the `__next*` noindex rules. Seen in an existing `out/` build that may be stale. | `firebase.json:52,174` | codebase-details |
| N12 | Raw hex in a component. | `components/DocumentShell.tsx:164-165` | implementation-readiness |
| N13 | The manifest describes the site as "software engineer portfolio. Obsidian & Copper." | `public/manifest.json:8` | inventive-catalyst |
| N14 | "from Morocco to Oman" rests on four Khamsat clients in Oman; no Omani project is shown. | `content/clients.json:8` | comprehension |
| N15 | The SocialProof band is labelled "What clients say" and contains no client words. | `components/sections/SocialProof.tsx:10-24` | structural |
| N16 | "What I won't promise" is an h3 under the h2 "Questions". | `components/pages/ServicePage.tsx:260-295` | structural |
| N17 | The language link sets `lang` to the target language while its `aria-label` is in the current one. | `components/ui/LanguageSwitch.tsx:34-35` | comprehension |
| N18 | "Bar length is time in the role" shows on phones, where the bars are hidden. | `components/sections/Experience.tsx:38,89-93` | comprehension |
| N19 | The footer's "Back to top" has no `#top` target on the privacy page. | `components/sections/Footer.tsx:54` | implementation-readiness |
| N20 | Upwork "Top Rated, 100% Job Success" is recorded in the docs and used nowhere on the site. Current status **UNVERIFIED**. | `docs/marketplaces/upwork.md:5` | inventive-catalyst |
| N21 | AYCO is tagged `healthcare_app`; it is a field-service app. | `content/case-studies.ts:66` | implementation-readiness |

---

## Contradictions and resolutions

From the inventive-catalyst lens, kept where a second lens or the source supports them. Each names the cheapest test.

| Contradiction | Resolution that avoids a compromise | Cheapest test | Risk |
| --- | --- | --- | --- |
| Must read as a team a business can hire, and must claim nothing untrue. | Split the audiences, not the truth: the home page is the client page, the CV moves to About. Turn the solo risk into the offer with a handover guarantee already evidenced in content: full source code (`content/copy.ts:287`, `content/services.ts:161-163`) and client-owned application ids (`content/projects.ts:166,331,422`). | Show the first screen for five seconds to five Arabic-speaking business owners. Ask: a person or a company, what does he build, how do you reach him. | "Studio" can itself overclaim. Capacity beside the full-time role must be stated truthfully. |
| The first screen must say what, why and how, on a small viewport with one copper accent. | Trust and "what" need words, not copper. One line each. The nav's contact button is already allowed without copper (`design/DESIGN-SYSTEM.md:68-71`, cited by one reviewer); point it at WhatsApp. | Screenshots at 360x640 and 390x844 in both locales. | A numbers-led hero can read as boasting. |
| The brand must be findable, and "mormdn" is corrected to "mormon". | Never rely on the bare token: use brand plus category in titles, declare every variant and an Arabic spelling. Stop expecting strangers to search the brand; discovery goes through problem queries and links. | Search Console query "mormdn" before and after. | Correction follows query volume and cannot be forced. |
| Nobody visits, and the proof lives on marketplaces that have the visitors. | A source-aware call to action: a visitor arriving with `?src=mostaql` sees "continue on Mostaql" first, set by a pre-paint inline script in the pattern of `themeScript` (`components/DocumentShell.tsx:185-190`). | One Mostaql portfolio item with a tagged link for 30 days. | Marketplace terms are **UNVERIFIED**; a suspension would destroy the proof base. The no-JS fallback shows the WhatsApp action, the riskiest one for that visitor. |
| No form and no server, and contact must be effortless and qualified. | Compose the message in the link. Every link prefilled per locale and per page; optionally a three-tap brief builder that recomputes the WhatsApp and mailto hrefs in the browser and stores nothing. Analytics gets ids only (`AGENTS.md:150-152,298-300`). | Tap every call to action on a real phone in both languages; confirm the Arabic text arrives intact. | A mandatory builder is friction; keep it optional. |
| Verbatim reviews, and proof a non-technical Arabic reader can scan. | Per-locale lead lists; facts computed from review fields above the cards. A highlighted exact substring per review was proposed; it needs an `AGENTS.md` rule and may be read as tampering. | Three Arabic readers, ten seconds on the reviews block, ask what they remember. | The facets need a clean `project` taxonomy. |
| Low traffic means nothing can be measured, and changes need feedback. | Measure at the destination: the source line in the prefilled message is exact at one enquiry and independent of consent and blockers. Use five-person tests in place of A/B. Search Console impressions are the leading indicator. | Start the enquiry log now. | Depends on log discipline. |

---

## Where reviewers disagree

The synthesiser has not resolved these. Each needs the owner's call.

| Question | One position | The other position |
| --- | --- | --- |
| Add an `Organization` or `ProfessionalService` node with the Person as founder? | design and inventive-catalyst: yes, with no employee count; it is true today. | structural and codebase-details: no, not until a real entity exists; it is the same overclaim in markup. |
| Make Arabic the root and move English to `/en/`? | zoom-out: worth considering now, because nothing ranks and the URL cost is at its lowest. | inventive-catalyst: not advised; it breaks existing links. Showing the switch and using `/ar/` links everywhere is enough. |
| How many sub-pages to build next? | zoom-out: the existing service page, AYCO and one Arabic-first new-app page, then stop until Search Console shows impressions. | structural: index pages plus three buyer-intent service pages and a work index. inventive-catalyst: also generate a short case study for every project that already has a `story` (`content/projects.ts:61-72`). design: three or four services, each with at least two pieces of delivered proof. |
| Rename the brand? | design and comprehension: choose a pronounceable two-script name for the software house and keep `mormdn.com` as the personal handle. | zoom-out: disambiguate now; do not rename until there is a second person or a decided studio identity, because a studio name over first-person copy is cosmetic. |
| Country or industry pages? | inventive-catalyst: one Saudi Arabia evidence page, where the data is dense. | structural: no country pages; there is no content beyond client counts and they would be thin. |
| Let the conversion goal override "one copper accent per viewport"? | zoom-out: yes, where the two conflict (`components/sections/Services.tsx:22-24`). | inventive-catalyst: no rule change is needed; the contact action can be present without copper. |

---

## Scope boundaries

**Goals**

- A first screen in each locale that says what is built, why to trust, and how to make contact, on a phone.
- A home page ordered for a buyer, with the CV available but off the client path.
- Every enquiry announces its own origin and language.
- A small, closed, cross-linked set of sub-pages in buyer language, with titles and share cards to match.
- Arabic that is reachable on a phone and as complete as English.
- One value for every fact.

**Non-goals, until the owner decides otherwise**

- Any claim of a team, a company, a headcount or an office.
- Prices, timelines, response times or support terms the owner has not stated.
- Editing any review quote (`AGENTS.md:301-304`).
- A contact form, an API route or any server.
- A catch-all rewrite or a JavaScript redirect between hosts or locales (`AGENTS.md:228-233,384-389`).
- The full 19-service plan.
- Service ids with no proof on the site: `seo`, `hosting`, `speed`, `website`, `ui_ux`.
- More payload and instrumentation work. `docs/PORTFOLIO-ENHANCEMENTS.md:37-46,164-196` records 56 GA custom definitions and byte-level tuning for a site the owner says almost nobody visits.

---

## Owner decisions

Nothing below can be decided from the source, and none of it should be invented.

1. **Positioning.** An individual engineer, or a studio led by him? Are there real, named collaborators who have delivered and consent to be named?
2. **Capacity.** What he can truthfully say about availability beside the full-time NAAS role (`content/experience.ts:25`).
3. **Client numbers.** Whether 108 accounts, 20 countries and 56 in Saudi Arabia may be stated, given they are per-platform counts; and whether every platform shows 5.0.
4. **Contradicting facts.** Cyparta 10% or 20%; whether Bracket Media's 15% and Mutabbib's unhedged 25% stay; whether the Lpermis review belongs under "an app someone else started".
5. **"Within a day".** A promise he makes or not; a reply or a full plan; in which languages and hours.
6. **Prices and terms.** Typical ranges and durations, and what he offers after delivery. Whether the Fiverr range is real.
7. **Web scope.** Whether plain websites are offered, and who designs screens and builds servers beyond Firebase.
8. **Brand.** Keep "MoRmdn" with a descriptor and an Arabic spelling, or adopt a new trading name. Which Arabic spelling.
9. **Fiverr.** Unpause the gigs, or stop routing buyers there.
10. **Email.** An address on the domain in place of `mormdn@outlook.com`.
11. **The view counter.** Remove it or keep it.
12. **A portrait.**

---

## Unverified

Stated by reviewers, not confirmable from source. Each needs the check named.

| Claim | Check |
| --- | --- |
| The hero button is at or below the fold on a phone. Refuted at 375x812 in Arabic; open for 360x640 and for English. | A 360x640 emulator in both locales. |
| The nav island overflows at 360px or less; the sub-page header overflows at 320px. No overflow at 375px. | A 360px and a 320px emulator. |
| Faux bold and font swap on Arabic pages. | A browser on `/ar/`. |
| The focus ring is invisible on the copper WhatsApp card; `text-on-copper/70` is under 4.5:1. | Keyboard focus in a browser; a contrast tool. |
| Whether on-page changes affect Google's "mormdn" to "mormon" correction (the correction itself is confirmed). | Search Console Performance for the query "mormdn", before and after. |
| A name search for "محمد رمضان" is unwinnable. | A search. |
| Search demand for any candidate phrase, in either language. | Search Console or a keyword tool. |
| Many similar service pages would be treated as doorway pages. | Not checkable in advance; keep the set small. |
| Visitors leave within a minute because of the page order. | Analytics, once there is traffic; five-person tests now. |
| Search Console is verified; GA parameters are registered. | The consoles. |
| Fiverr gigs are still paused; Upwork is still Top Rated. | The profiles. |
| Marketplace terms allow a link in a portfolio item. | Each marketplace's terms. |
| The header globs in `firebase.json:155-174` match the new routes. | Response headers on a preview channel. |
| The branch passes typecheck, lint, the analytics docs check, the agents check and the build. | `npm run typecheck && npm run lint && npm run analytics:docs -- --check && npm run agents:check && npm run build`. |
| The default 404 under two root layouts. | A build. |
| WhatsApp shows the English card for `/ar/` links. | Paste `mormdn.com/ar/` into a chat. |

---

## Coverage gaps

What this review did not cover, so it is not mistaken for a clean result.

- **Accessibility (scope item 4) is partial.** Two reviewers audited it in code; four stated they did not assess contrast, focus or reduced motion. No screen reader, keyboard or device was used. `Skills.tsx`, `ClientMap.tsx`, `ClientMapExplorer.tsx`, `ProjectGallery.tsx`, `ProjectPlate.tsx` and the privacy page were opened by one reviewer or none; their heading order, contrast and tap targets are unchecked.
- **Mobile UX (scope item 2) is mostly inferred from classes.** The main session rendered three Arabic pages at one width, 375x812. No English page, no other width and no real phone was checked.
- **Visual design was not judged against `design/DESIGN-SYSTEM.md`.** No reviewer read it in full.
- **`app/globals.css` was read in part by every reviewer.**
- **`content/reviews.json` quote bodies were not read.** Counts and metadata only.
- **`docs/ANALYTICS.md` was read in part by two reviewers.** Whether the new pages meet every analytics rule is not confirmed beyond the `trackAttrs` and catalog checks one reviewer made.
- **Arabic copy quality rests on one reviewer's reading.** It is not a native editor's pass.
- **The technology choice was not challenged by any reviewer.** None found a reason in source to change it; none examined it closely.

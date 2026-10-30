/**
 * Section prose. Kept out of the components so a wording change never means
 * touching layout code.
 *
 * The hero intro previously said "four years" — the CV says over five.
 */
import { clientCountries } from "./clients";
import { reviews, reviewTotal } from "./reviews";
import { contact, metrics, site } from "./site";

export const hero = {
  status: "Open to work",
  place: `${site.location} · ${site.timezone}`,
  headline: ["Flutter apps", "that actually", "ship."],
  /**
   * v1 accented the final word in copper. DESIGN-SYSTEM v2 §1.3 spends the
   * hero viewport's one Tier 1 on the CTA instead, so this is retained for
   * data fidelity and deliberately NOT rendered.
   */
  headlineAccentIndex: 2,
  intro: `I'm ${site.name} — a mobile developer with ${metrics.yearsExperience} years spent building cross-platform products for teams in ${metrics.countries} countries. Bloc, GetX, Cubit, clean architecture, and a stubborn preference for 60fps.`,
  primaryCta: { label: "See the work", href: "#projects" },
  // WhatsApp is the stated first-choice channel, so it takes the hero's
  // secondary action. The email address still appears in Contact, the footer
  // and the structured data.
  secondaryCta: { label: "WhatsApp", href: "https://wa.me/201281100168" },
  resumeCta: { label: "Download CV", href: contact.resumeUrl },
  trackRecordLabel: "Track record",
  trackRecord: [
    { value: metrics.yearsExperience, suffix: "+", label: "Years shipping Flutter" },
    { value: metrics.appsLiveOnBothStores, suffix: "", label: "Apps live on both stores" },
    { value: metrics.teams, suffix: "", label: `Teams across ${metrics.countries} countries` },
  ],
  viewsLabel: "page views",
};

export const about = {
  eyebrow: "01 / About",
  headline: ["Bioinformatics", "degree, mobile", "obsession."],
  lede: "I build cross-platform apps that behave like native ones — fast to open, smooth under the thumb, and honest about state.",
  body: [
    "My final-year project was mobile data analysis and visualisation; that's where the habit started. Since then I've led products from an empty `main.dart` to the App Store: a driving-school platform in Morocco, a medical social network in Libya, an AI matchmaking product in Saudi Arabia, a multi-vendor marketplace in Türkiye, and a field-service reporting system built solo end to end. Different domains, same discipline — Bloc or Cubit for anything with real business logic, clean architecture so the next developer isn't cursing my name, and unit and widget tests where they earn their keep.",
    "I like the unglamorous wins: cutting data load times by 20%, shaving 10% off a bundle, upgrading a legacy app to null safety before it became someone's emergency.",
    "This year I took the same habits to the web — React, then Next.js — and built JS Quest to prove it rather than claim it: a hundred-question JavaScript course where the answers live in Postgres behind row-level security, because a quiz you can beat by reading the network tab teaches nothing.",
  ],
  stats: [
    { value: "20%", label: "Faster data load, Eleven Stars" },
    { value: "25%", label: "More bookings, Mutabbib" },
    { value: "15%", label: "Retention lift, Arcit-AI" },
    { value: "10%", label: "Smaller binary, Cyparta" },
  ],
};

export const learning = {
  eyebrow: "Currently",
  completedLabel: "Completed",
  inProgressLabel: "In progress",
  builtLabel: "Built with it",
};

export const experienceCopy = {
  eyebrow: "02 / Experience",
  headline: "Seven teams, six countries.",
  hint: "tap a row to expand",
  currentBadge: "CURRENT",
  bandAxisNote: "DURATION \u00b7 CLICK A BAR",
  bandCaption:
    "Four of these ran at once through 2024 \u2014 most of them remote and part-time.",
};

export const projectsCopy = {
  eyebrow: "03 / Projects",
  headline: "Live on both stores.",
  privateLabel: "Private client · no public listing",
  appStoreLabel: "App Store",
  playStoreLabel: "Google Play",
  websiteLabel: "Visit site",
  sourceLabel: "Source",
  closeLabel: "Close",
  bundleIdLabel: "Application ID",
  outcomeLabel: "Outcome",
  builtWithLabel: "Built with",
  socialLabel: "Store & social artwork",
  screensLabel: (title: string) => `${title} store screens`,
  galleryEyebrow: "Gallery",
  galleryHeadline: "The rest of the shelf.",
  galleryNote: (count: number) => `${count} more · tap a tile to open`,
};

export const skillsCopy = {
  eyebrow: "04 / Skills",
  headline: "The toolbox.",
  blurb:
    "Depth where it matters — Dart, Flutter, state management and payments — and enough breadth to talk to backend, data and design without a translator.",
};

export const reviewsCopy = {
  eyebrow: "05 / Reviews",
  headline: `${reviewTotal} reviews. All five stars.`,
  blurb:
    "Every number below is a client who could have said otherwise. The quotes are copied word for word, typos included. Arabic ones keep the original with a translation underneath.",
  scoreLabel: "5.0",
  note: `${reviews.length} of them, picked by me. The full lists are one click away on each platform.`,
  pauseLabel: "Pause",
  playLabel: "Play",
  showOriginalLabel: "Show Arabic originals",
  showTranslationLabel: "Show translations",
};

export const clientMapCopy = {
  eyebrow: "Where they are",
  headline: "World domination",
  blurb:
    "Every lit country has a client who hired me on one of these five sites. The lines all start in Mansoura, because that's still where the work gets done.",
  mapLabel: `World map of client locations across ${clientCountries.length} countries. The same figures are in the list that follows.`,
  filterLabel: "Show clients from",
  allLabel: "All sites",
  countriesLabel: (count: number) => (count === 1 ? "country" : "countries"),
  clientsLabel: (count: number) => (count === 1 ? "client" : "clients"),
  homeLabel: "Mansoura, Egypt",
  countedNote: "Counted once per site, so a client on two sites counts twice.",
  unplacedNote: (count: number) =>
    `${count} more ${count === 1 ? "client has" : "clients have"} no public country, so ${count === 1 ? "isn't" : "aren't"} on the map.`,
};

export const contactCopy = {
  eyebrow: "06 / Contact",
  headline: ["Got an app", "to build?"],
  blurb:
    "Full-time, contract or a second pair of hands on a release that's slipping — reach me wherever suits you and I'll reply within a day.",
  availabilityLabel: "AVAILABILITY",
  availability: "Taking new work · Mansoura / remote",
  channelsLabel: "Get in touch",
  channelsNote: "Pick whichever is easiest — they all reach me.",
  copyLabel: "Copy address",
  copiedLabel: "Copied",
};

export const footerCopy = {
  backToTop: "Back to top",
  builtWith: "Built with Next.js",
  privacyLabel: "Privacy",
  privacyHref: "/privacy/",
};

export const consentCopy = {
  label: "Analytics choice",
  body: "This site uses Google Analytics to see which work people find interesting. It only sets cookies if you agree.",
  policyLabel: "Privacy",
  policyHref: "/privacy/",
  acceptLabel: "Accept",
  declineLabel: "Decline",
  currentLabel: {
    accepted: "Analytics: accepted",
    declined: "Analytics: declined",
    none: "Analytics: no choice made yet",
  },
};

export const privacyCopy = {
  title: "Privacy",
  description: "What this site measures, what it never collects, and how to turn it off.",
  eyebrow: "Privacy",
  headline: "What this site measures",
  intro:
    "This is the portfolio of Mohamed Ramadan. It uses Google Analytics to understand how people use the page, mainly which projects hold their attention.",
  updated: "Last updated 30 October 2026",
  backLabel: "Back to the portfolio",
  choiceTitle: "Your choice",
  choiceBody:
    "You can change your mind here at any time. Declining stops analytics in this browser and removes its cookies. Visitors in the EU, UK and Switzerland are asked first; until they accept, no analytics cookies are set.",
  sections: [
    {
      title: "What is measured",
      items: [
        "Pages opened, the links and buttons clicked, and how far down the page you scroll.",
        "How long you stop on each project, section and role, and which projects you open.",
        "Page speed and script errors, so problems can be found and fixed.",
        "General facts Google Analytics reports: approximate location by city, device type, browser, language and the site that sent you.",
      ],
    },
    {
      title: "What is never collected",
      items: [
        "Your name, email address, phone number or any other detail that identifies you.",
        "Anything you copy. Only the number of characters is recorded, never the text.",
        "Advertising data. The site shows no adverts and Google's ad features are turned off.",
      ],
    },
    {
      title: "Cookies and storage",
      items: [
        "Google Analytics sets _ga cookies, which last up to two years, to tell one visit from the next.",
        "Your choice is kept in this browser's local storage so you are not asked again.",
        "The visit counter on the page adds one per page load and stores no information about you.",
      ],
    },
    {
      title: "Where the data goes",
      items: [
        "Analytics data is processed by Google under its own privacy terms, and may be processed outside your country.",
        "It is kept for up to 14 months and is not sold or shared with anyone else.",
      ],
    },
  ],
  contactTitle: "Questions",
  contactBody: "To ask about your data, or to have it removed, write to",
};

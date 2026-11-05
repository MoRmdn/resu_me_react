/**
 * What he can be hired for, and the questions clients ask before hiring.
 *
 * Every claim here has to be backed by something already on the page: a review,
 * a project, a role or a channel. There are no prices and no turnaround times,
 * because nothing on the site states them yet. Add those only from Mohamed's own
 * numbers, never as an estimate.
 *
 * The same entries feed the Services section, the `makesOffer` and `FAQPage`
 * structured data in app/layout.tsx, and /llms.txt, so the three always match.
 */
import { channels, metrics, site } from "./site";
import { reviews } from "./reviews";
import { skillGroups } from "./skills";

/**
 * Review job titles that are work on an app someone else started. The count of
 * matching reviews is the proof line on the first service, so it stays true as
 * reviews are added. A new title only counts once it is listed here.
 */
const existingAppJobs = new Set([
  "Flutter app changes & fixes",
  "Flutter app fixes",
  "App maintenance and bug fixes",
  "Flutter errors on iOS",
  "Flutter bug fixes and new features",
  "Flutter real-estate app reskin",
]);

const existingAppReviews = reviews.filter((r) => existingAppJobs.has(r.project)).length;
const gateways = skillGroups.find((g) => g.label === "Payments")?.items ?? [];

export type Service = {
  slug: string;
  title: string;
  body: string;
  /** One line of evidence, drawn from the rest of the page. */
  proof: string;
};

export const services: Service[] = [
  {
    slug: "fixes",
    title: "Fixes and changes to an existing app",
    body: "You have a Flutter app that will not build, crashes on iOS, or needs a feature added, and the developer who wrote it is gone. I read the code first, fix what is broken, and leave it easier to change than I found it.",
    proof: `${existingAppReviews} of the ${reviews.length} reviews quoted above are for this kind of job.`,
  },
  {
    slug: "new-apps",
    title: "A new app, from first screen to both stores",
    body: "One Flutter codebase for Android and iOS: architecture, state management, the back end it needs, and the App Store and Google Play submissions at the end.",
    proof: `${metrics.appsLiveOnBothStores} apps live on both stores.`,
  },
  {
    slug: "integrations",
    title: "Payments, notifications, maps and Firebase",
    body: "The parts that touch money, devices and other services: payment gateways, push notifications, maps and location, and Firebase Auth, Firestore, Cloud Functions and Storage.",
    proof: `${gateways.length} payment gateways integrated so far, including ${gateways.slice(0, 3).join(", ")}.`,
  },
  {
    slug: "team",
    title: "An extra Flutter developer on your team",
    body: "Remote, full-time or part-time, inside your sprints and your code review. Useful when a release is slipping, or when the app needs someone who owns it.",
    proof: `${metrics.teams} teams in ${metrics.countries} countries so far.`,
  },
];

const channel = (id: (typeof channels)[number]["id"]) => channels.find((c) => c.id === id)!;

export type Faq = {
  /** Stable id, sent to analytics as `faq_ref`. Never rename one: it splits the report. */
  slug: string;
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    slug: "existing-code",
    question: "Can you work on an app someone else built?",
    answer:
      "Yes. Most of my marketplace work is exactly that: picking up an existing Flutter codebase, getting it to build again and changing what the client needs. I also led a legacy app's migration to null safety.",
  },
  {
    slug: "both-platforms",
    question: "Do you build for Android and iOS?",
    answer: `Both, from one Flutter codebase. I handle the App Store and Google Play submissions too: ${metrics.appsLiveOnBothStores} of the apps I have worked on are live on both stores.`,
  },
  {
    slug: "back-end",
    question: "Do you also build the back end?",
    answer:
      "Often, on Firebase: Auth, Firestore with security rules, Cloud Functions and Storage. On the web side I use Supabase and PostgreSQL. If you already have a back end, I connect to it over REST or GraphQL.",
  },
  {
    slug: "arabic-rtl",
    question: "Can you build Arabic, right-to-left apps?",
    answer:
      "Yes. Arabic is my first language, and several of my apps are Arabic-first with a full right-to-left layout, including on-device PDF reports. I work with clients in Arabic or English.",
  },
  {
    slug: "engagement",
    question: "How do you work: hourly, fixed price or full-time?",
    answer: `Any of them. ${channel("upwork").label} suits contract work with escrow, ${channel("fiverr").label} suits fixed-scope packages, ${channel("khamsat").label} suits Arabic-speaking clients, and email suits full-time roles and long briefs.`,
  },
  {
    slug: "location-reply",
    question: "Where are you based, and how fast do you reply?",
    answer: `${site.location}, working remotely with clients around the world. I reply within a day, and fastest on ${channel("whatsapp").label}.`,
  },
];

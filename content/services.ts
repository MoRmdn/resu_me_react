import { reviews } from "./reviews";
import type { Service, ServiceId } from "./types";

/**
 * The service catalogue: one entry per page at /services/<slug>/. The Arabic
 * text is in services-i18n.ts.
 *
 * Rules, the same as the Services section on the homepage:
 * - Every claim restates the marketplace bio (docs/marketplaces/bio-ar.md) or a
 *   fact elsewhere in content/. Change one, change the other.
 * - `proof` names only work on this site that did this kind of work.
 * - No prices, timelines, response times or support terms until Mohamed
 *   states them. A made-up range would be a promise he never made.
 * - Reviews are matched by their `project` field and shown verbatim.
 * - The headline carries the phrase people search for, once. No stuffing.
 * - `related` names only services that have a page. A page that is planned and
 *   not written is not listed anywhere: lib/closed-set.ts fails the build on an
 *   id that resolves to nothing, and on a page with no onward link.
 * - A new page needs proof that is already on this site. Write no page for a
 *   service whose only evidence would be the page itself.
 */

/** Review `project` values for fixes and changes to an app someone else started. */
const fixProjects = [
  "Flutter app fixes",
  "Flutter app changes & fixes",
  "App maintenance and bug fixes",
  "Flutter errors on iOS",
  "Flutter bug fixes and new features",
  "Flutter real-estate app reskin",
  "Lpermis enhancements",
];

/** Counted from the data, so the FAQ cannot drift from the reviews on the page. */
export const fixReviewCount = reviews.filter((r) => fixProjects.includes(r.project)).length;

/** Review `project` values for apps built from the start, not fixes to someone else's. */
const buildProjects = [
  "FreeDoctor",
  "Lpermis Pro",
  "Ride-hailing app",
  "Arcit-AI Flutter app",
  "Flutter graduation project",
];

export const services: Service[] = [
  {
    id: "new_app",
    slug: "mobile-app-development",
    group: "apps",
    title: "A new app, from idea to the stores",
    headline: "Mobile app development for Android and iOS",
    summary:
      "A new mobile app for your business: one Flutter codebase for Android and iOS, in Arabic and English, taken from the idea to the App Store and Google Play.",
    audience: "For founders and businesses starting from an idea",
    body: "One Flutter codebase for Android and iOS, taken from the architecture to a published listing.",
    includes: [
      "Arabic and English, right-to-left included",
      "Firebase, REST or GraphQL back end",
      "Release on the App Store and Google Play",
    ],
    situations: [
      {
        title: "You have an idea, not a technical team",
        body: "You know what the app should do for your customers. You need someone to turn that into a written scope, then into a working app.",
      },
      {
        title: "Bookings, orders or reports still run on calls and paper",
        body: "The work already happens every day. It needs to move to a phone, the way AYCO moved signed maintenance reports off paper.",
      },
      {
        title: "Your customers read Arabic",
        body: "The app has to read right to left from the first screen, not be mirrored at the end.",
      },
      {
        title: "You need Android and iOS together",
        body: "One codebase builds both, so the two apps are built and updated together.",
      },
    ],
    scope: [
      {
        title: "Before any code",
        items: [
          "A written scope: what gets built and what doesn't",
          "A realistic price and timeline, split into milestones",
        ],
      },
      {
        title: "The app",
        items: [
          "One Flutter codebase for Android and iOS",
          "Arabic and English, right-to-left included",
          "Sign-in, notifications, maps and payments where the app needs them",
        ],
      },
      {
        title: "The back end",
        items: [
          "Firebase, or your own REST or GraphQL API",
          "Roles and permissions enforced on the server",
          "Offline work that syncs when the connection returns",
        ],
      },
      {
        title: "Release",
        items: ["Store listings prepared", "Published to the App Store and Google Play"],
      },
    ],
    deliverables: [
      "The app published on the App Store and Google Play",
      "A written scope and estimate before work starts",
      "An update at every milestone, without you asking",
      "The full source code, in your hands",
    ],
    proof: [
      {
        name: "AYCO",
        target: "ayco",
        note: "Built alone, from the Flutter app to the Firebase back end and the release builds: offline visits and signed Arabic PDF reports.",
      },
      {
        name: "Lpermis",
        target: "lpermis",
        note: "Led from the first architecture to release: driving-theory practice and lesson booking for learners in Morocco.",
      },
      {
        name: "Mutabbib",
        target: "mutabbib",
        note: "A medical network for Libya connecting people with hospitals, clinics and doctors, with real-time notifications and appointment scheduling.",
      },
      {
        name: "Saber Yamen",
        target: "saber-yamen",
        note: "A multi-vendor marketplace for new and used items.",
      },
    ],
    reviewProjects: buildProjects,
    leadReviewIds: [
      "freelancer-aymene",
      "upwork-lpermis-pro",
      "freelancer-hashim",
      "upwork-arcit-ai",
      "upwork-graduation",
    ],
    faq: [
      {
        id: "idea_only",
        q: "I only have an idea. Is that enough to start?",
        a: "Yes. The first step is a written scope: we agree what gets built and what doesn't before any code, and the estimate comes from that.",
      },
      {
        id: "platforms",
        q: "Do I get both Android and iOS?",
        a: "Yes. The app is built once in Flutter and released on both the App Store and Google Play.",
      },
      {
        id: "arabic",
        q: "Can the app be in Arabic?",
        a: "Yes, and it is designed right to left from the first screen. AYCO's screens, PDF reports and printed forms were all built Arabic-first.",
      },
      {
        id: "cost",
        q: "How much does a new app cost?",
        a: "It depends on what the app has to do, so I quote after the scope is agreed. You get a price and a timeline split into milestones you can check.",
      },
      {
        id: "backend",
        q: "Do I need a back end already?",
        a: "No. I can build it on Firebase, as I did for AYCO, or connect the app to a REST or GraphQL API your team already has.",
      },
      {
        id: "ownership",
        q: "Who owns the code?",
        a: "You do. You get the full source code.",
      },
      {
        id: "after",
        q: "Can you keep working on it after launch?",
        a: "Yes, for the next fixes and features: by agreed milestones, or by the hour through Upwork or Freelancer.",
      },
    ],
    boundaries: [
      "A price before the scope is agreed. Without it, any number is a guess.",
      "A launch date before the estimate. The timeline comes with the milestones, not ahead of them.",
    ],
    related: ["existing_app"],
    message: "Hi Mohamed, I'd like to build a new app.",
  },
  {
    id: "existing_app",
    slug: "fix-existing-app",
    group: "apps",
    title: "Fix or extend an app you already have",
    headline: "Fix or extend your Flutter app",
    summary:
      "Your Flutter app crashes, won't build, or stalled when the developer left. I fix it and keep building on the code and back end you already have.",
    audience: "For teams whose app stalled, or whose developer moved on",
    body: "A codebase someone else started. I work with what is there rather than starting over.",
    includes: [
      "Bug and crash fixes",
      "Flutter and package upgrades",
      "New features on the existing back end",
    ],
    situations: [
      {
        title: "It won't build anymore",
        body: "A Flutter or package upgrade broke the build, or Xcode and Gradle now reject what used to work.",
      },
      {
        title: "It crashes, or a feature never worked",
        body: "Users hit crashes, a screen hangs, or a flow fails halfway and nobody can say why.",
      },
      {
        title: "The developer is gone",
        body: "You have the code, or part of it, and nobody left who knows how it fits together.",
      },
      {
        title: "It needs to grow",
        body: "The back end stays as it is. The app needs new features on top of it.",
      },
    ],
    scope: [
      {
        title: "Fixes",
        items: [
          "Crashes and bugs",
          "Build errors on Android and iOS",
          "Store rejections",
          "Flows that fail halfway, from sign-in to payment",
        ],
      },
      {
        title: "Upgrades",
        items: [
          "Flutter and Dart versions, null safety included",
          "Packages updated, or replaced when abandoned",
          "Builds that meet the stores' current requirements",
        ],
      },
      {
        title: "New work on the same code",
        items: [
          "New features on the existing back end",
          "Screens redesigned without rewriting the app",
          "Payments, notifications or Arabic support added",
        ],
      },
      {
        title: "Code health",
        items: ["A clearer structure, one feature at a time", "Tests around the parts that keep breaking"],
      },
    ],
    deliverables: [
      "The app working, on Android and iOS",
      "An update at every milestone, without you asking",
      "The full source code, in your hands",
      "The update published to the stores, if you want it",
    ],
    proof: [
      {
        name: "SAAD",
        target: "saad",
        note: "Rebuilt around clear feature boundaries while its routes, API paths and JSON keys stayed exactly as they were, with 78 test files behind it.",
      },
      {
        name: "Lpermis",
        target: "lpermis",
        note: "An Upwork contract for enhancements to Lpermis.",
      },
      {
        name: "Bracket Media",
        target: "experience",
        note: "Led the migration of the company's main app to null safety, and redesigned its major UI components.",
      },
      {
        name: "Cyparta",
        target: "experience",
        note: "Cut the app's size by 20%.",
      },
    ],
    reviewProjects: fixProjects,
    leadReviewIds: [
      "khamsat-bassam",
      "fiverr-nathan-above",
      "khamsat-hussain",
      "freelancer-islam-ios",
      "mostaql-mohamed",
      "fiverr-nathan-invaluable",
    ],
    faq: [
      {
        id: "other_developer",
        q: "Can you work on code another developer wrote?",
        a: `Yes, that is most of this work: ${fixReviewCount} of the ${reviews.length} client reviews on this site are for fixing or changing an app someone else started. I read the code first, then tell you what I'd fix and in what order.`,
      },
      {
        id: "missing_code",
        q: "What if I don't have all the code?",
        a: "Send what you have. I'll tell you within a day what can be fixed from it, and what would have to be rebuilt.",
      },
      {
        id: "cost",
        q: "How much does it cost?",
        a: "It depends on what's broken and how the code is built, so I quote after reading it. Send the problem and the code, and you'll have a plan and a realistic estimate within a day.",
      },
      {
        id: "rewrite",
        q: "Will you rewrite my app?",
        a: "Only if that is cheaper for you than fixing it, and I'll say so before starting. On SAAD, I restructured the whole codebase without changing a single API path.",
      },
      {
        id: "upgrade",
        q: "My app stopped building after an upgrade. Is that something you fix?",
        a: "Yes. Flutter, Dart and package upgrades are part of this service, including old apps moved to null safety, which is what I did for Bracket Media's main app.",
      },
      {
        id: "ownership",
        q: "Who owns the code afterwards?",
        a: "You do. You get the full source code, with every change in it.",
      },
      {
        id: "after",
        q: "Can you stay on after the fix?",
        a: "Yes, for the next fixes and features: by agreed milestones, or by the hour through Upwork or Freelancer.",
      },
    ],
    boundaries: [
      "A price before I've read the code. Without it, any number is a guess.",
      "A rewrite you don't need. I'll only suggest one when it costs you less than fixing what's there.",
    ],
    related: ["new_app"],
    message: "Hi Mohamed, I have an existing app that needs work.",
  },
];

export const serviceSlugs = services.map((s) => s.slug);

export function serviceById(id: ServiceId) {
  return services.find((s) => s.id === id);
}

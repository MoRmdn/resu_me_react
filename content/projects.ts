import type { Project } from "./types";

/**
 * Arcit-AI leads as the flagship (it is the only one with a screenshot).
 *
 * Three link patterns live here and the UI has to handle all three: app-store
 * pairs, a live web app with source (JS Quest), and AYCO's deliberate absence
 * of any link at all.
 */
export const projects: Project[] = [
  {
    slug: "arcit-ai",
    bundleId: "com.mormdn.arcitAI",
    title: "Arcit-AI",
    description:
      "Innovative social networking platform connecting service providers with clients in architecture and home improvement sector.",
    longDescription:
      "Arcit-AI is a comprehensive social networking platform that revolutionizes the architecture and home improvement industry. It features a smart matchmaking system powered by AI-driven tools, connecting service providers (companies, professionals, suppliers, contractors) with clients seeking architectural and home improvement services.",
    technologies: ["Flutter", "Bloc", "AI Integration", "Firebase", "Google Maps"],
    tags: ["Social Network", "AI", "Matchmaking", "Architecture"],
    country: "Saudi Arabia",
    category: "Social Networking",
    achievement: "AI-driven features with 15% user engagement increase",
    links: {
      appStore: "https://apps.apple.com/eg/app/arcit-ai/id6503910700",
      playStore: "https://play.google.com/store/apps/details?id=com.mormdn.arcitAI",
    },
    image: {
      slug: "arcit-ai",
      width: 1320,
      height: 2868,
      alt: "Arcit-AI app screen showing the service-provider matchmaking feed",
    },
  },
  {
    slug: "ayco",
    title: "AYCO — Maintenance Reports",
    description:
      "Arabic-first field-service reporting app for a medical-equipment maintenance company, built solo end to end.",
    longDescription:
      "Technicians scan a device serial, auto-fill its registry data, capture technician and client signatures, and issue a numbered Arabic (RTL) PDF report generated on-device, archived to Cloud Storage and reopened from a printed QR code. Built solo end-to-end: Flutter and Provider on the client, Firebase on the back end, offline-first writes, transactional report numbering, batch mode for up to 100 devices per visit, and role-based administration enforced server-side.",
    technologies: [
      "Flutter",
      "Provider",
      "Cloud Firestore",
      "Cloud Functions",
      "Cloud Storage",
      "RTL / Arabic",
    ],
    tags: ["Field Service", "Offline-first", "On-device PDF", "RTL"],
    country: "Private client",
    category: "Field Service",
    achievement: "Solo build — 227 Dart files, 109 test files, 5 Cloud Functions",
    links: {},
    isPrivate: true,
    highlights: [
      "Made every write offline-safe by racing Firestore writes against a timeout and surfacing the result as queued rather than failed, so technicians can complete visits without connectivity.",
      "Batched up to 100 devices per visit in resumable 25-report transaction chunks to stay within the Firestore transaction limit, with report numbering issued transactionally.",
      "Enforced a three-role permission model — super admin, admin, technician — server-side in Cloud Functions and security rules, and shipped two build flavours bound to separate development and production Firebase projects.",
      "Localised Arabic-first with full RTL: 906 strings across ar/en ARB files, with the layout, PDF and printed forms designed right-to-left.",
    ],
  },
  {
    slug: "js-quest",
    title: "JS Quest",
    description:
      "A guided JavaScript-fundamentals course: 100 questions, five unlocking chapters, and answers the browser never sees before you have earned them.",
    longDescription:
      "JS Quest walks a learner through 100 JavaScript-fundamentals questions in a fixed order, grouped into five chapters that unlock one at a time. Every answer is written to Postgres the moment it is given, so closing the tab and coming back resumes exactly where you left off. The interesting part is the security model: the correct answer and its explanation never reach the browser until after your answer is committed, so the quiz cannot be beaten by reading the network tab.",
    technologies: ["React 19", "Vite", "React Router", "Supabase", "PostgreSQL", "Vitest"],
    tags: ["Learning", "Web", "Postgres", "Row-Level Security"],
    country: "Web",
    category: "Education",
    achievement: "100 questions · 10 categories · shipped in two days",
    links: {
      website: "https://js-basics-quiz.vercel.app/dashboard",
      github: "https://github.com/MoRmdn/js-basics-quiz",
    },
    highlights: [
      "Withheld every correct answer server-side: the questions table has row-level security with no select policy, and the client reads through a security-definer function that returns the prompt and options but not the answer or explanation \u2014 those come back only after the answer row is committed.",
      "Recomputed scoring in SQL rather than trusting the client, with the 70% pass mark enforced in the database; the browser's copy is display-only.",
      "Made answer submission idempotent and replay-safe \u2014 a duplicate submission returns the existing row instead of double-counting, and out-of-order answers are rejected.",
      "Enforced integrity in the schema, not the UI: a partial unique index allows one in-progress attempt per user, and check constraints keep an attempt's score, pass flag and completion time consistent with its status.",
    ],
  },
  {
    slug: "mutabbib",
    bundleId: "com.mormdn.mutabbib",
    title: "Mutabbib",
    description:
      "Distinctive medical social network connecting users with hospitals, clinics, and doctors.",
    longDescription:
      "Mutabbib is a comprehensive healthcare mobile app that serves as a medical social network. It connects users with hospitals, clinics, and doctors, enabling easy tracking of schedules and availability. The app features real-time notifications, secure data storage compliant with healthcare standards, and seamless appointment booking.",
    technologies: ["Flutter", "Bloc", "Real-time Sync", "Healthcare APIs", "Security"],
    tags: ["Healthcare", "Social Network", "Scheduling", "Real-time"],
    country: "Libya",
    category: "Healthcare",
    achievement: "25% increase in appointment bookings",
    links: {
      appStore:
        "https://apps.apple.com/eg/app/mutabbib-%D9%85%D8%B7%D8%A8%D8%A8/id6563148338",
      playStore: "https://play.google.com/store/apps/details?id=com.mormdn.mutabbib",
    },
  },
  {
    slug: "lpermis",
    bundleId: "com.demetre.code",
    title: "Lpermis",
    description:
      "Comprehensive driving education platform with testing and appointment scheduling system.",
    longDescription:
      "Lpermis is a mobile application designed to test driving knowledge and schedule appointments at various driving schools across Morocco. The app features comprehensive test preparation, real-time appointment booking, and progress tracking for driving education.",
    technologies: ["Flutter", "GetX", "SQLite", "Payment Integration", "Real-time Booking"],
    tags: ["Education", "Booking System", "Driving Test", "Morocco"],
    country: "Morocco",
    category: "Education",
    achievement: "Built from initial architecture through to release",
    links: {
      appStore: "https://apps.apple.com/eg/app/lpermis/id1635317382",
      playStore: "https://play.google.com/store/apps/details?id=com.demetre.code",
    },
  },
  {
    slug: "lpermis-pro",
    bundleId: "com.demetre.institution",
    title: "Lpermis Pro",
    description:
      "Advanced school management system for driving schools with comprehensive administrative features.",
    longDescription:
      "Lpermis Pro is the companion system for driving schools to manage all lesson bookings with multiple user types and comprehensive administrative features. It includes instructor management, student tracking, payment processing, and detailed analytics.",
    technologies: ["Flutter", "Cubit", "Multi-user System", "Payment Integration", "Analytics"],
    tags: ["Education", "Management System", "Multi-user", "Analytics"],
    country: "Morocco",
    category: "Education",
    achievement: "Multi-role lesson booking for driving schools",
    links: {
      appStore: "https://apps.apple.com/eg/app/lpermis-pro/id6467557160",
      playStore: "https://play.google.com/store/apps/details?id=com.demetre.institution",
    },
  },
  {
    slug: "saber-yamen",
    bundleId: "com.elevenstars.saber",
    title: "Saber Yamen",
    description:
      "Multi-vendor e-commerce platform for selling new and used items with intuitive interface.",
    longDescription:
      "Saber Yamen is a comprehensive multi-vendor e-commerce platform built from scratch. It enables vendors to sell both new and used items through an easy-to-use interface. The platform features advanced search capabilities, secure payment processing, and comprehensive vendor management tools.",
    technologies: ["Flutter", "GetX", "E-commerce APIs", "Payment Gateway", "Multi-vendor"],
    tags: ["E-commerce", "Multi-vendor", "Marketplace", "Payment"],
    country: "Türkiye",
    category: "E-commerce",
    achievement: "20% faster data load through optimised state management",
    links: {
      appStore: "https://apps.apple.com/gb/app/saber/id6467415590",
      playStore: "https://play.google.com/store/apps/details?id=com.elevenstars.saber",
    },
  },
];

export const flagshipProject = projects[0];

/**
 * The artboard renders Projects in three registers, and the split is by kind,
 * not by array position: one flagship panel, the expandable rows, then the
 * private plane last. Deriving them here keeps the ordering out of the
 * component.
 */
export const projectRows = projects.filter(
  (p) => p !== flagshipProject && !p.isPrivate,
);
export const privateProjects = projects.filter((p) => p.isPrivate);

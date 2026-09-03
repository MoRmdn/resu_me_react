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
    media: {
      icon: { file: "arcit-ai-icon" },
      plate: "device",
      asset: {
        file: "arcit-ai-shot",
        width: 800,
        height: 1738,
        alt: "Arcit-AI app screen showing the service-provider matchmaking feed",
        bezel: true,
      },
      social: [
        { file: "arcit-ai-social-1", width: 800, height: 800, alt: "Arcit-AI social post — request feed" },
        { file: "arcit-ai-social-2", width: 800, height: 800, alt: "Arcit-AI social post — five app screens with store badges" },
      ],
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
    flagship: true,
    media: {
      icon: { file: "ayco-icon" },
      plate: "device",
      asset: {
        file: "ayco-shot",
        width: 1170,
        height: 2532,
        alt: "AYCO maintenance-reports home screen, in Arabic",
        bezel: true,
      },
    },
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
    media: {
      icon: { file: "mutabbib-icon" },
      plate: "promo",
      asset: {
        file: "mutabbib-promo",
        width: 1200,
        height: 2601,
        alt: "Mutabbib store promo — hospital directory screen with an Arabic headline",
      },
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
    media: {
      icon: { file: "lpermis-icon" },
      plate: "promo",
      asset: {
        file: "lpermis-promo",
        width: 1200,
        height: 2601,
        alt: "Lpermis store promo — booking screen with an Arabic headline",
      },
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
    media: {
      icon: { file: "lpermis-pro-icon" },
      plate: "promo",
      asset: {
        file: "lpermis-pro-promo",
        width: 1200,
        height: 2601,
        alt: "Lpermis Pro store promo — instructor session list with an Arabic headline",
      },
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
    media: {
      icon: { file: "saber-yamen-icon" },
      plate: "field",
      asset: {
        file: "saber-yamen-shot",
        width: 288,
        height: 512,
        alt: "Saber Yamen launch screen",
      },
    },
  },
  {
    slug: "mismar",
    title: "MisMar | مسمار",
    description:
      "Car maintenance and repair for Egyptian drivers: book a service, follow the vehicle through inspection and repair, and get it delivered back.",
    longDescription:
      "MisMar takes a car through a seven-stage service flow — request, collection, inspection and diagnosis, quote and approval, repair, quality check, delivery — with the owner tracking each stage from their phone. Services split into mobile maintenance, faults and repairs, accident work, car care, service packages and inspections, and the whole product is Arabic-first with a right-to-left layout.",
    technologies: ["Flutter", "Provider", "Riverpod", "Bloc", "REST", "GraphQL"],
    tags: ["Automotive", "Booking", "Arabic", "RTL"],
    country: "Egypt",
    category: "Automotive service",
    achievement: "Current role — production codebase, iOS and Android",
    links: {},
    linkStatus: "Store links to follow",
    media: {
      icon: { file: "mismar-icon" },
      plate: "device",
      asset: {
        file: "mismar-shot",
        width: 1200,
        height: 2182,
        alt: "MisMar home screen showing the vehicle-service categories and the seven-stage repair flow",
        // The supplied mockup already carries its own device frame.
        bezel: false,
      },
    },
  },
  {
    slug: "dental-dinar",
    title: "Dental Dinar",
    description:
      "Arabic-first oral-health companion: a personal care plan, daily brushing reminders, and points for keeping to them.",
    longDescription:
      "Dental Dinar turns a dental care plan into a daily habit loop. Patients get a personalised plan, daily tips, and timed brushing reminders that award points for each completed session, alongside a product area and their own profile. Built Arabic-first with a right-to-left layout throughout, including the reminder scheduling and the rewards screens.",
    technologies: ["Flutter", "Cubit", "Real-time scheduling", "Payment Integration", "RTL / Arabic"],
    tags: ["Healthcare", "Habit tracking", "Scheduling", "RTL"],
    country: "Türkiye",
    category: "Healthcare",
    achievement: "Built at Eleven Stars on Cubit",
    links: {},
    linkStatus: "Store links to follow",
    media: {
      icon: { file: "dental-dinar-icon" },
      plate: "promo",
      asset: {
        file: "dental-dinar-promo",
        width: 1042,
        height: 2134,
        alt: "Dental Dinar store promo — sign-in screen with an Arabic headline",
      },
    },
  },
  {
    slug: "freedoc",
    title: "FreeDoc",
    description:
      "Doctor and patient booking for Algeria, in Arabic, French and English.",
    longDescription:
      "FreeDoc splits at the door: you enter as a doctor or as a patient, and the app builds a different product around each. Patients browse doctor profiles with biography, specialism, address and live availability, book an appointment, and get a push notification when a doctor confirms or cancels. The whole interface ships in Arabic, French and English, switchable at runtime.",
    technologies: ["Flutter", "REST", "Push notifications", "Google Maps", "Localisation (AR/FR/EN)"],
    tags: ["Healthcare", "Booking", "Multi-role", "Localisation"],
    country: "Algeria",
    category: "Healthcare",
    achievement: "Trilingual — Arabic, French and English",
    links: {},
    linkStatus: "Store links to follow",
    media: {
      icon: { file: "freedoc-icon" },
      plate: "device",
      asset: {
        file: "freedoc-shot",
        width: 1080,
        height: 2280,
        alt: "FreeDoc language settings offering Arabic, French and English",
        bezel: true,
      },
    },
  },
  {
    slug: "opermis",
    title: "O'Permis",
    description:
      "Driving-licence booking for Morocco: find a school, reserve a session, and track the paperwork.",
    longDescription:
      "O'Permis connects learner drivers with Moroccan driving schools. Learners browse schools, see session times and prices in dirhams, reserve a slot, and track the documents their licence application needs — national ID copy, photographs — as a checklist. Arabic-first with a right-to-left layout.",
    technologies: ["Flutter", "Booking system", "Payment Integration", "RTL / Arabic"],
    tags: ["Education", "Booking", "Morocco", "RTL"],
    country: "Morocco",
    category: "Education",
    achievement: "Driving-school booking with document tracking",
    links: {},
    linkStatus: "Store links to follow",
    media: {
      icon: { file: "opermis-icon" },
      plate: "promo",
      asset: {
        file: "opermis-promo",
        width: 288,
        height: 512,
        alt: "O'Permis store promo — session booking screen with an Arabic headline",
      },
    },
  },
];

/**
 * Display order, set deliberately rather than by array position.
 *
 * AYCO leads: it is the solo end-to-end build, and putting the private project
 * first says more about capability than the client app with the biggest logo.
 * The rest run newest-and-strongest first, with JS Quest last because it is the
 * web outlier rather than the mobile work the page is about.
 */
const ORDER = [
  "ayco",
  "mismar",
  "lpermis",
  "lpermis-pro",
  "mutabbib",
  "arcit-ai",
  "saber-yamen",
  "dental-dinar",
  "freedoc",
  "opermis",
  "js-quest",
] as const;

export const orderedProjects = ORDER.map((slug) => {
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`ORDER names a project that does not exist: ${slug}`);
  return project;
});

/** The one that leads in the big panel. */
export const flagshipProject =
  orderedProjects.find((p) => p.flagship) ?? orderedProjects[0];

/** Everything else, as expandable rows, in ORDER. */
export const projectRows = orderedProjects.filter((p) => p !== flagshipProject);

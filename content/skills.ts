import type { SkillGroup } from "./types";

/**
 * Six groups — the Skills section is composed as six numbered plates (01-06)
 * staggered on a 7/5 split, so new capabilities fold into an existing group
 * rather than adding a seventh.
 *
 * Extended from the CV's TECHNICAL SKILLS section: the Firebase
 * back-end surface, offline-first sync, on-device PDF, barcode/QR, RTL
 * localisation and feature-first architecture were all missing.
 *
 * "Moyasar" was previously misspelled "Moyaser". September 2026 added the
 * front-end and Supabase capabilities, all exercised in JS Quest.
 */
export const skillGroups: SkillGroup[] = [
  {
    label: "Languages & frameworks",
    items: ["Dart", "Flutter", "JavaScript", "React", "Next.js", "Python", "HTML", "CSS"],
    highlighted: true,
  },
  {
    label: "State management",
    items: ["Bloc", "Cubit", "GetX", "Provider", "Riverpod"],
  },
  {
    label: "Mobile & integrations",
    items: [
      "Android + iOS cross-platform",
      "Offline-first synchronisation",
      "On-device PDF generation",
      "Barcode & QR scanning",
      "Localisation & RTL (Arabic)",
      "Google ML Kit",
      "Google Maps",
      "Socket.IO",
      "Pusher",
    ],
  },
  {
    label: "Back end & cloud",
    items: [
      "Firebase Auth",
      "Cloud Firestore",
      "Cloud Storage",
      "Cloud Functions",
      "Remote Config",
      "Crashlytics",
      "Analytics",
      "Supabase",
      "PostgreSQL",
      "Row-Level Security",
      "REST",
      "GraphQL",
      "SQLite",
      "Hive",
    ],
  },
  {
    label: "Payments",
    items: ["Stripe", "PayPal", "Moyasar", "Fawry", "FlutterWave", "PayU", "PayStack"],
  },
  {
    label: "Architecture, process & testing",
    items: [
      "Clean Architecture",
      "Feature-first architecture",
      "SOLID",
      "OOP",
      "Firestore Security Rules",
      "Responsive design",
      "Agile SDLC",
      "GitFlow",
      "Unit testing",
      "Widget testing",
      "Vite",
      "Vitest",
      "React Testing Library",
    ],
  },
];

/** The marquee strip — short names only, and deliberately not the full skill list. */
export const marqueeItems = [
  "Dart",
  "Flutter",
  "Bloc",
  "GetX",
  "Riverpod",
  "Firebase",
  "GraphQL",
  "ML Kit",
  "Clean Architecture",
  "Cloud Functions",
  "Stripe",
  "Hive",
];

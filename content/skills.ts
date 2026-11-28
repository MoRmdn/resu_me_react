import type { SkillGroup } from "./types";

/**
 * Six groups — the Skills section is composed as six staggered plates, so new
 * capabilities fold into an existing group rather than adding a seventh.
 *
 * Extended from the CV's TECHNICAL SKILLS section: the Firebase
 * back-end surface, offline-first sync, on-device PDF, barcode/QR, RTL
 * localisation and feature-first architecture were all missing.
 *
 * "Moyasar" was previously misspelled "Moyaser". September 2026 added the
 * front-end and Supabase capabilities, all exercised in JS Quest.
 */
/** The depth: the only filled chips in the Skills plates. */
export const coreSkills = ["Dart", "Flutter"];

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

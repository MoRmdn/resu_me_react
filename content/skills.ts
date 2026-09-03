import type { SkillGroup } from "./types";

/**
 * Six groups, extended from the CV's TECHNICAL SKILLS section: the Firebase
 * back-end surface, offline-first sync, on-device PDF, barcode/QR, RTL
 * localisation and feature-first architecture were all missing.
 *
 * "Moyasar" was previously misspelled "Moyaser".
 */
export const skillGroups: SkillGroup[] = [
  {
    label: "Languages & frameworks",
    items: ["Dart", "Flutter", "Python", "HTML", "CSS"],
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

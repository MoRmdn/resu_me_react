import type { Experience } from "./types";

/**
 * CV order (MisMar, Demeter, Ebdda, Arcit-AI, Eleven Stars, then earlier roles).
 *
 * Two corrections against the Flutter original:
 *   - Ebdda LTD ran to January 2026 and is no longer current; it was flagged
 *     isCurrent with an open "Present" end date.
 *   - MisMar bullets pick up REST/GraphQL, Adobe XD, testing and Git practice
 *     from the CV.
 */
export const experiences: Experience[] = [
  {
    slug: "mismar",
    company: "MisMar | مسمار",
    position: "Flutter Developer",
    location: "Egypt",
    country: "Egypt",
    startDate: "January 2025",
    endDate: "Present",
    start: "2025-01",
    end: null,
    isCurrent: true,
    description:
      "Develop and maintain cross-platform iOS and Android applications in Flutter, with responsibility for performance, scalability, and maintainability of the production codebase.",
    achievements: [
      "Implement state management across Provider, Riverpod, and Bloc according to the complexity and data flow of each feature.",
      "Connect applications to back-end services through RESTful APIs and GraphQL.",
      "Integrate Google ML Kit and AI-driven features into production mobile applications.",
      "Translate Figma and Adobe XD designs into responsive interfaces across phone and tablet form factors.",
      "Write unit and widget tests, and manage source control in Git using branch strategies and pull-request review.",
    ],
    technologies: ["Flutter", "Provider", "Riverpod", "Bloc", "Google ML Kit", "GraphQL"],
  },
  {
    slug: "demeter",
    company: "Demeter",
    position: "Medior Flutter Developer",
    location: "Morocco (Remote)",
    country: "Morocco",
    startDate: "March 2023",
    endDate: "January 2025",
    start: "2023-03",
    end: "2025-01",
    isCurrent: false,
    engagement: "Remote, full-time",
    description:
      "Led the development of Lpermis from initial architecture to release, using GetX for state management across a driving-theory testing and appointment-booking product.",
    achievements: [
      "Built Lpermis Pro on Cubit, handling multi-role lesson booking and the associated business logic for driving schools managing bookings across several user types.",
      "Integrated external APIs for real-time tracking, user authentication, and payment processing.",
      "Worked with designers to deliver a consistent experience across mobile and tablet devices.",
    ],
    technologies: ["Flutter", "GetX", "Cubit", "API Integration", "Payment Systems"],
  },
  {
    slug: "ebdda",
    company: "Ebdda LTD",
    position: "Medior Flutter Developer",
    location: "Libya (Remote)",
    country: "Libya",
    startDate: "January 2024",
    endDate: "January 2026",
    start: "2024-01",
    end: "2026-01",
    isCurrent: false,
    engagement: "Remote, part-time",
    description:
      "Developed Mutabbib, a healthcare application, using Bloc to manage complex user flows, real-time data synchronisation, and secure storage aligned to healthcare data requirements.",
    achievements: [
      "Built real-time notification and scheduling features for patient-provider interaction, reported to have increased appointment bookings by 25 percent.",
      "Coordinated with back-end developers on API integration to meet performance and security requirements.",
    ],
    technologies: ["Flutter", "Bloc", "Real-time Sync", "Healthcare APIs", "Security"],
  },
  {
    slug: "arcit-ai",
    company: "Arcit-AI",
    position: "Medior Flutter Developer",
    location: "Saudi Arabia (Remote)",
    country: "Saudi Arabia",
    startDate: "December 2023",
    endDate: "December 2024",
    start: "2023-12",
    end: "2024-12",
    isCurrent: false,
    engagement: "Remote, part-time",
    description:
      "Developed the Arcit-AI application on Bloc, implementing AI-driven predictive analytics and data-visualisation features supporting user decision-making.",
    achievements: [
      "Worked with data science and back-end teams on AI model integration and real-time data delivery.",
      "Designed and optimised the data-interaction interface, reported to have improved user retention and engagement by 15 percent.",
    ],
    technologies: [
      "Flutter",
      "Bloc",
      "AI Integration",
      "Data Visualization",
      "Predictive Analytics",
    ],
  },
  {
    slug: "eleven-stars",
    company: "Eleven Stars",
    position: "Medior Flutter Developer",
    location: "Türkiye (Remote)",
    country: "Türkiye",
    startDate: "March 2023",
    endDate: "February 2024",
    start: "2023-03",
    end: "2024-02",
    isCurrent: false,
    engagement: "Remote, part-time",
    description:
      "Built Saber Yamen, a multi-vendor e-commerce platform, from scratch on GetX, covering navigation and data flow across the full purchase journey.",
    achievements: [
      "Developed Dental Diner on Cubit, covering real-time appointment scheduling, patient data synchronisation, and payment integration.",
      "Optimised state management to reduce data load times by 20 percent for both client and administrator users.",
    ],
    technologies: ["Flutter", "GetX", "Cubit", "E-commerce", "Payment Integration"],
  },
  {
    slug: "bracket-media",
    company: "Bracket Media Ltd",
    position: "Junior Flutter Developer",
    location: "England (Remote)",
    country: "England",
    startDate: "May 2022",
    endDate: "January 2023",
    start: "2022-05",
    end: "2023-01",
    isCurrent: false,
    engagement: "Remote",
    description:
      "Led the migration of the company's primary application to Null Safety, and redesigned major UI components, reported to have increased user satisfaction and engagement by 15 percent.",
    achievements: [
      "Future-proofed a legacy codebase by completing the Null Safety migration ahead of it becoming an emergency.",
      "Redesigned major UI components and shipped new features alongside comprehensive bug fixes.",
    ],
    technologies: ["Flutter", "Null Safety", "UI/UX Design", "Performance Optimization"],
  },
  {
    slug: "cyparta",
    company: "Cyparta",
    position: "Junior Flutter Developer",
    location: "Egypt",
    country: "Egypt",
    startDate: "April 2021",
    endDate: "May 2022",
    start: "2021-04",
    end: "2022-05",
    isCurrent: false,
    description:
      "Delivered a multi-platform application with integrated analytics, reported to have improved user retention by 12 percent.",
    achievements: [
      "Reduced application size by 10 percent by removing unused packages and optimising assets.",
      "Extended the interface to full-screen tablet layouts for iPad compatibility.",
    ],
    technologies: ["Flutter", "Analytics", "Performance Optimization", "Cross-platform"],
  },
];

/** Roles before the "medior" run — some layouts fold these into a quieter group. */
export const earlierExperienceSlugs = ["bracket-media", "cyparta"];

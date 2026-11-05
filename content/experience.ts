import type { Experience } from "./types";

/**
 * CV order (MisMar, Demeter, Ebdda, Arcit-AI, Eleven Stars, then earlier roles).
 *
 * Two corrections against the Flutter original:
 *   - Ebdda LTD ran to January 2026 and is no longer current; it was flagged
 *     isCurrent with an open "Present" end date.
 *
 * The MisMar entry describes NAAS, the B2B web platform that is the actual
 * day-to-day work there. The driver app was a short stint and gets one clause.
 */
export const experiences: Experience[] = [
  {
    slug: "mismar",
    company: "MisMar | مسمار",
    position: "Flutter Developer",
    location: "Saudi Arabia (Remote)",
    country: "Saudi Arabia",
    startDate: "January 2025",
    endDate: "Present",
    start: "2025-01",
    end: null,
    isCurrent: true,
    engagement: "Remote, contract, full-time",
    description:
      "Core contributor to NAAS, MisMar's B2B Flutter Web platform for fleet repair and car insurance claims, which connects insurers, fleet owners, workshops and parts vendors in one workflow. Earlier, a short stint on the MisMar driver app for iOS and Android.",
    achievements: [
      "Build features for a production Flutter Web app used by insurance companies, corporate fleets, workshops and parts vendors.",
      "Build the claims, quotations, orders, invoices and salvage-order modules on Clean Architecture, with separate data, domain and presentation layers.",
      "Implement role-based access across 20+ user roles, from company, workshop and vendor accounts to admins, branch managers and read-only viewers.",
      "Deliver Arabic and English throughout, including right-to-left layouts.",
      "Ship configurable workflows, Firebase push notifications, in-app chat and reminders, covered by unit and widget tests.",
    ],
    technologies: ["Flutter Web", "Provider", "GetIt", "GoRouter", "Dio", "Firebase"],
  },
  {
    slug: "demeter",
    company: "Demeter",
    position: "Mid-Level Flutter Developer",
    location: "Morocco (Remote)",
    country: "Morocco",
    startDate: "March 2023",
    endDate: "January 2025",
    start: "2023-03",
    end: "2025-01",
    isCurrent: false,
    engagement: "Remote, contract, full-time",
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
    position: "Mid-Level Flutter Developer",
    location: "Libya (Remote)",
    country: "Libya",
    startDate: "January 2024",
    endDate: "January 2026",
    start: "2024-01",
    end: "2026-01",
    isCurrent: false,
    engagement: "Remote, contract, part-time (concurrent)",
    description:
      "Developed Mutabbib, a healthcare application, using Bloc to manage complex user flows, real-time data synchronisation, and secure storage aligned to healthcare data requirements.",
    achievements: [
      "Built real-time notification and scheduling features for patient-provider interaction, increasing appointment bookings by 25%.",
      "Coordinated with back-end developers on API integration to meet performance and security requirements.",
    ],
    technologies: ["Flutter", "Bloc", "Real-time Sync", "Healthcare APIs", "Security"],
  },
  {
    slug: "arcit-ai",
    company: "Arcit-AI",
    position: "Mid-Level Flutter Developer",
    location: "Saudi Arabia (Remote)",
    country: "Saudi Arabia",
    startDate: "December 2023",
    endDate: "December 2024",
    start: "2023-12",
    end: "2024-12",
    isCurrent: false,
    engagement: "Remote, part-time (concurrent)",
    description:
      "Developed the Arcit-AI application on Bloc: a social networking platform matching service providers with clients in the architecture and home-improvement sector, with AI-driven tools for matchmaking and task automation.",
    achievements: [
      "Worked with data science and back-end teams on AI model integration and real-time data delivery.",
      "Designed and optimised the data-interaction interface, improving user retention and engagement by 15%.",
    ],
    technologies: ["Flutter", "Bloc", "AI Integration", "Matchmaking", "Firebase"],
  },
  {
    slug: "eleven-stars",
    company: "Eleven Stars",
    position: "Mid-Level Flutter Developer",
    location: "Türkiye (Remote)",
    country: "Türkiye",
    startDate: "March 2023",
    endDate: "February 2024",
    start: "2023-03",
    end: "2024-02",
    isCurrent: false,
    engagement: "Remote, part-time (concurrent)",
    description:
      "Built Saber Yamen, a multi-vendor e-commerce platform, from scratch on GetX, covering navigation and data flow across the full purchase journey.",
    achievements: [
      "Developed Dental Dinar on Cubit, covering real-time appointment scheduling, patient data synchronisation, and payment integration.",
      "Optimised state management to reduce data load times by 20% for both client and administrator users.",
    ],
    technologies: ["Flutter", "GetX", "Cubit", "E-commerce", "Payment Integration"],
  },
  {
    slug: "bracket-media",
    company: "Bracket Media Ltd",
    position: "Junior Flutter Developer",
    location: "United Kingdom (Remote)",
    country: "United Kingdom",
    startDate: "May 2022",
    endDate: "January 2023",
    start: "2022-05",
    end: "2023-01",
    isCurrent: false,
    engagement: "Remote",
    description:
      "Led the migration of the company's primary application to Null Safety, and redesigned major UI components, increasing user satisfaction and engagement by 15%.",
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
    engagement: "Full-time",
    description:
      "Delivered a multi-platform application with integrated analytics, improving user retention by 12%.",
    achievements: [
      "Reduced application size by 20% by removing unused packages and optimising assets.",
      "Extended the interface to full-screen tablet layouts for iPad compatibility.",
    ],
    technologies: ["Flutter", "Analytics", "Performance Optimization", "Cross-platform"],
  },
];

/** Roles before the mid-level run — some layouts fold these into a quieter group. */
export const earlierExperienceSlugs = ["bracket-media", "cyparta"];

/** Identity, contact details, links and the headline numbers. */

export const site = {
  name: "Mohamed Ramadan",
  shortName: "MoRmdn",
  title: "Flutter Developer",
  subtitle: "Cross-Platform Mobile Applications",
  location: "Mansoura, Egypt",
  timezone: "UTC+3",
  url: "https://m0rmdn.web.app",
  description:
    "Mohamed Ramadan — Flutter developer in Mansoura, Egypt. Five years building cross-platform mobile apps for teams in six countries. Bloc, GetX, Cubit, Firebase, clean architecture.",
  designCodename: "Obsidian & Copper",
  designVersion: "v2.0",
} as const;

export const contact = {
  email: "mormdn@outlook.com",
  phone: "+201281100168",
  phoneDisplay: "+20 128 110 0168",
  emailUrl: "mailto:mormdn@outlook.com",
  phoneUrl: "tel:+201281100168",
  resumeUrl: "/Mohamed_Ramadan_CV.pdf",
} as const;

/**
 * Ways to actually hire him, in his stated priority order. The first is
 * `primary` and takes the Contact viewport's single Tier 1 copper fill.
 *
 * These double as the `sameAs` set in the structured data, which is how a
 * search engine folds eight scattered marketplace profiles into one entity.
 */
export const channels = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    handle: contact.phoneDisplay,
    url: "https://wa.me/201281100168",
    note: "Fastest reply",
    primary: true,
  },
  {
    id: "upwork",
    label: "Upwork",
    handle: "mormdn",
    url: "https://www.upwork.com/freelancers/mormdn",
    note: "Contract work, escrowed",
  },
  {
    id: "email",
    label: "Email",
    handle: contact.email,
    url: contact.emailUrl,
    note: "Full-time and long briefs",
    copyable: true,
  },
  {
    id: "freelancer",
    label: "Freelancer",
    handle: "MoRmdn",
    url: "https://www.freelancer.com/u/MoRmdn",
    note: "Project bids",
  },
  {
    id: "fiverr",
    label: "Fiverr",
    handle: "mormdn",
    url: "https://www.fiverr.com/mormdn",
    note: "Fixed-scope packages",
  },
  {
    id: "khamsat",
    label: "Khamsat",
    handle: "m0rmdn",
    url: "https://khamsat.com/user/m0rmdn",
    note: "Arabic-language clients",
  },
] as const;

/** Profiles rather than hiring channels — kept out of the Contact grid. */
export const socials = [
  { label: "GitHub", handle: "MoRmdn", url: "https://github.com/MoRmdn" },
  { label: "LinkedIn", handle: "Eng. M.Ramadan", url: "https://linkedin.com/in/mormdn" },
] as const;

/**
 * The Android publisher namespace. Only the apps he published himself carry it
 * — the earlier ones use identifiers the client chose, and their Play Store
 * links are on this same page, so the distinction has to stay honest.
 */
export const publisherNamespace = "com.mormdn";

/**
 * Hero metrics. Confirmed 2026-09: the apps figure counts unlisted and
 * client-account releases as well as the five publicly listed titles.
 */
export const metrics = {
  yearsExperience: 5,
  appsLiveOnBothStores: 10,
  teams: 7,
  countries: 6,
} as const;

export const navSections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

export const education = [
  "B.Sc. Bioinformatics — Mansoura University, 2021 (final-year project graded A+)",
  "Google Flutter Developer Certification — Udemy, 2022",
  "Learn JavaScript · Learn React — Scrimba, 2026",
  "Android Basics Nanodegree — Udacity, 2020",
  "Arabic (native) · English (professional working proficiency)",
] as const;

/**
 * In progress, and labelled as such — never listed beside the completed
 * certifications above.
 */
export const learningNow = {
  period: "September 2026",
  completed: [
    { title: "Learn JavaScript", provider: "Scrimba" },
    { title: "Learn React", provider: "Scrimba" },
  ],
  inProgress: [{ title: "Next.js fundamentals", provider: "in progress" }],
  built: {
    label: "Built with it",
    title: "JS Quest",
    note: "100-question JavaScript course, live",
    href: "https://js-basics-quiz.vercel.app/dashboard",
  },
} as const;

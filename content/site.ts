/** Identity, contact details, links and the headline numbers. */

export const site = {
  name: "Mohamed Ramadan",
  shortName: "MoRmdn",
  title: "Software Engineer",
  subtitle: "Cross-Platform Mobile and Web Applications",
  location: "Mansoura, Egypt",
  timezone: "UTC+3",
  url: "https://mormdn.com",
  // Written for the client who has never heard the name: what is built and
  // for whom, with the brand word beside the name. No framework list.
  description:
    "Mohamed Ramadan (MoRmdn) builds Arabic-first mobile apps, dashboards and internal systems for businesses: five years of cross-platform work in Flutter, from the first scope to the App Store and Google Play.",
  /** How the brand is spelled across the profiles, for `alternateName`. */
  alternateNames: ["MoRmdn", "mormdn", "محمد رمضان"],
  designCodename: "Obsidian & Copper",
  designVersion: "v2.1",

  /**
   * When the page's content last actually changed. Feeds both the sitemap's
   * `lastmod` and the `dateModified` in the structured data, which is the whole
   * reason it lives here rather than in either file.
   *
   * Deliberately a constant, not `new Date()`. Generating it at build time
   * stamps "just now" on every deploy, including ones that only touch config —
   * and a lastmod that always says today is a lastmod Google learns to ignore.
   * Bump this when the content genuinely changes.
   */
  contentLastChanged: "2026-11-28",
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
    note: "Long briefs and documents",
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

/**
 * Profiles rather than hiring channels — kept out of the Contact grid, but they
 * matter more than their placement suggests: these are the pages that already
 * rank for "mormdn", and every one of them is a `sameAs` entry telling a search
 * engine that they and this site are the same person.
 */
export const socials = [
  { label: "GitHub", handle: "MoRmdn", url: "https://github.com/MoRmdn" },
  { label: "LinkedIn", handle: "Eng. M.Ramadan", url: "https://linkedin.com/in/mormdn" },
  { label: "X", handle: "@MoRmdn", url: "https://x.com/MoRmdn" },
] as const;

/**
 * The Android publisher namespace. Only the apps he published himself carry it
 * — the earlier ones use identifiers the client chose, and their Play Store
 * links are on this same page, so the distinction has to stay honest.
 */
export const publisherNamespace = "com.mormdn";

/**
 * Career metrics. The selected-project count is derived from projects.ts.
 */
export const metrics = {
  yearsExperience: 5,
  teams: 7,
  countries: 6,
} as const;

/**
 * The homepage's sections, in the order a client reads them: the offer, the
 * proof (work, then reviews), who does the work, and how to get in touch.
 *
 * This array is the one source of that order. `PortfolioPage` renders the
 * sections from it, the nav island, sheet and rail list it, and each section's
 * Ledger number comes from `sectionNumber`. To move a section, move its line.
 */
export const navSections = [
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "reviews", label: "Reviews" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof navSections)[number]["id"];

/** A section's Ledger number, 1-based: its place in `navSections`. */
export const sectionNumber = (id: SectionId) => navSections.findIndex((s) => s.id === id) + 1;

export const education = [
  "B.Sc. Computer Science, major in Bioinformatics — Mansoura University, 2021 (final-year project graded A+)",
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

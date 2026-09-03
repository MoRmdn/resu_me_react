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

export const socials = [
  { label: "LinkedIn", handle: "Eng. M.Ramadan", url: "https://linkedin.com/in/mormdn" },
  { label: "GitHub", handle: "MoRmdn", url: "https://github.com/MoRmdn" },
  { label: "Khamsat", handle: "M0Rmdn", url: "https://khamsat.com/user/m0rmdn" },
] as const;

/**
 * Hero metrics.
 *
 * REVIEW: `appsLiveOnBothStores` (10) is larger than the five publicly listed
 * apps the CV names. It presumably counts white-label and unlisted work — but
 * it is the one unverifiable number on an otherwise precise page. Lower it to 5
 * if it cannot be substantiated.
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
  "Android Basics Nanodegree — Udacity, 2020",
  "Arabic (native) · English (professional working proficiency)",
] as const;

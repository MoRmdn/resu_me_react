/**
 * Content model for the portfolio.
 *
 * Every word and number the site renders lives under content/ — never inline in
 * a component. Ported from lib/data/portfolio_data.dart and
 * lib/utils/constants.dart of the Flutter original, reconciled against
 * Mohamed_Ramadan_CV_EN.pdf.
 */

export type Project = {
  slug: string;
  title: string;
  /** One-line summary used on cards. */
  description: string;
  /** Full paragraph used in the expanded / flagship treatment. */
  longDescription: string;
  technologies: string[];
  tags: string[];
  /** Display country, uppercased by the UI. */
  country: string;
  category: string;
  /** The outcome line — a number wherever one is defensible. */
  achievement: string;
  links: { appStore?: string; playStore?: string; github?: string; website?: string };
  /** Slug under public/images/ with generated AVIF/WebP variants, if any. */
  image?: { slug: string; width: number; height: number; alt: string };
  /** Private client delivery: no public listing, gets its own card treatment. */
  isPrivate?: boolean;
  /** Extra detail bullets, shown only where the layout has room. */
  highlights?: string[];
};

export type Experience = {
  slug: string;
  company: string;
  position: string;
  location: string;
  country: string;
  /** Free-form display strings, e.g. "January 2025". */
  startDate: string;
  endDate: string;
  /** ISO YYYY-MM, for sorting and <time> elements. */
  start: string;
  end: string | null;
  isCurrent: boolean;
  engagement?: string;
  description: string;
  achievements: string[];
  technologies: string[];
};

export type SkillGroup = {
  label: string;
  items: string[];
  /** At most one group may be highlighted — one copper accent per viewport. */
  highlighted?: boolean;
};

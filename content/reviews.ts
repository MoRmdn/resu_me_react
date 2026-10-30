/**
 * Client reviews, copied word for word from the marketplace profiles,
 * typos included. Editing a quote would make it a quote nobody wrote.
 *
 * Arabic reviews keep the original and carry an English `translation`, which
 * the card labels as one. Khamsat is limited to the programming services: the
 * CV and D-U-N-S orders on that profile say nothing about mobile work.
 *
 * Quotes that appear word for word on two platforms are used once.
 *
 * The types live here rather than in types.ts so that this file and
 * reviews.json can travel together — see scripts/export-review-cards.mjs.
 */
import data from "./reviews.json";

export type PlatformId = "upwork" | "fiverr" | "freelancer" | "mostaql" | "khamsat";

export type Review = {
  id: string;
  platform: PlatformId;
  /** As the platform displays it. Upwork shows no client name. */
  author: string;
  country?: string;
  /** The job or service, in English. */
  project: string;
  /** Display string. Exact where the platform gives a date, otherwise a year. */
  date: string;
  /** The platform marks this client as an ongoing collaboration. */
  repeat?: boolean;
  lang: "en" | "ar";
  /** Verbatim. Line breaks are the client's own. */
  quote: string;
  /** Present on every Arabic review. */
  translation?: string;
};

export type ReviewPlatform = {
  id: PlatformId;
  label: string;
  url: string;
  /** Reviews counted on the profile. Khamsat counts programming services only. */
  count: number;
  countLabel: string;
};

export const reviews = data as Review[];

export const reviewPlatforms: ReviewPlatform[] = [
  {
    id: "upwork",
    label: "Upwork",
    url: "https://www.upwork.com/freelancers/~010d028f2b8e318fec",
    count: 6,
    countLabel: "completed jobs",
  },
  {
    id: "fiverr",
    label: "Fiverr",
    url: "https://www.fiverr.com/mormdn",
    count: 26,
    countLabel: "reviews",
  },
  {
    id: "freelancer",
    label: "Freelancer",
    url: "https://www.freelancer.com/u/MoRmdn",
    count: 9,
    countLabel: "reviews",
  },
  {
    id: "mostaql",
    label: "Mostaql",
    url: "https://mostaql.com/u/MoRmdn/reviews",
    count: 4,
    countLabel: "reviews",
  },
  {
    id: "khamsat",
    label: "Khamsat",
    url: "https://khamsat.com/user/m0rmdn/reviews",
    count: 88,
    countLabel: "tech reviews",
  },
];

export const reviewTotal = reviewPlatforms.reduce((sum, p) => sum + p.count, 0);

export function platformOf(review: Review) {
  return reviewPlatforms.find((p) => p.id === review.platform)!;
}

export const reviewCardCopy = {
  ratingLabel: "Rated 5 out of 5",
  ratingValue: "5.0",
  translatedLabel: "Translated from Arabic",
  repeatLabel: "Repeat client",
  sourceLabel: "on",
};

import type { Metadata } from "next";
import { getCaseStudy } from "@/content/case-studies-i18n";
import type { Locale } from "@/content/locale";
import { getService } from "@/content/services-i18n";
import { caseStudyPath, servicePath } from "@/lib/paths";
import { subpageMetadata } from "@/lib/seo";

/**
 * The outcome, the same words as the H1. A project name means nothing to
 * someone who has not heard of it, and a private client's codename least of all.
 */
export function caseStudyMetadata(slug: string, locale: Locale): Metadata {
  const study = getCaseStudy(slug, locale);
  return subpageMetadata({
    locale,
    path: caseStudyPath(slug),
    title: study.headline,
    description: study.summary,
  });
}

/** The headline, which carries the phrase people search for. */
export function serviceMetadata(slug: string, locale: Locale): Metadata {
  const service = getService(slug, locale);
  return subpageMetadata({
    locale,
    path: servicePath(slug),
    title: service.headline,
    description: service.summary,
  });
}

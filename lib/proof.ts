import { hasCaseStudy } from "@/content/case-studies";
import type { Locale } from "@/content/locale";
import { caseStudyPath, homePath, localePath } from "@/lib/paths";

/**
 * Where a piece of evidence lives: its case study when it has one, otherwise
 * its anchor on the homepage (a project panel, or the Experience section for
 * a role).
 *
 * On the homepage itself the anchor stays a bare `#target`: `/#target` would
 * drop a query string such as `?utm_source=upwork` and reload the page.
 */
export function proofHref(locale: Locale, target: string, { onHome = false } = {}) {
  if (hasCaseStudy(target)) return localePath(locale, caseStudyPath(target));
  return onHome ? `#${target}` : `${homePath(locale)}#${target}`;
}

export function proofKind(target: string): "caseStudy" | "project" | "role" {
  if (hasCaseStudy(target)) return "caseStudy";
  return target === "experience" ? "role" : "project";
}

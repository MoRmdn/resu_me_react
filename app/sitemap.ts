import type { MetadataRoute } from "next";
import { caseStudySlugs } from "@/content/case-studies";
import { serviceSlugs } from "@/content/services";
import { site } from "@/content/site";
import { assertClosedSet } from "@/lib/closed-set";
import { caseStudyPath, servicePath } from "@/lib/paths";

export const dynamic = "force-static";

/**
 * Every indexable page, in both languages, each listing its counterpart. The
 * privacy pages are noindex and stay out. `path` is under the locale root.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Every build renders the sitemap, so this is where a dead link between
  // pages stops the build.
  assertClosedSet();
  const pages = [
    { path: "", priority: 1 },
    ...serviceSlugs.map((slug) => ({ path: servicePath(slug), priority: 0.8 })),
    ...caseStudySlugs.map((slug) => ({ path: caseStudyPath(slug), priority: 0.8 })),
  ];
  return pages.flatMap(({ path, priority }) =>
    [`/${path}`, `/ar/${path}`].map((url) => ({
      url: `${site.url}${url}`,
      lastModified: new Date(site.contentLastChanged),
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages: { en: `${site.url}/${path}`, ar: `${site.url}/ar/${path}` } },
    })),
  );
}

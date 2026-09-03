import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// `output: "export"` refuses to build a route handler that has not
// declared itself static, so sitemap.xml needs this explicitly.
export const dynamic = "force-static";

/**
 * One page, so one entry. It exists so Search Console has something to submit
 * and a crawl has a declared entry point — neither of which the site had.
 */
/**
 * When the page's content last actually changed.
 *
 * Deliberately a constant, not `new Date()`. Generating it at build time stamps
 * "just now" on every deploy, including ones that only touch config — and a
 * lastmod that always says today is a lastmod Google learns to ignore. Bump
 * this when the content genuinely changes.
 */
const CONTENT_LAST_CHANGED = "2026-09-03";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.url}/`,
      lastModified: new Date(CONTENT_LAST_CHANGED),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

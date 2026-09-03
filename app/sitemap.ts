import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// `output: "export"` refuses to build a route handler that has not
// declared itself static, so sitemap.xml needs this explicitly.
export const dynamic = "force-static";

/**
 * One page, so one entry. It exists so Search Console has something to submit
 * and a crawl has a declared entry point — neither of which the site had.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.url}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

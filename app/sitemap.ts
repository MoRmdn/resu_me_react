import type { MetadataRoute } from "next";
import { site } from "@/content/site";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/ar/"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(site.contentLastChanged),
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages: { en: `${site.url}/`, ar: `${site.url}/ar/` } },
  }));
}

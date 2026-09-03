import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// `output: "export"` refuses to build a route handler that has not
// declared itself static, so robots.txt needs this explicitly.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}

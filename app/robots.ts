import type { MetadataRoute } from "next";
import { isIndexable, siteOrigin } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  // Anything that is not an explicitly flagged production deployment is closed
  // to crawlers. Advertising a sitemap from a non-indexable build would only
  // invite the crawl we are refusing.
  if (!isIndexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteOrigin}/sitemap.xml`,
  };
}

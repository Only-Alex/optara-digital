import type { MetadataRoute } from "next";
import { serviceNav } from "@/lib/content";
import { getPublishedPosts } from "@/lib/blog";
import { legalDates, legalPagesApproved } from "@/lib/legal";
import { siteOrigin } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    { path: "", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/case-studies", priority: 0.8 },
    { path: "/about", priority: 0.7 },
    { path: "/blog", priority: 0.6 },
    { path: "/contact", priority: 0.8 },
  ];

  const serviceRoutes = serviceNav.map((service) => ({
    path: service.href,
    priority: 0.8,
  }));

  const staticEntries = [...routes, ...serviceRoutes].map((route) => ({
    url: `${siteOrigin}${route.path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: route.priority,
  }));

  /**
   * Published articles only. `getPublishedPosts` already excludes drafts and
   * future-dated posts, so neither can reach the sitemap. lastModified uses
   * the article's own updated or published date rather than the build time —
   * stamping every article as modified on each deploy is a lie crawlers act on.
   *
   * Category URLs are query parameters on /blog rather than routes of their
   * own, so they are deliberately not listed: they are filtered views of a
   * page that is already here, and canonicalise to it.
   */
  const articleEntries = getPublishedPosts().map((post) => ({
    url: `${siteOrigin}/blog/${post.slug}`,
    lastModified: new Date(`${post.updatedAt ?? post.publishedAt}T00:00:00Z`),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  /**
   * The legal pages join the sitemap only once approved — while drafts they
   * are noindexed and unlinked, and advertising them here would contradict
   * that. lastModified uses each document's own revision date, never the
   * build time.
   */
  const legalEntries = legalPagesApproved
    ? (
        [
          ["/privacy", legalDates.privacy],
          ["/cookies", legalDates.cookies],
          ["/terms", legalDates.terms],
        ] as const
      ).map(([path, date]) => ({
        url: `${siteOrigin}${path}`,
        lastModified: new Date(`${date}T00:00:00Z`),
        changeFrequency: "yearly" as const,
        priority: 0.3,
      }))
    : [];

  return [...staticEntries, ...articleEntries, ...legalEntries];
}

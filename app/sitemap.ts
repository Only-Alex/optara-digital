import type { MetadataRoute } from "next";
import { serviceNav } from "@/lib/content";
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

  return [...routes, ...serviceRoutes].map((route) => ({
    url: `${siteOrigin}${route.path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: route.priority,
  }));
}

/**
 * Where this build actually lives, and whether it may be indexed.
 *
 * `site.url` in lib/content.ts is the *intended* production domain. It is not
 * safe to canonicalise to it unconditionally: optaradigital.com is registered
 * but not yet pointed at a deployment, and every preview build would otherwise
 * claim to be production. Metadata, sitemap and robots use the values below
 * instead, which describe the origin serving the request.
 *
 * Set both variables in Vercel's Production environment when the domain goes
 * live, and nowhere else — preview and branch deploys then canonicalise to
 * themselves and stay out of the index.
 *
 *   NEXT_PUBLIC_SITE_URL=https://optaradigital.com
 *   NEXT_PUBLIC_SITE_INDEXABLE=true
 */

function resolveOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  // Deployment-specific hostname, so a preview canonicalises to itself rather
  // than to production.
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const siteOrigin = resolveOrigin();

/**
 * Opt-in, never inferred. Until someone sets the flag on a real production
 * deployment nothing is crawlable — which is correct while the site still
 * carries placeholder contact details and concept case studies.
 */
export const isIndexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

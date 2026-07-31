/**
 * The single switch for the legal pages.
 *
 * The Privacy Policy, Cookie Policy and Website Terms exist as drafts: the
 * routes render, but while `legalPagesApproved` is false they are noindexed,
 * excluded from the sitemap, absent from the footer, and carry a visible
 * draft notice. They cannot be finalised yet because facts the policies need
 * are unresolved — the legal entity, a working privacy mailbox, the enquiry
 * delivery provider and the governing law are all recorded in
 * docs/privacy/LEGAL_FACTS_REQUIRED.md.
 *
 * When the business resolves those items and approves the pages, flip this to
 * true and update the `lastUpdated` dates below. That one change adds the
 * footer links, lifts the noindex, adds the routes to the sitemap and removes
 * the draft notices. Do not flip it as part of unrelated work.
 */
export const legalPagesApproved = false;

/**
 * The date each document was last materially revised — a real editorial date,
 * never the build time. Update by hand when the content changes.
 */
export const legalDates = {
  privacy: "2026-07-31",
  cookies: "2026-07-31",
  terms: "2026-07-31",
} as const;

export const legalNav = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Website Terms", href: "/terms" },
] as const;

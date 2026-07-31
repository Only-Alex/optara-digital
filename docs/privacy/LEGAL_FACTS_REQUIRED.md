# LEGAL_FACTS_REQUIRED — facts the business must supply or confirm

Internal checklist, 2026-07-31. The three legal pages exist as **drafts**
(noindex, not in the sitemap, not linked from the footer or the contact form)
and must not be approved for publication until every BLOCKER item here is
resolved. Nothing on this list has been invented or guessed anywhere in the
public pages.

## BLOCKERS — policies cannot be finalised without these

1. **Legal entity.** Is Optara Digital a limited company, a sole trader
   trading name, or a partnership? If a company: registered name, company
   number, registered office, and whether the registered office may be
   published. The Privacy Policy currently identifies the controller only as
   "Optara Digital" (the verified trading identity) and the Terms omit entity
   detail entirely.
2. **Privacy contact mailbox.** hello@optaradigital.com has no mailbox and no
   MX records exist for the domain (verified by DNS lookup 2026-07-31). A
   rights request sent to the published address would bounce. Mail routing
   must exist before any policy naming that address goes live.
3. **Enquiry delivery.** The contact forms have no transport; policies
   describing enquiry handling can only be finalised once the delivery
   provider is appointed and named (see also the standing launch blocker).
4. **Governing law for the Website Terms.** "UK-based" is verified but the UK
   has three legal systems; England & Wales vs Scotland vs Northern Ireland
   must be confirmed by the business. The draft Terms deliberately omit the
   governing-law clause until then.
5. **Business approval** of all three drafts, plus review by a solicitor or
   privacy professional for the flagged clauses.

## HIGH — confirm before launch

6. **ICO data-protection fee.** Complete the official ICO self-assessment
   (ico.org.uk → data protection fee). Do not assume exemption or liability;
   record the outcome and any registration number here. Manual action.
7. **Vercel processing terms.** Confirm acceptance of Vercel's Data Processing
   Addendum on the account, the production function/log region, plan-specific
   log retention, and Vercel's current UK international-transfer mechanism
   (UK Extension to the EU-US Data Privacy Framework and/or IDTA/Addendum).
   Record evidence links.
8. **GitHub** (source hosting, potential incidental data in issues/commits):
   confirm terms/DPA position. Cloudflare is DNS-only (verified: records point
   directly at Vercel, traffic not proxied) — confirm this is intentional and
   document that Cloudflare does not process visitor traffic.
9. **Retention decisions** marked [DECIDE] in `retention-schedule.md`.
10. **Rights-process owner** named in `rights-request-process.md`.
11. **Email delivery provider** (when appointed): DPA, sending domain, SPF,
    DKIM, DMARC records — none exist today (verified; no SPF/DMARC TXT
    records). Do not publish a DMARC reject policy before sources are stable.

## MEDIUM

12. Vercel default `*.vercel.app` production alias: identify the real slug in
    the dashboard (not guessable from the repo) and confirm it either
    redirects or is left canonicalising to optaradigital.com (canonical tags
    already point at the custom domain).
13. HSTS: currently `max-age=63072000` from Vercel. Decide whether
    `includeSubDomains`/`preload` are wanted (preload is effectively
    irreversible — business decision).
14. DNSSEC is off at Cloudflare (no DS record). Optional hardening; decide.
15. Contact-form privacy sentence ("nothing is passed to anyone else") must be
    revised the day a delivery provider is wired, and the policy link added to
    the form once the Privacy Policy is approved.

## Approval switch

When items are resolved and the business approves the pages, set
`legalPagesApproved = true` in `lib/legal.ts` and update each page's
`lastUpdated`. That single change: adds the footer links, lifts the noindex,
adds the routes to the sitemap, and removes the draft notice.

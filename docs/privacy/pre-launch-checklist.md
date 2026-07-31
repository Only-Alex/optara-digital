# Pre-launch checklist — manual business actions

Internal, 2026-07-31. Nothing below may be ticked without evidence. Items
overlap deliberately with LEGAL_FACTS_REQUIRED.md; this is the launch-day
sequence view.

## Legal and privacy

- [ ] Legal entity confirmed and recorded
- [ ] Controller identity confirmed for the Privacy Policy
- [ ] Public contact details confirmed (email working, any phone real)
- [ ] Privacy contact mailbox live (MX + inbox for hello@optaradigital.com)
- [ ] ICO fee self-assessment completed; outcome recorded
- [ ] Retention schedule [DECIDE] items resolved and approved
- [ ] Lawful bases reviewed and approved
- [ ] Legitimate-interests assessment approved
- [ ] Vercel DPA acceptance + region + log retention evidenced
- [ ] Email provider appointed; DPA; SPF/DKIM/DMARC configured and verified
- [ ] International-transfer position documented per processor
- [ ] Privacy Policy reviewed by business + professional; approved
- [ ] Cookie Policy reviewed; approved (site currently stores nothing — the
      policy says so; re-verify on launch day that this is still true)
- [ ] Website Terms reviewed; governing law confirmed; liability/IP clauses
      solicitor-checked; approved
- [ ] `legalPagesApproved` flipped to true; footer links verified live
- [ ] Contact form privacy sentence updated to reference the live policy

## Product blockers (pre-existing)

- [ ] Enquiry transport wired into `deliver()` in app/actions/enquiry.ts and
      homepage contact action; genuine end-to-end delivery verified
- [ ] Contact page "delivery is not connected" notice removed
- [ ] Response commitment ("two working days") re-confirmed as operationally real

## Production configuration

- [ ] Canonical host confirmed: apex optaradigital.com (www→apex 308 verified
      2026-07-31; keep)
- [ ] Real *.vercel.app production alias identified; behaviour confirmed
- [ ] Preview deployments confirmed non-indexable (Vercel default + app robots)
- [ ] Production env vars set: NEXT_PUBLIC_SITE_URL=https://optaradigital.com,
      NEXT_PUBLIC_SITE_INDEXABLE=true (the indexing switch — flip only at
      launch), plus email-provider secrets (server-only, no NEXT_PUBLIC_)
- [ ] Security headers verified on production after deploy (CSP, nosniff,
      referrer, permissions, frame-ancestors) with no console violations
- [ ] HSTS decision recorded (includeSubDomains/preload or not)
- [ ] DNSSEC decision recorded
- [ ] Sitemap spot-checked on production; robots.txt allows and references it
- [ ] 404 and error pages spot-checked on production

## Ownership

- [ ] Launch owner named
- [ ] Post-launch monitoring owner named (logs, form deliveries, complaints)

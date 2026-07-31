# Post-launch monitoring — Optara Digital

Operational checklist. No secrets, no personal enquiry data, no anti-spam
thresholds, no credentials.

## Current state (2026-08-01)

| | |
|---|---|
| Production domain | https://optaradigital.com (apex canonical; www → apex 308) |
| Live release | `d77e633` — **not** the latest approved code |
| Approved but undeployed | `1ac21b6` (site-wide audit fixes), `3c71260` (legal/privacy/security) |
| Indexing | **Off.** `robots.txt` is `Disallow: /` and every page carries `noindex, nofollow`, because `NEXT_PUBLIC_SITE_INDEXABLE` is unset. Intentional pre-launch state |
| DNS | Cloudflare authoritative, **DNS-only** (not proxied); records point at Vercel |
| Contact delivery | **None.** No transport, no mailbox, no MX |
| Analytics | None installed. None approved |
| Cookies / storage | None. Verified in a live browser session |

Because indexing is off and enquiries cannot be delivered, the site is not yet
in a commercially live state. Most "post-launch" signals (Search Console,
field Core Web Vitals, enquiry volume, 404 patterns from real users) **cannot
exist yet** and must not be reported as if they do.

## Monitoring sources

**Available now:** direct HTTP checks of live routes; browser inspection of
the live site (storage, network, console, performance timings); DNS and TLS
lookups; the repository and local production builds.

**Not available:** Vercel dashboard (deployment/runtime/function logs, traffic,
404 counts) — needs dashboard access; Cloudflare dashboard (firewall, cache,
bot events); Google Search Console / Bing — no property connected; analytics —
none installed by design; email provider — none appointed; real-user field
data — none, and none will accrue while the site is noindexed with no traffic.

## Route check (manual)

Confirm 200 and correct content:

`/` · `/services` · the six `/services/*` pages · `/about` · `/blog` ·
`/contact` · `/case-studies` · `/sitemap.xml` · `/robots.txt`
Confirm 404: any unknown path.
After the legal release ships, add `/privacy` · `/cookies` · `/terms`.

## Contact-form check

1. `/contact?service=branding` preselects Branding, and remains editable.
2. Empty submit → field errors, focused summary, **no success message**.
3. Valid submit → whatever the transport genuinely returns. Success must
   appear **only** after confirmed acceptance.
4. Values survive any failed submit.
5. No personal data in the URL, in analytics, or in application logs.

Once a transport exists: send exactly one enquiry prefixed `PRODUCTION TEST`,
confirm delivery to the real recipient, Reply-To, and no duplicate. Do not
repeat routinely.

## Email-delivery check (once a provider exists)

Sender verified · SPF · DKIM · DMARC (do not raise enforcement before all
senders are known) · bounces · spam placement · suppression list.

## Consent / storage check

Clean profile → load site → confirm **zero** cookies, localStorage,
sessionStorage, IndexedDB, service workers and **zero** third-party requests.
If anything appears, the Cookie Policy is out of date: stop and re-run
`docs/privacy/storage-and-consent.md` before shipping.

## Search-engine check

Only after `NEXT_PUBLIC_SITE_INDEXABLE=true`: robots allows and references the
sitemap · sitemap lists only approved routes on the canonical host · no page
retains `noindex` accidentally · canonicals point at apex · no `vercel.app` or
`localhost` URL anywhere.

## Performance check (lab only until field data exists)

Representative routes: homepage, one service page, blog, contact. Record TTFB,
FCP, LCP, CLS, JS transferred. Treat as diagnostic, never as field data.
Confirm the homepage WebGL bundle is **not** requested by internal routes.

## Accessibility check

Skip link first tab stop · visible focus · one H1 per page · FAQ keyboard
operation · form labels and error association · 200% zoom · reduced motion.
Not a formal audit or certification.

## Security / abuse check

CSP violations (after the security release) · rate-limit behaviour · spam
volume · repeated malicious paths (leave as 404 — do not redirect) ·
unexpected third-party requests.

## Severity and response

**Critical** (site down, enquiries lost, false success, secret exposure,
premature tracking, canonical pointing at preview) → roll back immediately.
**High** (a major route broken, delivery failure, serious a11y or performance
regression) → fix via preview, then an approved deploy.
**Medium / Low** → batch into a planned release. Never edit live directly.

## Rollback

Promote the previous healthy Vercel production deployment, confirm the custom
domain serves it, then retest homepage, contact and major routes. Do not
delete the failed deployment before investigating.

## Review cadence (manual — nothing is automated)

**Daily, first week:** homepage + contact availability, runtime errors,
delivery.
**Weekly, first month:** 404s, form errors, spam, consent, indexing, links,
mobile.
**Monthly:** enquiry quality, search visibility, Core Web Vitals, blog health,
dependency notices, policy accuracy, rollback confidence.

## Owners — to be confirmed

Launch owner · monitoring owner · rights/complaints owner (also open in
`docs/privacy/rights-request-process.md`).

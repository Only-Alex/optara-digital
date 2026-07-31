# Data map — Optara Digital website

Internal document. Not for publication. Describes what the public website at
optaradigital.com actually does with information, verified against source code
and live browser/network inspection on 2026-07-31.

**Verification evidence (2026-07-31):**

- Source sweep: zero uses of `document.cookie`, `cookies()`, `localStorage`,
  `sessionStorage`, `indexedDB`, service workers, tags, pixels or analytics
  SDKs anywhere in `app/`, `components/` or `lib/`. Dependencies are `lenis`,
  `motion`, `next`, `react`, `react-dom`, `webgl-fluid` — no analytics, no
  consent tooling, no tracking package.
- Live production session (first visit, after navigation across routes, after
  typing into the contact form, after interacting with the homepage WebGL):
  zero cookies, zero localStorage, zero sessionStorage, zero IndexedDB, zero
  service workers, zero third-party network requests. Every resource loads
  from optaradigital.com (fonts are self-hosted via next/font).
- Live response headers: no `Set-Cookie` on any inspected route.

## Activity 1 — Contact enquiries (standalone /contact form)

| | |
|---|---|
| Purpose | Review and respond to a business enquiry |
| Person affected | The enquirer (usually acting for a business) |
| Collected | Name, work email, company (required); website, budget range, timing (optional); area of interest; free-text details |
| Source | The enquirer, directly, via the form |
| Required/optional | Marked per field on the form; only name, email, company, area and details are required |
| Lawful basis under consideration | Art. 6(1)(b) UK GDPR — steps at the request of the data subject prior to entering a contract. Not consent: the person is asking us to act on their message |
| Recipient | **None at present.** No delivery transport is wired; a validated submission is reported to the visitor as undelivered and is not stored |
| Processor | Vercel Inc. (hosting; processes the request transiently). An email delivery provider will be appointed before launch — none exists yet |
| Storage location | Not stored. Server log line carries only non-identifying fields (area of interest, whether budget/timing were supplied) |
| International transfer | See `docs/privacy/LEGAL_FACTS_REQUIRED.md` — Vercel region and transfer mechanism to be confirmed |
| Retention | N/A until delivery exists; see retention schedule for the intended approach |
| Security controls | Server-side validation, length limits, control-character rejection in email field (header-injection defence), honeypot, minimum-completion-time check, per-IP rate limiting |
| Rights engaged | Access, rectification, erasure, restriction, objection (to the LI-based parts) |
| Consent involved | No |
| Direct marketing involved | No. The form states: used to review and reply, nothing else, no mailing list |

## Activity 2 — Homepage contact form

As Activity 1 with these differences: also collects an optional telephone
number (for enquirers who prefer a call back) and requires a budget range.
Same absence of delivery. Same lawful-basis analysis.

## Activity 3 — Hosting, security and request logs

| | |
|---|---|
| Purpose | Serving the website; platform-level security and diagnostics |
| Person affected | Every visitor |
| Collected | IP address and request metadata, transiently, by the hosting platform (Vercel) as part of serving requests; Vercel runtime logs |
| Lawful basis under consideration | Art. 6(1)(f) legitimate interests — running and securing the service. See `legitimate-interests-assessment.md` |
| Processor | Vercel Inc. |
| Retention | Platform-controlled; plan-specific log retention to be confirmed (manual check) |
| Application logging | The application itself logs no personal data: the enquiry actions deliberately log only `area`, `hasBudget`, `hasTiming` |

## Activity 4 — Spam prevention and rate limiting

| | |
|---|---|
| Purpose | Prevent automated abuse of the enquiry forms |
| Collected | Requester IP (read from headers, used as an in-memory throttle key only), a client-supplied form-start timestamp, honeypot field state |
| Lawful basis under consideration | Art. 6(1)(f) legitimate interests |
| Storage | In-process memory only; never written to a durable store or log |
| Retention | Rolling 10-minute window in process memory; lost on process recycle |

## Activities that do NOT exist (verified)

No analytics. No advertising or marketing technology. No newsletter. No user
accounts. No CRM. No error-monitoring service. No CAPTCHA service. No embedded
third-party media. No session recording. No fingerprinting. No cookies or
similar storage of any kind. No automated decision-making with legal or
similarly significant effects. Blog has no published articles and no author
personal data. Cloudflare provides DNS only (records point directly at
Vercel; traffic is not proxied through Cloudflare), so Cloudflare does not
process visitor traffic.

This document must be revised when the enquiry transport is wired, if
analytics is ever added, or if any third-party service is introduced.

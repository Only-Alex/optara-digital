# Retention schedule — Optara Digital website

Internal document, 2026-07-31. **Draft — every period below marked [DECIDE]
needs a genuine business decision before launch.** Nothing here claims an
automatic deletion process exists where none does.

| Data | Where it lives today | Proposed retention | Status |
|---|---|---|---|
| Contact enquiries | Nowhere — no delivery transport exists; submissions are reported undelivered and not stored | Once delivery exists: enquiries that become clients — for the client relationship + statutory accounting periods; enquiries that do not — **[DECIDE]** (suggest review at 12 months) | Blocked on transport; periods undecided |
| Email correspondence | No mailbox exists | **[DECIDE]** once hello@ has a mailbox; governed by the inbox provider | Blocked on mailbox |
| Application logs | Vercel runtime logs; app logs only non-identifying enquiry fields (area/hasBudget/hasTiming) | Platform default; confirm plan-specific retention in the Vercel dashboard | Manual check |
| Rate-limit data (IP keys) | In-process memory only | Rolling 10-minute window; lost on process recycle. No action needed | Decided (by implementation) |
| Consent records | None exist (no consent is collected) | N/A | N/A |
| Analytics data | No analytics | N/A | N/A |
| Backups | No application datastore exists to back up | N/A today; revisit when any store is added | N/A |
| Accounting/contract records | Outside the website | Statutory periods; business-side process | Out of scope for the site |

Principles applied: state a period only where genuinely decided; otherwise
state the criteria and flag the decision. The public Privacy Policy mirrors
this — criteria now, specific periods once decided. Do not claim automatic
deletion anywhere until a real mechanism exists.

Review trigger: wiring the enquiry transport, creating the mailbox, or adding
any datastore.

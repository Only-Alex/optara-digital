# Legitimate interests assessment — website security, spam prevention and logs

Internal working assessment, 2026-07-31. Drafted by the development team from
the actual implementation. **Not legally approved** — requires review by the
business and, where appropriate, a privacy professional before launch.

Covers Activities 3 and 4 in `data-map.md`: platform request logs, and the
enquiry forms' spam prevention (honeypot, completion-time check, per-IP rate
limiting).

## Purpose test

The specific interest is keeping the website available and preventing
automated abuse of the enquiry forms (flooding, spam, resource exhaustion).
This benefits the business (a usable enquiry channel, bounded costs) and
genuine visitors (the form keeps working; their enquiries are not buried in
bot traffic). The interest is lawful, clearly articulated, and real rather
than speculative — the forms are publicly reachable and unauthenticated.

## Necessity test

The processing is limited to what the defence needs:

- The IP address is read from request headers and used only as an in-memory
  throttle key over a rolling 10-minute window. It is not written to any
  durable store by the application and not combined with any other data.
- The completion-time check uses a client-supplied timestamp with no identity
  attached.
- The honeypot inspects one hidden field's state.

Less intrusive alternatives considered: a CAPTCHA service would introduce a
third-party processor, third-party requests and likely consent obligations —
strictly more intrusive. Doing nothing leaves the form open to abuse. IP-based
throttling with no durable storage is the minimal effective option.

## Balancing test

- Reasonable expectations: visitors expect a public form to have basic abuse
  protection; transient IP handling to serve and protect a website is within
  ordinary expectations.
- Impact: negligible. Nothing is stored durably, nothing is profiled, no
  decision with legal or similar effect is taken. A rate-limited visitor is
  told plainly to wait a few minutes, with their typed values preserved.
- Safeguards: no durable storage; no logging of the throttle key; bounded
  in-memory map; honest user-facing messages; the platform's own request logs
  are governed by the hosting provider's retention (manual check recorded in
  LEGAL_FACTS_REQUIRED.md).
- Objection: explained in the Privacy Policy. In practice an objection to
  transient anti-abuse processing cannot be honoured while using the form
  (the processing is intrinsic to serving the request); the policy says this
  honestly rather than promising an off switch that cannot exist.

## Outcome

Legitimate interests appears appropriate for these narrow purposes. To be
confirmed at business/legal review.

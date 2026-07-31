"use server";

import { headers } from "next/headers";
import {
  initialEnquiryState,
  normaliseWebsite,
  validateEnquiry,
  type EnquiryState,
  type EnquiryValues,
} from "@/lib/enquiry";

/**
 * Enquiry handling for the standalone Contact page.
 *
 * THE IMPORTANT PART, and the reason this never returns "sent": there is no
 * delivery mechanism. No mail transport is installed, no webhook is called, no
 * queue is written, and site.email has no mailbox behind it (documented at its
 * definition in lib/content.ts). A validated enquiry currently reaches a
 * server log line and stops.
 *
 * So a valid submission returns "undelivered" and the page says so plainly.
 * Reporting success — "thanks, we reply within two working days" — while
 * discarding the enquiry would leave a real person waiting on a reply that
 * cannot come, which is the single worst thing this page could do.
 *
 * WIRING A TRANSPORT: implement `deliver()` below and return true only on a
 * confirmed accepted response from the provider. Everything else — the success
 * state, its copy, focus handling and resubmission guard — is already built
 * and switches on automatically. Keep the provider key server-only; it must
 * never be imported into a Client Component.
 */

/* ── Spam protection ─────────────────────────────────────────────────────
   Three cheap layers, no dependency and no visible CAPTCHA:
   1. a honeypot field, hidden from sight and from assistive technology;
   2. a minimum completion time, since a bot posts almost instantly;
   3. a per-IP rate limit.

   The limiter is an in-process Map. On a single long-lived server that is a
   real control. On serverless it is per-instance, so a distributed flood can
   still get through — recorded as a production risk in the sprint report
   rather than papered over with a claim it does not deserve. */

const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 } as const;
const MIN_COMPLETION_MS = 3000;

const attempts = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter(
    (t) => now - t < RATE_LIMIT.windowMs,
  );
  recent.push(now);
  attempts.set(key, recent);

  // Bound the map so a long-running process cannot grow it without limit.
  if (attempts.size > 5000) {
    for (const [k, times] of attempts) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) attempts.delete(k);
    }
  }
  return recent.length > RATE_LIMIT.max;
}

/** Best-effort client identity for throttling only. Never stored or logged. */
async function requestKey(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/**
 * The transport seam. Returns true only when a provider has genuinely accepted
 * the enquiry. Currently there is no provider, so it returns false and the
 * caller reports the enquiry as undelivered.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function deliver(values: EnquiryValues): Promise<boolean> {
  return false;
}

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const read = (key: string) => String(formData.get(key) ?? "").trim();

  const values: EnquiryValues = {
    name: read("name"),
    email: read("email"),
    company: read("company"),
    website: read("website"),
    area: read("area"),
    budget: read("budget"),
    timing: read("timing"),
    details: read("details"),
  };

  /* Honeypot and timing. Neither reports success.
     
     The tempting pattern here is to answer a bot with a fake "thank you" so it
     learns nothing. This does not do that, because neither signal is certain:
     an over-eager password manager can fill a hidden field, and a fast submit
     can be a real person with autofill. Showing either of them a success
     message would be the exact lie this codebase refuses everywhere else, and
     their enquiry would vanish. Both paths return the same neutral rejection —
     which still tells a scripted client nothing about which rule it tripped —
     and every entered value is handed back. */
  const looksAutomated =
    Boolean(read("contact_reference")) ||
    (() => {
      // Client-supplied, so a signal only; unparseable means "no opinion".
      const startedAt = Number(read("started_at"));
      return (
        Number.isFinite(startedAt) &&
        startedAt > 0 &&
        Date.now() - startedAt < MIN_COMPLETION_MS
      );
    })();

  if (looksAutomated) {
    return {
      status: "rejected",
      message:
        "We could not accept that submission. If you are a person and this looks wrong, please try again — your details are still here.",
      fieldErrors: {},
      values,
    };
  }

  const fieldErrors = validateEnquiry(values);
  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "invalid",
      message: "Check the highlighted fields.",
      fieldErrors,
      values,
    };
  }

  if (rateLimited(await requestKey())) {
    return {
      status: "throttled",
      message:
        "That is several enquiries in a short space of time. Please wait a few minutes and try again — your details are still here.",
      fieldErrors: {},
      values,
    };
  }

  // Normalised once, server-side, so the delivered record is consistent.
  const normalised: EnquiryValues = {
    ...values,
    website: normaliseWebsite(values.website) ?? "",
  };

  const delivered = await deliver(normalised);

  if (!delivered) {
    /* Deliberately logs no personal data: there is no consented store for it,
       and a server log is not one. Only the non-identifying selections, which
       are useful for knowing whether the page is being used at all. */
    console.warn("[enquiry] validated but undeliverable: no transport configured", {
      area: normalised.area,
      hasBudget: Boolean(normalised.budget),
      hasTiming: Boolean(normalised.timing),
    });

    return {
      status: "undelivered",
      message:
        "Your enquiry could not be sent, because enquiry delivery is not connected yet. Nothing you typed has been lost.",
      fieldErrors: {},
      values,
    };
  }

  return {
    status: "sent",
    message: "Thank you. Your enquiry has been sent.",
    fieldErrors: {},
    values: initialEnquiryState.values,
  };
}

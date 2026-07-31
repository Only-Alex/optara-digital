/**
 * Enquiry field definitions and validation for the standalone Contact page.
 *
 * Kept separate from app/actions/contact.ts on purpose. That action serves the
 * homepage Contact section, which is protected this sprint, and it requires a
 * budget selection and collects a telephone number. Changing its rules to suit
 * this page would change the homepage form's behaviour, so the standalone page
 * gets its own action built on the helpers below. When the homepage form is
 * next in scope, it should move onto these helpers and the duplication goes.
 *
 * Everything here is pure and side-effect free so both the Server Action and
 * the client component can import it without pulling server code into the
 * browser bundle.
 */

/** The approved six, plus the two answers that let someone not self-diagnose. */
export const AREAS = [
  "Not sure yet",
  "Branding",
  "SEO & GEO",
  "Google Ads",
  "Social Media",
  "Website Design",
  "App Development",
  "Several connected areas",
  "Something else",
] as const;

export type Area = (typeof AREAS)[number];

/**
 * The ranges already approved in lib/content.ts, unchanged, plus an explicit
 * way to decline. Optional on this page: a budget is useful context, not a
 * qualification gate, and nothing is rejected on the basis of it.
 */
export const BUDGETS = [
  "Not sure yet",
  "Prefer to discuss",
  "Under £2,000 / month",
  "£2,000 — £5,000 / month",
  "£5,000 — £10,000 / month",
  "£10,000+ / month",
] as const;

export const TIMINGS = [
  "As soon as practical",
  "Within the next three months",
  "Within three to six months",
  "Later this year",
  "Exploring options",
  "Not sure yet",
] as const;

/** Maps a /services/<slug> visit to a preselected area, when one arrives. */
export const AREA_FROM_SLUG: Record<string, Area> = {
  branding: "Branding",
  "seo-geo": "SEO & GEO",
  "google-ads": "Google Ads",
  "social-media": "Social Media",
  "website-design": "Website Design",
  "app-development": "App Development",
};

export type EnquiryValues = {
  name: string;
  email: string;
  company: string;
  website: string;
  area: string;
  budget: string;
  timing: string;
  details: string;
};

export const emptyEnquiry: EnquiryValues = {
  name: "",
  email: "",
  company: "",
  website: "",
  area: "",
  budget: "",
  timing: "",
  details: "",
};

export type EnquiryStatus =
  | "idle"
  /** Ordinary field validation — not a failure of the submission itself. */
  | "invalid"
  /** Accepted and delivered. Only ever set by a confirmed transport result. */
  | "sent"
  /** Reached the server, passed validation, could not be delivered. */
  | "undelivered"
  /** Too many attempts from one source in a short window. */
  | "throttled"
  /**
   * An automated-submission signal fired. Never reports success: a hidden
   * field can be filled by an over-eager password manager and a fast submit
   * can be a real person, so this says plainly that the submission was not
   * accepted rather than lying about it.
   */
  | "rejected";

export type EnquiryState = {
  status: EnquiryStatus;
  message: string;
  fieldErrors: Partial<Record<keyof EnquiryValues, string>>;
  /** Echoed back so nothing typed is lost on a recoverable outcome. */
  values: EnquiryValues;
};

export const initialEnquiryState: EnquiryState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  values: emptyEnquiry,
};

/* ── Limits ──────────────────────────────────────────────────────────────
   Generous enough never to interrupt a real enquiry, bounded enough that a
   single request cannot carry an unreasonable payload. */

export const LIMITS = {
  name: 120,
  email: 254, // RFC 5321 maximum
  company: 160,
  website: 300,
  details: 5000,
} as const;

/**
 * Permissive by design. Over-strict email regexes reject valid addresses far
 * more often than they catch typos, and the only authority on deliverability
 * is the mail server. Control characters are refused because an address is
 * interpolated into mail headers once a transport exists, and a newline there
 * is a header-injection vector.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CONTROL_CHARS = /[\r\n\t\0]/;

export const isValidEmail = (value: string) =>
  EMAIL.test(value) && !CONTROL_CHARS.test(value) && value.length <= LIMITS.email;

/**
 * Accepts a bare domain or a full URL and returns a normalised https URL.
 * Returns null when the value cannot be understood, so the caller can decide
 * whether that is an error (it is only an error when the field is non-empty).
 */
export function normaliseWebsite(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (CONTROL_CHARS.test(trimmed) || trimmed.length > LIMITS.website) return null;

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    // Only web schemes, and a hostname that at least looks like a domain.
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * The single source of validation truth. The Server Action runs this against
 * untrusted input; the client runs the same rules on blur for guidance only.
 */
export function validateEnquiry(
  values: EnquiryValues,
): Partial<Record<keyof EnquiryValues, string>> {
  const errors: Partial<Record<keyof EnquiryValues, string>> = {};

  if (values.name.trim().length < 2) {
    errors.name = "Enter your name.";
  } else if (values.name.length > LIMITS.name) {
    errors.name = "That name is longer than we can accept.";
  }

  if (!isValidEmail(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (values.company.trim().length < 2) {
    errors.company = "Enter your company or organisation.";
  } else if (values.company.length > LIMITS.company) {
    errors.company = "That company name is longer than we can accept.";
  }

  // Optional, but a value that cannot be understood is worth flagging.
  if (values.website.trim() && !normaliseWebsite(values.website)) {
    errors.website = "Enter a valid website address, or leave the field empty.";
  }

  if (!values.area) {
    errors.area = "Select the area that feels most relevant.";
  } else if (!(AREAS as readonly string[]).includes(values.area)) {
    errors.area = "Select the area that feels most relevant.";
  }

  // Optional fields, validated only against the approved lists.
  if (values.budget && !(BUDGETS as readonly string[]).includes(values.budget)) {
    errors.budget = "Select one of the listed ranges.";
  }
  if (values.timing && !(TIMINGS as readonly string[]).includes(values.timing)) {
    errors.timing = "Select one of the listed options.";
  }

  const details = values.details.trim();
  if (details.length < 20) {
    errors.details = "Tell us a little about what you are trying to improve.";
  } else if (details.length > LIMITS.details) {
    errors.details = "That is longer than we can accept — please shorten it.";
  }

  return errors;
}

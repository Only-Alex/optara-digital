"use server";

/**
 * Contact enquiry handling.
 *
 * IMPORTANT, and the reason this file never reports success: there is no
 * delivery mechanism behind this form. No mail transport is installed, no
 * webhook is called, no queue is written, and site.email has no mailbox
 * (documented at its definition). A validated enquiry currently reaches a
 * server log and nothing else.
 *
 * So this action does not return "success". Telling a real prospect "we have
 * got your brief, we reply within two working days" while discarding it is a
 * promise the business cannot keep, and the person who typed it would be left
 * waiting on a reply that can never come. Until a transport is wired in, valid
 * submissions return "unsent" — honest about the outcome, with every entered
 * value handed back so nothing the visitor typed is lost.
 */

export type ContactValues = {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  budget: string;
  brief: string;
};

export type ContactState = {
  status: "idle" | "invalid" | "unsent";
  message: string;
  fieldErrors: Record<string, string>;
  /** Echoed back so an unsuccessful submit never empties the form. */
  values: ContactValues;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// The initial empty values live with the form, not here: a "use server" module
// may only export async functions, so exporting a plain object from this file
// breaks the page at runtime even though it type-checks and lints cleanly.

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const read = (key: keyof ContactValues) =>
    String(formData.get(key) ?? "").trim();

  const values: ContactValues = {
    name: read("name"),
    email: read("email"),
    company: read("company"),
    phone: read("phone"),
    service: read("service"),
    budget: read("budget"),
    brief: read("brief"),
  };

  const fieldErrors: Record<string, string> = {};

  if (values.name.length < 2) fieldErrors.name = "Enter your name.";
  if (!EMAIL.test(values.email))
    fieldErrors.email = "Enter a valid work email, like you@company.co.uk.";
  if (values.company.length < 2)
    fieldErrors.company = "Enter your company name.";
  if (!values.service)
    fieldErrors.service = "Pick the service closest to what you need.";
  if (!values.budget)
    fieldErrors.budget = "Pick the range closest to your monthly budget.";
  if (values.brief.length < 20)
    fieldErrors.brief = "Tell us a little about your project.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "invalid",
      message: "Check the fields marked below and send it again.",
      fieldErrors,
      values,
    };
  }

  // Where a transport belongs. Until one exists the enquiry goes no further,
  // and the state returned below says exactly that. Deliberately logs only
  // non-identifying fields — there is no consented store for the rest.
  console.log("[contact] validated enquiry, no transport configured", {
    service: values.service,
    budget: values.budget,
  });

  return {
    status: "unsent",
    message:
      "We could not send your enquiry just now. Your details are still here, so please try again.",
    fieldErrors: {},
    values,
  };
}

"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { submitEnquiry } from "@/app/actions/enquiry";
import {
  AREAS,
  BUDGETS,
  TIMINGS,
  initialEnquiryState,
  validateEnquiry,
  type EnquiryValues,
} from "@/lib/enquiry";
import { ArrowIcon, CheckIcon } from "@/components/ui/Icons";

/**
 * The standalone Contact page's enquiry form.
 *
 * Separate from components/sections/Contact.tsx, which is the homepage section
 * and is protected. This one collects less (no telephone), makes budget and
 * timing optional, and carries the honeypot and timing fields the shared
 * action does not know about.
 *
 * Every recoverable outcome echoes the submitted values back from the server,
 * so a failed submit never empties the form.
 */

const fieldBase =
  "w-full rounded-[var(--radius-sm)] border border-[rgba(18,19,26,0.14)] bg-paper px-4 outline-none transition-[border-color,box-shadow] duration-200 hover:border-[rgba(18,19,26,0.26)] focus:border-accent focus:shadow-[0_0_0_3px_rgba(91,61,245,0.14)] aria-[invalid=true]:border-accent";
const inputClass = `${fieldBase} min-h-[3.4rem] py-3.5`;
const selectClass = `${fieldBase} min-h-[3.4rem] py-3.5`;

function Label({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-[0.9375rem] font-medium">
      {children}
      {optional ? (
        <span className="ml-2 font-normal text-[var(--muted)]">Optional</span>
      ) : null}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-[0.875rem] text-accent">
      <span aria-hidden="true" className="mt-[0.15em] font-semibold">
        !
      </span>
      {message}
    </p>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      /* Fixed min-width so the button does not resize between its two labels. */
      className="inline-flex min-h-[3.5rem] min-w-[13.5rem] items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-accent px-7 text-[0.9375rem] font-medium text-paper transition-colors duration-200 hover:bg-[#3A22C9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-70"
    >
      {pending ? (
        <>
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper"
          />
          Sending enquiry…
        </>
      ) : (
        <>
          Send enquiry
          <ArrowIcon aria-hidden="true" className="h-4 w-4" />
        </>
      )}
    </button>
  );
}

export function EnquiryForm({ preselectedArea = "" }: { preselectedArea?: string }) {
  const [state, formAction] = useActionState(submitEnquiry, initialEnquiryState);
  const uid = useId();
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  /** Client-side guidance only; the server is the authority. */
  const [touchedErrors, setTouchedErrors] = useState<
    Partial<Record<keyof EnquiryValues, string>>
  >({});

  /** Set once on mount so the server can measure completion time. */
  const [startedAt, setStartedAt] = useState("");
  useEffect(() => setStartedAt(String(Date.now())), []);

  const serverErrors = state.fieldErrors;
  const errorFor = (key: keyof EnquiryValues) =>
    serverErrors[key] ?? touchedErrors[key];

  const errorEntries = (
    Object.entries(serverErrors) as [keyof EnquiryValues, string][]
  ).filter(([, message]) => Boolean(message));

  /* Move attention to the outcome after a submit: the summary when fields
     failed, the success heading when the enquiry was accepted. */
  useEffect(() => {
    if (state.status === "invalid" && errorEntries.length > 0) {
      summaryRef.current?.focus();
    } else if (state.status === "sent") {
      successRef.current?.focus();
      formRef.current?.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const validateField = (key: keyof EnquiryValues, value: string) => {
    const probe = { ...initialEnquiryState.values, ...state.values, [key]: value };
    const result = validateEnquiry(probe);
    setTouchedErrors((prev) => ({ ...prev, [key]: result[key] }));
  };

  const v = state.values;

  if (state.status === "sent") {
    return (
      <div
        role="status"
        className="rounded-[18px] border border-[var(--hairline)] bg-paper p-8 md:p-10"
      >
        <span className="grid h-11 w-11 place-items-center rounded-full bg-accent/[0.08] text-accent">
          <CheckIcon className="h-5 w-5" />
        </span>
        <h3
          ref={successRef}
          tabIndex={-1}
          className="t-display-md mt-6 text-[clamp(1.375rem,2vw,1.75rem)] outline-none"
        >
          Thank you. Your enquiry has been sent.
        </h3>
        <p className="mt-4 max-w-[44ch] text-[1.0625rem] leading-[1.7] text-ink/75">
          We will review the details and reply within two working days.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent"
          >
            Explore our services
            <ArrowIcon
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/"
            className="text-[0.9375rem] text-ink/70 underline decoration-[var(--hairline)] underline-offset-4 transition-colors duration-200 hover:text-accent"
          >
            Return to the homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      className="rounded-[18px] border border-[var(--hairline)] bg-paper p-6 shadow-[0_1px_2px_rgba(18,19,26,0.03),0_18px_50px_rgba(18,19,26,0.05)] md:p-9"
    >
      {/* Honeypot. Hidden from sight and from assistive technology, excluded
          from the tab order, and never rendered as a real question. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-contact_reference`}>Do not complete this field</label>
        <input
          id={`${uid}-contact_reference`}
          type="text"
          name="contact_reference"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input type="hidden" name="started_at" value={startedAt} />

      {/* Field-validation summary. Not a submission failure — worded as such. */}
      {state.status === "invalid" && errorEntries.length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-8 rounded-[12px] border border-accent/30 bg-accent/[0.05] p-5 outline-none"
        >
          <h3 className="text-[1rem] font-medium">Check the highlighted fields.</h3>
          <ul className="mt-3 flex flex-col gap-1.5">
            {errorEntries.map(([key, message]) => (
              <li key={key}>
                <a
                  href={`#${uid}-${key}`}
                  className="text-[0.9375rem] text-accent underline underline-offset-4"
                >
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Form-level outcomes that are not field errors. */}
      {state.status === "undelivered" ||
      state.status === "throttled" ||
      state.status === "rejected" ? (
        <div
          role="alert"
          className="mb-8 rounded-[12px] border border-[rgba(18,19,26,0.16)] bg-bone p-5"
        >
          <h3 className="text-[1rem] font-medium">
            {state.status === "throttled"
              ? "Too many attempts just now"
              : state.status === "rejected"
                ? "That submission was not accepted"
                : "This enquiry has not been delivered"}
          </h3>
          <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-[1.6] text-ink/75">
            {state.message}
          </p>
        </div>
      ) : null}

      <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${uid}-name`}>Name</Label>
          <input
            id={`${uid}-name`}
            name="name"
            type="text"
            required
            autoComplete="name"
            maxLength={120}
            defaultValue={v.name}
            onBlur={(e) => validateField("name", e.target.value)}
            aria-invalid={Boolean(errorFor("name"))}
            aria-describedby={errorFor("name") ? `${uid}-name-error` : undefined}
            className={inputClass}
          />
          <FieldError id={`${uid}-name-error`} message={errorFor("name")} />
        </div>

        <div>
          <Label htmlFor={`${uid}-email`}>Work email</Label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={254}
            defaultValue={v.email}
            onBlur={(e) => validateField("email", e.target.value)}
            aria-invalid={Boolean(errorFor("email"))}
            aria-describedby={errorFor("email") ? `${uid}-email-error` : undefined}
            className={inputClass}
          />
          <FieldError id={`${uid}-email-error`} message={errorFor("email")} />
        </div>

        <div>
          <Label htmlFor={`${uid}-company`}>Company or organisation</Label>
          <input
            id={`${uid}-company`}
            name="company"
            type="text"
            required
            autoComplete="organization"
            maxLength={160}
            defaultValue={v.company}
            onBlur={(e) => validateField("company", e.target.value)}
            aria-invalid={Boolean(errorFor("company"))}
            aria-describedby={errorFor("company") ? `${uid}-company-error` : undefined}
            className={inputClass}
          />
          <FieldError id={`${uid}-company-error`} message={errorFor("company")} />
        </div>

        <div>
          <Label htmlFor={`${uid}-website`} optional>
            Website
          </Label>
          <input
            id={`${uid}-website`}
            name="website"
            type="text"
            inputMode="url"
            autoComplete="url"
            maxLength={300}
            placeholder="yourcompany.co.uk"
            defaultValue={v.website}
            onBlur={(e) => validateField("website", e.target.value)}
            aria-invalid={Boolean(errorFor("website"))}
            aria-describedby={`${uid}-website-help${
              errorFor("website") ? ` ${uid}-website-error` : ""
            }`}
            className={inputClass}
          />
          <p id={`${uid}-website-help`} className="mt-2 text-[0.875rem] text-[var(--muted)]">
            Share the current website when it helps provide context.
          </p>
          <FieldError id={`${uid}-website-error`} message={errorFor("website")} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor={`${uid}-area`}>Which area feels most relevant?</Label>
          <select
            id={`${uid}-area`}
            name="area"
            required
            /* Keyed on the echoed value so the server's answer wins after a
               failed submit, rather than the browser restoring a stale one. */
            key={`area-${v.area || preselectedArea}`}
            defaultValue={v.area || preselectedArea}
            onBlur={(e) => validateField("area", e.target.value)}
            aria-invalid={Boolean(errorFor("area"))}
            aria-describedby={errorFor("area") ? `${uid}-area-error` : undefined}
            className={selectClass}
          >
            <option value="">Select an area</option>
            {AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          <FieldError id={`${uid}-area-error`} message={errorFor("area")} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor={`${uid}-details`}>Tell us about the current challenge</Label>
          <textarea
            id={`${uid}-details`}
            name="details"
            required
            rows={7}
            maxLength={5000}
            defaultValue={v.details}
            onBlur={(e) => validateField("details", e.target.value)}
            aria-invalid={Boolean(errorFor("details"))}
            aria-describedby={`${uid}-details-help${
              errorFor("details") ? ` ${uid}-details-error` : ""
            }`}
            className={`${fieldBase} min-h-[10rem] py-3.5 leading-[1.6] md:min-h-[11.5rem]`}
          />
          <p id={`${uid}-details-help`} className="mt-2 text-[0.875rem] text-[var(--muted)]">
            What would you like to improve, and what is preventing progress today?
          </p>
          <FieldError id={`${uid}-details-error`} message={errorFor("details")} />
        </div>

        <div>
          <Label htmlFor={`${uid}-budget`} optional>
            Approximate investment range
          </Label>
          <select
            id={`${uid}-budget`}
            name="budget"
            key={`budget-${v.budget}`}
            defaultValue={v.budget}
            aria-invalid={Boolean(errorFor("budget"))}
            aria-describedby={errorFor("budget") ? `${uid}-budget-error` : undefined}
            className={selectClass}
          >
            <option value="">Prefer not to say</option>
            {BUDGETS.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
          <FieldError id={`${uid}-budget-error`} message={errorFor("budget")} />
        </div>

        <div>
          <Label htmlFor={`${uid}-timing`} optional>
            When are you hoping to begin?
          </Label>
          <select
            id={`${uid}-timing`}
            name="timing"
            key={`timing-${v.timing}`}
            defaultValue={v.timing}
            aria-invalid={Boolean(errorFor("timing"))}
            aria-describedby={errorFor("timing") ? `${uid}-timing-error` : undefined}
            className={selectClass}
          >
            <option value="">Prefer not to say</option>
            {TIMINGS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <FieldError id={`${uid}-timing-error`} message={errorFor("timing")} />
        </div>
      </div>

      {/* No Privacy Policy route exists yet, so this states what happens to the
          information rather than linking to a page that is not there. No
          consent checkbox: enquiry handling is the stated purpose, and there is
          no marketing list to opt into. */}
      <p className="mt-8 max-w-[58ch] border-t border-[var(--hairline)] pt-6 text-[0.875rem] leading-[1.6] text-[var(--muted)]">
        We use what you send here to review and reply to your enquiry, and for
        nothing else. There is no mailing list to join and nothing is passed to
        anyone else.
      </p>

      <div className="mt-8">
        <SubmitButton />
      </div>
    </form>
  );
}

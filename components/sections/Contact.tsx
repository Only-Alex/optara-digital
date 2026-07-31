"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { motion } from "motion/react";
import {
  submitContact,
  type ContactState,
  type ContactValues,
} from "@/app/actions/contact";
import { contact, site } from "@/lib/content";
import { hoverTransition } from "@/lib/motion";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";
import { ArrowIcon, CheckIcon } from "@/components/ui/Icons";

// Defined here rather than alongside the action: a "use server" module may
// only export async functions, so a plain object exported from there breaks
// the page at runtime while still type-checking and linting clean.
const emptyValues: ContactValues = {
  name: "",
  email: "",
  company: "",
  phone: "",
  service: "",
  budget: "",
  brief: "",
};

const initialState: ContactState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  values: emptyValues,
};

/**
 * Field surface. The focus ring is written without spaces inside the arbitrary
 * value on purpose: Tailwind silently drops an arbitrary value containing a
 * space, which is why the previous `rgba(91, 61, 245,0.12)` compiled to nothing
 * and focused inputs had no ring at all — measured box-shadow: none.
 */
const fieldClass =
  "w-full min-h-[3.25rem] rounded-[var(--radius-sm)] border border-[rgba(18,19,26,0.14)] bg-paper px-4 py-3.5 outline-none transition-[border-color,box-shadow] duration-200 hover:border-[rgba(18,19,26,0.26)] focus:border-accent focus:shadow-[0_0_0_3px_rgba(91,61,245,0.14)] aria-[invalid=true]:border-accent";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <motion.button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      // A considered rectangle rather than a full pill, and tall enough to
      // read as the decisive action. Width is fixed while pending so the
      // label swap cannot resize the button under the pointer.
      className="mt-2 inline-flex min-h-[3.5rem] items-center justify-center gap-2 self-start rounded-[var(--radius-sm)] bg-accent px-8 text-[0.9375rem] font-medium text-paper transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-70"
      whileHover={pending ? undefined : { backgroundColor: "#3A22C9" }}
      whileTap={pending ? undefined : { scale: 0.99 }}
      transition={hoverTransition}
    >
      {pending ? "Sending enquiry…" : "Send brief"}
      {!pending && <ArrowIcon className="h-4 w-4" />}
    </motion.button>
  );
}

function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      {/* Sentence-case sans labels: the tiny uppercase mono read as interface
          chrome rather than as the form asking a question. */}
      <label
        htmlFor={htmlFor}
        className="text-[0.875rem] font-medium text-ink/80"
      >
        {label}
        {optional && (
          <span className="ml-1.5 font-normal text-ink/45">(optional)</span>
        )}
      </label>
      {children}
      {error ? (
        // Carries a mark as well as the accent colour, so the error is not
        // signalled by colour alone.
        <span
          id={`${htmlFor}-error`}
          className="flex items-start gap-1.5 text-[0.8125rem] font-medium text-accent"
        >
          <span aria-hidden="true">!</span>
          {error}
        </span>
      ) : null}
    </div>
  );
}

/**
 * The closing statement of the page: a muted full-bleed image band with the
 * ask written over it, and the form as a paper panel overlapping the image's
 * bottom edge.
 *
 * Backdrop: Sean Pollock via Unsplash (photo-1486406146926), self-hosted at
 * public/images/contact-backdrop.jpg. Decorative — empty alt.
 */
export function Contact() {
  const [state, formAction] = useActionState(submitContact, initialState);
  const errors = state.fieldErrors;
  const v = state.values;

  return (
    <section id="contact" className="relative">
      <div data-theme="ink" className="relative overflow-hidden">
        {/* object-top holds the towers' convergence in frame: the default
            centred crop cut the point where the lines meet, which is the whole
            reason to use this photograph. Saturation comes down and the tone
            is pushed slightly cool so it sits with the brand rather than
            reading as stock architecture. */}
        <Image
          src="/images/contact-backdrop.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top [filter:grayscale(0.62)_brightness(0.82)_contrast(1.06)]"
        />
        {/* Two overlays, both restrained: a vertical ink gradient that keeps
            the type clear of the busy sky, and a very low blue-violet wash
            that ties the photograph to the palette without tinting it. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,19,26,0.80)_0%,rgba(18,19,26,0.62)_45%,rgba(18,19,26,0.92)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(150deg,rgba(43,127,255,0.12)_0%,rgba(91,61,245,0.10)_52%,transparent_82%)]"
        />

        <div className="shell relative pb-44 pt-[var(--section-y)] md:pb-52">
          <RevealText>
            <p className="t-mono text-[rgba(255,255,255,0.72)]">
              {contact.eyebrow}
            </p>
            <h2 className="t-display-lg mt-7 max-w-[20ch] text-paper">
              {contact.title.lead}{" "}
              <span className="text-[var(--accent-fg)]">
                {contact.title.accent}
              </span>
            </h2>
            <p className="t-body-lg mt-7 max-w-[34rem] leading-[1.62] text-[rgba(255,255,255,0.82)]">
              {contact.standfirst}
            </p>
          </RevealText>

          <RevealGroup
            as="ul"
            className="mt-9 flex flex-wrap gap-x-8 gap-y-3"
            stagger={0.07}
          >
            {contact.reassurances.map((item) => (
              <RevealItem key={item} as="li" className="flex items-center gap-3">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-[rgba(255,255,255,0.35)] text-[var(--accent-fg)]">
                  <CheckIcon className="h-3 w-3" />
                </span>
                <span className="t-body text-[rgba(255,255,255,0.88)]">
                  {item}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>

      {/* Paper panel overlapping the image band above. */}
      <div data-theme="bone" className="bg-[var(--bg)] pb-[var(--section-y)]">
        <div className="shell">
          <div className="relative -mt-32 md:-mt-36 lg:mx-auto lg:max-w-4xl">
            <form
              action={formAction}
              noValidate
              // A fine accent line along the top edge is the whole of the
              // brand detail on this surface — no glass, no glow.
              className="flex flex-col gap-5 overflow-hidden rounded-[22px] border border-[rgba(18,19,26,0.09)] bg-paper p-7 shadow-[0_1px_2px_rgba(18,19,26,0.04),0_20px_60px_rgba(18,19,26,0.08)] md:p-10"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(91,61,245,0.55),rgba(43,127,255,0.45),transparent)]"
              />

              {/* Both the field-level prompt and the could-not-send message
                  land here, announced rather than merely displayed. */}
              <div aria-live="polite" className="empty:hidden">
                {state.status !== "idle" && state.message ? (
                  <p
                    className={`text-[0.9375rem] font-medium ${
                      state.status === "unsent" ? "text-ink/80" : "text-accent"
                    }`}
                  >
                    {state.message}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" htmlFor="name" error={errors.name}>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    defaultValue={v.name}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={fieldClass}
                  />
                </Field>

                <Field label="Work email" htmlFor="email" error={errors.email}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    defaultValue={v.email}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={fieldClass}
                  />
                </Field>

                <Field label="Company" htmlFor="company" error={errors.company}>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    defaultValue={v.company}
                    aria-invalid={Boolean(errors.company)}
                    aria-describedby={
                      errors.company ? "company-error" : undefined
                    }
                    className={fieldClass}
                  />
                </Field>

                <Field label="Phone" htmlFor="phone" optional>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    defaultValue={v.phone}
                    className={fieldClass}
                  />
                </Field>
              </div>

              <Field
                label="Service needed"
                htmlFor="service"
                error={errors.service}
              >
                {/* Keyed on the echoed value: a select keeps its live value
                    across a re-render, so defaultValue alone silently dropped
                    the visitor's choice after a failed submit. */}
                <select
                  key={`service-${v.service}`}
                  id="service"
                  name="service"
                  defaultValue={v.service}
                  aria-invalid={Boolean(errors.service)}
                  aria-describedby={errors.service ? "service-error" : undefined}
                  className={fieldClass}
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  {contact.services.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Monthly budget" htmlFor="budget" error={errors.budget}>
                <select
                  key={`budget-${v.budget}`}
                  id="budget"
                  name="budget"
                  defaultValue={v.budget}
                  aria-invalid={Boolean(errors.budget)}
                  aria-describedby={errors.budget ? "budget-error" : undefined}
                  className={fieldClass}
                >
                  <option value="" disabled>
                    Select a range
                  </option>
                  {contact.budgets.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="What do you need?" htmlFor="brief" error={errors.brief}>
                <textarea
                  id="brief"
                  name="brief"
                  rows={6}
                  defaultValue={v.brief}
                  aria-invalid={Boolean(errors.brief)}
                  aria-describedby={errors.brief ? "brief-error" : undefined}
                  className={`${fieldClass} min-h-[9.5rem] resize-y md:min-h-[11rem]`}
                />
              </Field>

              <SubmitButton />
            </form>

            <RevealText delay={0.15}>
              <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <a href={`mailto:${site.email}`} className="t-body-lg font-medium">
                  {site.email}
                </a>
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="t-body text-[var(--muted)]"
                >
                  {site.phone}
                </a>
              </div>
            </RevealText>
          </div>
        </div>
      </div>
    </section>
  );
}

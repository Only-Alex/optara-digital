"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { motion } from "motion/react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { contact, site } from "@/lib/content";
import { hoverTransition } from "@/lib/motion";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";
import { ArrowIcon, CheckIcon } from "@/components/ui/Icons";

const initialState: ContactState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

// Focus is a border change plus a soft accent ring — visible without relying
// on colour alone against the field edge. aria-invalid picks up the accent
// border so an errored field is findable before reading its message.
const fieldClass =
  "w-full rounded-[var(--radius-sm)] border border-[var(--hairline)] bg-paper px-4 py-3.5 outline-none transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgba(59,30,255,0.12)] aria-[invalid=true]:border-accent";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <motion.button
      type="submit"
      disabled={pending}
      className="pill mt-2 justify-center bg-accent text-paper disabled:opacity-60"
      whileHover={pending ? undefined : { backgroundColor: "#1B0FA8", y: -2 }}
      whileTap={pending ? undefined : { scale: 0.98 }}
      transition={hoverTransition}
    >
      {pending ? "Sending…" : "Send brief"}
      {!pending && <ArrowIcon className="h-4 w-4" />}
    </motion.button>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
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
      </label>
      {children}
      {error ? (
        <span
          id={`${htmlFor}-error`}
          className="text-[0.8125rem] font-medium text-accent"
        >
          {error}
        </span>
      ) : null}
    </div>
  );
}

/**
 * The closing statement of the page: a muted full-bleed image band with the
 * ask written over it, and the form as a paper panel overlapping the image's
 * bottom edge — the reference site's layering, in our palette.
 *
 * Backdrop: Sean Pollock via Unsplash (photo-1486406146926), self-hosted at
 * public/images/contact-backdrop.jpg, desaturated in CSS and held behind an
 * ink gradient so the type always clears contrast. Decorative — empty alt.
 */
export function Contact() {
  const [state, formAction] = useActionState(submitContact, initialState);
  const errors = state.fieldErrors;

  return (
    <section id="contact" className="relative">
      <div data-theme="ink" className="relative overflow-hidden">
        <Image
          src="/images/contact-backdrop.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover [filter:grayscale(0.45)_brightness(0.85)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,19,26,0.78)_0%,rgba(18,19,26,0.6)_45%,rgba(18,19,26,0.9)_100%)]"
        />

        <div className="shell relative pb-44 pt-[var(--section-y)] md:pb-52">
          <RevealText>
            <p className="t-mono text-[rgba(255,255,255,0.72)]">
              {contact.eyebrow}
            </p>
            <h2 className="t-display-lg mt-6 max-w-[22ch] text-paper">
              {contact.title.lead}{" "}
              <span className="text-[var(--accent-fg)]">
                {contact.title.accent}
              </span>
            </h2>
            <p className="t-body-lg mt-7 max-w-[46ch] text-[rgba(255,255,255,0.78)]">
              {contact.standfirst}
            </p>
          </RevealText>

          <RevealGroup
            as="ul"
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3"
            stagger={0.07}
          >
            {contact.reassurances.map((item) => (
              <RevealItem key={item} as="li" className="flex items-center gap-3">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--accent-fg)] text-ink">
                  <CheckIcon className="h-3 w-3" />
                </span>
                <span className="t-body text-[rgba(255,255,255,0.86)]">
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
            {state.status === "success" ? (
              <div
                className="rounded-[22px] border border-[rgba(18,19,26,0.07)] bg-paper p-10 shadow-[0_1px_2px_rgba(18,19,26,0.05),0_6px_16px_rgba(18,19,26,0.06),0_18px_36px_rgba(18,19,26,0.08)]"
                role="status"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-paper">
                  <CheckIcon className="h-5 w-5" />
                </span>
                <p className="t-body-lg mt-6 max-w-[36ch]">{state.message}</p>
              </div>
            ) : (
              <form
                action={formAction}
                noValidate
                className="flex flex-col gap-5 rounded-[22px] border border-[rgba(18,19,26,0.07)] bg-paper p-7 shadow-[0_1px_2px_rgba(18,19,26,0.05),0_6px_16px_rgba(18,19,26,0.06),0_18px_36px_rgba(18,19,26,0.08)] md:p-10"
              >
                {state.status === "error" ? (
                  <p className="t-caption text-accent" role="alert">
                    {state.message}
                  </p>
                ) : null}

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Name" htmlFor="name" error={errors.name}>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className={fieldClass}
                    />
                  </Field>

                  <Field label="Email" htmlFor="email" error={errors.email}>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
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
                      aria-invalid={Boolean(errors.company)}
                      aria-describedby={
                        errors.company ? "company-error" : undefined
                      }
                      className={fieldClass}
                    />
                  </Field>

                  <Field label="Phone (optional)" htmlFor="phone">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      className={fieldClass}
                    />
                  </Field>
                </div>

                <Field
                  label="Service needed"
                  htmlFor="service"
                  error={errors.service}
                >
                  <select
                    id="service"
                    name="service"
                    defaultValue=""
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

                <Field
                  label="Monthly budget"
                  htmlFor="budget"
                  error={errors.budget}
                >
                  <select
                    id="budget"
                    name="budget"
                    defaultValue=""
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

                <Field
                  label="What do you need?"
                  htmlFor="brief"
                  error={errors.brief}
                >
                  <textarea
                    id="brief"
                    name="brief"
                    rows={4}
                    aria-invalid={Boolean(errors.brief)}
                    aria-describedby={errors.brief ? "brief-error" : undefined}
                    className={`${fieldClass} resize-none`}
                  />
                </Field>

                <SubmitButton />
              </form>
            )}

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

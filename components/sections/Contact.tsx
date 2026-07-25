"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
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

const fieldClass =
  "w-full rounded-[var(--radius-sm)] border border-[var(--hairline)] bg-paper px-4 py-3.5 outline-none transition-colors duration-200 focus:border-accent";

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
      <label htmlFor={htmlFor} className="t-mono text-[var(--muted)]">
        {label}
      </label>
      {children}
      {error ? (
        <span id={`${htmlFor}-error`} className="t-caption text-accent">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export function Contact() {
  const [state, formAction] = useActionState(submitContact, initialState);
  const errors = state.fieldErrors;

  return (
    <section id="contact" data-theme="paper" className="section">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <RevealText>
            <p className="t-mono text-[var(--muted)]">{contact.eyebrow}</p>
            <h2 className="t-display-lg mt-6">
              {contact.title.lead}{" "}
              <span className="text-accent">{contact.title.accent}</span>
            </h2>
            <p className="t-body-lg mt-7 max-w-[42ch] text-[var(--muted)]">
              {contact.standfirst}
            </p>
          </RevealText>

          <RevealGroup as="ul" className="mt-10 flex flex-col gap-3" stagger={0.07}>
            {contact.reassurances.map((item) => (
              <RevealItem key={item} as="li" className="flex items-center gap-3">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-paper">
                  <CheckIcon className="h-3 w-3" />
                </span>
                <span className="t-body">{item}</span>
              </RevealItem>
            ))}
          </RevealGroup>

          <RevealText delay={0.2}>
            <div className="mt-12 flex flex-col gap-2 border-t border-[var(--hairline)] pt-8">
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

        <div className="lg:col-span-6 lg:col-start-7">
          {state.status === "success" ? (
            <div className="card p-10" role="status">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-paper">
                <CheckIcon className="h-5 w-5" />
              </span>
              <p className="t-body-lg mt-6 max-w-[36ch]">{state.message}</p>
            </div>
          ) : (
            <form
              action={formAction}
              noValidate
              className="card flex flex-col gap-5 p-7 md:p-9"
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
                    aria-describedby={errors.company ? "company-error" : undefined}
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

              <Field label="Service needed" htmlFor="service" error={errors.service}>
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

              <Field label="Monthly budget" htmlFor="budget" error={errors.budget}>
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

              <Field label="What do you need?" htmlFor="brief" error={errors.brief}>
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
        </div>
      </div>
    </section>
  );
}

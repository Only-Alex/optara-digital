"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "motion/react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { contact } from "@/lib/content";
import { EASE, hoverTransition } from "@/lib/motion";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";

const initialState: ContactState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

const fieldClass =
  "w-full border-b border-[var(--hairline)] bg-transparent pb-3 pt-2 outline-none transition-[border-color,border-width] duration-200 focus:border-b-2 focus:border-blue";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <motion.button
      type="submit"
      disabled={pending}
      data-cursor="Send"
      className="t-mono mt-12 rounded-full bg-blue px-8 py-4 text-paper disabled:opacity-60"
      whileHover={pending ? undefined : { backgroundColor: "#0A1454", scale: 1.02 }}
      whileTap={pending ? undefined : { scale: 0.98 }}
      transition={hoverTransition}
    >
      {pending ? "Sending…" : "Send the brief"}
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
        <span id={`${htmlFor}-error`} className="t-caption text-blue">
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
    <section id="contact" data-theme="light" className="section">
      <div className="shell grid-12 gap-y-16">
        <div className="col-span-12 lg:col-span-5">
          <RevealText>
            <p className="t-mono text-[var(--muted)]">{contact.eyebrow}</p>
          </RevealText>
          <RevealText delay={0.08}>
          <h2 className="t-display-lg mt-8">
            {contact.title.map((word, i) =>
              word.italic ? (
                <em key={i} className="block italic">
                  {word.text}
                </em>
              ) : (
                <span key={i} className="block">
                  {word.text}
                </span>
              ),
            )}
          </h2>
          </RevealText>
          <RevealText delay={0.16}>
            <p className="t-body-lg mt-10 max-w-[38ch] text-[var(--muted)]">
              {contact.standfirst}
            </p>
          </RevealText>
          <motion.a
            href={`mailto:${contact.email}`}
            data-cursor="Email"
            className="t-body-lg mt-12 inline-block"
            initial="rest"
            whileHover="hover"
            whileFocus="hover"
            animate="rest"
          >
            <span className="relative inline-block pb-1">
              {contact.email}
              <span className="absolute inset-x-0 bottom-0 h-px bg-[var(--fg)]" />
              <motion.span
                className="absolute inset-x-0 bottom-0 h-px origin-left bg-blue"
                variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                transition={{ duration: 0.35, ease: EASE }}
              />
            </span>
          </motion.a>
        </div>

        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          {state.status === "success" ? (
            <p className="t-body-lg max-w-[40ch]" role="status">
              {state.message}
            </p>
          ) : (
            <RevealGroup as="div" stagger={0.07} soft>
            <form action={formAction} noValidate className="flex flex-col gap-10">
              {state.status === "error" ? (
                <p className="t-caption text-blue" role="alert">
                  {state.message}
                </p>
              ) : null}

              <RevealItem>
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
              </RevealItem>

              <RevealItem>
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
              </RevealItem>

              <RevealItem>
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
              </RevealItem>

              <RevealItem>
                <Field label="Monthly media budget" htmlFor="budget" error={errors.budget}>
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
              </RevealItem>

              <RevealItem>
                <Field label="Project brief" htmlFor="brief" error={errors.brief}>
                <textarea
                  id="brief"
                  name="brief"
                  rows={4}
                  aria-invalid={Boolean(errors.brief)}
                  aria-describedby={errors.brief ? "brief-error" : undefined}
                  className={`${fieldClass} resize-none`}
                />
                </Field>
              </RevealItem>

              <RevealItem>
                <SubmitButton />
              </RevealItem>
            </form>
            </RevealGroup>
          )}
        </div>
      </div>
    </section>
  );
}

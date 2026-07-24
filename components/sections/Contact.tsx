"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { contact } from "@/lib/content";

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
    <button
      type="submit"
      disabled={pending}
      data-cursor="Send"
      className="t-mono mt-12 bg-blue px-8 py-4 text-paper transition-colors duration-200 hover:bg-blue-deep disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send the brief"}
    </button>
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
          <p className="t-mono text-[var(--muted)]">{contact.eyebrow}</p>
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
          <p className="t-body-lg mt-10 max-w-[38ch] text-[var(--muted)]">
            {contact.standfirst}
          </p>
          <a
            href={`mailto:${contact.email}`}
            data-cursor="Email"
            className="group mt-12 inline-block t-body-lg"
          >
            <span className="relative inline-block pb-1">
              {contact.email}
              <span className="absolute inset-x-0 bottom-0 h-px bg-[var(--fg)]" />
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-blue transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
            </span>
          </a>
        </div>

        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          {state.status === "success" ? (
            <p className="t-body-lg max-w-[40ch]" role="status">
              {state.message}
            </p>
          ) : (
            <form action={formAction} noValidate className="flex flex-col gap-10">
              {state.status === "error" ? (
                <p className="t-caption text-blue" role="alert">
                  {state.message}
                </p>
              ) : null}

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

              <SubmitButton />
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

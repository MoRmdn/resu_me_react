"use client";

import type { FormEvent } from "react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { contactCopy } from "@/content/copy";
import { contact, socials } from "@/content/site";
import { useContactForm, type ContactFields } from "@/lib/useContactForm";
import { cn } from "@/lib/cn";

export function Contact() {
  const { fields, errors, status, setField, submit } = useContactForm();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submit();
  };

  return (
    <Section id="contact" tone="ink-900">
      <div className="grid gap-14 lg:grid-cols-[100fr_85fr] lg:gap-16">
        <div>
          <Reveal>
            <Eyebrow>{contactCopy.eyebrow}</Eyebrow>
            <h2 className="mt-6 text-display-l text-balance">
              <span className="block">{contactCopy.headline[0]}</span>
              <span className="block">
                to <span className="text-copper">{contactCopy.headline[1].replace("to ", "")}</span>
              </span>
            </h2>
            <p className="mt-7 max-w-[46ch] text-body-l text-bone-70">{contactCopy.blurb}</p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href={contact.emailUrl}>{contact.email}</ButtonLink>
              <ButtonLink href={contact.phoneUrl} variant="ghost" className="font-mono">
                {contact.phoneDisplay}
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="mt-10 flex items-center gap-3 border-t border-line pt-7">
              <span className="pulse-dot size-1.5 rounded-full bg-jade" aria-hidden />
              <div>
                <p className="eyebrow text-bone-52">{contactCopy.availabilityLabel}</p>
                <p className="mt-1.5 text-body text-bone-70">{contactCopy.availability}</p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <ul className="hairline-grid border border-line">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex min-h-16 items-center justify-between gap-4 bg-ink-900 px-6 py-5 transition-colors duration-fast ease-fast hover:bg-ink-700"
                >
                  <span className="eyebrow text-bone-52">{s.label}</span>
                  <span className="flex items-center gap-2 text-body text-bone">
                    {s.handle} <span aria-hidden className="text-bone-52">&#8599;</span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </span>
                </a>
              </li>
            ))}
            <li>
              <a
                href={contact.resumeUrl}
                download
                className="flex min-h-16 items-center justify-between gap-4 bg-ink-900 px-6 py-5 transition-colors duration-fast ease-fast hover:bg-ink-700"
              >
                <span className="eyebrow text-bone-52">Résumé</span>
                <span className="flex items-center gap-2 text-body text-bone">
                  PDF <span aria-hidden className="text-bone-52">&darr;</span>
                </span>
              </a>
            </li>
          </ul>
        </Reveal>
      </div>

      <Reveal delay={0.06}>
        <form
          onSubmit={onSubmit}
          noValidate
          className="mt-16 rounded-lg bg-ink-700 p-7 elevation-card md:p-10"
        >
          <Eyebrow>{contactCopy.formEyebrow}</Eyebrow>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Field
              name="name"
              autoComplete="name"
              value={fields.name}
              error={errors.name}
              onChange={setField}
              required
            />
            <Field
              name="email"
              type="email"
              autoComplete="email"
              value={fields.email}
              error={errors.email}
              onChange={setField}
              required
            />
            <Field
              name="projectType"
              value={fields.projectType}
              error={errors.projectType}
              onChange={setField}
            />
            <Field
              name="budget"
              value={fields.budget}
              error={errors.budget}
              onChange={setField}
            />
          </div>

          <div className="mt-6">
            <Field
              name="message"
              multiline
              value={fields.message}
              error={errors.message}
              onChange={setField}
              required
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex min-h-11 items-center rounded-md bg-copper px-7 py-3.5 text-[0.96875rem] font-semibold text-ink-900 transition-[transform,background-color] duration-fast ease-fast hover:-translate-y-0.5 hover:bg-copper-bright active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {status === "submitting" ? contactCopy.submitting : contactCopy.submit}
            </button>

            {/* Result is announced, not just coloured. */}
            <p
              role="status"
              aria-live="polite"
              className={cn(
                "text-body",
                status === "sent" && "text-jade",
                status === "error" && "text-rose",
              )}
            >
              {status === "sent" && contactCopy.success}
              {status === "error" && contactCopy.failure}
            </p>
          </div>
        </form>
      </Reveal>
    </Section>
  );
}

function Field({
  name,
  value,
  error,
  onChange,
  type = "text",
  multiline,
  required,
  autoComplete,
}: {
  name: keyof ContactFields;
  value: string;
  error?: string;
  onChange: (key: keyof ContactFields, value: string) => void;
  type?: string;
  multiline?: boolean;
  required?: boolean;
  autoComplete?: string;
}) {
  const copy = contactCopy.fields[name];
  const id = `contact-${name}`;
  const errorId = `${id}-error`;

  const inputClass = cn(
    "w-full rounded-md border bg-ink-600 px-3.5 py-3.5 text-body text-bone",
    "placeholder:text-bone-52 transition-colors duration-fast ease-fast",
    "focus:outline-none focus-visible:outline-none",
    error
      ? "border-rose focus:border-rose"
      : "border-line focus:border-copper focus:shadow-[0_0_0_1px_var(--color-copper),0_0_40px_rgb(242_118_46/0.18)]",
  );

  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-2.5 block text-bone-52">
        {copy.label}
        {required && (
          <span className="text-copper" aria-hidden>
            {" "}
            *
          </span>
        )}
      </label>

      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={5}
          required={required}
          value={value}
          placeholder={copy.placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => onChange(name, e.target.value)}
          className={cn(inputClass, "resize-y")}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          value={value}
          placeholder={copy.placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => onChange(name, e.target.value)}
          className={inputClass}
        />
      )}

      {error && (
        <p id={errorId} className="mt-2 text-caption text-rose">
          {error}
        </p>
      )}
    </div>
  );
}

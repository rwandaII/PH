"use client";

import { sendForm } from "@/lib/send-form";
import { useState } from "react";
import { Chevron } from "./icons";

type FieldErrors = Record<string, string>;

const labelClass = "text-[13px] font-semibold text-navy";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError("");
    setFieldErrors({});

    const result = await sendForm("/contact", Object.fromEntries(new FormData(form)));
    if (result.ok) {
      form.reset();
      setStatus("sent");
      return;
    }
    setFieldErrors(result.fields);
    setError(result.error);
    setStatus("idle");
  }

  if (status === "sent") {
    return (
      <div role="status" className="mt-[30px] border border-[#dcdcdc] border-l-4 border-l-accent px-[22px] py-6">
        <p className="text-[16px] font-semibold text-navy">Message sent</p>
        <p className="mt-2 text-[14px] text-muted">Thank you. We will reply by email as soon as we can.</p>
        <button type="button" className="mt-3.5 min-h-11 text-[12px] font-bold text-accent" onClick={() => setStatus("idle")}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-[30px] grid gap-x-5 gap-y-[22px] sm:grid-cols-2">
      <Field label="Your name" name="name" error={fieldErrors.name} required autoComplete="name" />
      <Field label="Email" name="email" type="email" error={fieldErrors.email} required autoComplete="email" />
      <div className="sm:col-span-2">
        <Field label="Subject" name="subject" error={fieldErrors.subject} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={7}
          required
          maxLength={5000}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
          className="field resize-y"
        />
        {fieldErrors.message && (
          <p id="message-error" className="mt-1 text-[13px] text-danger">
            {fieldErrors.message}
          </p>
        )}
      </div>
      {error && (
        <p role="alert" className="text-danger sm:col-span-2">
          {error}
        </p>
      )}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-primary inline-flex min-h-12 items-center gap-4 px-[30px] text-[14px] font-semibold disabled:opacity-60"
        >
          <Chevron />
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  type = "text",
  ...rest
}: { label: string; name: string; error?: string; type?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className="field"
        {...rest}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

"use client";

import { sendForm } from "@/lib/send-form";
import { useState } from "react";
import { Chevron } from "./icons";

const labelClass = "text-[13px] font-semibold text-navy";

/**
 * "Tell us what you think about us" (Contact page). What people send waits for staff approval
 * and then appears with their name in "What people say" on the home page.
 */
export function TestimonialForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError("");
    setFieldErrors({});
    const result = await sendForm("/testimonials", Object.fromEntries(new FormData(form)));
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
      <div role="status" className="mt-[30px] border border-[#dcdcdc] border-l-4 border-l-accent bg-white px-[22px] py-6">
        <p className="text-[16px] font-semibold text-navy">Thank you for your comment</p>
        <p className="mt-2 text-[14px] text-muted">
          Our team will read it first. Once it is approved, it will appear with your name on our home page.
        </p>
        <button type="button" className="mt-3.5 min-h-11 text-[12px] font-bold text-accent" onClick={() => setStatus("idle")}>
          Write another comment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-[30px] grid gap-x-5 gap-y-[22px] sm:grid-cols-2">
      <div>
        <label htmlFor="t-name" className={labelClass}>
          Your name
        </label>
        <input
          id="t-name"
          name="name"
          required
          maxLength={120}
          autoComplete="name"
          aria-invalid={!!fieldErrors.name}
          aria-describedby={fieldErrors.name ? "t-name-error" : undefined}
          className="field"
        />
        {fieldErrors.name && (
          <p id="t-name-error" className="mt-1 text-[13px] text-danger">
            {fieldErrors.name}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="t-place" className={labelClass}>
          Where you are from or what you do <span className="font-normal text-grey">(optional)</span>
        </label>
        <input id="t-place" name="place" maxLength={160} placeholder="e.g. Teacher, Musanze" className="field" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="t-message" className={labelClass}>
          What would you like to say about us?
        </label>
        <textarea
          id="t-message"
          name="message"
          rows={5}
          required
          maxLength={3000}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={fieldErrors.message ? "t-message-error" : "t-message-hint"}
          className="field resize-y"
        />
        {fieldErrors.message ? (
          <p id="t-message-error" className="mt-1 text-[13px] text-danger">
            {fieldErrors.message}
          </p>
        ) : (
          <p id="t-message-hint" className="mt-1 text-[12.5px] text-grey">
            Your comment and name appear on our home page after our team approves them.
          </p>
        )}
      </div>
      {/* Spam trap: hidden from people, filled in only by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="t-website">Website</label>
        <input id="t-website" name="website" tabIndex={-1} autoComplete="off" />
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
          {status === "sending" ? "Sending…" : "Send my comment"}
        </button>
      </div>
    </form>
  );
}

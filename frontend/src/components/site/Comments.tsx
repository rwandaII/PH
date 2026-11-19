"use client";

import { useState } from "react";
import type { NewsComment } from "@/lib/types";

const dateTime = (v: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(v));

/** First letters of a name, for the round badge next to each comment. */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

/**
 * Approved comments on a story, and a form to add one. New comments are checked by the
 * program's staff before they appear, and the form says so.
 */
export function Comments({ slug, initial }: { slug: string; initial: NewsComment[] }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError("");
    setFieldErrors({});
    const res = await fetch(`/api/public/news/${encodeURIComponent(slug)}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    }).catch(() => null);
    if (res?.ok) {
      form.reset();
      setStatus("sent");
      return;
    }
    const body = await res?.json().catch(() => null);
    const fields: Record<string, string> = {};
    for (const f of body?.fields ?? []) fields[f.path] = f.message;
    setFieldErrors(fields);
    setError(body?.error && !body.fields ? body.error : res ? "" : "The comment could not be sent. Check your connection and try again.");
    setStatus("idle");
  }

  return (
    <section id="comments" aria-labelledby="comments-heading" className="scroll-mt-6">
      <h2 id="comments-heading" className="font-display text-[30px] font-normal leading-[1.1] text-navy">
        {initial.length > 0 ? `${initial.length} ${initial.length === 1 ? "comment" : "comments"}` : "Comments"}
      </h2>

      {initial.length === 0 ? (
        <p className="mt-3 text-[15px] text-muted">No comments yet. Be the first to share what you think of this story.</p>
      ) : (
        <ul className="mt-8 space-y-7">
          {initial.map((c) => (
            <li key={c.id} className="flex gap-4">
              <span aria-hidden="true" className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-mist text-[14px] font-bold text-navy">
                {initials(c.name)}
              </span>
              <div className="min-w-0">
                <p className="text-[14.5px]">
                  <span className="font-bold text-navy">{c.name}</span>
                  <span className="ml-3 text-[12.5px] text-muted">{dateTime(c.createdAt)}</span>
                </p>
                <p className="mt-1.5 whitespace-pre-wrap text-[15px] leading-[1.65] text-ink">{c.message}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-12 border-t border-[#bcd6e3] pt-8">
        <h3 className="text-[18px] font-semibold text-navy">Leave a comment</h3>
        {status === "sent" ? (
          <div role="status" className="mt-5 border-l-4 border-accent bg-mist px-5 py-4">
            <p className="font-semibold text-navy">Thank you for your comment</p>
            <p className="mt-1 text-[14px] text-ink">It will appear here once a member of the program&apos;s staff has read it.</p>
            <button type="button" onClick={() => setStatus("idle")} className="mt-2 min-h-10 text-[13.5px] font-semibold text-accent">
              Write another comment
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-5 grid gap-5">
            {/* Spam trap: hidden from people, filled in by bots. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                Website <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <div>
              <label htmlFor="c-name" className="text-[13px] font-semibold text-navy">
                Your name
              </label>
              <input
                id="c-name"
                name="name"
                maxLength={120}
                autoComplete="name"
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "c-name-err" : undefined}
                className="field mt-2 w-full max-w-[420px]"
              />
              {fieldErrors.name && (
                <p id="c-name-err" className="mt-1.5 text-[13px] text-danger">
                  {fieldErrors.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="c-message" className="text-[13px] font-semibold text-navy">
                Your comment
              </label>
              <textarea
                id="c-message"
                name="message"
                rows={5}
                maxLength={2000}
                aria-invalid={!!fieldErrors.message}
                aria-describedby={fieldErrors.message ? "c-message-err" : "c-note"}
                className="field mt-2 w-full"
              />
              {fieldErrors.message && (
                <p id="c-message-err" className="mt-1.5 text-[13px] text-danger">
                  {fieldErrors.message}
                </p>
              )}
              <p id="c-note" className="mt-2 text-[12.5px] text-muted">
                Comments are read by the program&apos;s staff before they appear. Please be kind and stay on the subject.
              </p>
            </div>
            {error && (
              <p role="alert" className="text-[14px] text-danger">
                {error}
              </p>
            )}
            <div>
              <button type="submit" disabled={status === "sending"} className="btn-primary inline-flex min-h-12 items-center px-7 text-[14px] font-semibold disabled:opacity-60">
                {status === "sending" ? "Sending…" : "Post comment"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

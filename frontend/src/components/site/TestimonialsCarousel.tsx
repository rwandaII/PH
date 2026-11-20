"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { formatDate } from "@/lib/format";
import type { Testimonial } from "@/lib/types";

/** Lines of a comment shown before "View more". */
const LINES = 4;
const LINE_HEIGHT = 22; // px, matches leading-[22px] below

/**
 * "What people say": approved comments from the Contact page, two at a time, in the same
 * testimonial style as the home team section. Long comments show four lines; "View more" opens
 * the card smoothly to the full text.
 */
export function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(items.length / 2);
  const shown = items.slice(page * 2, page * 2 + 2);
  const go = (step: number) => setPage((p) => (p + step + pages) % pages);

  return (
    <section id="what-people-say" aria-labelledby="what-people-say-heading" className="bg-white">
      <div className="mx-auto max-w-[1172px] px-4 pb-24">
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line pt-14">
          <div>
            <h2 id="what-people-say-heading" className="font-display text-[30px] font-normal leading-[1.1] text-navy sm:text-[34px]">
              What people say about us
            </h2>
            <p className="mt-2 text-[14.5px] text-muted">Comments from the people and communities we work with.</p>
          </div>
          <Link
            href="/contact#comment"
            className="inline-flex min-h-11 items-center border border-accent px-5 text-[14px] font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
          >
            Share your comment
          </Link>
        </div>

        {items.length === 0 ? (
          <p className="mt-10 max-w-[60ch] text-[15px] leading-[1.6] text-muted">
            No comments yet. Has our work made a difference for you or your community?{" "}
            <Link href="/contact#comment" className="font-semibold text-accent hover:underline">
              Be the first to tell us
            </Link>
            .
          </p>
        ) : (
          <div className="mt-10 flex items-start gap-2">
            {pages > 1 && <Arrow label="Previous comments" onClick={() => go(-1)} d="M8 2 2 8l6 6" />}
            <ul key={page} className="flex flex-1 flex-wrap gap-x-12 gap-y-10">
              {shown.map((t, i) => (
                <li key={t.id} className="testimonial-in flex-[1_1_420px]" style={{ animationDelay: `${i * 120}ms` }}>
                  <TestimonialCard t={t} />
                </li>
              ))}
            </ul>
            {pages > 1 && <Arrow label="Next comments" onClick={() => go(1)} d="M2 2l6 6-6 6" />}
          </div>
        )}
        {pages > 1 && (
          <p className="mt-6 text-center text-[12.5px] text-grey" aria-live="polite">
            {page + 1} of {pages}
          </p>
        )}
      </div>
    </section>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(0);
  const collapsed = LINES * LINE_HEIGHT;
  const long = full > collapsed + 2;

  // Measure the whole comment, and again when the width changes.
  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const measure = () => setFull(el.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [t.message]);

  const initials = t.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <article className="testimonial-card lift-card flex flex-col items-start gap-5 bg-white p-2 sm:flex-row">
      <div aria-hidden="true" className="testimonial-avatar relative flex h-28 w-28 flex-none items-center justify-center rounded-full bg-[#e3e3e3]">
        <span className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[radial-gradient(120%_120%_at_30%_20%,#48cae4_0%,#0077b6_50%,#023e7d_100%)] text-[30px] font-bold text-white">
          {initials || "“"}
        </span>
        <span className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[26px] leading-none text-accent shadow-md">
          ”
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="relative">
          <p
            ref={textRef}
            id={`testimonial-${t.id}`}
            className="font-text overflow-hidden whitespace-pre-line text-[14.5px] leading-[22px] text-[#555555] transition-[max-height] duration-500 ease-out"
            style={{ maxHeight: open || !long ? (full || undefined) : collapsed }}
          >
            {t.message}
          </p>
          {long && !open && (
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent" />
          )}
        </div>
        {long && (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={`testimonial-${t.id}`}
            onClick={() => setOpen((v) => !v)}
            className="mt-2 inline-flex min-h-9 items-center gap-1.5 text-[13px] font-semibold text-accent hover:underline"
          >
            {open ? "View less" : "View more"}
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
              <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <p className="mt-5 text-[13px] font-bold text-band">{t.name}</p>
        <p className="mt-0.5 text-[12px] text-grey">
          {[t.place, formatDate(t.createdAt)].filter(Boolean).join(", ")}
        </p>
      </div>
    </article>
  );
}

function Arrow({ label, onClick, d }: { label: string; onClick: () => void; d: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="mt-10 flex h-11 w-11 flex-none items-center justify-center text-[#6cb4d9] transition-transform hover:scale-110 hover:text-accent"
    >
      <svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={d} />
      </svg>
    </button>
  );
}

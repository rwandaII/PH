"use client";

import { useState } from "react";

const pageUrl = () => window.location.href.split("#")[0];

/** Share the current page on WhatsApp, Facebook, X or by email, or copy its link. */
export function ShareLinks({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const t = encodeURIComponent(title);
  // Each link is built when it is clicked, from the address the reader is on.
  const links: { label: string; build: (u: string) => string }[] = [
    { label: "WhatsApp", build: (u) => `https://wa.me/?text=${t}%20${u}` },
    { label: "Facebook", build: (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { label: "X", build: (u) => `https://x.com/intent/post?text=${t}&url=${u}` },
    { label: "Email", build: (u) => `mailto:?subject=${t}&body=${u}` },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
      <span className="mr-2 text-[13.5px] font-semibold text-navy">Share this story</span>
      {links.map((l) => (
        <a
          key={l.label}
          href="#"
          onClick={(e) => {
            e.currentTarget.href = l.build(encodeURIComponent(pageUrl()));
          }}
          target={l.label === "Email" ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center border border-[#bcd6e3] px-4 text-[13px] font-semibold text-navy transition-colors hover:border-accent hover:bg-accent hover:text-white"
        >
          {l.label}
        </a>
      ))}
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard?.writeText(pageUrl()).catch(() => undefined);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="inline-flex min-h-10 items-center border border-[#bcd6e3] px-4 text-[13px] font-semibold text-navy transition-colors hover:border-accent hover:bg-accent hover:text-white"
      >
        <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
      </button>
    </div>
  );
}

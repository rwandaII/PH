"use client";

import { Img } from "@/components/site/Img";
import { useEffect, useRef, useState } from "react";
import { formatDay } from "@/lib/format";
import type { Certificate, CertificateKind } from "@/lib/types";

type Filter = "all" | CertificateKind;

const KIND_LABEL: Record<CertificateKind, string> = { certificate: "Certificate", appreciation: "Appreciation" };

/**
 * Certificates and appreciations as framed documents, with tabs to show one kind.
 * Choosing a document opens it full size in a dialog (Escape or the close button shuts it).
 */
export function CertificatesBrowser({ items }: { items: Certificate[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<Certificate | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const counts = {
    all: items.length,
    certificate: items.filter((c) => c.kind === "certificate").length,
    appreciation: items.filter((c) => c.kind === "appreciation").length,
  };
  const shown = filter === "all" ? items : items.filter((c) => c.kind === filter);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "certificate", label: "Certificates" },
    { key: "appreciation", label: "Appreciations" },
  ];

  return (
    <>
      <div role="tablist" aria-label="Show" className="mt-8 flex flex-wrap gap-x-8 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={filter === t.key}
            onClick={() => setFilter(t.key)}
            className={`-mb-px min-h-11 border-b-[3px] text-[14.5px] font-semibold transition-colors ${
              filter === t.key ? "border-accent text-navy" : "border-transparent text-muted hover:text-navy"
            }`}
          >
            {t.label} <span className="font-normal text-grey">({counts[t.key]})</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="mt-10 max-w-[56ch] text-[15px] leading-[1.6] text-muted">
          {filter === "appreciation"
            ? "No appreciations have been added yet. Letters and awards of appreciation the program receives will appear here."
            : filter === "certificate"
              ? "No certificates have been added yet."
              : "Certificates and appreciations will appear here soon."}
        </p>
      ) : (
        <ul className="mt-10 grid gap-x-10 gap-y-14 md:grid-cols-2">
          {shown.map((c) => (
            <li key={c.id} className="lift-card bg-white">
              <button type="button" onClick={() => setOpen(c)} className="group block w-full text-left" aria-label={`Open ${c.title} full size`}>
                <span className="float-card relative block bg-mist p-4 sm:p-6">
                  <span aria-hidden="true" className="absolute bottom-0 right-0 h-16 w-16 opacity-70 [background-image:url(/patterns/cubes.svg)] [background-size:24.25px_42px]" />
                  {c.image ? (
                    <Img
                      src={c.image}
                      alt={`${c.title}, ${c.issuer}`}
                      loading="lazy"
                      className="relative mx-auto block aspect-[3/2] w-full bg-white object-contain shadow-[0_18px_36px_-20px_rgba(0,30,70,.55)] transition-transform duration-300 group-hover:-translate-y-1"
                    />
                  ) : (
                    <span className="relative flex aspect-[3/2] w-full items-center justify-center bg-white text-[13px] text-grey">No scan yet</span>
                  )}
                </span>
              </button>
              <p className="mt-5 text-[12.5px] font-semibold text-accent">{KIND_LABEL[c.kind]}</p>
              <h3 className="font-display mt-1 text-[24px] font-normal leading-[1.15] text-navy">{c.title}</h3>
              <p className="mt-2 text-[14px] text-ink">
                {c.issuer}
                {c.issuer && c.issuedOn && <span className="text-grey">, </span>}
                {c.issuedOn && <time dateTime={c.issuedOn.slice(0, 10)}>{formatDay(c.issuedOn)}</time>}
              </p>
              {c.description && <p className="mt-3 line-clamp-4 max-w-[60ch] text-[14px] leading-[1.6] text-muted">{c.description}</p>}
              <button type="button" onClick={() => setOpen(c)} className="mt-4 min-h-11 text-[14px] font-semibold text-accent hover:underline">
                View full size
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        aria-labelledby="certificate-title"
        className="m-auto max-h-[94vh] w-[min(1100px,94vw)] overflow-auto bg-white p-0 text-ink backdrop:bg-[rgba(1,24,48,.85)]"
      >
        {open && (
          <div>
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-white px-5 py-4 sm:px-7">
              <div>
                <p className="text-[12.5px] font-semibold text-accent">{KIND_LABEL[open.kind]}</p>
                <h2 id="certificate-title" className="font-display text-[22px] font-normal leading-[1.15] text-navy sm:text-[26px]">
                  {open.title}
                </h2>
                <p className="mt-1 text-[13.5px] text-muted">
                  {[open.issuer, formatDay(open.issuedOn)].filter(Boolean).join(", ")}
                </p>
              </div>
              <button type="button" onClick={() => setOpen(null)} className="min-h-11 shrink-0 bg-navy px-4 text-[13px] font-semibold text-white hover:bg-accent">
                Close
              </button>
            </div>
            {open.image && <Img src={open.image} alt={`${open.title}, ${open.issuer}`} className="block h-auto w-full" />}
            {open.description && <p className="px-5 py-5 text-[14.5px] leading-[1.65] sm:px-7">{open.description}</p>}
          </div>
        )}
      </dialog>
    </>
  );
}

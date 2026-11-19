"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Chevron } from "@/components/site/icons";

export const btnPrimary =
  "btn-primary inline-flex min-h-11 items-center justify-center gap-3 px-7 text-[14px] font-semibold disabled:opacity-60";
export const btnPlain =
  "inline-flex min-h-11 items-center justify-center gap-3 border border-line bg-white px-6 text-[13px] font-semibold text-navy hover:border-navy disabled:opacity-60";
export const labelClass = "block text-[13px] font-semibold text-navy";
export const hintClass = "mt-1 text-[12.5px] text-muted";

/** Two-tone ALU heading for dashboard pages, with optional action on the right. */
export function PageHead({
  light,
  bold,
  intro,
  action,
  back,
}: {
  light: string;
  bold: string;
  intro?: string;
  action?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {back && (
          <Link href={back.href} className="mb-3 inline-flex min-h-8 items-center gap-2 text-[13px] font-semibold text-accent">
            <Chevron className="rotate-180" size={11} /> {back.label}
          </Link>
        )}
        {/* One plain heading in sentence case, e.g. "Manage team members" */}
        <h1 className="font-display text-[32px] font-medium leading-[1.1] text-navy">{`${light} ${bold}`.replace(/\.$/, "")}</h1>
        {intro && <p className="mt-2 text-[14px] text-muted">{intro}</p>}
      </div>
      {action}
    </div>
  );
}

export function Notice({ kind = "info", children }: { kind?: "info" | "error" | "success"; children: React.ReactNode }) {
  const colors = {
    info: "border-l-navy",
    error: "border-l-danger text-danger",
    success: "border-l-[#2e7d4f]",
  };
  return (
    <div role={kind === "error" ? "alert" : "status"} className={`border border-line border-l-4 bg-white px-4 py-3 text-[14px] ${colors[kind]}`}>
      {children}
    </div>
  );
}

/** Delete button that asks for confirmation inline (no browser pop-up). */
export function ConfirmDelete({
  onConfirm,
  label = "Delete",
  disabled,
}: {
  onConfirm: () => Promise<void> | void;
  label?: string;
  disabled?: boolean;
}) {
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!asking) return;
    const t = setTimeout(() => setAsking(false), 5000);
    return () => clearTimeout(t);
  }, [asking]);

  if (!asking) {
    return (
      <button type="button" disabled={disabled} onClick={() => setAsking(true)} className="min-h-9 px-1 text-[13px] font-semibold text-danger hover:underline disabled:opacity-50">
        {label}
      </button>
    );
  }
  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await onConfirm();
          } finally {
            setBusy(false);
            setAsking(false);
          }
        }}
        className="min-h-9 bg-danger px-3 text-[12px] font-bold text-white disabled:opacity-60"
      >
        {busy ? "Deleting…" : "Really delete?"}
      </button>
      <button type="button" onClick={() => setAsking(false)} className="min-h-9 px-1 text-[12px] font-semibold text-muted hover:underline">
        Keep
      </button>
    </span>
  );
}

export function Loading({ what = "Loading" }: { what?: string }) {
  return <p className="py-10 text-[14px] text-muted">{what}…</p>;
}

export function formatShortDate(value: string | null | undefined): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

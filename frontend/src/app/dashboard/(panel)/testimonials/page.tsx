"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/components/dashboard/Session";
import { ConfirmDelete, Loading, Notice, PageHead } from "@/components/dashboard/ui";
import { api, ApiError } from "@/lib/dashboard/api";
import type { AdminTestimonial } from "@/lib/types";

const dateTime = (v: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(v));

type Filter = "waiting" | "shown" | "all";

/**
 * What visitors say about the programme (sent from the Contact page). New ones wait here; once
 * approved they appear in "What people say" on the home page. Staff can hide or delete any.
 */
export default function TestimonialsPage() {
  const { refreshUnread } = useSession();
  const [items, setItems] = useState<AdminTestimonial[] | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("waiting");

  useEffect(() => {
    api<AdminTestimonial[]>("/admin/testimonials")
      .then((list) => {
        setItems(list);
        if (!list.some((t) => !t.isApproved)) setFilter("all");
      })
      .catch((e: ApiError) => setError(e.message));
  }, []);

  async function setApproved(t: AdminTestimonial, isApproved: boolean) {
    try {
      await api(`/admin/testimonials/${t.id}`, { method: "PATCH", body: { isApproved } });
      setItems((list) => list?.map((x) => (x.id === t.id ? { ...x, isApproved } : x)) ?? null);
      refreshUnread();
    } catch (e) {
      setError((e as ApiError).message);
    }
  }

  async function remove(id: number) {
    try {
      await api(`/admin/testimonials/${id}`, { method: "DELETE" });
      setItems((list) => list?.filter((x) => x.id !== id) ?? null);
      refreshUnread();
    } catch (e) {
      setError((e as ApiError).message);
    }
  }

  const waiting = items?.filter((t) => !t.isApproved).length ?? 0;
  const shownCount = (items?.length ?? 0) - waiting;
  const visible = (items ?? []).filter((t) => (filter === "all" ? true : filter === "waiting" ? !t.isApproved : t.isApproved));

  const tabs: { key: Filter; label: string; n: number }[] = [
    { key: "waiting", label: "Waiting for approval", n: waiting },
    { key: "shown", label: "On the site", n: shownCount },
    { key: "all", label: "All", n: items?.length ?? 0 },
  ];

  return (
    <>
      <PageHead
        light="What people"
        bold="say about us."
        intro="Comments visitors send from the Contact page. Read each one: approve it to show it on the home page with the person's name, hide it again at any time, or delete it."
      />
      {error && (
        <div className="mt-6">
          <Notice kind="error">{error}</Notice>
        </div>
      )}

      <div role="tablist" aria-label="Show" className="mt-6 flex flex-wrap gap-x-6 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={filter === t.key}
            onClick={() => setFilter(t.key)}
            className={`-mb-px min-h-11 border-b-[3px] text-[14px] font-semibold ${filter === t.key ? "border-accent text-navy" : "border-transparent text-muted hover:text-navy"}`}
          >
            {t.label} <span className="font-normal text-grey">({t.n})</span>
          </button>
        ))}
      </div>

      <div className="mt-5 border border-line bg-white">
        {!items ? (
          <div className="px-5">
            <Loading />
          </div>
        ) : visible.length === 0 ? (
          <p className="px-5 py-12 text-center text-muted">
            {filter === "waiting" ? "Nothing is waiting. New comments from the Contact page will appear here." : "No comments here yet."}
          </p>
        ) : (
          <ul>
            {visible.map((t) => (
              <li key={t.id} className={`border-b border-[#ececec] px-5 py-4 last:border-b-0 ${t.isApproved ? "" : "border-l-4 border-l-accent"}`}>
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-[14px] font-bold text-navy">{t.name}</span>
                  {t.place && <span className="text-[13px] text-muted">{t.place}</span>}
                  <span className="text-[12.5px] text-grey">{dateTime(t.createdAt)}</span>
                  <span className={`ml-auto text-[12px] font-semibold ${t.isApproved ? "text-[#2e7d32]" : "text-accent"}`}>
                    {t.isApproved ? "Shown on the home page" : "Waiting for approval"}
                  </span>
                </p>
                <p className="font-text mt-2 whitespace-pre-wrap text-[14.5px] leading-[1.6] text-ink">{t.message}</p>
                <div className="mt-3 flex flex-wrap items-center gap-5">
                  {t.isApproved ? (
                    <button type="button" onClick={() => setApproved(t, false)} className="min-h-9 text-[13px] font-semibold text-navy hover:underline">
                      Hide from the site
                    </button>
                  ) : (
                    <button type="button" onClick={() => setApproved(t, true)} className="btn-primary inline-flex min-h-10 items-center px-5 text-[12px] font-semibold">
                      Approve
                    </button>
                  )}
                  <ConfirmDelete onConfirm={() => remove(t.id)} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

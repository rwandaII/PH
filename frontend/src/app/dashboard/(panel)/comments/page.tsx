"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "@/components/dashboard/Session";
import { ConfirmDelete, Loading, Notice, PageHead } from "@/components/dashboard/ui";
import { api, ApiError } from "@/lib/dashboard/api";
import type { AdminComment } from "@/lib/types";

const dateTime = (v: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(v));

/** Readers' comments on news stories. New ones wait here until someone approves them. */
export default function CommentsPage() {
  const { refreshUnread } = useSession();
  const [comments, setComments] = useState<AdminComment[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<AdminComment[]>("/admin/comments").then(setComments).catch((e: ApiError) => setError(e.message));
  }, []);

  async function setApproved(c: AdminComment, isApproved: boolean) {
    try {
      await api(`/admin/comments/${c.id}`, { method: "PATCH", body: { isApproved } });
      setComments((list) => list?.map((x) => (x.id === c.id ? { ...x, isApproved } : x)) ?? null);
      refreshUnread();
    } catch (e) {
      setError((e as ApiError).message);
    }
  }

  async function remove(id: number) {
    try {
      await api(`/admin/comments/${id}`, { method: "DELETE" });
      setComments((list) => list?.filter((x) => x.id !== id) ?? null);
      refreshUnread();
    } catch (e) {
      setError((e as ApiError).message);
    }
  }

  const waiting = comments?.filter((c) => !c.isApproved).length ?? 0;

  return (
    <>
      <PageHead
        light="Readers'"
        bold="comments."
        intro="Comments readers leave on news stories. They appear on the site only after you approve them."
      />
      {error && (
        <div className="mt-6">
          <Notice kind="error">{error}</Notice>
        </div>
      )}
      {comments && waiting > 0 && (
        <p className="mt-6 text-[14px] font-semibold text-navy">
          {waiting} {waiting === 1 ? "comment is" : "comments are"} waiting for approval.
        </p>
      )}
      <div className="mt-5 border border-line bg-white">
        {!comments ? (
          <div className="px-5">
            <Loading />
          </div>
        ) : comments.length === 0 ? (
          <p className="px-5 py-12 text-center text-muted">No comments yet.</p>
        ) : (
          <ul>
            {comments.map((c) => (
              <li key={c.id} className={`border-b border-[#ececec] px-5 py-4 last:border-b-0 ${c.isApproved ? "" : "border-l-4 border-l-accent"}`}>
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-[14px] font-bold text-navy">{c.name}</span>
                  <span className="text-[12.5px] text-grey">{dateTime(c.createdAt)}</span>
                  <span className="text-[12.5px] text-grey">
                    on{" "}
                    <Link href={`/news/${c.news.slug}#comments`} target="_blank" className="font-semibold text-accent hover:underline">
                      {c.news.title}
                    </Link>
                  </span>
                  <span className={`ml-auto text-[12px] font-semibold ${c.isApproved ? "text-[#2e7d32]" : "text-accent"}`}>
                    {c.isApproved ? "Shown on the site" : "Waiting for approval"}
                  </span>
                </p>
                <p className="font-text mt-2 whitespace-pre-wrap text-[14.5px] leading-[1.6] text-ink">{c.message}</p>
                <div className="mt-3 flex flex-wrap items-center gap-5">
                  {c.isApproved ? (
                    <button type="button" onClick={() => setApproved(c, false)} className="min-h-9 text-[13px] font-semibold text-navy hover:underline">
                      Hide from the site
                    </button>
                  ) : (
                    <button type="button" onClick={() => setApproved(c, true)} className="btn-primary inline-flex min-h-10 items-center px-5 text-[12px] font-semibold">
                      Approve
                    </button>
                  )}
                  <ConfirmDelete onConfirm={() => remove(c.id)} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

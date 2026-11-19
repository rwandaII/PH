"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/components/dashboard/Session";
import { ConfirmDelete, Loading, Notice, PageHead } from "@/components/dashboard/ui";
import { api, ApiError } from "@/lib/dashboard/api";
import type { ContactMessage } from "@/lib/types";

const dateTime = (v: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(v));

export default function MessagesPage() {
  const { refreshUnread } = useSession();
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<ContactMessage[]>("/admin/messages").then(setMessages).catch((e: ApiError) => setError(e.message));
  }, []);

  async function setRead(m: ContactMessage, isRead: boolean) {
    try {
      const updated = await api<ContactMessage>(`/admin/messages/${m.id}`, { method: "PATCH", body: { isRead } });
      setMessages((list) => list?.map((x) => (x.id === m.id ? updated : x)) ?? null);
      refreshUnread();
    } catch (e) {
      setError((e as ApiError).message);
    }
  }

  async function toggle(m: ContactMessage) {
    const opening = openId !== m.id;
    setOpenId(opening ? m.id : null);
    if (opening && !m.isRead) await setRead(m, true);
  }

  async function remove(id: number) {
    try {
      await api(`/admin/messages/${id}`, { method: "DELETE" });
      setMessages((list) => list?.filter((x) => x.id !== id) ?? null);
      refreshUnread();
    } catch (e) {
      setError((e as ApiError).message);
    }
  }

  return (
    <>
      <PageHead light="Contact form" bold="messages." intro="Messages sent through the Contact page. Reply by email." />
      {error && (
        <div className="mt-6">
          <Notice kind="error">{error}</Notice>
        </div>
      )}
      <div className="mt-7 border border-line bg-white">
        {!messages ? (
          <div className="px-5">
            <Loading />
          </div>
        ) : messages.length === 0 ? (
          <p className="px-5 py-12 text-center text-muted">No messages yet.</p>
        ) : (
          <ul>
            {messages.map((m) => {
              const open = openId === m.id;
              return (
                <li key={m.id} className={`border-b border-[#ececec] last:border-b-0 ${m.isRead ? "" : "border-l-4 border-l-accent"}`}>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => toggle(m)}
                    className="flex w-full flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-4 text-left hover:bg-[#fafafa]"
                  >
                    <span className={`text-[14px] ${m.isRead ? "text-ink" : "font-bold text-navy"}`}>{m.name}</span>
                    <span className="min-w-0 flex-1 truncate text-[14px] text-muted">{m.subject || m.message.slice(0, 90)}</span>
                    <span className="text-[12.5px] text-grey">{dateTime(m.createdAt)}</span>
                  </button>
                  {open && (
                    <div className="px-5 pb-5">
                      <p className="text-[13px] text-muted">
                        From <a href={`mailto:${m.email}`} className="font-semibold text-accent hover:underline">{m.email}</a>
                      </p>
                      <p className="font-text mt-3 whitespace-pre-wrap text-[14.5px] leading-[1.65] text-ink">{m.message}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-5">
                        <a
                          href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || "Your message"}`)}`}
                          className="btn-primary inline-flex min-h-10 items-center px-5 text-[12px] font-semibold"
                        >
                          Reply by email
                        </a>
                        <button type="button" onClick={() => setRead(m, !m.isRead)} className="min-h-9 text-[13px] font-semibold text-navy hover:underline">
                          Mark as {m.isRead ? "unread" : "read"}
                        </button>
                        <ConfirmDelete onConfirm={() => remove(m.id)} />
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

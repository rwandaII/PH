"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "@/lib/dashboard/api";
import type { AdminUser } from "@/lib/types";

interface SessionValue {
  admin: AdminUser;
  unread: number;
  /** Comments waiting for approval. */
  pendingComments: number;
  pendingTestimonials: number;
  refreshUnread: () => void;
}

const SessionContext = createContext<SessionValue | null>(null);

export function useSession(): SessionValue {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used inside <SessionProvider>");
  return value;
}

/**
 * Checks the login cookie with /api/auth/me. While checking it shows a short
 * message; a 401 sends the browser to the login page (handled in api()).
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [failed, setFailed] = useState("");
  const [unread, setUnread] = useState(0);
  const [pendingComments, setPendingComments] = useState(0);
  const [pendingTestimonials, setPendingTestimonials] = useState(0);

  const refreshUnread = useCallback(() => {
    api<{ unreadMessages: number; pendingComments: number; pendingTestimonials: number }>("/admin/stats")
      .then((s) => {
        setUnread(s.unreadMessages);
        setPendingComments(s.pendingComments);
        setPendingTestimonials(s.pendingTestimonials ?? 0);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    api<AdminUser>("/auth/me")
      .then((me) => {
        setAdmin(me);
        refreshUnread();
      })
      .catch((err: Error) => {
        if (!("status" in err) || (err as { status: number }).status !== 401) setFailed(err.message);
      });
  }, [refreshUnread]);

  if (failed) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="font-display text-[24px] text-navy">The dashboard could not load</p>
        <p className="mt-3 text-muted">{failed}</p>
      </div>
    );
  }
  if (!admin) return <p className="px-6 py-24 text-center text-muted">Checking your login…</p>;

  return <SessionContext.Provider value={{ admin, unread, pendingComments, pendingTestimonials, refreshUnread }}>{children}</SessionContext.Provider>;
}

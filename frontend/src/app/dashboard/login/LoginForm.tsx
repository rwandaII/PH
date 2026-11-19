"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { btnPrimary, Notice } from "@/components/dashboard/ui";
import { Chevron } from "@/components/site/icons";
import { api, ApiError } from "@/lib/dashboard/api";

export function LoginForm() {
  const next = useSearchParams().get("next");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await api("/auth/login", { method: "POST", body: data });
      // Only follow same-site dashboard paths.
      window.location.assign(next && next.startsWith("/dashboard") ? next : "/dashboard");
    } catch (err) {
      setError((err as ApiError).message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      {error && <Notice kind="error">{error}</Notice>}
      <div>
        <label htmlFor="email" className="block text-[13px] font-semibold text-navy">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className="field" />
      </div>
      <div>
        <label htmlFor="password" className="block text-[13px] font-semibold text-navy">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
      </div>
      <button type="submit" disabled={busy} className={`${btnPrimary} w-full`}>
        <Chevron />
        {busy ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}

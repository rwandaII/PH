"use client";

import { useState } from "react";
import { btnPrimary, labelClass, Notice, PageHead } from "@/components/dashboard/ui";
import { Chevron } from "@/components/site/icons";
import { api, ApiError } from "@/lib/dashboard/api";

export default function AccountPage() {
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setError("");
    setFieldErrors({});
    setDone(false);
    if (data.newPassword !== data.confirm) {
      setFieldErrors({ confirm: "The two new passwords do not match." });
      return;
    }
    setBusy(true);
    try {
      await api("/admin/me/password", { method: "PUT", body: { currentPassword: data.currentPassword, newPassword: data.newPassword } });
      setDone(true);
      form.reset();
    } catch (err) {
      const apiErr = err as ApiError;
      setFieldErrors(apiErr.fields);
      setError(Object.keys(apiErr.fields).length ? "" : apiErr.message);
    } finally {
      setBusy(false);
    }
  }

  const field = (name: string, label: string, autoComplete: string) => (
    <div>
      <label htmlFor={`p-${name}`} className={labelClass}>
        {label}
      </label>
      <input
        id={`p-${name}`}
        name={name}
        type="password"
        autoComplete={autoComplete}
        required
        className="field"
        aria-invalid={!!fieldErrors[name]}
        aria-describedby={fieldErrors[name] ? `p-${name}-error` : undefined}
      />
      {fieldErrors[name] && (
        <p id={`p-${name}-error`} className="mt-1 text-[13px] text-danger">
          {fieldErrors[name]}
        </p>
      )}
    </div>
  );

  return (
    <>
      <PageHead light="Change" bold="my password." />
      <form onSubmit={submit} noValidate className="mt-8 max-w-[520px] space-y-5 bg-white p-6 sm:p-8">
        {done && <Notice kind="success">Your password has been changed.</Notice>}
        {error && <Notice kind="error">{error}</Notice>}
        {field("currentPassword", "Current password", "current-password")}
        {field("newPassword", "New password (at least 8 characters)", "new-password")}
        {field("confirm", "New password again", "new-password")}
        <button type="submit" disabled={busy} className={btnPrimary}>
          <Chevron />
          {busy ? "Saving…" : "Change password"}
        </button>
      </form>
    </>
  );
}

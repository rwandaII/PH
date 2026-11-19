"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/components/dashboard/Session";
import { btnPrimary, ConfirmDelete, formatShortDate, labelClass, Loading, Notice, PageHead } from "@/components/dashboard/ui";
import { Chevron } from "@/components/site/icons";
import { api, ApiError } from "@/lib/dashboard/api";
import type { AdminUser } from "@/lib/types";

export default function AdminsPage() {
  const { admin: me } = useSession();
  const [admins, setAdmins] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [added, setAdded] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<AdminUser[]>("/admin/admins").then(setAdmins).catch((e: ApiError) => setError(e.message));
  }, []);

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    setError("");
    setFieldErrors({});
    setAdded("");
    try {
      const created = await api<AdminUser>("/admin/admins", { method: "POST", body: Object.fromEntries(new FormData(form)) });
      setAdmins((list) => [...(list ?? []), created]);
      setAdded(`${created.name} can now log in with ${created.email}.`);
      form.reset();
    } catch (err) {
      const apiErr = err as ApiError;
      setFieldErrors(apiErr.fields);
      setError(Object.keys(apiErr.fields).length ? "Please fix the fields marked below." : apiErr.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    try {
      await api(`/admin/admins/${id}`, { method: "DELETE" });
      setAdmins((list) => list?.filter((a) => a.id !== id) ?? null);
    } catch (e) {
      setError((e as ApiError).message);
    }
  }

  const input = (name: string, label: string, type = "text", autoComplete?: string) => (
    <div>
      <label htmlFor={`a-${name}`} className={labelClass}>
        {label}
      </label>
      <input id={`a-${name}`} name={name} type={type} autoComplete={autoComplete} required className="field" aria-invalid={!!fieldErrors[name]} aria-describedby={fieldErrors[name] ? `a-${name}-error` : undefined} />
      {fieldErrors[name] && (
        <p id={`a-${name}-error`} className="mt-1 text-[13px] text-danger">
          {fieldErrors[name]}
        </p>
      )}
    </div>
  );

  return (
    <>
      <PageHead light="Admin" bold="accounts." intro="Everyone listed here can log in and edit the whole site." />
      <div className="mt-6 space-y-4">
        {error && <Notice kind="error">{error}</Notice>}
        {added && <Notice kind="success">{added}</Notice>}
      </div>

      <div className="relative mt-6 overflow-x-auto border border-line bg-white">
        {!admins ? (
          <div className="px-5">
            <Loading />
          </div>
        ) : (
          <table className="w-full min-w-[560px] border-collapse text-[14px]">
            <thead>
              <tr className="text-left text-[13px] font-semibold text-muted">
                <th scope="col" className="border-b border-line px-5 py-3.5 font-semibold">Name</th>
                <th scope="col" className="border-b border-line px-5 py-3.5 font-semibold">Email</th>
                <th scope="col" className="border-b border-line px-5 py-3.5 font-semibold">Added</th>
                <th scope="col" className="border-b border-line px-5 py-3.5"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id} className="border-b border-[#ececec] last:border-b-0">
                  <td className="px-5 py-3.5 font-semibold text-navy">
                    {a.name} {a.id === me.id && <span className="ml-1 text-[12px] font-normal text-muted">(you)</span>}
                  </td>
                  <td className="px-5 py-3.5 text-muted">{a.email}</td>
                  <td className="px-5 py-3.5 text-muted">{formatShortDate(a.createdAt)}</td>
                  <td className="px-5 py-3.5 text-right">
                    {a.id !== me.id && admins.length > 1 && <ConfirmDelete onConfirm={() => remove(a.id)} label="Remove" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <section aria-labelledby="add-admin" className="mt-10 max-w-[820px]">
        <h2 id="add-admin" className="font-display border-b-2 border-accent pb-4 text-[26px] font-medium text-navy">
          Add an admin
        </h2>
        <form onSubmit={add} noValidate className="mt-6 grid gap-x-6 gap-y-5 bg-white p-6 sm:grid-cols-2 sm:p-8">
          {input("name", "Name", "text", "off")}
          {input("email", "Email", "email", "off")}
          <div className="sm:col-span-2">
            {input("password", "Starting password", "password", "new-password")}
            <p className="mt-1 text-[12.5px] text-muted">At least 8 characters. Share it privately; they can change it under My password.</p>
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={busy} className={btnPrimary}>
              <Chevron />
              {busy ? "ADDING…" : "Add admin"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

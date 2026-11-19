"use client";

import { useEffect, useState } from "react";
import { btnPrimary, hintClass, labelClass, Loading, Notice, PageHead } from "@/components/dashboard/ui";
import { Chevron } from "@/components/site/icons";
import { api, ApiError } from "@/lib/dashboard/api";
import type { SiteInfo } from "@/lib/types";

type Key = keyof SiteInfo;

const SECTIONS: { title: string; fields: { name: Key; label: string; rows?: number; hint?: string; type?: string; narrow?: boolean }[] }[] = [
  {
    title: "The program",
    fields: [
      { name: "programName", label: "Program name", hint: "Shown in the logo area, page titles and the footer." },
      { name: "tagline", label: "Tagline", hint: "The big heading on the home page, e.g. \"Clean, safe water for every community\"." },
      { name: "heroText", label: "Home page introduction", rows: 3, hint: "One or two sentences under the tagline." },
    ],
  },
  {
    title: "About",
    fields: [
      { name: "aboutText", label: "About the program", rows: 8, hint: "Leave an empty line between paragraphs. The first paragraph also appears on the home page." },
      { name: "mission", label: "Mission", rows: 3 },
      { name: "vision", label: "Vision", rows: 3 },
    ],
  },
  {
    title: "Contact details",
    fields: [
      { name: "contactEmail", label: "Email", type: "email", narrow: true },
      { name: "phone", label: "Phone", narrow: true },
      { name: "address", label: "Office address" },
    ],
  },
  {
    title: "Social media",
    fields: [
      { name: "facebookUrl", label: "Facebook page", type: "url", hint: "Full address starting with https://" },
      { name: "twitterUrl", label: "X (Twitter) profile", type: "url" },
      { name: "linkedinUrl", label: "LinkedIn page", type: "url" },
    ],
  },
];

export default function SiteInfoPage() {
  const [values, setValues] = useState<SiteInfo | null>(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api<SiteInfo>("/admin/site").then(setValues).catch((e: ApiError) => setError(e.message));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!values) return;
    setSaving(true);
    setError("");
    setFieldErrors({});
    setSaved(false);
    const body = Object.fromEntries(SECTIONS.flatMap((s) => s.fields.map((f) => [f.name, values[f.name] ?? ""])));
    try {
      setValues(await api<SiteInfo>("/admin/site", { method: "PUT", body }));
      setSaved(true);
    } catch (err) {
      const apiErr = err as ApiError;
      setFieldErrors(apiErr.fields);
      setError(Object.keys(apiErr.fields).length ? "Please fix the fields marked below." : apiErr.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHead light="About &" bold="contact info." intro="This text appears across the public site: the home page, About page, Contact page and footer." />
      {!values ? (
        error ? <div className="mt-6"><Notice kind="error">{error}</Notice></div> : <Loading />
      ) : (
        <form onSubmit={submit} noValidate className="mt-8 max-w-[820px] space-y-6">
          {saved && <Notice kind="success">Saved. The public site shows the new text now.</Notice>}
          {error && <Notice kind="error">{error}</Notice>}

          {SECTIONS.map((s) => (
            <fieldset key={s.title} className="grid gap-x-6 gap-y-5 bg-white p-6 sm:grid-cols-2 sm:p-8">
              <legend className="font-display float-left mb-1 w-full border-b-2 border-accent pb-3 text-[22px] font-medium text-navy sm:col-span-2">
                {s.title}
              </legend>
              {s.fields.map((f) => {
                const id = `s-${f.name}`;
                const err = fieldErrors[f.name];
                const props = {
                  id,
                  value: values[f.name] ?? "",
                  "aria-invalid": !!err,
                  "aria-describedby": [f.hint ? `${id}-hint` : "", err ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined,
                  className: "field",
                  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    setValues({ ...values, [f.name]: e.target.value });
                    setSaved(false);
                  },
                };
                return (
                  <div key={f.name} className={f.narrow ? "" : "sm:col-span-2"}>
                    <label htmlFor={id} className={labelClass}>
                      {f.label}
                    </label>
                    {f.rows ? <textarea rows={f.rows} {...props} className="field resize-y" /> : <input type={f.type ?? "text"} {...props} />}
                    {f.hint && (
                      <p id={`${id}-hint`} className={hintClass}>
                        {f.hint}
                      </p>
                    )}
                    {err && (
                      <p id={`${id}-error`} className="mt-1 text-[13px] text-danger">
                        {err}
                      </p>
                    )}
                  </div>
                );
              })}
            </fieldset>
          ))}

          <div className="sticky bottom-0 border-t border-line bg-[#eef5f8]/95 py-4">
            <button type="submit" disabled={saving} className={btnPrimary}>
              <Chevron />
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      )}
    </>
  );
}

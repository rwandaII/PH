"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Chevron } from "@/components/site/icons";
import { api, ApiError } from "@/lib/dashboard/api";
import { RESOURCES, type FieldDef, type ResourceDef } from "@/lib/dashboard/resources";
import { ImageField } from "./ImageField";
import { RichTextEditor } from "./RichTextEditor";
import { btnPlain, btnPrimary, ConfirmDelete, hintClass, labelClass, Loading, Notice, PageHead } from "./ui";

type Values = Record<string, string | boolean | number>;

function initialValues(def: ResourceDef): Values {
  const v: Values = {};
  for (const f of def.fields) {
    if (f.type === "image") continue;
    v[f.name] = f.initial ?? (f.type === "checkbox" ? false : "");
  }
  return v;
}

/** Create or edit one news story, project, team member or partner. */
export function ResourceForm({ resource, id }: { resource: ResourceDef["key"]; id?: number }) {
  const def = RESOURCES[resource];
  const router = useRouter();
  const created = useSearchParams().has("created");
  const imageDef = def.fields.find((f) => f.type === "image");
  const [values, setValues] = useState<Values>(() => initialValues(def));
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [image, setImage] = useState<{ file: File | null; remove: boolean }>({ file: null, remove: false });
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState("");

  useEffect(() => {
    if (!id) return;
    api<Record<string, unknown>>(`${def.api}/${id}`)
      .then((item) => {
        const v = initialValues(def);
        for (const f of def.fields) {
          if (f.type === "image") continue;
          const raw = item[f.name];
          if (raw !== null && raw !== undefined) v[f.name] = raw as string | boolean | number;
        }
        setValues(v);
        if (imageDef) setCurrentImage((item[imageDef.name] as string | null) ?? null);
      })
      .catch((e: ApiError) => setError(e.status === 404 ? `This ${def.singular} no longer exists.` : e.message))
      .finally(() => setLoading(false));
  }, [def, id, imageDef]);

  const set = (name: string, value: string | boolean | number) => {
    setValues((v) => ({ ...v, [name]: value }));
    setSaved("");
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setFieldErrors({});
    setSaved("");

    const form = new FormData();
    for (const [k, v] of Object.entries(values)) form.append(k, String(v));
    if (image.file) form.append("image", image.file);
    else if (image.remove) form.append("removeImage", "true");

    try {
      const item = await api<Record<string, unknown> & { id: number }>(id ? `${def.api}/${id}` : def.api, {
        method: id ? "PUT" : "POST",
        body: form,
      });
      if (!id) {
        router.replace(`/dashboard/${def.key}/${item.id}?created=1`);
        return;
      }
      if (imageDef) setCurrentImage((item[imageDef.name] as string | null) ?? null);
      if ("slug" in item) setValues((v) => ({ ...v, slug: String(item.slug) }));
      setImage({ file: null, remove: false });
      const live = def.publicPath?.(item);
      setSaved(live ? `Saved. It is live on the public site.` : "Saved.");
    } catch (err) {
      const apiErr = err as ApiError;
      setFieldErrors(apiErr.fields ?? {});
      setError(Object.keys(apiErr.fields ?? {}).length ? "Please fix the fields marked below." : apiErr.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    await api(`${def.api}/${id}`, { method: "DELETE" });
    router.replace(`/dashboard/${def.key}`);
  }

  const titleWord = def.singular.charAt(0).toUpperCase() + def.singular.slice(1);

  return (
    <>
      <PageHead
        back={{ href: `/dashboard/${def.key}`, label: `Back to ${def.label.toLowerCase()}` }}
        light={id ? "Edit" : "New"}
        bold={`${def.singular}.`}
      />

      {loading ? (
        <Loading />
      ) : (
        <form onSubmit={submit} noValidate className="mt-8 max-w-[820px]">
          <div className="space-y-4">
            {created && !saved && !error && <Notice kind="success">{titleWord} created. You can keep editing below.</Notice>}
            {saved && <Notice kind="success">{saved}</Notice>}
            {error && <Notice kind="error">{error}</Notice>}
          </div>

          <div className="mt-6 grid gap-x-6 gap-y-[22px] bg-white p-6 sm:grid-cols-2 sm:p-8">
            {def.fields.map((f) =>
              f.type === "image" ? (
                <div key={f.name} className="sm:col-span-2">
                  <ImageField key={currentImage ?? "none"} name={f.name} label={f.label} hint={f.hint} current={currentImage} onChange={setImage} error={fieldErrors.image} />
                </div>
              ) : (
                <div key={f.name} className={f.narrow ? "" : "sm:col-span-2"}>
                  <Field def={f} value={values[f.name]} onChange={(v) => set(f.name, v)} error={fieldErrors[f.name]} />
                </div>
              ),
            )}
          </div>

          <div className="sticky bottom-0 mt-6 flex flex-wrap items-center gap-4 border-t border-line bg-[#eef5f8]/95 py-4">
            <button type="submit" disabled={saving} className={btnPrimary}>
              <Chevron />
              {saving ? "Saving…" : id ? "Save changes" : `CREATE ${def.singular.toUpperCase()}`}
            </button>
            <button type="button" onClick={() => router.push(`/dashboard/${def.key}`)} className={btnPlain}>
              Cancel
            </button>
            {id && (
              <span className="ml-auto">
                <ConfirmDelete onConfirm={remove} label={`Delete this ${def.singular}`} />
              </span>
            )}
          </div>
        </form>
      )}
    </>
  );
}

function Field({
  def,
  value,
  onChange,
  error,
}: {
  def: FieldDef;
  value: string | boolean | number;
  onChange: (v: string | boolean | number) => void;
  error?: string;
}) {
  const id = `f-${def.name}`;
  const describedBy = [def.hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  const common = { id, "aria-invalid": !!error, "aria-describedby": describedBy };

  if (def.type === "checkbox") {
    return (
      <label className="flex min-h-11 cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          {...common}
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-5 w-5 accent-[#0077b6]"
        />
        <span className="text-[14px] font-semibold text-navy">{def.label}</span>
      </label>
    );
  }

  return (
    <div>
      <label htmlFor={id} id={`${id}-label`} className={labelClass}>
        {def.label}
        {def.required && <span className="text-accent"> *</span>}
      </label>
      {def.type === "richtext" ? (
        <RichTextEditor id={id} labelledBy={`${id}-label`} value={String(value)} onChange={onChange} />
      ) : def.type === "textarea" ? (
        <textarea {...common} rows={4} value={String(value)} onChange={(e) => onChange(e.target.value)} className="field resize-y" />
      ) : def.type === "select" ? (
        <select {...common} value={String(value)} onChange={(e) => onChange(e.target.value)} className="field">
          {def.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...common}
          type={def.type === "number" ? "number" : def.type === "url" ? "url" : "text"}
          required={def.required}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="field"
        />
      )}
      {def.hint && (
        <p id={`${id}-hint`} className={hintClass}>
          {def.hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

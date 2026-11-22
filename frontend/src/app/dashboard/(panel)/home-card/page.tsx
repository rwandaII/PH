"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ImageField } from "@/components/dashboard/ImageField";
import { btnPrimary, hintClass, labelClass, Loading, Notice, PageHead } from "@/components/dashboard/ui";
import { HomeCard, hasHomeCard, type HomeCardContent } from "@/components/site/HomeCard";
import { Chevron } from "@/components/site/icons";
import { api, ApiError } from "@/lib/dashboard/api";
import { paragraphs } from "@/lib/format";
import type { SiteInfo } from "@/lib/types";

type Field = keyof HomeCardContent;
const KEYS: Record<Field, "featureTitle" | "featureText" | "featureButton" | "featureLink"> = {
  title: "featureTitle",
  text: "featureText",
  button: "featureButton",
  link: "featureLink",
};

/** Pages staff can send the button to (they can also type any other page or a full address). */
const PAGES = [
  ["/about", "About"],
  ["/partners", "Partners"],
  ["/projects", "Projects"],
  ["/news", "News"],
  ["/team", "Our team"],
  ["/gallery", "Gallery"],
  ["/certificates", "Certificates"],
  ["/contact", "Contact"],
];

/**
 * Dashboard → Home page card: the card beside the introduction on the home page. The form is
 * laid out in the card's own order (photo, title, text, button), with a live preview drawn by
 * the same component the site uses.
 */
export default function HomeCardPage() {
  const [site, setSite] = useState<SiteInfo | null>(null);
  const [card, setCard] = useState<HomeCardContent>({ title: "", text: "", button: "", link: "" });
  const [image, setImage] = useState<{ file: File | null; remove: boolean }>({ file: null, remove: false });
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function load(s: SiteInfo) {
    setSite(s);
    setCard({ title: s.featureTitle, text: s.featureText, button: s.featureButton, link: s.featureLink });
    setPreview(s.featureImage);
    setImage({ file: null, remove: false });
  }

  useEffect(() => {
    api<SiteInfo>("/admin/site").then(load).catch((e: ApiError) => setError(e.message));
  }, []);

  function change(field: Field, value: string) {
    setCard((c) => ({ ...c, [field]: value }));
    setSaved(false);
  }

  function changeImage(next: { file: File | null; remove: boolean }) {
    setImage(next);
    setPreview(next.file ? URL.createObjectURL(next.file) : null);
    setSaved(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setFieldErrors({});
    setSaved(false);
    try {
      if (image.file || image.remove) {
        const form = new FormData();
        if (image.file) form.append("image", image.file);
        else form.append("removeImage", "true");
        await api<SiteInfo>("/admin/site/feature-image", { method: "PUT", body: form });
      }
      const body = Object.fromEntries((Object.keys(KEYS) as Field[]).map((f) => [KEYS[f], card[f]]));
      load(await api<SiteInfo>("/admin/site", { method: "PUT", body }));
      setSaved(true);
    } catch (err) {
      const apiErr = err as ApiError;
      setFieldErrors(apiErr.fields);
      setError(Object.keys(apiErr.fields).length ? "Please fix the fields marked below." : apiErr.message);
    } finally {
      setSaving(false);
    }
  }

  const intro = site ? paragraphs(site.aboutText)[0] || site.heroText : "";

  return (
    <>
      <PageHead
        light="Home page"
        bold="card"
        intro="The blue card beside the introduction on the home page, under the big slider. Change any part and the preview shows it as visitors will see it."
        action={
          <Link href="/" target="_blank" className="inline-flex min-h-10 items-center gap-2 text-[13px] font-semibold text-accent">
            See the home page <Chevron size={9} />
          </Link>
        }
      />
      {!site ? (
        error ? <div className="mt-6"><Notice kind="error">{error}</Notice></div> : <Loading />
      ) : (
        <form onSubmit={submit} noValidate className="mt-8 grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,560px)]">
          <div className="space-y-6">
            {saved && <Notice kind="success">Saved. The home page shows the new card now.</Notice>}
            {error && <Notice kind="error">{error}</Notice>}

            <fieldset className="grid gap-y-5 bg-white p-6 sm:p-8">
              <legend className="font-display float-left mb-1 w-full border-b-2 border-accent pb-3 text-[22px] font-medium text-navy">
                The card, from top to bottom
              </legend>
              <ImageField
                key={site.featureImage ?? "none"}
                name="featureImage"
                label="1. Photo"
                hint="A tall photo works best (it is shown about 157 × 222). JPG, PNG or WEBP, up to 5 MB. Remove it to show the card without a photo."
                current={site.featureImage}
                onChange={changeImage}
                error={fieldErrors.image}
              />
              <TextField id="featureTitle" label="2. Title" hint="The bold heading, e.g. RATIONALE." value={card.title} error={fieldErrors.featureTitle} onChange={(v) => change("title", v)} />
              <TextField
                id="featureText"
                label="3. Text"
                rows={4}
                hint="A sentence or two under the title. Leave both the title and the text empty to hide the card."
                value={card.text}
                error={fieldErrors.featureText}
                onChange={(v) => change("text", v)}
              />
              <TextField id="featureButton" label="4. Button words" hint="e.g. Read more" value={card.button} error={fieldErrors.featureButton} onChange={(v) => change("button", v)} />
              <TextField
                id="featureLink"
                label="5. Button opens"
                list="home-card-pages"
                hint="A page of this site (choose one from the list, e.g. /partners) or a full address starting with https://. Leave it empty to hide the button."
                value={card.link}
                error={fieldErrors.featureLink}
                onChange={(v) => change("link", v)}
              />
              <datalist id="home-card-pages">
                {PAGES.map(([href, name]) => (
                  <option key={href} value={href}>
                    {name}
                  </option>
                ))}
              </datalist>
            </fieldset>

            <div className="sticky bottom-0 border-t border-line bg-[#eef5f8]/95 py-4">
              <button type="submit" disabled={saving} className={btnPrimary}>
                <Chevron />
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>

          {/* Live preview, drawn like the home page: the blue band with the card on the right */}
          <aside aria-label="Preview" className="xl:sticky xl:top-6">
            <p className={labelClass}>Preview</p>
            <div className="mt-2 flex flex-wrap items-stretch overflow-hidden bg-[#023e7d] text-white [background-image:url(/patterns/cubes.svg)] [background-size:24.25px_42px]">
              <div className="flex min-w-0 flex-[1_1_180px] items-center bg-[#0077b6]/90 p-5">
                <p className="line-clamp-[10] text-[12.5px] leading-[1.45] text-white/85">{intro || "Introduction text"}</p>
              </div>
              {hasHomeCard(card) ? (
                <HomeCard
                  preview
                  card={card}
                  photo={preview && <img src={preview} alt="" className="float-card block h-[222px] w-[157px] object-cover" />}
                />
              ) : (
                <div className="flex flex-[0_0_342px] items-center justify-center p-5 text-center text-[13px] text-white/75">
                  The card is hidden: add a title or text.
                </div>
              )}
            </div>
            <p className={hintClass}>
              The text on the left is the first paragraph of “About the program”, changed in{" "}
              <Link href="/dashboard/site" className="font-semibold text-accent underline">
                About &amp; contact info
              </Link>
              .
            </p>
          </aside>
        </form>
      )}
    </>
  );
}

function TextField({
  id,
  label,
  hint,
  value,
  error,
  rows,
  list,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  error?: string;
  rows?: number;
  list?: string;
  onChange: (value: string) => void;
}) {
  const props = {
    id,
    value,
    "aria-invalid": !!error,
    "aria-describedby": [`${id}-hint`, error ? `${id}-error` : ""].filter(Boolean).join(" "),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
  };
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {rows ? <textarea rows={rows} {...props} className="field resize-y" /> : <input type="text" list={list} {...props} className="field" />}
      <p id={`${id}-hint`} className={hintClass}>
        {hint}
      </p>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

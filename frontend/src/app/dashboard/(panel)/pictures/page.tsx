"use client";

import { useEffect, useRef, useState } from "react";
import { Loading, Notice, PageHead } from "@/components/dashboard/ui";
import { api, ApiError } from "@/lib/dashboard/api";
import { PLACES, type Place, type SiteImageRow } from "@/lib/site-images";

const ACCEPT = "image/jpeg,image/png,image/webp";
const MAX_BYTES = 5 * 1024 * 1024;
const PAGES = [...new Set(PLACES.map((p) => p.page))];

/**
 * Every picture place on the site, page by page: the header sliders and the single spots.
 * Staff add pictures (button or drag and drop), remove them, and change their order; the
 * public site shows the change straight away.
 */
export default function PicturesPage() {
  const [rows, setRows] = useState<SiteImageRow[] | null>(null);
  const [error, setError] = useState("");

  const load = () =>
    api<SiteImageRow[]>("/admin/site-images")
      .then(setRows)
      .catch((e: ApiError) => setError(e.message));

  useEffect(() => {
    api<SiteImageRow[]>("/admin/site-images")
      .then(setRows)
      .catch((e: ApiError) => setError(e.message));
  }, []);

  return (
    <>
      <PageHead
        light="Pictures &"
        bold="sliders."
        intro="Every picture on the site's pages, page by page. Add as many pictures as you like to a header slider; they fade from one to the next. Remove any picture, or move it earlier or later. Changes show on the public site straight away. A place with no pictures shows the programme's logo."
      />
      {error && (
        <div className="mt-6">
          <Notice kind="error">{error}</Notice>
        </div>
      )}
      {!rows ? (
        <Loading />
      ) : (
        <>
          <nav aria-label="Pages" className="mt-6 flex flex-wrap gap-2">
            {PAGES.map((p) => (
              <a key={p} href={`#page-${p.toLowerCase().replace(/\s+/g, "-")}`} className="inline-flex min-h-10 items-center border border-line bg-white px-4 text-[13.5px] font-semibold text-navy hover:border-navy">
                {p}
              </a>
            ))}
          </nav>
          {PAGES.map((page) => (
            <section key={page} id={`page-${page.toLowerCase().replace(/\s+/g, "-")}`} aria-labelledby={`h-${page}`} className="mt-10 scroll-mt-6">
              <h2 id={`h-${page}`} className="font-display border-b-2 border-accent pb-3 text-[24px] font-medium text-navy">
                {page}
              </h2>
              <div className="mt-5 grid gap-5 xl:grid-cols-2">
                {PLACES.filter((p) => p.page === page).map((place) => (
                  <PlaceCard key={place.key} place={place} rows={rows.filter((r) => r.place === place.key && r.image)} onChange={load} onError={setError} />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </>
  );
}

function PlaceCard({
  place,
  rows,
  onChange,
  onError,
}: {
  place: Place;
  rows: SiteImageRow[];
  onChange: () => Promise<unknown> | void;
  onError: (msg: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState("");
  const [dragging, setDragging] = useState(false);
  const [confirming, setConfirming] = useState<number | null>(null);
  const slider = place.kind === "slider";

  async function upload(files: File[]) {
    const good = files.filter((f) => ACCEPT.split(",").includes(f.type) && f.size <= MAX_BYTES);
    const skipped = files.length - good.length;
    if (good.length === 0) {
      onError("Choose JPG, PNG or WEBP pictures of up to 5 MB.");
      return;
    }
    const list = slider ? good : good.slice(0, 1);
    try {
      let order = rows.reduce((n, r) => Math.max(n, r.sortOrder), 0);
      for (let i = 0; i < list.length; i++) {
        setBusy(list.length > 1 ? `Uploading ${i + 1} of ${list.length}…` : "Uploading…");
        const form = new FormData();
        form.append("place", place.key);
        form.append("sortOrder", String(++order));
        form.append("image", list[i]);
        await api("/admin/site-images", { method: "POST", body: form });
      }
      // A single spot keeps only the newest picture.
      if (!slider) for (const r of rows) await api(`/admin/site-images/${r.id}`, { method: "DELETE" });
      if (skipped > 0) onError(`${skipped} file(s) were skipped: only JPG, PNG or WEBP pictures of up to 5 MB can be used.`);
      else onError("");
    } catch (e) {
      onError((e as ApiError).message);
    } finally {
      setBusy("");
      await onChange();
    }
  }

  async function remove(id: number) {
    setBusy("Removing…");
    try {
      await api(`/admin/site-images/${id}`, { method: "DELETE" });
    } catch (e) {
      onError((e as ApiError).message);
    } finally {
      setConfirming(null);
      setBusy("");
      await onChange();
    }
  }

  /** Swap a picture with its neighbour and save both positions. */
  async function move(index: number, step: -1 | 1) {
    if (!rows[index + step]) return;
    setBusy("Saving the order…");
    try {
      const save = (r: SiteImageRow, sortOrder: number) => {
        const form = new FormData();
        form.append("place", r.place);
        form.append("caption", r.caption);
        form.append("sortOrder", String(sortOrder));
        return api(`/admin/site-images/${r.id}`, { method: "PUT", body: form });
      };
      // Positions 1..n in the new order, so equal numbers never get stuck.
      const order = rows.map((r) => r.id);
      [order[index], order[index + step]] = [order[index + step], order[index]];
      await Promise.all(order.map((id, i) => save(rows.find((r) => r.id === id) as SiteImageRow, i + 1)));
    } catch (e) {
      onError((e as ApiError).message);
    } finally {
      setBusy("");
      await onChange();
    }
  }

  const fallbackNote =
    place.key === "news.header"
      ? "No pictures: the photos of the latest stories are shown."
      : place.key === "gallery.header"
        ? "No pictures: photos from the gallery are shown."
        : "No pictures: the programme's logo is shown.";

  return (
    <article
      className={`bg-white p-5 transition-shadow ${dragging ? "outline outline-2 outline-dashed outline-accent" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void upload([...e.dataTransfer.files]);
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-[16px] font-bold text-navy">{place.label}</h3>
          <p className="mt-0.5 text-[12.5px] font-semibold text-accent">{slider ? `Slider, ${rows.length} ${rows.length === 1 ? "picture" : "pictures"}` : "One picture"}</p>
        </div>
        <a href={place.href} target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold text-accent hover:underline">
          View on the site
        </a>
      </div>
      <p className="mt-2 text-[13px] leading-[1.5] text-muted">{place.hint}</p>

      {rows.length === 0 ? (
        <p className="mt-4 border border-dashed border-line bg-mist px-4 py-6 text-center text-[13.5px] text-muted">{fallbackNote}</p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {rows.map((r, i) => (
            <li key={r.id} className="group relative bg-mist">
              <img src={r.image ?? ""} alt="" className="block aspect-[4/3] w-full object-cover" />
              {slider && <span className="absolute left-1.5 top-1.5 bg-navy/85 px-2 py-0.5 text-[11px] font-bold text-white">{i + 1}</span>}
              {confirming === r.id ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-navy/90 p-2 text-center text-[12.5px] text-white">
                  Remove this picture?
                  <span className="flex gap-2">
                    <button type="button" onClick={() => remove(r.id)} className="min-h-9 bg-danger px-3 font-semibold">
                      Remove
                    </button>
                    <button type="button" onClick={() => setConfirming(null)} className="min-h-9 bg-white px-3 font-semibold text-navy">
                      Keep
                    </button>
                  </span>
                </div>
              ) : (
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-navy/85 to-transparent p-1.5 pt-6">
                  <span className="flex gap-1">
                    {slider && (
                      <>
                        <IconButton label="Move earlier" disabled={i === 0 || !!busy} onClick={() => move(i, -1)} d="M8 2 3 7l5 5" />
                        <IconButton label="Move later" disabled={i === rows.length - 1 || !!busy} onClick={() => move(i, 1)} d="M4 2l5 5-5 5" />
                      </>
                    )}
                  </span>
                  <IconButton label="Remove this picture" disabled={!!busy} onClick={() => setConfirming(r.id)} d="M3 3l8 8M11 3l-8 8" />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          ref={input}
          type="file"
          accept={ACCEPT}
          multiple={slider}
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            void upload([...(e.target.files ?? [])]);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          disabled={!!busy}
          onClick={() => input.current?.click()}
          className="btn-primary inline-flex min-h-11 items-center gap-2 px-5 text-[13.5px] font-semibold disabled:opacity-60"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {slider ? "Add pictures" : rows.length > 0 ? "Replace the picture" : "Add a picture"}
        </button>
        <span className="text-[12.5px] text-muted" aria-live="polite">
          {busy || (slider ? "or drag pictures onto this box" : "or drag a picture onto this box")}
        </span>
      </div>
    </article>
  );
}

function IconButton({ label, onClick, d, disabled }: { label: string; onClick: () => void; d: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center bg-white/95 text-navy transition-colors hover:bg-accent hover:text-white disabled:opacity-40"
    >
      <svg width="12" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

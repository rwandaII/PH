"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A grid of photos; choosing one opens it full screen with previous / next, the keyboard
 * arrows and Escape. `layout="story"` makes the first photo wide; "even" keeps all the same.
 */
export function PhotoViewer({
  photos,
  label,
  layout = "story",
  dark = false,
}: {
  photos: string[];
  label: string;
  layout?: "story" | "even";
  dark?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const go = useCallback((step: number) => setOpen((i) => (i === null ? i : (i + step + photos.length) % photos.length)), [photos.length]);
  const close = useCallback(() => {
    setOpen(null);
    lastFocus.current?.focus();
  }, []);

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, go, close]);

  if (photos.length === 0) return null;

  return (
    <>
      <ul className={`grid gap-3 ${layout === "even" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2"}`}>
        {photos.map((src, i) => (
          <li key={src} className={layout === "story" && i === 0 && photos.length > 2 ? "col-span-2" : ""}>
            <button
              type="button"
              onClick={(e) => {
                lastFocus.current = e.currentTarget;
                setOpen(i);
              }}
              aria-label={`Open photo ${i + 1} of ${photos.length}: ${label}`}
              className={`zoom-host group relative block w-full overflow-hidden ${dark ? "bg-white/10" : "bg-mist"}`}
            >
              <span className="zoom block">
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className={`block w-full object-cover ${layout === "story" && i === 0 && photos.length > 2 ? "aspect-[16/9]" : "aspect-[4/3]"}`}
                />
              </span>
              <span aria-hidden="true" className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center bg-navy/80 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <div role="dialog" aria-modal="true" aria-label={`${label}, photo ${open + 1} of ${photos.length}`} className="fixed inset-0 z-[60] flex flex-col bg-[#00142f] text-white">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="min-w-0 truncate text-[13.5px]">
              <span className="font-semibold">{label}</span>
              <span className="ml-3 text-white/70">
                {open + 1} / {photos.length}
              </span>
            </p>
            <button ref={closeRef} type="button" onClick={close} className="flex h-11 w-11 flex-none items-center justify-center hover:bg-white/10" aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-6 sm:px-16">
            <img key={photos[open]} src={photos[open]} alt="" className="fade-in max-h-full max-w-full object-contain" />
            {photos.length > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-1 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-black/30 hover:bg-white/15 sm:left-3">
                  <svg width="12" height="20" viewBox="0 0 12 20" aria-hidden="true">
                    <path d="M10 2L2 10l8 8" fill="none" stroke="currentColor" strokeWidth="2.4" />
                  </svg>
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-1 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-black/30 hover:bg-white/15 sm:right-3">
                  <svg width="12" height="20" viewBox="0 0 12 20" aria-hidden="true">
                    <path d="M2 2l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="2.4" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDate } from "@/lib/format";
import type { GalleryAlbum } from "@/lib/types";
import { Chevron } from "./icons";
import { PhotoViewer } from "./PhotoViewer";

const FILTERS = [
  { value: "all", label: "All photos" },
  { value: "news", label: "From the news" },
  { value: "project", label: "From the projects" },
] as const;

/** Gallery: filter tabs, then each story or project with what it is about and all of its photos. */
export function GalleryBrowser({ albums }: { albums: GalleryAlbum[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("all");
  const shown = filter === "all" ? albums : albums.filter((a) => a.kind === filter);
  const photos = (kind: string) => albums.filter((a) => kind === "all" || a.kind === kind).reduce((n, a) => n + a.photos.length, 0);

  return (
    <>
      <div role="group" aria-label="Show photos from" className="flex flex-wrap gap-x-8 gap-y-2 border-b border-[#bcd6e3]">
        {FILTERS.map((f) => {
          const on = f.value === filter;
          return (
            <button
              key={f.value}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(f.value)}
              className={`-mb-px min-h-11 border-b-[3px] text-[15px] transition-colors ${on ? "border-accent font-semibold text-navy" : "border-transparent text-[#4d6b80] hover:text-navy"}`}
            >
              {f.label} <span className="text-[13px] font-normal text-muted">({photos(f.value)})</span>
            </button>
          );
        })}
      </div>

      <ul className="mt-12 space-y-20">
        {shown.map((a) => (
          <li key={a.href}>
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
              <div className="max-w-[640px]">
                <p className="text-[13px] text-muted">
                  {a.kind === "news" ? "Story" : "Project"}
                  {a.date && <span className="ml-3">{formatDate(a.date)}</span>}
                  <span className="ml-3">{a.photos.length} photos</span>
                </p>
                <h2 className="font-display mt-1.5 text-[26px] font-normal leading-[1.15] text-navy sm:text-[30px]">
                  <Link href={a.href} className="hover:text-accent">
                    {a.title}
                  </Link>
                </h2>
                {a.text && <p className="mt-2 text-[14.5px] leading-[1.6] text-ink">{a.text}</p>}
              </div>
              <Link href={a.href} className="inline-flex min-h-11 items-center gap-2.5 text-[14px] font-semibold text-accent">
                {a.kind === "news" ? "Read the story" : "About this project"} <Chevron size={10} />
              </Link>
            </div>
            <div className="lift-card mt-6">
              <PhotoViewer photos={a.photos} label={a.title} layout="even" />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

"use client";

import { useState } from "react";
import { Pin } from "./icons";

/**
 * "Find us" on the Contact page: a Google map of the office with a Street View tab, and
 * buttons to open it in Google Maps or get directions. The map loads only when it comes into
 * view (loading="lazy"), so it never slows the page down.
 */
export function LocationMap({
  latitude,
  longitude,
  mapLink,
  streetViewUrl,
  address,
  name,
}: {
  latitude: string;
  longitude: string;
  mapLink: string;
  streetViewUrl: string;
  address: string;
  name: string;
}) {
  const [view, setView] = useState<"map" | "street">("map");
  const pin = `${latitude},${longitude}`;
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(pin)}&z=16&hl=en&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(pin)}`;
  const openLink = mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pin)}`;
  const tabs = [
    { key: "map" as const, label: "Map" },
    ...(streetViewUrl ? [{ key: "street" as const, label: "Street view" }] : []),
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
      <div className="lift-card overflow-hidden bg-white shadow-[0_26px_50px_-30px_rgba(0,30,70,.6)]">
        {tabs.length > 1 && (
          <div role="tablist" aria-label="Map view" className="flex border-b border-line">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={view === t.key}
                onClick={() => setView(t.key)}
                className={`min-h-12 flex-1 border-b-[3px] text-[14px] font-semibold transition-colors ${
                  view === t.key ? "border-accent text-navy" : "border-transparent text-muted hover:text-navy"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
        <iframe
          key={view}
          title={view === "map" ? `Map: ${name}` : `Street view: ${name}`}
          src={view === "map" ? mapSrc : streetViewUrl}
          className="block aspect-[4/3] w-full border-0 sm:aspect-[16/9]"
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      <div>
        <p className="flex items-center gap-2.5 text-[15px] font-semibold text-navy">
          <Pin className="h-[18px] w-auto text-accent" /> {name}
        </p>
        {address && <p className="mt-2 whitespace-pre-line text-[14.5px] leading-[1.6] text-ink">{address}</p>}
        <p className="mt-2 text-[13px] text-muted">
          GPS: {latitude}, {longitude}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <a
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex min-h-12 items-center justify-center gap-2.5 px-6 text-[14px] font-semibold"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 11l19-9-9 19-2-8-8-2z" />
            </svg>
            Get directions
          </a>
          <a
            href={openLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2.5 border border-accent px-6 text-[14px] font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}

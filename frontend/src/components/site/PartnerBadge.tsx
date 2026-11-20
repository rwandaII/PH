"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Img } from "./Img";

export interface PartnerMark {
  id: number;
  name: string;
  logo: string | null;
}

/**
 * "In partnership with" line under the photo in the home partners section: no card, just the
 * partners' logos in white (or their name when there is no logo yet), one after the other.
 * Clicking it opens the Partners page.
 */
export function PartnerBadge({ partners, className = "", interval = 3200 }: { partners: PartnerMark[]; className?: string; interval?: number }) {
  const [current, setCurrent] = useState(0);
  const many = partners.length > 1;

  useEffect(() => {
    if (!many) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") setCurrent((i) => (i + 1) % partners.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [many, interval, partners.length]);

  if (partners.length === 0) return null;
  const shown = partners[current];

  return (
    <Link
      href={`/partners#partner-${shown.id}`}
      aria-label={`In partnership with ${partners.map((p) => p.name).join(", ")}. See our partners`}
      className={`partner-badge group inline-flex flex-col items-start text-white ${className}`}
    >
      <span className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white/65">In partnership with</span>
      <span className="relative mt-2 flex h-12 w-[170px] items-center">
        {partners.map((p, i) => (
          <span
            key={p.id}
            aria-hidden="true"
            className={`absolute inset-0 flex items-center transition-[opacity,translate] ease-out ${
              i === current ? "translate-y-0 opacity-100 delay-300 duration-500" : "translate-y-1.5 opacity-0 duration-300"
            }`}
          >
            {p.logo ? (
              <Img src={p.logo} alt="" sizes="340px" className="max-h-12 max-w-[170px] object-contain object-left opacity-90 brightness-0 invert transition-opacity group-hover:opacity-100" />
            ) : (
              <span className="text-[15px] font-extrabold leading-[1.15]">{p.name}</span>
            )}
          </span>
        ))}
      </span>
      {many && (
        <span aria-hidden="true" className="mt-2 flex gap-1">
          {partners.map((p, i) => (
            <span key={p.id} className={`h-[2px] rounded-full bg-white transition-all duration-500 ${i === current ? "w-5" : "w-2 opacity-35"}`} />
          ))}
        </span>
      )}
      <span className="mt-1.5 text-[11px] font-semibold text-white/80 underline-offset-4 group-hover:underline">See our partners</span>
    </Link>
  );
}

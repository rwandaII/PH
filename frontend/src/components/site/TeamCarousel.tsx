"use client";

import { Img } from "@/components/site/Img";
import Link from "next/link";
import { useState } from "react";
import { reveal } from "@/lib/reveal";
import type { TeamMember } from "@/lib/types";

/** Home team section in ALU's testimonial style: two members at a time, round portraits on blue. */
export function TeamCarousel({ team }: { team: TeamMember[] }) {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(team.length / 2);
  const shown = team.slice(page * 2, page * 2 + 2);
  const go = (step: number) => setPage((p) => (p + step + pages) % pages);

  return (
    <section id="team" aria-label="Our team" className="bg-white">
      <div className="mx-auto flex max-w-[1172px] items-center gap-2 px-4 pb-24 pt-8">
        {pages > 1 && <Arrow label="Previous team members" onClick={() => go(-1)} d="M8 2 2 8l6 6" />}
        <ul className="flex flex-1 flex-wrap gap-x-12 gap-y-10">
          {shown.map((m, i) => (
            <li key={m.id} className="flex flex-[1_1_420px] flex-col items-start gap-5 sm:flex-row" {...reveal(i, "pop")}>
              <Portrait member={m} />
              <div className="flex-1">
                {m.bio && <p className="line-clamp-4 text-[14.5px] leading-[1.38] text-[#555555]">{m.bio}</p>}
                <p className="mt-[30px] text-[13px] font-bold text-band">
                  {m.slug ? (
                    <Link href={`/team/${m.slug}`} className="hover:underline">
                      {m.name}
                    </Link>
                  ) : (
                    m.name
                  )}
                </p>
                <p className="mt-0.5 text-[12px] text-grey">{m.role}</p>
                {m.slug && (
                  <Link href={`/team/${m.slug}`} className="mt-3 inline-flex min-h-9 items-center text-[13px] font-semibold text-accent">
                    View full profile
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
        {pages > 1 && <Arrow label="Next team members" onClick={() => go(1)} d="M2 2l6 6-6 6" />}
      </div>
    </section>
  );
}

/**
 * A team member's picture standing free, with no circle or frame: a cut-out photo (transparent
 * PNG) or the programme's emblem floats on the page with a soft shadow under it; an ordinary
 * photo gets gently rounded corners. Without a photo, the PH emblem is shown.
 */
export function Portrait({ member, size = "md" }: { member: TeamMember; size?: "md" | "lg" }) {
  const big = size === "lg";
  const photo = member.photo;
  const free = !photo || /\.png($|\?)/i.test(photo);
  const box = big ? "h-56 w-48 sm:h-64 sm:w-56" : "h-36 w-32";
  return (
    <div className={`pop-portrait relative flex flex-none items-end justify-center ${box}`}>
      {/* soft shadow on the ground under a free-standing picture */}
      {free && <span aria-hidden="true" className="absolute bottom-0 left-1/2 h-3 w-3/4 -translate-x-1/2 rounded-[50%] bg-[#002e6d]/20 blur-[6px]" />}
      <Img
        src={photo || "/logo/ph-logo.png"}
        alt={photo ? `Photo of ${member.name}` : ""}
        sizes={big ? "260px" : "160px"}
        className={
          free
            ? "relative block max-h-full w-full object-contain drop-shadow-[0_12px_14px_rgba(0,30,70,.28)]"
            : "relative block h-full w-full rounded-[22px] object-cover shadow-[0_18px_30px_-16px_rgba(0,30,70,.55)]"
        }
      />
    </div>
  );
}

function Arrow({ label, onClick, d }: { label: string; onClick: () => void; d: string }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="flex h-11 w-11 flex-none items-center justify-center text-[#6cb4d9] hover:text-accent">
      <svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={d} />
      </svg>
    </button>
  );
}

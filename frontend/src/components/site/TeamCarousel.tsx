"use client";

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

export function Portrait({ member, size = "md" }: { member: TeamMember; size?: "md" | "lg" }) {
  const big = size === "lg";
  return (
    <div className={`pop-portrait flex flex-none items-center justify-center rounded-full bg-[#e3e3e3] ${big ? "h-56 w-56 sm:h-64 sm:w-64" : "h-32 w-32"}`}>
      <img
        src={member.photo || "/illustrations/avatar.svg"}
        alt={member.photo ? `Photo of ${member.name}` : ""}
        className={`block rounded-full bg-band object-cover ${big ? "h-[calc(100%-18px)] w-[calc(100%-18px)]" : "h-[116px] w-[116px]"}`}
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

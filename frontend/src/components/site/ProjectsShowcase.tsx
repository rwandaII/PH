"use client";

import Link from "next/link";
import { useState } from "react";
import { STATUS_LABEL } from "@/lib/format";
import { imageOr } from "@/lib/illustrations";
import type { ProjectSummary } from "@/lib/types";
import { Chevron } from "./icons";

/**
 * Home "Our work": the project titles as a large index on the left; pointing at or choosing
 * one shows its photo and facts on the right. On small screens every project is listed in
 * full instead, so nothing depends on hovering.
 */
export function ProjectsShowcase({ projects }: { projects: ProjectSummary[] }) {
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false); // fade only after the visitor picks another project
  const choose = (i: number) => {
    if (i !== active) setTouched(true);
    setActive(i);
  };
  const current = projects[active] ?? projects[0];

  return (
    <>
      {/* Wide screens: index + preview */}
      <div className="mt-12 hidden gap-14 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <ul className="border-t border-[#bcd6e3]">
          {projects.map((p, i) => {
            const on = i === active;
            return (
              <li key={p.id} className="border-b border-[#bcd6e3]">
                <Link
                  href={`/projects/${p.slug}`}
                  onMouseEnter={() => choose(i)}
                  onFocus={() => choose(i)}
                  aria-current={on ? "true" : undefined}
                  className={`group relative flex items-baseline justify-between gap-6 py-6 pl-5 pr-2 transition-colors ${on ? "text-navy" : "text-[#5b7d93] hover:text-navy"}`}
                >
                  <span aria-hidden="true" className={`absolute bottom-3 left-0 top-3 w-[3px] bg-accent transition-opacity ${on ? "opacity-100" : "opacity-0"}`} />
                  <span className="font-display text-[26px] font-normal leading-[1.15]">{p.title}</span>
                  <span className="flex-none text-[13px]">{STATUS_LABEL[p.status]}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div aria-live="polite">
          {/* Same framed look as every other project photo (see FramedPhoto) */}
          <div className="relative pb-7 pr-7">
            <span aria-hidden="true" className="absolute bottom-0 left-12 right-0 top-12 bg-band" />
            <span aria-hidden="true" className="absolute bottom-0 right-0 h-20 w-20 opacity-80 [background-image:url(/patterns/cubes.svg)] [background-size:24.25px_42px]" />
            <img
              key={current.id}
              src={imageOr(current.coverImage, current.id)}
              alt=""
              className={`relative block aspect-[4/3] w-full object-cover shadow-[0_24px_44px_-24px_rgba(0,30,70,.6)] ${touched ? "fade-in" : ""}`}
            />
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-6 border-b border-[#bcd6e3] pb-5 text-[13.5px]">
            <div>
              <dt className="text-muted">Where</dt>
              <dd className="mt-1 font-semibold text-navy">{current.location || "Ruhengeri Diocese"}</dd>
            </div>
            <div>
              <dt className="text-muted">Status</dt>
              <dd className="mt-1 font-semibold text-navy">{STATUS_LABEL[current.status]}</dd>
            </div>
          </dl>
          {current.summary && <p className="mt-5 max-w-[60ch] text-[15.5px] leading-[1.65] text-ink">{current.summary}</p>}
          <Link href={`/projects/${current.slug}`} className="mt-5 inline-flex items-center gap-2.5 text-[14px] font-semibold text-accent">
            Read about this project <Chevron size={10} />
          </Link>
        </div>
      </div>

      {/* Small screens: every project in full */}
      <ul className="mt-10 space-y-12 lg:hidden">
        {projects.map((p) => (
          <li key={p.id}>
            <Link href={`/projects/${p.slug}`} className="block">
              <span className="relative block pb-5 pr-5">
                <span aria-hidden="true" className="absolute bottom-0 left-8 right-0 top-8 bg-band" />
                <img src={imageOr(p.coverImage, p.id)} alt="" className="relative block aspect-[3/2] w-full object-cover" />
              </span>
              <span className="mt-4 flex items-baseline justify-between gap-4">
                <span className="font-display text-[23px] leading-[1.2] text-navy">{p.title}</span>
              </span>
              <span className="mt-1 block text-[13px] text-muted">
                {p.location || "Ruhengeri Diocese"}, {STATUS_LABEL[p.status].toLowerCase()}
              </span>
              {p.summary && <span className="mt-3 block text-[15px] leading-[1.6] text-ink">{p.summary}</span>}
              <span className="mt-3 inline-flex items-center gap-2.5 text-[14px] font-semibold text-accent">
                Read more <Chevron size={10} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

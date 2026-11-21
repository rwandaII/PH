"use client";

import { useRef, useState } from "react";
import { ENGAGEMENT } from "@/lib/profile";

const ICONS = [
  // hands together: participation and ownership
  <path key="0" d="M4 13l4-4 3 2 2-2 3 2 4-3M4 13l5 5 3-1 3 2 5-6M9 18l2-2M12 17l2-2" />,
  // speech: behaviour change and sensitisation
  <path key="1" d="M4 5h16v10H9l-5 4zM8 9h8M8 12h5" />,
  // key handed over: governance and handovers
  <path key="2" d="M14.5 9.5a4 4 0 1 1-1.2-2.9M13.3 10.7L21 18.5V21h-2.5v-2h-2v-2h-2l-1.2-1.2M7.5 9.5h.01" />,
];

/**
 * 2.5 Community engagement and outreach: three tabs (arrow keys move between them). The
 * chosen tab's text rises in; the tab strip shows a water line under the chosen one.
 */
export function EngagementTabs() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const items = ENGAGEMENT.items;

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + items.length) % items.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
      <div role="tablist" aria-label="Community engagement and outreach" aria-orientation="vertical" onKeyDown={onKey} className="flex flex-col gap-2 max-lg:grid max-lg:grid-cols-3 max-sm:grid-cols-1">
        {items.map((it, i) => {
          const on = i === active;
          return (
            <button
              key={it.title}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`engage-tab-${i}`}
              aria-selected={on}
              aria-controls={`engage-panel-${i}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              className={`group relative flex min-h-[64px] items-center gap-4 overflow-hidden border px-4 py-3 text-left transition-colors duration-300 ${
                on ? "border-accent bg-accent text-white" : "border-[#d6e7f0] bg-white text-navy hover:border-accent"
              }`}
            >
              <span className={`flex h-10 w-10 flex-none items-center justify-center rounded-full transition-colors ${on ? "bg-white/20 text-white" : "bg-mist text-accent"}`}>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  {ICONS[i % ICONS.length]}
                </svg>
              </span>
              <span className="text-[14px] font-bold leading-[1.3]">{it.title}</span>
              {on && <span aria-hidden="true" className="tab-wave absolute inset-x-0 bottom-0 h-[5px] bg-[repeating-linear-gradient(90deg,#90e0ef_0_10px,transparent_10px_20px)] opacity-70" />}
            </button>
          );
        })}
      </div>

      {items.map((it, i) => (
        <div
          key={it.title}
          role="tabpanel"
          id={`engage-panel-${i}`}
          aria-labelledby={`engage-tab-${i}`}
          hidden={i !== active}
          tabIndex={0}
          className="panel-in relative border-l-[3px] border-accent bg-white px-6 py-6 shadow-[0_24px_50px_-36px_rgba(0,46,109,.55)] sm:px-8 sm:py-8"
        >
          <span aria-hidden="true" className="font-display absolute right-6 top-3 text-[72px] font-light leading-none text-accent/10">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="font-display relative text-[24px] font-normal leading-[1.2] text-navy">{it.title}</h3>
          {it.text.map((t, j) => (
            <p key={j} className={`relative max-w-[66ch] text-[15px] leading-[1.75] text-ink ${j === 0 ? "mt-4" : "mt-3"}`}>
              {t}
            </p>
          ))}
          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActive((active + 1) % items.length)}
              className="inline-flex min-h-10 items-center gap-2 text-[13px] font-semibold text-accent hover:underline"
            >
              Next: {items[(i + 1) % items.length].title} <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/** The engagement section around the tabs. */
export function Engagement() {
  return (
    <section id="engagement" aria-labelledby="engagement-heading" className="scroll-mt-6 bg-[linear-gradient(180deg,#e6f2f7_0%,#ffffff_100%)]">
      <div className="mx-auto max-w-[1172px] px-4 py-20 lg:py-[100px] lg:pr-[300px]">
        <p data-reveal="" className="text-[12px] font-bold uppercase tracking-[.18em] text-accent">
          Community engagement and outreach
        </p>
        <h2 id="engagement-heading" className="font-display mt-3 text-[34px] font-normal leading-[1.05] text-navy sm:text-[40px]">
          Communities in the lead
        </h2>
        <p className="mt-6 max-w-[66ch] text-[15.5px] leading-[1.75] text-ink">{ENGAGEMENT.intro}</p>
        <EngagementTabs />
      </div>
    </section>
  );
}

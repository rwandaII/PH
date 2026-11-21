import { CountUp } from "@/components/site/Motion";
import { ACHIEVEMENTS, APPROACHES, MEAL, RISKS, TARGET_GROUPS, TARGET_GROUPS_INTRO, type TargetIcon } from "@/lib/profile";
import { reveal } from "@/lib/reveal";

const H2 = "font-display text-[34px] font-normal leading-[1.05] sm:text-[40px]";

/** Line icons for the target groups (24px grid, stroke = currentColor). */
function TargetGlyph({ icon }: { icon: TargetIcon }) {
  const p = {
    committee: (
      <>
        <circle cx="12" cy="6.5" r="2.5" />
        <circle cx="5" cy="9" r="2" />
        <circle cx="19" cy="9" r="2" />
        <path d="M7.5 19v-3.5a4.5 4.5 0 0 1 9 0V19M2 18v-2a3 3 0 0 1 4-2.8M22 18v-2a3 3 0 0 0-4-2.8M12 13.5v-1" />
      </>
    ),
    cooperative: (
      <>
        <path d="M3 11l4-4 3 2 4-4 7 7" />
        <path d="M5 13v7h14v-7M10 20v-4h4v4" />
        <path d="M12 2.5c-1.4 1.8-2 3-2 3.8a2 2 0 0 0 4 0c0-.8-.6-2-2-3.8z" />
      </>
    ),
    hygiene: (
      <>
        <path d="M7 11V6a2 2 0 0 1 4 0v4M11 9.5a2 2 0 0 1 4 0V12M15 11a2 2 0 0 1 4 0v3.5a6.5 6.5 0 0 1-6.5 6.5H12a5 5 0 0 1-5-5v-3" />
        <path d="M5 6.5c-.9 1.1-1.3 1.9-1.3 2.4a1.3 1.3 0 0 0 2.6 0c0-.5-.4-1.3-1.3-2.4zM19.5 3c-.9 1.1-1.3 1.9-1.3 2.4a1.3 1.3 0 0 0 2.6 0c0-.5-.4-1.3-1.3-2.4z" />
      </>
    ),
    school: (
      <>
        <path d="M2 9l10-5 10 5-10 5z" />
        <path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5M22 9v6" />
      </>
    ),
    health: (
      <>
        <rect x="3" y="5" width="18" height="15" rx="2" />
        <path d="M12 9v7M8.5 12.5h7M9 5V3h6v2" />
      </>
    ),
    savings: (
      <>
        <ellipse cx="9" cy="7" rx="6" ry="2.5" />
        <path d="M3 7v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V7M3 11v4c0 1.4 2.7 2.5 6 2.5 1 0 1.9-.1 2.7-.3" />
        <circle cx="17.5" cy="16.5" r="4.5" />
        <path d="M17.5 14.5v4M16 16h3" />
      </>
    ),
    tree: (
      <>
        <path d="M12 21v-7M12 14l-3-3M12 16l3-3" />
        <path d="M12 3c3.9 0 7 3 7 6.6 0 3-2.4 5.4-5.4 5.4h-3.2C7.4 15 5 12.6 5 9.6 5 6 8.1 3 12 3z" />
        <path d="M4 21h16" />
      </>
    ),
    people: (
      <>
        <circle cx="12" cy="7" r="3" />
        <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
        <path d="M12 13.5l-1.2 2.2L12 17l1.2-1.3z" />
        <path d="M3.5 12.5c1.6-1.2 3-1.4 4-1M20.5 12.5c-1.6-1.2-3-1.4-4-1" />
      </>
    ),
  }[icon];
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9">
      {p}
    </svg>
  );
}

/** Table 1: the target groups as cards. Each card's water rises on hover. */
export function TargetGroups() {
  return (
    <section id="target-groups" aria-labelledby="target-groups-heading" className="relative scroll-mt-6 overflow-hidden bg-white">
      <div className="mx-auto max-w-[1172px] px-4 py-20 lg:py-[100px] lg:pr-[300px]">
        <p {...reveal(0)} className="text-[12px] font-bold uppercase tracking-[.18em] text-accent">
          Target groups and beneficiaries
        </p>
        <h2 id="target-groups-heading" {...reveal(1)} className={`${H2} mt-3 text-navy`}>
          Who we work for
        </h2>
        <p {...reveal(2)} className="mt-6 max-w-[64ch] text-[15.5px] leading-[1.75] text-ink">
          {TARGET_GROUPS_INTRO}
        </p>
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {TARGET_GROUPS.map((g, i) => (
            <li key={g.name} {...reveal(i % 4, "pop", 90)}>
              <div className="target-card group relative flex h-full min-h-[178px] flex-col justify-between overflow-hidden border border-[#d6e7f0] bg-white p-4 sm:p-5">
                <span aria-hidden="true" className="target-fill absolute inset-0 bg-[linear-gradient(180deg,#48cae4_0%,#0077b6_60%,#023e7d_100%)]" />
                <span className="relative flex items-start justify-between">
                  <span className="target-icon flex h-14 w-14 items-center justify-center rounded-full bg-mist text-accent transition-colors duration-500">
                    <TargetGlyph icon={g.icon} />
                  </span>
                  <span className="font-display text-[22px] font-light text-accent/40 transition-colors duration-500 group-hover:text-white/60">{String(i + 1).padStart(2, "0")}</span>
                </span>
                <span className="relative mt-5 block text-[15px] font-bold leading-[1.3] text-navy transition-colors duration-500 group-hover:text-white">{g.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Key achievements: big counters, the document's sentences and the capacity-building structures. */
export function Achievements() {
  const blocks = [ACHIEVEMENTS.water, ACHIEVEMENTS.hygiene];
  return (
    <section id="achievements" aria-labelledby="achievements-heading" className="relative scroll-mt-6 overflow-hidden bg-[radial-gradient(110%_70%_at_80%_0%,#0a4d8f_0%,#002e6d_50%,#001d47_100%)] text-white">
      <svg aria-hidden="true" viewBox="0 0 1440 200" preserveAspectRatio="none" className="water-drift pointer-events-none absolute inset-x-0 bottom-0 h-[160px] w-[110%] text-[#48cae4] opacity-[.12]">
        <path d="M0 80c160-50 320-50 480 0s320 50 480 0 320-50 480 0v120H0z" fill="currentColor" />
      </svg>
      <div className="relative mx-auto max-w-[1172px] px-4 py-20 lg:py-[100px] lg:pr-[300px]">
        <p {...reveal(0)} className="text-[12px] font-bold uppercase tracking-[.18em] text-[#90e0ef]">
          What we have done
        </p>
        <h2 id="achievements-heading" {...reveal(1)} className={`${H2} mt-3`}>
          Key achievements
        </h2>
        <span aria-hidden="true" className="draw-line mt-5 block h-[3px] w-16 bg-[#48cae4]" />

        {blocks.map((b, bi) => (
          <div key={b.title} className="mt-12">
            <h3 {...reveal(0)} className="flex items-center gap-4 text-[15px] font-bold uppercase tracking-[.12em] text-[#90e0ef]">
              {b.title}
              <span aria-hidden="true" className="h-px flex-1 bg-white/20" />
            </h3>
            <ul className="mt-6 grid grid-cols-2 gap-px bg-white/15 md:grid-cols-4">
              {b.numbers.map((n, i) => (
                <li key={n.label} {...reveal(i, "pop", 90)} className="stat-tile relative bg-[#002e6d] px-5 py-6">
                  <span className="font-display block text-[40px] font-light leading-none text-white sm:text-[46px]">
                    <CountUp value={n.value} duration={1600 + bi * 200} />
                    {(n as { plus?: boolean }).plus && <span className="text-[#48cae4]">+</span>}
                  </span>
                  <span className="mt-2.5 block text-[13px] font-semibold leading-[1.35] text-white/80">{n.label}</span>
                </li>
              ))}
            </ul>
            <p {...reveal(1)} className="mt-5 max-w-[70ch] text-[15px] leading-[1.75] text-white/85">
              {b.text}
            </p>
          </div>
        ))}

        <div className="mt-14 grid gap-10 border-t border-white/20 pt-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)]">
          <div>
            <h3 {...reveal(0)} className="text-[15px] font-bold uppercase tracking-[.12em] text-[#90e0ef]">
              {ACHIEVEMENTS.capacity.title}
            </h3>
            {ACHIEVEMENTS.capacity.text.map((t, i) => (
              <p key={i} {...reveal(i + 1)} className={`max-w-[62ch] text-[15px] leading-[1.75] ${i === 0 ? "font-display mt-4 text-[19px] leading-[1.6] text-white" : "mt-4 text-white/85"}`}>
                {t}
              </p>
            ))}
          </div>
          <div>
            <p {...reveal(0)} className="text-[12px] font-bold uppercase tracking-[.14em] text-white/60">
              Community-based structures
            </p>
            <ol className="mt-4 space-y-2.5">
              {ACHIEVEMENTS.capacity.structures.map((s, i) => (
                <li key={s} {...reveal(i, "right", 90)} className="structure-row flex items-center gap-4 border border-white/15 bg-white/[.04] px-4 py-3.5 text-[14.5px] font-semibold">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#48cae4] text-[13px] font-bold text-navy">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 4.1 Technical approaches: numbered cards; the number fills with water on hover. */
export function Approaches() {
  return (
    <section id="approaches" aria-labelledby="approaches-heading" className="scroll-mt-6 bg-mist">
      <div className="mx-auto max-w-[1172px] px-4 py-20 lg:py-[100px] lg:pr-[300px]">
        <p {...reveal(0)} className="text-[12px] font-bold uppercase tracking-[.18em] text-accent">
          Technical approaches and implementation strategy
        </p>
        <h2 id="approaches-heading" {...reveal(1)} className={`${H2} mt-3 text-navy`}>
          How we work
        </h2>
        <p {...reveal(2)} className="mt-6 max-w-[64ch] text-[15.5px] leading-[1.75] text-ink">
          The Hydraulic Programme adopts the following complementary and integrated implementation approaches to ensure community
          participation, sustainable WASH services, behavioral change and environmental resilience.
        </p>
        <ol className="mt-12 grid gap-4 md:grid-cols-2">
          {APPROACHES.map((a, i) => (
            <li key={a.title} {...reveal(i % 2, "rise", 110)}>
              <article className="approach-card group relative h-full overflow-hidden border border-[#d6e7f0] bg-white p-6 sm:p-7">
                <span aria-hidden="true" className="approach-bar absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
                <div className="flex items-start gap-5">
                  <span className="approach-num font-display flex-none text-[52px] font-light leading-[.9]" data-num={String(i + 1).padStart(2, "0")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    {a.short && <span className="inline-block bg-navy px-2 py-0.5 text-[11px] font-bold tracking-[.1em] text-white">{a.short}</span>}
                    <h3 className={`text-[17px] font-bold leading-[1.3] text-navy ${a.short ? "mt-2" : ""}`}>{a.title}</h3>
                  </div>
                </div>
                <p className="mt-4 text-[14.5px] leading-[1.7] text-ink">{a.text}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** 3.3 MEAL and 3.4 risk management, side by side; the MEAL letters turn like a cycle. */
export function Accountability() {
  const cycle = ["Monitoring", "Evaluation", "Accountability", "Learning"];
  return (
    <section id="accountability" aria-labelledby="accountability-heading" className="scroll-mt-6 bg-white">
      <div className="mx-auto max-w-[1172px] px-4 py-20 lg:py-[100px] lg:pr-[300px]">
        <p {...reveal(0)} className="text-[12px] font-bold uppercase tracking-[.18em] text-accent">
          Transparency and continuous improvement
        </p>
        <h2 id="accountability-heading" {...reveal(1)} className={`${H2} mt-3 text-navy`}>
          Accountability and risk management
        </h2>

        <div className="mt-12 grid items-center gap-10 md:grid-cols-[230px_minmax(0,1fr)] md:gap-12">
          {/* MEAL cycle */}
          <div {...reveal(0, "zoom")} className="relative mx-auto aspect-square w-[230px]" aria-hidden="true">
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
              <circle cx="100" cy="100" r="78" fill="none" stroke="#d6e7f0" strokeWidth="14" />
              <circle cx="100" cy="100" r="78" fill="none" stroke="#0077b6" strokeWidth="14" strokeDasharray="110 380" strokeLinecap="round" className="meal-sweep" />
            </svg>
            {cycle.map((c, i) => {
              const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
              return (
                <span
                  key={c}
                  className="meal-letter font-display absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-navy text-[20px] text-white shadow-lg"
                  style={{ left: `${50 + 39 * Math.cos(a)}%`, top: `${50 + 39 * Math.sin(a)}%`, animationDelay: `${i * 1.5}s` }}
                >
                  {c[0]}
                </span>
              );
            })}
            <span className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-display text-[30px] leading-none text-navy">MEAL</span>
              <span className="mt-1 text-[10.5px] font-semibold uppercase tracking-[.12em] text-grey">system</span>
            </span>
          </div>
          <div>
            <h3 {...reveal(0)} className="text-[15px] font-bold text-navy">
              Monitoring, Evaluation, Accountability and Learning
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2" aria-hidden="true">
              {cycle.map((c) => (
                <li key={c} className="border border-accent/40 px-2.5 py-1 text-[12px] font-semibold text-accent">
                  <strong>{c[0]}</strong>
                  {c.slice(1)}
                </li>
              ))}
            </ul>
            <p {...reveal(1)} className="mt-4 text-[15px] leading-[1.75] text-ink">
              {MEAL}
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-line pt-12">
          <h3 {...reveal(0)} className="text-[15px] font-bold text-navy">
            Risk management
          </h3>
          <div className="mt-4 grid gap-10 md:grid-cols-[minmax(0,1fr)_260px]">
            <div className="space-y-4">
              {RISKS.text.map((t, i) => (
                <p key={i} {...reveal(i + 1)} className="text-[15px] leading-[1.75] text-ink">
                  {t}
                </p>
              ))}
            </div>
            <aside {...reveal(1, "left")} className="self-start bg-navy p-6 text-white">
              <p className="text-[12px] font-bold uppercase tracking-[.14em] text-[#90e0ef]">Particular attention to</p>
              <ul className="mt-4 space-y-2">
                {RISKS.focus.map((r) => (
                  <li key={r} className="risk-row flex items-start gap-3 text-[14px] leading-[1.45]">
                    <span aria-hidden="true" className="mt-[7px] h-2 w-2 flex-none rotate-45 bg-[#48cae4]" />
                    {r}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

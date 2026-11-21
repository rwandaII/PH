import Link from "next/link";
import { Img } from "@/components/site/Img";
import type { TeamMember } from "@/lib/types";
import { Chevron } from "./icons";

/** "15 years", "20years", "15 yrs", "+ 10 yrs" → 15, 20, 15, 10. */
export function yearsOf(text: string | null | undefined) {
  const m = (text ?? "").match(/\d+/);
  return m ? Number(m[0]) : 0;
}

/** "Marie Yvonne INGABIRE" → "MI". */
function initials(name: string) {
  const words = name.split(/\s+/).filter(Boolean);
  return ((words[0]?.[0] ?? "") + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
}

interface CardData {
  name: string;
  role?: string;
  washYears: string;
  expertise: string;
  competence: string;
  award: string;
  photo?: string | null;
}

/**
 * A member of the key technical team. The round gauge fills with water to show their years in the
 * WASH domain (relative to the longest-serving member, `maxYears`); the water rises when the card
 * scrolls into view and ripples while you point at it. With a photo, the photo sits in the gauge.
 */
export function KeyTeamCard({ member, maxYears, href, index = 0 }: { member: CardData; maxYears: number; href?: string; index?: number }) {
  const years = yearsOf(member.washYears ?? "");
  const level = maxYears > 0 ? Math.max(0.12, Math.min(1, years / maxYears)) : 0.5;
  const body = (
    <>
      <span className="flex items-start justify-between gap-3">
        <span className="gauge relative block h-[112px] w-[112px] flex-none overflow-hidden rounded-full border-[3px] border-white bg-[#e8f4fa] shadow-[0_0_0_1px_#cfe3ee,0_18px_36px_-20px_rgba(0,46,109,.7)]" style={{ "--level": `${(1 - level) * 100}%` } as React.CSSProperties}>
          {member.photo ? (
            <Img src={member.photo} alt={`Photo of ${member.name}`} sizes="112px" className="absolute inset-0 h-full w-full object-cover object-top" />
          ) : (
            <>
              <span className="gauge-water absolute inset-0">
                <svg aria-hidden="true" viewBox="0 0 240 20" preserveAspectRatio="none" className="gauge-wave absolute -top-[9px] left-0 h-[10px] w-[200%] text-[#48cae4]">
                  <path d="M0 10c20-8 40-8 60 0s40 8 60 0 40-8 60 0 40 8 60 0v10H0z" fill="currentColor" />
                </svg>
                <span className="absolute inset-0 bg-[linear-gradient(180deg,#48cae4_0%,#0077b6_70%,#023e7d_100%)]" />
              </span>
              <span className="font-display absolute inset-0 flex items-center justify-center text-[34px] font-semibold text-navy mix-blend-multiply">{initials(member.name)}</span>
            </>
          )}
        </span>
        <span className="text-right">
          <span className="font-display block text-[44px] font-light leading-none text-accent">{years || "–"}</span>
          <span className="mt-1 block text-[11px] font-bold uppercase leading-tight tracking-[.12em] text-navy">
            {/\+/.test(member.washYears) ? "+ years" : "years"}
            <br />
            in WASH
          </span>
        </span>
      </span>

      <span className="mt-5 block text-[17px] font-bold leading-[1.25] text-navy transition-colors group-hover:text-accent">{member.name}</span>
      {member.role && member.role !== member.expertise && <span className="mt-1 block text-[13px] font-semibold text-accent">{member.role}</span>}

      <span className="mt-4 grid gap-2.5 border-t border-[#dcebf3] pt-4 text-[13px] leading-[1.4]">
        {member.expertise && (
          <span className="flex gap-2.5">
            <span className="w-[96px] flex-none text-[10.5px] font-bold uppercase tracking-[.08em] text-grey">Expertise</span>
            <span className="text-ink">{member.expertise}</span>
          </span>
        )}
        {member.competence && (
          <span className="flex gap-2.5">
            <span className="w-[96px] flex-none text-[10.5px] font-bold uppercase tracking-[.08em] text-grey">Competence</span>
            <span className="text-ink">{member.competence}</span>
          </span>
        )}
      </span>

      <span className="mt-auto flex items-center justify-between gap-3 pt-5">
        {member.award ? <span className="award-chip inline-flex items-center gap-1.5 bg-navy px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-[.08em] text-white">{member.award}</span> : <span />}
        {href && (
          <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-accent opacity-70 transition-opacity group-hover:opacity-100">
            Profile <Chevron size={9} />
          </span>
        )}
      </span>
    </>
  );

  const cls =
    "key-card group relative flex h-full flex-col overflow-hidden border border-[#dcebf3] bg-white p-5 shadow-[0_22px_44px_-34px_rgba(0,30,70,.6)] outline-none transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1.5 hover:border-accent/60 hover:shadow-[0_30px_60px_-30px_rgba(0,46,109,.55)] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:p-6";
  return href ? (
    <Link href={href} className={cls} style={{ "--i": index } as React.CSSProperties}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export const keyCardData = (m: TeamMember): CardData => ({
  name: m.name,
  role: m.role,
  washYears: m.washYears,
  expertise: m.expertise,
  competence: m.competence,
  award: m.education.split(/\n+/)[0]?.trim() ?? "",
  photo: m.photo,
});

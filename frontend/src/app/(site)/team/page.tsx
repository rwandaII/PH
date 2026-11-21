import type { Metadata } from "next";
import Link from "next/link";
import { KeyTeamCard, keyCardData, yearsOf } from "@/components/site/KeyTeamCard";
import { OrgChart } from "@/components/site/OrgChart";
import { FactsBand, OutlineLink, ProgramHero } from "@/components/site/ProgramLayout";
import { CountUp } from "@/components/site/Motion";
import { EXTENSIONISTS, TECHNICAL_EXPERTISE } from "@/lib/profile";
import { reveal } from "@/lib/reveal";
import { getPublicOr, getSite, getSiteImages } from "@/lib/server-api";
import { picturesOr } from "@/lib/site-images";
import { teamAnchor, teamCounts, type TeamCategory } from "@/lib/team-categories";
import type { TeamMember } from "@/lib/types";

export const metadata: Metadata = {
  title: "Our team",
  description:
    "The key technical team of the Hydraulic Programme of Ruhengeri Diocese: their years in the WASH domain, technical expertise, areas of competence and awards.",
};

/** The key technical team (Table 2 of the programme's profile), then the organisational chart. */
export default async function TeamPage() {
  const [site, team, pics] = await Promise.all([getSite(), getPublicOr<TeamMember[]>("/team", []), getSiteImages()]);
  const maxYears = Math.max(10, ...team.map((m) => yearsOf(m.washYears)));
  const totalYears = team.reduce((n, m) => n + yearsOf(m.washYears), 0);
  const masters = team.filter((m) => /master/i.test(m.education)).length;

  // The organisational chart links to /team#team-<box>: give that anchor to the first person in each box.
  const anchored = new Set<string>();
  const anchorFor = (m: TeamMember) => {
    if (!m.category || anchored.has(m.category)) return undefined;
    anchored.add(m.category);
    return teamAnchor(m.category as TeamCategory);
  };

  return (
    <>
      <ProgramHero
        title="Our team"
        subtitle={site.programName}
        place="Musanze, Northern Province, Rwanda"
        text="A competent multidisciplinary technical team with the expertise and capacity to perform a wide range of tasks across the Water, Sanitation and Hygiene (WASH) domains."
        images={picturesOr(pics, "team.header")}
      />

      <FactsBand
        facts={[
          { label: "Permanent staff", value: "6", big: true },
          { label: "Field team", value: "12", big: true },
          { label: "Working since", value: "2007", big: true },
        ]}
      />

      <section id="key-team" aria-labelledby="key-team-heading" className="relative scroll-mt-4 overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#e6f2f7_100%)]">
        <div className="mx-auto max-w-[1172px] px-4 py-20 lg:py-[100px]">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
            <div>
              <p {...reveal(0)} className="text-[12px] font-bold uppercase tracking-[.18em] text-accent">
                Technical expertise and areas of competence
              </p>
              <h2 id="key-team-heading" {...reveal(1)} className="font-display mt-3 text-[38px] font-normal leading-[1.05] text-navy sm:text-[46px]">
                Key technical team
              </h2>
              <span aria-hidden="true" className="draw-line mt-5 block h-[3px] w-16 bg-accent" />
              <p {...reveal(2)} className="mt-6 max-w-[68ch] text-[15.5px] leading-[1.75] text-ink">
                {TECHNICAL_EXPERTISE}
              </p>
            </div>
            {totalYears > 0 && (
              <aside {...reveal(2, "pop")} aria-label="The team in numbers" className="relative overflow-hidden bg-navy px-7 py-8 text-white">
                <span aria-hidden="true" className="water-drift absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,transparent,rgba(72,202,228,.25))]" />
                <span className="font-display relative block text-[64px] font-light leading-none text-[#48cae4]">
                  <CountUp value={totalYears} />
                </span>
                <span className="relative mt-2 block text-[14px] font-semibold leading-[1.4]">years in the WASH domain, together, across the {team.length} people below</span>
                <span className="relative mt-5 flex gap-6 border-t border-white/20 pt-4 text-[13px] text-white/80">
                  <span>
                    <strong className="block text-[22px] text-white">{maxYears}</strong>longest, in years
                  </span>
                  {masters > 0 && (
                    <span>
                      <strong className="block text-[22px] text-white">{masters}</strong>Masters degrees
                    </span>
                  )}
                </span>
              </aside>
            )}
          </div>

          {team.length === 0 ? (
            <p className="mt-14 text-muted">Team profiles will appear here soon.</p>
          ) : (
            <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
              {team.map((m, i) => (
                <li key={m.id} id={anchorFor(m)} {...reveal(i % 3, "rise", 110)} className="key-team-item scroll-mt-6">
                  <KeyTeamCard member={keyCardData(m)} maxYears={maxYears} href={m.slug ? `/team/${m.slug}` : undefined} index={i} />
                </li>
              ))}
              <li id={teamAnchor("extensionists")} {...reveal(team.length % 3, "rise", 110)} className="key-team-item scroll-mt-6">
                <KeyTeamCard
                  member={{
                    name: EXTENSIONISTS.name,
                    role: "Field extensionists",
                    washYears: EXTENSIONISTS.washYears,
                    expertise: EXTENSIONISTS.expertise,
                    competence: EXTENSIONISTS.competence,
                    award: EXTENSIONISTS.award,
                  }}
                  maxYears={maxYears}
                />
              </li>
            </ol>
          )}
        </div>
      </section>

      <section id="structure" aria-labelledby="structure-heading" className="scroll-mt-4 bg-white">
        <div className="mx-auto max-w-[1172px] border-t border-line px-4 py-20 lg:py-[100px]">
          <h2 id="structure-heading" {...reveal(0)} className="font-display text-[34px] font-normal leading-[1.05] text-navy sm:text-[38px]">
            How we are organised
          </h2>
          <p {...reveal(1)} className="mt-5 max-w-[62ch] text-[15.5px] leading-[1.7] text-ink">
            The programme works under the development department of the Catholic Diocese of Ruhengeri. Choose a box to see the people
            who work there. Read more about our{" "}
            <Link href="/about#governance" className="font-semibold text-accent hover:underline">
              governance and structure
            </Link>
            .
          </p>
          <OrgChart counts={teamCounts(team)} />
          <OutlineLink href="/contact">Work with us</OutlineLink>
        </div>
      </section>
    </>
  );
}

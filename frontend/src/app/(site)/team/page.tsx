import type { Metadata } from "next";
import Link from "next/link";
import { OrgChart } from "@/components/site/OrgChart";
import { FactsBand, OutlineLink, ProgramHero } from "@/components/site/ProgramLayout";
import { TeamCard } from "@/components/site/TeamCard";
import { reveal } from "@/lib/reveal";
import { getPublicOr, getSite, getSiteImages } from "@/lib/server-api";
import { picturesOr } from "@/lib/site-images";
import { groupTeam, teamCounts } from "@/lib/team-categories";
import type { TeamMember } from "@/lib/types";

export const metadata: Metadata = {
  title: "Our team",
  description: "The people of the Hydraulic Programme of Ruhengeri Diocese, grouped as in its organisational chart.",
};

/** The whole team, grouped like the organisational chart. Chart boxes link to /team#team-<box>. */
export default async function TeamPage() {
  const [site, team, pics] = await Promise.all([getSite(), getPublicOr<TeamMember[]>("/team", []), getSiteImages()]);
  const groups = groupTeam(team);

  return (
    <>
      <ProgramHero
        title="Our team"
        subtitle={site.programName}
        place="Musanze, Northern Province, Rwanda"
        text="The people who plan, build and follow up our water, hygiene and sanitation work, grouped as in our organisational chart."
        images={picturesOr(pics, "team.header")}
      />

      <FactsBand
        facts={[
          { label: "Permanent staff", value: "6", big: true },
          { label: "Field team", value: "12", big: true },
          { label: "Working since", value: "2007", big: true },
        ]}
      />

      {/* Jump to a group */}
      <nav aria-label="Team groups" className="bg-white">
        <div className="mx-auto flex max-w-[1172px] flex-wrap gap-2.5 px-4 pt-14">
          {groups.map((g, i) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              {...reveal(i, "pop", 70)}
              className="inline-flex min-h-11 items-center gap-2 border border-accent px-4 text-[13.5px] font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
            >
              {g.title}
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-mist px-1.5 text-[12px] text-navy">{g.size}</span>
            </a>
          ))}
          <a href="#structure" className="inline-flex min-h-11 items-center px-3 text-[13.5px] font-semibold text-navy underline-offset-4 hover:underline">
            Organisational chart
          </a>
        </div>
      </nav>

      {groups.length === 0 && (
        <p className="mx-auto max-w-[1172px] px-4 py-20 text-muted">Team profiles will appear here soon.</p>
      )}

      {groups.map((g, gi) => (
        <section
          key={g.id}
          id={g.id}
          aria-labelledby={`${g.id}-heading`}
          className={`scroll-mt-4 ${gi % 2 === 0 ? "bg-white" : "bg-mist"}`}
        >
          <div className="mx-auto grid max-w-[1172px] gap-10 px-4 py-16 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-14 lg:py-20">
            <header {...reveal(0, "left")} className="lg:sticky lg:top-6 lg:self-start">
              <span className="font-display block text-[56px] font-light leading-none text-accent/30">{String(gi + 1).padStart(2, "0")}</span>
              <h2 id={`${g.id}-heading`} className="font-display mt-2 text-[30px] font-normal leading-[1.08] text-navy">
                {g.title}
              </h2>
              <span aria-hidden="true" className="draw-line mt-4 block h-[3px] w-14 bg-accent" />
              {g.about && <p className="mt-4 text-[14.5px] leading-[1.6] text-muted">{g.about}</p>}
              <p className="mt-3 text-[13px] font-semibold text-navy">{g.size === 1 ? "1 person" : `${g.size} people`}</p>
            </header>

            <div className="flex flex-col gap-12">
              {g.parts.map((part) => (
                <div key={part.id} id={part.id} className="team-part scroll-mt-6">
                  {part.label && (
                    <h3 className="flex items-center gap-3 text-[15px] font-semibold text-accent">
                      {part.label}
                      <span aria-hidden="true" className="h-px flex-1 bg-[#c9dcea]" />
                    </h3>
                  )}
                  <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-6 sm:[grid-template-columns:repeat(auto-fill,minmax(185px,1fr))]">
                    {part.members.map((m, i) => (
                      <li key={m.id} {...reveal(i, "rise", 90)}>
                        <TeamCard member={m} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

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

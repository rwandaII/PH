import type { Metadata } from "next";
import Link from "next/link";
import { WithPageNav, type PageNavItem } from "@/components/site/PageNav";
import { ArchPhoto, DarkBand, FactsBand, FramedPhoto, ProgramHero } from "@/components/site/ProgramLayout";
import { servicesFrom, type ServiceRow } from "@/lib/services";
import { Portrait } from "@/components/site/TeamCarousel";
import { paragraphs } from "@/lib/format";
import { imageOr } from "@/lib/illustrations";
import { getPublicOr, getSite } from "@/lib/server-api";
import type { NewsSummary, Partner, ProjectSummary, TeamMember } from "@/lib/types";

export const metadata: Metadata = { title: "About" };

/** About, laid out like ALU's programme page: photo header, facts band, then the sections. */
export default async function AboutPage() {
  const [site, team, projects, partners, news, serviceRows] = await Promise.all([
    getSite(),
    getPublicOr<TeamMember[]>("/team", []),
    getPublicOr<ProjectSummary[]>("/projects", []),
    getPublicOr<Partner[]>("/partners", []),
    getPublicOr<{ items: NewsSummary[] }>("/news?page=1", { items: [] }),
    getPublicOr<ServiceRow[]>("/services", []),
  ]);
  const SERVICES = servicesFrom(serviceRows);
  const about = paragraphs(site.aboutText);
  const photos = [...projects.map((p) => p.coverImage), ...news.items.map((n) => n.coverImage)].filter((s): s is string => !!s);

  const nav: PageNavItem[] = [
    { id: "who", label: "Who we are" },
    { id: "services", label: "Our services" },
  ];
  if (site.mission || site.vision) nav.push({ id: "mission", label: "Mission and vision" });
  if (team.length > 0) nav.push({ id: "team", label: "Our team" });

  return (
    <>
      <ProgramHero
        title="About the program"
        subtitle={site.programName}
        place="Musanze, Northern Province, Rwanda"
        text={site.heroText || site.tagline}
        image="/photos/field/diocese-offices.jpg"
      />

      <WithPageNav items={nav} action={{ href: "/contact", label: "Contact us" }}>
        <FactsBand
          facts={[
            { label: "Working since", value: "2007", big: true },
            { label: "Areas of work", value: String(projects.length), big: true },
            { label: "Partners", value: String(partners.length), big: true },
          ]}
        />

        <section id="who" className="scroll-mt-6 bg-white">
          <div className="mx-auto grid max-w-[1172px] items-end gap-12 px-4 pt-20 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-20 lg:pt-[110px]">
            <div className="pb-4 lg:pb-[110px]">
              <h2 className="font-display text-[34px] font-normal leading-[1.05] text-navy sm:text-[38px]">Who we are</h2>
              {about.length > 0 ? (
                about.map((p, i) => (
                  <p key={i} className={`max-w-[60ch] text-[15px] leading-[1.7] text-ink ${i === 0 ? "mt-7" : "mt-4"}`}>
                    {p}
                  </p>
                ))
              ) : (
                <p className="mt-7 text-muted">Information about the program will appear here soon.</p>
              )}
            </div>
            <ArchPhoto src="/photos/portrait-cutout.png" cutout />
          </div>
        </section>

        {/* Our services in full; the Home page columns link to each one here */}
        <section id="services" aria-labelledby="services-heading" className="scroll-mt-6 bg-mist">
          <div className="mx-auto max-w-[1172px] px-4 pt-20 lg:pt-[100px]">
            <h2 id="services-heading" className="font-display text-[34px] font-normal leading-[1.05] text-navy sm:text-[38px]">
              Our services
            </h2>
            <p className="mt-4 max-w-[62ch] text-[15.5px] leading-[1.65] text-ink">
              The program works in four areas. In each of them young people take part, as trained promoters, local workers and members of
              clubs.
            </p>
          </div>
          {SERVICES.map((s, i) => {
            const flip = i % 2 === 1;
            return (
              <div key={s.slug} id={`service-${s.slug}`} className="scroll-mt-6">
                <div className="mx-auto grid max-w-[1172px] items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:gap-20 lg:py-20">
                  <div className={flip ? "lg:order-2" : ""}>
                    <h3 className="font-display text-[28px] font-normal leading-[1.1] text-navy sm:text-[32px]">{s.title}</h3>
                    {s.details.map((d, j) => (
                      <p key={j} className={`max-w-[60ch] text-[15.5px] leading-[1.7] text-ink ${j === 0 ? "mt-5" : "mt-3"}`}>
                        {d}
                      </p>
                    ))}
                    <h4 className="mt-7 text-[14px] font-semibold text-navy">What it includes</h4>
                    <ul className="mt-3 grid max-w-[520px] gap-x-8 sm:grid-cols-2">
                      {s.includes.map((item) => (
                        <li key={item} className="border-b border-accent py-2 text-[14px] text-ink">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <FramedPhoto src={s.photo} side={flip ? "left" : "right"} label={{ title: "Service", text: s.title }} />
                </div>
              </div>
            );
          })}
        </section>

        {(site.mission || site.vision) && (
          <DarkBand id="mission" image={photos[1] ?? photos[0] ?? imageOr(null, 3)}>
            {site.mission && (
              <>
                <h2 className="font-display text-[34px] font-normal leading-[1.05]">Our mission</h2>
                <p className="mt-5 max-w-[54ch] text-[15.5px] leading-[1.65] text-white/90">{site.mission}</p>
              </>
            )}
            {site.vision && (
              <>
                <h2 className={`font-display text-[34px] font-normal leading-[1.05] ${site.mission ? "mt-14" : ""}`}>Our vision</h2>
                <p className="mt-5 max-w-[54ch] text-[15.5px] leading-[1.65] text-white/90">{site.vision}</p>
              </>
            )}
          </DarkBand>
        )}

        {team.length > 0 && (
          <section id="team" aria-labelledby="team-heading" className="scroll-mt-6 bg-mist">
            <div className="mx-auto max-w-[1172px] px-4 py-20 lg:py-[100px] lg:pr-[300px]">
              <h2 id="team-heading" className="font-display text-[34px] font-normal leading-[1.05] text-navy sm:text-[38px]">
                Our team
              </h2>
              <ul className="mt-12 grid gap-x-10 gap-y-14 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
                {team.map((m) => (
                  <li key={m.id}>
                    <Link href={m.slug ? `/team/${m.slug}` : "#team"} className="group block">
                      <Portrait member={m} />
                      <span className="mt-[22px] block text-[15px] font-bold text-navy group-hover:text-accent">{m.name}</span>
                      <span className="mt-0.5 block text-[13px] text-grey">{m.role}</span>
                      {m.bio && <span className="mt-3.5 line-clamp-4 text-[14px] leading-[1.55] text-ink">{m.bio}</span>}
                      {m.slug && <span className="mt-3 block text-[13.5px] font-semibold text-accent">View full profile</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </WithPageNav>
    </>
  );
}

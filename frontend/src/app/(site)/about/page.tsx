import { Img } from "@/components/site/Img";
import type { Metadata } from "next";
import Link from "next/link";
import { WithPageNav, type PageNavItem } from "@/components/site/PageNav";
import { ArchPhoto, DarkBand, FactsBand, FramedPhoto, OutlineLink, ProgramHero } from "@/components/site/ProgramLayout";
import { servicesFrom, type ServiceRow } from "@/lib/services";
import { TeamCard } from "@/components/site/TeamCard";
import { EmblemShowcase } from "@/components/site/EmblemShowcase";
import { OrgChart } from "@/components/site/OrgChart";
import { groupTeam, teamCounts } from "@/lib/team-categories";
import { reveal } from "@/lib/reveal";
import { Pin } from "@/components/site/icons";
import { formatDay, lines, paragraphs } from "@/lib/format";
import { imageOr } from "@/lib/illustrations";
import { getPublicOr, getSite, getSiteImages } from "@/lib/server-api";
import { pictureOf, picturesOr } from "@/lib/site-images";
import type { Certificate, NewsSummary, ProjectSummary, TeamMember } from "@/lib/types";

const NUMBER_WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

export const metadata: Metadata = {
  title: "About",
  description:
    "Who we are: the Hydraulic Programme of the Catholic Diocese of Ruhengeri, its vision, mission, objectives, services, governance, team and certificates.",
};

/** About, laid out like ALU's programme page: photo header, facts band, then the sections. */
export default async function AboutPage() {
  const [site, team, projects, news, serviceRows, certificates, pics] = await Promise.all([
    getSite(),
    getPublicOr<TeamMember[]>("/team", []),
    getPublicOr<ProjectSummary[]>("/projects", []),
    getPublicOr<{ items: NewsSummary[] }>("/news?page=1", { items: [] }),
    getPublicOr<ServiceRow[]>("/services", []),
    getPublicOr<Certificate[]>("/certificates", []),
    getSiteImages(),
  ]);
  const SERVICES = servicesFrom(serviceRows);
  const about = paragraphs(site.aboutText);
  const objectives = lines(site.specificObjectives);
  const governance = paragraphs(site.governanceText);
  const areas = paragraphs(site.areasText);
  const coreDistricts = lines(site.coreDistricts, /,/);
  const otherDistricts = lines(site.otherDistricts, /,/);
  const firstCertificate = certificates.find((c) => c.image);
  // "Who we are" picture: a person stands in front of the arch; the logo gets its own showcase.
  const portrait = pictureOf(pics, "about.portrait");
  const portraitIsLogo = portrait.startsWith("/logo/");

  // A preview of the team in chart order (leaders first); the whole team is on /team.
  const teamPreview = groupTeam(team).flatMap((g) => g.parts.flatMap((p) => p.members.map((m) => ({ m, label: p.label })))).slice(0, 4);
  const photos = [...projects.map((p) => p.coverImage), ...news.items.map((n) => n.coverImage)].filter((s): s is string => !!s);

  const nav: PageNavItem[] = [
    { id: "who", label: "Who we are" },
    { id: "services", label: "Our services" },
  ];
  if (site.mission || site.vision) nav.push({ id: "mission", label: "Mission and vision" });
  if (site.generalObjective || objectives.length > 0) nav.push({ id: "objectives", label: "Strategic objectives" });
  if (areas.length > 0 || coreDistricts.length > 0) nav.push({ id: "areas", label: "Where we work" });
  if (governance.length > 0) nav.push({ id: "governance", label: "Governance and structure" });
  if (certificates.length > 0) nav.push({ id: "certificates", label: "Certificates" });
  if (team.length > 0) nav.push({ id: "team", label: "Our team" });
  // the order of the sections on the page
  const ORDER = ["who", "mission", "objectives", "services", "areas", "governance", "team", "certificates"];
  nav.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));

  return (
    <>
      <ProgramHero
        title="About the program"
        subtitle={site.programName}
        place="Musanze, Northern Province, Rwanda"
        text={site.heroText || site.tagline}
        images={picturesOr(pics, "about.header")}
      />

      <WithPageNav items={nav} action={{ href: "/contact", label: "Contact us" }}>
        <FactsBand
          facts={[
            { label: "Working since", value: "2007", big: true },
            { label: "Main districts", value: String(coreDistricts.length || 4), big: true },
            { label: "Intervention domains", value: String(SERVICES.length), big: true },
          ]}
        />

        <section id="who" className="scroll-mt-6 bg-white">
          <div className={`mx-auto grid max-w-[1172px] gap-12 px-4 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-20 ${portraitIsLogo ? "items-center py-20 lg:items-start lg:py-[110px]" : "items-end pt-20 lg:pt-[110px]"}`}>
            <div className={portraitIsLogo ? "" : "pb-4 lg:pb-[110px]"}>
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
            {portraitIsLogo ? (
              <div className="lg:mt-[60px]">
                <EmblemShowcase src={portrait} alt={`${site.programName} logo`} />
              </div>
            ) : (
              <ArchPhoto src={portrait} cutout={portrait.endsWith(".png")} />
            )}
          </div>
        </section>

        {(site.mission || site.vision) && (
          <DarkBand id="mission" image={photos[1] ?? photos[0] ?? imageOr(null)}>
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

        {(site.generalObjective || objectives.length > 0) && (
          <section id="objectives" aria-labelledby="objectives-heading" className="scroll-mt-6 bg-white">
            <div className="mx-auto max-w-[1172px] px-4 py-20 lg:py-[100px] lg:pr-[300px]">
              <h2 id="objectives-heading" className="font-display text-[34px] font-normal leading-[1.05] text-navy sm:text-[38px]">
                Strategic objectives
              </h2>
              {site.generalObjective && (
                <>
                  <h3 className="mt-8 text-[14px] font-semibold text-accent">General objective</h3>
                  <p className="mt-2 max-w-[62ch] text-[18px] leading-[1.55] text-navy">{site.generalObjective}</p>
                </>
              )}
              {objectives.length > 0 && (
                <>
                  <h3 className="mt-10 text-[14px] font-semibold text-accent">Specific objectives</h3>
                  <ol className="mt-4 grid gap-x-10 sm:grid-cols-2">
                    {objectives.map((o, i) => (
                      <li key={i} className="flex gap-5 border-t border-accent py-5">
                        <span className="font-display w-10 shrink-0 text-[30px] font-light leading-none text-accent">{String(i + 1).padStart(2, "0")}</span>
                        <span className="text-[15px] leading-[1.6] text-ink">{o}</span>
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </div>
          </section>
        )}

        {/* Our services in full; the Home page columns link to each one here */}
        <section id="services" aria-labelledby="services-heading" className="scroll-mt-6 bg-mist">
          <div className="mx-auto max-w-[1172px] px-4 pt-20 lg:pt-[100px]">
            <h2 id="services-heading" className="font-display text-[34px] font-normal leading-[1.05] text-navy sm:text-[38px]">
              Our services
            </h2>
            <p className="mt-4 max-w-[62ch] text-[15.5px] leading-[1.65] text-ink">
              The programme works in {NUMBER_WORDS[SERVICES.length] ?? SERVICES.length} intervention domains.
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

        {(areas.length > 0 || coreDistricts.length > 0) && (
          <section id="areas" aria-labelledby="areas-heading" className="scroll-mt-6 bg-white">
            <div className="mx-auto grid max-w-[1172px] items-start gap-12 px-4 py-20 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16 lg:py-[100px]">
              <div>
                <h2 id="areas-heading" className="font-display text-[34px] font-normal leading-[1.05] text-navy sm:text-[38px]">
                  Where we work
                </h2>
                {areas.map((p, i) => (
                  <p key={i} className={`max-w-[62ch] text-[15.5px] leading-[1.7] text-ink ${i === 0 ? "mt-7" : "mt-4"}`}>
                    {p}
                  </p>
                ))}
              </div>
              {(coreDistricts.length > 0 || otherDistricts.length > 0) && (
                <aside className="bg-navy px-7 pb-8 pt-7 text-white lg:mt-[70px]">
                  {coreDistricts.length > 0 && (
                    <>
                      <h3 className="font-display text-[22px] font-normal">Main districts</h3>
                      <p className="mt-1 text-[13px] text-white/70">North-western Rwanda</p>
                      <ul className="mt-4">
                        {coreDistricts.map((d) => (
                          <li key={d} className="flex items-center gap-3 border-b border-white/20 py-3 text-[15px] font-semibold">
                            <Pin className="h-[16px] w-auto text-sky" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {otherDistricts.length > 0 && (
                    <>
                      <h3 className="mt-7 text-[14px] font-semibold text-sky">Also worked in</h3>
                      <p className="mt-2 text-[15px]">{otherDistricts.join(", ")}</p>
                    </>
                  )}
                </aside>
              )}
            </div>
          </section>
        )}

        {governance.length > 0 && (
          <section id="governance" aria-labelledby="governance-heading" className="scroll-mt-6 bg-white">
            <div className="mx-auto max-w-[1172px] border-t border-line px-4 py-20 lg:py-[100px]">
              <h2 id="governance-heading" className="font-display text-[34px] font-normal leading-[1.05] text-navy sm:text-[38px]">
                Governance and structure
              </h2>
              <div className="mt-7 gap-12 lg:columns-2">
                {governance.map((p, i) => (
                  <p key={i} className="mb-4 break-inside-avoid text-[15px] leading-[1.7] text-ink">
                    {p}
                  </p>
                ))}
              </div>
              <OrgChart counts={teamCounts(team)} />
            </div>
          </section>
        )}

        {team.length > 0 && (
          <section id="team" aria-labelledby="team-heading" className="relative scroll-mt-6 overflow-hidden bg-navy text-white">
            <span aria-hidden="true" className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
            <span aria-hidden="true" className="absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full border border-white/5" />
            <div className="relative mx-auto max-w-[1172px] px-4 py-20 lg:py-[100px]">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <h2 id="team-heading" {...reveal(0)} className="font-display text-[34px] font-normal leading-[1.05] sm:text-[38px]">
                    Our team
                  </h2>
                  <p {...reveal(1)} className="mt-4 max-w-[56ch] text-[15.5px] leading-[1.65] text-white/85">
                    Six permanent staff, supported by field supervisors and ten field extensionists, grouped as in our organisational chart.
                  </p>
                </div>
                <Link
                  href="/team"
                  {...reveal(2)}
                  className="btn-primary inline-flex min-h-12 items-center gap-3 px-7 text-[14px] font-semibold"
                >
                  Meet the whole team
                </Link>
              </div>
              <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-6 sm:[grid-template-columns:repeat(auto-fill,minmax(210px,1fr))]">
                {teamPreview.map(({ m, label }, i) => (
                  <li key={m.id} {...reveal(i, "rise", 100)} className="text-ink">
                    <TeamCard member={m} label={label} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {certificates.length > 0 && (
          <section id="certificates" aria-labelledby="certificates-heading" className="scroll-mt-6 bg-mist">
            <div className="mx-auto grid max-w-[1172px] items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:gap-20 lg:py-[100px]">
              <div>
                <h2 id="certificates-heading" className="font-display text-[34px] font-normal leading-[1.05] text-navy sm:text-[38px]">
                  Certificates and appreciations
                </h2>
                <p className="mt-6 max-w-[54ch] text-[15.5px] leading-[1.7] text-ink">
                  The programme operates under the legal personality of the Catholic Diocese of Ruhengeri, which the Rwanda Governance Board
                  has certified. See our certificates and the appreciations we have received.
                </p>
                {firstCertificate && (
                  <p className="mt-4 text-[14px] text-muted">
                    {firstCertificate.title}
                    {firstCertificate.issuer && `, ${firstCertificate.issuer}`}
                    {firstCertificate.issuedOn && `, ${formatDay(firstCertificate.issuedOn)}`}
                  </p>
                )}
                <OutlineLink href="/certificates">See all certificates</OutlineLink>
              </div>
              {firstCertificate?.image && (
                <a href="/certificates" className="float-card block bg-white p-3 shadow-[0_24px_44px_-24px_rgba(0,30,70,.6)]" aria-label="See all certificates">
                  <Img src={firstCertificate.image} alt={`${firstCertificate.title}, ${firstCertificate.issuer}`} loading="lazy" className="block w-full" />
                </a>
              )}
            </div>
          </section>
        )}
      </WithPageNav>
    </>
  );
}

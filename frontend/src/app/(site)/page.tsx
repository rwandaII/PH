import Link from "next/link";
import { HeroSlider, type HeroSlide } from "@/components/site/HeroSlider";
import { ArrowRight, Chevron, Facebook } from "@/components/site/icons";
import { CountUp } from "@/components/site/Motion";
import { ProjectsShowcase } from "@/components/site/ProjectsShowcase";
import { ServicesSection } from "@/components/site/ServicesSection";
import { servicesFrom, type ServiceRow } from "@/lib/services";
import { TeamCarousel } from "@/components/site/TeamCarousel";
import { TechLines } from "@/components/site/TechLines";
import { formatDate, paragraphs, STATUS_LABEL } from "@/lib/format";
import { imageOr } from "@/lib/illustrations";
import { reveal } from "@/lib/reveal";
import { FALLBACK_SITE, getPublicOr } from "@/lib/server-api";
import type { NewsSummary, Partner, ProjectSummary, SiteInfo, TeamMember } from "@/lib/types";

interface HomeData {
  site: SiteInfo;
  news: NewsSummary[];
  projects: ProjectSummary[];
  partners: Partner[];
}

/** "Leadership in an Age of Acceleration" -> light "Leadership in an Age of", bold "Acceleration". */
function splitHeading(text: string): { light: string; bold: string } {
  const words = text.trim().split(/\s+/);
  if (words.length <= 2) return { light: "", bold: text };
  const n = words.length >= 5 ? 2 : 1;
  return { light: words.slice(0, -n).join(" "), bold: words.slice(-n).join(" ") };
}

export default async function HomePage() {
  const [data, team, allProjects, serviceRows] = await Promise.all([
    getPublicOr<HomeData>("/home", { site: FALLBACK_SITE, news: [], projects: [], partners: [] }),
    getPublicOr<TeamMember[]>("/team", []),
    getPublicOr<ProjectSummary[]>("/projects", []),
    getPublicOr<ServiceRow[]>("/services", []),
  ]);
  const services = servicesFrom(serviceRows);
  const { site, news, projects, partners } = data;
  const lead = news[0];
  const completed = allProjects.filter((p) => p.status === "completed").length;
  const ongoing = allProjects.filter((p) => p.status === "ongoing").length;
  // Show completed projects once there are some; until then, what is running now.
  const stat =
    completed > 0
      ? { value: completed, label: "water projects completed", title: "Our progress", text: `Projects completed so far, out of ${allProjects.length} we have published.` }
      : { value: ongoing, label: "areas of work in progress", title: "Our work today", text: "Areas of work the program is running now. Open each one to read more." };
  const partnerLogos = partners.filter((p) => p.logo);

  // Hero slides: the program itself, then the latest stories and another project.
  const slides: HeroSlide[] = [
    {
      eyebrow: projects[0] ? "Featured project" : site.programName,
      ...splitHeading(site.tagline || site.programName),
      text: site.heroText,
      caption: projects[0]?.title ?? site.programName,
      image: imageOr(projects[0]?.coverImage, 0),
      imageAlt: projects[0]?.title ?? "",
      href: projects[0] ? `/projects/${projects[0].slug}` : "/about",
    },
    ...news.slice(0, 2).map((n, i) => ({
      eyebrow: "Latest news",
      ...splitHeading(n.title),
      text: n.excerpt,
      caption: formatDate(n.publishedAt),
      image: imageOr(n.coverImage, n.id + i),
      imageAlt: "",
      href: `/news/${n.slug}`,
    })),
    ...projects.slice(1, 2).map((p) => ({
      eyebrow: "Our projects",
      ...splitHeading(p.title),
      text: p.summary,
      caption: STATUS_LABEL[p.status],
      image: imageOr(p.coverImage, p.id),
      imageAlt: p.title,
      href: `/projects/${p.slug}`,
    })),
  ];
  const featuredPartner = partners.find((p) => p.logo);

  const intro = paragraphs(site.aboutText)[0] || site.heroText;

  return (
    <>
      <HeroSlider
        slides={slides}
        programName={site.programName}
        partner={featuredPartner?.logo ? { name: featuredPartner.name, logo: featuredPartner.logo } : null}
      />

      {/* Red cube band: introduction with the big letter, plus the latest story */}
      {(intro || lead) && (
        <section
          id="about"
          className="relative overflow-hidden bg-[#023e7d] text-white [background-image:url(/patterns/cubes.svg)] [background-size:24.25px_42px]"
        >
          <div className="relative flex flex-wrap items-stretch">
            <div className="flex min-h-[425px] flex-[0_1_940px] items-center bg-[linear-gradient(90deg,#0077b6_0%,#0077b6_30%,rgba(0,119,182,.92)_48%,rgba(0,119,182,.82)_70%,rgba(0,119,182,.7)_100%)] py-10 pl-[clamp(100px,17.3vw,249px)] pr-[clamp(20px,4.2vw,60px)]">
              {intro && (
                <div className="relative" {...reveal(0, "left")}>
                  <span className="bigletter" aria-hidden="true">
                    {intro.charAt(0)}
                  </span>
                  <p className="relative text-[16px] leading-[22.5px]">{intro}</p>
                </div>
              )}
            </div>
            {lead && (
              <div className="flex max-w-full flex-[0_0_342px] flex-col bg-[rgba(2,62,125,.88)] p-5" {...reveal(1, "right")}>
                <img src={imageOr(lead.coverImage, lead.id)} alt="" className="block h-[222px] w-[157px] object-cover" />
                <h2 className="mt-[22px] text-[18px] font-bold leading-[1.3]">{lead.title}</h2>
                <p className="font-text mt-2.5 text-[15.5px] leading-[1.27]">
                  {formatDate(lead.publishedAt)}
                  {lead.excerpt && `. ${lead.excerpt}`}
                </p>
                <Link href={`/news/${lead.slug}`} className="btn-primary mt-[22px] flex min-h-[41px] items-center gap-4 px-[26px] text-[14px] font-semibold">
                  <Chevron /> Read more
                </Link>
              </div>
            )}
            <div aria-hidden="true" className="flex-1" />
          </div>
        </section>
      )}

      {/* Mission strip */}
      {site.mission && (
        <section className="bg-[#0b4f6c] text-white">
          <div className="mx-auto flex max-w-[1148px] flex-wrap items-center gap-x-10 gap-y-3 px-6 py-3" {...reveal(0)}>
            <h2 className="font-display whitespace-nowrap text-[34px] font-semibold">Our mission</h2>
            <p className="flex-[1_1_420px] text-[17px] font-bold leading-[1.35]">{site.mission}</p>
            <Link href="/about" className="btn-outline inline-flex min-h-11 items-center bg-navy px-[30px] text-[14px] font-semibold">
              Learn more
            </Link>
          </div>
        </section>
      )}

      {/* Our services: the program's four pillars, each linking to its full explanation on About */}
      <ServicesSection services={services} />

      {/* Our work: the projects as a large index with a photo preview (see ProjectsShowcase) */}
      {projects.length > 0 && (
        <section className="bg-mist">
          <div className="mx-auto max-w-[1172px] px-4 py-20 sm:py-28" {...reveal(0)}>
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
              <div className="max-w-[620px]">
                <h2 className="font-display text-[34px] font-normal leading-[1.1] text-navy sm:text-[40px]">Our work</h2>
                <p className="mt-3 text-[15.5px] leading-[1.6] text-ink">
                  Water supply, hygiene and sanitation, youth training and environmental protection, for poor families in
                  remote areas of Ruhengeri Diocese and beyond.
                </p>
              </div>
              <Link href="/projects" className="text-[14px] font-semibold text-accent underline decoration-accent/40 underline-offset-[6px] hover:decoration-accent">
                All projects
              </Link>
            </div>
            <ProjectsShowcase projects={projects} />
          </div>
        </section>
      )}

      {team.length > 0 && <TeamCarousel team={team} />}

      {/* Vision + blue quarter circle with the number of completed projects */}
      {(site.vision || stat.value > 0) && (
        <section className="overflow-hidden bg-white">
          <div className="mx-auto flex max-w-[1172px] flex-wrap items-stretch px-4">
            <div className="flex-[1_1_420px] pb-10 pr-8 pt-[50px]" {...reveal(0, "left")}>
              <h2 className="font-display text-[34px] font-normal leading-[1.05] text-navy">
                Our vision for
                <br />
                safe water
              </h2>
              {site.vision && <p className="font-text mt-[38px] max-w-[456px] text-[14.5px] leading-[21px] text-[#0d3a75]">{site.vision}</p>}
              <Link href="/about" className="mt-3.5 inline-flex min-h-11 items-center gap-4 text-[13px] font-bold text-band">
                <Chevron /> About our work
              </Link>
            </div>
            <div {...reveal(1, "right")} className="flex min-h-[424px] flex-[0_1_684px] items-center justify-end gap-[22px] rounded-tl-[414px_424px] bg-band-2 py-10 pl-[150px] pr-[72px] text-white max-sm:flex-col max-sm:justify-center max-sm:rounded-tl-[160px_200px] max-sm:px-6 max-sm:pt-24 max-sm:text-center">
              <div className="max-w-[230px] text-right max-sm:text-center">
                <p className="text-[15px] font-bold">{stat.title}</p>
                <p className="font-text mt-1.5 text-[15px] leading-[1.15]">{stat.text}</p>
              </div>
              <div className="flex h-48 w-48 flex-none flex-col items-center justify-center rounded-full bg-deep text-center">
                <span className="font-text text-[64px] leading-none">
                  <CountUp value={stat.value} />
                </span>
                <span className="font-text mt-1.5 max-w-[140px] text-[13.5px] leading-[1.3]">{stat.label}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Partners: modelled on ALU's "Begin your bachelor's degree journey" section,
          in water colours: blurred ocean-to-navy backdrop, tall photo standing on the
          bottom edge, white text, a rounded white card, a notice strip and a link. */}
      {partners.length > 0 && (
        <section
          id="partners"
          className="relative overflow-hidden text-white [background:radial-gradient(ellipse_55%_45%_at_72%_8%,rgba(72,202,228,.35)_0%,transparent_70%),radial-gradient(ellipse_35%_40%_at_96%_72%,rgba(255,255,255,.14)_0%,transparent_70%),radial-gradient(ellipse_40%_50%_at_8%_40%,rgba(0,119,182,.35)_0%,transparent_70%),linear-gradient(180deg,#0369a1_0%,#035a93_30%,#023e7d_68%,#012a4a_100%)]"
        >
          <TechLines />
          <div className="relative mx-auto flex max-w-[1172px] flex-wrap items-stretch px-4 lg:min-h-[685px]">
            {/* Clean framed photo of PH staff with partner representatives, with a logo badge */}
            <div className="relative flex flex-[0_0_450px] items-end pb-[78px] max-lg:order-2 max-lg:flex-[1_1_100%] max-lg:justify-center max-lg:pb-24" {...reveal(0, "left")}>
              <figure className="relative w-full max-w-[410px]">
                <img
                  src="/photos/field/school-welcome-1.jpg"
                  alt="Visitors and staff welcomed by pupils at a school"
                  className="block aspect-[4/5] w-full rounded-[16px] border-[8px] border-white object-cover shadow-[0_36px_70px_-24px_rgba(0,20,60,.7)]"
                />
                {partnerLogos.length > 0 && (
                  <figcaption className="pop-chip absolute -bottom-9 -right-6 rounded-[12px] bg-white px-4 pb-3 pt-2.5 text-navy shadow-[0_18px_40px_-14px_rgba(0,20,60,.55)] max-sm:right-2">
                    <span className="block text-[12px] font-semibold text-muted">In partnership with</span>
                    <span className="mt-2 flex items-center gap-4">
                      {partnerLogos.slice(0, 3).map((p) => (
                        <img key={p.id} src={p.logo!} alt={p.name} className="h-8 w-auto max-w-[130px] object-contain" />
                      ))}
                    </span>
                  </figcaption>
                )}
              </figure>
            </div>

            <div className="min-w-0 max-w-[690px] flex-[1_1_420px] pb-6 pl-[18px] pt-[165px] max-lg:max-w-none max-lg:pl-0 max-lg:pt-16" {...reveal(1)}>
              <h2 className="font-display text-[36px] font-medium leading-[1]">
                Working together for
                <br />
                safe water
              </h2>
              <p className="mt-2 text-[15px] font-semibold leading-[20px]">
                The Hydraulic Program cooperates with various foreign and local organizations. Together we supply water,
                promote hygiene and sanitation, and protect the environment, specifically for poor people living in remote areas.
              </p>
              <p className="mt-[22px] text-[15px] font-bold leading-[20px]">
                Join the organisations that already fund, build and maintain this work with us.
              </p>

              {/* White card, like ALU's intake card */}
              <Link
                href="/partners"
                className="pop-chip mt-[38px] block w-full max-w-[674px] rounded-[14px] bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_58%,#dfe6ec_100%)] px-[14px] pb-[18px] pt-[13px] text-navy"
              >
                <span className="block text-[20px] font-medium leading-[1.15]">Our partners</span>
                <span className="block text-[14px] font-bold leading-[1.2]">
                  {partners.length} {partners.length === 1 ? "organisation" : "organisations"}
                </span>
                <span className="mt-1.5 block text-[15px] leading-[1.35] text-[#1d3f73]">
                  {listNames(partners.map((p) => p.name))}
                </span>
                <span className="mt-2.5 block text-[10.5px] font-bold leading-[1.15] text-accent">
                  See what each partner does
                  <br />
                  on the Partners page
                </span>
              </Link>

              {/* Notice strip, like ALU's "IMPORTANT" box */}
              <p className="mt-[30px] flex w-full max-w-[650px] items-center gap-2.5 rounded-[10px] bg-white px-2.5 py-[7px] text-[12px] leading-[1.1] text-navy">
                <span aria-hidden="true" className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-navy text-[13px] font-extrabold text-white">
                  i
                </span>
                <span>
                  <strong className="font-bold">How to partner:</strong> write to us through the contact page with the water, hygiene or
                  environment project you would like to fund or co-build.
                </span>
              </p>

              <Link href="/contact" className="mt-[30px] inline-flex min-h-11 items-center gap-4 text-[14px] font-bold">
                <Chevron /> Become a partner
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest news, laid out like a newsletter page: one lead story with a large photo
          (a mist-blue block set behind it), and the next three as quiet entries beside it. */}
      {news.length > 0 && (
        <section id="news" className="bg-white">
          <div className="mx-auto max-w-[1132px] px-4 py-20 sm:py-28" {...reveal(0)}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
              <h2 className="font-display text-[34px] font-normal leading-[1.1] text-navy sm:text-[40px]">News from the field</h2>
              <Link href="/news" className="text-[14px] font-semibold text-accent underline decoration-accent/40 underline-offset-[6px] hover:decoration-accent">
                All news
              </Link>
            </div>

            <div className="mt-12 grid gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
              <article>
                <Link href={`/news/${news[0].slug}`} className="group block">
                  <span className="relative block">
                    <span aria-hidden="true" className="absolute -bottom-4 -right-4 left-10 top-10 bg-[#cfe5f0] sm:-bottom-6 sm:-right-6" />
                    <img src={imageOr(news[0].coverImage, news[0].id)} alt="" className="relative block aspect-[4/3] w-full object-cover" />
                  </span>
                  <span className="mt-10 block text-[13px] text-muted">{formatDate(news[0].publishedAt)}</span>
                  <span className="font-display mt-2 block max-w-[30ch] text-[27px] font-medium leading-[1.18] text-navy transition-colors group-hover:text-accent sm:text-[31px]">
                    {news[0].title}
                  </span>
                  {news[0].excerpt && <span className="mt-4 block max-w-[62ch] text-[15px] leading-[1.6] text-ink">{news[0].excerpt}</span>}
                  <span className="mt-5 inline-flex items-center gap-2.5 text-[14px] font-semibold text-accent">
                    Read the story <Chevron size={10} />
                  </span>
                </Link>
              </article>

              {news.length > 1 && (
                <div>
                  <h3 className="text-[14px] font-semibold text-navy">More from the program</h3>
                  <ul className="mt-6 space-y-9">
                    {news.slice(1, 4).map((n) => (
                      <li key={n.id}>
                        <Link href={`/news/${n.slug}`} className="group grid grid-cols-[112px_minmax(0,1fr)] items-start gap-5 sm:grid-cols-[150px_minmax(0,1fr)]">
                          <img src={imageOr(n.coverImage, n.id)} alt="" className="block aspect-[4/3] w-full object-cover" />
                          <span>
                            <span className="font-display block text-[18px] font-medium leading-[1.25] text-navy transition-colors group-hover:text-accent">{n.title}</span>
                            {n.excerpt && <span className="mt-2 text-[13.5px] leading-[1.55] text-grey line-clamp-2 max-sm:hidden">{n.excerpt}</span>}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Stories + questions */}
      <section className="flex flex-wrap">
        <div className="relative flex min-h-[393px] flex-[0_1_60%] flex-wrap items-start justify-between gap-6 overflow-hidden bg-deep px-[70px] pb-12 pt-[70px] max-lg:flex-[1_1_100%] max-lg:items-end max-md:px-6">
          {/* Full photo behind the section (like ALU), tinted deep water-blue so the white text reads */}
          <img src="/photos/field/visitor-at-tap.jpg" alt="" aria-hidden="true" className="water-drift pointer-events-none absolute inset-0 h-full w-full object-cover object-[50%_30%]" />
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(1,42,74,.78)_0%,rgba(2,62,125,.55)_45%,rgba(3,105,161,.35)_100%)]" />
          <div className="relative mb-[30px] self-end" {...reveal(0, "left")}>
            <h2 className="font-display text-[44px] font-normal leading-[1] text-white [text-shadow:0_2px_18px_rgba(0,20,50,.45)]">
              Our stories
            </h2>
            <Link href="/news" className="mt-2.5 inline-flex min-h-8 items-center gap-3 text-[13px] font-semibold text-white">
              <Chevron className="text-sky" /> View all stories
            </Link>
            {site.facebookUrl && (
              <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer" className="mt-1.5 flex min-h-8 items-center gap-5 text-[11.5px] font-medium text-white">
                <Facebook /> Follow us on Facebook
              </a>
            )}
          </div>
          <Link
            href={lead ? `/news/${lead.slug}` : "/news"}
            aria-label={lead ? `Read: ${lead.title}` : "Read our stories"}
            {...reveal(1, "zoom")}
            className="zoom-host relative flex h-64 w-[342px] max-w-full items-center justify-center border-8 border-white bg-white shadow-[0_30px_50px_rgba(0,0,0,.28)]"
          >
            <span className="zoom absolute inset-0">
              <img src={imageOr(lead?.coverImage, 0)} alt="" className="block h-full w-full object-cover" />
            </span>
            <span className="relative flex h-[84px] w-[84px] items-center justify-center rounded-full border-[3px] border-white bg-navy/55 shadow-[0_6px_18px_rgba(0,0,0,.3)]">
              <svg width="24" height="26" viewBox="0 0 24 26" aria-hidden="true">
                <path d="M6 3v20l17-10z" fill="#ffffff" />
              </svg>
            </span>
          </Link>
        </div>
        <div className="relative flex min-h-[393px] flex-[1_1_380px] flex-col justify-center overflow-hidden bg-navy px-6 py-[60px] text-white sm:pl-20 sm:pr-[60px]">
          <TechLines />
          <div className="relative flex items-center gap-2.5" {...reveal(0, "right")}>
            <span aria-hidden="true" className="text-[62px] font-extrabold leading-none">
              ?
            </span>
            <h2 className="font-display text-[34px] font-medium leading-[.95]">Do you have more questions about our work?</h2>
          </div>
          <Link href="/contact" className="btn-primary relative mt-[30px] flex min-h-[55px] items-center gap-7 px-3.5 text-[14px] font-semibold shadow-[0_4px_10px_rgba(0,0,0,.3)]">
            <ArrowRight /> Send us a message
          </Link>
        </div>
      </section>
    </>
  );
}

/** "A, B and C" */
function listNames(names: string[]): string {
  if (names.length < 2) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

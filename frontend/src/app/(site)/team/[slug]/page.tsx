import type { Metadata } from "next";
import { TechLines } from "@/components/site/TechLines";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Chevron, Facebook, Instagram, LinkedIn, Pin, WhatsApp, XLogo } from "@/components/site/icons";
import { WithPageNav, type PageNavItem } from "@/components/site/PageNav";
import { ProfileArch } from "@/components/site/ProfileArch";
import { FactsBand } from "@/components/site/ProgramLayout";
import { KeyTeamCard, keyCardData, yearsOf } from "@/components/site/KeyTeamCard";
import { reveal } from "@/lib/reveal";
import { paragraphs, phoneNumbers } from "@/lib/format";
import { getPublicOr, getSite } from "@/lib/server-api";
import type { TeamMember } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

const getMember = async (slug: string) => getPublicOr<TeamMember | null>(`/team/${encodeURIComponent(slug)}`, null);

/** Build every published page ahead of time so it opens instantly; new ones are built on first visit. */
export async function generateStaticParams() {
  const team = await getPublicOr<{ slug: string | null }[]>("/team", []);
  return team.flatMap((m) => (m.slug ? [{ slug: m.slug }] : []));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = await getMember((await params).slug);
  if (!m) return { title: "Team member not found" };
  return { title: `${m.name}, ${m.role}`, description: m.bio.slice(0, 160) || undefined };
}

/** A team member's own page: who they are, what they work on and how to reach them. */
export default async function TeamMemberPage({ params }: Props) {
  const { slug } = await params;
  const [m, team, site] = await Promise.all([getMember(slug), getPublicOr<TeamMember[]>("/team", []), getSite()]);
  if (!m) notFound();

  const bio = paragraphs(m.bio);
  const areas = m.expertise
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const others = team.filter((t) => t.id !== m.id && t.slug);
  // In the key technical team's order.
  const colleagues = others;
  const maxYears = Math.max(10, ...team.map((t) => yearsOf(t.washYears)));
  const firstName = m.name.split(/\s+/)[0];
  const office = m.address || site.address;
  const email = m.email || site.contactEmail;
  const phone = m.phone || site.phone;

  const socials = [
    { label: "Facebook", href: m.facebookUrl, icon: <Facebook /> },
    { label: "X", href: m.twitterUrl, icon: <XLogo /> },
    { label: "LinkedIn", href: m.linkedinUrl, icon: <LinkedIn /> },
    { label: "Instagram", href: m.instagramUrl, icon: <Instagram /> },
    { label: "WhatsApp", href: m.whatsapp ? `https://wa.me/${m.whatsapp.replace(/[^\d]/g, "")}` : "", icon: <WhatsApp /> },
  ].filter((s) => s.href);
  const details = [
    m.washYears ? { label: "Working years in the WASH domain", value: m.washYears } : null,
    m.competence ? { label: "Area of competence", value: m.competence } : null,
    m.joinedYear ? { label: "With the program since", value: String(m.joinedYear) } : null,
    m.languages ? { label: "Languages", value: m.languages } : null,
  ].filter((d): d is { label: string; value: string } => !!d);
  const education = m.education
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const nav: PageNavItem[] = [{ id: "about", label: `About ${firstName}` }];
  if (details.length > 0 || education.length > 0) nav.push({ id: "profile", label: "Profile" });
  if (areas.length > 0) nav.push({ id: "work", label: "Areas of work" });
  nav.push({ id: "contact", label: socials.length > 0 ? "Contact and social media" : "Contact" });
  if (others.length > 0) nav.push({ id: "colleagues", label: "Colleagues" });

  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
        <TechLines />
        <div className="relative mx-auto flex max-w-[1172px] flex-wrap items-end justify-between gap-x-16 gap-y-10 px-4 pb-14 pt-12 lg:min-h-[460px]">
          <div className="banner-in min-w-0 flex-[1_1_380px] self-center">
            <Link href="/team" className="inline-flex min-h-9 items-center gap-2.5 text-[13.5px] font-semibold text-sky hover:text-white">
              <Chevron size={9} className="rotate-180" /> Our team
            </Link>
            <h1 className="font-display mt-3 text-[40px] font-normal leading-[1.02] sm:text-[54px]">{m.name}</h1>
            <p className="mt-4 text-[17px]">{m.role}</p>
            <p className="mt-2 text-[14px] text-white/80">{site.programName}</p>
            {office && (
              <p className="mt-6 flex max-w-[420px] items-start gap-3 border-t border-white/40 pt-4 text-[13.5px] font-semibold">
                <Pin className="mt-0.5 h-[18px] w-auto flex-none text-sky" />
                {office}
              </p>
            )}
            {socials.length > 0 && (
              <ul aria-label={`Find ${firstName} on`} className="mt-5 flex flex-wrap gap-2.5">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (opens in a new tab)`} className="flex h-10 w-10 items-center justify-center border border-white/40 text-white transition-colors hover:border-sky hover:bg-sky hover:text-navy">
                      {s.icon}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <ProfileArch member={m} />
        </div>
      </section>

      <WithPageNav items={nav} action={{ href: "/contact", label: `Write to ${firstName}` }} overlap={-36}>
        <FactsBand
          facts={[
            { label: "Role", value: m.role },
            m.washYears
              ? { label: "In the WASH domain", value: m.washYears }
              : { label: "Works on", value: areas.length > 0 ? `${areas.length} areas of the program` : "The program's work" },
            { label: "Program", value: "Hydraulic Program of Ruhengeri Diocese, since 2007" },
          ]}
        />

        <section id="about" className="scroll-mt-6 bg-white">
          <div className="mx-auto max-w-[1172px] px-4 py-16 lg:py-24 lg:pr-[300px]">
            <h2 className="font-display text-[34px] font-normal leading-[1.08] text-navy sm:text-[38px]">About {firstName}</h2>
            <div className="mt-7 max-w-[64ch] space-y-4">
              {bio.length > 0 ? (
                bio.map((p, i) => (
                  <p key={i} className={i === 0 ? "font-display text-[20px] leading-[1.5] text-navy" : "text-[16px] leading-[1.75] text-ink"}>
                    {p}
                  </p>
                ))
              ) : (
                <p className="text-muted">A biography will be added soon.</p>
              )}
            </div>
          </div>
        </section>

        {(details.length > 0 || education.length > 0) && (
          <section id="profile" className="scroll-mt-6 border-t border-[#bcd6e3] bg-white">
            <div className="mx-auto max-w-[1172px] px-4 py-16 lg:py-20 lg:pr-[300px]">
              <h2 className="font-display text-[32px] font-normal leading-[1.1] text-navy">Profile</h2>
              {details.length > 0 && (
                <dl className="mt-8 grid max-w-[720px] gap-x-10 gap-y-6 sm:grid-cols-2">
                  {details.map((d) => (
                    <div key={d.label} className="border-l-[3px] border-accent pl-4">
                      <dt className="text-[13px] text-muted">{d.label}</dt>
                      <dd className="mt-1 text-[17px] font-semibold text-navy">{d.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {education.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-[16px] font-semibold text-navy">Education and training</h3>
                  <ul className="mt-4 max-w-[64ch] space-y-3">
                    {education.map((e) => (
                      <li key={e} className="flex gap-3 text-[15.5px] leading-[1.6] text-ink">
                        <span aria-hidden="true" className="mt-[9px] h-2 w-2 flex-none rounded-full bg-accent" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {areas.length > 0 && (
          <section id="work" className="scroll-mt-6 bg-mist">
            <div className="mx-auto max-w-[1172px] px-4 py-16 lg:py-20 lg:pr-[300px]">
              <h2 className="font-display text-[32px] font-normal leading-[1.1] text-navy">Areas of work</h2>
              <ul className="mt-8 grid gap-px bg-[#bcd6e3] sm:grid-cols-2">
                {areas.map((a) => (
                  <li key={a} className="lift-card flex items-center gap-4 bg-white px-5 py-5 text-[16px] font-semibold text-navy">
                    <span aria-hidden="true" className="h-8 w-[3px] bg-accent" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section id="contact" className="scroll-mt-6 bg-white">
          <div className="mx-auto max-w-[1172px] px-4 py-16 lg:py-20 lg:pr-[300px]">
            <h2 className="font-display text-[32px] font-normal leading-[1.1] text-navy">Contact</h2>
            <dl className="mt-8 grid max-w-[720px] gap-x-10 gap-y-7 sm:grid-cols-2">
              {email && (
                <div>
                  <dt className="text-[13px] text-muted">Email</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${email}`} className="text-[16px] font-semibold text-accent hover:underline">
                      {email}
                    </a>
                  </dd>
                </div>
              )}
              {phone && (
                <div>
                  <dt className="text-[13px] text-muted">Phone</dt>
                  <dd className="mt-1">
                    {phoneNumbers(phone).map((n) => (
                      <a key={n.href} href={n.href} className="block text-[16px] font-semibold text-accent hover:underline">
                        {n.label}
                      </a>
                    ))}
                  </dd>
                </div>
              )}
              {office && (
                <div className="sm:col-span-2">
                  <dt className="text-[13px] text-muted">Office</dt>
                  <dd className="mt-1 text-[16px] text-navy">{office}</dd>
                </div>
              )}
            </dl>
            {socials.length > 0 && (
              <div className="mt-10">
                <h3 className="text-[16px] font-semibold text-navy">Find {firstName} on</h3>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2.5 border border-[#bcd6e3] px-4 text-[14px] font-semibold text-navy transition-colors hover:border-accent hover:bg-accent hover:text-white">
                        {s.icon} {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {(!m.email || !m.phone) && (
              <p className="mt-6 max-w-[60ch] text-[13.5px] text-muted">Where no personal details are listed, these are the program&apos;s office contacts.</p>
            )}
          </div>
        </section>

        {others.length > 0 && (
          <section id="colleagues" className="relative scroll-mt-6 overflow-hidden bg-mist">
            <span aria-hidden="true" className="team-ripple absolute -left-24 -top-24 h-72 w-72 rounded-full border border-accent/15" />
            <span aria-hidden="true" className="team-ripple team-ripple-2 absolute -left-40 -top-40 h-[26rem] w-[26rem] rounded-full border border-accent/10" />
            <div className="relative mx-auto max-w-[1172px] px-4 py-16 lg:py-20 lg:pr-[300px]">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-[32px] font-normal leading-[1.1] text-navy">Colleagues</h2>
                  <p className="mt-2 text-[14.5px] text-muted">
                    {others.length === 1 ? "1 person works" : `${others.length} people work`} with {firstName} on the programme.
                  </p>
                </div>
                <Link
                  href="/team"
                  className="inline-flex min-h-11 items-center gap-2.5 border border-accent px-5 text-[14px] font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
                >
                  See the whole team <Chevron size={10} />
                </Link>
              </div>
              <ul className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {colleagues.map((o, i) => (
                  <li key={o.id} {...reveal(i % 3, "rise", 90)} className="key-team-item">
                    <KeyTeamCard member={keyCardData(o)} maxYears={maxYears} href={`/team/${o.slug}`} />
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

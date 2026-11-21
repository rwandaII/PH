import type { Metadata } from "next";
import Link from "next/link";
import { Ruled } from "@/components/site/Headings";
import { Chevron } from "@/components/site/icons";
import { PageBanner } from "@/components/site/PageBanner";
import { PartnerWorld } from "@/components/site/partners/PartnerWorld";
import { TechLines } from "@/components/site/TechLines";
import { KEY_DONORS, PARTNERSHIP_GOAL, PARTNERSHIPS_INTRO } from "@/lib/profile";
import { reveal } from "@/lib/reveal";
import { getPublicOr, getSiteImages } from "@/lib/server-api";
import { picturesOr } from "@/lib/site-images";
import type { Partner } from "@/lib/types";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "The international and local partners of the Hydraulic Programme of Ruhengeri Diocese: MISEREOR, MEDICUS MUNDI NAVARRA, MANOS UNIDAS, Società di San Vincenzo di Paoli and the Rwandan institutions we work with.",
};

/** Puts the key donors' names in the highlighted sentence on their cards. */
function KeyDonors({ partners }: { partners: Partner[] }) {
  const names = partners.filter((p) => p.badge).map((p) => p.name);
  if (names.length === 0) return <>{KEY_DONORS}</>;
  const parts = KEY_DONORS.split(new RegExp(`(${names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`));
  return (
    <>
      {parts.map((part, i) => {
        const p = partners.find((x) => x.name === part);
        return p ? (
          <a key={i} href={`#partner-${p.id}`} className="donor-mark font-semibold text-navy no-underline">
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}

export default async function PartnersPage() {
  const [partners, pics] = await Promise.all([getPublicOr<Partner[]>("/partners", []), getSiteImages()]);
  const international = partners.filter((p) => p.scope === "international");
  const local = partners.filter((p) => p.scope !== "international");
  const countries = new Set(international.map((p) => p.place.split(",").pop()?.trim()).filter(Boolean));

  const jump = [
    international.length > 0 && { href: "#international", label: "International partners", count: international.length },
    local.length > 0 && { href: "#local", label: "Local partners", count: local.length },
    { href: "#where-we-are-going", label: "Where we are going" },
    { href: "#become-a-partner", label: "Become a partner" },
  ].filter(Boolean) as { href: string; label: string; count?: number }[];

  return (
    <>
      <PageBanner title={"Our\nPartners"} subtitle={"Working\ntogether for\nsafe water"} images={picturesOr(pics, "partners.header")} tone="dark" height={460} />

      {/* Intro */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto grid max-w-[1172px] gap-12 px-4 py-[90px] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,.75fr)] lg:gap-16 lg:py-[110px]">
          <div>
            <Ruled>Who we work with</Ruled>
            <p {...reveal(1)} className="mt-[26px] max-w-[64ch] text-[15.5px] leading-[1.75] text-ink">
              {PARTNERSHIPS_INTRO}
            </p>
            <blockquote {...reveal(2)} className="relative mt-10 border-l-[4px] border-[#ffd166] bg-[linear-gradient(100deg,#fff8e1_0%,#ffffff_85%)] py-6 pl-7 pr-5">
              <span aria-hidden="true" className="font-display absolute -top-7 left-4 text-[84px] leading-none text-[#ffd166]">
                “
              </span>
              <p className="font-display text-[21px] leading-[1.55] text-navy sm:text-[23px]">
                <KeyDonors partners={partners} />
              </p>
            </blockquote>
            <nav aria-label="On this page" className="mt-10 flex flex-wrap gap-2.5">
              {jump.map((j, i) => (
                <a
                  key={j.href}
                  href={j.href}
                  {...reveal(i, "pop", 70)}
                  className="inline-flex min-h-11 items-center gap-2 border border-accent px-4 text-[13.5px] font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
                >
                  {j.label}
                  {j.count !== undefined && <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-mist px-1.5 text-[12px] text-navy">{j.count}</span>}
                </a>
              ))}
            </nav>
          </div>

          {/* The partnership at a glance */}
          <aside aria-label="Our partners in numbers" className="grid grid-cols-2 content-start gap-px self-start bg-[#d6e7f0]">
            {[
              { value: partners.length, label: "Partners and stakeholders" },
              { value: international.length, label: "International partners" },
              { value: local.length, label: "Local partners" },
              { value: countries.size, label: countries.size === 1 ? "Country abroad" : "Countries abroad" },
            ].map((f, i) => (
              <div key={f.label} {...reveal(i, "pop", 90)} className="bg-white px-6 py-7">
                <span className="font-display block text-[54px] font-light leading-none text-accent">{f.value}</span>
                <span className="mt-2 block text-[13px] font-semibold leading-[1.35] text-navy">{f.label}</span>
              </div>
            ))}
            <div className="col-span-2 bg-navy px-6 py-6 text-white">
              <span className="block text-[12px] font-bold uppercase tracking-[.14em] text-[#90e0ef]">Since 2007</span>
              <span className="mt-1.5 block text-[14.5px] leading-[1.55]">MISEREOR: privileged partner that finances the Hydraulic Program from 2007 up to today.</span>
            </div>
          </aside>
        </div>
      </section>

      {/* International partners */}
      {international.length > 0 && (
        <section id="international" aria-labelledby="international-heading" className="relative scroll-mt-4 overflow-clip bg-[radial-gradient(120%_80%_at_15%_0%,#0a4d8f_0%,#002e6d_45%,#001d47_100%)] text-white">
          <TechLines />
          <div className="relative mx-auto max-w-[1172px] px-4 py-[90px] lg:py-[110px]">
            <header className="max-w-[720px]">
              <p {...reveal(0)} className="text-[12px] font-bold uppercase tracking-[.18em] text-[#90e0ef]">
                From Europe to Ruhengeri
              </p>
              <h2 id="international-heading" {...reveal(1)} className="font-display mt-3 text-[38px] font-normal leading-[1.05] sm:text-[46px]">
                International partners
              </h2>
              <span aria-hidden="true" className="draw-line mt-5 block h-[3px] w-16 bg-[#48cae4]" />
            </header>
            <div className="mt-12">
              <PartnerWorld partners={international} />
            </div>
          </div>
        </section>
      )}

      {/* Local partners */}
      {local.length > 0 && (
        <section id="local" aria-labelledby="local-heading" className="relative scroll-mt-4 overflow-clip bg-[radial-gradient(120%_70%_at_85%_0%,#0a4d8f_0%,#002e6d_45%,#001d47_100%)] text-white">
          <svg aria-hidden="true" viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-[60px] w-full text-[#001d47]">
            <path d="M0 0h1440v30c-140 40-300 54-460 36S700 10 560 24 240 90 0 70z" fill="currentColor" />
          </svg>
          <TechLines />
          <div className="relative mx-auto max-w-[1172px] px-4 pb-[90px] pt-[120px] lg:pb-[110px]">
            <header className="max-w-[720px]">
              <p {...reveal(0)} className="text-[12px] font-bold uppercase tracking-[.18em] text-[#90e0ef]">
                Here in Rwanda
              </p>
              <h2 id="local-heading" {...reveal(1)} className="font-display mt-3 text-[38px] font-normal leading-[1.05] sm:text-[46px]">
                Local partners
              </h2>
              <span aria-hidden="true" className="draw-line mt-5 block h-[3px] w-16 bg-[#48cae4]" />
            </header>
            <div className="mt-12">
              <PartnerWorld partners={local} map="rwanda" />
            </div>
          </div>
        </section>
      )}

      {/* Where we are going: section 5 of the document, unchanged */}
      <section id="where-we-are-going" aria-labelledby="going-heading" className="relative scroll-mt-4 overflow-hidden bg-deep text-white">
        <svg aria-hidden="true" viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-[70px] w-full text-white">
          <path d="M0 0h1440v40c-120 30-240 46-360 30S840 20 720 34 480 96 360 92 120 50 0 60z" fill="currentColor" />
        </svg>
        <div className="relative mx-auto grid max-w-[1172px] gap-12 px-4 pb-[100px] pt-[150px] lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16">
          <header>
            <p {...reveal(0)} className="text-[12px] font-bold uppercase tracking-[.18em] text-[#90e0ef]">
              Partnership
            </p>
            <h2 id="going-heading" {...reveal(1)} className="font-display mt-3 text-[38px] font-normal leading-[1.05] sm:text-[44px]">
              Where we are going
            </h2>
            <span aria-hidden="true" className="draw-line mt-5 block h-[3px] w-16 bg-[#48cae4]" />
            <p {...reveal(2)} className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-[64px] font-light leading-none text-[#48cae4]">15+</span>
              <span className="text-[13.5px] font-semibold leading-snug text-white/80">years of experience in water, sanitation and hygiene</span>
            </p>
          </header>
          <div className="space-y-6">
            {PARTNERSHIP_GOAL.map((p, i) => (
              <p key={i} {...reveal(i + 1)} className={i === 0 ? "font-display text-[20px] leading-[1.65] sm:text-[22px]" : "text-[16px] leading-[1.8] text-white/85"}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Become a partner */}
      <section id="become-a-partner" className="scroll-mt-4 bg-white">
        <div className="mx-auto flex max-w-[1172px] flex-wrap items-center justify-between gap-8 px-4 py-[80px]">
          <div className="max-w-[640px]">
            <Ruled>Become a partner</Ruled>
            <p className="mt-[26px] text-[14.5px] leading-[1.6] text-[#555555]">
              Fund a project, co-build with us, or share your expertise. Tell us how you would like to help.
            </p>
          </div>
          <Link href="/contact" className="btn-primary inline-flex min-h-11 items-center gap-4 px-7 text-[13px] font-semibold">
            <Chevron /> Contact us
          </Link>
        </div>
      </section>
    </>
  );
}

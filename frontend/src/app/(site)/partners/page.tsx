import { Img } from "@/components/site/Img";
import type { Metadata } from "next";
import Link from "next/link";
import { Ruled } from "@/components/site/Headings";
import { Chevron } from "@/components/site/icons";
import { PageBanner } from "@/components/site/PageBanner";
import { getPublicOr, getSiteImages } from "@/lib/server-api";
import { picturesOr } from "@/lib/site-images";
import { reveal } from "@/lib/reveal";
import type { Partner } from "@/lib/types";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "The organisations that fund, build and maintain safe water, hygiene and sanitation with the Hydraulic Programme of Ruhengeri Diocese.",
};


export default async function PartnersPage() {
  const [partners, pics] = await Promise.all([
    getPublicOr<Partner[]>("/partners", []),
    getSiteImages(),
  ]);

  return (
    <>
      <PageBanner title={"Our\nPartners"} subtitle={"Working\ntogether for\nsafe water"} images={picturesOr(pics, "partners.header")} tone="dark" height={460} />

      <section className="bg-white">
        <div className="mx-auto flex max-w-[1172px] flex-wrap items-start gap-x-14 gap-y-10 px-4 py-[110px]">
          {partners.length > 0 && (
            <nav aria-label="Partners on this page" {...reveal(0, "left")} className="side-menu flex-[0_1_312px] bg-navy pb-3.5 pt-2.5 max-md:hidden">
              {partners.map((p) => (
                <a key={p.id} href={`#partner-${p.id}`}>
                  {p.name}
                </a>
              ))}
              <Link href="/contact" className="!border-b-0 !text-[#90e0ef]">
                Become a partner
              </Link>
            </nav>
          )}

          <div className="min-w-0 flex-[1_1_560px]">
            <Ruled>Who we work with</Ruled>
            <p className="mt-[26px] text-[14.5px] leading-[1.6] text-[#555555]">
              The organisations that fund, build and maintain this work with us.
            </p>

            {partners.length === 0 ? (
              <p className="mt-8 text-muted">Our partners will be listed here soon.</p>
            ) : (
              <ul className="mt-[26px] border border-[#dcdcdc]">
                {partners.map((p) => (
                  <li id={`partner-${p.id}`} key={p.id} {...reveal(0)} className="lift-card flex scroll-mt-6 flex-wrap gap-x-[26px] gap-y-[18px] border-b border-[#dcdcdc] bg-white px-[22px] py-6 last:border-b-0">
                    <div className="pop-chip flex h-[84px] flex-[0_0_150px] items-center justify-center border border-[#e3e3e3] bg-white p-3">
                      {p.logo ? (
                        <Img src={p.logo} alt={`${p.name} logo`} sizes="300px" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="text-center text-[12px] font-semibold text-grey">{p.name}</span>
                      )}
                    </div>
                    <div className="flex-[1_1_280px]">
                      <h3 className="text-[16px] font-semibold text-navy">{p.name}</h3>
                      {p.description && <p className="mt-2 text-[14px] leading-[1.6] text-muted">{p.description}</p>}
                      {p.websiteUrl && (
                        <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="mt-2.5 inline-flex min-h-8 items-center gap-3 text-[12px] font-bold text-accent">
                          <Chevron /> Visit website
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-14">
              <Ruled>Become a partner</Ruled>
              <p className="mt-[26px] text-[14.5px] leading-[1.6] text-[#555555]">
                Fund a project, co-build with us, or share your expertise. Tell us how you would like to help.
              </p>
              <Link href="/contact" className="btn-primary mt-6 inline-flex min-h-11 items-center gap-4 px-7 text-[13px] font-semibold">
                <Chevron /> Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

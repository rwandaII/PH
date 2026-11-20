import type { Metadata } from "next";
import { CertificatesBrowser } from "@/components/site/CertificatesBrowser";
import { Ruled } from "@/components/site/Headings";
import { PageBanner } from "@/components/site/PageBanner";
import { getPublicOr, getSiteImages } from "@/lib/server-api";
import { picturesOr } from "@/lib/site-images";
import type { Certificate } from "@/lib/types";

export const metadata: Metadata = {
  title: "Certificates and appreciations",
  description: "Certificates that confirm the Hydraulic Programme's legal standing, and the appreciations it has received for its work.",
};

export default async function CertificatesPage() {
  const [items, pics] = await Promise.all([
    getPublicOr<Certificate[]>("/certificates", []),
    getSiteImages(),
  ]);

  return (
    <>
      <PageBanner title={"Certificates &\nAppreciations"} subtitle={"Recognised\nfor our work"} images={picturesOr(pics, "certificates.header")} tone="dark" height={460} />

      <section className="bg-white">
        <div className="mx-auto max-w-[1172px] px-4 py-20 lg:py-[110px]">
          <Ruled>Our certificates and appreciations</Ruled>
          <p className="mt-[26px] max-w-[70ch] text-[14.5px] leading-[1.6] text-[#555555]">
            The Hydraulic Programme operates under the legal personality of the Catholic Diocese of Ruhengeri. Here are the certificates that
            confirm its legal standing, and the letters and awards of appreciation it has received for its work. Choose a document to see it
            full size.
          </p>
          <CertificatesBrowser items={items} />
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { TopButton } from "@/components/site/TopButton";
import { getPublicOr, getSite } from "@/lib/server-api";
import { organizationJsonLd, SHARE_IMAGE } from "@/lib/seo";
import { lines } from "@/lib/format";
import type { ServiceRow } from "@/lib/services";
import { RevealOnScroll } from "@/components/site/Motion";
import { NoCopy } from "@/components/site/NoCopy";
import { VisitCounter } from "@/components/site/VisitCounter";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  const description = site.heroText.slice(0, 200) || site.tagline || undefined;
  return {
    title: { absolute: `${site.programName}: water, hygiene and sanitation in Rwanda`, template: `%s | ${site.programName}` },
    description,
    alternates: { canonical: "./" },
    openGraph: {
      type: "website",
      locale: "en_RW",
      siteName: site.programName,
      title: site.programName,
      description,
      images: [{ url: SHARE_IMAGE, width: 1600, height: 1000, alt: site.programName }],
    },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [site, services] = await Promise.all([getSite(), getPublicOr<ServiceRow[]>("/services", [])]);
  const jsonLd = organizationJsonLd(site, { services: services.map((s) => s.title), districts: lines(site.coreDistricts, /,/) });
  return (
    <div id="top" className="flex min-h-full flex-1 flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      {/* Details search engines read to show the programme (name, logo, address, map, contacts). */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <SiteHeader programName={site.programName} />
      <main id="main" className="flex-1 overflow-x-clip">
        {children}
      </main>
      <SiteFooter site={site} />
      <TopButton />
      <RevealOnScroll />
      <NoCopy />
      <VisitCounter />
    </div>
  );
}

import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { TopButton } from "@/components/site/TopButton";
import { getSite } from "@/lib/server-api";
import { RevealOnScroll } from "@/components/site/Motion";
import { NoCopy } from "@/components/site/NoCopy";
import { VisitCounter } from "@/components/site/VisitCounter";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    title: { absolute: site.programName, template: `%s | ${site.programName}` },
    description: site.tagline || site.heroText.slice(0, 160) || undefined,
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  return (
    <div id="top" className="flex min-h-full flex-1 flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
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

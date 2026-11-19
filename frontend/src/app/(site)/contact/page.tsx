import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";
import { Ruled } from "@/components/site/Headings";
import { Pin } from "@/components/site/icons";
import { PageBanner } from "@/components/site/PageBanner";
import { photoTiles } from "@/lib/illustrations";
import { getPublicOr, getSite } from "@/lib/server-api";
import type { ProjectSummary } from "@/lib/types";
import { reveal } from "@/lib/reveal";

export const metadata: Metadata = { title: "Contact" };


const rowClass = "font-text mt-1.5 border-b border-white/20 pb-[18px] text-[13.5px] text-white/80";
const headClass = "mt-[18px] font-semibold";

export default async function ContactPage() {
  const [site, projects] = await Promise.all([getSite(), getPublicOr<ProjectSummary[]>("/projects", [])]);
  const socials = [
    { href: site.facebookUrl, label: "Facebook" },
    { href: site.twitterUrl, label: "X (Twitter)" },
    { href: site.linkedinUrl, label: "LinkedIn" },
  ].filter((s) => s.href);

  return (
    <>
      <PageBanner title={"Contact\nUs"} subtitle={"We would\nlike to hear\nfrom you"} tiles={photoTiles(projects.map((p) => p.coverImage))} tone="dark" height={460} />

      <section className="bg-white">
        <div className="mx-auto flex max-w-[1172px] flex-wrap items-start gap-x-14 gap-y-10 px-4 py-[110px]">
          <aside {...reveal(0, "left")} className="flex-[1_1_280px] bg-navy px-[25px] pb-[34px] pt-[30px] text-[14px] text-white md:flex-[0_1_312px]">
            {site.address && (
              <>
                <p className="flex items-center gap-2.5 font-semibold">
                  <Pin /> Our office
                </p>
                <p className={rowClass}>{site.address}</p>
              </>
            )}
            {site.phone && (
              <>
                <p className={headClass}>Phone</p>
                <p className={rowClass}>
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-white">{site.phone}</a>
                </p>
              </>
            )}
            {site.contactEmail && (
              <>
                <p className={headClass}>Email</p>
                <p className={rowClass}>
                  <a href={`mailto:${site.contactEmail}`} className="hover:text-white">{site.contactEmail}</a>
                </p>
              </>
            )}
            {socials.length > 0 && (
              <>
                <p className={headClass}>Follow us</p>
                <ul className="font-text mt-1.5 flex flex-wrap gap-x-3 text-[13.5px] text-white/80">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">{s.label}</a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {!site.address && !site.phone && !site.contactEmail && socials.length === 0 && (
              <p className="font-text text-[13.5px] text-white/80">Use the form to send us a message. We reply by email.</p>
            )}
          </aside>

          <div className="min-w-0 flex-[1_1_560px]" {...reveal(1)}>
            <Ruled>Send us a message</Ruled>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

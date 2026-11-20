import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";
import { TestimonialForm } from "@/components/site/TestimonialForm";
import { Ruled } from "@/components/site/Headings";
import { Pin } from "@/components/site/icons";
import { PageBanner } from "@/components/site/PageBanner";
import { LocationMap } from "@/components/site/LocationMap";
import { phoneNumbers } from "@/lib/format";
import { getSite, getSiteImages } from "@/lib/server-api";
import { picturesOr } from "@/lib/site-images";
import { reveal } from "@/lib/reveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the Hydraulic Programme of Ruhengeri Diocese in Musanze, Rwanda: phone, email, office location, map and directions.",
};


const rowClass = "font-text mt-1.5 border-b border-white/20 pb-[18px] text-[13.5px] text-white/80";
const headClass = "mt-[18px] font-semibold";

export default async function ContactPage() {
  const [site, pics] = await Promise.all([getSite(), getSiteImages()]);
  const socials = [
    { href: site.facebookUrl, label: "Facebook" },
    { href: site.twitterUrl, label: "X (Twitter)" },
    { href: site.linkedinUrl, label: "LinkedIn" },
  ].filter((s) => s.href);

  return (
    <>
      <PageBanner title={"Contact\nUs"} subtitle={"We would\nlike to hear\nfrom you"} images={picturesOr(pics, "contact.header")} tone="dark" height={460} />

      <section className="bg-white">
        <div className="mx-auto flex max-w-[1172px] flex-wrap items-start gap-x-14 gap-y-10 px-4 py-[110px]">
          <aside {...reveal(0, "left")} className="flex-[1_1_280px] bg-navy px-[25px] pb-[34px] pt-[30px] text-[14px] text-white md:flex-[0_1_312px]">
            {(site.address || site.location) && (
              <>
                <p className="flex items-center gap-2.5 font-semibold">
                  <Pin /> Our office
                </p>
                <p className={rowClass}>
                  {site.location && <span className="block font-semibold text-white">{site.location}</span>}
                  {site.address}
                  {site.latitude && site.longitude && (
                    <a href="#find-us" className="mt-1.5 block font-semibold text-[#90e0ef] hover:text-white">
                      See us on the map
                    </a>
                  )}
                </p>
              </>
            )}
            {site.phone && (
              <>
                <p className={headClass}>Phone</p>
                <p className={rowClass}>
                  {phoneNumbers(site.phone).map((n, i) => (
                    <span key={n.href}>
                      {i > 0 && <br />}
                      <a href={n.href} className="hover:text-white">{n.label}</a>
                    </span>
                  ))}
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

      {/* Where the office is: map, street view and directions */}
      {site.latitude && site.longitude && (
        <section id="find-us" aria-labelledby="find-us-heading" className="scroll-mt-4 border-t border-line bg-white">
          <div className="mx-auto max-w-[1172px] px-4 py-[90px]">
            <div {...reveal(0)}>
              <h2 id="find-us-heading" className="font-display text-[32px] font-normal leading-[1.08] text-navy sm:text-[36px]">
                Find us
              </h2>
              <p className="mt-3 max-w-[60ch] text-[15px] leading-[1.6] text-muted">
                Our office in Musanze, Northern Province. Use the map or Street View to see where we are, and get directions from where you
                are.
              </p>
            </div>
            <div className="mt-10" {...reveal(1)}>
              <LocationMap
                latitude={site.latitude}
                longitude={site.longitude}
                mapLink={site.mapLink}
                streetViewUrl={site.streetViewUrl}
                address={[site.location, site.address].filter(Boolean).join("\n")}
                name={site.programName}
              />
            </div>
          </div>
        </section>
      )}

      {/* What visitors say about us: approved comments appear on the home page */}
      <section id="comment" aria-labelledby="comment-heading" className="relative scroll-mt-4 overflow-hidden bg-mist">
        <span aria-hidden="true" className="absolute -left-24 -top-24 h-72 w-72 rounded-full border border-accent/15" />
        <div className="relative mx-auto flex max-w-[1172px] flex-wrap items-start gap-x-14 gap-y-8 px-4 py-[100px]">
          <div className="flex-[1_1_280px] md:flex-[0_1_312px]" {...reveal(0, "left")}>
            <h2 id="comment-heading" className="font-display text-[32px] font-normal leading-[1.08] text-navy">
              Tell us what you think about us
            </h2>
            <p className="mt-4 text-[14.5px] leading-[1.65] text-ink">
              Has our work made a difference for you, your school or your community? Share a few words. After our team reads and approves
              your comment, it appears with your name in “What people say” on our home page.
            </p>
          </div>
          <div className="min-w-0 flex-[1_1_560px]" {...reveal(1)}>
            <Ruled id="comment-form">Your comment</Ruled>
            <TestimonialForm />
          </div>
        </div>
      </section>
    </>
  );
}

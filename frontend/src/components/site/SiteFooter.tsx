import Link from "next/link";
import { paragraphs, phoneNumbers } from "@/lib/format";
import type { SiteInfo } from "@/lib/types";
import { Facebook, LinkedIn, Pin, Triangle, XLogo } from "./icons";
import { Logo } from "./Logo";

const linkClass = "text-white/75 hover:text-white";
const rowClass = "border-b border-white/30 py-1.5 last:border-0";

export function SiteFooter({ site }: { site: SiteInfo }) {
  const socials = [
    { href: site.facebookUrl, label: "Facebook", icon: <Facebook /> },
    { href: site.twitterUrl, label: "X (Twitter)", icon: <XLogo /> },
    { href: site.linkedinUrl, label: "LinkedIn", icon: <LinkedIn /> },
  ].filter((s) => s.href);
  const about = paragraphs(site.aboutText)[0];

  return (
    <footer className="relative mt-auto overflow-hidden bg-[linear-gradient(125deg,#002e6d_0%,#0c3a78_40%,#2e5a90_100%)] text-white/80">
      {/* Cube line-art in the bottom-right corner */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-[420px] w-[220px] opacity-20 [background-image:url(/patterns/cubes-line.svg)] [background-size:76px_132px] [mask-image:linear-gradient(135deg,transparent_20%,black_100%)]"
      />
      <div className="relative mx-auto max-w-[1152px] px-4 py-[72px]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/40 px-2.5 pb-[18px]">
          <Logo size="lg" />
          {socials.length > 0 && (
            <ul className="flex gap-3.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="flex h-11 w-11 items-center justify-center text-white">
                    {s.icon}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="font-text flex flex-wrap gap-x-[29px] gap-y-10 px-2.5 pt-11 text-[12.5px] leading-[1.45]">
          <div className="min-w-0 flex-[0_1_422px]">
            <h2 className="font-sans text-[14px] font-semibold text-white">About us</h2>
            {site.tagline && <p className="mt-[18px]">{site.tagline}</p>}
            {about && <p className="mt-3.5">{about}</p>}
            <ul className="mt-10">
              <li className={rowClass}><Link href="/about" className={linkClass}>About the program</Link></li>
              <li className={rowClass}><Link href="/team" className={linkClass}>Our team</Link></li>
              <li className={rowClass}><Link href="/dashboard" className={linkClass}>Staff dashboard</Link></li>
            </ul>
          </div>

          <div className="min-w-0 flex-[0_1_294px]">
            <h2 className="font-sans text-[14px] font-semibold text-white">Quick links</h2>
            <ul className="mt-[18px]">
              <li className={rowClass}><Link href="/projects" className={linkClass}>Projects</Link></li>
              <li className={rowClass}><Link href="/news" className={linkClass}>News</Link></li>
              <li className={rowClass}><Link href="/gallery" className={linkClass}>Photo gallery</Link></li>
              <li className={rowClass}><Link href="/partners" className={linkClass}>Partners</Link></li>
              <li className={rowClass}><Link href="/certificates" className={linkClass}>Certificates</Link></li>
              <li className={rowClass}><Link href="/contact" className={linkClass}>Contact</Link></li>
            </ul>
          </div>

          <div className="min-w-0 flex-[0_1_236px] sm:ml-auto">
            <h2 className="font-sans text-[14px] font-semibold text-white">Contact</h2>
            {(site.address || site.phone || site.location) && (
              <>
                <p className="mt-[26px] flex items-center gap-2.5 font-sans text-[13px] font-semibold text-white">
                  <Pin /> Our office
                </p>
                <p className="mt-4">
                  {site.location && (
                    <>
                      <a href={site.mapLink || "/contact#find-us"} target={site.mapLink ? "_blank" : undefined} rel={site.mapLink ? "noopener noreferrer" : undefined} className={`${linkClass} font-semibold`}>
                        {site.location}
                      </a>
                      <br />
                    </>
                  )}
                  {site.address}
                  {site.address && site.phone && <br />}
                  {site.phone && (
                    <>
                      Phone:{" "}
                      {phoneNumbers(site.phone).map((n, i) => (
                        <span key={n.href}>
                          {i > 0 && <br />}
                          <a href={n.href} className={linkClass}>
                            {n.label}
                          </a>
                        </span>
                      ))}
                    </>
                  )}
                </p>
              </>
            )}
            {site.contactEmail && (
              <>
                <p className="mt-[30px] flex items-center gap-3.5 font-sans text-[13px] font-semibold text-white">
                  <Triangle /> General enquiries
                </p>
                <p className="mt-3.5">
                  <a href={`mailto:${site.contactEmail}`} className={linkClass}>{site.contactEmail}</a>
                </p>
              </>
            )}
            <p className="mt-[30px] flex items-center gap-3.5 font-sans text-[13px] font-semibold text-white">
              <Triangle /> Send a message:
            </p>
            <p className="mt-3.5">
              <Link href="/contact" className="text-white">Contact form</Link>
            </p>
          </div>
        </div>
      </div>
      <div className="relative flex flex-wrap items-center justify-between gap-x-6 gap-y-1 bg-accent px-2.5 py-4 text-[11px] font-semibold text-white">
        <span>© {new Date().getFullYear()} {site.programName}. All Rights Reserved.</span>
        <span className="font-mono text-[10.5px] font-normal tracking-[0.04em] text-white/55">POWERED by COD RW</span>
      </div>
    </footer>
  );
}

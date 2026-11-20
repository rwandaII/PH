"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";

const NAV = [
  { href: "/about", label: "About us" },
  { href: "/projects", label: "Projects" },
  { href: "/news", label: "News" },
  { href: "/partners", label: "Partners" },
  { href: "/team", label: "Our team" },
];
// Gallery and Certificates are linked from the footer and the pages that mention them.

export function SiteHeader({ programName }: { programName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href.includes("#")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="relative z-30 bg-navy">
      <div className="flex flex-wrap items-stretch justify-between pl-4 sm:pl-12">
        <Link href="/" aria-label={`${programName}, home`} className="flex items-center py-2.5" onClick={() => setOpen(false)}>
          <Logo compactOnPhones />
        </Link>

        <div className="flex items-stretch">
          <nav
            id="site-nav"
            aria-label="Main"
            className={`${open ? "flex" : "hidden"} absolute inset-x-0 top-full flex-col bg-navy pb-2 lg:static lg:flex lg:flex-row lg:items-stretch lg:pb-0`}
          >
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`nav-link relative flex items-center whitespace-nowrap px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.02em] text-white hover:text-[#90e0ef] lg:min-h-[70px] lg:px-5 lg:py-0 xl:px-6 ${
                    active ? "lg:border-b-[3px] lg:border-accent lg:pt-[3px]" : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="flex min-w-[64px] items-center justify-center px-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-white lg:hidden"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>

          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="btn-primary flex min-h-[70px] w-[100px] items-center justify-center text-center text-[11px] font-bold leading-[1.1] sm:ml-5 sm:w-[118px]"
          >
            CONTACT
            <br />
            US
          </Link>
        </div>
      </div>
    </header>
  );
}

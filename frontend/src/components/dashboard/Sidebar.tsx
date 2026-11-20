"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/site/Logo";
import { api } from "@/lib/dashboard/api";
import { useSession } from "./Session";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/statistics", label: "Statistics" },
  { href: "/dashboard/news", label: "News" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/team", label: "Team members" },
  { href: "/dashboard/partners", label: "Partners" },
  { href: "/dashboard/services", label: "Services" },
  { href: "/dashboard/certificates", label: "Certificates" },
  { href: "/dashboard/pictures", label: "Pictures & sliders" },
  { href: "/dashboard/site", label: "About & contact info" },
  { href: "/dashboard/comments", label: "Comments" },
  { href: "/dashboard/testimonials", label: "What people say" },
  { href: "/dashboard/messages", label: "Messages" },
  { href: "/dashboard/admins", label: "Admin accounts" },
  { href: "/dashboard/account", label: "My password" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, unread, pendingComments, pendingTestimonials } = useSession();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  async function logout() {
    await api("/auth/logout", { method: "POST" }).catch(() => {});
    router.replace("/dashboard/login");
  }

  return (
    <aside className="bg-navy text-white lg:sticky lg:top-0 lg:h-screen lg:w-[250px] lg:flex-none lg:overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/dashboard" aria-label="Dashboard overview">
          <Logo size="sm" />
        </Link>
        <button
          type="button"
          className="min-h-11 px-2 text-[13px] font-semibold lg:hidden"
          aria-expanded={open}
          aria-controls="dash-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div id="dash-nav" className={`${open ? "block" : "hidden"} lg:block`}>
        <nav aria-label="Dashboard" className="mt-2 flex flex-col text-[14px] font-semibold">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center justify-between border-l-4 py-3 pl-4 pr-5 ${
                  active ? "border-accent bg-white/10 text-white" : "border-transparent text-white/75 hover:bg-white/[.08] hover:text-white"
                }`}
              >
                {item.label}
                {item.href === "/dashboard/messages" && unread > 0 && (
                  <span className="bg-accent px-2 py-px text-[11px] font-bold text-white">{unread} new</span>
                )}
                {item.href === "/dashboard/testimonials" && pendingTestimonials > 0 && (
                  <span className="bg-accent px-2 py-px text-[11px] font-bold text-white">{pendingTestimonials} waiting</span>
                )}
                {item.href === "/dashboard/comments" && pendingComments > 0 && (
                  <span className="bg-accent px-2 py-px text-[11px] font-bold text-white">{pendingComments} waiting</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mx-5 mt-8 border-t border-white/15 pb-6 pt-4 text-[13px] text-white/70">
          <p className="font-semibold text-white">{admin.name}</p>
          <p className="truncate">{admin.email}</p>
          <div className="mt-3 flex items-center gap-5">
            <Link href="/" className="inline-flex min-h-8 items-center text-sky hover:text-white">
              View site
            </Link>
            <button type="button" onClick={logout} className="inline-flex min-h-8 items-center text-sky hover:text-white">
              Log out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "@/components/dashboard/Session";
import { btnPrimary, Notice } from "@/components/dashboard/ui";
import { Chevron } from "@/components/site/icons";
import { api, ApiError } from "@/lib/dashboard/api";

interface Stats {
  news: number;
  projects: number;
  team: number;
  partners: number;
  services: number;
  unreadMessages: number;
  pendingComments: number;
}

const TILES: { key: keyof Stats; label: string; href: string }[] = [
  { key: "news", label: "News stories", href: "/dashboard/news" },
  { key: "projects", label: "Projects", href: "/dashboard/projects" },
  { key: "services", label: "Services", href: "/dashboard/services" },
  { key: "team", label: "Team members", href: "/dashboard/team" },
  { key: "partners", label: "Partners", href: "/dashboard/partners" },
  { key: "pendingComments", label: "Comments waiting", href: "/dashboard/comments" },
  { key: "unreadMessages", label: "Unread messages", href: "/dashboard/messages" },
];

const secondary = "inline-flex min-h-11 items-center gap-3 border border-line bg-white px-6 text-[14px] font-semibold text-navy hover:border-navy";

export default function OverviewPage() {
  const { admin } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Stats>("/admin/stats").then(setStats).catch((e: ApiError) => setError(e.message));
  }, []);

  return (
    <>
      <h1 className="font-display text-[34px] font-medium leading-[1.1] text-navy">Welcome back, {admin.name}</h1>
      <p className="mt-2 text-[15px] text-muted">Here is what is on the site now, and what needs your attention.</p>

      {error && (
        <div className="mt-6">
          <Notice kind="error">{error}</Notice>
        </div>
      )}

      {stats && (stats.pendingComments > 0 || stats.unreadMessages > 0) && (
        <div className="mt-6 flex flex-wrap gap-3">
          {stats.pendingComments > 0 && (
            <Link href="/dashboard/comments" className="border-l-4 border-accent bg-white px-5 py-3 text-[14px] text-navy hover:bg-mist">
              <strong>{stats.pendingComments}</strong> {stats.pendingComments === 1 ? "comment is" : "comments are"} waiting for approval
            </Link>
          )}
          {stats.unreadMessages > 0 && (
            <Link href="/dashboard/messages" className="border-l-4 border-accent bg-white px-5 py-3 text-[14px] text-navy hover:bg-mist">
              <strong>{stats.unreadMessages}</strong> unread {stats.unreadMessages === 1 ? "message" : "messages"}
            </Link>
          )}
        </div>
      )}

      <section aria-label="Site content" className="mt-8 bg-navy p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="font-display text-[22px]">On the site now</p>
          <Link href="/dashboard/statistics" className="text-[14px] font-semibold text-sky underline decoration-sky/40 underline-offset-4 hover:decoration-sky">
            See visitors and statistics
          </Link>
        </div>
        <ul className="mt-6 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))]">
          {TILES.map((t) => (
            <li key={t.key}>
              <Link href={t.href} className="block bg-white px-5 py-6 text-navy hover:bg-[#f3f6fa]">
                <span className="block text-[30px] font-medium">{stats ? stats[t.key] : "–"}</span>
                <span className="font-text mt-1 block text-[13px] text-[#555555]">{t.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="quick" className="mt-10">
        <h2 id="quick" className="font-display border-b-2 border-accent pb-4 text-[26px] font-medium text-navy">
          Quick actions
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/dashboard/news/new" className={btnPrimary}>
            <Chevron /> Write a story
          </Link>
          <Link href="/dashboard/projects/new" className={btnPrimary}>
            <Chevron /> Add a project
          </Link>
          <Link href="/dashboard/services" className={secondary}>
            Edit the services
          </Link>
          <Link href="/dashboard/site" className={secondary}>
            Edit about &amp; contact info
          </Link>
          <a href="/gallery" target="_blank" rel="noopener noreferrer" className={secondary}>
            Open the photo gallery
          </a>
          <a href="/" target="_blank" rel="noopener noreferrer" className={secondary}>
            Open the public site
          </a>
        </div>
      </section>
    </>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "@/components/dashboard/Session";
import { btnPrimary, Notice } from "@/components/dashboard/ui";
import { Chevron } from "@/components/site/icons";
import { api, ApiError } from "@/lib/dashboard/api";
import type { TeamMember } from "@/lib/types";

interface Stats {
  news: number;
  projects: number;
  team: number;
  partners: number;
  services: number;
  certificates: number;
  unreadMessages: number;
  pendingComments: number;
  pendingTestimonials: number;
}

const TILES: { key: keyof Stats; label: string; href: string }[] = [
  { key: "news", label: "News stories", href: "/dashboard/news" },
  { key: "projects", label: "Projects", href: "/dashboard/projects" },
  { key: "services", label: "Services", href: "/dashboard/services" },
  { key: "team", label: "Team members", href: "/dashboard/team" },
  { key: "partners", label: "Partners", href: "/dashboard/partners" },
  { key: "certificates", label: "Certificates", href: "/dashboard/certificates" },
  { key: "pendingTestimonials", label: "Comments about us waiting", href: "/dashboard/testimonials" },
  { key: "pendingComments", label: "Story comments waiting", href: "/dashboard/comments" },
  { key: "unreadMessages", label: "Unread messages", href: "/dashboard/messages" },
];

const secondary = "inline-flex min-h-11 items-center gap-3 border border-line bg-white px-6 text-[14px] font-semibold text-navy hover:border-navy";
const attention = "border-l-4 border-accent bg-white px-5 py-3 text-[14px] text-navy transition-colors hover:bg-mist";

export default function OverviewPage() {
  const { admin } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [team, setTeam] = useState<TeamMember[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Stats>("/admin/stats").then(setStats).catch((e: ApiError) => setError(e.message));
    api<TeamMember[]>("/admin/team").then(setTeam).catch(() => setTeam([]));
  }, []);

  const samples = team?.filter((m) => /\(sample\)/i.test(m.role)).length ?? 0;
  const unplaced = team?.filter((m) => !m.category).length ?? 0;
  const notes = [
    stats && stats.pendingTestimonials > 0 && {
      href: "/dashboard/testimonials",
      text: (
        <>
          <strong>{stats.pendingTestimonials}</strong> {stats.pendingTestimonials === 1 ? "comment about us is" : "comments about us are"} waiting
          for approval
        </>
      ),
    },
    stats && stats.pendingComments > 0 && {
      href: "/dashboard/comments",
      text: (
        <>
          <strong>{stats.pendingComments}</strong> story {stats.pendingComments === 1 ? "comment is" : "comments are"} waiting for approval
        </>
      ),
    },
    stats && stats.unreadMessages > 0 && {
      href: "/dashboard/messages",
      text: (
        <>
          <strong>{stats.unreadMessages}</strong> unread {stats.unreadMessages === 1 ? "message" : "messages"}
        </>
      ),
    },
    samples > 0 && {
      href: "/dashboard/team",
      text: (
        <>
          <strong>{samples}</strong> sample team {samples === 1 ? "profile" : "profiles"} to replace with real staff before launch
        </>
      ),
    },
    unplaced > 0 && {
      href: "/dashboard/team",
      text: (
        <>
          <strong>{unplaced}</strong> team {unplaced === 1 ? "member has" : "members have"} no place in the organisational chart yet
        </>
      ),
    },
  ].filter((n): n is { href: string; text: React.ReactElement } => !!n);

  return (
    <>
      <h1 className="font-display text-[34px] font-medium leading-[1.1] text-navy">Welcome back, {admin.name}</h1>
      <p className="mt-2 text-[15px] text-muted">
        Here is what is on the site now, and what needs your attention. Changes you save show on the public site straight away.
      </p>

      {error && (
        <div className="mt-6">
          <Notice kind="error">{error}</Notice>
        </div>
      )}

      {notes.length > 0 && (
        <section aria-label="Needs your attention" className="mt-6 flex flex-wrap gap-3">
          {notes.map((n, i) => (
            <Link key={`${n.href}-${i}`} href={n.href} className={attention}>
              {n.text}
            </Link>
          ))}
        </section>
      )}

      <section aria-label="Site content" className="mt-8 bg-navy p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="font-display text-[22px]">On the site now</p>
          <Link href="/dashboard/statistics" className="text-[14px] font-semibold text-sky underline decoration-sky/40 underline-offset-4 hover:decoration-sky">
            See visitors and statistics
          </Link>
        </div>
        <ul className="mt-6 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
          {TILES.map((t) => {
            const waiting = (t.key === "pendingTestimonials" || t.key === "pendingComments" || t.key === "unreadMessages") && (stats?.[t.key] ?? 0) > 0;
            return (
              <li key={t.key}>
                <Link
                  href={t.href}
                  className={`block bg-white px-5 py-6 text-navy transition-[translate,box-shadow] hover:bg-[#f3f6fa] hover:shadow-[0_16px_30px_-20px_rgba(0,0,0,.6)] hover:[translate:0_-3px] ${waiting ? "border-l-4 border-accent" : ""}`}
                >
                  <span className="block text-[30px] font-medium">{stats ? stats[t.key] : "–"}</span>
                  <span className="font-text mt-1 block text-[13px] text-[#555555]">{t.label}</span>
                </Link>
              </li>
            );
          })}
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
          <Link href="/dashboard/team/new" className={btnPrimary}>
            <Chevron /> Add a team member
          </Link>
          <Link href="/dashboard/certificates/new" className={btnPrimary}>
            <Chevron /> Add a certificate
          </Link>
          <Link href="/dashboard/pictures" className={secondary}>
            Change pictures and sliders
          </Link>
          <Link href="/dashboard/testimonials" className={secondary}>
            Read comments about us
          </Link>
          <Link href="/dashboard/services" className={secondary}>
            Edit the services
          </Link>
          <Link href="/dashboard/site" className={secondary}>
            Edit about &amp; contact info
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          <a href="/" target="_blank" rel="noopener noreferrer" className={secondary}>
            Open the public site
          </a>
          <a href="/team" target="_blank" rel="noopener noreferrer" className={secondary}>
            Open the team page
          </a>
          <a href="/gallery" target="_blank" rel="noopener noreferrer" className={secondary}>
            Open the photo gallery
          </a>
        </div>
      </section>
    </>
  );
}

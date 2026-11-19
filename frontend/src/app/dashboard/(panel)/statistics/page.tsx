"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loading, Notice, PageHead } from "@/components/dashboard/ui";
import { api, ApiError } from "@/lib/dashboard/api";

interface Day {
  day: string;
  views: number;
  visitors: number;
}
interface Analytics {
  today: Day;
  last7: { views: number; visitors: number };
  last30: { views: number; visitors: number };
  daily: Day[];
  topPages: { path: string; views: number }[];
  comments: { total: number; pending: number; latest: { id: number; name: string; message: string; isApproved: boolean; createdAt: string; news: { title: string; slug: string } }[] };
  messages: { total: number; unread: number; latest: { id: number; name: string; subject: string; createdAt: string; isRead: boolean }[] };
  content: { news: number; projects: number; team: number; partners: number; services: number };
}

const shortDay = (d: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${d}T00:00:00Z`));
const longDay = (d: string) => new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${d}T00:00:00Z`));
const when = (v: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(v));

/** Friendly names for the site's pages in the "most viewed" list. */
function pageName(path: string): string {
  const fixed: Record<string, string> = { "/": "Home", "/about": "About", "/projects": "Projects", "/news": "News", "/gallery": "Photo gallery", "/partners": "Partners", "/contact": "Contact" };
  if (fixed[path]) return fixed[path];
  const [, section, slug] = path.split("/");
  const words = (slug ?? "").replace(/-/g, " ");
  const label = { projects: "Project", news: "Story", team: "Team member" }[section ?? ""] ?? "Page";
  return words ? `${label}: ${words.charAt(0).toUpperCase()}${words.slice(1)}` : path;
}

/**
 * Statistics: visitors to the public site (counted without cookies or personal data),
 * the most viewed pages, readers' comments, messages and what is published.
 */
export default function StatisticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Analytics>("/admin/analytics").then(setData).catch((e: ApiError) => setError(e.message));
  }, []);

  return (
    <>
      <PageHead light="Visitors and" bold="statistics." intro="How many people visit the website, what they read, and what readers have sent. Visitors are counted without cookies or personal data." />
      {error && (
        <div className="mt-6">
          <Notice kind="error">{error}</Notice>
        </div>
      )}
      {!data ? (
        !error && <Loading />
      ) : (
        <>
          {/* Headline numbers */}
          <ul className="mt-7 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
            <Tile value={data.today.visitors} label="Visitors today" />
            <Tile value={data.today.views} label="Pages viewed today" />
            <Tile value={data.last7.visitors} label="Visitors, last 7 days" />
            <Tile value={data.last30.visitors} label="Visitors, last 30 days" />
            <Tile value={data.last30.views} label="Pages viewed, last 30 days" />
          </ul>
          <p className="mt-2 text-[12.5px] text-muted">
            A visitor is one person (one browser) on one day; someone who comes back on another day is counted again that day.
          </p>

          <DailyChart days={data.daily} />

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <TopPages pages={data.topPages} />

            <section aria-labelledby="comments-h" className="border border-line bg-white p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="comments-h" className="font-display text-[22px] text-navy">Comments</h2>
                <Link href="/dashboard/comments" className="text-[13.5px] font-semibold text-accent hover:underline">
                  Manage comments
                </Link>
              </div>
              <p className="mt-1 text-[14px] text-muted">
                {data.comments.total} in total, <strong className="text-navy">{data.comments.pending} waiting for approval</strong>
              </p>
              {data.comments.latest.length === 0 ? (
                <p className="mt-5 text-[14px] text-muted">No comments yet.</p>
              ) : (
                <ul className="mt-5 divide-y divide-[#ececec]">
                  {data.comments.latest.map((c) => (
                    <li key={c.id} className="py-3">
                      <p className="text-[13.5px]">
                        <strong className="text-navy">{c.name}</strong> <span className="text-muted">on {c.news.title}</span>
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-[14px] text-ink">{c.message}</p>
                      <p className="mt-1 text-[12px] text-muted">
                        {when(c.createdAt)}, {c.isApproved ? "shown on the site" : "waiting for approval"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section aria-labelledby="messages-h" className="border border-line bg-white p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="messages-h" className="font-display text-[22px] text-navy">Messages</h2>
                <Link href="/dashboard/messages" className="text-[13.5px] font-semibold text-accent hover:underline">
                  Read messages
                </Link>
              </div>
              <p className="mt-1 text-[14px] text-muted">
                {data.messages.total} in total, <strong className="text-navy">{data.messages.unread} unread</strong>
              </p>
              {data.messages.latest.length === 0 ? (
                <p className="mt-5 text-[14px] text-muted">No messages yet.</p>
              ) : (
                <ul className="mt-5 divide-y divide-[#ececec]">
                  {data.messages.latest.map((m) => (
                    <li key={m.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3 text-[14px]">
                      <span className={m.isRead ? "text-ink" : "font-semibold text-navy"}>
                        {m.name}
                        {m.subject && <span className="font-normal text-muted">: {m.subject}</span>}
                      </span>
                      <span className="text-[12px] text-muted">{when(m.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section aria-labelledby="content-h" className="border border-line bg-white p-6">
              <h2 id="content-h" className="font-display text-[22px] text-navy">Published on the site</h2>
              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-[14px] sm:grid-cols-3">
                {(
                  [
                    ["News stories", data.content.news],
                    ["Projects", data.content.projects],
                    ["Services", data.content.services],
                    ["Team members", data.content.team],
                    ["Partners", data.content.partners],
                  ] as const
                ).map(([label, n]) => (
                  <div key={label}>
                    <dt className="text-muted">{label}</dt>
                    <dd className="text-[22px] font-medium text-navy">{n}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </>
      )}
    </>
  );
}

function Tile({ value, label }: { value: number; label: string }) {
  return (
    <li className="border border-line bg-white px-5 py-5">
      <span className="block text-[32px] font-medium leading-none text-navy">{value.toLocaleString("en-GB")}</span>
      <span className="mt-2 block text-[13px] text-muted">{label}</span>
    </li>
  );
}

/** Daily visitors for the last 30 days: one bar per day, hover or focus a bar for its numbers. */
function DailyChart({ days }: { days: Day[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [asTable, setAsTable] = useState(false);
  const max = Math.max(1, ...days.map((d) => d.visitors));
  const top = Math.max(2, Math.ceil(max / 2) * 2); // a round top value for the scale
  const H = 180;

  return (
    <section aria-labelledby="daily-h" className="mt-10 border border-line bg-white p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="daily-h" className="font-display text-[22px] text-navy">
          Visitors per day, last 30 days
        </h2>
        <button type="button" onClick={() => setAsTable((v) => !v)} className="min-h-10 text-[13.5px] font-semibold text-accent hover:underline">
          {asTable ? "Show as chart" : "Show as table"}
        </button>
      </div>

      {asTable ? (
        <div className="mt-4 max-h-[320px] overflow-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="text-left text-[13px] font-semibold text-muted">
                <th className="py-2">Day</th>
                <th className="py-2 text-right">Visitors</th>
                <th className="py-2 text-right">Pages viewed</th>
              </tr>
            </thead>
            <tbody>
              {[...days].reverse().map((d) => (
                <tr key={d.day} className="border-t border-[#ececec]">
                  <td className="py-2 text-ink">{longDay(d.day)}</td>
                  <td className="py-2 text-right text-navy">{d.visitors}</td>
                  <td className="py-2 text-right text-ink">{d.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative mt-6">
          {/* the hover box */}
          {active !== null && (
            <div
              role="status"
              className={`pointer-events-none absolute z-10 whitespace-nowrap border border-line bg-white px-3 py-2 text-[13px] shadow-[0_8px_20px_-10px_rgba(0,30,70,.4)] ${
                active > days.length * 0.75 ? "-translate-x-full" : active < days.length * 0.25 ? "" : "-translate-x-1/2"
              }`}
              style={{ left: `calc(2.75rem + (100% - 2.75rem) * ${(active + 0.5) / days.length})`, bottom: H + 12 }}
            >
              <span className="block font-semibold text-navy">{longDay(days[active].day)}</span>
              <span className="block text-ink">
                {days[active].visitors} {days[active].visitors === 1 ? "visitor" : "visitors"}, {days[active].views} pages viewed
              </span>
            </div>
          )}

          <div className="flex gap-3">
            {/* scale */}
            <div className="flex flex-col justify-between text-right text-[11.5px] text-muted" style={{ height: H }}>
              <span>{top}</span>
              <span>{top / 2}</span>
              <span>0</span>
            </div>
            <div className="relative flex-1" style={{ height: H }}>
              {/* recessive grid lines */}
              {[0, 0.5, 1].map((f) => (
                <span key={f} aria-hidden="true" className="absolute inset-x-0 border-t border-[#ececec]" style={{ top: `${f * 100}%` }} />
              ))}
              <ul className="absolute inset-0 flex items-end gap-[2px]" aria-label="Visitors per day">
                {days.map((d, i) => (
                  <li key={d.day} className="flex h-full flex-1 items-end">
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(i)}
                      onBlur={() => setActive(null)}
                      aria-label={`${longDay(d.day)}: ${d.visitors} visitors, ${d.views} pages viewed`}
                      className="group flex h-full w-full items-end"
                    >
                      <span
                        className={`block w-full rounded-t-[4px] transition-colors ${active === i ? "bg-navy" : "bg-accent"} ${d.visitors === 0 ? "opacity-0" : ""}`}
                        style={{ height: `${Math.max((d.visitors / top) * 100, d.visitors > 0 ? 2 : 0)}%` }}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="ml-8 mt-2 flex justify-between pl-3 text-[11.5px] text-muted">
            <span>{shortDay(days[0].day)}</span>
            <span>{shortDay(days[Math.floor(days.length / 2)].day)}</span>
            <span>Today</span>
          </div>
        </div>
      )}
    </section>
  );
}

/** The most viewed pages over the last 30 days, with thin bars for comparison. */
function TopPages({ pages }: { pages: { path: string; views: number }[] }) {
  const max = Math.max(1, ...pages.map((p) => p.views));
  return (
    <section aria-labelledby="top-h" className="border border-line bg-white p-6">
      <h2 id="top-h" className="font-display text-[22px] text-navy">Most viewed pages, last 30 days</h2>
      {pages.length === 0 ? (
        <p className="mt-5 text-[14px] text-muted">No visits counted yet. They appear here as people open the site.</p>
      ) : (
        <ol className="mt-5 space-y-3">
          {pages.map((p) => (
            <li key={p.path}>
              <div className="flex items-baseline justify-between gap-3 text-[14px]">
                <a href={p.path} target="_blank" rel="noopener noreferrer" className="min-w-0 truncate text-ink hover:text-accent">
                  {pageName(p.path)}
                </a>
                <span className="flex-none font-medium text-navy">{p.views.toLocaleString("en-GB")}</span>
              </div>
              <span aria-hidden="true" className="mt-1 block h-[6px] rounded-r-[4px] bg-accent/80" style={{ width: `${(p.views / max) * 100}%` }} />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

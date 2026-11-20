"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Shown instead of a broken page if something fails while it loads (a weak connection, the
 * server restarting). The visitor can try again, and it tries again by itself as soon as the
 * device is back online. Used by the error boundaries of the site and the dashboard.
 */
export function TryAgain({ reset, home = "/", homeLabel = "Go to the home page" }: { reset: () => void; home?: string; homeLabel?: string }) {
  useEffect(() => {
    window.addEventListener("online", reset);
    return () => window.removeEventListener("online", reset);
  }, [reset]);

  return (
    <section className="flex flex-1 items-center bg-[linear-gradient(180deg,#03406f_0%,#012a4a_100%)] text-white">
      <div className="mx-auto w-full max-w-[1172px] px-4 py-24">
        <img src="/logo/ph-logo-on-dark.png" alt="" width={347} height={267} className="mb-8 block h-[84px] w-auto" />
        <h1 className="font-display text-[36px] font-normal leading-tight sm:text-[44px]">This page could not load just now</h1>
        <p className="font-text mt-4 max-w-xl text-[15.5px] leading-[1.6] text-white/85">
          The connection may be weak or the website may be busy for a moment. Please try again. If you went offline, the page will
          reload by itself when you are back online.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="btn-primary inline-flex min-h-12 items-center px-7 text-[14px] font-semibold">
            Try again
          </button>
          <Link href={home} className="inline-flex min-h-12 items-center border border-white/70 px-7 text-[14px] font-semibold hover:bg-white hover:text-navy">
            {homeLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

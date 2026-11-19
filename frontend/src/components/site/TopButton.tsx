"use client";

import { useEffect, useState } from "react";

/**
 * Back to top: a water drop on its own (no card behind it), in water blue with a thin white edge
 * so it shows on light and dark parts of the page. It pops up as soon as the visitor scrolls away
 * from the top of the page (down or up) and stays until they are back at the top.
 */
export function TopButton() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#top"
      aria-label="Back to top"
      tabIndex={shown ? 0 : -1}
      className={`top-button fixed bottom-24 left-5 z-40 flex h-12 w-11 items-center justify-center ${shown ? "is-shown" : ""}`}
    >
      <svg width="34" height="44" viewBox="0 0 34 44" aria-hidden="true" className="block drop-shadow-[0_6px_10px_rgba(0,40,90,.35)] transition-transform hover:-translate-y-0.5">
        <path d="M17 2C17 2 3 19.5 3 29a14 14 0 0 0 28 0C31 19.5 17 2 17 2Z" fill="#0077b6" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
        <path d="M10.5 29.5c0-3.4 1.6-6.8 3.8-9.6" fill="none" stroke="#ffffff" strokeOpacity=".6" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </a>
  );
}

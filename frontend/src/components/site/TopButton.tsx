"use client";

import { useEffect, useState } from "react";

/**
 * Back to top: a single-colour water drop that sways gently all the time, a quiet reminder that
 * the visitor can go back up. It appears once the page is scrolled more than 320px and stays
 * until the visitor is back at the top. The sway stops for visitors who prefer less motion.
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
      className={`top-button fixed bottom-24 left-5 z-40 flex h-14 w-12 items-center justify-center ${shown ? "is-shown" : ""}`}
    >
      <svg width="34" height="44" viewBox="0 0 34 44" aria-hidden="true" className="drop-wave block">
        <path d="M17 2C17 2 3 19.5 3 29a14 14 0 0 0 28 0C31 19.5 17 2 17 2Z" fill="#0077b6" />
      </svg>
    </a>
  );
}

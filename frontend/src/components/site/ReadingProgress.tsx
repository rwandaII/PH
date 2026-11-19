"use client";

import { useEffect, useState } from "react";

/** A thin bar along the top of the screen that fills as the reader moves through the story. */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      const done = Math.min(Math.max(-r.top + window.innerHeight * 0.2, 0), Math.max(total, 1));
      setProgress(total > 0 ? done / total : 1);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetId]);

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent">
      <div className="h-full origin-left bg-sky" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}

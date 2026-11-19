"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Watches every element with a `data-reveal` attribute and adds `is-visible` when it
 * scrolls into view (see globals.css). Also picks up elements added later, e.g. when
 * the projects filter changes. Mounted once in the site layout.
 */
export function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const showAll = () => document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
    if (reducedMotion() || !("IntersectionObserver" in window)) {
      showAll();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    const watch = (root: ParentNode) =>
      root.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((el) => io.observe(el));
    watch(document);

    const mo = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches("[data-reveal]:not(.is-visible)")) io.observe(n);
          watch(n);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}

/** A number that counts up from 0 when it scrolls into view. Shows the real value without JS. */
export function CountUp({ value, duration = 1400 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || value <= 0 || reducedMotion() || !("IntersectionObserver" in window)) return;
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        setShown(0);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref}>
      <span aria-hidden="true">{shown}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** What animates in by itself on every page, without a reveal() in the markup. */
// Bare images are left out: they move with their card, and a reveal on the <img> itself would
// override its hover zoom.
const AUTO_REVEAL = "main h2, main h3, main p, main figure, main blockquote, main form, main dl > div, main ul > li, main ol > li";
/** Never animated: menus, dialogs, things already animated, and anything marked data-no-reveal. */
const NO_REVEAL = "[data-reveal], [data-no-reveal], nav, dialog, header, [aria-hidden='true']";

/**
 * Marks headings, text, pictures and list items further down the page so they rise in as they
 * come into view; list items follow one another. Content already on screen is left alone so
 * nothing flickers when a page opens.
 */
function autoTag() {
  const fold = window.innerHeight;
  document.querySelectorAll<HTMLElement>(AUTO_REVEAL).forEach((el) => {
    if (el.closest(NO_REVEAL)) return;
    if (el.getBoundingClientRect().top < fold) return;
    const pos = getComputedStyle(el).position;
    if (pos === "absolute" || pos === "fixed" || pos === "sticky") return;
    el.setAttribute("data-reveal", "");
    if (el.tagName === "LI" && el.parentElement) {
      const i = Array.prototype.indexOf.call(el.parentElement.children, el) % 6;
      el.style.setProperty("--reveal-delay", `${i * 90}ms`);
    }
  });
}

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
    autoTag();
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

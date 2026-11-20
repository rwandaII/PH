import type { CSSProperties } from "react";

/**
 * Marks an element to slide/fade in when it scrolls into view (see RevealOnScroll and
 * globals.css). In lists, pass the index so each item starts a little later.
 *   <li {...reveal(i, "pop")}>   <div {...reveal(0, "left")}>
 */
export function reveal(index = 0, kind?: "left" | "right" | "zoom" | "pop" | "rise" | "fade", step = 110) {
  return {
    "data-reveal": kind ?? "",
    style: { "--reveal-delay": `${index * step}ms` } as CSSProperties,
  };
}

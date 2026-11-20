"use client";

import { useEffect, useState } from "react";
import { Img } from "./Img";

/**
 * Page-header slider: the pictures fade from one to the next every few seconds, each easing
 * slowly closer (CSS .slide-zoom). Small dots let visitors pick a picture (it waits while
 * they point at the dots). It also pauses while the tab is hidden, and visitors who prefer less
 * motion see the first picture standing still.
 *
 * It fills its parent: put it where the header's single <img> used to be and pass the same
 * classes as `className` (position and size) and `imgClassName` (object-fit, opacity...).
 */
export function HeaderSlides({
  images,
  className = "absolute inset-0",
  imgClassName = "",
  sizes = "100vw",
  interval = 6000,
  controlsClassName = "bottom-5 left-1/2 -translate-x-1/2",
  label = "Header pictures",
}: {
  images: string[];
  className?: string;
  imgClassName?: string;
  sizes?: string;
  interval?: number;
  /** Where the dots sit (absolute position classes, relative to the slider). */
  controlsClassName?: string;
  label?: string;
}) {
  const list = images.length > 0 ? images : [];
  const [current, setCurrent] = useState(0);
  const [holding, setHolding] = useState(false); // pointer or keyboard focus on the dots
  const many = list.length > 1;

  useEffect(() => {
    if (!many || holding) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") setCurrent((i) => (i + 1) % list.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [many, holding, interval, list.length]);

  if (list.length === 0) return null;

  return (
    <div className={`${className} overflow-hidden`} aria-roledescription={many ? "carousel" : undefined} aria-label={many ? label : undefined}>
      {list.map((src, i) => (
        <div
          key={`${src}-${i}`}
          aria-hidden={i !== current}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <Img
            src={src}
            alt=""
            sizes={sizes}
            priority={i === 0}
            loading={i === 0 ? "eager" : "lazy"}
            className={`h-full w-full object-cover ${i === current ? "slide-zoom" : ""} ${imgClassName}`}
          />
        </div>
      ))}

      {many && (
        <div
          className={`absolute z-10 flex items-center gap-2 ${controlsClassName}`}
          onMouseEnter={() => setHolding(true)}
          onMouseLeave={() => setHolding(false)}
          onFocus={() => setHolding(true)}
          onBlur={() => setHolding(false)}
        >
          {list.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show picture ${i + 1} of ${list.length}`}
              aria-current={i === current ? "true" : undefined}
              onClick={() => setCurrent(i)}
              className="flex h-6 w-6 items-center justify-center"
            >
              <span className={`block h-[3px] rounded-full bg-white transition-all duration-500 ${i === current ? "w-5 opacity-100" : "w-2.5 opacity-50"}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

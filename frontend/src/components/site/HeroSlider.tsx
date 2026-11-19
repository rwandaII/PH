"use client";

import Link from "next/link";
import { TechLines } from "./TechLines";
import { useEffect, useState } from "react";
import { Chevron, SlideArrow } from "./icons";

export interface HeroSlide {
  eyebrow: string;
  light: string;
  bold: string;
  text: string;
  caption: string;
  image: string;
  imageAlt: string;
  href: string;
}

const INTERVAL_MS = 7000;

/**
 * Home hero, measured from ALU: 748px tall, halftone-wave background, a 345x488
 * cover card on the left and the text aligned to its top, arrows at the edges.
 * Moves on by itself every 7 seconds; pauses on hover, keyboard focus, a hidden tab,
 * the pause button, or when the visitor prefers reduced motion.
 */
export function HeroSlider({
  slides,
  partner,
  programName,
}: {
  slides: HeroSlide[];
  partner: { name: string; logo: string } | null;
  programName: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false); // the visitor pressed pause
  const [holding, setHolding] = useState(false); // pointer or focus inside
  const [reduced, setReduced] = useState(false);
  const slide = slides[index];
  const many = slides.length > 1;
  const playing = many && !paused && !holding && !reduced;
  const go = (step: number) => setIndex((i) => (i + step + slides.length) % slides.length);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [playing, slides.length]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlights"
      onMouseEnter={() => setHolding(true)}
      onMouseLeave={() => setHolding(false)}
      onFocus={() => setHolding(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setHolding(false);
      }}
      className="relative flex min-h-[748px] items-center overflow-hidden bg-[#1d5a94] text-white"
    >
      {/* Background (as in ALU's header): a clean water-blue gradient with soft light, and the
          dotted "technology water" lines flowing across the right. The slide's photo is in its card. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_55%_60%_at_68%_28%,rgba(72,170,220,.55)_0%,transparent_70%),radial-gradient(ellipse_45%_55%_at_12%_85%,rgba(0,29,71,.6)_0%,transparent_70%),linear-gradient(180deg,#2a7cbf_0%,#1d63a8_40%,#0e4488_75%,#0a3471_100%)]"
      />
      <TechLines />

      {partner && (
        <div className="absolute right-4 top-[18px] z-10 flex flex-col items-center gap-1 rounded-[10px] bg-white px-3 pb-2 pt-1.5 text-navy shadow-[0_10px_24px_-10px_rgba(0,20,60,.6)] sm:right-[2.2%]">
          <span className="text-[11.5px] font-semibold text-muted">In partnership with</span>
          <img src={partner.logo} alt={partner.name} className="h-8 w-auto max-w-[120px] object-contain sm:h-10" />
        </div>
      )}

      {many && (
        <>
          <button type="button" aria-label="Previous slide" onClick={() => go(-1)} className="absolute left-[2.3%] top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white opacity-90 hover:opacity-100">
            <SlideArrow direction="prev" />
          </button>
          <button type="button" aria-label="Next slide" onClick={() => go(1)} className="absolute right-[2.5%] top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white opacity-90 hover:opacity-100">
            <SlideArrow direction="next" />
          </button>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
            className="absolute bottom-6 left-1/2 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-white/60 text-white opacity-80 hover:opacity-100"
          >
            {paused ? (
              <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
                <path d="M1 1v12l10-6z" fill="currentColor" />
              </svg>
            ) : (
              <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
                <rect x="1" y="1" width="3.5" height="12" fill="currentColor" />
                <rect x="7.5" y="1" width="3.5" height="12" fill="currentColor" />
              </svg>
            )}
          </button>
        </>
      )}

      <div className="relative mx-auto flex w-full max-w-[1092px] flex-wrap items-start gap-x-[137px] gap-y-10 px-4 py-[130px] sm:pl-[75px]">
        {/* key={index}: each slide remounts, so its entrance animation plays again. */}
        <div key={`card-${index}`} className="hero-card-in max-w-full flex-[0_0_345px]">
          <div className="relative flex h-[464px] flex-col justify-between overflow-hidden bg-[#bfe0f5] px-6 py-[26px]">
            <img src={slide.image} alt={slide.imageAlt} className="absolute inset-0 h-full w-full object-cover" />
            <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,46,109,.85)_0%,rgba(0,46,109,0)_32%,rgba(0,46,109,0)_70%,rgba(0,46,109,.55)_100%)]" />
            <span className="relative text-[13px] font-bold">{programName}</span>
            <span className="relative self-start bg-accent px-1.5 py-0.5 text-[16px] font-medium">{slide.caption}</span>
          </div>
          <div className="h-6 bg-[#005f8f]" />
        </div>

        {/* Announce changes only when the visitor drives the slides, not every 7 seconds. */}
        <div key={`text-${index}`} className="hero-text-in max-w-[535px] flex-[1_1_380px] pt-[13px]" aria-live={playing ? "off" : "polite"}>
          <p className="text-[15px] font-medium leading-[1.2]">{slide.eyebrow}</p>
          <h1 className="mt-[25px] text-[40px] font-normal leading-none tracking-[-0.005em]">
            {slide.light && (
              <>
                {slide.light}
                <br />
              </>
            )}
            <strong className="font-bold">{slide.bold}</strong>
          </h1>
          {slide.text && <p className="font-text mt-[23px] text-[14.5px] leading-[21px]">{slide.text}</p>}
          <Link
            href={slide.href}
            className="btn-outline mt-[33px] inline-flex h-[37px] items-center gap-[13px] pl-[22px] pr-[21px] text-[14px] font-semibold"
          >
            <Chevron size={10} />
            <span>
              Read more
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

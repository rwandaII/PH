import { BANNER_TILES } from "@/lib/illustrations";
import { TechLines } from "./TechLines";

const OVERLAYS = {
  navy: "linear-gradient(90deg, rgba(1,58,99,.97) 0%, rgba(1,58,99,.88) 30%, rgba(3,72,120,.72) 60%, rgba(3,72,120,.62) 100%)",
  dark: "linear-gradient(90deg, rgba(1,32,56,.97) 0%, rgba(1,32,56,.86) 28%, rgba(1,32,56,.45) 62%, rgba(1,32,56,.25) 100%)",
};

/**
 * ALU-style inner-page banner: a mosaic of pictures under a dark fade,
 * with a big bold title (lines split on "\n") and an optional subtitle.
 */
export function PageBanner({
  title,
  subtitle,
  tiles = BANNER_TILES,
  tone = "navy",
  height = 420,
}: {
  title: string;
  subtitle?: string;
  tiles?: string[];
  tone?: keyof typeof OVERLAYS;
  height?: number;
}) {
  const lines = (s: string) =>
    s.split("\n").map((line, i) => (
      <span key={i} className="block">
        {line}
      </span>
    ));

  return (
    <section className="relative flex items-center overflow-hidden bg-[#0b1c3d] text-white" style={{ minHeight: height }}>
      <div aria-hidden="true" className="absolute inset-0 grid grid-cols-4 grid-rows-2">
        {tiles.slice(0, 8).map((src, i) => (
          <img key={i} src={src} alt="" className="block h-full w-full object-cover" />
        ))}
      </div>
      <div aria-hidden="true" className="absolute inset-0" style={{ background: OVERLAYS[tone] }} />
      <TechLines />
      <div className="banner-in relative mx-auto w-full max-w-[1172px] px-4 py-16">
        <h1 className="text-[44px] font-bold leading-[.92] tracking-[-0.035em] sm:text-[62px]">{lines(title)}</h1>
        {subtitle && <p className="mt-3.5 text-[24px] font-semibold leading-[.95] tracking-[-0.02em]">{lines(subtitle)}</p>}
      </div>
    </section>
  );
}

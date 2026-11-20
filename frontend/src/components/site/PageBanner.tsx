import { PLACEHOLDER } from "@/lib/site-images";
import { HeaderSlides } from "./HeaderSlides";
import { TechLines } from "./TechLines";

const OVERLAYS = {
  navy: "linear-gradient(90deg, rgba(1,58,99,.97) 0%, rgba(1,58,99,.88) 30%, rgba(3,72,120,.72) 60%, rgba(3,72,120,.62) 100%)",
  dark: "linear-gradient(90deg, rgba(1,32,56,.97) 0%, rgba(1,32,56,.86) 28%, rgba(1,32,56,.45) 62%, rgba(1,32,56,.25) 100%)",
};

/**
 * Inner-page banner: a slider of pictures (they fade from one to the next) under a dark fade,
 * with a big bold title (lines split on newlines) and an optional subtitle. The pictures come
 * from Dashboard → Pictures & sliders; with none, the programme's logo is shown.
 */
export function PageBanner({
  title,
  subtitle,
  images = [PLACEHOLDER],
  tone = "navy",
  height = 420,
}: {
  title: string;
  subtitle?: string;
  images?: string[];
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
      <HeaderSlides images={images.length > 0 ? images : [PLACEHOLDER]} controlsClassName="bottom-4 right-4 sm:right-8" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: OVERLAYS[tone] }} />
      <TechLines />
      <div className="banner-in relative mx-auto w-full max-w-[1172px] px-4 py-16">
        <h1 className="text-[44px] font-bold leading-[.92] tracking-[-0.035em] sm:text-[62px]">{lines(title)}</h1>
        {subtitle && <p className="mt-3.5 text-[24px] font-semibold leading-[.95] tracking-[-0.02em]">{lines(subtitle)}</p>}
      </div>
    </section>
  );
}

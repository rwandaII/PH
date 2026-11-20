import { Img } from "@/components/site/Img";
import Link from "next/link";
import { PLACEHOLDER } from "@/lib/site-images";
import { HeaderSlides } from "./HeaderSlides";
import { TechLines } from "./TechLines";
import { Chevron, Pin } from "./icons";

/*
 * Building blocks of ALU's programme page, redrawn in the water palette:
 * a photo header, a facts band with a curved corner, an arch-framed photo and a dark band
 * with a photo bleeding to the right edge. Text stays left, clear of the "On this page" card.
 */

/**
 * Photo header: navy on the left fading into a slider of photos on the right (they fade from
 * one to the next). The photos come from Dashboard → Pictures & sliders; with none, the logo.
 */
export function ProgramHero({
  title,
  subtitle,
  place,
  text,
  images,
}: {
  title: string;
  subtitle?: string;
  place?: string;
  text?: string;
  images: string[];
}) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <HeaderSlides
        images={images.length > 0 ? images : [PLACEHOLDER]}
        className="absolute inset-y-0 right-0 h-full w-full lg:w-[64%]"
        sizes="(max-width: 1024px) 100vw, 64vw"
        controlsClassName="bottom-4 left-4 lg:left-10"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,46,109,.96)_0%,rgba(0,46,109,.85)_60%,rgba(0,46,109,.6)_100%)] lg:bg-[linear-gradient(90deg,#002e6d_0%,#002e6d_36%,rgba(0,46,109,.72)_52%,rgba(0,46,109,0)_74%)]"
      />
      <TechLines right="soft" />
      <div className="banner-in relative mx-auto max-w-[1172px] px-4 pb-24 pt-14 lg:min-h-[568px] lg:pb-[130px] lg:pt-[44px]">
        <div className="max-w-[420px]">
          <h1 className="font-display text-[42px] font-normal leading-[.95] sm:text-[54px]">{title}</h1>
          {subtitle && <p className="mt-5 text-[15px] leading-[1.35]">{subtitle}</p>}
          {place && (
            <p className="mt-6 flex items-center gap-3 border-b border-white/50 pb-4 text-[13px] font-semibold">
              <Pin className="h-[18px] w-auto text-sky" />
              {place}
            </p>
          )}
          {text && <p className="mt-7 text-[15px] leading-[1.35]">{text}</p>}
        </div>
      </div>
    </section>
  );
}

/** Ocean-blue band of key facts, cube pattern on the right, large curve at the bottom right. */
export function FactsBand({ facts }: { facts: { label: string; value: string; big?: boolean }[] }) {
  return (
    <section className="relative overflow-hidden rounded-br-[90px] bg-band text-white lg:rounded-br-[150px]">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-[60%] opacity-70 [background-image:url(/patterns/cubes.svg)] [background-size:24.25px_42px] [mask-image:linear-gradient(90deg,transparent,black_45%)]"
      />
      <div className="relative mx-auto max-w-[1172px] px-4 pb-14 pt-12 lg:min-h-[225px] lg:pt-[64px]">
        <dl className="grid max-w-[860px] gap-x-10 gap-y-8 sm:grid-cols-3">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="font-display text-[19px]">{f.label}</dt>
              <dd className={f.big ? "mt-2 text-[34px] font-light leading-none" : "mt-3 text-[15px] leading-[1.35]"}>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/**
 * Round-topped arch. With a normal photo: the photo fills the arch inside an ocean-blue frame.
 * With `cutout` (a PNG with the background removed): a solid ocean-blue arch with the person
 * standing in front of it, head rising above the top of the arch, as on ALU's programme page.
 */
export function ArchPhoto({ src, alt = "", cutout = false }: { src: string; alt?: string; cutout?: boolean }) {
  if (cutout) {
    return (
      <div className="float-card relative mx-auto w-full max-w-[460px]">
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 top-[18%] rounded-t-[999px] bg-band" />
        <Img src={src} alt={alt} sizes="(max-width: 640px) 90vw, 420px" className="relative mx-auto block w-[84%]" />
      </div>
    );
  }
  return (
    <div className="relative mx-auto w-full max-w-[460px] rounded-t-[999px] bg-band px-3.5 pt-3.5">
      <Img src={src} alt={alt} sizes="(max-width: 640px) 90vw, 460px" className="block aspect-[4/5] w-full rounded-t-[999px] object-cover" />
    </div>
  );
}

/**
 * Project photo: shown whole and sharp (no tint, no crop into a shape), with a solid blue block
 * set behind it at an offset, a small cube-pattern corner, and an optional white label that
 * tucks under the bottom edge (e.g. where the project is and how far it has come).
 * Used for every project photo so all project parts look the same.
 */
export function FramedPhoto({
  src,
  alt = "",
  label,
  side = "right",
}: {
  src: string;
  alt?: string;
  label?: { title: string; text: string };
  /** Which side the blue block sticks out on. */
  side?: "left" | "right";
}) {
  const right = side === "right";
  return (
    <figure className={`float-card relative mx-auto w-full max-w-[540px] pb-7 ${right ? "pr-7" : "pl-7"}`}>
      <span aria-hidden="true" className={`absolute bottom-0 top-12 bg-band ${right ? "left-12 right-0" : "left-0 right-12"}`} />
      <span
        aria-hidden="true"
        className={`absolute bottom-0 h-20 w-20 opacity-80 [background-image:url(/patterns/cubes.svg)] [background-size:24.25px_42px] ${right ? "right-0" : "left-0"}`}
      />
      <Img src={src} alt={alt} loading="lazy" sizes="(max-width: 640px) 95vw, 540px" className="relative block aspect-[4/3] w-full object-cover shadow-[0_24px_44px_-24px_rgba(0,30,70,.6)]" />
      {label && (
        <figcaption className={`absolute bottom-0 max-w-[75%] bg-white px-5 py-3.5 shadow-[0_14px_30px_-16px_rgba(0,30,70,.55)] ${right ? "left-6" : "right-6"}`}>
          <span className="block text-[12px] text-muted">{label.title}</span>
          <span className="mt-0.5 block text-[14.5px] font-semibold leading-[1.3] text-navy">{label.text}</span>
        </figcaption>
      )}
    </figure>
  );
}

/** Navy band with a photo bleeding to the right edge (ALU "Admissions Requirement"). */
export function DarkBand({ id, image, children }: { id?: string; image: string; children: React.ReactNode }) {
  return (
    <section id={id} className="relative overflow-hidden bg-navy text-white">
      <Img src={image} alt="" aria-hidden="true" sizes="(max-width: 1024px) 100vw, 52vw" className="absolute inset-y-0 right-0 h-full w-full object-cover opacity-35 lg:w-[52%] lg:opacity-100" />
      <span aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[52%] bg-[linear-gradient(90deg,#002e6d_0%,rgba(0,46,109,.35)_38%,rgba(0,46,109,0)_70%)] lg:block" />
      <div className="relative mx-auto max-w-[1172px] px-4 py-20 lg:py-[96px]">
        <div className="max-w-[560px]">{children}</div>
      </div>
    </section>
  );
}

/** Outlined link button used on dark and light bands. */
export function OutlineLink({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return (
    <Link
      href={href}
      className={`mt-7 inline-flex min-h-[40px] items-center gap-3 border px-5 text-[14px] font-semibold transition-colors ${
        light ? "border-white/80 text-white hover:bg-white hover:text-navy" : "border-accent text-accent hover:bg-accent hover:text-white"
      }`}
    >
      {children} <Chevron size={10} />
    </Link>
  );
}

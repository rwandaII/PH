import { Img } from "./Img";

/**
 * The programme's emblem presented on its own, in About → "Who we are" (when the picture there
 * is the logo rather than a person). No panel behind it: the emblem floats on the page with a
 * soft light behind it and gently moving water waves underneath, plus three short facts.
 * Everything stays inside its own box, so nothing reaches the "On this page" card; all movement
 * is GPU-only (smooth).
 */
export function EmblemShowcase({ src, alt = "", facts = [] }: { src: string; alt?: string; facts?: string[] }) {
  return (
    <figure className="emblem-panel relative mx-auto w-full max-w-[420px]">
      <div className="relative px-6 pb-32 pt-8">
        {/* soft light behind the emblem */}
        <span aria-hidden="true" className="emblem-glow pointer-events-none absolute left-1/2 top-[42%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#48cae4]/30 blur-3xl" />

        <div className="float-card relative mx-auto w-[88%]">
          <Img src={src} alt={alt} sizes="(max-width: 640px) 80vw, 380px" priority className="relative block w-full drop-shadow-[0_22px_24px_rgba(0,40,90,.28)]" />
        </div>

        {/* water waves under the emblem: two layers drifting at different speeds, fading at the sides */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_18%,black_82%,transparent)]"
        >
          <svg className="emblem-wave emblem-wave-back absolute bottom-0 left-0 h-full w-[200%]" viewBox="0 0 800 112" preserveAspectRatio="none">
            <path d="M0 52 C 100 22 100 82 200 52 S 300 22 400 52 S 500 82 600 52 S 700 22 800 52 V112 H0 Z" fill="#48cae4" fillOpacity=".22" />
          </svg>
          <svg className="emblem-wave absolute bottom-0 left-0 h-[78%] w-[200%]" viewBox="0 0 800 88" preserveAspectRatio="none">
            <path d="M0 40 C 100 66 100 14 200 40 S 300 66 400 40 S 500 14 600 40 S 700 66 800 40 V88 H0 Z" fill="#0077b6" fillOpacity=".22" />
          </svg>
        </div>

        {facts.length > 0 && (
          <figcaption className="absolute inset-x-0 bottom-5 flex flex-wrap justify-center gap-2 px-4">
            {facts.map((f) => (
              <span key={f} className="rounded-full bg-white px-3.5 py-1.5 text-[12px] font-semibold text-navy shadow-[0_8px_18px_-10px_rgba(0,40,90,.45)] ring-1 ring-[#d7e6ef]">
                {f}
              </span>
            ))}
          </figcaption>
        )}
      </div>
    </figure>
  );
}

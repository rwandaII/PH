/**
 * "Technology water" texture for page headers: thin wavy lines on both sides of the header that
 * drift slowly like water, towards the middle, and fade out completely before it, so the centre
 * (where titles and text sit) stays clear.
 *
 * The lines are still drawings made by scripts/water-dots.mjs:
 * public/patterns/water-lines-light.svg (pale white-blue lines, for blue backgrounds) and
 * water-lines-soft.svg (the same lines, much fainter, for photos). The movement is a single GPU
 * transform on each side (.water-flow in globals.css), so the browser never has to redraw the
 * lines while they move. The left side is the same drawing, mirrored. Still for visitors who
 * prefer reduced motion.
 */
type Tone = "light" | "soft";

const FADE = "[mask-image:linear-gradient(90deg,transparent_0%,transparent_60%,black_86%)]";

export function TechLines({ className = "", left = "light", right = "light" }: { className?: string; left?: Tone; right?: Tone }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <span className="water-flow absolute -inset-x-10 -inset-y-2 block">
        <img src={`/patterns/water-lines-${right}.svg`} alt="" decoding="async" className={`absolute inset-0 h-full w-full object-cover object-right ${FADE}`} />
      </span>
      <span className="water-flow water-flow-left absolute -inset-x-10 -inset-y-2 block">
        <img src={`/patterns/water-lines-${left}.svg`} alt="" decoding="async" className={`absolute inset-0 h-full w-full -scale-x-100 object-cover object-right ${FADE}`} />
      </span>
    </div>
  );
}

import Link from "next/link";
import { Img } from "./Img";
import type { PartnerMark } from "./PartnerBadge";

/**
 * A strip of partner logos gliding slowly sideways, without end (CSS .marquee in globals.css).
 * It stops while the visitor points at it, and every logo opens that partner on the Partners
 * page. Partners without a logo yet show their name. Visitors who prefer less motion get the
 * logos standing still, side by side.
 */
export function PartnerMarquee({ partners }: { partners: PartnerMark[] }) {
  if (partners.length === 0) return null;
  // Enough logos to fill a wide screen; the list is then shown twice for a seamless loop.
  const row: PartnerMark[] = [];
  while (row.length < 8) row.push(...partners);
  const seconds = Math.max(24, row.length * 4.5);

  const items = (copy: number) =>
    row.map((p, i) => (
      <li key={`${copy}-${i}`} className="flex-none px-9 py-4">
        <Link
          href={`/partners#partner-${p.id}`}
          tabIndex={copy === 0 && i < partners.length ? undefined : -1}
          aria-hidden={copy === 0 && i < partners.length ? undefined : true}
          title={p.name}
          className="group flex h-[72px] min-w-[150px] items-center justify-center transition-[translate] duration-300 hover:[translate:0_-3px]"
        >
          {p.logo ? (
            <Img src={p.logo} alt={p.name} sizes="400px" className="max-h-[60px] max-w-[200px] object-contain opacity-85 transition-opacity duration-300 group-hover:opacity-100" />
          ) : (
            <span className="max-w-[200px] text-center text-[17px] font-extrabold leading-[1.2] text-navy/85 group-hover:text-accent">{p.name}</span>
          )}
        </Link>
      </li>
    ));

  return (
    <div className="marquee relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <ul className="marquee-track flex w-max" style={{ animationDuration: `${seconds}s` }} aria-label="Our partners">
        {items(0)}
        {items(1)}
      </ul>
    </div>
  );
}

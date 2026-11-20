import { Img } from "@/components/site/Img";
import Link from "next/link";
import type { TeamMember } from "@/lib/types";
import { Chevron } from "./icons";

/**
 * A team member as a portrait card: the photo stands in a tall frame on a deep-water gradient
 * with ripple rings, a soft shade at the foot, and on hover the photo eases closer while a
 * "View profile" line rises and an aqua bar runs along the name. Cut-out portraits (transparent
 * PNG) stand in front of the gradient; ordinary photos fill the frame.
 */
export function TeamCard({ member, label }: { member: TeamMember; label?: string }) {
  const href = member.slug ? `/team/${member.slug}` : "/team";
  return (
    <Link
      href={href}
      className="team-card group relative block h-full bg-white shadow-[0_22px_44px_-30px_rgba(0,30,70,.6)] outline-none transition-[transform,box-shadow] duration-500 ease-out focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <span className="relative block aspect-[4/5] overflow-hidden bg-[radial-gradient(130%_95%_at_50%_100%,#48cae4_0%,#0077b6_45%,#023e7d_100%)]">
        {/* ripple rings, like a drop landing on water */}
        <span aria-hidden="true" className="team-ripple absolute -right-10 -top-10 h-40 w-40 rounded-full border border-white/25" />
        <span aria-hidden="true" className="team-ripple team-ripple-2 absolute -right-20 -top-20 h-60 w-60 rounded-full border border-white/15" />
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-20 w-20 opacity-40 [background-image:url(/patterns/cubes.svg)] [background-size:24.25px_42px]"
        />
        <Img
          src={member.photo || "/logo/placeholder-portrait.jpg"}
          alt={member.photo ? `Photo of ${member.name}` : ""}
          loading="lazy"
          sizes="(max-width: 640px) 50vw, 300px"
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.06] group-focus-visible:scale-[1.06]"
        />
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#011a3a]/80 to-transparent" />
        {label && (
          <span className="absolute left-3 top-3 max-w-[calc(100%-24px)] bg-white/95 px-2.5 py-1 text-[11px] font-semibold leading-[1.25] text-navy shadow-sm">
            {label}
          </span>
        )}
        <span className="absolute inset-x-4 bottom-3.5 flex translate-y-2 items-center justify-between text-[13px] font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          View profile <Chevron size={10} />
        </span>
      </span>
      <span className="relative block px-3 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
        <span aria-hidden="true" className="absolute left-0 top-0 h-[3px] w-full bg-accent" />
        <span aria-hidden="true" className="absolute left-0 top-0 h-[3px] w-0 bg-[#48cae4] transition-[width] duration-500 ease-out group-hover:w-full" />
        <span className="block text-[14px] sm:text-[16px] font-bold leading-[1.25] text-navy transition-colors group-hover:text-accent">{member.name}</span>
        <span className="mt-1 block text-[12px] sm:text-[13px] leading-[1.4] text-grey">{member.role}</span>
      </span>
    </Link>
  );
}

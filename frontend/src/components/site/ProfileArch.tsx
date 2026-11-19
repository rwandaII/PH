import type { TeamMember } from "@/lib/types";

/**
 * Team member picture on their own page: a blue arch with the person in front of it, head
 * rising above the arch (as on ALU's programme page). A PNG with the background removed stands
 * in front of the arch; any other photo fills the arch; with no photo, a silhouette stands in.
 *
 * When the page opens, a drop of water falls onto the top of the picture and splashes
 * (CSS in globals.css, "Profile arch"; skipped when the visitor prefers reduced motion).
 */
export function ProfileArch({ member }: { member: TeamMember }) {
  const photo = member.photo;
  const cutout = !!photo && /\.png($|\?)/i.test(photo);
  const fills = !!photo && !cutout;

  return (
    <div className="profile-arch relative mx-auto w-[280px] flex-none sm:w-[340px] lg:mx-0">
      {/* The arch. When a photo fills it, it starts lower so the photo's top edge is the arch. */}
      <span aria-hidden="true" className={`profile-arch-shape absolute inset-x-0 bottom-0 rounded-t-[999px] bg-band ${fills ? "top-0" : "top-[17%]"}`} />

      {fills ? (
        <img src={photo} alt={`Photo of ${member.name}`} className="relative block aspect-[4/5] w-full rounded-t-[999px] border-[10px] border-b-0 border-band object-cover" />
      ) : cutout ? (
        <img src={photo} alt={`Photo of ${member.name}`} className="relative mx-auto block w-[86%]" />
      ) : (
        <svg viewBox="0 0 340 400" role="img" aria-label={`${member.name} (no photo yet)`} className="relative block w-full">
          {/* head above the arch, shoulders inside it */}
          <circle cx="170" cy="112" r="78" fill="#e8ddd5" />
          <path d="M42 400C42 300 98 232 170 232s128 68 128 168Z" fill="#f5f2ee" />
        </svg>
      )}

      {/* Water drop that falls onto the top of the picture, then splashes */}
      <span aria-hidden="true" className={`profile-drop pointer-events-none absolute left-1/2 z-10 ${fills ? "top-[-6px]" : "top-[6px]"}`}>
        <svg width="22" height="30" viewBox="0 0 22 30">
          <path d="M11 1C11 1 2 12.5 2 19a9 9 0 0 0 18 0C20 12.5 11 1 11 1Z" fill="#90e0ef" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M6.5 19.5c0-2.4 1.2-4.8 2.8-6.8" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <span aria-hidden="true" className={`profile-ripple pointer-events-none absolute left-1/2 z-10 ${fills ? "top-[14px]" : "top-[26px]"}`} />
      <span aria-hidden="true" className={`profile-ripple profile-ripple-2 pointer-events-none absolute left-1/2 z-10 ${fills ? "top-[14px]" : "top-[26px]"}`} />
      <span aria-hidden="true" className={`profile-splash profile-splash-l pointer-events-none absolute left-1/2 z-10 ${fills ? "top-[10px]" : "top-[22px]"}`} />
      <span aria-hidden="true" className={`profile-splash profile-splash-r pointer-events-none absolute left-1/2 z-10 ${fills ? "top-[10px]" : "top-[22px]"}`} />
    </div>
  );
}

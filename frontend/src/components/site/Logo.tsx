/** "HP / HYDRAULIC PROGRAM" wordmark with a water-drop mark, white on navy. */
export function Logo({ dropInner = "#002e6d", showDot = true }: { dropInner?: string; showDot?: boolean }) {
  return (
    <span className="flex items-center gap-2.5 text-white">
      <svg width="26" height="32" viewBox="0 0 30 36" aria-hidden="true">
        <path d="M15 1C15 1 2 15.5 2 23a13 13 0 0 0 26 0C28 15.5 15 1 15 1Z" fill="#ffffff" />
        <path d="M15 13c0 0-6 6.6-6 10.4a6 6 0 0 0 12 0C21 19.6 15 13 15 13Z" fill={dropInner} />
        {showDot && <circle cx="15" cy="23.5" r="2.4" fill="#48cae4" />}
      </svg>
      <span className="text-[25px] font-extrabold leading-none tracking-[-0.02em]">HP</span>
      <span className="flex flex-col text-[9px] font-semibold leading-[1.1] tracking-[0.06em]">
        <span>HYDRAULIC</span>
        <span>PROGRAM</span>
      </span>
    </span>
  );
}

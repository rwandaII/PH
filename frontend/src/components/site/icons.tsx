/** Small inline icons used across the site. All decorative (aria-hidden). */

export function Chevron({ className = "", size = 13 }: { className?: string; size?: number }) {
  return (
    <svg width={(size * 8) / 13} height={size} viewBox="0 0 8 13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M1.5 1.5l5 5-5 5" />
    </svg>
  );
}

export function ArrowRight({ className = "", size = 20 }: { className?: string; size?: number }) {
  return (
    <svg width={(size * 24) / 20} height={size} viewBox="0 0 24 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M2 10h19M13 2l8 8-8 8" />
    </svg>
  );
}

export function SlideArrow({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg width="13" height="23" viewBox="0 0 13 23" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={direction === "prev" ? "M11 2 2 11.5 11 21" : "M2 2l9 9.5L2 21"} />
    </svg>
  );
}

export function Pin({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" aria-hidden="true" className={className}>
      <path d="M7 0a7 7 0 0 0-7 7c0 5 7 11 7 11s7-6 7-11a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 7 4.5a2.5 2.5 0 0 1 0 5z" fill="currentColor" />
    </svg>
  );
}

export function Triangle() {
  return (
    <svg width="7" height="10" viewBox="0 0 7 10" aria-hidden="true">
      <path d="M0 0l7 5-7 5z" fill="currentColor" />
    </svg>
  );
}

export function Calendar() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <rect x="1" y="3" width="12" height="10" rx="1" fill="#48cae4" />
      <rect x="3.5" y="1" width="2" height="3" fill="#48cae4" />
      <rect x="8.5" y="1" width="2" height="3" fill="#48cae4" />
    </svg>
  );
}

export function Clock() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
      <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 3.2V6l2 1.3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function Folder() {
  return (
    <svg width="13" height="11" viewBox="0 0 16 13" aria-hidden="true">
      <path d="M1 2.5V11.5h14V4H7.5L6 2.5z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function PinOutline() {
  return (
    <svg width="10" height="13" viewBox="0 0 14 18" aria-hidden="true">
      <path d="M7 1a6 6 0 0 0-6 6c0 4.4 6 10 6 10s6-5.6 6-10a6 6 0 0 0-6-6zm0 8.3A2.3 2.3 0 1 1 7 4.7a2.3 2.3 0 0 1 0 4.6z" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function Facebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-1.6 19.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 12 2z" />
    </svg>
  );
}

export function XLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.8 2h3.4l-7.4 8.5L22.5 22h-6.8l-5.3-7-6.1 7H.9l7.9-9L.5 2h7l4.8 6.4L17.8 2zm-1.2 18h1.9L6.5 3.9h-2L16.6 20z" />
    </svg>
  );
}

export function LinkedIn() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.4 2H3.6C2.7 2 2 2.7 2 3.6v16.8c0 .9.7 1.6 1.6 1.6h16.8c.9 0 1.6-.7 1.6-1.6V3.6c0-.9-.7-1.6-1.6-1.6zM8 19H5V9.5h3V19zM6.5 8.2a1.7 1.7 0 1 1 0-3.5 1.7 1.7 0 0 1 0 3.5zM19 19h-3v-4.6c0-1.1 0-2.5-1.5-2.5S12.7 13 12.7 14.3V19h-3V9.5h2.9v1.3c.4-.8 1.4-1.5 2.8-1.5 3 0 3.6 2 3.6 4.6V19z" />
    </svg>
  );
}

/** Three bars that fill up with progress: planned (1), in progress (2), completed (3). */
export function Instagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsApp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3z" />
    </svg>
  );
}

export function StatusBars({ level, on = "#0077b6", off = "#d9d9d9" }: { level: number; on?: string; off?: string }) {
  return (
    <span aria-hidden="true" className="inline-flex h-3 items-end gap-[2px]">
      {[1, 2, 3].map((n) => (
        <span key={n} className="block w-1" style={{ height: n * 4, background: n <= level ? on : off }} />
      ))}
    </span>
  );
}

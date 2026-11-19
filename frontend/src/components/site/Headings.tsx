/** Section heading: one plain Bitter line in sentence case ("Who we are", "Meet our team"). */
export function TwoTone({
  light,
  bold,
  dark = false,
  id,
}: {
  light: string;
  bold: string;
  dark?: boolean;
  id?: string;
}) {
  const text = `${light} ${bold}`.replace(/\.$/, "");
  return (
    <h2 id={id} className={`font-display text-[30px] font-normal leading-[1.15] sm:text-[34px] ${dark ? "text-white" : "text-navy"}`}>
      {text}
    </h2>
  );
}

/** Bitter heading with a coloured rule underneath (ALU FAQ page). */
export function Ruled({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="font-display border-b-2 border-accent pb-[22px] text-[34px] font-medium text-navy">
      {children}
    </h2>
  );
}

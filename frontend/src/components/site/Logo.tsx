import { Img } from "@/components/site/Img";
/**
 * The programme's emblem ("Diocese de Ruhengeri – Programme Hydraulique", from its documents)
 * with the name beside it, white on navy. `lg` is the footer version, `sm` the dashboard sidebar.
 */
const SIZES = {
  sm: { mark: "h-[40px]", name: "text-[12px]", sub: "text-[10px]" },
  md: { mark: "h-[50px]", name: "text-[14px]", sub: "text-[11px]" },
  lg: { mark: "h-[74px]", name: "text-[17px]", sub: "text-[12.5px]" },
};

export function Logo({
  size = "md",
  showName = true,
  compactOnPhones = false,
}: {
  size?: keyof typeof SIZES;
  showName?: boolean;
  /** Header: on narrow phones show the emblem only, so the menu fits on one line. */
  compactOnPhones?: boolean;
}) {
  const s = SIZES[size];
  return (
    <span className="logo flex items-center gap-3 text-white">
      <Img src="/logo/ph-logo-on-dark.png" alt="" width={347} height={267} sizes="128px" priority className={`logo-mark block w-auto flex-none ${s.mark}`} />
      {showName && (
        <span className={`${compactOnPhones ? "hidden min-[520px]:flex" : "flex"} flex-col whitespace-nowrap leading-none`}>
          <span className={`font-extrabold tracking-[0.02em] ${s.name}`}>HYDRAULIC PROGRAM</span>
          <span className={`mt-1 font-medium text-white/75 ${s.sub}`}>Diocese of Ruhengeri</span>
        </span>
      )}
    </span>
  );
}

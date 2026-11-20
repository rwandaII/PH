"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Chevron } from "./icons";

export interface PageNavItem {
  id: string;
  label: string;
}

/**
 * The white "On this page" card from ALU's programme pages. Every section stays on the page;
 * the links scroll to them, and the section in view is shown in navy with a dot. The card sits
 * where the page puts it (overlapping the bottom of the page header by `overlap`) and does not
 * follow the visitor while they scroll. Wide screens only.
 */
export function WithPageNav({
  items,
  action,
  overlap = 84,
  children,
}: {
  items: PageNavItem[];
  action?: { href: string; label: string };
  overlap?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 max-lg:hidden" style={{ top: -overlap }}>
        <div className="mx-auto flex h-full max-w-[1172px] justify-end px-4">
          <PageNavCard items={items} action={action} />
        </div>
      </div>
      {children}
    </div>
  );
}

function PageNavCard({ items, action }: { items: PageNavItem[]; action?: { href: string; label: string } }) {
  const [current, setCurrent] = useState(items[0]?.id);

  useEffect(() => {
    const sections = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    if (sections.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (seen[0]) setCurrent(seen[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="On this page"
      className="page-nav-card pointer-events-auto h-fit w-[254px] rounded-br-[60px] bg-white px-[25px] pb-[46px] pt-[50px] shadow-[0_22px_44px_-22px_rgba(0,30,70,.45)]"
    >
      <ul>
        {items.map((item, i) => {
          const on = item.id === current;
          return (
            <li key={item.id} className={i < items.length - 1 ? "border-b border-accent" : ""}>
              <a
                href={`#${item.id}`}
                aria-current={on ? "location" : undefined}
                className={`group flex items-center gap-2 py-[9px] text-[13px] leading-[1.3] transition-colors ${on ? "font-semibold text-navy" : "text-[#6f6f6f] hover:text-navy"}`}
              >
                <span
                  aria-hidden="true"
                  className={`h-[6px] w-[6px] flex-none rounded-full bg-accent transition-transform duration-300 ${on ? "scale-100" : "scale-0 group-hover:scale-75"}`}
                />
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
      {action && (
        <Link href={action.href} className="mt-3.5 flex items-center gap-3 text-[13px] font-semibold text-accent hover:text-accent-dark">
          <Chevron size={10} /> {action.label}
        </Link>
      )}
    </nav>
  );
}

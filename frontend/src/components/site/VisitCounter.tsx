"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Counts a visit to each public page for the dashboard's Statistics page. Only the page address
 * is sent; the server keeps no personal data (see backend/src/lib/analytics.ts).
 */
export function VisitCounter() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname) return;
    fetch("/api/public/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname]);
  return null;
}

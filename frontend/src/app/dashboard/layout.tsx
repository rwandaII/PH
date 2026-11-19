import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Dashboard" },
  robots: { index: false, follow: false },
};

export default function DashboardRoot({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-full flex-1 flex-col bg-[#eef5f8]">{children}</div>;
}

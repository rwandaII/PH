"use client";

import { SessionProvider } from "@/components/dashboard/Session";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 px-4 py-10 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-[1080px]">{children}</div>
          </main>
          <div className="bg-accent px-4 py-2.5 text-[11px] font-semibold text-white">Hydraulic Program · Staff dashboard</div>
        </div>
      </div>
    </SessionProvider>
  );
}

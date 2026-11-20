"use client";

import { TryAgain } from "@/components/site/TryAgain";

/** If a dashboard page fails while loading, offer to try again (nothing typed is sent twice). */
export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col">
      <TryAgain reset={reset} home="/dashboard" homeLabel="Back to the dashboard" />
    </div>
  );
}

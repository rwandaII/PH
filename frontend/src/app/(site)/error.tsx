"use client";

import { TryAgain } from "@/components/site/TryAgain";

/** If a public page fails while loading, show a friendly message instead of an error screen. */
export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <TryAgain reset={reset} />;
}

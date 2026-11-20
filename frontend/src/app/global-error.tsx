"use client";

import "./globals.css";
import { TryAgain } from "@/components/site/TryAgain";

/** Last safety net: if even the page frame fails, still show a calm message with "Try again". */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <TryAgain reset={reset} />
      </body>
    </html>
  );
}

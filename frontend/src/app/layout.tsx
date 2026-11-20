import type { Metadata } from "next";
import { Bitter, Montserrat, Open_Sans } from "next/font/google";
import { SHARE_IMAGE, SITE_URL } from "@/lib/seo";
import "./globals.css";

const display = Bitter({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
});

const text = Open_Sans({
  variable: "--font-text",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hydraulic Program",
    template: "%s | Hydraulic Program",
  },
  description: "Safe water for every community: our projects, news, team and partners.",
  applicationName: "Hydraulic Program of Ruhengeri Diocese",
  keywords: [
    "Hydraulic Program",
    "Programme Hydraulique",
    "Ruhengeri Diocese",
    "Diocese of Ruhengeri",
    "Musanze",
    "Rwanda",
    "water supply",
    "WASH",
    "hygiene and sanitation",
    "rainwater harvesting",
    "clean water Rwanda",
    "DORWASA",
  ],
  openGraph: { type: "website", locale: "en_RW", images: [{ url: SHARE_IMAGE, width: 1600, height: 1000 }] },
  twitter: { card: "summary_large_image", images: [SHARE_IMAGE] },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true, email: true, address: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the script below adds the "js" class before React loads.
    <html lang="en" className={`${display.variable} ${body.variable} ${text.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Lets CSS hide scroll-reveal elements only when JavaScript can show them again. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

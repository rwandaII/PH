import type { NextConfig } from "next";

const backend = process.env.BACKEND_URL ?? "http://localhost:4000";

/** Folders of pictures the image optimizer may resize (components/site/Img.tsx). No query strings. */
const PICTURE_FOLDERS = ["photos", "uploads", "certificates", "illustrations", "logo"];

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    localPatterns: PICTURE_FOLDERS.map((folder) => ({ pathname: `/${folder}/**`, search: "" })),
    qualities: [75],
    formats: ["image/webp"],
    // Resized copies are kept for a week; uploaded files get new names when replaced.
    minimumCacheTTL: 604800,
  },
  // Pictures and patterns rarely change: let browsers keep them for a day and refresh quietly.
  async headers() {
    return ["photos", "certificates", "illustrations", "logo", "patterns"].map((folder) => ({
      source: `/${folder}/:path*`,
      headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
    }));
  },
  // The browser only ever talks to this Next.js origin; API calls and uploaded
  // images are forwarded to Express. This keeps the login cookie first-party.
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${backend}/api/:path*` },
      { source: "/uploads/:path*", destination: `${backend}/uploads/:path*` },
    ];
  },
};

export default nextConfig;

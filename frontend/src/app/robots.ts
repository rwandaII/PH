import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/** Search engines may read every public page, but not the staff dashboard (/robots.txt). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard", "/revalidate-content", "/upload-video", "/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

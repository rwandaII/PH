import type { MetadataRoute } from "next";
import { getPublicOr } from "@/lib/server-api";
import { SITE_URL } from "@/lib/seo";

/** Every public page, story, project and team profile, for search engines (/sitemap.xml). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, projects, team] = await Promise.all([
    getPublicOr<{ items: { slug: string; publishedAt: string | null }[] }>("/news?page=1&limit=50", { items: [] }),
    getPublicOr<{ slug: string }[]>("/projects", []),
    getPublicOr<{ slug: string | null }[]>("/team", []),
  ]);
  const page = (path: string, priority: number, changeFrequency: "daily" | "weekly" | "monthly" = "weekly") => ({
    url: `${SITE_URL}${path}`,
    changeFrequency,
    priority,
  });
  return [
    page("", 1, "daily"),
    page("/about", 0.9, "monthly"),
    page("/projects", 0.9),
    page("/news", 0.9, "daily"),
    page("/team", 0.8, "monthly"),
    page("/partners", 0.7, "monthly"),
    page("/gallery", 0.7),
    page("/certificates", 0.6, "monthly"),
    page("/contact", 0.8, "monthly"),
    ...news.items.map((n) => ({ ...page(`/news/${n.slug}`, 0.7, "monthly"), lastModified: n.publishedAt ?? undefined })),
    ...projects.map((p) => page(`/projects/${p.slug}`, 0.8, "monthly")),
    ...team.flatMap((m) => (m.slug ? [page(`/team/${m.slug}`, 0.5, "monthly")] : [])),
  ];
}

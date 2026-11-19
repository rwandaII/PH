/** Split a story's HTML into its text and its photos, so the photos can get their own gallery. */
export function splitContent(html: string): { text: string; photos: string[] } {
  const photos = [...html.matchAll(/<img[^>]*\ssrc="([^"]+)"[^>]*>/g)].map((m) => m[1]);
  const text = html
    .replace(/<img[^>]*>/g, "")
    .replace(/<p>\s*<\/p>/g, "")
    .trim();
  return { text, photos };
}

/** Minutes to read, at about 200 words a minute (at least 1). */
export function readingMinutes(html: string): number {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Every distinct photo of a story: the cover first, then the ones in the text. */
export function allPhotos(cover: string | null, html: string): string[] {
  return [...new Set([cover, ...splitContent(html).photos].filter((s): s is string => !!s))];
}

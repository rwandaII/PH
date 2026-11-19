/** Built-in water illustrations, used wherever a story or project has no photo yet. */
const ILLUSTRATIONS = ["hillside", "villagers", "school", "borehole", "training", "kiosk"] as const;

export function fallbackImage(seed: number): string {
  return `/illustrations/${ILLUSTRATIONS[Math.abs(seed) % ILLUSTRATIONS.length]}.svg`;
}

export function imageOr(src: string | null | undefined, seed: number): string {
  return src || fallbackImage(seed);
}

/** Tiles for the picture-mosaic page banners. */
export const BANNER_TILES = [
  "/illustrations/hillside.svg",
  "/illustrations/villagers.svg",
  "/illustrations/school.svg",
  "/illustrations/borehole.svg",
  "/illustrations/training.svg",
  "/illustrations/kiosk.svg",
  "/illustrations/hillside.svg",
  "/illustrations/school.svg",
];

/**
 * Banner tiles from real photos (e.g. project covers). Repeats them to fill the 8 tiles;
 * falls back to the illustrations when there are no photos yet.
 */
export function photoTiles(images: (string | null | undefined)[]): string[] {
  const real = images.filter((s): s is string => !!s);
  if (real.length === 0) return BANNER_TILES;
  return Array.from({ length: 8 }, (_, i) => real[(i * 3) % real.length] ?? real[i % real.length]);
}

import "server-only";
import { cache } from "react";
import type { SiteImageRow } from "./site-images";
import type { SiteInfo } from "./types";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

/** Tag on every cached API response; the API clears it after each dashboard change. */
export const CONTENT_TAG = "content";

/**
 * Fetch from the Express public API during server rendering.
 *
 * Responses are cached so pages open instantly, and the API clears the cache after every
 * dashboard change (app/revalidate-content/route.ts), so edits still show on the next page load.
 * As a safety net the cache also refreshes itself every 10 minutes. Within one page request
 * the same address is fetched only once (React cache), e.g. the site info used by the header,
 * footer and page. Returns null for 404 so pages can call notFound().
 */
export const getPublic = cache(async function getPublic<T>(path: string): Promise<T | null> {
  // A request that hangs is abandoned after 8 s; a failed one (API restarting, database busy,
  // network blip) is tried twice more after a short pause, so visitors don't see the hiccup.
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 300 * attempt * attempt));
    try {
      const res = await fetch(`${BACKEND_URL}/api/public${path}`, {
        next: { revalidate: 600, tags: [CONTENT_TAG] },
        signal: AbortSignal.timeout(8000),
      });
      if (res.status === 404) return null;
      if (res.status >= 500) throw new Error(`API ${path} answered ${res.status}`);
      if (!res.ok) throw Object.assign(new Error(`API ${path} answered ${res.status}`), { final: true });
      return (await res.json()) as T;
    } catch (err) {
      lastError = err;
      if ((err as { final?: boolean }).final) break; // a 4xx won't change by asking again
    }
  }
  throw lastError;
}) as <T>(path: string) => Promise<T | null>;

/**
 * Like getPublic, but returns `fallback` when the API is unreachable or fails,
 * so a page still renders (with empty sections) instead of crashing.
 */
export async function getPublicOr<T>(path: string, fallback: T): Promise<T> {
  try {
    return (await getPublic<T>(path)) ?? fallback;
  } catch {
    return fallback;
  }
}

export const FALLBACK_SITE: SiteInfo = {
  programName: "Hydraulic Program",
  tagline: "",
  heroText: "",
  mission: "",
  vision: "",
  aboutText: "",
  generalObjective: "",
  specificObjectives: "",
  governanceText: "",
  areasText: "",
  coreDistricts: "",
  otherDistricts: "",
  location: "",
  mapLink: "",
  latitude: "",
  longitude: "",
  streetViewUrl: "",
  contactEmail: "",
  phone: "",
  address: "",
  facebookUrl: "",
  twitterUrl: "",
  linkedinUrl: "",
  featureImage: null,
  featureTitle: "",
  featureText: "",
  featureButton: "Read more",
  featureLink: "",
};

/** Pictures of the picture places (Dashboard → Pictures & sliders). */
export function getSiteImages(): Promise<SiteImageRow[]> {
  return getPublicOr<SiteImageRow[]>("/site-images", []);
}

export async function getSite(): Promise<SiteInfo> {
  try {
    return (await getPublic<SiteInfo>("/site")) ?? FALLBACK_SITE;
  } catch {
    return FALLBACK_SITE;
  }
}

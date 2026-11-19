import "server-only";
import type { SiteInfo } from "./types";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

/**
 * Fetch from the Express public API during server rendering.
 * Never cached, so dashboard edits show up on the next page load.
 * Returns null for 404 so pages can call notFound().
 */
export async function getPublic<T>(path: string): Promise<T | null> {
  const res = await fetch(`${BACKEND_URL}/api/public${path}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${path} failed with ${res.status}`);
  return (await res.json()) as T;
}

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
  contactEmail: "",
  phone: "",
  address: "",
  facebookUrl: "",
  twitterUrl: "",
  linkedinUrl: "",
};

export async function getSite(): Promise<SiteInfo> {
  try {
    return (await getPublic<SiteInfo>("/site")) ?? FALLBACK_SITE;
  } catch {
    return FALLBACK_SITE;
  }
}

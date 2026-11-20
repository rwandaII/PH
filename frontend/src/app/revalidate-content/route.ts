import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { CONTENT_TAG } from "@/lib/server-api";

/**
 * Called by the API after every dashboard change (backend/src/lib/revalidate.ts). Marks all
 * cached content as out of date, so the next visit to any page gets the new content.
 * Protected by a secret shared with the API (REVALIDATE_SECRET in both .env files).
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ error: "Not allowed" }, { status: 401 });
  }
  // expire: 0 — the next visitor gets fresh content straight away, never the old version.
  revalidateTag(CONTENT_TAG, { expire: 0 });
  return Response.json({ ok: true });
}

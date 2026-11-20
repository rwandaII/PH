import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

/**
 * Uploads a story's video to the API. The general /api relay keeps request bodies in memory
 * (and stops at 10 MB), which large videos and slow connections cannot get through, so this
 * route streams the upload straight through instead: no size cap here (the API allows 300 MB)
 * and 15 minutes for a slow connection. The login cookie is passed on; the API checks it.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) return Response.json({ error: "Invalid story" }, { status: 400 });
  try {
    const upstream = await fetch(`${BACKEND_URL}/api/admin/news/${id}/video`, {
      method: "POST",
      headers: {
        "content-type": request.headers.get("content-type") ?? "application/octet-stream",
        ...(request.headers.get("content-length") ? { "content-length": request.headers.get("content-length") as string } : {}),
        cookie: request.headers.get("cookie") ?? "",
      },
      body: request.body,
      // stream the request body instead of reading it all first
      duplex: "half",
      signal: AbortSignal.timeout(15 * 60 * 1000),
    } as RequestInit & { duplex: "half" });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { "content-type": upstream.headers.get("content-type") ?? "application/json", "cache-control": "no-store" },
    });
  } catch {
    return Response.json({ error: "The upload did not reach the server. Please try again." }, { status: 502 });
  }
}

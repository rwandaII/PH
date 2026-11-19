/**
 * Browser-side client for the Express API, used by the dashboard.
 * Requests go to this Next.js origin (/api/... is rewritten to Express), so the
 * httpOnly login cookie travels with them automatically.
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields: Record<string, string> = {},
  ) {
    super(message);
  }
}

type Body = FormData | Record<string, unknown> | undefined;

export async function api<T = unknown>(path: string, init: { method?: string; body?: Body } = {}): Promise<T> {
  const { method = "GET", body } = init;
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      method,
      credentials: "same-origin",
      headers: body && !isForm ? { "Content-Type": "application/json" } : undefined,
      body: body ? (isForm ? (body as FormData) : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new ApiError(0, "Could not reach the server. Check your connection and try again.");
  }

  if (res.status === 401 && !path.startsWith("/auth/login")) {
    // Session expired or missing: go to the login page. This runs outside any
    // component (no router available), and a full load also clears stale state.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    if (typeof window !== "undefined") window.location.assign(`/dashboard/login?next=${encodeURIComponent(window.location.pathname)}`);
    throw new ApiError(401, "Please log in again.");
  }
  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const fields: Record<string, string> = {};
    for (const f of data?.fields ?? []) fields[f.path] = f.message;
    throw new ApiError(res.status, data?.error ?? `Request failed (${res.status})`, fields);
  }
  return data as T;
}

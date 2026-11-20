/**
 * Browser-side client for the Express API, used by the dashboard.
 * Requests go to this Next.js origin (/api/... is rewritten to Express), so the
 * httpOnly login cookie travels with them automatically.
 *
 * Made for slow or unsteady connections: every request has a time limit (longer for uploads),
 * and reading data (GET) is retried automatically twice when the connection drops or the server
 * is briefly unavailable. Saving is never repeated automatically, so nothing is saved twice.
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

const OFFLINE = "You seem to be offline. Check your internet connection and try again.";
const UNREACHABLE = "The server could not be reached. Check your connection and try again.";
const TOO_SLOW = "The connection is too slow right now and the request timed out. Please try again.";
const BUSY = "The server is busy for a moment. Please try again in a few seconds.";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function api<T = unknown>(path: string, init: { method?: string; body?: Body } = {}): Promise<T> {
  const { method = "GET", body } = init;
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const reading = method === "GET";
  // Uploads over a slow connection need time; everything else should answer quickly.
  const timeout = isForm ? 180_000 : reading ? 20_000 : 45_000;
  const attempts = reading ? 3 : 1;

  let res: Response | null = null;
  let failure = UNREACHABLE;
  for (let attempt = 0; attempt < attempts; attempt++) {
    if (attempt > 0) await wait(600 * attempt);
    try {
      res = await fetch(`/api${path}`, {
        method,
        credentials: "same-origin",
        cache: "no-store",
        headers: body && !isForm ? { "Content-Type": "application/json" } : undefined,
        body: body ? (isForm ? (body as FormData) : JSON.stringify(body)) : undefined,
        signal: AbortSignal.timeout(timeout),
      });
      if (reading && [500, 502, 503, 504].includes(res.status) && attempt < attempts - 1) {
        res = null;
        continue;
      }
      break;
    } catch (err) {
      res = null;
      failure = typeof navigator !== "undefined" && !navigator.onLine ? OFFLINE : (err as Error)?.name === "TimeoutError" ? TOO_SLOW : UNREACHABLE;
    }
  }
  if (!res) throw new ApiError(0, failure);

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
    const message =
      data?.error ??
      (res.status === 413 ? "That file is too big. Pictures can be up to 5 MB." : res.status >= 500 ? BUSY : `Something went wrong (${res.status}). Please try again.`);
    throw new ApiError(res.status, message, fields);
  }
  return data as T;
}

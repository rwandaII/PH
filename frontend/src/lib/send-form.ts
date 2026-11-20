/**
 * Sends a public form (contact message, comment, "what people say") to the API and turns every
 * outcome into something a visitor can act on: field errors, offline, too slow, too many tries,
 * or the server being busy. The request has a time limit so a weak connection never leaves the
 * button spinning forever. It is not retried automatically, so a message is never sent twice.
 */
export interface SendResult {
  ok: boolean;
  /** Field name → what to fix. */
  fields: Record<string, string>;
  /** A message for the whole form ("" when only fields need fixing). */
  error: string;
}

export async function sendForm(path: string, data: Record<string, FormDataEntryValue>): Promise<SendResult> {
  let res: Response;
  try {
    res = await fetch(`/api/public${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err) {
    const error =
      typeof navigator !== "undefined" && !navigator.onLine
        ? "You seem to be offline. Your text is still here: send it again when you are connected."
        : (err as Error)?.name === "TimeoutError"
          ? "The connection is too slow right now. Your text is still here: please send it again."
          : "We could not reach the website. Check your connection and send it again; your text is still here.";
    return { ok: false, fields: {}, error };
  }
  if (res.ok) return { ok: true, fields: {}, error: "" };

  const body = await res.json().catch(() => null);
  const fields: Record<string, string> = {};
  for (const f of body?.fields ?? []) fields[f.path] = f.message;
  if (Object.keys(fields).length > 0) return { ok: false, fields, error: "" };
  const error =
    res.status === 429
      ? "You have sent several messages in a short time. Please wait a little and try again."
      : res.status >= 500
        ? "The website is busy for a moment. Please send it again in a few seconds."
        : (body?.error ?? "Something went wrong. Please try again.");
  return { ok: false, fields, error };
}

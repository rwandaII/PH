"use client";

import { useRef, useState } from "react";
import { hintClass, labelClass } from "./ui";

const ACCEPT = "video/mp4,video/webm,video/quicktime,video/ogg";
const MAX_BYTES = 300 * 1024 * 1024;

/**
 * Upload a video for a story, with a progress bar (useful on slow connections) and a Cancel
 * button. The video is saved straight away on its own, so the rest of the form is not affected.
 * Shows the current video with Replace and Remove.
 */
export function VideoField({
  label,
  hint,
  storyId,
  current,
  onChange,
}: {
  label: string;
  hint?: string;
  /** The story's id; null while the story is not saved yet. */
  storyId: number | null;
  current: string | null;
  onChange: (videoFile: string | null) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const xhr = useRef<XMLHttpRequest | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState(false);
  // Uploads stream through /upload-video (no size cap); removing is a small /api request.
  const uploadUrl = storyId ? `/upload-video/${storyId}` : null;
  const removeUrl = storyId ? `/api/admin/news/${storyId}/video` : null;

  function upload(file: File) {
    if (!uploadUrl) return;
    setError("");
    if (!ACCEPT.split(",").includes(file.type)) {
      setError("Choose an MP4, WebM, MOV or OGG video.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("This video is larger than 300 MB. Shorten it, or upload it to YouTube and paste the link above.");
      return;
    }
    const form = new FormData();
    form.append("video", file);
    const req = new XMLHttpRequest();
    xhr.current = req;
    req.open("POST", uploadUrl);
    req.withCredentials = true;
    req.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    };
    req.onload = () => {
      xhr.current = null;
      setProgress(null);
      let body: { videoFile?: string; error?: string } | null = null;
      try {
        body = JSON.parse(req.responseText);
      } catch {
        body = null;
      }
      if (req.status >= 200 && req.status < 300 && body?.videoFile) onChange(body.videoFile);
      else if (req.status === 401) setError("Your session has ended. Log in again, then upload the video.");
      else setError(body?.error ?? (req.status >= 500 ? "The server is busy. Please try again in a moment." : "The video could not be uploaded."));
    };
    req.onerror = () => {
      xhr.current = null;
      setProgress(null);
      setError(navigator.onLine ? "The connection dropped during the upload. Please try again." : "You are offline. Upload the video again when you are connected.");
    };
    req.onabort = () => {
      xhr.current = null;
      setProgress(null);
    };
    setProgress(0);
    req.send(form);
  }

  async function remove() {
    if (!removeUrl) return;
    setRemoving(true);
    setError("");
    try {
      const res = await fetch(removeUrl, { method: "DELETE", credentials: "same-origin", signal: AbortSignal.timeout(30_000) });
      if (!res.ok) throw new Error();
      onChange(null);
    } catch {
      setError("The video could not be removed. Please try again.");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div>
      <p className={labelClass}>{label}</p>
      {!uploadUrl ? (
        <p className="mt-2 border border-dashed border-line bg-mist px-4 py-4 text-[13.5px] text-muted">
          Save the story first; then you can upload a video here.
        </p>
      ) : (
        <div className="mt-2 space-y-3">
          {current && progress === null && (
            <video src={current} controls preload="metadata" className="block aspect-video w-full max-w-[520px] bg-black" aria-label="Current video" />
          )}
          {progress !== null && (
            <div>
              <div className="flex items-center justify-between text-[13px] font-semibold text-navy">
                <span>Uploading the video… {progress}%</span>
                <button type="button" onClick={() => xhr.current?.abort()} className="min-h-9 px-2 text-danger hover:underline">
                  Cancel
                </button>
              </div>
              <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-mist" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={input}
              type="file"
              accept={ACCEPT}
              className="sr-only"
              tabIndex={-1}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload(f);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              disabled={progress !== null}
              onClick={() => input.current?.click()}
              className="btn-primary inline-flex min-h-11 items-center gap-2 px-5 text-[13.5px] font-semibold disabled:opacity-60"
            >
              {current ? "Replace the video" : "Upload a video"}
            </button>
            {current && progress === null && (
              <button type="button" onClick={remove} disabled={removing} className="min-h-11 px-2 text-[13.5px] font-semibold text-danger hover:underline disabled:opacity-60">
                {removing ? "Removing…" : "Remove the video"}
              </button>
            )}
          </div>
        </div>
      )}
      {hint && <p className={hintClass}>{hint}</p>}
      {error && (
        <p role="alert" className="mt-1 text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

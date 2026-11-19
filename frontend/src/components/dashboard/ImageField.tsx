"use client";

import { useRef, useState } from "react";
import { btnPlain, hintClass, labelClass } from "./ui";

const MAX_BYTES = 5 * 1024 * 1024;
// Must match the backend (backend/src/lib/upload.ts).
const TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Image picker with preview. Reports the chosen file, or that the current image
 * should be removed; the form sends these as `image` and `removeImage`.
 * The parent remounts it (via `key`) when the saved image changes.
 */
export function ImageField({
  name,
  label,
  hint,
  current,
  onChange,
  error,
}: {
  name: string;
  label: string;
  hint?: string;
  current: string | null;
  onChange: (change: { file: File | null; remove: boolean }) => void;
  error?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(current);
  const [localError, setLocalError] = useState("");

  function pick(file: File | undefined) {
    if (!file) return;
    if (!TYPES.includes(file.type)) return setLocalError("Choose a JPG, PNG or WEBP image.");
    if (file.size > MAX_BYTES) return setLocalError("This image is larger than 5 MB.");
    setLocalError("");
    setPreview(URL.createObjectURL(file));
    onChange({ file, remove: false });
  }

  function remove() {
    setPreview(null);
    if (input.current) input.current.value = "";
    onChange({ file: null, remove: !!current });
  }

  const message = localError || error;
  return (
    <div>
      <span id={`${name}-label`} className={labelClass}>
        {label}
      </span>
      <div className="mt-2 flex flex-wrap items-center gap-4">
        <div className="flex h-[120px] w-[180px] items-center justify-center border border-line bg-[#f3f4f6]">
          {preview ? (
            <img src={preview} alt="" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-[12px] text-grey">No image</span>
          )}
        </div>
        <div className="flex flex-col items-start gap-2">
          <input
            ref={input}
            id={name}
            type="file"
            accept={TYPES.join(",")}
            className="sr-only"
            aria-labelledby={`${name}-label`}
            onChange={(e) => pick(e.target.files?.[0])}
          />
          <button type="button" onClick={() => input.current?.click()} className={btnPlain}>
            {preview ? "Change image" : "Choose image"}
          </button>
          {preview && (
            <button type="button" onClick={remove} className="min-h-8 text-[13px] font-semibold text-danger hover:underline">
              Remove image
            </button>
          )}
          <span className={hintClass}>{hint ?? "JPG, PNG or WEBP, up to 5 MB."}</span>
        </div>
      </div>
      {message && <p className="mt-1 text-[13px] text-danger">{message}</p>}
    </div>
  );
}

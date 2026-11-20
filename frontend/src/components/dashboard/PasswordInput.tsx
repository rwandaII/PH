"use client";

import { useState } from "react";

/**
 * A password box with a Show / Hide button inside it, so people can check what they typed.
 * Takes the same props as an <input> (except type).
 */
export function PasswordInput({ className = "field", ...props }: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [shown, setShown] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={shown ? "text" : "password"} className={`${className} pr-[92px]`} />
      <button
        type="button"
        onClick={() => setShown((v) => !v)}
        aria-pressed={shown}
        aria-controls={props.id}
        aria-label={shown ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex min-w-[84px] items-center justify-center gap-1.5 px-3 text-[12.5px] font-semibold text-accent transition-colors hover:text-navy"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
          {shown && <path d="M4 4l16 16" />}
        </svg>
        {shown ? "Hide" : "Show"}
      </button>
    </div>
  );
}

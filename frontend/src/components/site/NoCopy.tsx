"use client";

import { useEffect } from "react";

/** True for places where people must still be able to type, paste and select (forms). */
const isEditable = (t: EventTarget | null) =>
  t instanceof HTMLElement && !!t.closest("input, textarea, select, [contenteditable='true']");

/**
 * Discourages copying the site's text and photos: no selecting, copying, cutting,
 * right-click menu or dragging photos away, except inside form fields.
 * Note: no website can fully stop copying (screenshots, browser tools); this stops the easy ways.
 */
export function NoCopy() {
  useEffect(() => {
    const block = (e: Event) => {
      if (!isEditable(e.target)) e.preventDefault();
    };
    const keys = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return;
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && (k === "c" || k === "x" || k === "s" || k === "u" || k === "a")) e.preventDefault();
    };
    const events = ["copy", "cut", "contextmenu", "dragstart", "selectstart"] as const;
    events.forEach((ev) => document.addEventListener(ev, block));
    document.addEventListener("keydown", keys);
    document.body.classList.add("no-copy");
    return () => {
      events.forEach((ev) => document.removeEventListener(ev, block));
      document.removeEventListener("keydown", keys);
      document.body.classList.remove("no-copy");
    };
  }, []);
  return null;
}

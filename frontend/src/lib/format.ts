import type { ProjectStatus } from "./types";

export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

/** A calendar date stored without a time (e.g. a certificate's date), shown the same in every time zone. */
export function formatDay(value: string | null | undefined): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

/** "+250 788 742 632 / +250 788 621 192" → each number with its tel: link. */
export function phoneNumbers(phone: string): { label: string; href: string }[] {
  return phone
    .split(/\s*[\/;,]\s*/)
    .map((n) => n.trim())
    .filter(Boolean)
    .map((label) => ({ label, href: `tel:${label.replace(/[^\d+]/g, "")}` }));
}

/** Plain text typed one item per line, or separated by commas, as a list. */
export function lines(text: string, separator: RegExp = /\r?\n/): string[] {
  return text
    .split(separator)
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Split plain text typed in the dashboard into paragraphs. */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  planned: "Planned",
  ongoing: "In progress",
  completed: "Completed",
};

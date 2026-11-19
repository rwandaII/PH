import type { ProjectStatus } from "./types";

export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
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

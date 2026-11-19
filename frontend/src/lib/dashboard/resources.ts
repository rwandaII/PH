/**
 * The content types editors manage. The list screen and the edit form are
 * generic and read their columns and fields from here.
 */

export type FieldType = "text" | "textarea" | "richtext" | "select" | "checkbox" | "number" | "url" | "image";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  hint?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  /** Default for new records. */
  initial?: string | boolean | number;
  /** Narrow fields sit side by side on wide screens. */
  narrow?: boolean;
}

export interface ColumnDef {
  key: string;
  label: string;
  kind?: "title" | "published" | "date" | "status" | "image" | "text";
}

export interface ResourceDef {
  key: "news" | "projects" | "team" | "partners" | "services";
  label: string;
  singular: string;
  /** Path under /api/admin. */
  api: string;
  /** Public page for a published item, if any. */
  publicPath?: (item: Record<string, unknown>) => string | null;
  intro: string;
  columns: ColumnDef[];
  fields: FieldDef[];
  newLabel: string;
}

export const STATUS_OPTIONS = [
  { value: "planned", label: "Planned" },
  { value: "ongoing", label: "In progress" },
  { value: "completed", label: "Completed" },
];

const sortField: FieldDef = {
  name: "sortOrder",
  label: "Order on the page",
  type: "number",
  hint: "Lower numbers appear first.",
  initial: 0,
  narrow: true,
};

export const RESOURCES: Record<ResourceDef["key"], ResourceDef> = {
  news: {
    key: "news",
    label: "News",
    singular: "story",
    api: "/admin/news",
    newLabel: "Write a story",
    publicPath: (i) => (i.isPublished ? `/news/${i.slug}` : null),
    intro: "Stories appear on the public site once you publish them.",
    columns: [
      { key: "coverImage", label: "", kind: "image" },
      { key: "title", label: "Title", kind: "title" },
      { key: "isPublished", label: "Status", kind: "published" },
      { key: "publishedAt", label: "Published", kind: "date" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "excerpt", label: "Short summary", type: "textarea", hint: "Shown in news lists and when the story is shared. Up to 500 characters." },
      { name: "coverImage", label: "Cover image", type: "image" },
      { name: "content", label: "Story", type: "richtext" },
      { name: "slug", label: "Web address", type: "text", hint: "Leave empty to make one from the title.", narrow: true },
      { name: "isPublished", label: "Show on the public site", type: "checkbox", initial: false },
    ],
  },
  projects: {
    key: "projects",
    label: "Projects",
    singular: "project",
    api: "/admin/projects",
    newLabel: "Add a project",
    publicPath: (i) => (i.isPublished ? `/projects/${i.slug}` : null),
    intro: "Projects appear on the Projects page and the home page once you publish them.",
    columns: [
      { key: "coverImage", label: "", kind: "image" },
      { key: "title", label: "Title", kind: "title" },
      { key: "status", label: "Progress", kind: "status" },
      { key: "isPublished", label: "Status", kind: "published" },
      { key: "location", label: "Location", kind: "text" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "summary", label: "Short summary", type: "textarea", hint: "One or two sentences for project cards. Up to 500 characters." },
      { name: "status", label: "Progress", type: "select", options: STATUS_OPTIONS, initial: "ongoing", narrow: true },
      { name: "location", label: "Location", type: "text", narrow: true },
      { name: "coverImage", label: "Cover image", type: "image" },
      { name: "content", label: "Full description", type: "richtext" },
      { ...sortField },
      { name: "slug", label: "Web address", type: "text", hint: "Leave empty to make one from the title.", narrow: true },
      { name: "isPublished", label: "Show on the public site", type: "checkbox", initial: false },
    ],
  },
  team: {
    key: "team",
    label: "Team members",
    singular: "team member",
    api: "/admin/team",
    newLabel: "Add a person",
    intro: "Team members appear on the About page and the home page, and each has a page of their own.",
    columns: [
      { key: "photo", label: "", kind: "image" },
      { key: "name", label: "Name", kind: "title" },
      { key: "role", label: "Role", kind: "text" },
      { key: "sortOrder", label: "Order", kind: "text" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, narrow: true },
      { name: "role", label: "Role", type: "text", required: true, narrow: true },
      { name: "photo", label: "Photo", type: "image", hint: "A square photo works best." },
      { name: "bio", label: "Biography", type: "textarea", required: true, hint: "Required. Shown in full on the person's own page; the first lines appear on the About page. Leave a blank line between paragraphs." },
      { name: "expertise", label: "Areas of work", type: "text", hint: "Separate with commas, e.g. Water supply, Hygiene and sanitation." },
      { name: "education", label: "Education and training", type: "textarea", hint: "Degrees, courses and certificates, one per line." },
      { name: "languages", label: "Languages", type: "text", hint: "e.g. Kinyarwanda, English, French", narrow: true },
      { name: "joinedYear", label: "Working with the program since (year)", type: "number", narrow: true },
      { name: "email", label: "Email", type: "text", narrow: true },
      { name: "phone", label: "Phone", type: "text", narrow: true },
      { name: "whatsapp", label: "WhatsApp number", type: "text", hint: "With the country code, e.g. +250 788 000 000", narrow: true },
      { name: "address", label: "Office or address", type: "text" },
      { name: "facebookUrl", label: "Facebook page", type: "url", hint: "The full address, starting with https://", narrow: true },
      { name: "twitterUrl", label: "X (Twitter)", type: "url", narrow: true },
      { name: "linkedinUrl", label: "LinkedIn", type: "url", narrow: true },
      { name: "instagramUrl", label: "Instagram", type: "url", narrow: true },
      { name: "slug", label: "Web address", type: "text", hint: "Leave empty to make one from the name.", narrow: true },
      { ...sortField },
    ],
  },
  partners: {
    key: "partners",
    label: "Partners",
    singular: "partner",
    api: "/admin/partners",
    newLabel: "Add a partner",
    intro: "Partners appear on the Partners page and the home page.",
    columns: [
      { key: "logo", label: "", kind: "image" },
      { key: "name", label: "Name", kind: "title" },
      { key: "websiteUrl", label: "Website", kind: "text" },
      { key: "sortOrder", label: "Order", kind: "text" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "logo", label: "Logo", type: "image", hint: "PNG with a transparent background works best." },
      { name: "websiteUrl", label: "Website", type: "url", hint: "Starts with https://", narrow: true },
      { ...sortField },
      { name: "description", label: "What they do with us", type: "textarea" },
    ],
  },
  services: {
    key: "services",
    label: "Services",
    singular: "service",
    api: "/admin/services",
    publicPath: (item) => `/about#service-${String(item.slug)}`,
    newLabel: "Add a service",
    intro: "The services the program provides. They appear in “Our services” on the home page and in full on the About page.",
    columns: [
      { key: "photo", label: "", kind: "image" },
      { key: "title", label: "Service", kind: "title" },
      { key: "summary", label: "Summary", kind: "text" },
      { key: "sortOrder", label: "Order", kind: "text" },
    ],
    fields: [
      { name: "title", label: "Name of the service", type: "text", required: true },
      { name: "summary", label: "Short summary", type: "textarea", required: true, hint: "One or two sentences, shown on the home page." },
      { name: "includes", label: "What it includes", type: "textarea", hint: "One item per line, e.g. Water collection." },
      { name: "details", label: "Full explanation", type: "textarea", hint: "Shown on the About page. Leave a blank line between paragraphs." },
      { name: "photo", label: "Photo", type: "image", hint: "A landscape photo of this work." },
      { name: "slug", label: "Web address", type: "text", hint: "Leave empty to make one from the name.", narrow: true },
      { ...sortField },
    ],
  },
};

export function getResource(key: string): ResourceDef | null {
  return (RESOURCES as Record<string, ResourceDef>)[key] ?? null;
}

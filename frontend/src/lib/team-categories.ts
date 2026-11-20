/**
 * The boxes of the organisational chart that people work in, grouped the way the
 * "Our team" section shows them. Keep the keys in step with backend/src/lib/team-categories.ts.
 */
export type TeamCategory =
  | "management-board"
  | "coordinator"
  | "admin-finance"
  | "cashier"
  | "drivers-cleaners"
  | "project-assistants"
  | "civil-engineers"
  | "technical-director"
  | "site-technicians"
  | "plumbers-masons"
  | "field-technician"
  | "supervisors"
  | "extensionists"
  | "dorwasa";

export interface TeamGroup {
  title: string;
  /** One sentence for the Team page, from the programme's description of its structure. */
  about: string;
  categories: { key: TeamCategory; label: string }[];
}

/** In the order of the chart, top to bottom and left to right. */
export const TEAM_GROUPS: TeamGroup[] = [
  {
    title: "Leadership",
    about: "Oversight and strategic direction from the Diocese of Ruhengeri, and coordination of the programme.",
    categories: [
      { key: "management-board", label: "Management Board" },
      { key: "coordinator", label: "PH Coordinator" },
    ],
  },
  {
    title: "Administration and finance",
    about: "Administration, finance and the support services that keep the programme running.",
    categories: [
      { key: "admin-finance", label: "Administrative and Financial Director" },
      { key: "cashier", label: "Cashier" },
      { key: "drivers-cleaners", label: "Driver and cleaners" },
    ],
  },
  {
    title: "Technical team",
    about: "Planning, building and following up the water supply, hygiene and sanitation works.",
    categories: [
      { key: "project-assistants", label: "Technical Project Assistants" },
      { key: "civil-engineers", label: "Civil engineers" },
      { key: "technical-director", label: "Technical Director" },
      { key: "site-technicians", label: "Site technicians" },
      { key: "plumbers-masons", label: "Plumbers and masonry workers" },
      { key: "field-technician", label: "Field technician" },
    ],
  },
  {
    title: "Field team",
    about: "Community mobilisation, field-level implementation, monitoring and follow-up across the areas of intervention.",
    categories: [
      { key: "supervisors", label: "Supervisors" },
      { key: "extensionists", label: "Field extensionists" },
    ],
  },
  {
    title: "DORWASA Ltd.",
    about: "The company the programme set up to manage community water supply services.",
    categories: [{ key: "dorwasa", label: "Managing Director, DORWASA Ltd." }],
  },
];

export const TEAM_CATEGORY_LABEL = Object.fromEntries(
  TEAM_GROUPS.flatMap((g) => g.categories.map((c) => [c.key, c.label])),
) as Record<TeamCategory, string>;

/** Anchor of a category's people on the Team page. */
export const teamAnchor = (key: TeamCategory) => `team-${key}`;

/** Options for the dashboard's select: "Group: box". */
export const TEAM_CATEGORY_OPTIONS = [
  { value: "", label: "Not shown in a group (listed under Other staff)" },
  ...TEAM_GROUPS.flatMap((g) => g.categories.map((c) => ({ value: c.key, label: `${g.title}: ${c.label}` }))),
];

/** Link from anywhere (e.g. the organisational chart) to a category's people on the Team page. */
export const teamHref = (key: TeamCategory) => `/team#${teamAnchor(key)}`;

export interface GroupedTeam<M> {
  id: string;
  title: string;
  about: string;
  size: number;
  parts: { id: string; key: TeamCategory | null; label: string; members: M[] }[];
}

/**
 * The team grouped like the organisational chart, in chart order. Only boxes with people are
 * kept; anyone not placed goes to "Other staff" at the end.
 */
export function groupTeam<M extends { category: string }>(team: M[]): GroupedTeam<M>[] {
  const placed = (m: M) => Object.hasOwn(TEAM_CATEGORY_LABEL, m.category);
  const groups: GroupedTeam<M>[] = TEAM_GROUPS.map((g) => {
    const parts = g.categories
      .map((c) => ({ id: teamAnchor(c.key), key: c.key as TeamCategory | null, label: c.label, members: team.filter((m) => m.category === c.key) }))
      .filter((p) => p.members.length > 0);
    return { id: `team-group-${g.categories[0].key}`, title: g.title, about: g.about, parts, size: parts.reduce((n, p) => n + p.members.length, 0) };
  });
  const others = team.filter((m) => !placed(m));
  groups.push({
    id: "team-group-other",
    title: "Other staff",
    about: "",
    size: others.length,
    parts: [{ id: "team-other", key: null, label: "", members: others }],
  });
  return groups.filter((g) => g.size > 0);
}

/** How many people are in each box (for the organisational chart). */
export function teamCounts(team: { category: string }[]): Partial<Record<TeamCategory, number>> {
  const counts: Partial<Record<TeamCategory, number>> = {};
  for (const m of team) if (Object.hasOwn(TEAM_CATEGORY_LABEL, m.category)) counts[m.category as TeamCategory] = (counts[m.category as TeamCategory] ?? 0) + 1;
  return counts;
}

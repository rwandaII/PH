/**
 * The services the Hydraulic Programme provides: its three intervention domains, from the
 * programme's "Expression of interest for partnership with WaterAid Rwanda" (November 2026).
 * Shown on Home ("Our services") and in full on About.
 *
 * Staff edit them in the dashboard (Services); the site reads them from the API. SERVICES below
 * is only the fallback used if the API cannot be reached.
 */
export interface Service {
  /** Used for the About page anchor: /about#service-<slug> */
  slug: string;
  title: string;
  /** One or two sentences for the Home columns. */
  summary: string;
  /** What the service includes, listed under the summary. */
  includes: string[];
  /** The full explanation on the About page. */
  details: string[];
  photo: string;
}

export const SERVICES: Service[] = [
  {
    slug: "water-supply",
    title: "Water supply",
    summary: "Extraction, collection, treatment, storage and distribution of water to communities, particularly in remote and rural areas, together with rainwater harvesting.",
    includes: ["Water extraction", "Water collection and storage", "Water treatment", "Distribution to communities", "Rainwater harvesting systems"],
    details: [
      "Water supply involves the extraction, collection, treatment, storage and distribution of water to communities and other stakeholders, particularly in remote and rural areas.",
      "It also includes rainwater harvesting: rainwater collection and storage systems, such as plastic water tanks, are installed to improve access to safe and reliable water.",
    ],
    photo: "/photos/field/spring-1.jpg",
  },
  {
    slug: "hygiene-and-sanitation",
    title: "Promotion of hygiene and sanitation",
    summary: "Improved, durable sanitation facilities, proper waste management and good hygiene practices that prevent waterborne and hygiene-related diseases.",
    includes: ["Improved and durable latrines", "Sanitation for schools and health centres", "Waste management and reuse", "Community-led hygiene initiatives"],
    details: [
      "Construction of improved and durable sanitation facilities: building modern, sustainable latrines, particularly in areas with fragile and rocky soils, and supporting vulnerable households and public institutions such as health centres and schools with hand-washing facilities, dustbins, soap and filters for water treatment.",
      "Waste management and reuse: promoting proper waste collection, treatment and disposal, in line with environmental safety standards.",
      "Good hygiene practices and community-led hygiene initiatives: communities adopt the hygiene and sanitation practices the programme promotes, and are encouraged to take their own initiatives in their households and communities.",
    ],
    photo: "/photos/field/training-2.jpg",
  },
  {
    slug: "environmental-protection",
    title: "Environmental protection and climate resilience",
    summary: "Tree planting, nature-based solutions and the protection of water sources, so communities can better withstand droughts, floods and landslides.",
    includes: ["Tree planting and restoration", "Climate change adaptation", "Protection of water resources", "Community awareness"],
    details: [
      "Tree planting and restoration of degraded ecosystems on steep slopes and along water bodies, to reduce soil erosion, landslides and rockfalls.",
      "Nature-based solutions, including agroforestry, soil and water conservation and the restoration of degraded landscapes, the protection of watersheds and water catchment areas, and community awareness of sustainable practices.",
    ],
    photo: "/photos/field/community-meeting-2.jpg",
  },
];

/** A service as the API returns it (lists and paragraphs are stored as plain text). */
export interface ServiceRow {
  id: number;
  title: string;
  slug: string;
  summary: string;
  includes: string;
  details: string;
  photo: string | null;
  sortOrder: number;
}

/** Turn API rows into services; falls back to the built-in list when there are none. */
export function servicesFrom(rows: ServiceRow[]): Service[] {
  if (rows.length === 0) return SERVICES;
  return rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    includes: r.includes.split(/\r?\n/).map((l) => l.trim()).filter(Boolean),
    details: r.details.split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter(Boolean),
    photo: r.photo || "/photos/field/spring-1.jpg",
  }));
}

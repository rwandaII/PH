/**
 * The services the Hydraulic Program provides: its four pillars, written from the program's
 * document "Hydraulic Program of Ruhengeri Diocese in perspective of youth promotion"
 * (Marie Yvonne INGABIRE, PH Coordinator). Shown on Home ("Our services") and in full on About.
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
    summary: "Sufficient, safe water for families in rural and remote areas, with water systems built and run by local young workers.",
    includes: ["Water extraction", "Water collection", "Water treatment", "Water distribution among water users"],
    details: [
      "Supplying sufficient water to the population of Ruhengeri Diocese and beyond is at the heart of the Hydraulic Program, specifically for poor people living in remote areas.",
      "The large and growing youth population in rural areas is an opportunity: the program hires a local, motivated and competent workforce for water extraction, water collection, water treatment and the distribution of water among water users, and young people take part in building the water supply systems.",
    ],
    photo: "/photos/field/spring-1.jpg",
  },
  {
    slug: "hygiene-and-sanitation",
    title: "Hygiene and sanitation",
    summary: "Clubs of Hygiene and Sanitation, toilets and bathrooms built with the community, and better hygiene habits at home and at school.",
    includes: ["Clubs of Hygiene and Sanitation", "Toilets and bathrooms (ATPC)", "Hygiene behaviour change", "Small businesses of hygienic products"],
    details: [
      "The program supports the Rwandan Government's initiative to “reduce the national diseases burden through Community-Based Hygiene Behavior Change and Improved Sanitation”, implemented since 2009.",
      "Young people take part in Clubs of Hygiene and Sanitation and help build toilets and bathrooms under the approach called “Assainissement Total Piloté par la Communauté” (ATPC). With support from the program and its sponsors, they also start initiatives for their own socio-economic development, including small businesses of hygienic products.",
    ],
    photo: "/photos/field/training-2.jpg",
  },
  {
    slug: "capacity-building",
    title: "Capacity building",
    summary: "Workshops, trainings and meetings that help young people and communities understand water, hygiene, sanitation and the environment.",
    includes: ["Workshops and trainings", "Community meetings", "Hygiene promotion at schools", "Awareness on environmental issues"],
    details: [
      "Human capacity building emphasizes the training of young people through awareness raising: they are mobilized in workshops, trainings and meetings on water, hygiene, sanitation and general environmental issues.",
      "Trained young people then promote hygiene and sanitation at schools and beyond, carrying what they learn back to their families and communities.",
    ],
    photo: "/photos/field/tap-explained-2.jpg",
  },
  {
    slug: "environmental-protection",
    title: "Environmental protection",
    summary: "Protecting water sources and hillsides from the effects of climate change, together with young people and students.",
    includes: ["Tree planting near water sources", "Tree planting on steep slopes", "Awareness on climate change", "Environmental campaigns with students"],
    details: [
      "Climate change intensifies the current and future vulnerabilities of young generations. The program involves young people in its environmental protection activities to mitigate the negative effects of climate fluctuations.",
      "To bridge the gap between information, action and behaviour change, young people do more than raise awareness: they plant trees on the buffer zones of water sources and on steep slopes.",
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

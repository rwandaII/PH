/**
 * The site's picture places: page-header sliders (several pictures that fade from one to the
 * next) and single spots. Staff edit them in Dashboard → Pictures & sliders. Keep the keys in
 * step with backend/src/lib/site-images.ts.
 *
 * A place with no pictures shows the programme's logo (PLACEHOLDER) instead, except the News and
 * Gallery headers, which then use the stories' own photos.
 */
export const PLACEHOLDER = "/logo/placeholder.jpg";

export type PlaceKey =
  | "about.header"
  | "about.portrait"
  | "team.header"
  | "projects.header"
  | "news.header"
  | "gallery.header"
  | "partners.header"
  | "contact.header"
  | "certificates.header"
  | "home.services"
  | "home.partners"
  | "home.stories";

export interface Place {
  key: PlaceKey;
  /** Where it is, in words staff know. */
  label: string;
  page: string;
  /** "slider": several pictures that fade from one to the next; "single": one picture. */
  kind: "slider" | "single";
  hint: string;
  /** Public page to look at the result. */
  href: string;
}

export const PLACES: Place[] = [
  { key: "about.header", page: "About", label: "Header slider", kind: "slider", href: "/about", hint: "Wide landscape photos work best. They fade from one to the next at the top of the About page." },
  { key: "about.portrait", page: "About", label: "Portrait in “Who we are”", kind: "single", href: "/about", hint: "A person standing, ideally on a plain or removed background (PNG), stands in front of a blue arch." },
  { key: "projects.header", page: "Projects", label: "Header slider", kind: "slider", href: "/projects", hint: "Photos of the water systems, tanks and works." },
  { key: "news.header", page: "News", label: "Header slider (behind the latest story)", kind: "slider", href: "/news", hint: "Leave empty to use the photos of the latest stories." },
  { key: "team.header", page: "Our team", label: "Header slider", kind: "slider", href: "/team", hint: "Photos of the team at work: trainings, meetings, visits." },
  { key: "gallery.header", page: "Gallery", label: "Header slider", kind: "slider", href: "/gallery", hint: "Leave empty to use photos from the gallery itself." },
  { key: "partners.header", page: "Partners", label: "Header slider", kind: "slider", href: "/partners", hint: "Photos with partners, visitors and communities." },
  { key: "certificates.header", page: "Certificates", label: "Header slider", kind: "slider", href: "/certificates", hint: "Any photos that represent the programme." },
  { key: "contact.header", page: "Contact", label: "Header slider", kind: "slider", href: "/contact", hint: "The office, the team or the area where you work." },
  { key: "home.services", page: "Home", label: "Photo beside “Our services”", kind: "single", href: "/", hint: "A tall or square photo of the work." },
  { key: "home.partners", page: "Home", label: "Photo in the partners section", kind: "single", href: "/", hint: "A photo with partners or visitors." },
  { key: "home.stories", page: "Home", label: "Background of “Our stories”", kind: "single", href: "/", hint: "A wide photo; it is shown tinted blue behind text." },
];

/** A picture as the API returns it. */
export interface SiteImageRow {
  id: number;
  place: string;
  image: string | null;
  caption: string;
  sortOrder: number;
}

/** The pictures of one place, in order (may be empty). */
export function picturesOf(rows: SiteImageRow[], key: PlaceKey): string[] {
  return rows.filter((r) => r.place === key && r.image).map((r) => r.image as string);
}

/** The pictures of a place, or the logo placeholder when it has none. */
export function picturesOr(rows: SiteImageRow[], key: PlaceKey, fallback: string[] = [PLACEHOLDER]): string[] {
  const list = picturesOf(rows, key);
  return list.length > 0 ? list : fallback.length > 0 ? fallback : [PLACEHOLDER];
}

/** The first picture of a single-picture place, or the placeholder. */
export function pictureOf(rows: SiteImageRow[], key: PlaceKey): string {
  return picturesOf(rows, key)[0] ?? PLACEHOLDER;
}

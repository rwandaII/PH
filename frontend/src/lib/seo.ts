import { phoneNumbers } from "./format";
import type { SiteInfo } from "./types";

/**
 * The site's public address, used for links that search engines and social networks read
 * (sitemap, canonical links, share previews, the organisation details below). Set SITE_URL
 * (frontend/.env.local, or the server's environment) to the real address once the site is online.
 */
export const SITE_URL = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const SHARE_IMAGE = "/logo/placeholder.jpg";

const DIOCESE = { name: "Catholic Diocese of Ruhengeri", url: "https://dioceseruhengeri.org" };

/**
 * Structured details about the programme (schema.org NGO + WebSite) that Google and other
 * search engines read to show its name, logo, address, map, phone and email in results.
 */
export function organizationJsonLd(site: SiteInfo, extra: { services: string[]; districts: string[] }) {
  const phones = phoneNumbers(site.phone).map((p) => p.label);
  const sameAs = [site.facebookUrl, site.twitterUrl, site.linkedinUrl, site.mapLink].filter(Boolean);
  const org = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": `${SITE_URL}/#organization`,
    name: site.programName,
    alternateName: ["Programme Hydraulique du Diocèse de Ruhengeri", "Hydraulic Programme of Ruhengeri Diocese", "PH Ruhengeri"],
    url: SITE_URL,
    logo: `${SITE_URL}/logo/ph-logo.png`,
    image: `${SITE_URL}${SHARE_IMAGE}`,
    description: site.heroText || site.tagline,
    slogan: site.tagline || undefined,
    foundingDate: "2007",
    email: site.contactEmail || undefined,
    telephone: phones[0],
    address: {
      "@type": "PostalAddress",
      streetAddress: [site.location, site.address].filter(Boolean).join(", ") || undefined,
      postOfficeBoxNumber: /P\.?\s*O\.?\s*Box\s*(\d+)/i.exec(site.address)?.[1],
      addressLocality: "Musanze",
      addressRegion: "Northern Province",
      addressCountry: "RW",
    },
    geo:
      site.latitude && site.longitude
        ? { "@type": "GeoCoordinates", latitude: Number(site.latitude), longitude: Number(site.longitude) }
        : undefined,
    hasMap: site.mapLink || undefined,
    contactPoint: [
      ...phones.map((telephone) => ({ "@type": "ContactPoint", telephone, contactType: "general enquiries", areaServed: "RW" })),
      ...(site.contactEmail ? [{ "@type": "ContactPoint", email: site.contactEmail, contactType: "general enquiries", areaServed: "RW" }] : []),
    ],
    areaServed: extra.districts.map((d) => ({ "@type": "AdministrativeArea", name: `${d} District, Rwanda` })),
    knowsAbout: extra.services,
    parentOrganization: { "@type": "Organization", ...DIOCESE },
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: site.programName,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
  };
  return [org, website];
}

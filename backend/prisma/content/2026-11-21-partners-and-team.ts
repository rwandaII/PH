/**
 * Partners and the Key technical team, from "Expression of interest for partnership with WaterAid
 * Rwanda" (Table 4: Relevant Organizations and Stakeholders, and Table 2: Key technical team).
 *
 * Partners: the 14 organisations of Table 4, split into international (MISEREOR, MEDICUS MUNDI
 * NAVARRA, MANOS UNIDAS, Società di San Vincenzo di Paoli of Italy) and local partners. Each one gets
 * its collaboration experience and its reference: the organisation's office contacts plus the
 * contact person's name and role. Personal mobile numbers and personal emails are left out on
 * purpose (the site is public). "Government of Rwanda" is removed (not in the table). Logos and
 * websites come from each organisation's own website.
 *
 * Team: the sample profiles are removed and the people of Table 2 are added (Marie Yvonne INGABIRE
 * is updated, keeping her role of PH Coordinator).
 *
 * Safe to run more than once:  npx tsx prisma/content/2026-11-21-partners-and-team.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PartnerRow {
  name: string;
  /** Earlier names of the same partner on the site, so the existing row (and its logo) is reused. */
  aliases?: string[];
  scope: 'international' | 'local';
  place: string;
  badge?: string;
  logo?: string | null;
  websiteUrl?: string;
  description: string;
  contacts: string[];
  people?: string[];
}

const PARTNERS: PartnerRow[] = [
  // International partners, in the order of the document's key-donor sentence.
  {
    name: 'MISEREOR',
    scope: 'international',
    place: 'Aachen, Germany',
    badge: 'Principal donor',
    websiteUrl: 'https://www.misereor.org/',
    description: 'Privileged partner that finances the Hydraulic Program from 2007 up to today.',
    contacts: ['Aachen, Germany', 'Phone: +49 241 4420', 'Email: info@misereor.de'],
    people: ['Jutta Himmelsbach | Coordinator in charge of WASH in East Africa, MISEREOR'],
  },
  {
    name: 'MEDICUS MUNDI NAVARRA',
    aliases: ['Medicus Mundi', 'MEDICUS MUNDI'],
    scope: 'international',
    place: 'Navarra – Aragon – Madrid, Spain',
    badge: 'Key recent donor',
    logo: '/logo/partners/medicus-mundi.png',
    websiteUrl: 'https://www.medicusmundi.es/',
    description:
      'A Spanish partner that supports the strengthening of health systems and primary healthcare. This MM program sparked a partnership with PH within the framework of coordinating their projects in the WASH (EHA) sector. 3 water supply systems were established. One is currently ongoing.',
    contacts: ['Navarra – Aragon, Madrid, Spain', 'Phone: +34 91 395 738', 'Email: nam@medicusmundi.es'],
    people: ['Pablo Carlos'],
  },
  {
    name: 'MANOS UNIDAS',
    aliases: ['Manos Unidas'],
    scope: 'international',
    place: 'Madrid, Spain',
    badge: 'Key recent donor',
    logo: '/logo/partners/manos-unidas-blue.svg',
    websiteUrl: 'https://www.manosunidas.org/',
    description:
      'A partner of the Catholic Church in Spain for aid, promotion and development of the developing countries. The partnership with PH consisted of the financial support it granted for the construction of some WSS (water supply systems), specifically for schools.',
    contacts: ['C/ Barquillo, 38 - 3º, 28004 Madrid, Spain', 'Phone: 900 811 888', 'Email: info@manosunidas.org'],
    people: ['Maria Gonzalez del Valle Chavarri | In charge of projects in Africa centro'],
  },
  {
    name: 'Società di San Vincenzo di Paoli of Italy',
    scope: 'international',
    place: 'Italy',
    logo: '/logo/partners/san-vincenzo-italia.png',
    websiteUrl: 'https://www.sanvincenzoitalia.it/',
    description: 'An Italian partner that supported the construction of the Gashaki water supply system (AEP).',
    contacts: ['Federazione nazionale italiana Società di San Vincenzo de Paoli', 'Phone: +39 06 6796989', 'Email: nazionale@sanvincenzoitalia.it'],
  },

  // Local partners, in the order of Table 4.
  {
    name: 'INES (Institute of Applied Sciences of Ruhengeri)',
    aliases: ['INES-Ruhengeri', 'INES'],
    scope: 'local',
    place: 'Ruhengeri, Rwanda',
    logo: '/logo/partners/ines-ruhengeri.png',
    websiteUrl: 'https://www.ines.ac.rw/',
    description: 'Collaboration in research work and facilitation of microbiological and physicochemical water analysis when necessary.',
    contacts: ['P.O. Box 155, Ruhengeri, Rwanda', 'Email: info@ines.ac.rw'],
    people: ['Dr Bosco Baribeshya | Vice-chancellor of INES'],
  },
  {
    name: 'KCF (Kigali Ceramic Factory)',
    scope: 'local',
    place: 'Kigali, Rwanda',
    description: 'Facilitation in the acquisition of ceramic water filters to purify water intended for beneficiaries.',
    contacts: [],
  },
  {
    name: 'ROTO RWANDA / AQUASAN (Plastic fabrication companies)',
    scope: 'local',
    place: 'Kigali, Rwanda',
    logo: '/logo/partners/roto-rwanda.png',
    websiteUrl: 'https://www.rotorwanda.com/',
    description: 'Facilitation in the acquisition of plastic tanks, HDPE pipes and other accessories used in water supply activities.',
    contacts: ['P.O. Box 6472, Kigali', 'Phone: +250 788 306 502', 'Email: info@rotorwanda.com', 'Musanze: musanze@rotorwanda.com'],
    people: ['Catherine Yandereye'],
  },
  {
    name: 'RCA (Rwanda Cooperative Agency)',
    scope: 'local',
    place: 'Kigali, Rwanda',
    logo: '/logo/partners/rca.png',
    websiteUrl: 'https://www.rca.gov.rw/',
    description:
      'Facilitation in the approval of documents and the granting of legal personality for water supply system (AEP) management cooperatives.',
    contacts: ['Phone: 4163', 'Email: info@rca.gov.rw'],
    people: ['Annonciata Gahongayire'],
  },
  {
    name: 'RURA (Rwanda Utilities Regulatory Authority)',
    scope: 'local',
    place: 'Kigali, Rwanda',
    logo: '/logo/partners/rura.png',
    websiteUrl: 'https://www.rura.rw/',
    description:
      'A public institution whose mission is to regulate public services such as telecommunication networks, electricity, water services, waste management, etc.',
    contacts: ['P.O. Box 7289 Kigali, Rwanda', 'Phone: (+250) 252 584 562', 'Email: info@rura.rw'],
    people: ['Eng. Jacques Nzitonda | S. Division Manager, Water Technical Division'],
  },
  {
    name: 'WASAC (Water and Sanitation Corporation)',
    scope: 'local',
    place: 'Kigali, Rwanda',
    logo: '/logo/partners/wasac.png',
    websiteUrl: 'https://www.wasac.rw/en',
    description: 'A public institution responsible for supervising and ensuring water and sanitation services nationwide.',
    contacts: ['P.O. Box 2331', 'Phone: 2331', 'Email: info@wasac.rw'],
    people: ['Marie Noella Dukuzumukiza'],
  },
  {
    name: 'DORWASA Ltd (Diocese of Ruhengeri Water and Sanitation Company)',
    aliases: ['DORWASA Ltd', 'DORWASA Ltd.'],
    scope: 'local',
    place: 'Ruhengeri, Rwanda',
    description:
      'The Company of Ruhengeri Diocese for Water and Sanitation that provides water services for the water supply systems (AEPs) built by PH; collaboration and facilitation in complying with RURA regulations and other state requirements.',
    contacts: ['P.O. Box 45 Ruhengeri', 'Email: dorwasa01@gmail.com'],
    people: ['Drocelle Mukaneza | Managing director'],
  },
  {
    name: 'DERN (Rural Development program for the Northern region)',
    scope: 'local',
    place: 'Musanze, Rwanda',
    description:
      'DERN is a rural development program for the northern region of Ruhengeri Diocese. The collaboration between the two programs (PH and DERN) is in their community interventions, partly using the same field staff (ADR).',
    contacts: ['P.O. Box 45 Musanze', 'Email: dernord1981@yahoo.fr'],
    people: ['SAMUSONI Sylvestre | Director of agriculture unit'],
  },
  {
    name: 'Diocese of Ruhengeri',
    aliases: ['The Diocese of Ruhengeri'],
    scope: 'local',
    place: 'Ruhengeri, Rwanda',
    websiteUrl: 'https://www.dioceseruhengeri.org/',
    description:
      '(PH is one of the development programs of Ruhengeri Diocese.) The Diocese of Ruhengeri is an entity that closely monitors and guides the activities of the PH.',
    contacts: ['P.O. Box 45 Ruhengeri', 'Email: evecatholicruh@yahoo.fr'],
    people: ['Mgr Gabin BIZIMUNGU | Vicar general, Director of board management'],
  },
  {
    name: 'Local Administrative Authorities (Districts, Sectors, Cells & Villages)',
    scope: 'local',
    place: 'Northern Province, Rwanda',
    description:
      'The Program is a member of the JADF (Joint Action Development Forum) and WASH boards at the District level; these entities approve the establishment of construction projects and also facilitate the mobilization of the target group.',
    contacts: [],
    people: ['Anaclet Habinshuti | JADF Musanze', 'Innocent Nshimiyimana | WATSAN Gakenke'],
  },
];

interface TeamRow {
  name: string;
  slug: string;
  role: string;
  category: string;
  washYears: string;
  expertise: string;
  competence: string;
  education: string;
}

/** Table 2: Key technical team of Hydraulic programme, in the table's order. */
const TEAM: TeamRow[] = [
  { name: 'Marie Yvonne INGABIRE', slug: 'marie-yvonne-ingabire', role: 'PH Coordinator', category: 'coordinator', washYears: '15 years', expertise: 'Civil Engineering', competence: 'Water Resources and Environment Management', education: 'Masters' },
  { name: 'Drocelle MUKANEZA', slug: 'drocelle-mukaneza', role: 'Managing Director, DORWASA Ltd.', category: 'dorwasa', washYears: '18 years', expertise: 'Biodiversity Conservation', competence: 'Natural resources management', education: 'Masters' },
  { name: 'Samson Sylvestre', slug: 'samson-sylvestre', role: 'Rural Development', category: '', washYears: '20 years', expertise: 'Rural Development', competence: 'Rural Engineering', education: 'Bachelors' },
  { name: 'Pascal NIRERE', slug: 'pascal-nirere', role: 'Civil Engineering', category: 'civil-engineers', washYears: '15 years', expertise: 'Civil Engineering', competence: 'Construction works', education: 'Bachelors' },
  { name: 'Fidele RWANDANGA NIYORUKUNDO', slug: 'fidele-rwandanga-niyorukundo', role: 'Architecture', category: '', washYears: '3 years', expertise: 'Architecture', competence: 'Building architecture', education: 'Masters' },
  { name: 'Samson NKUNZWENIMANA', slug: 'samson-nkunzwenimana', role: 'Accountant', category: 'admin-finance', washYears: '21 years', expertise: 'Accountant', competence: 'Financial management and accounting', education: 'Bachelors' },
  { name: 'Cyprien NSHIIYIMANA', slug: 'cyprien-nshiiyimana', role: 'Civil Engineering', category: 'plumbers-masons', washYears: '3 years', expertise: 'Civil Engineering', competence: 'Plumbing', education: 'A1' },
  { name: 'Pascal MUCUMBITSI', slug: 'pascal-mucumbitsi', role: 'Construction', category: 'field-technician', washYears: '40 years', expertise: 'Construction', competence: 'Field technician', education: 'A2' },
  { name: 'Joseph UWIZEYE', slug: 'joseph-uwizeye', role: 'Rural development', category: 'field-technician', washYears: '20 years', expertise: 'Rural development', competence: 'Field technician / supervision', education: 'Bachelors' },
  { name: 'Claude NTIRENGANYA', slug: 'claude-ntirenganya', role: 'Agri-business', category: 'supervisors', washYears: '15 years', expertise: 'Agri-business', competence: 'Saving and lending / supervision', education: 'A1' },
];

async function main() {
  // Partners
  const existing = await prisma.partner.findMany();
  const keep = new Set<number>();
  for (const [i, p] of PARTNERS.entries()) {
    const names = [p.name, ...(p.aliases ?? [])].map((n) => n.toLowerCase());
    const row = existing.find((e) => names.includes(e.name.toLowerCase()));
    const data = {
      name: p.name,
      scope: p.scope,
      place: p.place,
      badge: p.badge ?? '',
      websiteUrl: p.websiteUrl ?? row?.websiteUrl ?? '',
      description: p.description,
      contacts: p.contacts.join('\n'),
      contactPeople: (p.people ?? []).join('\n'),
      sortOrder: i + 1,
      // Keep a logo uploaded in the dashboard (MISEREOR, Diocese); otherwise use the one found.
      logo: row?.logo || p.logo || null,
    };
    const saved = row ? await prisma.partner.update({ where: { id: row.id }, data }) : await prisma.partner.create({ data });
    keep.add(saved.id);
  }
  const removed = await prisma.partner.deleteMany({ where: { name: 'Government of Rwanda' } });
  console.log(`Partners: ${keep.size} saved, ${removed.count} removed.`);

  // Team: remove the sample profiles, then add or update the key technical team.
  const samples = await prisma.teamMember.deleteMany({ where: { role: { contains: '(sample)' } } });
  for (const [i, t] of TEAM.entries()) {
    const data = { ...t, sortOrder: i + 1 };
    const row = await prisma.teamMember.findFirst({ where: { OR: [{ slug: t.slug }, { name: t.name }] } });
    if (row) await prisma.teamMember.update({ where: { id: row.id }, data: { ...data, bio: row.bio.includes('sample profile') ? '' : row.bio } });
    else await prisma.teamMember.create({ data: { ...data, bio: '' } });
  }
  console.log(`Team: ${samples.count} sample profiles removed, ${TEAM.length} people saved.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

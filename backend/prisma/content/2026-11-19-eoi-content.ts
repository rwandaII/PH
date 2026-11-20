/**
 * Content from "Expression of interest for partnership with WaterAid Rwanda"
 * (Hydraulic Programme of Ruhengeri Diocese, November 2026).
 *
 * Replaces the About text, vision, mission, contact details, services and the matching projects'
 * text with the document's, and adds the RGB certificate from its annex. Photos are not changed:
 * services and projects keep their cover photos and the photos inside their text.
 *
 * Safe to run more than once:  npx tsx prisma/content/2026-11-19-eoi-content.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SOURCE =
  '<p><em>Source: “Expression of interest for partnership with WaterAid Rwanda”, Hydraulic Programme of Ruhengeri Diocese, November 2026.</em></p>';

const AREA = 'Musanze, Gakenke, Burera and Nyabihu districts';

const site = {
  heroText:
    'Operating since 2007, the Hydraulic Programme of the Catholic Diocese of Ruhengeri supplies potable and sufficient water and promotes hygiene and sanitation, especially for people in the most remote areas.',
  aboutText: [
    'Access to safe drinking water and sanitation remains one of the major challenges for some regions in Rwanda, and more specifically in the northern regions of the country. Inadequate water supply, poor hygiene practices and insufficient sanitation facilities significantly affect the health, food security and socio-economic development of rural communities.',
    'Fully aware of these challenges, the Catholic Diocese of Ruhengeri initiated the Hydraulic Programme as one of its development programmes, to seek sustainable solutions that improve access to safe drinking water, hygiene and sanitation for the communities it serves.',
    'Operating since 2007, the programme aims to supply beneficiaries with potable and sufficient water, and to promote hygiene and sanitation. Its main purpose is to support the Rwandan Government’s efforts, which cannot meet all the needs of the people, especially those in the most remote areas.',
  ].join('\n\n'),
  vision:
    'To create favourable living conditions by providing, equitably and sustainably, infrastructures that allow people to access safe water, hygiene and sanitation, especially in rural areas.',
  mission: 'To improve the water supply systems, and to promote hygiene and sanitation in rural areas.',
  generalObjective:
    'To contribute to improving the socio-economic conditions and climate resilience of the target population through sustainable water resource management, the promotion of hygiene and sanitation, and environmental protection.',
  specificObjectives: [
    'To improve water access, through groundwater extraction and rainwater harvesting, for people experiencing water scarcity.',
    'To promote the sustainable management and efficient use of water resources, while strengthening community ownership and responsibility for water supply systems.',
    'To strengthen hygiene and sanitation initiatives and promote good hygiene practices among beneficiary households.',
    'To strengthen the climate resilience of beneficiary communities through climate risk anticipation, mitigation and management.',
  ].join('\n'),
  governanceText: [
    'The Hydraulic Programme of Ruhengeri Diocese is a programme specialised in the WASH domain (water, sanitation and hygiene). It operates under the legal personality N°396/08 of 5 June 1962 of Ruhengeri Diocese, rather than as an independent legal entity.',
    'The programme gets its legal right from Ruhengeri Diocese, which is recognised under Rwandan law as a religious-based organisation. As one of the Diocese’s development programmes, it focuses on water supply, integrated water resources management, the promotion of hygiene and sanitation, climate change resilience and environmental protection across the Northern and Eastern provinces.',
    'Working with different partners (donors, non-governmental and international organisations, and local actors), the programme is classified as a local, non-governmental, non-profit development actor operating under Ruhengeri Diocese. It relies on financial support from various donors and development partners to implement its activities and address the needs of the communities it serves.',
    'The programme operates under the development department of the Catholic Diocese of Ruhengeri and is subject to the overall institutional oversight and strategic direction of the Diocese. While remaining accountable to the diocesan authorities, it has operational and managerial autonomy in the planning, coordination and implementation of its activities, so it can respond effectively to the needs of the communities it serves.',
    'The programme has a dedicated team of six permanent staff members responsible for programme coordination, technical implementation, administration and management. They are supported by two field supervisors and ten field extensionists, who facilitate community mobilisation, field-level implementation, and the monitoring and follow-up of activities across the areas of intervention.',
    'To strengthen its institutional and operational framework and meet statutory and regulatory requirements, the programme established DORWASA Ltd., a legally registered company that supports the management, sustainability and professionalisation of community-based water supply services for the water infrastructures it has built. The Hydraulic Programme functions as a diocesan development programme, while DORWASA Ltd. operates as a legally registered associated company with its own mandate and responsibilities.',
    'This dual arrangement lets the programme pursue its development and community-based work, while supporting the sustainable, professional and legally compliant installation of water infrastructures and management of water supply services.',
  ].join('\n\n'),
  areasText: [
    'Despite progress in several areas of life, including economic dynamism, inequalities persist between urban and rural living conditions. Some rural areas still lack basic infrastructure, including potable water and improved hygiene and sanitation. The Hydraulic Programme therefore works mainly in the rural areas of north-western Rwanda, where most people live from farming and livestock, with low household incomes. They rely on subsistence farming that is severely affected by climate variability, which affects their health and general well-being.',
    'Most of the intervention zone is mountainous, and its altitude gives it a temperate climate. Despite the relief, it is one of the most densely populated zones in the country, with 503 inhabitants per km² (National Institute of Statistics of Rwanda, Fifth Rwanda Population and Housing Census, Main Indicators Report, February 2023). This high density puts pressure on land, infrastructure and natural resources, including water, while a large part of the population still depends on subsistence farming in harsh climate conditions. Recently, the area has faced erratic rainfall, floods, landslides and prolonged droughts, which have affected agriculture, WASH infrastructure and other livelihoods.',
    'The programme is not limited to these areas: it is flexible and willing to extend its work to any part of the country, according to identified needs and available resources.',
  ].join('\n\n'),
  coreDistricts: 'Musanze, Gakenke, Burera, Nyabihu',
  otherDistricts: 'Gasabo, Ruhango',
  contactEmail: 'ph.ruhengeri@gmail.com',
  phone: '+250 788 742 632 / +250 788 621 192',
  address: 'P.O. Box 45 Ruhengeri, Rwanda',
};

/** The three intervention domains. Slugs and photos stay as they were. */
const services = [
  {
    slug: 'water-supply',
    title: 'Water supply',
    summary:
      'Extraction, collection, treatment, storage and distribution of water to communities, particularly in remote and rural areas, together with rainwater harvesting.',
    includes: 'Water extraction\nWater collection and storage\nWater treatment\nDistribution to communities\nRainwater harvesting systems',
    details: [
      'Water supply involves the extraction, collection, treatment, storage and distribution of water to communities and other stakeholders, particularly in remote and rural areas.',
      'It also includes rainwater harvesting: rainwater collection and storage systems, such as plastic water tanks, are installed to improve access to safe and reliable water.',
    ].join('\n\n'),
    sortOrder: 1,
  },
  {
    slug: 'hygiene-and-sanitation',
    title: 'Promotion of hygiene and sanitation',
    summary:
      'Improved, durable sanitation facilities, proper waste management and good hygiene practices that prevent waterborne and hygiene-related diseases.',
    includes: 'Improved and durable latrines\nSanitation for schools and health centres\nWaste management and reuse\nCommunity-led hygiene initiatives',
    details: [
      'Construction of improved and durable sanitation facilities: building modern, sustainable latrines, particularly in areas with fragile and rocky soils, and supporting vulnerable households and public institutions such as health centres and schools to improve their sanitation facilities, with hand-washing facilities, dustbins, soap and filters for water treatment.',
      'Waste management and reuse: promoting proper waste collection, treatment and disposal, in line with environmental safety standards.',
      'Good hygiene practices and community-led hygiene initiatives: beneficiary communities adopt the hygiene and sanitation practices promoted by the programme to improve household cleanliness and living conditions and to prevent waterborne and hygiene-related diseases. They are also encouraged to take their own initiatives to promote hygiene and sanitation in their households and communities.',
    ].join('\n\n'),
    sortOrder: 2,
  },
  {
    slug: 'environmental-protection',
    title: 'Environmental protection and climate resilience',
    summary:
      'Tree planting, nature-based solutions and the protection of water sources, so communities can better withstand droughts, floods and landslides.',
    includes: 'Tree planting and restoration\nClimate change adaptation\nProtection of water resources\nCommunity awareness',
    details: [
      'Tree planting and restoration of degraded ecosystems: planting trees on steep slopes and along water bodies (riparian buffer zones) to reduce soil erosion, landslides and rockfalls, which can destroy crops, damage infrastructure and reduce agricultural productivity.',
      'Climate change adaptation and resilience: promoting nature-based solutions, including agroforestry, soil and water conservation and the restoration of degraded landscapes, to strengthen community resilience to prolonged droughts, irregular rainfall, floods and extreme weather events.',
      'Protection of water resources: promoting the conservation of watersheds, riverbanks and other water catchment areas to safeguard water sources, improve water availability and ensure the long-term sustainability of water supply systems.',
      'Community awareness and participation: raising awareness and mobilising communities to adopt environmentally sustainable practices that contribute to biodiversity conservation, climate change adaptation and the sustainable management of natural resources.',
    ].join('\n\n'),
    sortOrder: 3,
  },
];

/** New text for the matching projects. Their photos are kept. */
const projects: { slug: string; title: string; summary: string; html: string }[] = [
  {
    slug: 'water-supply-systems',
    title: 'Water supply',
    summary:
      'Water extraction, collection, treatment, storage and distribution for communities in remote and rural areas, and rainwater harvesting with storage tanks.',
    html: `<p>The Hydraulic Programme improves water access for people experiencing water scarcity, through groundwater extraction and rainwater harvesting.</p>
<p>Its water supply work covers the extraction, collection, treatment, storage and distribution of water to communities and other stakeholders, particularly in remote and rural areas. It also includes rainwater harvesting: rainwater collection and storage systems, such as plastic water tanks, are installed to improve access to safe and reliable water.</p>
<p>The programme promotes the sustainable management and efficient use of water resources, and strengthens community ownership of, and responsibility for, the water supply systems. DORWASA Ltd., a company set up by the programme, supports the management, sustainability and professionalisation of community-based water supply services for the infrastructures it has built.</p>`,
  },
  {
    slug: 'hygiene-and-sanitation-promotion-atpc',
    title: 'Promotion of hygiene and sanitation',
    summary:
      'Modern, durable latrines, sanitation support for schools and health centres, waste management and community-led hygiene initiatives.',
    html: `<p>The programme strengthens hygiene and sanitation initiatives and promotes good hygiene practices among beneficiary households. Its main activities are:</p>
<ul>
<li><strong>Improved and durable sanitation facilities:</strong> building modern, sustainable latrines, particularly in areas with fragile and rocky soils, and supporting vulnerable households and public institutions such as health centres and schools with hand-washing facilities, dustbins, soap and filters for water treatment.</li>
<li><strong>Waste management and reuse:</strong> promoting proper waste collection, treatment and disposal, in line with environmental safety standards.</li>
<li><strong>Good hygiene practices and community-led initiatives:</strong> communities adopt the hygiene and sanitation practices the programme promotes, to improve household cleanliness and living conditions and to prevent waterborne and hygiene-related diseases, and are encouraged to start their own initiatives in their households and communities.</li>
</ul>`,
  },
  {
    slug: 'environmental-protection',
    title: 'Environmental protection and climate resilience',
    summary:
      'Tree planting on steep slopes and along water bodies, nature-based solutions and the protection of water sources, to strengthen climate resilience.',
    html: `<p>The programme strengthens the climate resilience of beneficiary communities through climate risk anticipation, mitigation and management. Its main activities are:</p>
<ul>
<li><strong>Tree planting and restoration of degraded ecosystems:</strong> planting trees on steep slopes and along water bodies (riparian buffer zones) to reduce soil erosion, landslides and rockfalls.</li>
<li><strong>Climate change adaptation and resilience:</strong> promoting nature-based solutions, including agroforestry, soil and water conservation and the restoration of degraded landscapes, against prolonged droughts, irregular rainfall, floods and extreme weather.</li>
<li><strong>Protection of water resources:</strong> conserving watersheds, riverbanks and other water catchment areas to safeguard water sources and keep water supply systems sustainable.</li>
<li><strong>Community awareness and participation:</strong> mobilising communities to adopt environmentally sustainable practices for biodiversity conservation, climate change adaptation and the sustainable management of natural resources.</li>
</ul>`,
  },
];

const certificate = {
  title: 'Certificate of Compliance',
  kind: 'certificate' as const,
  issuer: 'Rwanda Governance Board (RGB)',
  issuedOn: new Date('2014-01-07T00:00:00Z'),
  description:
    'Certifies that the Catholic Diocese of Ruhengeri, under which the Hydraulic Programme operates, is a religious-based organisation legally operating in Rwanda, granted legal personality n°396/08 of 5 June 1962, and that it has fulfilled all requirements for compliance with Law n°06/2012 of 17/02/2012 governing the organisation and functioning of national non-governmental organisations. Done at Kigali on 7 January 2014 and signed by Professor SHYAKA Anastase, Chief Executive Officer.',
  image: '/certificates/rgb-certificate-of-compliance-2014.png',
  sortOrder: 1,
  isPublished: true,
};

/** Keeps the photos already in a project's text, then the new text, then the source line. */
function withPhotos(oldHtml: string, newHtml: string): string {
  const photos = oldHtml.match(/<img[^>]*>/g) ?? [];
  return `${newHtml}\n${photos.join('')}\n${SOURCE}`;
}

async function main() {
  await prisma.siteInfo.upsert({ where: { id: 1 }, update: site, create: { id: 1, ...site } });

  for (const s of services) {
    const { slug, ...data } = s;
    await prisma.service.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  }
  // Not one of the document's intervention domains (youth capacity building stays as a project).
  await prisma.service.deleteMany({ where: { slug: 'capacity-building' } });

  for (const p of projects) {
    const existing = await prisma.project.findUnique({ where: { slug: p.slug } });
    if (!existing) {
      console.warn(`Project ${p.slug} not found, skipped`);
      continue;
    }
    // Only the <img> tags are taken from the old text, so running again gives the same result.
    await prisma.project.update({
      where: { id: existing.id },
      data: { title: p.title, summary: p.summary, location: AREA, content: withPhotos(existing.content, p.html) },
    });
  }

  const cert = await prisma.certificate.findFirst({ where: { image: certificate.image } });
  if (cert) await prisma.certificate.update({ where: { id: cert.id }, data: certificate });
  else await prisma.certificate.create({ data: certificate });

  console.log('Content updated from the Expression of Interest document.');
}

main().finally(() => prisma.$disconnect());

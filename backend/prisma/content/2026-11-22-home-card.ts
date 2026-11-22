/**
 * Fills the home page card beside the introduction (asked for on 2026-11-22). Until now it
 * always showed the latest news story; it now has its own text, edited in Dashboard → Home page
 * card. Keeps the photo it showed before. Safe to run again.
 *   npx tsx prisma/content/2026-11-22-home-card.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const card = {
    featureImage: '/photos/field/school-welcome-2.jpg',
    featureTitle: 'Hydraulic Program of Ruhengeri Diocese in perspective of youth promotion',
    featureText:
      '18 November 2026. How the Hydraulic Program of Ruhengeri Diocese involves youth in capacity building, water supply, hygiene and sanitation, and environmental protection.',
    featureButton: 'Read more',
    featureLink: '/news/hydraulic-program-of-ruhengeri-diocese-in-perspective-of-youth-promotion',
  };
  await prisma.siteInfo.upsert({ where: { id: 1 }, update: card, create: { id: 1, ...card } });
  console.log('Home page card filled with the youth promotion story');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

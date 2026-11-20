/**
 * The programme has no real staff photos yet, so the stand-in portrait used for the sample
 * profiles is replaced by the PH logo: team members with that photo get none (their cards show
 * the logo), and the About portrait becomes the PH emblem. Real photos added later in the
 * dashboard are never touched. Safe to run again.
 *
 *   npx tsx prisma/content/2026-11-19-logo-instead-of-sample-photos.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SAMPLE = '/photos/portrait-cutout.png';

async function main() {
  const team = await prisma.teamMember.updateMany({ where: { photo: SAMPLE }, data: { photo: null } });
  const portrait = await prisma.siteImage.updateMany({ where: { place: 'about.portrait', image: SAMPLE }, data: { image: '/logo/ph-logo.png' } });
  console.log(`Team members now showing the logo: ${team.count}; About portrait replaced: ${portrait.count}`);
}

main().finally(() => prisma.$disconnect());

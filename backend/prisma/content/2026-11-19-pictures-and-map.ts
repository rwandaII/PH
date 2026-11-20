/**
 * Fills the picture places with the photos the site already used, so nothing changes until staff
 * edit them in Dashboard → Pictures & sliders, and saves the office location for the Contact page.
 * Places that already have pictures are left alone, so it is safe to run again.
 *
 *   npx tsx prisma/content/2026-11-19-pictures-and-map.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const f = (name: string) => `/photos/field/${name}.jpg`;

const PICTURES: Record<string, string[]> = {
  'about.header': [f('diocese-offices'), f('school-welcome-2'), f('stone-tank-2'), f('community-meeting-2')],
  'about.portrait': ['/photos/portrait-cutout.png'],
  'team.header': [f('training-1'), f('hygiene-workshop'), f('community-meeting-1'), f('school-tap-visit-1')],
  'projects.header': [f('stone-tank-1'), f('rainwater-tanks'), f('spring-2'), f('school-dish-rack')],
  'partners.header': [f('visitor-at-tap'), f('school-welcome-1'), f('rainwater-group'), f('school-tap-visit-2')],
  'contact.header': [f('diocese-offices'), f('tap-explained-1'), f('community-meeting-3')],
  'certificates.header': [f('diocese-offices'), f('training-2'), f('school-welcome-2')],
  'home.services': [f('rainwater-group')],
  'home.partners': [f('school-welcome-1')],
  'home.stories': [f('visitor-at-tap')],
  // news.header and gallery.header start empty: those headers use the stories' own photos.
};

const LOCATION = {
  location: 'FJWG+9XF, Ave Mikeno, Musanze',
  mapLink: 'https://maps.app.goo.gl/ts4r819SnV5ygisv5',
  latitude: '-1.503174',
  longitude: '29.629026',
  streetViewUrl:
    'https://www.google.com/maps/embed?pb=!4v1795085084410!6m8!1m7!1sCh_aJ9oZAi6w8nzgnwciPg!2m2!1d-1.503174320948636!2d29.62902601280442!3f17.564261549790558!4f-11.462150104561587!5f0.7820865974627469',
};

async function main() {
  for (const [place, images] of Object.entries(PICTURES)) {
    if ((await prisma.siteImage.count({ where: { place } })) > 0) continue;
    await prisma.siteImage.createMany({ data: images.map((image, i) => ({ place, image, sortOrder: i + 1 })) });
    console.log(`${place}: ${images.length} pictures`);
  }
  const site = await prisma.siteInfo.findUnique({ where: { id: 1 } });
  if (site && !site.latitude) await prisma.siteInfo.update({ where: { id: 1 }, data: LOCATION });
  console.log('Office location saved.');
}

main().finally(() => prisma.$disconnect());

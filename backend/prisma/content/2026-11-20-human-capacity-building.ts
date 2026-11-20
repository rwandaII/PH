/**
 * Renames "Youth capacity building" to "Human capacity building" (asked for on 2026-11-19):
 * the project's title, text and web address (/projects/human-capacity-building), and the same
 * words in news stories and team members' expertise. Only those exact words change, so it is
 * safe to run again.   npx tsx prisma/content/2026-11-20-human-capacity-building.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const rename = (text: string) =>
  text.replaceAll('Youth capacity building', 'Human capacity building').replaceAll('youth capacity building', 'human capacity building');

/** The changed fields of a row, or null when none of them mention it. */
function changes<T, K extends keyof T>(row: T, fields: K[]) {
  const data: Partial<Record<K, string>> = {};
  for (const f of fields) {
    const value = row[f];
    if (typeof value === 'string' && rename(value) !== value) data[f] = rename(value);
  }
  return Object.keys(data).length ? data : null;
}

async function main() {
  const project = await prisma.project.findUnique({ where: { slug: 'youth-capacity-building' } });
  if (project) {
    const taken = await prisma.project.findUnique({ where: { slug: 'human-capacity-building' } });
    if (taken) {
      console.log('Project address left as is: /projects/human-capacity-building is already used');
    } else {
      await prisma.project.update({ where: { id: project.id }, data: { slug: 'human-capacity-building' } });
      console.log('Project address -> /projects/human-capacity-building');
    }
  }

  for (const p of await prisma.project.findMany()) {
    const data = changes(p, ['title', 'summary', 'content']);
    if (data) await prisma.project.update({ where: { id: p.id }, data });
    if (data) console.log(`Project: ${p.title}`);
  }
  for (const n of await prisma.news.findMany()) {
    const data = changes(n, ['title', 'excerpt', 'content']);
    if (data) await prisma.news.update({ where: { id: n.id }, data });
    if (data) console.log(`News: ${n.title}`);
  }
  for (const m of await prisma.teamMember.findMany()) {
    const data = changes(m, ['role', 'bio', 'expertise']);
    if (data) await prisma.teamMember.update({ where: { id: m.id }, data });
    if (data) console.log(`Team member: ${m.name}`);
  }
}

main().finally(() => prisma.$disconnect());

/**
 * Places the current team members in the organisational chart, from their roles.
 * Only members who are not placed yet are changed, so it is safe to run again and never undoes
 * a choice made in the dashboard.   npx tsx prisma/content/2026-11-19-team-categories.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** First matching rule wins. */
const RULES: [RegExp, string][] = [
  [/coordinator/i, 'coordinator'],
  [/managing director|dorwasa/i, 'dorwasa'],
  [/technical director/i, 'technical-director'],
  [/financ|accountant|logistic|administrat/i, 'admin-finance'],
  [/cashier/i, 'cashier'],
  [/driver|cleaner/i, 'drivers-cleaners'],
  [/engineer/i, 'civil-engineers'],
  [/field technician/i, 'field-technician'],
  [/site technician/i, 'site-technicians'],
  [/plumber|mason/i, 'plumbers-masons'],
  [/supervisor/i, 'supervisors'],
  [/extensionist|mobiliser|mobilizer/i, 'extensionists'],
  [/officer|assistant/i, 'project-assistants'],
];

async function main() {
  const members = await prisma.teamMember.findMany({ where: { category: '' } });
  for (const m of members) {
    const hit = RULES.find(([re]) => re.test(m.role));
    if (!hit) {
      console.log(`Not placed: ${m.name} (${m.role})`);
      continue;
    }
    await prisma.teamMember.update({ where: { id: m.id }, data: { category: hit[1] } });
    console.log(`${m.name} (${m.role}) -> ${hit[1]}`);
  }
}

main().finally(() => prisma.$disconnect());

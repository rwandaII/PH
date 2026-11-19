/**
 * Creates the first admin account and the site_info row.
 * Usage: npm run db:seed   (reads ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME from .env)
 * Safe to run more than once: an existing admin with that email is left untouched.
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || 'Administrator';
  if (!email || !password) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env before seeding');
  }
  if (password.length < 8) throw new Error('ADMIN_PASSWORD must be at least 8 characters');

  await prisma.siteInfo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      programName: 'Hydraulic Program',
      tagline: 'Clean, safe water for every community',
      heroText:
        'We design, build and maintain water systems that bring safe water to the communities that need it most.',
    },
  });

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin ${email} already exists — not changed.`);
  } else {
    await prisma.admin.create({
      data: { email, name, passwordHash: await bcrypt.hash(password, 12) },
    });
    console.log(`Created admin ${email}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

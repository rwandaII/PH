import bcrypt from 'bcryptjs';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { prisma } from '../src/db.js';

export const app = createApp();
export { prisma };

export const ADMIN = { name: 'Test Admin', email: 'admin@test.local', password: 'correct-horse-1' };

/** Empties every table. */
export async function resetDb() {
  await prisma.$transaction([
    prisma.newsComment.deleteMany(),
    prisma.pageView.deleteMany(),
    prisma.service.deleteMany(),
    prisma.certificate.deleteMany(),
    prisma.testimonial.deleteMany(),
    prisma.siteImage.deleteMany(),
    prisma.contactMessage.deleteMany(),
    prisma.news.deleteMany(),
    prisma.project.deleteMany(),
    prisma.teamMember.deleteMany(),
    prisma.partner.deleteMany(),
    prisma.siteInfo.deleteMany(),
    prisma.admin.deleteMany(),
  ]);
}

export async function createAdmin(over: Partial<typeof ADMIN> = {}) {
  const a = { ...ADMIN, ...over };
  return prisma.admin.create({
    data: { name: a.name, email: a.email, passwordHash: await bcrypt.hash(a.password, 4) },
  });
}

/** A supertest agent that is logged in (it keeps the session cookie). */
export async function loggedInAgent(email = ADMIN.email, password = ADMIN.password) {
  const agent = request.agent(app);
  const res = await agent.post('/api/auth/login').send({ email, password });
  if (res.status !== 200) throw new Error(`login failed: ${res.status} ${JSON.stringify(res.body)}`);
  return agent;
}

/** A valid 1x1 PNG, for upload tests. */
export const PNG = Buffer.from(
  '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d4944415478da63f8cfc0f01f0005000201ef6f5e650000000049454e44ae426082',
  'hex',
);

import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth } from '../lib/auth.js';
import { optionalUrl } from '../lib/crud.js';
import { kigaliDay, lastDays } from '../lib/analytics.js';
import { HttpError } from '../lib/errors.js';
import { newsRouter, partnersRouter, projectsRouter, servicesRouter, teamRouter } from './resources.js';

export const adminRouter = Router();
adminRouter.use(requireAuth);

adminRouter.use('/news', newsRouter);
adminRouter.use('/projects', projectsRouter);
adminRouter.use('/team', teamRouter);
adminRouter.use('/partners', partnersRouter);
adminRouter.use('/services', servicesRouter);

/* ---------- Dashboard overview ---------- */

adminRouter.get('/stats', async (_req, res) => {
  const [news, projects, team, partners, unreadMessages, pendingComments, services] = await Promise.all([
    prisma.news.count(),
    prisma.project.count(),
    prisma.teamMember.count(),
    prisma.partner.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.newsComment.count({ where: { isApproved: false } }),
    prisma.service.count(),
  ]);
  res.json({ news, projects, team, partners, unreadMessages, pendingComments, services });
});

/* ---------- Site information (single row) ---------- */

const text = (max: number) => z.string().trim().max(max).default('');
const siteSchema = z.object({
  programName: z.string().trim().min(1, 'Program name is required').max(160),
  tagline: text(255),
  heroText: text(5000),
  mission: text(5000),
  vision: text(5000),
  aboutText: text(50000),
  contactEmail: z.union([z.literal(''), z.string().trim().email().max(190)]).default(''),
  phone: text(60),
  address: text(255),
  facebookUrl: optionalUrl,
  twitterUrl: optionalUrl,
  linkedinUrl: optionalUrl,
});

adminRouter.get('/site', async (_req, res) => {
  res.json(await prisma.siteInfo.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }));
});

adminRouter.put('/site', async (req, res) => {
  const data = siteSchema.parse(req.body ?? {});
  res.json(
    await prisma.siteInfo.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } }),
  );
});

/* ---------- Statistics: visitors, comments, messages and content ---------- */

adminRouter.get('/analytics', async (_req, res) => {
  const days = lastDays(30);
  const from = days[0];
  const today = kigaliDay();
  const rows = await prisma.$queryRaw<{ day: string; views: bigint; visitors: bigint }[]>`
    SELECT day, COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors
    FROM page_views WHERE day >= ${from} GROUP BY day`;
  const byDay = new Map(rows.map((r) => [r.day, { views: Number(r.views), visitors: Number(r.visitors) }]));
  const daily = days.map((day) => ({ day, ...(byDay.get(day) ?? { views: 0, visitors: 0 }) }));
  const sum = (list: typeof daily, key: 'views' | 'visitors') => list.reduce((n, d) => n + d[key], 0);

  const [topPages, comments, pendingComments, latestComments, messages, unreadMessages, latestMessages, news, projects, team, partners, services] =
    await Promise.all([
      prisma.pageView.groupBy({ by: ['path'], where: { day: { gte: from } }, _count: { _all: true }, orderBy: { _count: { path: 'desc' } }, take: 8 }),
      prisma.newsComment.count(),
      prisma.newsComment.count({ where: { isApproved: false } }),
      prisma.newsComment.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { news: { select: { title: true, slug: true } } } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 4, select: { id: true, name: true, subject: true, createdAt: true, isRead: true } }),
      prisma.news.count({ where: { isPublished: true } }),
      prisma.project.count({ where: { isPublished: true } }),
      prisma.teamMember.count(),
      prisma.partner.count(),
      prisma.service.count(),
    ]);

  res.json({
    today: { day: today, ...(byDay.get(today) ?? { views: 0, visitors: 0 }) },
    last7: { views: sum(daily.slice(-7), 'views'), visitors: sum(daily.slice(-7), 'visitors') },
    last30: { views: sum(daily, 'views'), visitors: sum(daily, 'visitors') },
    daily,
    topPages: topPages.map((p) => ({ path: p.path, views: p._count._all })),
    comments: { total: comments, pending: pendingComments, latest: latestComments },
    messages: { total: messages, unread: unreadMessages, latest: latestMessages },
    content: { news, projects, team, partners, services },
  });
});

/* ---------- Comments on news ---------- */

adminRouter.get('/comments', async (_req, res) => {
  res.json(
    await prisma.newsComment.findMany({
      orderBy: [{ isApproved: 'asc' }, { createdAt: 'desc' }],
      include: { news: { select: { title: true, slug: true } } },
    }),
  );
});

const commentId = (raw: string) => {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) throw new HttpError(400, 'Invalid id');
  return id;
};

adminRouter.patch('/comments/:id', async (req, res) => {
  const id = commentId(req.params.id);
  const { isApproved } = z.object({ isApproved: z.boolean() }).parse(req.body ?? {});
  const found = await prisma.newsComment.findUnique({ where: { id } });
  if (!found) throw new HttpError(404, 'Not found');
  res.json(await prisma.newsComment.update({ where: { id }, data: { isApproved } }));
});

adminRouter.delete('/comments/:id', async (req, res) => {
  const id = commentId(req.params.id);
  const found = await prisma.newsComment.findUnique({ where: { id } });
  if (!found) throw new HttpError(404, 'Not found');
  await prisma.newsComment.delete({ where: { id } });
  res.status(204).end();
});

/* ---------- Contact messages ---------- */

adminRouter.get('/messages', async (_req, res) => {
  res.json(await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } }));
});

adminRouter.patch('/messages/:id', async (req, res) => {
  const { isRead } = z.object({ isRead: z.boolean() }).parse(req.body ?? {});
  res.json(
    await prisma.contactMessage.update({ where: { id: Number(req.params.id) }, data: { isRead } }),
  );
});

adminRouter.delete('/messages/:id', async (req, res) => {
  await prisma.contactMessage.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
});

/* ---------- Admin accounts ---------- */

const adminSelect = { id: true, name: true, email: true, createdAt: true } as const;

adminRouter.get('/admins', async (_req, res) => {
  res.json(await prisma.admin.findMany({ select: adminSelect, orderBy: { createdAt: 'asc' } }));
});

adminRouter.post('/admins', async (req, res) => {
  const data = z
    .object({
      name: z.string().trim().min(1, 'Name is required').max(120),
      email: z.string().trim().toLowerCase().email().max(190),
      password: z.string().min(8, 'Password must be at least 8 characters').max(200),
    })
    .parse(req.body ?? {});
  const admin = await prisma.admin.create({
    data: { name: data.name, email: data.email, passwordHash: await bcrypt.hash(data.password, 12) },
    select: adminSelect,
  });
  res.status(201).json(admin);
});

adminRouter.delete('/admins/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (id === req.admin!.id) throw new HttpError(400, 'You cannot delete your own account');
  if ((await prisma.admin.count()) <= 1) throw new HttpError(400, 'At least one admin must remain');
  await prisma.admin.delete({ where: { id } });
  res.status(204).end();
});

adminRouter.put('/me/password', async (req, res) => {
  const { currentPassword, newPassword } = z
    .object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8, 'Password must be at least 8 characters').max(200),
    })
    .parse(req.body ?? {});
  const me = await prisma.admin.findUniqueOrThrow({ where: { id: req.admin!.id } });
  if (!(await bcrypt.compare(currentPassword, me.passwordHash))) {
    throw new HttpError(400, 'Current password is incorrect');
  }
  await prisma.admin.update({
    where: { id: me.id },
    data: { passwordHash: await bcrypt.hash(newPassword, 12) },
  });
  res.json({ ok: true });
});

import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth } from '../lib/auth.js';
import { optionalUrl } from '../lib/crud.js';
import { kigaliDay, lastDays } from '../lib/analytics.js';
import { HttpError } from '../lib/errors.js';
import { refreshAfterChanges } from '../lib/revalidate.js';
import { imageUpload, publicPath, removeUpload, videoUpload } from '../lib/upload.js';
import { certificatesRouter, newsRouter, partnersRouter, projectsRouter, servicesRouter, siteImagesRouter, teamRouter } from './resources.js';

export const adminRouter = Router();
adminRouter.use(requireAuth);
// Dashboard changes: refresh the website's cached pages so they show at once.
adminRouter.use(refreshAfterChanges);

adminRouter.use('/news', newsRouter);
adminRouter.use('/projects', projectsRouter);
adminRouter.use('/team', teamRouter);
adminRouter.use('/partners', partnersRouter);
adminRouter.use('/services', servicesRouter);
adminRouter.use('/certificates', certificatesRouter);
adminRouter.use('/site-images', siteImagesRouter);

/* ---------- A story's video file ---------- */

const storyId = (raw: string) => {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) throw new HttpError(400, 'Invalid id');
  return id;
};

adminRouter.post('/news/:id/video', videoUpload, async (req, res) => {
  const id = storyId(String(req.params.id));
  const story = await prisma.news.findUnique({ where: { id }, select: { videoFile: true } });
  if (!story) {
    if (req.file) removeUpload(publicPath(req.file.filename));
    throw new HttpError(404, 'Not found');
  }
  if (!req.file) throw new HttpError(400, 'Choose a video to upload');
  const saved = await prisma.news.update({ where: { id }, data: { videoFile: publicPath(req.file.filename) } });
  removeUpload(story.videoFile);
  res.json(saved);
});

adminRouter.delete('/news/:id/video', async (req, res) => {
  const id = storyId(String(req.params.id));
  const story = await prisma.news.findUnique({ where: { id }, select: { videoFile: true } });
  if (!story) throw new HttpError(404, 'Not found');
  const saved = await prisma.news.update({ where: { id }, data: { videoFile: null } });
  removeUpload(story.videoFile);
  res.json(saved);
});

/* ---------- Dashboard overview ---------- */

adminRouter.get('/stats', async (_req, res) => {
  const [news, projects, team, partners, unreadMessages, pendingComments, services, certificates, pendingTestimonials] = await Promise.all([
    prisma.news.count(),
    prisma.project.count(),
    prisma.teamMember.count(),
    prisma.partner.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.newsComment.count({ where: { isApproved: false } }),
    prisma.service.count(),
    prisma.certificate.count(),
    prisma.testimonial.count({ where: { isApproved: false } }),
  ]);
  res.json({ news, projects, team, partners, unreadMessages, pendingComments, services, certificates, pendingTestimonials });
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
  generalObjective: text(5000),
  specificObjectives: text(10000),
  governanceText: text(20000),
  areasText: text(20000),
  coreDistricts: text(255),
  otherDistricts: text(255),
  location: text(255),
  mapLink: z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === '' || /^https:\/\/\S+$/i.test(v), 'Paste the link from Google Maps (starts with https://)')
    .default(''),
  latitude: z.string().trim().max(30).refine((v) => v === '' || /^-?\d{1,2}(\.\d+)?$/.test(v), 'Enter a latitude such as -1.5031').default(''),
  longitude: z.string().trim().max(30).refine((v) => v === '' || /^-?\d{1,3}(\.\d+)?$/.test(v), 'Enter a longitude such as 29.6290').default(''),
  streetViewUrl: z
    .string()
    .trim()
    .max(2000)
    .transform((v) => (v.match(/src="([^"]+)"/)?.[1] ?? v).trim())
    .refine((v) => v === '' || /^https:\/\/www\.google\.com\/maps\/embed\?/.test(v), 'Paste the Street View embed code or address from Google Maps')
    .default(''),
  contactEmail: z.union([z.literal(''), z.string().trim().email().max(190)]).default(''),
  phone: text(60),
  address: text(255),
  facebookUrl: optionalUrl,
  twitterUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  // Home page card (its photo is saved through PUT /site/feature-image).
  featureTitle: text(160),
  featureText: text(2000),
  featureButton: text(60),
  featureLink: z
    .string()
    .trim()
    .max(500)
    .refine(
      (v) => v === '' || (/^\/(?!\/)\S*$/.test(v)) || /^https?:\/\/\S+$/i.test(v),
      'Enter a page of the site such as /partners, or a full address starting with https://',
    )
    .default(''),
});

adminRouter.get('/site', async (_req, res) => {
  res.json(await prisma.siteInfo.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }));
});

adminRouter.put('/site', async (req, res) => {
  // Only the fields sent change, so the About page and the Home page card can each save their own part.
  const body: Record<string, unknown> = req.body && typeof req.body === 'object' ? req.body : {};
  const parsed = siteSchema.partial().parse(body);
  const data = Object.fromEntries(Object.entries(parsed).filter(([key]) => key in body));
  res.json(
    await prisma.siteInfo.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } }),
  );
});

/** The home page card's photo: send an "image" file, or removeImage=true to take it away. */
adminRouter.put('/site/feature-image', imageUpload, async (req, res) => {
  const remove = req.body?.removeImage === 'true';
  if (!req.file && !remove) throw new HttpError(400, 'Choose an image');
  const before = await prisma.siteInfo.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  const featureImage = req.file ? publicPath(req.file.filename) : null;
  const site = await prisma.siteInfo.update({ where: { id: 1 }, data: { featureImage } });
  removeUpload(before.featureImage);
  res.json(site);
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

/* ---------- Testimonials (what visitors say about us) ---------- */

adminRouter.get('/testimonials', async (_req, res) => {
  res.json(await prisma.testimonial.findMany({ orderBy: [{ isApproved: 'asc' }, { createdAt: 'desc' }] }));
});

adminRouter.patch('/testimonials/:id', async (req, res) => {
  const id = commentId(req.params.id);
  const { isApproved } = z.object({ isApproved: z.boolean() }).parse(req.body ?? {});
  const found = await prisma.testimonial.findUnique({ where: { id } });
  if (!found) throw new HttpError(404, 'Not found');
  res.json(await prisma.testimonial.update({ where: { id }, data: { isApproved } }));
});

adminRouter.delete('/testimonials/:id', async (req, res) => {
  const id = commentId(req.params.id);
  const found = await prisma.testimonial.findUnique({ where: { id } });
  if (!found) throw new HttpError(404, 'Not found');
  await prisma.testimonial.delete({ where: { id } });
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

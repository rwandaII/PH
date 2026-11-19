import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../db.js';
import { isBot, kigaliDay, visitorCode } from '../lib/analytics.js';
import { HttpError } from '../lib/errors.js';

export const publicRouter = Router();

const getSite = () =>
  prisma.siteInfo.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });

const publishedNews = { isPublished: true } as const;
const newsListSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImage: true,
  publishedAt: true,
} as const;
const projectListSelect = {
  id: true,
  title: true,
  slug: true,
  summary: true,
  coverImage: true,
  location: true,
  status: true,
} as const;

publicRouter.get('/site', async (_req, res) => {
  res.json(await getSite());
});

publicRouter.get('/home', async (_req, res) => {
  const [site, news, projects, partners] = await Promise.all([
    getSite(),
    prisma.news.findMany({
      where: publishedNews,
      orderBy: { publishedAt: 'desc' },
      take: 4,
      select: newsListSelect,
    }),
    prisma.project.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      take: 6,
      select: projectListSelect,
    }),
    prisma.partner.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] }),
  ]);
  res.json({ site, news, projects, partners });
});

publicRouter.get('/news', async (req, res) => {
  const { page, limit } = z
    .object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(50).default(9),
    })
    .parse(req.query);
  const [items, total] = await Promise.all([
    prisma.news.findMany({
      where: publishedNews,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: newsListSelect,
    }),
    prisma.news.count({ where: publishedNews }),
  ]);
  res.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
});

publicRouter.get('/news/:slug', async (req, res) => {
  const item = await prisma.news.findFirst({ where: { slug: req.params.slug, ...publishedNews } });
  if (!item) throw new HttpError(404, 'Not found');
  res.json(item);
});

publicRouter.get('/projects', async (_req, res) => {
  res.json(
    await prisma.project.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: projectListSelect,
    }),
  );
});

publicRouter.get('/projects/:slug', async (req, res) => {
  const item = await prisma.project.findFirst({
    where: { slug: req.params.slug, isPublished: true },
  });
  if (!item) throw new HttpError(404, 'Not found');
  res.json(item);
});

publicRouter.get('/team', async (_req, res) => {
  res.json(await prisma.teamMember.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] }));
});

publicRouter.get('/team/:slug', async (req, res) => {
  const member = await prisma.teamMember.findUnique({ where: { slug: req.params.slug } });
  if (!member) throw new HttpError(404, 'Not found');
  res.json(member);
});

/* ---------- Comments on news: posted by readers, shown once staff approve them ---------- */

const publishedStory = async (slug: string) => {
  const story = await prisma.news.findFirst({ where: { slug, ...publishedNews }, select: { id: true } });
  if (!story) throw new HttpError(404, 'Not found');
  return story;
};

publicRouter.get('/news/:slug/comments', async (req, res) => {
  const story = await publishedStory(req.params.slug);
  res.json(
    await prisma.newsComment.findMany({
      where: { newsId: story.id, isApproved: true },
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true, message: true, createdAt: true },
    }),
  );
});

const commentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many comments, please try again later' },
  skip: () => process.env.NODE_ENV === 'test',
});

publicRouter.post('/news/:slug/comments', commentLimiter, async (req, res) => {
  const story = await publishedStory(String(req.params.slug));
  const data = z
    .object({
      name: z.string().trim().min(1, 'Name is required').max(120),
      message: z.string().trim().min(2, 'Write a comment').max(2000),
      // Spam trap: a hidden field people never fill in.
      website: z.string().max(0, 'Spam detected').optional(),
    })
    .parse(req.body ?? {});
  await prisma.newsComment.create({ data: { newsId: story.id, name: data.name, message: data.message } });
  res.status(201).json({ ok: true, pending: true });
});

/* ---------- Gallery: every photo from published stories and projects ---------- */

const photosIn = (html: string) => [...html.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]);

publicRouter.get('/gallery', async (_req, res) => {
  const [news, projects] = await Promise.all([
    prisma.news.findMany({
      where: publishedNews,
      orderBy: { publishedAt: 'desc' },
      select: { title: true, slug: true, excerpt: true, coverImage: true, content: true, publishedAt: true },
    }),
    prisma.project.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: { title: true, slug: true, summary: true, coverImage: true, content: true },
    }),
  ]);
  const album = (cover: string | null, html: string) => [...new Set([cover, ...photosIn(html)].filter((s): s is string => !!s))];
  res.json([
    ...news.map((n) => ({
      kind: 'news' as const,
      title: n.title,
      text: n.excerpt,
      href: `/news/${n.slug}`,
      date: n.publishedAt,
      photos: album(n.coverImage, n.content),
    })),
    ...projects.map((p) => ({
      kind: 'project' as const,
      title: p.title,
      text: p.summary,
      href: `/projects/${p.slug}`,
      date: null,
      photos: album(p.coverImage, p.content),
    })),
  ].filter((a) => a.photos.length > 0));
});

/* ---------- Visit counting for the dashboard's Statistics page (no personal data stored) ---------- */

const trackLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 600,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
});

publicRouter.post('/track', trackLimiter, async (req, res) => {
  const { path } = z.object({ path: z.string().trim().max(255) }).parse(req.body ?? {});
  const userAgent = String(req.headers['user-agent'] ?? '');
  // only real visitors to public pages
  if (path.startsWith('/') && !path.startsWith('/dashboard') && !path.startsWith('/api') && !isBot(userAgent)) {
    const day = kigaliDay();
    await prisma.pageView.create({ data: { day, path: path.split('?')[0].split('#')[0] || '/', visitor: visitorCode(req.ip ?? '', userAgent, day) } });
  }
  res.status(204).end();
});

publicRouter.get('/services', async (_req, res) => {
  res.json(await prisma.service.findMany({ orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }] }));
});

publicRouter.get('/partners', async (_req, res) => {
  res.json(await prisma.partner.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] }));
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many messages, please try again later' },
  skip: () => process.env.NODE_ENV === 'test',
});

publicRouter.post('/contact', contactLimiter, async (req, res) => {
  const data = z
    .object({
      name: z.string().trim().min(1, 'Name is required').max(120),
      email: z.string().trim().email('Enter a valid email').max(190),
      subject: z.string().trim().max(200).default(''),
      message: z.string().trim().min(1, 'Message is required').max(5000),
    })
    .parse(req.body ?? {});
  await prisma.contactMessage.create({ data });
  res.status(201).json({ ok: true });
});

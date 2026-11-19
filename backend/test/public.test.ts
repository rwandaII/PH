import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app, prisma, resetDb } from './helpers.js';

beforeEach(async () => {
  await resetDb();
  await prisma.news.createMany({
    data: [
      { title: 'Old', slug: 'old', content: '<p>a</p>', isPublished: true, publishedAt: new Date('2026-01-01') },
      { title: 'New', slug: 'new', content: '<p>b</p>', isPublished: true, publishedAt: new Date('2026-06-01') },
      { title: 'Draft', slug: 'draft', content: '<p>c</p>', isPublished: false },
    ],
  });
  await prisma.project.createMany({
    data: [
      { title: 'Second', slug: 'second', content: '', sortOrder: 2, isPublished: true },
      { title: 'First', slug: 'first', content: '', sortOrder: 1, isPublished: true, status: 'completed' },
      { title: 'Hidden', slug: 'hidden', content: '', sortOrder: 0, isPublished: false },
    ],
  });
});

describe('public content', () => {
  it('lists only published news, newest first, with paging info', async () => {
    const res = await request(app).get('/api/public/news').expect(200);
    expect(res.body.items.map((n: { slug: string }) => n.slug)).toEqual(['new', 'old']);
    expect(res.body).toMatchObject({ total: 2, page: 1, pages: 1 });
    expect(res.body.items[0]).not.toHaveProperty('content');
  });

  it('pages the news list', async () => {
    const res = await request(app).get('/api/public/news?limit=1&page=2').expect(200);
    expect(res.body.items.map((n: { slug: string }) => n.slug)).toEqual(['old']);
    expect(res.body).toMatchObject({ page: 2, pages: 2 });
  });

  it('hides drafts from the single-story route', async () => {
    expect((await request(app).get('/api/public/news/new')).status).toBe(200);
    expect((await request(app).get('/api/public/news/draft')).status).toBe(404);
  });

  it('lists only published projects, in the chosen order', async () => {
    const res = await request(app).get('/api/public/projects').expect(200);
    expect(res.body.map((p: { slug: string }) => p.slug)).toEqual(['first', 'second']);
    expect((await request(app).get('/api/public/projects/hidden')).status).toBe(404);
  });

  it('returns everything the home page needs, creating site info on first use', async () => {
    const res = await request(app).get('/api/public/home').expect(200);
    expect(res.body.site.programName).toBe('Hydraulic Program');
    expect(res.body.news).toHaveLength(2);
    expect(res.body.projects).toHaveLength(2);
    expect(res.body.partners).toEqual([]);
  });
});

describe('contact form', () => {
  it('reports each invalid field', async () => {
    const res = await request(app).post('/api/public/contact').send({ name: '', email: 'not-an-email', message: '' });
    expect(res.status).toBe(400);
    const paths = res.body.fields.map((f: { path: string }) => f.path).sort();
    expect(paths).toEqual(['email', 'message', 'name']);
  });

  it('stores a valid message as unread', async () => {
    await request(app)
      .post('/api/public/contact')
      .send({ name: 'Sarah', email: 'sarah@test.local', subject: 'Hi', message: 'Hello there' })
      .expect(201);
    const saved = await prisma.contactMessage.findFirstOrThrow();
    expect(saved).toMatchObject({ name: 'Sarah', subject: 'Hi', isRead: false });
  });
});

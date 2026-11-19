import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app, createAdmin, loggedInAgent, prisma, resetDb } from './helpers.js';

beforeEach(async () => {
  await resetDb();
  await createAdmin();
  await prisma.news.createMany({
    data: [
      {
        title: 'Story',
        slug: 'story',
        content: '<p>a</p><img src="/photos/a.jpg" alt=""><img src="/photos/b.jpg" alt="">',
        coverImage: '/photos/cover.jpg',
        isPublished: true,
        publishedAt: new Date('2026-06-01'),
      },
      { title: 'Draft', slug: 'draft', content: '<img src="/photos/secret.jpg">', isPublished: false },
    ],
  });
});

describe('comments on news', () => {
  it('holds a new comment until staff approve it', async () => {
    const posted = await request(app).post('/api/public/news/story/comments').send({ name: 'Aline', message: 'Thank you for this work' });
    expect(posted.status).toBe(201);
    expect(posted.body).toMatchObject({ pending: true });
    expect((await request(app).get('/api/public/news/story/comments')).body).toEqual([]);

    const admin = await loggedInAgent();
    const list = await admin.get('/api/admin/comments').expect(200);
    expect(list.body[0]).toMatchObject({ name: 'Aline', isApproved: false, news: { slug: 'story' } });
    expect((await admin.get('/api/admin/stats')).body.pendingComments).toBe(1);

    await admin.patch(`/api/admin/comments/${list.body[0].id}`).send({ isApproved: true }).expect(200);
    const shown = await request(app).get('/api/public/news/story/comments').expect(200);
    expect(shown.body).toHaveLength(1);
    expect(shown.body[0]).toMatchObject({ name: 'Aline', message: 'Thank you for this work' });
    expect(shown.body[0]).not.toHaveProperty('isApproved');

    await admin.delete(`/api/admin/comments/${list.body[0].id}`).expect(204);
    expect((await request(app).get('/api/public/news/story/comments')).body).toEqual([]);
  });

  it('checks the fields, the spam trap and the story', async () => {
    const bad = await request(app).post('/api/public/news/story/comments').send({ name: '', message: '' });
    expect(bad.status).toBe(400);
    expect(bad.body.fields.map((f: { path: string }) => f.path)).toEqual(expect.arrayContaining(['name', 'message']));
    const spam = await request(app).post('/api/public/news/story/comments').send({ name: 'Bot', message: 'Buy now', website: 'http://x' });
    expect(spam.status).toBe(400);
    expect((await request(app).post('/api/public/news/draft/comments').send({ name: 'A', message: 'Hello' })).status).toBe(404);
    expect(await prisma.newsComment.count()).toBe(0);
  });

  it('only lets signed-in staff moderate', async () => {
    expect((await request(app).get('/api/admin/comments')).status).toBe(401);
  });
});

describe('team profiles', () => {
  it('gives each member an address from their name and checks the email', async () => {
    const admin = await loggedInAgent();
    const made = await admin
      .post('/api/admin/team')
      .field('name', 'Marie Yvonne Ingabire')
      .field('role', 'Coordinator')
      .field('bio', 'Leads the program.')
      .field('linkedinUrl', 'https://www.linkedin.com/in/example')
      .field('joinedYear', '2015')
      .field('email', 'marie@example.org')
      .field('address', 'Musanze')
      .expect(201);
    expect(made.body.slug).toBe('marie-yvonne-ingabire');
    const page = await request(app).get('/api/public/team/marie-yvonne-ingabire').expect(200);
    expect(page.body).toMatchObject({ role: 'Coordinator', email: 'marie@example.org', address: 'Musanze', joinedYear: 2015, linkedinUrl: 'https://www.linkedin.com/in/example' });
    expect((await request(app).get('/api/public/team/nobody')).status).toBe(404);

    const bad = await admin.post('/api/admin/team').field('name', 'X').field('role', 'Y').field('bio', 'Z').field('email', 'not-an-email').field('facebookUrl', 'facebook.com/x');
    expect(bad.status).toBe(400);
    expect(bad.body.fields.map((f: { path: string }) => f.path)).toEqual(expect.arrayContaining(['email', 'facebookUrl']));
  });
});

describe('gallery', () => {
  it('lists every photo of published stories, cover first, without drafts', async () => {
    const res = await request(app).get('/api/public/gallery').expect(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({ kind: 'news', title: 'Story', href: '/news/story' });
    expect(res.body[0].photos).toEqual(['/photos/cover.jpg', '/photos/a.jpg', '/photos/b.jpg']);
  });
});

describe('services', () => {
  it('lets staff add a service and shows it publicly, in order', async () => {
    const admin = await loggedInAgent();
    const bad = await admin.post('/api/admin/services').field('title', 'Water supply');
    expect(bad.status).toBe(400);
    expect(bad.body.fields.map((f: { path: string }) => f.path)).toContain('summary');
    await admin.post('/api/admin/services').field('title', 'Water supply').field('summary', 'Safe water.').field('includes', 'Collection\nTreatment').field('sortOrder', '2').expect(201);
    const made = await admin.post('/api/admin/services').field('title', 'Hygiene').field('summary', 'Clean habits.').field('sortOrder', '1').expect(201);
    expect(made.body.slug).toBe('hygiene');
    const list = await request(app).get('/api/public/services').expect(200);
    expect(list.body.map((s: { slug: string }) => s.slug)).toEqual(['hygiene', 'water-supply']);
    expect(list.body[1].includes).toBe('Collection\nTreatment');
    expect((await admin.get('/api/admin/stats')).body.services).toBe(2);
  });
});

describe('statistics', () => {
  const browser = 'Mozilla/5.0 (Windows NT 10.0) Chrome/130';
  it('counts page views and daily visitors, without dashboard pages or robots', async () => {
    await request(app).post('/api/public/track').set('User-Agent', browser).send({ path: '/' }).expect(204);
    await request(app).post('/api/public/track').set('User-Agent', browser).send({ path: '/news?page=2' }).expect(204);
    await request(app).post('/api/public/track').set('User-Agent', browser).send({ path: '/dashboard' }).expect(204);
    await request(app).post('/api/public/track').set('User-Agent', 'Googlebot/2.1').send({ path: '/' }).expect(204);
    expect(await prisma.pageView.count()).toBe(2);
    const row = await prisma.pageView.findFirst({ where: { path: '/news' } });
    expect(row?.visitor).toMatch(/^[0-9a-f]{64}$/);

    const admin = await loggedInAgent();
    const stats = await admin.get('/api/admin/analytics').expect(200);
    expect(stats.body.today).toMatchObject({ views: 2, visitors: 1 });
    expect(stats.body.daily).toHaveLength(30);
    expect(stats.body.topPages).toEqual(expect.arrayContaining([{ path: '/', views: 1 }, { path: '/news', views: 1 }]));
    expect(stats.body.content.news).toBe(1);
    expect((await request(app).get('/api/admin/analytics')).status).toBe(401);
  });
});

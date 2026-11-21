import fs from 'node:fs';
import path from 'node:path';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app, createAdmin, loggedInAgent, PNG, prisma, resetDb } from './helpers.js';

let agent: ReturnType<typeof request.agent>;

beforeEach(async () => {
  await resetDb();
  await createAdmin();
  agent = await loggedInAgent();
});

const uploadFile = (stored: string) => path.join(process.env.UPLOAD_DIR!, path.basename(stored));

describe('news', () => {
  it('requires a title and reports it as a field error', async () => {
    const res = await agent.post('/api/admin/news').field('title', '');
    expect(res.status).toBe(400);
    expect(res.body.fields).toContainEqual(expect.objectContaining({ path: 'title' }));
  });

  it('makes a unique slug from the title, and stamps the publish date', async () => {
    const a = await agent.post('/api/admin/news').field('title', 'Water Reaches Hill').field('isPublished', 'true').expect(201);
    const b = await agent.post('/api/admin/news').field('title', 'Water reaches hill').expect(201);
    expect(a.body.slug).toBe('water-reaches-hill');
    expect(b.body.slug).toBe('water-reaches-hill-2');
    expect(a.body.publishedAt).not.toBeNull();
    expect(b.body.publishedAt).toBeNull();
  });

  it('keeps the first publish date when re-saved, and clears it when unpublished', async () => {
    const created = await agent.post('/api/admin/news').field('title', 'T').field('isPublished', 'true').expect(201);
    const again = await agent.put(`/api/admin/news/${created.body.id}`).field('title', 'T2').field('isPublished', 'true').expect(200);
    expect(again.body.publishedAt).toBe(created.body.publishedAt);
    const draft = await agent.put(`/api/admin/news/${created.body.id}`).field('title', 'T2').field('isPublished', 'false').expect(200);
    expect(draft.body.publishedAt).toBeNull();
  });

  it('strips unsafe HTML but keeps the editor formatting', async () => {
    const html = '<h2>Head</h2><p onclick="x()">Hi <strong>there</strong> <a href="javascript:alert(1)">bad</a> <a href="https://ok.test">ok</a></p><script>alert(1)</script><ul><li>one</li></ul>';
    const res = await agent.post('/api/admin/news').field('title', 'Safe').field('content', html).expect(201);
    expect(res.body.content).toContain('<h2>Head</h2>');
    expect(res.body.content).toContain('<strong>there</strong>');
    expect(res.body.content).toContain('<li>one</li>');
    expect(res.body.content).toContain('href="https://ok.test"');
    expect(res.body.content).not.toMatch(/script|onclick|javascript:/);
  });

  it('uploads, replaces and removes a cover image, deleting old files', async () => {
    const created = await agent.post('/api/admin/news').field('title', 'Pic').attach('image', PNG, { filename: 'a.png', contentType: 'image/png' }).expect(201);
    const first = created.body.coverImage as string;
    expect(first).toMatch(/^\/uploads\/.+\.png$/);
    expect(fs.existsSync(uploadFile(first))).toBe(true);

    const replaced = await agent.put(`/api/admin/news/${created.body.id}`).field('title', 'Pic').attach('image', PNG, { filename: 'b.png', contentType: 'image/png' }).expect(200);
    expect(replaced.body.coverImage).not.toBe(first);
    await new Promise((r) => setTimeout(r, 50));
    expect(fs.existsSync(uploadFile(first))).toBe(false);

    const removed = await agent.put(`/api/admin/news/${created.body.id}`).field('title', 'Pic').field('removeImage', 'true').expect(200);
    expect(removed.body.coverImage).toBeNull();
    await new Promise((r) => setTimeout(r, 50));
    expect(fs.existsSync(uploadFile(replaced.body.coverImage))).toBe(false);
  });

  it('refuses files that are not JPG, PNG or WEBP', async () => {
    const res = await agent.post('/api/admin/news').field('title', 'Gif').attach('image', Buffer.from('GIF89a'), { filename: 'a.gif', contentType: 'image/gif' });
    expect(res.status).toBe(400);
    expect(await prisma.news.count()).toBe(0);
  });

  it('deletes a story', async () => {
    const created = await agent.post('/api/admin/news').field('title', 'Bye').expect(201);
    await agent.delete(`/api/admin/news/${created.body.id}`).expect(204);
    expect((await agent.get(`/api/admin/news/${created.body.id}`)).status).toBe(404);
  });
});

describe('projects, team and partners', () => {
  it('saves a project with its status and order', async () => {
    const res = await agent
      .post('/api/admin/projects')
      .field('title', 'Kiosk')
      .field('status', 'completed')
      .field('sortOrder', '3')
      .field('isPublished', 'true')
      .expect(201);
    expect(res.body).toMatchObject({ slug: 'kiosk', status: 'completed', sortOrder: 3, isPublished: true });
  });

  it('rejects an unknown project status', async () => {
    const res = await agent.post('/api/admin/projects').field('title', 'X').field('status', 'abandoned');
    expect(res.status).toBe(400);
  });

  it('requires a team member name and role; the biography is optional', async () => {
    const res = await agent.post('/api/admin/team').field('name', 'Amina');
    expect(res.status).toBe(400);
    expect(res.body.fields).toContainEqual(expect.objectContaining({ path: 'role' }));
    expect(res.body.fields).not.toContainEqual(expect.objectContaining({ path: 'bio' }));
    const ok = await agent
      .post('/api/admin/team')
      .field('name', 'Amina')
      .field('role', 'Engineer')
      .field('washYears', '15 years')
      .field('competence', 'Construction works')
      .expect(201);
    expect(ok.body).toMatchObject({ bio: '', washYears: '15 years', competence: 'Construction works' });
  });

  it('saves a partner as international or local, with its place, contacts and people', async () => {
    const res = await agent
      .post('/api/admin/partners')
      .field('name', 'Q')
      .field('scope', 'international')
      .field('place', 'Aachen, Germany')
      .field('badge', 'Principal donor')
      .field('contacts', 'Email: info@q.test')
      .field('contactPeople', 'A Person | Coordinator')
      .expect(201);
    expect(res.body).toMatchObject({ scope: 'international', place: 'Aachen, Germany', badge: 'Principal donor', contactPeople: 'A Person | Coordinator' });
    const bad = await agent.post('/api/admin/partners').field('name', 'Q').field('scope', 'galactic');
    expect(bad.status).toBe(400);
  });

  it('only accepts http(s) partner websites', async () => {
    const bad = await agent.post('/api/admin/partners').field('name', 'P').field('websiteUrl', 'ftp://x.test');
    expect(bad.status).toBe(400);
    await agent.post('/api/admin/partners').field('name', 'P').field('websiteUrl', 'https://p.test').expect(201);
  });
});

describe('site info', () => {
  it('validates and saves the about and contact text', async () => {
    const bad = await agent.put('/api/admin/site').send({ programName: '', contactEmail: 'nope' });
    expect(bad.status).toBe(400);
    const paths = bad.body.fields.map((f: { path: string }) => f.path);
    expect(paths).toEqual(expect.arrayContaining(['programName', 'contactEmail']));

    await agent.put('/api/admin/site').send({ programName: 'Water For All', tagline: 'Safe water', mission: 'M' }).expect(200);
    const pub = await request(app).get('/api/public/site').expect(200);
    expect(pub.body).toMatchObject({ programName: 'Water For All', tagline: 'Safe water', mission: 'M' });
  });
});

describe('messages and stats', () => {
  it('counts unread messages and lets an admin mark them read and delete them', async () => {
    const msg = await prisma.contactMessage.create({ data: { name: 'S', email: 's@test.local', message: 'Hi' } });
    expect((await agent.get('/api/admin/stats').expect(200)).body.unreadMessages).toBe(1);

    await agent.patch(`/api/admin/messages/${msg.id}`).send({ isRead: true }).expect(200);
    expect((await agent.get('/api/admin/stats').expect(200)).body.unreadMessages).toBe(0);

    await agent.delete(`/api/admin/messages/${msg.id}`).expect(204);
    expect(await prisma.contactMessage.count()).toBe(0);
  });
});

describe('admin accounts', () => {
  it('needs a password of at least 8 characters and never returns password hashes', async () => {
    const bad = await agent.post('/api/admin/admins').send({ name: 'E', email: 'e@test.local', password: 'short' });
    expect(bad.status).toBe(400);
    const ok = await agent.post('/api/admin/admins').send({ name: 'E', email: 'e@test.local', password: 'long-enough' }).expect(201);
    expect(ok.body).not.toHaveProperty('passwordHash');
    const list = await agent.get('/api/admin/admins').expect(200);
    expect(list.body).toHaveLength(2);
    expect(list.body[0]).not.toHaveProperty('passwordHash');
  });

  it('refuses a duplicate email', async () => {
    const res = await agent.post('/api/admin/admins').send({ name: 'Dup', email: 'admin@test.local', password: 'long-enough' });
    expect(res.status).toBe(409);
  });

  it('does not let you delete yourself, but lets you delete someone else', async () => {
    const me = await agent.get('/api/auth/me').expect(200);
    expect((await agent.delete(`/api/admin/admins/${me.body.id}`)).status).toBe(400);
    const other = await createAdmin({ email: 'other@test.local' });
    await agent.delete(`/api/admin/admins/${other.id}`).expect(204);
  });

  it('changes your password only with the current one', async () => {
    const wrong = await agent.put('/api/admin/me/password').send({ currentPassword: 'nope', newPassword: 'brand-new-pass' });
    expect(wrong.status).toBe(400);
    await agent.put('/api/admin/me/password').send({ currentPassword: 'correct-horse-1', newPassword: 'brand-new-pass' }).expect(200);
    await loggedInAgent('admin@test.local', 'brand-new-pass');
  });
});

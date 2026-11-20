import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app, createAdmin, loggedInAgent, prisma, resetDb } from './helpers.js';

beforeEach(async () => {
  await resetDb();
  await createAdmin();
});

describe('picture places', () => {
  it('lists pictures by place and order, and lets staff remove them', async () => {
    await prisma.siteImage.createMany({
      data: [
        { place: 'about.header', image: '/photos/b.jpg', sortOrder: 2 },
        { place: 'about.header', image: '/photos/a.jpg', sortOrder: 1 },
        { place: 'team.header', image: null },
      ],
    });
    const list = (await request(app).get('/api/public/site-images')).body as { place: string; image: string }[];
    expect(list.map((p) => p.image)).toEqual(['/photos/a.jpg', '/photos/b.jpg']);

    const admin = await loggedInAgent();
    expect((await admin.post('/api/admin/site-images').field('place', 'nowhere')).status).toBe(400);
    const [first] = (await admin.get('/api/admin/site-images')).body as { id: number }[];
    await admin.delete(`/api/admin/site-images/${first.id}`).expect(204);
    expect(((await request(app).get('/api/public/site-images')).body as unknown[]).length).toBe(1);
  });

  it('is staff-only to change', async () => {
    await request(app).post('/api/admin/site-images').field('place', 'about.header').expect(401);
  });
});

describe('office location', () => {
  it('keeps the map link and pin, and takes the src out of a pasted Street View embed code', async () => {
    const admin = await loggedInAgent();
    const embed = '<iframe src="https://www.google.com/maps/embed?pb=!4v1" width="600"></iframe>';
    await admin
      .put('/api/admin/site')
      .send({ programName: 'PH', mapLink: 'https://maps.app.goo.gl/abc', latitude: '-1.5031', longitude: '29.6290', streetViewUrl: embed })
      .expect(200);
    const site = (await request(app).get('/api/public/site')).body;
    expect(site).toMatchObject({ mapLink: 'https://maps.app.goo.gl/abc', latitude: '-1.5031', longitude: '29.6290', streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1' });
    expect((await admin.put('/api/admin/site').send({ programName: 'PH', latitude: 'north' })).status).toBe(400);
  });
});

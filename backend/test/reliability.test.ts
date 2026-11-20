import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app, prisma, resetDb } from './helpers.js';

beforeEach(async () => {
  await resetDb();
});

describe('reliable answers', () => {
  it('answers an unreadable request with a clear message instead of failing', async () => {
    const res = await request(app).post('/api/public/contact').set('Content-Type', 'application/json').send('{"name": "Aline", ');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/could not be read/i);
  });

  it('compresses larger answers for slow connections', async () => {
    await prisma.siteImage.createMany({
      data: Array.from({ length: 40 }, (_, i) => ({ place: 'about.header', image: `/photos/field/picture-number-${i}.jpg`, caption: 'A caption long enough to be worth compressing', sortOrder: i })),
    });
    const res = await request(app).get('/api/public/site-images').set('Accept-Encoding', 'gzip');
    expect(res.status).toBe(200);
    expect(res.headers['content-encoding']).toBe('gzip');
    expect((res.body as unknown[]).length).toBe(40);
  });
});

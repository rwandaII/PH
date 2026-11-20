import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app, createAdmin, loggedInAgent, resetDb } from './helpers.js';

beforeEach(async () => {
  await resetDb();
  await createAdmin();
});

describe('testimonials (what visitors say about us)', () => {
  it('holds new testimonials until staff approve them, newest first', async () => {
    await request(app).post('/api/public/testimonials').send({ name: 'Aline', place: 'Teacher, Musanze', message: 'The new tap changed our school.' }).expect(201);
    await request(app).post('/api/public/testimonials').send({ name: 'Eric', message: 'Thank you for the latrines.' }).expect(201);
    expect((await request(app).get('/api/public/testimonials')).body).toEqual([]);

    const admin = await loggedInAgent();
    expect((await admin.get('/api/admin/stats')).body.pendingTestimonials).toBe(2);
    const list = (await admin.get('/api/admin/testimonials')).body as { id: number; name: string }[];
    for (const t of list) await admin.patch(`/api/admin/testimonials/${t.id}`).send({ isApproved: true }).expect(200);

    const shown = (await request(app).get('/api/public/testimonials')).body as { name: string; place: string }[];
    expect(shown.map((t) => t.name)).toEqual(['Eric', 'Aline']);
    expect(shown[1].place).toBe('Teacher, Musanze');
    expect((await admin.get('/api/admin/stats')).body.pendingTestimonials).toBe(0);
  });

  it('lets staff delete one, and rejects spam and empty messages', async () => {
    await request(app).post('/api/public/testimonials').send({ name: 'Bot', message: 'Buy now', website: 'x' }).expect(400);
    await request(app).post('/api/public/testimonials').send({ name: '', message: '' }).expect(400);
    await request(app).post('/api/public/testimonials').send({ name: 'Ann', message: 'Great work in Burera.' }).expect(201);

    const admin = await loggedInAgent();
    const [t] = (await admin.get('/api/admin/testimonials')).body as { id: number }[];
    await admin.delete(`/api/admin/testimonials/${t.id}`).expect(204);
    expect((await admin.get('/api/admin/testimonials')).body).toEqual([]);
    await request(app).patch(`/api/admin/testimonials/${t.id}`).send({ isApproved: true }).expect(401);
  });
});

import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { ADMIN, app, createAdmin, loggedInAgent, resetDb } from './helpers.js';

beforeEach(async () => {
  await resetDb();
  await createAdmin();
});

describe('login', () => {
  it('rejects a wrong password without saying which part was wrong', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: ADMIN.email, password: 'nope' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid email or password');
    expect(res.headers['set-cookie']).toBeUndefined();
  });

  it('rejects an unknown email the same way', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'who@test.local', password: 'whatever1' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid email or password');
  });

  it('accepts the right password, ignoring email case, and sets an httpOnly cookie', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: ADMIN.email.toUpperCase(), password: ADMIN.password });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ email: ADMIN.email, name: ADMIN.name });
    expect(res.body).not.toHaveProperty('passwordHash');
    const cookie = String(res.headers['set-cookie']);
    expect(cookie).toMatch(/hp_token=/);
    expect(cookie).toMatch(/HttpOnly/i);
  });
});

describe('session', () => {
  it('blocks admin routes without a login', async () => {
    expect((await request(app).get('/api/auth/me')).status).toBe(401);
    expect((await request(app).get('/api/admin/stats')).status).toBe(401);
    expect((await request(app).post('/api/admin/news').send({ title: 'x' })).status).toBe(401);
  });

  it('rejects a forged cookie', async () => {
    const res = await request(app).get('/api/auth/me').set('Cookie', 'hp_token=not-a-real-token');
    expect(res.status).toBe(401);
  });

  it('returns the logged-in admin, and logout ends the session', async () => {
    const agent = await loggedInAgent();
    const me = await agent.get('/api/auth/me');
    expect(me.status).toBe(200);
    expect(me.body.email).toBe(ADMIN.email);

    await agent.post('/api/auth/logout').expect(200);
    expect((await agent.get('/api/auth/me')).status).toBe(401);
  });
});

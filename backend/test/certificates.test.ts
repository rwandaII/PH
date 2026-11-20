import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app, createAdmin, loggedInAgent, resetDb } from './helpers.js';

beforeEach(async () => {
  await resetDb();
  await createAdmin();
});

describe('certificates and appreciations', () => {
  it('lets staff add them and shows only published ones publicly, in order', async () => {
    const admin = await loggedInAgent();

    const bad = await admin.post('/api/admin/certificates').field('title', '').field('issuedOn', '2014-13-45');
    expect(bad.status).toBe(400);

    await admin
      .post('/api/admin/certificates')
      .field('title', 'Certificate of Compliance')
      .field('kind', 'certificate')
      .field('issuer', 'Rwanda Governance Board (RGB)')
      .field('issuedOn', '2014-01-07')
      .field('sortOrder', '1')
      .field('isPublished', 'true')
      .expect(201);
    await admin.post('/api/admin/certificates').field('title', 'Letter of appreciation').field('kind', 'appreciation').field('issuedOn', '').field('sortOrder', '2').field('isPublished', 'true').expect(201);
    await admin.post('/api/admin/certificates').field('title', 'Draft').field('isPublished', 'false').expect(201);

    const list = await request(app).get('/api/public/certificates').expect(200);
    expect(list.body.map((c: { title: string }) => c.title)).toEqual(['Certificate of Compliance', 'Letter of appreciation']);
    expect(list.body[0]).toMatchObject({ kind: 'certificate', issuer: 'Rwanda Governance Board (RGB)' });
    expect(list.body[0].issuedOn.slice(0, 10)).toBe('2014-01-07');
    expect(list.body[1]).toMatchObject({ kind: 'appreciation', issuedOn: null });
    expect((await admin.get('/api/admin/stats')).body.certificates).toBe(3);
  });

  it('is staff-only to change', async () => {
    await request(app).post('/api/admin/certificates').field('title', 'X').expect(401);
  });
});

describe('site information', () => {
  it('saves the objectives, governance and districts', async () => {
    const admin = await loggedInAgent();
    await admin
      .put('/api/admin/site')
      .send({ programName: 'PH', generalObjective: 'Improve lives.', specificObjectives: 'One\nTwo', coreDistricts: 'Musanze, Burera' })
      .expect(200);
    const site = (await request(app).get('/api/public/site')).body;
    expect(site).toMatchObject({ generalObjective: 'Improve lives.', specificObjectives: 'One\nTwo', coreDistricts: 'Musanze, Burera', governanceText: '' });
  });
});

describe('team categories', () => {
  it('places a team member in the organisational chart and rejects unknown boxes', async () => {
    const admin = await loggedInAgent();
    const bad = await admin.post('/api/admin/team').field('name', 'A').field('role', 'Engineer').field('bio', 'x').field('category', 'astronauts');
    expect(bad.status).toBe(400);
    await admin.post('/api/admin/team').field('name', 'Aline').field('role', 'Civil engineer').field('bio', 'x').field('category', 'civil-engineers').expect(201);
    await admin.post('/api/admin/team').field('name', 'Bosco').field('role', 'Volunteer').field('bio', 'x').expect(201);
    const team = (await request(app).get('/api/public/team')).body as { name: string; category: string }[];
    expect(team.map((m) => [m.name, m.category])).toEqual([
      ['Aline', 'civil-engineers'],
      ['Bosco', ''],
    ]);
  });
});

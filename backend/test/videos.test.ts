import fs from 'node:fs';
import path from 'node:path';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { config } from '../src/config.js';
import { app, createAdmin, loggedInAgent, resetDb } from './helpers.js';

beforeEach(async () => {
  await resetDb();
  await createAdmin();
});

const fakeVideo = Buffer.from('00000018667479706d703432', 'hex'); // the start of an MP4 file

describe('story videos', () => {
  it('uploads, replaces and removes a story video, and shows it publicly', async () => {
    const admin = await loggedInAgent();
    const story = (await admin.post('/api/admin/news').field('title', 'Water day').field('isPublished', 'true').expect(201)).body;

    const first = (await admin.post(`/api/admin/news/${story.id}/video`).attach('video', fakeVideo, { filename: 'a.mp4', contentType: 'video/mp4' }).expect(200)).body;
    expect(first.videoFile).toMatch(/^\/uploads\/.+\.mp4$/);
    const firstFile = path.join(config.uploadDir, path.basename(first.videoFile));
    expect(fs.existsSync(firstFile)).toBe(true);

    const second = (await admin.post(`/api/admin/news/${story.id}/video`).attach('video', fakeVideo, { filename: 'b.webm', contentType: 'video/webm' }).expect(200)).body;
    expect(second.videoFile).toMatch(/\.webm$/);
    await new Promise((r) => setTimeout(r, 50));
    expect(fs.existsSync(firstFile)).toBe(false); // the old one is removed

    const pub = (await request(app).get('/api/public/news/water-day')).body;
    expect(pub.videoFile).toBe(second.videoFile);
    const list = (await request(app).get('/api/public/news')).body.items;
    expect(list[0].videoFile).toBe(second.videoFile);

    await admin.delete(`/api/admin/news/${story.id}/video`).expect(200);
    expect((await request(app).get('/api/public/news/water-day')).body.videoFile).toBeNull();
  });

  it('accepts video links but not other addresses, and rejects other files', async () => {
    const admin = await loggedInAgent();
    const ok = await admin.post('/api/admin/news').field('title', 'Clip').field('videoUrl', 'https://www.youtube.com/watch?v=abc123').expect(201);
    expect(ok.body.videoUrl).toBe('https://www.youtube.com/watch?v=abc123');
    expect((await admin.post('/api/admin/news').field('title', 'Bad').field('videoUrl', 'https://example.com/page')).status).toBe(400);
    const res = await admin.post(`/api/admin/news/${ok.body.id}/video`).attach('video', Buffer.from('hello'), { filename: 'a.txt', contentType: 'text/plain' });
    expect(res.status).toBe(400);
  });

  it('deletes the video file together with the story, and is staff-only', async () => {
    const admin = await loggedInAgent();
    const story = (await admin.post('/api/admin/news').field('title', 'Gone').expect(201)).body;
    const withVideo = (await admin.post(`/api/admin/news/${story.id}/video`).attach('video', fakeVideo, { filename: 'a.mp4', contentType: 'video/mp4' })).body;
    const file = path.join(config.uploadDir, path.basename(withVideo.videoFile));
    await admin.delete(`/api/admin/news/${story.id}`).expect(204);
    await new Promise((r) => setTimeout(r, 50));
    expect(fs.existsSync(file)).toBe(false);
    await request(app).post(`/api/admin/news/${story.id}/video`).expect(401);
  });
});

import bcrypt from 'bcryptjs';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../db.js';
import { clearAuthCookie, requireAuth, setAuthCookie } from '../lib/auth.js';

export const authRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later' },
  skip: () => process.env.NODE_ENV === 'test',
});

// Used to keep timing similar whether or not the email exists.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

authRouter.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = z
    .object({ email: z.string().trim().toLowerCase().min(1), password: z.string().min(1) })
    .parse(req.body ?? {});
  const admin = await prisma.admin.findUnique({ where: { email } });
  const ok = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);
  if (!admin || !ok) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }
  setAuthCookie(res, admin.id);
  res.json({ id: admin.id, name: admin.name, email: admin.email });
});

authRouter.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json(req.admin);
});

import type { RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { prisma } from '../db.js';

export interface AuthAdmin {
  id: number;
  name: string;
  email: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    admin?: AuthAdmin;
  }
}

export function setAuthCookie(res: Response, adminId: number): void {
  const token = jwt.sign({ sub: String(adminId) }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  } as jwt.SignOptions);
  res.cookie(config.cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(config.cookieName, { path: '/' });
}

/** Rejects the request with 401 unless a valid admin session cookie is present. */
export const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies?.[config.cookieName];
    if (!token) {
      res.status(401).json({ error: 'Not logged in' });
      return;
    }
    const payload = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload;
    const admin = await prisma.admin.findUnique({
      where: { id: Number(payload.sub) },
      select: { id: true, name: true, email: true },
    });
    if (!admin) {
      clearAuthCookie(res);
      res.status(401).json({ error: 'Not logged in' });
      return;
    }
    req.admin = admin;
    next();
  } catch {
    clearAuthCookie(res);
    res.status(401).json({ error: 'Not logged in' });
  }
};

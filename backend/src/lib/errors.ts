import type { ErrorRequestHandler, RequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import multer from 'multer';
import { ZodError } from 'zod';

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ error: 'Not found' });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      fields: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
    return;
  }
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? err.field === 'video'
          ? 'The video is too large (max 300 MB). Shorten it, or upload it to YouTube and paste the link.'
          : 'Image is too large (max 5 MB)'
        : err.message;
    res.status(400).json({ error: message });
    return;
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({ error: 'A record with that value already exists' });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Not found' });
      return;
    }
  }
  // The database was briefly unreachable or busy: 503 tells the website and the dashboard to
  // try again by themselves (they retry reads), instead of showing an error.
  const DATABASE_UNAVAILABLE = ['P1001', 'P1002', 'P1008', 'P1017', 'P2024'];
  if (
    err instanceof Prisma.PrismaClientInitializationError ||
    (err instanceof Prisma.PrismaClientKnownRequestError && DATABASE_UNAVAILABLE.includes(err.code)) ||
    err instanceof Prisma.PrismaClientRustPanicError
  ) {
    console.error('Database unavailable:', (err as Error).message.split('\n')[0]);
    res.setHeader('Retry-After', '2');
    res.status(503).json({ error: 'The website is busy for a moment. Please try again in a few seconds.' });
    return;
  }
  if ((err as { type?: string }).type === 'entity.too.large') {
    res.status(413).json({ error: 'That is too much text to send at once.' });
    return;
  }
  if ((err as { type?: string }).type === 'entity.parse.failed') {
    res.status(400).json({ error: 'The request could not be read. Please try again.' });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on our side. Please try again.' });
};

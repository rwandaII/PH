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
      err.code === 'LIMIT_FILE_SIZE' ? 'Image is too large (max 5 MB)' : err.message;
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
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
};

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { config } from './config.js';
import { errorHandler, notFound } from './lib/errors.js';
import { adminRouter } from './routes/admin.js';
import { authRouter } from './routes/auth.js';
import { publicRouter } from './routes/public.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  // Images are shown on the Next.js site (another origin), so allow cross-origin loading.
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({ origin: config.corsOrigins, credentials: true }));
  app.use(express.json({ limit: '3mb' }));
  app.use(cookieParser());

  app.use('/uploads', express.static(config.uploadDir, { maxAge: '7d', index: false }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });
  app.use('/api/auth', authRouter);
  app.use('/api/public', publicRouter);
  app.use('/api/admin', adminRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

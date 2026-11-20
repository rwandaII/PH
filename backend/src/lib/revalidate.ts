import type { RequestHandler } from 'express';
import { config } from '../config.js';

/**
 * The website keeps its pages ready-made (cached) so they open instantly. When staff change
 * anything in the dashboard, this tells the website to refresh, so the change shows on the very
 * next visit. Calls close together (e.g. approving several comments) are merged into one.
 */
let timer: NodeJS.Timeout | null = null;

export function refreshWebsite(): void {
  if (!config.revalidateSecret || process.env.NODE_ENV === 'test') return;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    fetch(`${config.frontendUrl}/revalidate-content`, {
      method: 'POST',
      headers: { 'x-revalidate-secret': config.revalidateSecret },
      signal: AbortSignal.timeout(5000),
    }).catch((err: unknown) => console.warn('Could not ask the website to refresh:', (err as Error).message));
  }, 150);
}

/** After every successful change (anything but GET) under this router, refresh the website. */
export const refreshAfterChanges: RequestHandler = (req, res, next) => {
  if (req.method !== 'GET') {
    res.on('finish', () => {
      if (res.statusCode < 400) refreshWebsite();
    });
  }
  next();
};

import crypto from 'node:crypto';
import { config } from '../config.js';

/** The date in Rwanda (Africa/Kigali) as YYYY-MM-DD. */
export function kigaliDay(date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Kigali', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

/** The last `n` days, oldest first, ending today (Kigali time). */
export function lastDays(n: number, now = new Date()): string[] {
  return Array.from({ length: n }, (_, i) => kigaliDay(new Date(now.getTime() - (n - 1 - i) * 86_400_000)));
}

/**
 * An anonymous code for a visitor on one day: a one-way hash of their IP and browser, the day
 * and the server secret. Nothing personal is stored, and the code changes every day.
 */
export function visitorCode(ip: string, userAgent: string, day: string): string {
  return crypto.createHash('sha256').update(`${day}|${ip}|${userAgent}|${config.jwtSecret}`).digest('hex');
}

/** Search engines, link previews and other robots: not counted as visitors. */
export const isBot = (userAgent: string) => !userAgent || /bot|crawl|spider|slurp|preview|headless|lighthouse|curl|wget|python|axios/i.test(userAgent);

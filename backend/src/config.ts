import 'dotenv/config';
import path from 'node:path';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const isProduction = process.env.NODE_ENV === 'production';

export const config = {
  isProduction,
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: '7d',
  cookieName: 'hp_token',
  /** Origins allowed to call the API directly from a browser (comma separated). */
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  uploadDir: path.resolve(process.env.UPLOAD_DIR ?? 'uploads'),
  maxUploadBytes: 5 * 1024 * 1024,
};

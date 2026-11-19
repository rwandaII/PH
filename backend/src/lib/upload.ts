import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { config } from '../config.js';
import { HttpError } from './errors.js';

const ALLOWED: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

fs.mkdirSync(config.uploadDir, { recursive: true });

/** Accepts one optional image in the multipart field named "image". */
export const imageUpload = multer({
  storage: multer.diskStorage({
    destination: config.uploadDir,
    filename: (_req, file, cb) => {
      cb(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ALLOWED[file.mimetype]}`);
    },
  }),
  limits: { fileSize: config.maxUploadBytes, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED[file.mimetype]) cb(null, true);
    else cb(new HttpError(400, 'Only JPG, PNG or WEBP images are allowed'));
  },
}).single('image');

/** Public URL path stored in the database for an uploaded file. */
export function publicPath(filename: string): string {
  return `/uploads/${filename}`;
}

/** Delete a previously uploaded file given its stored public path. Never throws. */
export function removeUpload(stored: string | null | undefined): void {
  if (!stored || !stored.startsWith('/uploads/')) return;
  const file = path.join(config.uploadDir, path.basename(stored));
  fs.promises.unlink(file).catch(() => {});
}

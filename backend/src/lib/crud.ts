import { Router, type Request } from 'express';
import { z } from 'zod';
import { HttpError } from './errors.js';
import { slugify } from './text.js';
import { imageUpload, publicPath, removeUpload } from './upload.js';

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Minimal shape shared by the Prisma model delegates we use. */
interface Delegate {
  findMany(args?: any): Promise<any[]>;
  findUnique(args: any): Promise<any | null>;
  findFirst(args: any): Promise<any | null>;
  create(args: any): Promise<any>;
  update(args: any): Promise<any>;
  delete(args: any): Promise<any>;
}

export interface ResourceOptions<S extends z.ZodType<Record<string, unknown>>> {
  delegate: Delegate;
  schema: S;
  /** Column that stores the uploaded image path, if the resource has one. */
  imageField?: string;
  /** If set, a `slug` column is generated from this field when left empty. */
  slugFrom?: keyof z.infer<S> & string;
  orderBy: unknown;
  /** Final adjustments before saving (sanitising HTML, publish dates, ...). */
  prepare?: (data: z.infer<S>, existing: any | null) => Record<string, unknown>;
}

// Multipart form fields arrive as strings; these helpers coerce them.
export const formBool = z.preprocess(
  (v) => v === true || v === 'true' || v === 'on' || v === '1',
  z.boolean(),
);
export const formInt = z.preprocess(
  (v) => (v === '' || v === undefined ? 0 : Number(v)),
  z.number().int().min(-100000).max(100000),
);
export const optionalUrl = z
  .string()
  .trim()
  .max(255)
  .refine((v) => v === '' || /^https?:\/\/\S+$/i.test(v), 'Must start with http:// or https://')
  .default('');

function parseId(req: Request): number {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) throw new HttpError(400, 'Invalid id');
  return id;
}

async function uniqueSlug(delegate: Delegate, base: string, excludeId?: number): Promise<string> {
  const root = base || 'item';
  for (let n = 1; ; n++) {
    const candidate = n === 1 ? root : `${root}-${n}`;
    const clash = await delegate.findFirst({
      where: { slug: candidate, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
      select: { id: true },
    });
    if (!clash) return candidate;
  }
}

/** Builds list / get / create / update / delete routes for one admin resource. */
export function crudRouter<S extends z.ZodType<Record<string, unknown>>>(
  opts: ResourceOptions<S>,
): Router {
  const router = Router();
  const { delegate, imageField } = opts;

  router.get('/', async (_req, res) => {
    res.json(await delegate.findMany({ orderBy: opts.orderBy }));
  });

  router.get('/:id', async (req, res) => {
    const item = await delegate.findUnique({ where: { id: parseId(req) } });
    if (!item) throw new HttpError(404, 'Not found');
    res.json(item);
  });

  async function save(req: Request, existing: any | null) {
    const parsed = opts.schema.parse(req.body ?? {});
    const data: Record<string, unknown> = opts.prepare
      ? opts.prepare(parsed, existing)
      : { ...parsed };

    if (opts.slugFrom) {
      const wanted = slugify(String(data.slug || data[opts.slugFrom] || ''));
      data.slug = await uniqueSlug(delegate, wanted, existing?.id);
    }

    let oldImage: string | null = null;
    if (imageField) {
      if (req.file) {
        data[imageField] = publicPath(req.file.filename);
        oldImage = existing?.[imageField] ?? null;
      } else if (req.body?.removeImage === 'true') {
        data[imageField] = null;
        oldImage = existing?.[imageField] ?? null;
      }
    }

    const saved = existing
      ? await delegate.update({ where: { id: existing.id }, data })
      : await delegate.create({ data });
    removeUpload(oldImage);
    return saved;
  }

  // If anything fails after multer stored a new file, delete that file again.
  const withUploadCleanup =
    (handler: (req: Request) => Promise<{ status: number; body: unknown }>) =>
    async (req: Request, res: any) => {
      try {
        const { status, body } = await handler(req);
        res.status(status).json(body);
      } catch (err) {
        if (req.file) removeUpload(publicPath(req.file.filename));
        throw err;
      }
    };

  const upload = imageField ? [imageUpload] : [];

  router.post(
    '/',
    ...upload,
    withUploadCleanup(async (req) => ({ status: 201, body: await save(req, null) })),
  );

  router.put(
    '/:id',
    ...upload,
    withUploadCleanup(async (req) => {
      const existing = await delegate.findUnique({ where: { id: parseId(req) } });
      if (!existing) throw new HttpError(404, 'Not found');
      return { status: 200, body: await save(req, existing) };
    }),
  );

  router.delete('/:id', async (req, res) => {
    const removed = await delegate.delete({ where: { id: parseId(req) } });
    if (imageField) removeUpload(removed[imageField]);
    res.status(204).end();
  });

  return router;
}

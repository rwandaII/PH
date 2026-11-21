import { z } from 'zod';
import { prisma } from '../db.js';
import { crudRouter, formBool, formInt, optionalUrl } from '../lib/crud.js';
import { SITE_IMAGE_PLACES } from '../lib/site-images.js';
import { TEAM_CATEGORIES } from '../lib/team-categories.js';
import { cleanHtml } from '../lib/text.js';

const text = (max: number) => z.string().trim().max(max).default('');

/** YouTube, Vimeo, Facebook, or a direct link to a video file. */
const videoLink = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) => v === '' || /^https:\/\/(www\.|m\.)?(youtube\.com|youtu\.be|vimeo\.com|player\.vimeo\.com|facebook\.com|fb\.watch)\/\S+$/i.test(v) || /^https:\/\/\S+\.(mp4|webm|mov|ogv)(\?\S*)?$/i.test(v),
    'Paste a YouTube, Vimeo or Facebook video link',
  )
  .default('');

export const newsRouter = crudRouter({
  delegate: prisma.news,
  imageField: 'coverImage',
  alsoRemove: ['videoFile'],
  slugFrom: 'title',
  orderBy: [{ createdAt: 'desc' }],
  schema: z.object({
    title: z.string().trim().min(1, 'Title is required').max(200),
    slug: text(220),
    excerpt: text(500),
    content: z.string().max(2_000_000).default(''),
    videoUrl: videoLink,
    isPublished: formBool.default(false),
  }),
  prepare: (data, existing) => ({
    ...data,
    content: cleanHtml(data.content),
    // Stamp the publish date the first time a post goes live.
    publishedAt: data.isPublished ? (existing?.publishedAt ?? new Date()) : null,
  }),
});

export const projectsRouter = crudRouter({
  delegate: prisma.project,
  imageField: 'coverImage',
  slugFrom: 'title',
  orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  schema: z.object({
    title: z.string().trim().min(1, 'Title is required').max(200),
    slug: text(220),
    summary: text(500),
    content: z.string().max(2_000_000).default(''),
    location: text(200),
    status: z.enum(['planned', 'ongoing', 'completed']).default('ongoing'),
    sortOrder: formInt.default(0),
    isPublished: formBool.default(false),
  }),
  prepare: (data) => ({ ...data, content: cleanHtml(data.content) }),
});

export const teamRouter = crudRouter({
  delegate: prisma.teamMember,
  imageField: 'photo',
  slugFrom: 'name',
  orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  schema: z.object({
    name: z.string().trim().min(1, 'Name is required').max(120),
    slug: text(140),
    role: z.string().trim().min(1, 'Role is required').max(120),
    category: z.enum(['', ...TEAM_CATEGORIES]).default(''),
    bio: text(5000),
    email: z
      .string()
      .trim()
      .max(190)
      .refine((v) => v === '' || z.string().email().safeParse(v).success, 'Enter a valid email')
      .default(''),
    phone: text(60),
    address: text(255),
    expertise: text(500),
    washYears: text(40),
    competence: text(255),
    languages: text(255),
    education: text(1000),
    joinedYear: z.preprocess(
      (v) => (v === '' || v === undefined || v === null ? null : Number(v)),
      z.number().int().min(1950, 'Enter a year such as 2015').max(2100, 'Enter a year such as 2015').nullable(),
    ),
    facebookUrl: optionalUrl,
    twitterUrl: optionalUrl,
    linkedinUrl: optionalUrl,
    instagramUrl: optionalUrl,
    whatsapp: text(60),
    sortOrder: formInt.default(0),
  }),
});

export const partnersRouter = crudRouter({
  delegate: prisma.partner,
  imageField: 'logo',
  orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  schema: z.object({
    name: z.string().trim().min(1, 'Name is required').max(160),
    websiteUrl: optionalUrl,
    description: text(5000),
    scope: z.enum(['international', 'local']).default('local'),
    place: text(160),
    badge: text(60),
    contacts: text(5000),
    contactPeople: text(5000),
    sortOrder: formInt.default(0),
  }),
});

/** "YYYY-MM-DD" from a date input, or empty for no date. */
const formDate = z.preprocess(
  (v) => (v === '' || v === undefined || v === null ? null : String(v).slice(0, 10)),
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a date such as 2014-01-07')
    .refine((v) => !Number.isNaN(Date.parse(`${v}T00:00:00Z`)), 'Enter a real date')
    .nullable(),
);

export const certificatesRouter = crudRouter({
  delegate: prisma.certificate,
  imageField: 'image',
  orderBy: [{ sortOrder: 'asc' }, { issuedOn: 'desc' }, { createdAt: 'desc' }],
  schema: z.object({
    title: z.string().trim().min(1, 'Title is required').max(200),
    kind: z.enum(['certificate', 'appreciation']).default('certificate'),
    issuer: text(200),
    issuedOn: formDate,
    description: text(5000),
    sortOrder: formInt.default(0),
    isPublished: formBool.default(false),
  }),
  prepare: (data) => ({
    ...data,
    issuedOn: data.issuedOn ? new Date(`${data.issuedOn}T00:00:00Z`) : null,
  }),
});

/** Pictures in the site's picture places (page-header sliders and single spots). */
export const siteImagesRouter = crudRouter({
  delegate: prisma.siteImage,
  imageField: 'image',
  orderBy: [{ place: 'asc' }, { sortOrder: 'asc' }, { id: 'asc' }],
  schema: z.object({
    place: z.enum(SITE_IMAGE_PLACES),
    caption: text(200),
    sortOrder: formInt.default(0),
  }),
});

export const servicesRouter = crudRouter({
  delegate: prisma.service,
  imageField: 'photo',
  slugFrom: 'title',
  orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
  schema: z.object({
    title: z.string().trim().min(1, 'Title is required').max(120),
    slug: text(140),
    summary: z.string().trim().min(1, 'A short summary is required').max(500),
    includes: text(3000),
    details: text(10000),
    sortOrder: formInt.default(0),
  }),
});

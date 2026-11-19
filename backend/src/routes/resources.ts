import { z } from 'zod';
import { prisma } from '../db.js';
import { crudRouter, formBool, formInt, optionalUrl } from '../lib/crud.js';
import { cleanHtml } from '../lib/text.js';

const text = (max: number) => z.string().trim().max(max).default('');

export const newsRouter = crudRouter({
  delegate: prisma.news,
  imageField: 'coverImage',
  slugFrom: 'title',
  orderBy: [{ createdAt: 'desc' }],
  schema: z.object({
    title: z.string().trim().min(1, 'Title is required').max(200),
    slug: text(220),
    excerpt: text(500),
    content: z.string().max(2_000_000).default(''),
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
    bio: z.string().trim().min(1, 'A biography is required').max(5000),
    email: z
      .string()
      .trim()
      .max(190)
      .refine((v) => v === '' || z.string().email().safeParse(v).success, 'Enter a valid email')
      .default(''),
    phone: text(60),
    address: text(255),
    expertise: text(500),
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

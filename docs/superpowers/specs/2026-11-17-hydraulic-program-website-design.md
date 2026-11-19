# Hydraulic Program Website — Design

Date: 2026-11-17
Status: Draft — awaiting approval

## 1. Intent

A website for a hydraulic (water) program. Its main job is to let the public
see what the program does. A small number of admins keep it up to date through
a private dashboard — no developer needed to post news or change content.

## 2. Who uses it

- **Visitors (public, no login):** read about the program, its news, its team
  and its partners.
- **Admins (one or a few, login required):** manage all content from the
  dashboard. Every admin can manage everything — no per-user roles, no "own
  posts".

## 3. Goals

- Public pages that load fast and are well indexed by search engines.
- Admins can create / edit / delete:
  - **News** (with a cover image)
  - **About / program information** (mission, description, contact details)
  - **Team member profiles** (photo, name, role, short bio, display order)
  - **Partners** (logo, name, website link, short description, display order)
- Changes saved in the dashboard appear on the public site immediately.

## 4. Non-goals

- Visitor accounts, comments, likes, newsletters, payments.
- Per-admin roles or permissions.
- Team members logging in to edit their own profile.

## 5. Anti-goals (failure even if it "works")

- Any dashboard page or write API reachable without logging in.
- Content that can only be changed by editing code.
- Public pages that render empty for search engines (client-only rendering).

## 6. Constraints (decided by the user)

- Frontend: **Next.js** (chosen for SEO and speed on an information site).
- Backend: **Express**.
- Database: **MySQL**.

## 7. Approaches considered

| | Approach | Trade-off |
|---|---|---|
| **A (chosen)** | One Next.js app containing the public site **and** `/dashboard`, plus a separate Express REST API over MySQL | One frontend to build and deploy; shared styling. Admin code ships with the frontend — irrelevant at this size. |
| B | Next.js public site + separate React dashboard app + Express API | Full separation, but two frontend projects to maintain for no real gain. |
| — (dropped) | Next.js only, using its own API routes | Contradicts the decision to use Express. |

User picked **A**.

## 8. Architecture

```
new program hydrolic/
├── frontend/   Next.js (App Router)
│   ├── public pages:  /, /about, /news, /news/[slug], /partners, /contact
│   └── admin pages:   /dashboard/login, /dashboard (news, about, team,
│                      partners, messages, admins)
├── backend/    Express REST API
│   ├── /api/public/...   read-only endpoints for the site
│   ├── /api/admin/...    protected CRUD endpoints
│   ├── /api/auth/...     login / logout / me
│   └── /uploads/...      uploaded images served statically
└── MySQL
```

- Public pages are **server-rendered** by Next.js, fetching from the Express
  public endpoints with no caching (`cache: 'no-store'`), so edits show up
  immediately.
- The dashboard is a client-side area under `/dashboard` that calls the
  Express admin endpoints.
- Express is the only thing that touches MySQL and the uploads folder.

## 9. Data model (initial)

- **admins** — id, name, email (unique), password_hash, created_at
- **news** — id, title, slug (unique), excerpt, content, cover_image,
  is_published, published_at, created_at, updated_at
- **team_members** — id, name, role, bio, photo, sort_order, created_at,
  updated_at
- **partners** — id, name, logo, website_url, description, sort_order,
  created_at, updated_at
- **site_info** — single row: program_name, tagline, hero_text, mission,
  vision, about_text, contact_email, phone, address, social links
- **contact_messages** — id, name, email, subject, message, is_read,
  created_at

## 10. Key behaviours

- **Auth:** email + password; passwords hashed with bcrypt; session held as a
  JWT in an httpOnly, SameSite cookie. Every `/api/admin/*` route requires it.
  The first admin is created by a seed script; logged-in admins can add or
  remove other admins and change their own password.
- **Uploads:** `multer`, images only (jpg, png, webp), max 5 MB, saved to
  `backend/uploads/` with generated filenames, served at `/uploads/...`.
  Replacing or deleting a record deletes its old image file.
- **News:** drafts vs. published; only published news is visible publicly.
  Slug generated from the title, editable.
- **Ordering:** team members and partners have a `sort_order` the admin can
  change.
- **Contact form:** saves the message to the database; admins read it in the
  dashboard and can mark it read / delete it.
- **Validation:** all input validated on the server (e.g. with zod); news
  content sanitized before storing/rendering.

## 11. Calls made by Claude (user may override)

- **Prisma** as the MySQL access layer (schema, migrations, safe queries).
- **TypeScript** for both frontend and backend.
- **Tailwind CSS** for styling, with a water-themed blue palette.
- **News editor:** a simple rich-text editor (headings, bold, lists, links,
  images) stored as sanitized HTML.
- **Images on local disk** served by Express. If the site is later hosted
  somewhere without persistent disk, swap to a cloud image service.
- **Contact form stores messages** in the database (rather than only showing
  contact details).
- **Site language: English.** Program name, logo and colours are placeholders
  editable via `site_info` until the real ones are provided.
- **Tests:** backend API tests (Jest + supertest) against a separate test
  database, covering auth protection and CRUD for each resource.

## 12. Left to the builder

- Exact page layouts and visual design within the water theme.
- Folder structure inside `frontend/` and `backend/`.
- Hosting/deployment (out of scope for the first version).

## 13. Decisions after review

The user said "do it" — proceed on Claude's judgement:

- **Projects section added.** Table `projects` — id, title, slug (unique),
  summary, content, cover_image, location, status (planned / ongoing /
  completed), sort_order, is_published, created_at, updated_at. Public pages
  `/projects` and `/projects/[slug]`; managed in the dashboard like news.
- **English only.** No multi-language support in v1.
- **MySQL 8.4** is installed locally and running (Windows service `MySQL84`,
  port 3306). Connection string lives in `backend/.env`.

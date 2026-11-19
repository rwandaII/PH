# Hydraulic Program website

Public website and staff dashboard for the Hydraulic Program.

- `frontend/` — Next.js 16 (App Router, Tailwind 4, TypeScript). The public site and the
  dashboard at `/dashboard`. The design follows alueducation.com (navy, red, Bitter + Montserrat).
- `backend/` — Express 5 API with Prisma 6 and MySQL 8. Handles content, image uploads,
  contact messages and admin logins (JWT in an httpOnly cookie).

The browser only talks to the Next.js app; it forwards `/api/*` and `/uploads/*` to Express,
so the login cookie stays first-party.

## Requirements

- Node.js 20 or newer
- MySQL 8 running locally (or any reachable MySQL 8 server)

## Starting the site (this computer)

This computer runs a separate MySQL just for the website, on port 3307, with its data in
`%LOCALAPPDATA%\HydraulicProgram\mysql-data`. Your other MySQL (port 3306) is not used or
changed. The connection details, including its password, are in `backend/.env`.

Open three terminals:

```bash
# 1. the website's database
cd backend
npm run db:start

# 2. the API
cd backend
npm run dev                         # http://localhost:4000

# 3. the site
cd frontend
npm run dev                         # http://localhost:3000
```

Open http://localhost:3000 for the public site and http://localhost:3000/dashboard to log in
with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `backend/.env`. Change that password after your
first login (Dashboard → My password).

## First-time setup (a new computer)

```bash
cd backend
npm install
```

Edit `backend/.env`: set `DATABASE_URL` to your MySQL server (the database is created for
you), and `ADMIN_EMAIL` / `ADMIN_PASSWORD` for the first dashboard login. `JWT_SECRET` must be
a long random value.

```bash
npm run db:deploy        # creates the database tables
npm run db:seed          # creates the first admin and the site settings
npm run dev

cd ../frontend
npm install
npm run dev
```

Note for MySQL: TEXT columns cannot have a plain default value, so the schema uses
expression defaults (`@default(dbgenerated("('')"))`).

## Everyday use

Everything on the public site is edited in the dashboard:

| Dashboard page        | Shows up on the site                                      |
| --------------------- | --------------------------------------------------------- |
| News                  | News page, story pages, home page (published stories only) |
| Projects              | Projects page, project pages, home page                    |
| Team members          | About page, home page                                      |
| Partners              | Partners page, home page                                   |
| About & contact info  | Home page text, About page, Contact page, footer           |
| Messages              | Messages sent through the Contact page                     |

Stories and projects without a photo show one of the built-in water illustrations.
Uploaded images are stored in `backend/uploads/` (JPG, PNG or WEBP, up to 5 MB).

## Tests

The backend tests (30) run against a separate database, `hydraulic_program_test` (the name
from `DATABASE_URL` plus `_test`, or `TEST_DATABASE_URL` if set). Migrations are applied
automatically and every test empties the tables first, so your real data is never touched.
The website database must be running (`npm run db:start`).

```bash
cd backend
npm test
```

Checks for the frontend:

```bash
cd frontend
npx tsc --noEmit
npm run lint
npm run build
```

## Production

```bash
# backend
cd backend
npm run build
npm run db:deploy        # apply migrations to the production database
NODE_ENV=production npm start

# frontend
cd frontend
npm run build
BACKEND_URL=http://localhost:4000 npm start
```

In production set `NODE_ENV=production` for the backend (secure cookies), set `CORS_ORIGINS`
to the site's address, and back up both the MySQL database and `backend/uploads/`.

## Project notes

`docs/PROGRESS.md` records what has been built and what is next. The design spec is in
`docs/superpowers/specs/`.

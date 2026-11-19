# Progress — Hydraulic Program website

Last updated: 2026-11-18 (public site rebuilt in the ALU-style design)

Design spec: `docs/superpowers/specs/2026-11-17-hydraulic-program-website-design.md`
Design prototype (canvas): https://claude.ai/artifact/2qEneXKDGJ48QzAt7GwTc9
(Home, Projects, Dashboard news list, Dashboard story editor)

## Done

### Backend (`backend/`) — Express 5 + Prisma 6 + MySQL, TypeScript
- `prisma/schema.prisma`: admins, news, projects, team_members, partners,
  site_info (single row), contact_messages.
- Routes: `/api/auth` (login/logout/me, JWT httpOnly cookie, rate-limited),
  `/api/public/*` (site, home, news, projects, team, partners, contact),
  `/api/admin/*` (CRUD news/projects/team/partners with image upload, site info,
  messages, admins, change password, stats). Generic CRUD in `src/lib/crud.ts`.
- Image uploads via multer → `backend/uploads/`, served at `/uploads`.
- `prisma/seed.ts` creates the first admin + site_info from `.env`.
- `.env` created with a random JWT_SECRET; **DATABASE_URL still has the
  placeholder `YOUR_MYSQL_PASSWORD`**.
- `npx tsc --noEmit` passes.

### Frontend (`frontend/`) — Next.js 16 (App Router), Tailwind 4, TypeScript
- `cacheComponents` turned OFF in `next.config.ts`; rewrites proxy `/api/*`
  and `/uploads/*` to Express (BACKEND_URL, default http://localhost:4000).
- Design tokens in `src/app/globals.css` (deep #0e3b4a, river #1f6f8b,
  shallow #7cc3c9, foam, paper #f5f8f7, sun #e8a922); fonts Archivo (expanded)
  + Public Sans in `src/app/layout.tsx`.
- Public pages in `src/app/(site)/`: home, about (+team), projects,
  projects/[slug], news (paginated), news/[slug], partners, contact (+form).
- Components: SiteHeader, SiteFooter, Contours (hero), StatusGauge, PageIntro,
  ContactForm. `src/lib/`: server-api, types, format.
- Tiptap (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/pm`) installed.
- **Not yet built or linted.**

### Design (2026-11-18): modelled on alueducation.com
- Prototype canvas (all screens, measured against ALU): https://claude.ai/artifact/2qEneXKDGJ48QzAt7GwTc9
- Tokens in `frontend/src/app/globals.css`: navy #002e6d, red #d00d2d, brick #c0272d/#b93131,
  maroon #8b191f; fonts Montserrat (body), Bitter (headings), Open Sans (long text).
- Images in `frontend/public/illustrations/` (water illustrations used when a story or
  project has no photo, plus hero-bg.png and panorama.svg) and `public/patterns/` (cube tiles).

### Public site rebuilt (frontend/src)
- Components: SiteHeader, SiteFooter, TopButton, HeroSlider, TeamCarousel, PageBanner,
  Headings (TwoTone, Ruled), StoryCard, ArticleLayout, ProjectsBrowser (status filter),
  ContactForm, icons, Logo. Removed Contours, PageIntro, StatusGauge.
- Pages: home, about, projects, projects/[slug], news, news/[slug], partners, contact, not-found.
- `getPublicOr()` in lib/server-api.ts: pages render empty sections if the API is down.
- `tsc --noEmit` and `eslint` pass. Checked visually at 1440px and 390px against the
  prototype, using a throwaway mock API with sample data (not part of the repo).

### Admin dashboard built (frontend/src/app/dashboard)
- `/dashboard/login`; everything else is inside the `(panel)` group, which checks the session
  with `/api/auth/me` (a 401 sends the browser to the login page with `?next=`).
- Generic, config-driven list + form for news, projects, team, partners
  (`lib/dashboard/resources.ts`, `components/dashboard/ResourceList.tsx`, `ResourceForm.tsx`):
  multipart with `image` / `removeImage`, field errors from the API, inline delete confirmation.
- Tiptap story editor (`RichTextEditor.tsx`). Gotcha: Tiptap re-applies options whenever they
  change identity, so extensions are a module constant, content is passed once, and
  editorProps is memoised; toolbar buttons use onMouseDown preventDefault to keep focus.
- Also: overview (counts), About & contact info, messages (open = mark read, unread badge),
  admin accounts, change password.
- Tested end to end against a throwaway mock API (login, create with formatting + image,
  publish, edit, public page shows it, site info, messages, admins, password, delete, logout).
- `tsc`, `eslint` and `next build` pass.

### Database connected (2026-11-18)
- The user does not know the root password of the existing MySQL84 service and chose not to
  reset it. So the site uses its own MySQL 8.4 instance: port 3307, data in
  `%LOCALAPPDATA%\HydraulicProgram\mysql-data`, started with `npm run db:start` in backend/.
  Its root password was generated and is stored only in `backend/.env`.
- Schema fix: MySQL rejects plain defaults on TEXT columns; those six columns now use
  `@default(dbgenerated("('')"))`. Migration `init` applied; seed created admin@hydraulic.local.
- Backend tests: 30 passing (vitest + supertest, database hydraulic_program_test; global
  setup runs `prisma migrate deploy`; Prisma refuses destructive resets from AI agents).
- End-to-end check against the real backend passed (login, publish story with image, public
  pages, contact message, delete, logout); test data removed afterwards.
- Fixed: the dashboard image picker accepted GIF (backend allows JPG/PNG/WEBP only); the red
  band's big letter was cut off for short intros (band min height 425px, as on ALU).

### Water colours (2026-11-18)
- At the user's request the palette changed from ALU navy/red to water colours (layout unchanged):
  accent #0077b6 (buttons, links, rules), band #0077b6 / band-2 #0369a1, deep #023e7d,
  aqua #48cae4 for small accents on navy, mist #e6f2f7; navy header/footer kept; cube tiles in
  blues. Tokens renamed in code: red→accent, brick→band, maroon→deep, btn-red→btn-primary.
  Danger red is kept for errors and deletes.
- Imported news: "Hydraulic Program of Ruhengeri Diocese in perspective of youth promotion"
  (from the program's Word document, 11 photos). Story photos show two per row (.richtext img).

### Motion (2026-11-18)
- Hero slideshow autoplays every 7 s with slide-in animations; pauses on hover/focus, hidden tab,
  a visible pause/play button, and prefers-reduced-motion. Hero background drifts slowly.
- Scroll reveal: add `{...reveal(i, kind?)}` (src/lib/reveal.ts) to any element; the client
  `RevealOnScroll` (components/site/Motion.tsx, mounted in the site layout) shows it on scroll,
  including elements added later. Elements are only hidden when `html.js` is set by an inline
  script in the root layout, so content stays visible without JavaScript.
- `CountUp` animates the completed-projects number and the About figures.
- Checked: nothing left hidden after scrolling, autoplay/hover/pause, reduced motion, JS off,
  production build.

### Real content (2026-11-18)
- Filled from the program's Word document (by Marie Yvonne INGABIRE, PH Coordinator) and the
  Diocese of Ruhengeri's public contact details (dioceseruhengeri.org): site info, 4 projects
  (the program's areas of work: water supply systems, hygiene and sanitation (ATPC), youth
  capacity building, environmental protection; all "ongoing", location "Ruhengeri Diocese"),
  1 team member, 2 partners named in the document, 1 news article. 11 real photos.
- Nothing was invented: no extra partners, people or projects. The contact details are the
  Diocese's; replace them with the program's own office details if it has them.
- Page banners now use real photos (photoTiles in lib/illustrations.ts); the home progress
  circle shows ongoing work until some projects are completed.

### Design polish (2026-11-18, later)
- Home partners section rebuilt after ALU's "Begin your bachelor's degree journey" block, in water
  colours: dark ocean gradient, framed photo of PH staff with partner representatives
  (public/photos/staff-and-partners.jpg), "In partnership with" logo badge, white partners card,
  notice strip, "Become a partner" link.
- Partners: MISEREOR added (logo from misereor.org, first in the list); Diocese of Ruhengeri logo
  from dioceseruhengeri.org, recoloured navy. Ask the program to confirm logo use with MISEREOR.
- Home news section has a "From the field, latest news." heading and an ALL NEWS link.
- Photo backgrounds: hero shows each slide's photo tinted deep blue under the dotted waves
  (cross-fades per slide); "Our Stories" has a full tinted photo (public/photos/stories-bg.jpg).
- Responsive pass: checked 9 pages at 360/390/768/1024/1280/1440/1920 with no sideways scroll, no
  broken images and nothing left hidden. Tablet layouts now stack below 1024px (partners, stories);
  article sidebar is a 3/2-column grid on tablet/phone; main has overflow-x: clip for slide-in motion.
- News: 4 more stories written only from the Word document's sections and photos (youth hygiene
  training, youth building water systems, hygiene clubs and small businesses, environmental campaign),
  each citing the document; 5 published in total. /api/public/home now returns 4 news. The Home news
  section is a magazine layout: a large featured story plus 3 compact cards, on a soft mist background.
- "Not AI-looking" pass (user request): the Home news section is an editorial layout (lead story with
  an offset mist-blue block behind its photo, three quiet entries). Site-wide: headings are plain
  sentence case (TwoTone renders one line), all-caps labels are now sentence case, there's no middle-dot
  joining, and the motion is a single quiet fade per section (no slide/pop/stagger, no card lifts or light sweep).
  Kept on purpose: header nav caps and the HP logo wordmark. Dashboard buttons are still in caps.
- Projects redesign: the Home "Our work" section (ProjectsShowcase) is an index of large project titles
  with a photo and facts preview that follows hover/focus (full list on phones). The Projects page is
  underlined status tabs with counts plus alternating photo/text rows with a Where/Status panel.
  /api/public/home now returns up to 6 projects.
- ALU programme-page design on inner pages (from the user's screen recording of ALU's BSc page):
  components/site/ProgramLayout.tsx (ProgramHero photo header, FactsBand with cube pattern and curved
  corner, ArchPhoto, DarkBand, OutlineLink) and components/site/PageNav.tsx (WithPageNav: the white
  "On this page" card that overlaps the header, stays pinned while scrolling, highlights the current
  section, and is hidden below 1024px). Used on About, Projects (one alternating section per project),
  each project page (about + arch photo, photos from the field, other projects) and News (latest story
  + two-column list). Home is unchanged. Partners and Contact keep their own layouts.
- Back-to-top is now a water drop (TopButton.tsx); it shows only while scrolling up, after 500px.
- Removed the unused ProjectsBrowser and StoryCard components.
- Photos: the site now uses only the program's own photos (user's camera, D:\DCIMTD7100), as
  1800px copies in frontend/public/photos/field/<what-it-shows>.jpg. Every project and news story uses
  them (the old document photos and their captions were removed, and the Source line was kept). About header =
  diocese-offices.jpg; Home partners photo = school-welcome-1.jpg; Our stories = visitor-at-tap.jpg.
- Cut-out portrait (public/photos/portrait-cutout.png, made from a white-background portrait by
  flood-filling the background) stands in front of a solid blue arch on About > Who we are
  (ArchPhoto `cutout`). Other arches use whole photos. Cutting people out of field photos needs a
  background-removal tool (rembg), which wasn't installed (permission denied).
- Back-to-top is now a plain navy square with an arrow and "Top"; it fades in on scroll-up.
- News redesign: /news has a full-photo cover story, alternating story rows with photo counts, and a
  gallery strip. Each story page (news/[slug]) has a full-photo cover, a reading-progress bar, the
  floating card, a large introduction, a drop cap, share links (WhatsApp, Facebook, X, email, copy link),
  photos in a full-screen viewer (PhotoViewer.tsx), comments, and "Keep reading".
- Comments: table news_comments (migration 20261118140000_team_profiles_and_comments). Readers post
  via POST /api/public/news/:slug/comments (rate-limited, with a hidden spam-trap field). Comments show only
  after staff approve them in Dashboard > Comments (GET/PATCH/DELETE /api/admin/comments).
  /admin/stats has pendingComments.
- Team pages: team_members gained slug, email, phone, address and expertise. /team/[slug] shows the
  full profile; the About page and Home team carousel link to it. Empty contact fields fall back to the
  program office. The new fields are editable in the dashboard.
- Gallery: GET /api/public/gallery (albums of every photo per published story or project) and a new
  /gallery page with filters and the full-screen viewer; "Gallery" is in the menu and footer.
- Copy protection (NoCopy.tsx + .no-copy CSS): blocks select, copy, cut, right-click, image drag and
  Ctrl/Cmd+C/X/S/U/A outside form fields on the public site. This deters copying but can't prevent it.
- Back-to-top: navy rounded square with a white water drop, 96px from the bottom. It pops up only while
  scrolling up and hides 1.5s after scrolling stops.
- Backend tests: 35 pass (test/engagement.test.ts is new). Note: migrate dev doesn't work in this
  non-interactive shell; generate SQL with `prisma migrate diff --from-schema-datasource ...
  --to-schema-datamodel ... --script`, then `migrate deploy`. Stop the API server before `prisma generate`
  (the engine DLL is locked on Windows).
- Team profile page: the picture is an arch (ProfileArch.tsx). A transparent PNG stands in front of a
  blue arch with the head above it, a normal photo fills the arch, and with no photo a silhouette stands in.
  On opening, a water drop falls onto the picture, splashes and ripples (CSS "Profile arch"; off for
  reduced motion). The biography is now required. New fields: languages, education (one item per line),
  joinedYear, and Facebook, X, LinkedIn, Instagram and WhatsApp (migration 20261118160000_team_profile_details).
  Social icons appear in the header and in a "Find ... on" list in Contact.
- The "On this page" card no longer follows the scroll on any page (sticky removed). On profiles it sits
  below the picture (overlap -36).
- If the dev server serves old CSS, port 3000 may still be held by an old node process: stop it by PID
  (TaskStop ends only the shell), then restart.
- Project photos: FramedPhoto (ProgramLayout.tsx). The whole photo, untinted, with an offset solid blue
  block, a cube-pattern corner and a white label (status, place). It's used on every project part: the
  Projects page (all sections now share one design on alternating white and mist, the navy band is
  gone), each project page, and the Home "Our work" preview. The arch remains only for the
  About cut-out portrait.
- Services: lib/services.ts holds the four pillars from the program's document (water supply, hygiene
  and sanitation, capacity building, environmental protection). Home has "Our services"
  (ServicesSection.tsx, from the user's recording of ALU's programmes block: a photo panel plus white
  columns with ruled lists and Learn more buttons). Each Learn more opens /about#service-<slug>, and the
  About page has a full "Our services" section. The text lives in code, not the dashboard.
- "Technology water" texture (TechLines.tsx + public/patterns/water-lines-light.svg and water-lines-soft.svg, about 52KB compressed each).
  Regenerate it with `node scripts/water-dots.mjs` in frontend/. It is now thin, continuous, horizontal
  wavy lines about 12 units apart, in subtle blues close to the background so they are hard to notice: #5aa6e4 at 0.3 on blue backgrounds, and dark blue #0b3a78 at 0.6 over photos, clearly visible (`right="soft"` on ProgramHero and the News and story covers; the user asked for visible dark-blue lines on pictures)., on BOTH sides of every
  header; a mask hides them completely in the middle (where the text is), and the left side is a mirrored
  copy. The animation lives inside the SVG: the lines travel slowly sideways towards the middle
  (one period per 34s), and three interleaved sets rise and fall on different rhythms so the surface
  ripples. The sets travel at the same speed so lines never cross. It's still for reduced motion.
  Earlier dotted/ring versions were replaced at the user's request.

## Next steps
1. (Done, using a separate MySQL on port 3307) Get the MySQL root password from the user → put it in `backend/.env`,
   then `npm run db:migrate -- --name init` and `npm run db:seed` in `backend/`.
2. (Done) Build the dashboard in `frontend/src/app/dashboard/`:
   client API helper, layout with auth check (redirect to /dashboard/login),
   login page, overview (stats), generic list + form for news/projects/team/
   partners (config-driven, multipart with `image` field and `removeImage`),
   rich-text editor component (Tiptap, `immediatelyRender: false`),
   site info form, messages, admin accounts + change password.
3. (Done) Status filter on the public Projects page.
4. (Done) Backend tests (vitest + supertest) against a separate test database.
5. `npm run lint` and `npm run build` in frontend; run both servers and check
   pages end to end.
6. (Done) Root README and .gitignore. Not yet: `git init` (only if the user wants it).
- Back-to-top (latest): a water-blue drop on its own (no card behind it; thin white edge and a soft shadow), 96px from the bottom. It shows
  whenever the page is scrolled more than 320px (in either direction) and stays until the visitor is
  back at the top (no idle hiding).

## Dashboard update (2026-11-18)
- **Services are editable.** New `services` table (migration `20261118180000_services`); admin CRUD at
  `/api/admin/services`, public list at `/api/public/services`. The four services from
  `frontend/src/lib/services.ts` were copied in unchanged. Home "Our services" and the About services
  section now read from the API (`servicesFrom()`: "What it includes" is one item per line, "Full
  explanation" uses a blank line between paragraphs). `SERVICES` in that file is only the fallback.
- **Statistics page** (`/dashboard/statistics`): visitors today, last 7 and 30 days, pages viewed, a
  30-day visitors chart (hover a bar; "Show as table"), most viewed pages, latest comments, latest
  messages and what is published. Visits come from `VisitCounter` in the site layout, which posts the
  page address to `POST /api/public/track`. No cookies and no IP addresses are stored: table
  `page_views` (migration `20261118190000_page_views`) keeps only the day (Kigali time), the path and
  a daily one-way visitor code (`backend/src/lib/analytics.ts`). Dashboard pages and robots aren't
  counted. Admin endpoint: `GET /api/admin/analytics`.
- Sidebar: Statistics and Services links; "N waiting" badge on Comments (refreshes after approving or
  deleting). Overview: tiles for services and comments waiting, attention notes, quick actions.
- Look: sentence case everywhere (no ALL-CAPS buttons, labels or table headers); plain one-line page
  headings; the login panel uses the site's blue gradient with the moving water lines instead of
  the old hero-bg.png. Tables on phones no longer widen the page.
- **Team:** 10 sample profiles (made-up names, roles marked "(sample)", biography says it's a sample)
  plus Marie Yvonne INGABIRE first, all using `/photos/portrait-cutout.png`. Replace them with real
  people in Dashboard → Team members before launch.
- Tests: 37 passing (new: services, statistics).

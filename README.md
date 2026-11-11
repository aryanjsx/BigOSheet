# BigOSheet

Two things in one site, sharing one navbar, footer, theme (light and dark) and design:

- **A blog** that explains coding and DSA in plain English, with accounts, a personal library (saved and recently read articles) and an owner-only writing dashboard.
- **The Big O cheat sheet**: complexity tables for 34 data structures, algorithms and patterns, a growth playground, an algorithm visualizer, a quiz, code challenges, comparison and lookup tools, a roadmap with saved progress, and printable PDFs.

**Stack:** Next.js (App Router) · TypeScript · Postgres (`postgres` driver) · bcrypt passwords · server-side sessions · Vitest.

## Getting started

Requires Node 22.13 or newer.

```bash
npm install
cp .env.example .env.local   # on Windows PowerShell: Copy-Item .env.example .env.local
npm run db:local             # terminal 1: a throwaway local Postgres, no install needed
npm run dev                  # terminal 2
```

Then open `.env.local` and set:

| Variable | Required | What it does |
| --- | --- | --- |
| `DATABASE_URL` | yes | Postgres connection string. For local work use `postgres://postgres:postgres@localhost:5433/postgres`, the database that `npm run db:local` starts. Keep that terminal running while you use the app. |
| `ADMIN_PASSWORD` | yes | Password for the admin account. Without it nobody can log in as admin. |
| `ADMIN_EMAIL` | no | The admin's email. Defaults to `kumararyan1929@gmail.com`. |
| `SITE_URL` | no | The public URL, used for canonical links and the sitemap. |

Tables, the admin account and three sample articles are created automatically on the first request.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build and server |
| `npm run typecheck` | TypeScript check |
| `npm test` | Validate the cheat-sheet data, routes, growth maths, progress store and visualizer |
| `npm run validate` | Only the cheat-sheet content checks |
| `npm run db:local` | Local Postgres for development |

## Routes

| Route | Who | What |
| --- | --- | --- |
| `/` | everyone | Home: hero, latest articles, the cheat sheet, tags |
| `/blog` | everyone | All published articles, search, `?tag=` filter |
| `/<slug>` | everyone (drafts: admin only) | An article. "Singly Linkedlist" lives at `/singlylinkedlist` |
| `/login`, `/signup` | guests | Authentication |
| `/library` | logged in | Saved articles and reading history |
| `/admin` | admin | All articles (draft and published): edit, delete |
| `/admin/new`, `/admin/[id]/edit` | admin | Editor with draft, publish and preview |
| `/admin/users` | admin | List and delete users |
| `/topics`, `/topics/[id]` | everyone | All 34 topics with search and filters, and a page for each |
| `/basics`, `/data-structures`, `/sorting`, `/algorithms`, `/patterns` | everyone | Reference tables |
| `/lookup`, `/compare`, `/visualizer`, `/export` | everyone | Tools |
| `/roadmap`, `/quiz`, `/challenges`, `/revision` | everyone | Practice. Progress is saved in the browser |

Article slugs are the title in lowercase with only letters and digits. A clash with another article or a reserved name (`admin`, `blog`, `login`, and every cheat-sheet route) gets a number suffix. A slug is frozen once an article is published, so shared links never break.

## Project layout

```
src/app/                 Blog pages, auth, admin, sitemap, icons, social images
src/app/(sheet)/         Cheat-sheet pages (a route group, so URLs have no prefix)
src/app/sheet.css        Cheat-sheet styles, scoped under .sheet so they never touch the blog
src/actions/             Server actions: auth, reader (save, history), admin
src/components/          Shared UI, plus sections/ interactive/ layout/ home/ for the cheat sheet
src/data/                Cheat-sheet content: entries, lookup rows, quiz, challenges, roadmap
src/lib/                 Database, auth, posts, markdown, plus visualizer, growth, search, routes
tests/                   Vitest suites for the cheat-sheet data and logic
scripts/dev-db.mjs       Local Postgres for development
```

## Adding content

- **An article:** log in as admin, open **Write**, and use **Save draft** or **Publish**. Articles are Markdown.
- **A cheat-sheet topic or page:** edit `src/data/entries.ts` (topics) or add a folder under `src/app/(sheet)/` and list it in `src/lib/routes.ts`. It then appears in the navbar, footer and home page. Run `npm test` to catch missing links or broken data. See `CONTRIBUTING.md` for the details.

## Database schema

Tables are created automatically (`CREATE TABLE IF NOT EXISTS`, guarded by an advisory lock so concurrent cold starts are safe).

```
users(id, email UNIQUE (lowercase), name, password_hash, role 'user'|'admin', created_at)
sessions(token_hash PK, user_id → users, expires_at)
posts(id, slug UNIQUE, title, excerpt, tldr, content, emoji, level, status 'draft'|'published',
      author_id → users, reading_minutes, created_at, updated_at, published_at)
post_tags(post_id → posts, tag)                       PK(post_id, tag)
bookmarks(user_id → users, post_id → posts, created_at)           PK(user_id, post_id)
reading_history(user_id → users, post_id → posts,
                first_read_at, last_read_at, read_count)          PK(user_id, post_id)
login_failures(key PK, n, until_ms)                   throttle for repeated bad logins
meta(key, value)
```

Deleting a user cascades to their sessions, saves and history. Deleting an article cascades to its tags, saves and history. Cheat-sheet progress (learned topics, bookmarks, quiz scores) is stored in the browser, not the database.

## Authorization

- The admin is the account whose email equals `ADMIN_EMAIL`.
- That account is created at startup from `ADMIN_PASSWORD` and **cannot be claimed through the signup form**. Without this, anyone could register that email first and become admin, because emails are not verified.
- `/admin/*` pages and every admin server action call `requireAdmin()` on their own. Hiding a button is never the only protection.
- Admins cannot delete themselves or other admins.

## Deploying

Any host that runs Next.js and can reach a Postgres database works. Use your provider's pooled connection string for `DATABASE_URL`, and set `ADMIN_PASSWORD`, `ADMIN_EMAIL` and `SITE_URL` in the host's environment. Never commit `.env.local`. To change the admin password later, change `ADMIN_PASSWORD` and redeploy.

## Licence

MIT. See `LICENSE`.

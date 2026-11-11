# BigOSheet

Two things in one site:

- **A blog** for coding and DSA explained in plain English, with accounts, a personal library (saved and recently read) and an owner-only writing dashboard.
- **The Big O cheat sheet**: complexity tables for 34 data structures, algorithms and patterns, a growth playground, an algorithm visualizer, a quiz, code challenges, comparison and lookup tools, a roadmap with saved progress, and printable PDFs.

Both share one navbar, footer, theme (light and dark) and design.

**Stack:** Next.js (App Router) · Postgres (`postgres` driver) · bcrypt passwords · server-side sessions. Runs on Vercel.

## Run it locally

```bash
npm install
cp .env.example .env.local   # on Windows PowerShell, use: Copy-Item .env.example .env.local
npm run db:local             # terminal 1: throwaway local Postgres, no install needed
npm run dev                  # terminal 2
```

After copying the example, edit `.env.local` and set `ADMIN_PASSWORD`. For local development, set `DATABASE_URL` to the URL printed by `npm run db:local`. The local PGlite server must keep running in terminal 1 while the app is in use.

For local development use `DATABASE_URL=postgres://postgres:postgres@localhost:5433/postgres`. Tables, the admin account and three sample articles are created automatically on the first request.

## Routes

| Route | Who | What |
| --- | --- | --- |
| `/` | everyone | Home: hero, latest posts, the cheat sheet, tags |
| `/blog` | everyone | All published posts, search, `?tag=` filter |
| `/<slug>` | everyone (drafts: admin only) | An article, e.g. "Singly Linkedlist" lives at `/singlylinkedlist` |
| `/login`, `/signup` | guests | Authentication |
| `/library` | logged in | Saved posts and reading history |
| `/admin` | admin | All posts (draft and published), edit, delete |
| `/admin/new`, `/admin/[id]/edit` | admin | Editor with draft, publish, preview |
| `/admin/users` | admin | List and delete users |
| `/topics`, `/topics/[id]` | everyone | All 34 topics with search and filters, and a page for each |
| `/basics`, `/data-structures`, `/sorting`, `/algorithms`, `/patterns` | everyone | Reference tables |
| `/lookup`, `/compare`, `/visualizer`, `/export` | everyone | Tools |
| `/roadmap`, `/quiz`, `/challenges`, `/revision` | everyone | Practice (progress is saved in the browser) |

The cheat-sheet pages live in `src/app/(sheet)/`, their data in `src/data/`, and their styles in `src/app/sheet.css`, scoped under a `.sheet` class so they never affect the blog. Add a page to `src/lib/routes.ts` and it appears in the navbar, footer and home page.

```bash
npm test      # validates the cheat-sheet data, routes, growth maths and visualizer
```

Slugs are the title in lowercase with only letters and digits. Collisions or reserved words (`admin`, `blog`, `login`…) get a number suffix. A slug is frozen once a post is published, so shared links never break.

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

Deleting a user cascades to their sessions, saves and history. Deleting a post cascades to tags, saves and history.

## Authorization

- The admin is the account whose email equals `ADMIN_EMAIL` (`kumararyan1929@gmail.com`).
- That account is created at startup from `ADMIN_PASSWORD` and **cannot be claimed through the signup form**. Without this, anyone could register that email first and become admin, because emails are not verified.
- `/admin/*` pages and every admin server action call `requireAdmin()` on their own. Hiding a button is never the only protection.
- Admins cannot delete themselves or other admins.

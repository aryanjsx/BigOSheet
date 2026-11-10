# BigOSheet blog

A blog for coding and DSA explained in plain English, with accounts, a personal library (saved and recently read) and an owner-only writing dashboard.

**Stack:** Next.js (App Router) · Postgres (`postgres` driver) · bcrypt passwords · server-side sessions. Runs on Vercel.

## Run it locally

```bash
npm install
cp .env.example .env.local   # set ADMIN_PASSWORD, and DATABASE_URL (see below)
npm run db:local             # terminal 1: throwaway local Postgres, no install needed
npm run dev                  # terminal 2
```

For local development use `DATABASE_URL=postgres://postgres:postgres@localhost:5433/postgres`. Tables, the admin account and three sample articles are created automatically on the first request.

## Routes

| Route | Who | What |
| --- | --- | --- |
| `/` | everyone | Home: hero, latest posts, topics |
| `/blog` | everyone | All published posts, search, `?tag=` filter |
| `/<slug>` | everyone (drafts: admin only) | An article, e.g. "Singly Linkedlist" lives at `/singlylinkedlist` |
| `/login`, `/signup` | guests | Authentication |
| `/library` | logged in | Saved posts and reading history |
| `/admin` | admin | All posts (draft and published), edit, delete |
| `/admin/new`, `/admin/[id]/edit` | admin | Editor with draft, publish, preview |
| `/admin/users` | admin | List and delete users |

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

## Deploying on Vercel

1. Create a Postgres database (Neon through the Vercel Marketplace is the quickest) and copy its **pooled** connection string.
2. Import the repo in Vercel and add these environment variables (Settings → Environment Variables):
   - `DATABASE_URL`: the connection string
   - `ADMIN_EMAIL`: `kumararyan1929@gmail.com`
   - `ADMIN_PASSWORD`: a long random password. This is what you log in with as admin.
   - `SITE_URL`: your production URL
3. Deploy. The first request creates the tables and the admin account.

Never commit `.env.local`. To change the admin password later, change `ADMIN_PASSWORD` and redeploy.

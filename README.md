# BigOSheet blog

A blog for coding and DSA explained in plain English, with accounts, a personal library (saved and recently read) and an owner-only writing dashboard.

**Stack:** Next.js (App Router) · SQLite via Node's built-in `node:sqlite` (Node 22.13+) · bcrypt passwords · server-side sessions.

## Run it

```bash
npm install
cp .env.example .env.local   # then set ADMIN_PASSWORD
npm run dev
```

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

```
users(id, email UNIQUE, name, password_hash, role 'user'|'admin', created_at)
sessions(token_hash PK, user_id → users, expires_at)
posts(id, slug UNIQUE, title, excerpt, tldr, content, emoji, level, status 'draft'|'published',
      author_id → users, reading_minutes, created_at, updated_at, published_at)
post_tags(post_id → posts, tag)                       PK(post_id, tag)
bookmarks(user_id → users, post_id → posts, created_at)           PK(user_id, post_id)
reading_history(user_id → users, post_id → posts,
                first_read_at, last_read_at, read_count)          PK(user_id, post_id)
meta(key, value)
```

Deleting a user cascades to their sessions, saves and history. Deleting a post cascades to tags, saves and history.

## Authorization

- The admin is the account whose email equals `ADMIN_EMAIL` (`kumararyan1929@gmail.com`).
- That account is created at startup from `ADMIN_PASSWORD`, and **cannot be claimed through the signup form**. Without this, anyone could register that email first and become admin, because emails are not verified.
- `/admin/*` pages and every admin server action call `requireAdmin()` on their own. Hiding a button is never the only protection.
- Admins cannot delete themselves or other admins.

## Deploying

SQLite is a file, so host it on something with a persistent disk (a VPS, Fly.io, Railway with a volume). Serverless hosts such as Vercel have no persistent disk. There, swap `src/lib/db.ts` for Postgres. Everything else talks to the database through `src/lib/posts.ts`, `src/lib/auth.ts` and the actions.

Set `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `SITE_URL` in the host's environment.

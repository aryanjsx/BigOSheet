import "server-only";
import postgres from "postgres";
import bcrypt from "bcryptjs";
import { SEED_POSTS } from "./seed";

export type Sql = postgres.Sql;

export const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL ?? "kumararyan1929@gmail.com"
).toLowerCase();

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,            -- always stored lowercase
  name          TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  created_at    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

CREATE TABLE IF NOT EXISTS posts (
  id              SERIAL PRIMARY KEY,
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  excerpt         TEXT NOT NULL DEFAULT '',
  tldr            TEXT NOT NULL DEFAULT '',
  content         TEXT NOT NULL DEFAULT '',
  emoji           TEXT NOT NULL DEFAULT '📘',
  level           TEXT NOT NULL DEFAULT 'starter' CHECK (level IN ('starter','curious','deep')),
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  author_id       INTEGER REFERENCES users(id) ON DELETE SET NULL,
  reading_minutes INTEGER NOT NULL DEFAULT 1,
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL,
  published_at    TEXT
);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status, published_at DESC);

CREATE TABLE IF NOT EXISTS post_tags (
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag     TEXT NOT NULL,
  PRIMARY KEY (post_id, tag)
);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag ON post_tags(tag);

CREATE TABLE IF NOT EXISTS bookmarks (
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id    INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS reading_history (
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id       INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  first_read_at TEXT NOT NULL,
  last_read_at  TEXT NOT NULL,
  read_count    INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, post_id)
);
CREATE INDEX IF NOT EXISTS idx_history_user ON reading_history(user_id, last_read_at DESC);

CREATE TABLE IF NOT EXISTS login_failures (
  key       TEXT PRIMARY KEY,
  n         INTEGER NOT NULL,
  until_ms  BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS meta (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`;

async function ensureAdmin(tx: Sql) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    console.warn(
      `[auth] ADMIN_PASSWORD is not set, so the admin account (${ADMIN_EMAIL}) cannot be created or used.`,
    );
    return;
  }
  const [row] = await tx`SELECT id, password_hash, role FROM users WHERE email = ${ADMIN_EMAIL}`;
  if (!row) {
    await tx`INSERT INTO users (email, name, password_hash, role, created_at)
             VALUES (${ADMIN_EMAIL}, 'Aryan', ${await bcrypt.hash(password, 12)}, 'admin', ${new Date().toISOString()})`;
    return;
  }
  const stale = !(await bcrypt.compare(password, row.password_hash));
  if (stale || row.role !== "admin") {
    const hash = stale ? await bcrypt.hash(password, 12) : row.password_hash;
    await tx`UPDATE users SET password_hash = ${hash}, role = 'admin' WHERE id = ${row.id}`;
  }
}

async function seedPosts(tx: Sql) {
  const [done] = await tx`SELECT value FROM meta WHERE key = 'seeded'`;
  if (done) return;
  const [admin] = await tx`SELECT id FROM users WHERE role = 'admin' LIMIT 1`;
  if (!admin) return; // try again once the admin exists
  for (const [i, p] of SEED_POSTS.entries()) {
    // stagger dates so the "latest" order is stable
    const when = new Date(Date.now() - i * 60_000).toISOString();
    const minutes = Math.max(1, Math.round(p.content.split(/\s+/).length / 200));
    const [post] = await tx`
      INSERT INTO posts (slug, title, excerpt, tldr, content, emoji, level, status, author_id, reading_minutes, created_at, updated_at, published_at)
      VALUES (${p.slug}, ${p.title}, ${p.excerpt}, ${p.tldr}, ${p.content}, ${p.emoji}, ${p.level}, 'published', ${admin.id}, ${minutes}, ${when}, ${when}, ${when})
      ON CONFLICT (slug) DO NOTHING RETURNING id`;
    if (post) for (const t of p.tags) await tx`INSERT INTO post_tags (post_id, tag) VALUES (${post.id}, ${t}) ON CONFLICT DO NOTHING`;
  }
  await tx`INSERT INTO meta (key, value) VALUES ('seeded', '1') ON CONFLICT DO NOTHING`;
}

const g = globalThis as unknown as { __sql?: Sql; __dbReady?: Promise<Sql> };

function connect(): Sql {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add a Postgres connection string (Neon, Supabase, Vercel Postgres…) to your environment.",
    );
  }
  const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
  return postgres(url, {
    ssl: local ? false : "require",
    max: local ? 1 : 5,
    prepare: false, // required for pooled (pgbouncer) connections such as Neon's
    idle_timeout: 20,
    onnotice: () => {},
  });
}

/** Resolves to the shared Postgres client once the schema, admin and seed content exist. */
export function db(): Promise<Sql> {
  return (g.__dbReady ??= (async () => {
    const sql = (g.__sql ??= connect());
    // The advisory lock makes concurrent cold starts take turns instead of racing.
    await sql.begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(727274)`;
      await tx.unsafe(SCHEMA);
      await ensureAdmin(tx as unknown as Sql);
      await seedPosts(tx as unknown as Sql);
    });
    return sql;
  })().catch((e) => {
    g.__dbReady = undefined; // allow a retry on the next request
    throw e;
  }));
}

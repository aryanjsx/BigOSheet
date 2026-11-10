import "server-only";
import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { SEED_POSTS } from "./seed";

// node:sqlite ships with Node 22.13+ (no native build step). We load it via
// process.getBuiltinModule so bundlers never try to resolve it.
type Sqlite = typeof import("node:sqlite");
const { DatabaseSync } = process.getBuiltinModule("node:sqlite") as Sqlite;
type DB = InstanceType<Sqlite["DatabaseSync"]>;

export const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL ?? "kumararyan1929@gmail.com"
).toLowerCase();

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
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
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
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
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id      INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  first_read_at TEXT NOT NULL,
  last_read_at TEXT NOT NULL,
  read_count   INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, post_id)
);
CREATE INDEX IF NOT EXISTS idx_history_user ON reading_history(user_id, last_read_at DESC);

CREATE TABLE IF NOT EXISTS meta (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`;

function ensureAdmin(db: DB) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    console.warn(
      `[auth] ADMIN_PASSWORD is not set, so the admin account (${ADMIN_EMAIL}) cannot be created or used.`,
    );
    return;
  }
  const row = db
    .prepare("SELECT id, password_hash, role FROM users WHERE email = ?")
    .get(ADMIN_EMAIL) as
    | { id: number; password_hash: string; role: string }
    | undefined;
  if (!row) {
    db.prepare(
      "INSERT INTO users (email, name, password_hash, role, created_at) VALUES (?, ?, ?, 'admin', ?)",
    ).run(ADMIN_EMAIL, "Aryan", bcrypt.hashSync(password, 12), new Date().toISOString());
    return;
  }
  const stale = !bcrypt.compareSync(password, row.password_hash);
  if (stale || row.role !== "admin") {
    db.prepare("UPDATE users SET password_hash = ?, role = 'admin' WHERE id = ?").run(
      stale ? bcrypt.hashSync(password, 12) : row.password_hash,
      row.id,
    );
  }
}

function seedPosts(db: DB) {
  const done = db.prepare("SELECT value FROM meta WHERE key = 'seeded'").get();
  if (done) return;
  const admin = db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get() as
    | { id: number }
    | undefined;
  if (!admin) return; // try again once the admin exists
  const now = new Date().toISOString();
  const insert = db.prepare(
    `INSERT INTO posts (slug, title, excerpt, tldr, content, emoji, level, status, author_id, reading_minutes, created_at, updated_at, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, ?)`,
  );
  const tag = db.prepare("INSERT OR IGNORE INTO post_tags (post_id, tag) VALUES (?, ?)");
  SEED_POSTS.forEach((p, i) => {
    // stagger dates so the "latest" order is stable
    const when = new Date(Date.now() - i * 60_000).toISOString();
    const minutes = Math.max(1, Math.round(p.content.split(/\s+/).length / 200));
    const res = insert.run(
      p.slug, p.title, p.excerpt, p.tldr, p.content, p.emoji, p.level,
      admin.id, minutes, when, when, when,
    );
    for (const t of p.tags) tag.run(Number(res.lastInsertRowid), t);
  });
  db.prepare("INSERT INTO meta (key, value) VALUES ('seeded', '1')").run();
}

function open(): DB {
  const file = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "blog.db");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  // Several Next.js workers can open this file at once (e.g. during build), so wait instead of failing.
  db.exec("PRAGMA busy_timeout = 10000;");
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  // One writer at a time runs setup; the others re-check inside the lock and find it done.
  db.exec("BEGIN IMMEDIATE");
  try {
    db.exec(SCHEMA);
    ensureAdmin(db);
    seedPosts(db);
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
  return db;
}

const g = globalThis as unknown as { __blogDb?: DB };
export const db: DB = (g.__blogDb ??= open());

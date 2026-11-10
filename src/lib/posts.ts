import "server-only";
import { db } from "./db";
import { readingMinutes } from "./markdown";
import { uniqueSlug } from "./slug";

export type Level = "starter" | "curious" | "deep";
export const LEVEL_LABEL: Record<Level, string> = {
  starter: "No tech background needed",
  curious: "A little curiosity helps",
  deep: "Deep dive",
};

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  tldr: string;
  content: string;
  emoji: string;
  level: Level;
  status: "draft" | "published";
  authorName: string | null;
  readingMinutes: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  tags: string[];
};

type Row = Record<string, unknown>;

const SELECT = `
  SELECT p.*, u.name AS author_name FROM posts p
  LEFT JOIN users u ON u.id = p.author_id`;

function withTags(rows: Row[]): Post[] {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id as number);
  const tagRows = db
    .prepare(`SELECT post_id, tag FROM post_tags WHERE post_id IN (${ids.map(() => "?").join(",")}) ORDER BY tag`)
    .all(...ids) as { post_id: number; tag: string }[];
  const byPost = new Map<number, string[]>();
  for (const t of tagRows) byPost.set(t.post_id, [...(byPost.get(t.post_id) ?? []), t.tag]);
  return rows.map((r) => ({
    id: r.id as number,
    slug: r.slug as string,
    title: r.title as string,
    excerpt: r.excerpt as string,
    tldr: r.tldr as string,
    content: r.content as string,
    emoji: r.emoji as string,
    level: r.level as Level,
    status: r.status as Post["status"],
    authorName: (r.author_name as string | null) ?? null,
    readingMinutes: r.reading_minutes as number,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
    publishedAt: (r.published_at as string | null) ?? null,
    tags: byPost.get(r.id as number) ?? [],
  }));
}

export function normalizeTags(input: string): string[] {
  const tags = input
    .split(",")
    .map((t) => t.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""))
    .filter(Boolean)
    .slice(0, 8);
  return [...new Set(tags)];
}

/* ---------- public reads ---------- */

export function listPublished(opts: { q?: string; tag?: string; limit?: number } = {}): Post[] {
  const where = ["p.status = 'published'"];
  const params: (string | number)[] = [];
  if (opts.q) {
    where.push("(p.title LIKE ? ESCAPE '\\' OR p.excerpt LIKE ? ESCAPE '\\' OR p.content LIKE ? ESCAPE '\\')");
    const like = `%${opts.q.replace(/[\\%_]/g, "\\$&")}%`;
    params.push(like, like, like);
  }
  if (opts.tag) {
    where.push("EXISTS (SELECT 1 FROM post_tags t WHERE t.post_id = p.id AND t.tag = ?)");
    params.push(opts.tag);
  }
  const rows = db
    .prepare(`${SELECT} WHERE ${where.join(" AND ")} ORDER BY p.published_at DESC LIMIT ?`)
    .all(...params, opts.limit ?? 100) as Row[];
  return withTags(rows);
}

export function listTags(): { tag: string; count: number }[] {
  return db
    .prepare(
      `SELECT t.tag, COUNT(*) AS count FROM post_tags t
       JOIN posts p ON p.id = t.post_id AND p.status = 'published'
       GROUP BY t.tag ORDER BY count DESC, t.tag LIMIT 30`,
    )
    .all() as { tag: string; count: number }[];
}

export function getPostBySlug(slug: string): Post | null {
  const row = db.prepare(`${SELECT} WHERE p.slug = ?`).get(slug) as Row | undefined;
  return row ? withTags([row])[0] : null;
}

export function getPostById(id: number): Post | null {
  const row = db.prepare(`${SELECT} WHERE p.id = ?`).get(id) as Row | undefined;
  return row ? withTags([row])[0] : null;
}

export function relatedPosts(post: Post, limit = 3): Post[] {
  if (post.tags.length === 0) return [];
  const rows = db
    .prepare(
      `${SELECT} WHERE p.status = 'published' AND p.id != ?
       AND EXISTS (SELECT 1 FROM post_tags t WHERE t.post_id = p.id AND t.tag IN (${post.tags.map(() => "?").join(",")}))
       ORDER BY p.published_at DESC LIMIT ?`,
    )
    .all(post.id, ...post.tags, limit) as Row[];
  return withTags(rows);
}

/* ---------- admin writes ---------- */

export type PostInput = {
  title: string;
  excerpt: string;
  tldr: string;
  content: string;
  emoji: string;
  level: Level;
  tags: string[];
  status: "draft" | "published";
};

export function listAllForAdmin(): Post[] {
  return withTags(db.prepare(`${SELECT} ORDER BY p.updated_at DESC`).all() as Row[]);
}

const slugTaken = (excludeId?: number) => (slug: string) =>
  !!db.prepare("SELECT 1 FROM posts WHERE slug = ? AND id != ?").get(slug, excludeId ?? -1);

function setTags(postId: number, tags: string[]) {
  db.prepare("DELETE FROM post_tags WHERE post_id = ?").run(postId);
  const ins = db.prepare("INSERT OR IGNORE INTO post_tags (post_id, tag) VALUES (?, ?)");
  for (const t of tags) ins.run(postId, t);
}

export function createPost(authorId: number, input: PostInput): Post {
  const now = new Date().toISOString();
  const slug = uniqueSlug(input.title, slugTaken());
  const res = db
    .prepare(
      `INSERT INTO posts (slug, title, excerpt, tldr, content, emoji, level, status, author_id, reading_minutes, created_at, updated_at, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      slug, input.title, input.excerpt, input.tldr, input.content, input.emoji, input.level,
      input.status, authorId, readingMinutes(input.content), now, now,
      input.status === "published" ? now : null,
    );
  const id = Number(res.lastInsertRowid);
  setTags(id, input.tags);
  return getPostById(id)!;
}

export function updatePost(id: number, input: PostInput): Post | null {
  const existing = getPostById(id);
  if (!existing) return null;
  const now = new Date().toISOString();
  // Published URLs stay stable so shared links never break. Drafts follow the title.
  const slug =
    existing.status === "published" || existing.publishedAt
      ? existing.slug
      : uniqueSlug(input.title, slugTaken(id));
  const publishedAt =
    input.status === "published" ? existing.publishedAt ?? now : existing.publishedAt;
  db.prepare(
    `UPDATE posts SET slug = ?, title = ?, excerpt = ?, tldr = ?, content = ?, emoji = ?, level = ?,
       status = ?, reading_minutes = ?, updated_at = ?, published_at = ? WHERE id = ?`,
  ).run(
    slug, input.title, input.excerpt, input.tldr, input.content, input.emoji, input.level,
    input.status, readingMinutes(input.content), now, publishedAt, id,
  );
  setTags(id, input.tags);
  return getPostById(id);
}

export function deletePost(id: number) {
  db.prepare("DELETE FROM posts WHERE id = ?").run(id);
}

/* ---------- per-user: saved + history ---------- */

export function isSaved(userId: number, postId: number): boolean {
  return !!db.prepare("SELECT 1 FROM bookmarks WHERE user_id = ? AND post_id = ?").get(userId, postId);
}

/** Returns the new saved state. */
export function toggleSaved(userId: number, postId: number): boolean {
  if (isSaved(userId, postId)) {
    db.prepare("DELETE FROM bookmarks WHERE user_id = ? AND post_id = ?").run(userId, postId);
    return false;
  }
  db.prepare("INSERT INTO bookmarks (user_id, post_id, created_at) VALUES (?, ?, ?)").run(
    userId, postId, new Date().toISOString(),
  );
  return true;
}

export function listSaved(userId: number): Post[] {
  const rows = db
    .prepare(
      `${SELECT} JOIN bookmarks b ON b.post_id = p.id
       WHERE b.user_id = ? AND p.status = 'published' ORDER BY b.created_at DESC`,
    )
    .all(userId) as Row[];
  return withTags(rows);
}

export function recordRead(userId: number, postId: number) {
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO reading_history (user_id, post_id, first_read_at, last_read_at, read_count)
     VALUES (?, ?, ?, ?, 1)
     ON CONFLICT(user_id, post_id) DO UPDATE SET last_read_at = excluded.last_read_at, read_count = read_count + 1`,
  ).run(userId, postId, now, now);
}

export function listHistory(userId: number): (Post & { lastReadAt: string; readCount: number })[] {
  const rows = db
    .prepare(
      `${SELECT} JOIN reading_history h ON h.post_id = p.id
       WHERE h.user_id = ? AND p.status = 'published' ORDER BY h.last_read_at DESC LIMIT 100`,
    )
    .all(userId) as Row[];
  const posts = withTags(rows);
  const meta = db
    .prepare("SELECT post_id, last_read_at, read_count FROM reading_history WHERE user_id = ?")
    .all(userId) as { post_id: number; last_read_at: string; read_count: number }[];
  const m = new Map(meta.map((x) => [x.post_id, x]));
  return posts.map((p) => ({ ...p, lastReadAt: m.get(p.id)!.last_read_at, readCount: m.get(p.id)!.read_count }));
}

export function clearHistory(userId: number) {
  db.prepare("DELETE FROM reading_history WHERE user_id = ?").run(userId);
}

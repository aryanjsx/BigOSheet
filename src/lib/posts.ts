import "server-only";
import postgres from "postgres";
import { db, type Sql } from "./db";
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

type Row = postgres.Row;

const base = (sql: Sql) =>
  sql`SELECT p.*, u.name AS author_name FROM posts p LEFT JOIN users u ON u.id = p.author_id`;

async function withTags(sql: Sql, rows: Row[]): Promise<Post[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id as number);
  const tagRows = await sql`SELECT post_id, tag FROM post_tags WHERE post_id IN ${sql(ids)} ORDER BY tag`;
  const byPost = new Map<number, string[]>();
  for (const t of tagRows) byPost.set(t.post_id, [...(byPost.get(t.post_id) ?? []), t.tag]);
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    tldr: r.tldr,
    content: r.content,
    emoji: r.emoji,
    level: r.level as Level,
    status: r.status as Post["status"],
    authorName: r.author_name ?? null,
    readingMinutes: r.reading_minutes,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    publishedAt: r.published_at ?? null,
    tags: byPost.get(r.id) ?? [],
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

export async function listPublished(opts: { q?: string; tag?: string; limit?: number } = {}): Promise<Post[]> {
  const sql = await db();
  const like = opts.q ? `%${opts.q.replace(/[\\%_]/g, "\\$&")}%` : null;
  const rows = await sql`
    ${base(sql)}
    WHERE p.status = 'published'
    ${like ? sql`AND (p.title ILIKE ${like} OR p.excerpt ILIKE ${like} OR p.content ILIKE ${like})` : sql``}
    ${opts.tag ? sql`AND EXISTS (SELECT 1 FROM post_tags t WHERE t.post_id = p.id AND t.tag = ${opts.tag})` : sql``}
    ORDER BY p.published_at DESC
    LIMIT ${opts.limit ?? 100}`;
  return withTags(sql, rows);
}

export async function listTags(): Promise<{ tag: string; count: number }[]> {
  const sql = await db();
  const rows = await sql`
    SELECT t.tag, COUNT(*)::int AS count FROM post_tags t
    JOIN posts p ON p.id = t.post_id AND p.status = 'published'
    GROUP BY t.tag ORDER BY count DESC, t.tag LIMIT 30`;
  return rows.map((r) => ({ tag: r.tag, count: r.count }));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const sql = await db();
  const rows = await sql`${base(sql)} WHERE p.slug = ${slug}`;
  return (await withTags(sql, rows))[0] ?? null;
}

export async function getPostById(id: number): Promise<Post | null> {
  const sql = await db();
  const rows = await sql`${base(sql)} WHERE p.id = ${id}`;
  return (await withTags(sql, rows))[0] ?? null;
}

export async function relatedPosts(post: Post, limit = 3): Promise<Post[]> {
  if (post.tags.length === 0) return [];
  const sql = await db();
  const rows = await sql`
    ${base(sql)}
    WHERE p.status = 'published' AND p.id != ${post.id}
    AND EXISTS (SELECT 1 FROM post_tags t WHERE t.post_id = p.id AND t.tag IN ${sql(post.tags)})
    ORDER BY p.published_at DESC LIMIT ${limit}`;
  return withTags(sql, rows);
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

export async function listAllForAdmin(): Promise<Post[]> {
  const sql = await db();
  return withTags(sql, await sql`${base(sql)} ORDER BY p.updated_at DESC`);
}

async function pickSlug(sql: Sql, title: string, excludeId = -1): Promise<string> {
  const taken = new Set(
    (await sql`SELECT slug FROM posts WHERE id != ${excludeId}`).map((r) => r.slug as string),
  );
  return uniqueSlug(title, (s) => taken.has(s));
}

async function setTags(tx: Sql, postId: number, tags: string[]) {
  await tx`DELETE FROM post_tags WHERE post_id = ${postId}`;
  for (const t of tags) await tx`INSERT INTO post_tags (post_id, tag) VALUES (${postId}, ${t}) ON CONFLICT DO NOTHING`;
}

export async function createPost(authorId: number, input: PostInput): Promise<Post> {
  const sql = await db();
  const now = new Date().toISOString();
  const id = await sql.begin(async (tx) => {
    const t = tx as unknown as Sql;
    const slug = await pickSlug(t, input.title);
    const [row] = await t`
      INSERT INTO posts (slug, title, excerpt, tldr, content, emoji, level, status, author_id, reading_minutes, created_at, updated_at, published_at)
      VALUES (${slug}, ${input.title}, ${input.excerpt}, ${input.tldr}, ${input.content}, ${input.emoji}, ${input.level},
              ${input.status}, ${authorId}, ${readingMinutes(input.content)}, ${now}, ${now},
              ${input.status === "published" ? now : null})
      RETURNING id`;
    await setTags(t, row.id, input.tags);
    return row.id as number;
  });
  return (await getPostById(id))!;
}

export async function updatePost(id: number, input: PostInput): Promise<Post | null> {
  const existing = await getPostById(id);
  if (!existing) return null;
  const sql = await db();
  const now = new Date().toISOString();
  await sql.begin(async (tx) => {
    const t = tx as unknown as Sql;
    // Published URLs stay stable so shared links never break. Drafts follow the title.
    const slug =
      existing.status === "published" || existing.publishedAt
        ? existing.slug
        : await pickSlug(t, input.title, id);
    const publishedAt = input.status === "published" ? existing.publishedAt ?? now : existing.publishedAt;
    await t`
      UPDATE posts SET slug = ${slug}, title = ${input.title}, excerpt = ${input.excerpt}, tldr = ${input.tldr},
        content = ${input.content}, emoji = ${input.emoji}, level = ${input.level}, status = ${input.status},
        reading_minutes = ${readingMinutes(input.content)}, updated_at = ${now}, published_at = ${publishedAt}
      WHERE id = ${id}`;
    await setTags(t, id, input.tags);
  });
  return getPostById(id);
}

export async function deletePost(id: number) {
  const sql = await db();
  await sql`DELETE FROM posts WHERE id = ${id}`;
}

/* ---------- per-user: saved + history ---------- */

export async function isSaved(userId: number, postId: number): Promise<boolean> {
  const sql = await db();
  const rows = await sql`SELECT 1 FROM bookmarks WHERE user_id = ${userId} AND post_id = ${postId}`;
  return rows.length > 0;
}

/** Returns the new saved state. */
export async function toggleSaved(userId: number, postId: number): Promise<boolean> {
  const sql = await db();
  const removed = await sql`DELETE FROM bookmarks WHERE user_id = ${userId} AND post_id = ${postId} RETURNING 1`;
  if (removed.length > 0) return false;
  await sql`INSERT INTO bookmarks (user_id, post_id, created_at) VALUES (${userId}, ${postId}, ${new Date().toISOString()})
            ON CONFLICT DO NOTHING`;
  return true;
}

export async function listSaved(userId: number): Promise<Post[]> {
  const sql = await db();
  const rows = await sql`
    ${base(sql)} JOIN bookmarks b ON b.post_id = p.id
    WHERE b.user_id = ${userId} AND p.status = 'published' ORDER BY b.created_at DESC`;
  return withTags(sql, rows);
}

export async function recordRead(userId: number, postId: number) {
  const sql = await db();
  const now = new Date().toISOString();
  await sql`
    INSERT INTO reading_history (user_id, post_id, first_read_at, last_read_at, read_count)
    VALUES (${userId}, ${postId}, ${now}, ${now}, 1)
    ON CONFLICT (user_id, post_id) DO UPDATE
      SET last_read_at = EXCLUDED.last_read_at, read_count = reading_history.read_count + 1`;
}

export async function listHistory(userId: number): Promise<(Post & { lastReadAt: string; readCount: number })[]> {
  const sql = await db();
  const rows = await sql`
    SELECT p.*, u.name AS author_name, h.last_read_at, h.read_count
    FROM posts p
    LEFT JOIN users u ON u.id = p.author_id
    JOIN reading_history h ON h.post_id = p.id
    WHERE h.user_id = ${userId} AND p.status = 'published'
    ORDER BY h.last_read_at DESC LIMIT 100`;
  const posts = await withTags(sql, rows);
  return posts.map((p, i) => ({ ...p, lastReadAt: rows[i].last_read_at, readCount: rows[i].read_count }));
}

export async function clearHistory(userId: number) {
  const sql = await db();
  await sql`DELETE FROM reading_history WHERE user_id = ${userId}`;
}

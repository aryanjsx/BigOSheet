import "server-only";
import { ADMIN_EMAIL, db } from "./db";

export type UserRow = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  saved: number;
  reads: number;
};

export async function findUserByEmail(email: string) {
  const sql = await db();
  const [row] = await sql`SELECT id, password_hash FROM users WHERE email = ${email}`;
  return row as { id: number; password_hash: string } | undefined;
}

export async function createUser(name: string, email: string, passwordHash: string): Promise<number> {
  const sql = await db();
  const [row] = await sql`
    INSERT INTO users (email, name, password_hash, role, created_at)
    VALUES (${email}, ${name}, ${passwordHash}, 'user', ${new Date().toISOString()})
    ON CONFLICT (email) DO NOTHING RETURNING id`;
  return row?.id ?? 0; // 0 = someone registered the same email a moment ago
}

export async function listUsers(): Promise<UserRow[]> {
  const sql = await db();
  const rows = await sql`
    SELECT u.id, u.name, u.email, u.role, u.created_at,
      (SELECT COUNT(*)::int FROM bookmarks b WHERE b.user_id = u.id) AS saved,
      (SELECT COUNT(*)::int FROM reading_history h WHERE h.user_id = u.id) AS reads
    FROM users u ORDER BY u.created_at DESC`;
  return rows.map((r) => ({
    id: r.id, name: r.name, email: r.email, role: r.role, createdAt: r.created_at, saved: r.saved, reads: r.reads,
  }));
}

/** Deletes a regular user (cascades sessions, saves, history). Admins can never be deleted. */
export async function deleteUser(id: number, actingAdminId: number) {
  const sql = await db();
  if (id === actingAdminId) return;
  await sql`DELETE FROM users WHERE id = ${id} AND role != 'admin' AND email != ${ADMIN_EMAIL}`;
}

import "server-only";
import crypto from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";

const COOKIE = "session";
const DAYS = 30;

export type User = {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
  createdAt: string;
};

const hash = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

export async function createSession(userId: number) {
  const token = crypto.randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + DAYS * 86_400_000);
  const sql = await db();
  await sql`DELETE FROM sessions WHERE expires_at < ${new Date().toISOString()}`;
  await sql`INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (${hash(token)}, ${userId}, ${expires.toISOString()})`;
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    const sql = await db();
    await sql`DELETE FROM sessions WHERE token_hash = ${hash(token)}`;
  }
  jar.delete(COOKIE);
}

/** The logged-in user for this request, or null. Cached per request. */
export const getUser = cache(async (): Promise<User | null> => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const sql = await db();
  const [row] = await sql`
    SELECT u.id, u.email, u.name, u.role, u.created_at FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ${hash(token)} AND s.expires_at > ${new Date().toISOString()}`;
  return row
    ? { id: row.id, email: row.email, name: row.name, role: row.role as User["role"], createdAt: row.created_at }
    : null;
});

export async function requireUser(next = "/"): Promise<User> {
  const user = await getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}

/** Authorization gate for every admin page and action. */
export async function requireAdmin(next = "/admin"): Promise<User> {
  const user = await requireUser(next);
  if (user.role !== "admin") redirect("/");
  return user;
}

/** Only allow same-site relative redirects. */
export function safeNext(value: unknown): string {
  return typeof value === "string" && /^\/(?![/\\])/.test(value) ? value : "/library";
}

/* Failed-login throttle, stored in the database so it holds across serverless instances. */
const MAX_FAILS = 8;
const WINDOW_MS = 15 * 60_000;
export async function loginBlocked(key: string): Promise<boolean> {
  const sql = await db();
  const [f] = await sql`SELECT n, until_ms FROM login_failures WHERE key = ${key}`;
  return !!f && f.n >= MAX_FAILS && Number(f.until_ms) > Date.now();
}
export async function noteLoginFailure(key: string) {
  const sql = await db();
  const until = Date.now() + WINDOW_MS;
  await sql`
    INSERT INTO login_failures (key, n, until_ms) VALUES (${key}, 1, ${until})
    ON CONFLICT (key) DO UPDATE SET
      n = CASE WHEN login_failures.until_ms > ${Date.now()} THEN login_failures.n + 1 ELSE 1 END,
      until_ms = ${until}`;
}
export async function clearLoginFailures(key: string) {
  const sql = await db();
  await sql`DELETE FROM login_failures WHERE key = ${key}`;
}

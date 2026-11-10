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
  db.prepare("DELETE FROM sessions WHERE expires_at < ?").run(new Date().toISOString());
  db.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").run(
    hash(token), userId, expires.toISOString(),
  );
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
  if (token) db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(hash(token));
  jar.delete(COOKIE);
}

/** The logged-in user for this request, or null. Cached per request. */
export const getUser = cache(async (): Promise<User | null> => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const row = db
    .prepare(
      `SELECT u.id, u.email, u.name, u.role, u.created_at FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > ?`,
    )
    .get(hash(token), new Date().toISOString()) as
    | { id: number; email: string; name: string; role: "user" | "admin"; created_at: string }
    | undefined;
  return row
    ? { id: row.id, email: row.email, name: row.name, role: row.role, createdAt: row.created_at }
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

/* Tiny in-memory throttle for failed logins (per email). Swap for Redis if you scale out. */
const fails = new Map<string, { n: number; until: number }>();
export function loginBlocked(key: string): boolean {
  const f = fails.get(key);
  return !!f && f.n >= 8 && f.until > Date.now();
}
export function noteLoginFailure(key: string) {
  const f = fails.get(key);
  fails.set(key, { n: (f && f.until > Date.now() ? f.n : 0) + 1, until: Date.now() + 15 * 60_000 });
}
export function clearLoginFailures(key: string) {
  fails.delete(key);
}

"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { ADMIN_EMAIL } from "@/lib/db";
import { createUser, findUserByEmail } from "@/lib/users";
import {
  clearLoginFailures, createSession, destroySession, loginBlocked,
  noteLoginFailure, safeNext,
} from "@/lib/auth";

export type FormState = { error?: string } | undefined;

const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);
const EMAIL_RE =/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");

export async function signupAction(_: FormState, form: FormData): Promise<FormState> {
  const name = clean(form.get("name")).slice(0, 60);
  const email = clean(form.get("email")).toLowerCase();
  const password = typeof form.get("password") === "string" ? (form.get("password") as string) : "";

  if (!name) return { error: "Please tell us your name." };
  if (!EMAIL_RE.test(email) || email.length > 200) return { error: "That email address doesn't look right." };
  if (password.length < 8 || password.length > 100) return { error: "Use a password between 8 and 100 characters." };
  // The owner account is created from server config only, so nobody can claim it by signing up.
  if (email === ADMIN_EMAIL) return { error: "This email is reserved. Please log in instead." };
  const taken = { error: "An account with this email already exists. Try logging in." };
  if (await findUserByEmail(email)) return taken;

  const id = await createUser(name, email, await bcrypt.hash(password, 12));
  if (!id) return taken;
  await createSession(id);
  redirect(safeNext(clean(form.get("next"))));
}

export async function loginAction(_: FormState, form: FormData): Promise<FormState> {
  const email = clean(form.get("email")).toLowerCase();
  const password = typeof form.get("password") === "string" ? (form.get("password") as string) : "";
  const generic = { error: "Wrong email or password." };

  if (await loginBlocked(email)) return { error: "Too many attempts. Please wait 15 minutes and try again." };

  const user = await findUserByEmail(email);
  // Compare even for unknown emails so timing doesn't reveal which accounts exist.
  const ok = await bcrypt.compare(
    password,
    user?.password_hash ?? DUMMY_HASH,
  );
  if (!user || !ok) {
    await noteLoginFailure(email);
    return generic;
  }
  await clearLoginFailures(email);
  await createSession(user.id);
  const next = clean(form.get("next"));
  redirect(email === ADMIN_EMAIL && !next ? "/admin" : safeNext(next));
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

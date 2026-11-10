"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, signupAction } from "@/actions/auth";

export default function AuthForm({ mode, next }: { mode: "login" | "signup"; next?: string }) {
  const [state, action, pending] = useActionState(mode === "login" ? loginAction : signupAction, undefined);
  const login = mode === "login";
  return (
    <form action={action} className="card form auth-card">
      <h1>{login ? "Welcome back" : "Create your account"}</h1>
      <p className="muted">
        {login ? "Log in to see your saved and recently read articles." : "Save articles and pick up right where you left off."}
      </p>
      {next && <input type="hidden" name="next" value={next} />}
      {!login && (
        <label>Your name
          <input name="name" autoComplete="name" required maxLength={60} />
        </label>
      )}
      <label>Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>Password
        <input name="password" type="password" autoComplete={login ? "current-password" : "new-password"} required minLength={login ? undefined : 8} />
        {!login && <small className="muted">At least 8 characters.</small>}
      </label>
      {state?.error && <p className="form-error" role="alert">{state.error}</p>}
      <button className="btn btn-primary" disabled={pending}>{pending ? "One moment…" : login ? "Log in" : "Sign up"}</button>
      <p className="muted center">
        {login ? <>New here? <Link href="/signup">Create an account</Link></> : <>Already a member? <Link href="/login">Log in</Link></>}
      </p>
    </form>
  );
}

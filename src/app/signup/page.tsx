import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getUser, safeNext } from "@/lib/auth";

export const metadata = { title: "Sign up" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await getUser()) redirect(safeNext(next));
  return (
    <div className="container section">
      <AuthForm mode="signup" next={next ? safeNext(next) : undefined} />
    </div>
  );
}

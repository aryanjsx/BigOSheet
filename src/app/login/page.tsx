import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getUser, safeNext } from "@/lib/auth";

export const metadata = { title: "Log in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await getUser()) redirect(safeNext(next));
  return (
    <div className="container section">
      <AuthForm mode="login" next={next ? safeNext(next) : undefined} />
    </div>
  );
}

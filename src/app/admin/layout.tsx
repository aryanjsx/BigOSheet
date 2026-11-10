import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Admin", robots: { index: false } };

// Every page under /admin is gated here, and every admin action re-checks on its own.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="container section">
      <div className="admin-bar">
        <Link href="/admin">Posts</Link>
        <Link href="/admin/users">Users</Link>
        <Link href="/admin/new" className="btn btn-primary push-right">+ New post</Link>
      </div>
      {children}
    </div>
  );
}

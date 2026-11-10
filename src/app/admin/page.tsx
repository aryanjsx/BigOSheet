import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import ConfirmButton from "@/components/ConfirmButton";
import { deletePostAction } from "@/actions/admin";
import { listAllForAdmin } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export default async function AdminPosts() {
  await requireAdmin();
  const posts = listAllForAdmin();
  return (
    <>
      <h1>Posts</h1>
      {posts.length === 0 ? (
        <p className="muted">No posts yet. Write your first one!</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Title</th><th>Status</th><th>Address</th><th>Updated</th><th></th></tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td>{p.emoji} <Link href={`/admin/${p.id}/edit`}>{p.title}</Link></td>
                  <td><span className={`chip ${p.status === "draft" ? "chip-draft" : "chip-live"}`}>{p.status === "draft" ? "Draft" : "Published"}</span></td>
                  <td><Link href={`/${p.slug}`}><code>/{p.slug}</code></Link></td>
                  <td>{formatDate(p.updatedAt)}</td>
                  <td className="actions">
                    <Link href={`/admin/${p.id}/edit`} className="btn btn-ghost">Edit</Link>
                    <form action={deletePostAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <ConfirmButton className="btn btn-danger" message={`Delete “${p.title}” permanently? This cannot be undone.`}>Delete</ConfirmButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

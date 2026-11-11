import { requireAdmin } from "@/lib/auth";
import ConfirmButton from "@/components/ConfirmButton";
import { deleteUserAction } from "@/actions/admin";
import { listUsers } from "@/lib/users";
import { formatDate } from "@/lib/format";

export default async function AdminUsers() {
  await requireAdmin();
  const users = await listUsers();

  return (
    <>
      <h1>Users ({users.length})</h1>
      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Saved</th><th>Read</th><th></th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className={`chip ${u.role === "admin" ? "chip-live" : ""}`}>{u.role}</span></td>
                <td>{formatDate(u.createdAt)}</td>
                <td>{u.saved}</td>
                <td>{u.reads}</td>
                <td className="actions">
                  {u.role !== "admin" && (
                    <form action={deleteUserAction}>
                      <input type="hidden" name="id" value={u.id} />
                      <ConfirmButton className="btn btn-danger" message={`Delete ${u.email} and all their saved articles and history?`}>Delete</ConfirmButton>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

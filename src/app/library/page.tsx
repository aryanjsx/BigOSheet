import Link from "next/link";
import PostCard from "@/components/PostCard";
import ConfirmButton from "@/components/ConfirmButton";
import { clearHistoryAction } from "@/actions/reader";
import { requireUser } from "@/lib/auth";
import { listHistory, listSaved } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export const metadata = { title: "My library" };

export default async function Library({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const user = await requireUser("/library");
  const tab = (await searchParams).tab === "history" ? "history" : "saved";
  const saved = await listSaved(user.id);
  const history = await listHistory(user.id);
  const items = tab === "saved" ? saved : history;

  return (
    <div className="container section">
      <h1>My library</h1>
      <p className="muted">Everything you saved and everything you have read, in one place.</p>

      <div className="editor-tabs" role="tablist">
        <Link role="tab" aria-selected={tab === "saved"} href="/library">Saved ({saved.length})</Link>
        <Link role="tab" aria-selected={tab === "history"} href="/library?tab=history">Recently read ({history.length})</Link>
        {tab === "history" && history.length > 0 && (
          <form action={clearHistoryAction} className="push-right">
            <ConfirmButton className="btn btn-ghost" message="Clear your reading history?">Clear history</ConfirmButton>
          </form>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card empty center">
          <div className="card-emoji big" aria-hidden="true">{tab === "saved" ? "⭐" : "🕘"}</div>
          <p>{tab === "saved" ? "Nothing saved yet. Tap “Save for later” on any article." : "You haven’t read anything yet."}</p>
          <Link href="/blog" className="btn btn-primary">Find something to read</Link>
        </div>
      ) : (
        <div className="grid">
          {tab === "saved"
            ? saved.map((p) => <PostCard key={p.id} post={p} />)
            : history.map((p) => (
                <PostCard key={p.id} post={p} note={`read ${p.readCount}× · last ${formatDate(p.lastReadAt)}`} />
              ))}
        </div>
      )}
    </div>
  );
}

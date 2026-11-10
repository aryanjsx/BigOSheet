import Link from "next/link";
import PostCard from "@/components/PostCard";
import { listPublished, listTags } from "@/lib/posts";

export const metadata = { title: "Articles" };

export default async function Blog({ searchParams }: { searchParams: Promise<{ q?: string; tag?: string }> }) {
  const { q = "", tag = "" } = await searchParams;
  const query = q.trim().slice(0, 100);
  const posts = await listPublished({ q: query || undefined, tag: tag || undefined });
  const tags = await listTags();

  return (
    <div className="container section">
      <h1>Articles</h1>
      <form className="search" role="search" action="/blog">
        <input name="q" type="search" placeholder="Search articles…" defaultValue={query} aria-label="Search articles" />
        {tag && <input type="hidden" name="tag" value={tag} />}
        <button className="btn btn-primary">Search</button>
      </form>

      <div className="chips big">
        <Link href="/blog" className={`chip chip-link ${!tag ? "active" : ""}`}>All</Link>
        {tags.map((t) => (
          <Link key={t.tag} href={`/blog?tag=${encodeURIComponent(t.tag)}`} className={`chip chip-link ${tag === t.tag ? "active" : ""}`}>#{t.tag}</Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <p className="muted empty">Nothing found{query ? ` for “${query}”` : ""}. Try a different word.</p>
      ) : (
        <div className="grid">{posts.map((p) => <PostCard key={p.id} post={p} />)}</div>
      )}
    </div>
  );
}

import Link from "next/link";
import PostCard from "@/components/PostCard";
import { listPublished, listTags } from "@/lib/posts";
import { getUser } from "@/lib/auth";

export default async function Home() {
  const [posts, tags, user] = await Promise.all([listPublished({ limit: 6 }), listTags(), getUser()]);
  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="eyebrow">Coding, minus the confusion</p>
          <h1>Learn how computers think, <span className="accent">in plain English.</span></h1>
          <p className="lead">
            Short, friendly articles on data structures, algorithms and everyday tech. Explained with
            real-life examples, so you never need a computer science degree to follow along.
          </p>
          <div className="row gap center-on-mobile">
            <Link href="/blog" className="btn btn-primary btn-lg">Start reading</Link>
            {!user && <Link href="/signup" className="btn btn-outline btn-lg">Create a free account</Link>}
            {user && <Link href="/library" className="btn btn-outline btn-lg">Go to my library</Link>}
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Latest articles</h2>
          <Link href="/blog">See all →</Link>
        </div>
        {posts.length === 0 ? (
          <p className="muted">No articles yet. Check back soon!</p>
        ) : (
          <div className="grid">{posts.map((p) => <PostCard key={p.id} post={p} />)}</div>
        )}
      </section>

      <section className="container section">
        <h2>How it works</h2>
        <div className="grid-3">
          <div className="card feature"><div className="card-emoji" aria-hidden="true">📖</div><h3>Read at your pace</h3><p className="muted">Every article starts with a one-line summary, then walks through the idea step by step.</p></div>
          <div className="card feature"><div className="card-emoji" aria-hidden="true">⭐</div><h3>Save for later</h3><p className="muted">Log in to bookmark articles you want to come back to.</p></div>
          <div className="card feature"><div className="card-emoji" aria-hidden="true">🕘</div><h3>Pick up where you left off</h3><p className="muted">Your reading history is kept in your library, so you never lose your place.</p></div>
        </div>
      </section>

      {tags.length > 0 && (
        <section className="container section">
          <h2>Browse by topic</h2>
          <div className="chips big">
            {tags.map((t) => (
              <Link key={t.tag} href={`/blog?tag=${encodeURIComponent(t.tag)}`} className="chip chip-link">#{t.tag} <span className="muted">{t.count}</span></Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

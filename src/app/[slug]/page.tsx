import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import SaveButton from "@/components/SaveButton";
import TrackRead from "@/components/TrackRead";
import { getUser } from "@/lib/auth";
import { renderMarkdown } from "@/lib/markdown";
import { formatDate } from "@/lib/format";
import { LEVEL_LABEL, getPostBySlug, isSaved, relatedPosts } from "@/lib/posts";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug((await params).slug);
  if (!post || post.status !== "published") return {};
  return { title: post.title, description: post.excerpt || post.tldr };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const user = await getUser();
  const isAdmin = user?.role === "admin";

  // Drafts are invisible to everyone except the admin.
  if (!post || (post.status !== "published" && !isAdmin)) notFound();

  const html = renderMarkdown(post.content);
  const saved = user ? isSaved(user.id, post.id) : false;
  const related = relatedPosts(post);

  return (
    <article className="container article">
      {post.status === "draft" && (
        <div className="banner">This is a draft. Only you can see it. <Link href={`/admin/${post.id}/edit`}>Keep editing →</Link></div>
      )}
      <header className="article-head">
        <div className="card-emoji big" aria-hidden="true">{post.emoji}</div>
        <div className="chips">
          <span className={`chip level-${post.level}`}>{LEVEL_LABEL[post.level]}</span>
          {post.tags.map((t) => <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className="chip chip-link">#{t}</Link>)}
        </div>
        <h1>{post.title}</h1>
        <p className="meta">
          {post.authorName ? `By ${post.authorName} · ` : ""}{formatDate(post.publishedAt ?? post.createdAt)} · {post.readingMinutes} min read
        </p>
        <div className="row gap">
          <SaveButton postId={post.id} initialSaved={saved} slug={post.slug} />
          {isAdmin && <Link href={`/admin/${post.id}/edit`} className="btn btn-ghost">Edit</Link>}
        </div>
      </header>

      {post.tldr && (
        <aside className="tldr">
          <strong>In plain English</strong>
          <p>{post.tldr}</p>
        </aside>
      )}

      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      {post.status === "published" && <TrackRead postId={post.id} />}

      {related.length > 0 && (
        <section className="section">
          <h2>Keep reading</h2>
          <div className="grid">{related.map((p) => <PostCard key={p.id} post={p} />)}</div>
        </section>
      )}
    </article>
  );
}

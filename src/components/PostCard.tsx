import Link from "next/link";
import { LEVEL_LABEL, type Post } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export default function PostCard({ post, note }: { post: Post; note?: string }) {
  return (
    <article className="card post-card">
      <Link href={`/${post.slug}`} className="card-link" aria-label={post.title} />
      <div className="card-emoji" aria-hidden="true">{post.emoji}</div>
      <div className="card-body">
        <div className="chips">
          <span className={`chip level-${post.level}`}>{LEVEL_LABEL[post.level]}</span>
          {post.status === "draft" && <span className="chip chip-draft">Draft</span>}
        </div>
        <h3>{post.title}</h3>
        <p className="muted">{post.excerpt}</p>
        <p className="meta">
          {formatDate(post.publishedAt ?? post.createdAt)} · {post.readingMinutes} min read{note ? ` · ${note}` : ""}
        </p>
      </div>
    </article>
  );
}

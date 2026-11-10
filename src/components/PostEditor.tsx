"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { savePostAction } from "@/actions/admin";
import { previewMarkdownAction } from "@/actions/admin";
import type { Post } from "@/lib/posts";

const STARTER = `## The big idea

Explain it with something from everyday life first.

> 💡 A short tip or "why it matters" callout.

## How it works

1. Step one
2. Step two

\`\`\`js
// a tiny code example
\`\`\`
`;

export default function PostEditor({ post }: { post?: Post }) {
  const [state, action, pending] = useActionState(savePostAction, undefined);
  const [content, setContent] = useState(post?.content ?? STARTER);
  const [title, setTitle] = useState(post?.title ?? "");
  const [html, setHtml] = useState("");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const seq = useRef(0);

  useEffect(() => {
    if (tab !== "preview") return;
    const mine = ++seq.current;
    previewMarkdownAction(content).then((h) => {
      if (mine === seq.current) setHtml(h);
    });
  }, [tab, content]);

  const slugPreview = title.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

  return (
    <form action={action} className="editor">
      {post && <input type="hidden" name="id" value={post.id} />}

      <label>Title
        <input name="title" required maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Singly linked list" />
        <small className="muted">
          Web address: <code>/{post && (post.status === "published" || post.publishedAt) ? post.slug : slugPreview || "your-title"}</code>
          {post && (post.status === "published" || post.publishedAt) && " (fixed once published, so shared links never break)"}
        </small>
      </label>

      <div className="grid-2">
        <label>Emoji
          <input name="emoji" maxLength={8} defaultValue={post?.emoji ?? "📘"} />
        </label>
        <label>Who is this for?
          <select name="level" defaultValue={post?.level ?? "starter"}>
            <option value="starter">No tech background needed</option>
            <option value="curious">A little curiosity helps</option>
            <option value="deep">Deep dive</option>
          </select>
        </label>
      </div>

      <label>Short description (shown on cards)
        <textarea name="excerpt" rows={2} maxLength={300} defaultValue={post?.excerpt} />
      </label>
      <label>In plain English (one-sentence summary at the top of the article)
        <textarea name="tldr" rows={2} maxLength={400} defaultValue={post?.tldr} />
      </label>
      <label>Tags (comma separated)
        <input name="tags" defaultValue={post?.tags.join(", ")} placeholder="dsa, basics, linked-list" />
      </label>

      <div className="editor-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === "write"} onClick={() => setTab("write")}>Write</button>
        <button type="button" role="tab" aria-selected={tab === "preview"} onClick={() => setTab("preview")}>Preview</button>
        <span className="muted">Markdown supported</span>
      </div>
      {/* Keep the textarea mounted so its value is always submitted. */}
      <textarea name="content" className="editor-area" hidden={tab !== "write"} value={content} onChange={(e) => setContent(e.target.value)} rows={22} />
      {tab === "preview" && <div className="prose card" dangerouslySetInnerHTML={{ __html: html }} />}

      {state?.error && <p className="form-error" role="alert">{state.error}</p>}

      <div className="row gap">
        <button className="btn btn-outline" name="intent" value="draft" disabled={pending}>
          {post?.status === "published" ? "Unpublish (move to drafts)" : "Save draft"}
        </button>
        <button className="btn btn-primary" name="intent" value="publish" disabled={pending}>
          {post?.status === "published" ? "Update published post" : "Publish"}
        </button>
      </div>
    </form>
  );
}

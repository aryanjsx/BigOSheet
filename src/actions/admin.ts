"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ADMIN_EMAIL, db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { renderMarkdown } from "@/lib/markdown";
import {
  createPost, deletePost, getPostById, normalizeTags, updatePost,
  type Level, type PostInput,
} from "@/lib/posts";
import type { FormState } from "./auth";

const str = (f: FormData, k: string, max: number) => {
  const v = f.get(k);
  return (typeof v === "string" ? v.trim() : "").slice(0, max);
};

export async function savePostAction(_: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin();

  const title = str(form, "title", 120);
  if (!title) return { error: "A post needs a title." };
  const level = str(form, "level", 10);
  const publish = form.get("intent") === "publish";
  const input: PostInput = {
    title,
    excerpt: str(form, "excerpt", 300),
    tldr: str(form, "tldr", 400),
    content: str(form, "content", 100_000),
    emoji: str(form, "emoji", 8) || "📘",
    level: (["starter", "curious", "deep"].includes(level) ? level : "starter") as Level,
    tags: normalizeTags(str(form, "tags", 300)),
    status: publish ? "published" : "draft",
  };
  if (publish && !input.content) return { error: "Write something before publishing." };

  const idRaw = str(form, "id", 12);
  let id: number;
  if (idRaw) {
    const updated = updatePost(Number(idRaw), input);
    if (!updated) return { error: "That post no longer exists." };
    id = updated.id;
  } else {
    id = createPost(admin.id, input).id;
  }
  revalidatePath("/", "layout");
  redirect(`/admin/${id}/edit?saved=${publish ? "published" : "draft"}`);
}

export async function deletePostAction(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  if (Number.isInteger(id) && getPostById(id)) deletePost(id);
  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function deleteUserAction(form: FormData) {
  const admin = await requireAdmin();
  const id = Number(form.get("id"));
  const target = db.prepare("SELECT id, email, role FROM users WHERE id = ?").get(id) as
    | { id: number; email: string; role: string }
    | undefined;
  // Never let the owner delete themselves or another admin.
  if (target && target.id !== admin.id && target.role !== "admin" && target.email !== ADMIN_EMAIL) {
    db.prepare("DELETE FROM users WHERE id = ?").run(id); // cascades sessions, saves, history
  }
  revalidatePath("/admin/users");
}

export async function previewMarkdownAction(source: string): Promise<string> {
  await requireAdmin();
  return renderMarkdown(String(source).slice(0, 100_000));
}

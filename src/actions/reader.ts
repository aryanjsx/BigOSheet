"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth";
import { clearHistory, getPostById, recordRead, toggleSaved } from "@/lib/posts";

export async function toggleSaveAction(postId: number): Promise<{ saved?: boolean; needsLogin?: boolean }> {
  const user = await getUser();
  if (!user) return { needsLogin: true };
  const post = getPostById(postId);
  if (!post || post.status !== "published") return {};
  const saved = toggleSaved(user.id, postId);
  revalidatePath("/library");
  return { saved };
}

export async function recordReadAction(postId: number) {
  const user = await getUser();
  const post = getPostById(postId);
  if (user && post?.status === "published") recordRead(user.id, postId);
}

export async function clearHistoryAction() {
  const user = await getUser();
  if (user) clearHistory(user.id);
  revalidatePath("/library");
}

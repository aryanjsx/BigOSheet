"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth";
import { clearHistory, getPostById, recordRead, toggleSaved } from "@/lib/posts";

export async function toggleSaveAction(postId: number): Promise<{ saved?: boolean; needsLogin?: boolean }> {
  const user = await getUser();
  if (!user) return { needsLogin: true };
  const post = await getPostById(postId);
  if (!post || post.status !== "published") return {};
  const saved = await toggleSaved(user.id, postId);
  revalidatePath("/library");
  return { saved };
}

export async function recordReadAction(postId: number) {
  const user = await getUser();
  const post = await getPostById(postId);
  if (user && post?.status === "published") await recordRead(user.id, postId);
}

export async function clearHistoryAction() {
  const user = await getUser();
  if (user) await clearHistory(user.id);
  revalidatePath("/library");
}

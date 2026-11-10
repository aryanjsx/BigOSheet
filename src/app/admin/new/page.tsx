import { requireAdmin } from "@/lib/auth";
import PostEditor from "@/components/PostEditor";

export default async function NewPost() {
  await requireAdmin();
  return (
    <>
      <h1>New post</h1>
      <PostEditor />
    </>
  );
}

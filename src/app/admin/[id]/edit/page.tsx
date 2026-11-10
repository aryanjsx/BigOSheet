import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostEditor from "@/components/PostEditor";
import ConfirmButton from "@/components/ConfirmButton";
import { deletePostAction } from "@/actions/admin";
import { getPostById } from "@/lib/posts";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function EditPost({ params, searchParams }: Props) {
  await requireAdmin();
  const id = Number((await params).id);
  const post = Number.isInteger(id) ? await getPostById(id) : null;
  if (!post) notFound();
  const { saved } = await searchParams;

  return (
    <>
      <div className="row gap between">
        <h1>Edit post</h1>
        <div className="row gap">
          <Link href={`/${post.slug}`} className="btn btn-outline">{post.status === "draft" ? "Preview draft" : "View live"}</Link>
          <form action={deletePostAction}>
            <input type="hidden" name="id" value={post.id} />
            <ConfirmButton className="btn btn-danger" message="Delete this post permanently? This cannot be undone.">Delete</ConfirmButton>
          </form>
        </div>
      </div>
      {saved && (
        <div className="banner ok" role="status">
          {saved === "published" ? "Published! It is live at " : "Draft saved. "}
          {saved === "published" && <Link href={`/${post.slug}`}>/{post.slug}</Link>}
        </div>
      )}
      <PostEditor post={post} />
    </>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleSaveAction } from "@/actions/reader";

export default function SaveButton({ postId, initialSaved, slug }: { postId: number; initialSaved: boolean; slug: string }) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      className={`btn ${saved ? "btn-primary" : "btn-outline"}`}
      aria-pressed={saved}
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await toggleSaveAction(postId);
          if (res.needsLogin) router.push(`/login?next=${encodeURIComponent(`/${slug}`)}`);
          else if (typeof res.saved === "boolean") setSaved(res.saved);
        })
      }
    >
      {saved ? "★ Saved" : "☆ Save for later"}
    </button>
  );
}

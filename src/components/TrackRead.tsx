"use client";

import { useEffect } from "react";
import { recordReadAction } from "@/actions/reader";

/** Logs the article in the reader's history once they actually open it. */
export default function TrackRead({ postId }: { postId: number }) {
  useEffect(() => {
    void recordReadAction(postId);
  }, [postId]);
  return null;
}

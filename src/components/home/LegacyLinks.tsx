"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { compareHref, topicHref } from "@/lib/routes";

/** Sends links from the old single-page site (#algo=bfs, #compare=a,b, #revision) to their new pages. */
export default function LegacyLinks() {
  const router = useRouter();
  useEffect(() => {
    const h = location.hash.replace(/^#/, "");
    let m: RegExpExecArray | null;
    if (h === "revision") router.replace("/revision");
    else if ((m = /^algo=([a-z0-9-]+)$/.exec(h))) router.replace(topicHref(m[1]));
    else if ((m = /^compare=([a-z0-9-]+),([a-z0-9-]+)$/.exec(h))) router.replace(compareHref(m[1], m[2]));
  }, [router]);
  return null;
}

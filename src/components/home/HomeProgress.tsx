"use client";

import Link from "next/link";
import { useProgress } from "@/context/ProgressContext";
import { ENTRIES, entryById } from "@/data/entries";
import { topicHref } from "@/lib/routes";

/** Shows where you left off. Hidden for first-time visitors. */
export default function HomeProgress() {
  const { state } = useProgress();
  const last = entryById(state.last);
  const learned = state.learned.length;
  if (!last && !learned && !state.bookmarks.length) return null;

  return (
    <div className="progress-strip">
      <p>
        <strong>
          Learned {learned} of {ENTRIES.length}
        </strong>
        {state.bookmarks.length > 0 && <>, saved {state.bookmarks.length}</>}.
      </p>
      {last && (
        <p>
          Continue with <Link href={topicHref(last.id)}>{last.name}</Link>
        </p>
      )}
      <p>
        <Link href="/roadmap">Open the roadmap</Link>
      </p>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import CopyButton from "@/components/ui/CopyButton";
import { useProgress } from "@/context/ProgressContext";
import { useSheet } from "@/context/SheetContext";
import { COMPARE } from "@/data/compare";
import type { Entry } from "@/data/types";
import { partnerFor } from "@/lib/compare";
import { compareHref, topicHref } from "@/lib/routes";
import { absoluteUrl } from "@/lib/utils";

/** Save, Mark learned, Copy link, and Compare. Used on topic cards and topic pages. */
export default function TopicActions({ e }: { e: Entry }) {
  const progress = useProgress();
  const { announce } = useSheet();
  const router = useRouter();
  const saved = progress.isSaved(e.id);
  const learned = progress.isLearned(e.id);

  return (
    <div className="card-actions" role="group" aria-label={"Actions for " + e.name}>
      <button
        type="button"
        className="btn btn-sm"
        aria-pressed={saved}
        aria-label={"Save " + e.name}
        onClick={() => announce(e.name + (progress.toggleSaved(e.id) ? " saved" : " removed from saved"))}
      >
        Save
      </button>
      <button
        type="button"
        className="btn btn-sm"
        aria-pressed={learned}
        aria-label={"Mark " + e.name + " as learned"}
        onClick={() => announce(e.name + (progress.toggleLearned(e.id) ? " marked as learned" : " marked as not learned"))}
      >
        Mark learned
      </button>
      <CopyButton
        className="btn btn-sm"
        label="Copy link"
        okLabel="Link copied"
        aria-label={"Copy link to " + e.name}
        text={() => absoluteUrl(topicHref(e.id))}
      />
      {COMPARE[e.id] && (
        <button
          type="button"
          className="btn btn-sm"
          aria-label={"Compare " + e.name + " with another topic"}
          onClick={() => router.push(compareHref(e.id, partnerFor(e.id)))}
        >
          Compare
        </button>
      )}
    </div>
  );
}

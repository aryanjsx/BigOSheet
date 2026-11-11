"use client";

import { useSheet } from "@/context/SheetContext";

/** Screen reader announcements from anywhere on the page go through announce() in SheetContext. */
export default function LiveRegion() {
  const { liveMessage } = useSheet();
  return (
    <div id="sr-live" className="sr-only" role="status" aria-live="polite">
      {liveMessage}
    </div>
  );
}

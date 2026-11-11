"use client";

import { useEffect, useRef, useState } from "react";
import { useSheet } from "@/context/SheetContext";
import { copyText } from "@/lib/utils";

interface Props {
  /** The text to copy, or a function that builds it at click time. */
  text: string | (() => string);
  label: string;
  /** Shown briefly after a successful copy. */
  okLabel?: string;
  className?: string;
  "aria-label"?: string;
  /** Runs after the copy finishes. */
  onCopied?(ok: boolean): void;
}

/** A button that copies text, shows "Copied" for a moment, and announces the result. */
export default function CopyButton({ text, label, okLabel = "Copied", className = "btn", onCopied, ...rest }: Props) {
  const { announce } = useSheet();
  const [flash, setFlash] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function onClick() {
    const ok = await copyText(typeof text === "function" ? text() : text);
    const msg = ok ? okLabel : "Copy failed";
    setFlash(msg);
    announce(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFlash(null), 1500);
    onCopied?.(ok);
  }

  return (
    <button type="button" className={className} onClick={onClick} aria-label={rest["aria-label"]}>
      {flash ?? label}
    </button>
  );
}

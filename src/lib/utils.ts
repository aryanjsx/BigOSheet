/* Small browser helpers shared by the interactive features. */

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function reducedMotion(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function download(filename: string, text: string, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** A full URL for a path on this site, for share links. */
export function absoluteUrl(path: string): string {
  return location.origin + asset(path);
}

/** Escapes a value for a Markdown table cell. */
export function mdCell(s: unknown): string {
  return String(s).replace(/\|/g, "\\|");
}

function csvCell(v: unknown): string {
  const s = String(v ?? "");
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

/** Builds a CSV with a BOM so spreadsheet apps read the Unicode symbols correctly. */
export function toCsv(headers: string[], rows: unknown[][]): string {
  return "﻿" + [headers, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

/** True when every search token matches at the start of a word in the haystack. */
export function matchesTokens(query: string, hay: string): boolean {
  const toks = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return toks.every((t) => {
    const esc = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp("(^|[^a-z0-9])" + esc).test(hay);
  });
}

/** Prefixes a path in /public with the configured base path. */
export function asset(path: string): string {
  return (process.env.NEXT_PUBLIC_BASE_PATH || "") + path;
}

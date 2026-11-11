/* Saved topics, learned topics, the last topic opened, and quiz and challenge results.
   Stored in localStorage under "bigo:v1", the key the original single-page site used, so
   existing progress carries over. Falls back to memory when storage is blocked or full,
   and picks up changes made in other open tabs. Kept free of React so it can be tested. */

export const STORAGE_KEY = "bigo:v1";

export interface ProgressState {
  bookmarks: string[];
  learned: string[];
  last: string | null;
  quiz: { best: number | null; runs: number };
  challenge: { done: Record<string, boolean> };
}

export interface Snapshot {
  state: ProgressState;
  /** False when the browser refused to store progress, so it only lasts for this page session. */
  persistent: boolean;
}

function strings(x: unknown): string[] {
  return Array.isArray(x) ? [...new Set(x.filter((v): v is string => typeof v === "string"))] : [];
}

function record(x: unknown): Record<string, boolean> {
  if (!x || typeof x !== "object" || Array.isArray(x)) return {};
  const out: Record<string, boolean> = {};
  for (const [k, v] of Object.entries(x)) if (typeof v === "boolean") out[k] = v;
  return out;
}

/** Turns anything read from storage (missing, outdated, or hand-edited) into a valid state. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalize(s: any): ProgressState {
  s = s && typeof s === "object" ? s : {};
  const best = s.quiz?.best;
  const runs = s.quiz?.runs;
  return {
    bookmarks: strings(s.bookmarks),
    learned: strings(s.learned),
    last: typeof s.last === "string" ? s.last : null,
    quiz: {
      best: typeof best === "number" && best >= 0 && best <= 100 ? Math.round(best) : null,
      runs: Number.isInteger(runs) && runs > 0 ? runs : 0,
    },
    challenge: { done: record(s.challenge?.done) },
  };
}

export const EMPTY: Snapshot = { state: normalize(null), persistent: true };

let snap: Snapshot | null = null;
const listeners = new Set<() => void>();

/** The current progress. Reads storage once, then serves the cached copy. */
export function read(): Snapshot {
  if (snap) return snap;
  let persistent = true;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    persistent = false;
  }
  let state = normalize(null);
  try {
    state = normalize(JSON.parse(raw || "null"));
  } catch {
    // Corrupt JSON: start fresh, but keep the stored value until the next save overwrites it.
  }
  snap = { state, persistent };
  return snap;
}

/** Saves a new state and notifies every subscriber. */
export function commit(state: ProgressState): void {
  let persistent = true;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    persistent = false;
  }
  snap = { state, persistent };
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (ev: StorageEvent) => {
    if (ev.key !== STORAGE_KEY && ev.key !== null) return;
    snap = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Drops the cached copy so the next read() goes back to storage. For tests. */
export function resetCache(): void {
  snap = null;
}

export function toggle(list: string[], id: string): [string[], boolean] {
  return list.includes(id) ? [list.filter((x) => x !== id), false] : [[...list, id], true];
}

/** Records a finished quiz as a percentage, keeping the best score and counting attempts. */
export function withQuizResult(s: ProgressState, score: number, total: number): ProgressState {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const best = s.quiz.best == null || pct > s.quiz.best ? pct : s.quiz.best;
  return { ...s, quiz: { runs: s.quiz.runs + 1, best } };
}

export function persistenceNote(persistent: boolean): string {
  return persistent
    ? "Saved topics and progress stay in this browser on this device. Nothing is sent anywhere."
    : "This browser is not letting the site store data, so your progress lasts only until you close this page.";
}

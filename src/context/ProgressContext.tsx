"use client";

/* React access to the progress store in lib/progressStore.ts. */

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import {
  EMPTY,
  commit,
  normalize,
  persistenceNote,
  read,
  subscribe,
  toggle,
  withQuizResult,
  type ProgressState,
} from "@/lib/progressStore";

export type { ProgressState };

interface ProgressApi {
  state: ProgressState;
  persistent: boolean;
  isSaved(id: string): boolean;
  isLearned(id: string): boolean;
  /** Each toggle returns the new value. */
  toggleSaved(id: string): boolean;
  toggleLearned(id: string): boolean;
  setLast(id: string): void;
  recordQuiz(score: number, total: number): void;
  recordChallenge(id: string, ok: boolean): void;
  reset(): void;
  persistenceNote(): string;
}

const ProgressContext = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  // The server snapshot is empty progress, so the first render matches the static HTML.
  const { state, persistent } = useSyncExternalStore(subscribe, read, () => EMPTY);

  const api = useMemo<ProgressApi>(
    () => ({
      state,
      persistent,
      isSaved: (id) => state.bookmarks.includes(id),
      isLearned: (id) => state.learned.includes(id),
      toggleSaved(id) {
        const cur = read().state;
        const [bookmarks, on] = toggle(cur.bookmarks, id);
        commit({ ...cur, bookmarks });
        return on;
      },
      toggleLearned(id) {
        const cur = read().state;
        const [learned, on] = toggle(cur.learned, id);
        commit({ ...cur, learned });
        return on;
      },
      setLast(id) {
        const cur = read().state;
        if (cur.last !== id) commit({ ...cur, last: id });
      },
      recordQuiz: (score, total) => commit(withQuizResult(read().state, score, total)),
      recordChallenge(id, ok) {
        const cur = read().state;
        commit({ ...cur, challenge: { done: { ...cur.challenge.done, [id]: ok } } });
      },
      reset: () => commit(normalize(null)),
      persistenceNote: () => persistenceNote(persistent),
    }),
    [state, persistent],
  );

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressApi {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside <ProgressProvider>");
  return ctx;
}

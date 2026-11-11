import { COMPARE } from "@/data/compare";

export const DEFAULT_PAIR: [string, string] = ["mergesort", "quicksort"];

/** A sensible second topic to compare `id` with: the first other topic of the same kind. */
export function partnerFor(id: string): string {
  const kind = COMPARE[id]?.kind;
  return Object.keys(COMPARE).find((k) => k !== id && COMPARE[k].kind === kind) ?? DEFAULT_PAIR[1];
}

/** Reads "a,b" (or the older "compare=a,b") from a URL hash. */
export function parsePair(hash: string): [string, string] {
  const m = /^(?:compare=)?([a-z0-9-]+),([a-z0-9-]+)$/.exec(hash);
  return m && COMPARE[m[1]] && COMPARE[m[2]] ? [m[1], m[2]] : DEFAULT_PAIR;
}

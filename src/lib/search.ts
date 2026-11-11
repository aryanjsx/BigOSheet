import type { ComplexityClass, Entry, Relevance, Topic } from "@/data/types";
import { matchesTokens } from "./utils";

export type ProgressFilter = "" | "saved" | "learned" | "todo";

export interface Filters {
  q: string;
  topic: Topic | "";
  cls: ComplexityClass | "";
  rel: Relevance | "";
  status: ProgressFilter;
}

export const EMPTY_FILTERS: Filters = { q: "", topic: "", cls: "", rel: "", status: "" };

const hayCache = new WeakMap<Entry, string>();
function hay(e: Entry): string {
  let h = hayCache.get(e);
  if (!h) {
    h = [e.name, e.topic, e.keywords, e.when, e.why, e.pitfall, e.time, e.space].join(" ").toLowerCase();
    hayCache.set(e, h);
  }
  return h;
}

export interface ProgressLookup {
  isSaved(id: string): boolean;
  isLearned(id: string): boolean;
}

/** The one filter used by the search cards and by "Topics currently shown" in the export. */
export function matchesFilters(e: Entry, f: Filters, progress: ProgressLookup): boolean {
  if (f.topic && e.topic !== f.topic) return false;
  if (f.cls && !e.classes.includes(f.cls)) return false;
  if (f.rel && e.rel !== f.rel) return false;
  if (f.status === "saved" && !progress.isSaved(e.id)) return false;
  if (f.status === "learned" && !progress.isLearned(e.id)) return false;
  if (f.status === "todo" && progress.isLearned(e.id)) return false;
  return matchesTokens(f.q, hay(e));
}

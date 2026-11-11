/* Shared types for the sheet's content. Every data file in this folder uses them,
   so the compiler catches a missing field or a mistyped id when you add content. */

export const TOPICS = ["Data structures", "Sorting", "Searching", "Graphs and trees", "Patterns"] as const;
export type Topic = (typeof TOPICS)[number];

export const COMPLEXITY_CLASSES = [
  "constant",
  "logarithmic",
  "linear",
  "linearithmic",
  "polynomial",
  "exponential",
] as const;
export type ComplexityClass = (typeof COMPLEXITY_CLASSES)[number];

export type Relevance = "High" | "Medium";

/** One searchable topic card. Also feeds the revision sheet, roadmap, and exports. */
export interface Entry {
  id: string;
  name: string;
  topic: Topic;
  /** The id of the table section the card links to. */
  section: string;
  time: string;
  space: string;
  classes: ComplexityClass[];
  rel: Relevance;
  keywords: string;
  when: string;
  why: string;
  pitfall: string;
  /** A short Python snippet. */
  code: string;
  ref: string | null;
}

export interface RoadmapLevel {
  level: string;
  blurb: string;
  /** `needs` lists entry ids to learn first. */
  steps: { id: string; needs: string[] }[];
}

export interface QuizQuestion {
  q: string;
  code: string | null;
  options: string[];
  /** Index into `options`. */
  answer: number;
  why: string;
}

export type ChallengeLang = "python" | "javascript" | "java";

export interface Challenge {
  id: string;
  title: string;
  langs: Record<ChallengeLang, string>;
  time: string;
  space: string;
  timeOptions: string[];
  spaceOptions: string[];
  why: string;
}

export type CompareKind = "sort" | "graph" | "search" | "ds";

export interface CompareItem {
  name: string;
  kind: CompareKind;
  time: string;
  space: string;
  stable: string;
  inPlace: string;
  useFor: string;
  tradeoffs: string;
}

export type CodeLang = "python" | "java" | "cpp" | "javascript";

export interface LangVariant {
  code: string;
  /** What the language changes about the cost. */
  cost: string;
}

export type MultiLang = Partial<Record<Exclude<CodeLang, "python">, LangVariant>>;

export interface LookupRow {
  name: string;
  group: string;
  best: string;
  avg: string;
  worst: string;
  space: string;
  assume: string;
  caveat: string;
  /** The id of the matching card, if there is one. */
  entry: string | null;
  alias: string;
}

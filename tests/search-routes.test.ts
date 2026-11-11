import { describe, expect, it } from "vitest";
import { ENTRIES, entryById } from "@/data/entries";
import { DEFAULT_PAIR, parsePair, partnerFor } from "@/lib/compare";
import { compareHref, sectionHref, sectionPageLabel, topicHref } from "@/lib/routes";
import { EMPTY_FILTERS, matchesFilters, type Filters, type ProgressLookup } from "@/lib/search";
import { matchesTokens, mdCell, toCsv } from "@/lib/utils";

const none: ProgressLookup = { isSaved: () => false, isLearned: () => false };
const find = (f: Partial<Filters>, progress: ProgressLookup = none) =>
  ENTRIES.filter((e) => matchesFilters(e, { ...EMPTY_FILTERS, ...f }, progress)).map((e) => e.id);

describe("matchesTokens", () => {
  it("matches tokens at the start of a word, in any order", () => {
    expect(matchesTokens("heap", "binary heap and priority queue")).toBe(true);
    expect(matchesTokens("queue prio", "binary heap and priority queue")).toBe(true);
    expect(matchesTokens("eap", "binary heap")).toBe(false);
    expect(matchesTokens("  ", "anything")).toBe(true);
  });
  it("treats regex characters literally", () => {
    expect(matchesTokens("o(n", "costs o(n) time")).toBe(true);
    expect(matchesTokens("c++", "c++ vector")).toBe(true);
  });
});

describe("matchesFilters", () => {
  it("returns everything with no filters", () => {
    expect(find({})).toHaveLength(ENTRIES.length);
  });
  it("finds topics by name, keyword, and alias", () => {
    expect(find({ q: "heap" })).toContain("binary-heap");
    expect(find({ q: "dsu" })).toEqual(["union-find"]);
    expect(find({ q: "lru" })).toContain("linked-list");
  });
  it("combines filters with AND", () => {
    const r = find({ topic: "Sorting", rel: "High" });
    expect(r).toEqual(["mergesort"]);
    expect(find({ topic: "Sorting", cls: "exponential" })).toEqual([]);
    expect(find({ cls: "polynomial" })).toContain("prim");
  });
  it("filters by progress", () => {
    const progress = { isSaved: (id: string) => id === "bfs", isLearned: (id: string) => id === "dfs" };
    expect(find({ status: "saved" }, progress)).toEqual(["bfs"]);
    expect(find({ status: "learned" }, progress)).toEqual(["dfs"]);
    expect(find({ status: "todo" }, progress)).toHaveLength(ENTRIES.length - 1);
  });
});

describe("routes", () => {
  it("builds topic and compare links", () => {
    expect(topicHref("bfs")).toBe("/topics/bfs");
    expect(compareHref("bfs", "dfs")).toBe("/compare#bfs,dfs");
  });
  it("sends section ids to the page that holds them", () => {
    expect(sectionHref("sorting")).toBe("/sorting");
    expect(sectionHref("shortest-paths")).toBe("/algorithms#shortest-paths");
    expect(sectionHref("more-data-structures")).toBe("/data-structures#more-data-structures");
    expect(sectionPageLabel("shortest-paths")).toBe("Search and graphs");
  });
});

describe("compare pairs", () => {
  it("reads the new and the old hash formats", () => {
    expect(parsePair("bfs,dfs")).toEqual(["bfs", "dfs"]);
    expect(parsePair("compare=heapsort,quicksort")).toEqual(["heapsort", "quicksort"]);
  });
  it("falls back to the default pair for unknown or malformed hashes", () => {
    expect(parsePair("")).toEqual(DEFAULT_PAIR);
    expect(parsePair("bfs,not-a-topic")).toEqual(DEFAULT_PAIR);
    expect(parsePair("bfs")).toEqual(DEFAULT_PAIR);
  });
  it("picks a partner of the same kind", () => {
    expect(partnerFor("bfs")).toBe("dfs");
    expect(partnerFor("mergesort")).toBe("quicksort");
    expect(entryById(partnerFor("hash-table"))).toBeDefined();
  });
});

describe("export helpers", () => {
  it("escapes pipes in Markdown cells", () => {
    expect(mdCell("a | b")).toBe("a \\| b");
  });
  it("writes CSV with a BOM, quoting, and Unicode notation intact", () => {
    const csv = toCsv(["name", "time"], [["Quicksort, in place", 'Θ(n²) "worst"'], ["Heap", "O(log n)"]]);
    expect(csv.startsWith("﻿")).toBe(true);
    expect(csv).toBe('﻿name,time\r\n"Quicksort, in place","Θ(n²) ""worst"""\r\nHeap,O(log n)\r\n');
  });
});

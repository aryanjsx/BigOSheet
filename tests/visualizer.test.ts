import { describe, expect, it } from "vitest";
import { ALGOS, GRAPH, randomArray, type Frame } from "@/lib/visualizer";

const algo = (id: string) => ALGOS.find((a) => a.id === id)!;
const DATA = [42, 7, 93, 18, 64, 5, 77, 31];
const SORTED = [...DATA].sort((a, b) => a - b);

type Bars = Extract<Frame, { kind: "bars" }>;
type Cells = Extract<Frame, { kind: "cells" }>;
type Graph = Extract<Frame, { kind: "graph" }>;
const last = <T>(f: T[]) => f[f.length - 1];

describe("randomArray", () => {
  it("returns distinct values from 5 to 99", () => {
    const a = randomArray(14);
    expect(a).toHaveLength(14);
    expect(new Set(a).size).toBe(14);
    for (const v of a) expect(v >= 5 && v <= 99).toBe(true);
  });
});

describe("sorts", () => {
  for (const id of ["bubble-sort", "merge-sort"]) {
    it(`${id} ends sorted, with every item marked sorted, and never changes the input`, () => {
      const input = DATA.slice();
      const f = algo(id).build(input, 0) as Bars[];
      expect(input).toEqual(DATA);
      expect(last(f).arr).toEqual(SORTED);
      expect(Object.values(last(f).marks)).toEqual(Array(DATA.length).fill("sorted"));
      // Counters never go down from one frame to the next.
      for (let i = 1; i < f.length; i++) {
        for (const k of Object.keys(f[i].stats)) expect(f[i].stats[k]).toBeGreaterThanOrEqual(f[i - 1].stats[k]);
      }
    });
  }

  it("bubble sort stops after one pass on sorted input (the O(n) best case)", () => {
    const f = algo("bubble-sort").build(SORTED, 0) as Bars[];
    expect(last(f).stats).toEqual({ Comparisons: SORTED.length - 1, Swaps: 0 });
  });

  it("bubble sort makes n(n-1)/2 comparisons on reversed input", () => {
    const n = 8;
    const f = algo("bubble-sort").build([...SORTED].reverse(), 0) as Bars[];
    expect(last(f).stats).toEqual({ Comparisons: (n * (n - 1)) / 2, Swaps: (n * (n - 1)) / 2 });
  });

  it("merge sort writes n log₂ n items and compares at most that many times", () => {
    const f = algo("merge-sort").build(DATA, 0) as Bars[];
    const n = DATA.length;
    expect(last(f).stats.Writes).toBe(n * Math.log2(n));
    expect(last(f).stats.Comparisons).toBeLessThanOrEqual(n * Math.log2(n));
  });

  it("handles a single item", () => {
    expect(last(algo("bubble-sort").build([5], 0) as Bars[]).arr).toEqual([5]);
    expect(last(algo("merge-sort").build([5], 0) as Bars[]).arr).toEqual([5]);
  });
});

describe("searches", () => {
  it("linear search finds the target after index + 1 comparisons", () => {
    const f = algo("linear-search").build(DATA, 18) as Cells[];
    expect(last(f).stats.Comparisons).toBe(4);
    expect(last(f).marks[3]).toBe("found");
  });

  it("linear search checks all n items when the target is missing", () => {
    const f = algo("linear-search").build(DATA, 50) as Cells[];
    expect(last(f).stats.Comparisons).toBe(DATA.length);
    expect(Object.values(last(f).marks).every((r) => r === "out")).toBe(true);
    expect(last(f).msg).toContain("not in the array");
  });

  it("linear search stops at the first of duplicate values", () => {
    const f = algo("linear-search").build([3, 9, 9, 1], 9) as Cells[];
    expect(last(f).marks[1]).toBe("found");
    expect(last(f).stats.Comparisons).toBe(2);
  });

  it("binary search sorts a copy, finds every value, and needs at most ⌊log₂ n⌋ + 1 comparisons", () => {
    const bound = Math.floor(Math.log2(DATA.length)) + 1;
    for (const t of DATA) {
      const input = DATA.slice();
      const f = algo("binary-search").build(input, t) as Cells[];
      expect(input).toEqual(DATA);
      expect(f[0].arr).toEqual(SORTED);
      expect(last(f).marks[SORTED.indexOf(t)]).toBe("found");
      expect(last(f).stats.Comparisons).toBeLessThanOrEqual(bound);
    }
  });

  it("binary search reports a missing target with every cell ruled out", () => {
    for (const t of [1, 50, 100]) {
      const f = algo("binary-search").build(DATA, t) as Cells[];
      expect(last(f).msg).toContain("not in the array");
      expect(Object.values(last(f).marks).every((r) => r === "out")).toBe(true);
      expect(last(f).stats.Comparisons).toBeLessThanOrEqual(Math.floor(Math.log2(DATA.length)) + 1);
    }
  });
});

describe("graph traversals", () => {
  const E = GRAPH.edges.length;
  const V = GRAPH.nodes.length;

  it("BFS visits in order of distance from A, with correct distances", () => {
    const f = algo("bfs").build([], 0) as Graph[];
    expect(last(f).order).toEqual(["A", "B", "C", "D", "E", "F", "G", "H"]);
    expect(last(f).depth).toEqual({ A: 0, B: 1, C: 1, D: 2, E: 2, F: 2, G: 3, H: 4 });
  });

  it("DFS visits depth-first in alphabetical neighbor order", () => {
    const f = algo("dfs").build([], 0) as Graph[];
    expect(last(f).order).toEqual(["A", "B", "D", "E", "G", "F", "C", "H"]);
  });

  for (const id of ["bfs", "dfs"]) {
    it(`${id} handles each vertex once and checks each undirected edge from both ends`, () => {
      const f = algo(id).build([], 0) as Graph[];
      expect(new Set(last(f).order).size).toBe(V);
      expect(last(f).stats).toEqual({ Visited: V, "Edges checked": 2 * E });
      expect(Object.values(last(f).state).every((s) => s === "done")).toBe(true);
      expect(last(f).list).toEqual([]);
    });
  }
});

describe("insertion sort", () => {
  it("ends sorted with one comparison per item on sorted input (the O(n) best case)", () => {
    const f = algo("insertion-sort").build(SORTED, 0) as Bars[];
    expect(last(f).arr).toEqual(SORTED);
    expect(last(f).stats).toEqual({ Comparisons: SORTED.length - 1, Shifts: 0 });
  });
  it("makes n(n-1)/2 comparisons and shifts on reversed input", () => {
    const n = SORTED.length;
    const f = algo("insertion-sort").build([...SORTED].reverse(), 0) as Bars[];
    expect(last(f).stats).toEqual({ Comparisons: (n * (n - 1)) / 2, Shifts: (n * (n - 1)) / 2 });
  });
  it("sorts random input, and the shift count equals the number of inversions", () => {
    let inversions = 0;
    for (let i = 0; i < DATA.length; i++) for (let j = i + 1; j < DATA.length; j++) if (DATA[i] > DATA[j]) inversions++;
    const f = algo("insertion-sort").build(DATA, 0) as Bars[];
    expect(last(f).arr).toEqual(SORTED);
    expect(last(f).stats.Shifts).toBe(inversions);
  });
});

describe("quicksort", () => {
  it("sorts random input and marks every item in its final place", () => {
    const f = algo("quicksort").build(DATA, 0) as Bars[];
    expect(last(f).arr).toEqual(SORTED);
    expect(Object.keys(last(f).marks)).toHaveLength(DATA.length);
    expect(Object.values(last(f).marks).every((r) => r === "sorted")).toBe(true);
  });
  it("hits the worst case on sorted input with a last-item pivot: n(n-1)/2 comparisons, n levels deep", () => {
    const n = SORTED.length;
    const f = algo("quicksort").build(SORTED, 0) as Bars[];
    expect(last(f).arr).toEqual(SORTED);
    expect(last(f).stats.Comparisons).toBe((n * (n - 1)) / 2);
    expect(last(f).stats["Deepest recursion"]).toBe(n);
  });
  it("stays about log₂ n deep when pivots split well, versus n deep on sorted input", () => {
    // The first pivot, 4, is the median, so the first split is even.
    const input = [1, 3, 2, 5, 7, 6, 4];
    const n = input.length;
    const f = algo("quicksort").build(input, 0) as Bars[];
    expect(last(f).arr).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(last(f).stats["Deepest recursion"]).toBeLessThanOrEqual(Math.ceil(Math.log2(n + 1)) + 1);
    const worst = algo("quicksort").build([1, 2, 3, 4, 5, 6, 7], 0) as Bars[];
    expect(last(worst).stats["Deepest recursion"]).toBe(n);
  });
  it("handles one or two items", () => {
    expect(last(algo("quicksort").build([4], 0) as Bars[]).arr).toEqual([4]);
    expect(last(algo("quicksort").build([9, 4], 0) as Bars[]).arr).toEqual([4, 9]);
  });
});

describe("makeArray", () => {
  it("returns sorted, reversed, or shuffled distinct values", async () => {
    const { makeArray } = await import("@/lib/visualizer");
    const s = makeArray(10, "sorted");
    expect(s).toEqual([...s].sort((a, b) => a - b));
    const r = makeArray(10, "reversed");
    expect(r).toEqual([...r].sort((a, b) => b - a));
    expect(new Set(makeArray(10, "random")).size).toBe(10);
  });
});

/* Frame builders for the algorithm visualizer. Every run is precomputed into frames,
   so the player can step forward, step back, play, and restart.
   To add an algorithm, write a builder that returns Frame[] and add it to ALGOS. */

import { shuffle } from "./utils";

export type Role =
  | "compare" | "swap" | "range" | "mid" | "sorted" | "found" | "out"
  | "frontier" | "current" | "done";

type Marks = Record<number, Role>;
type Stats = Record<string, number>;

export type Frame =
  | { kind: "bars"; arr: number[]; marks: Marks; msg: string; stats: Stats }
  | { kind: "cells"; arr: number[]; marks: Marks; msg: string; stats: Stats; target: number }
  | {
      kind: "graph";
      state: Record<string, "unseen" | "frontier" | "current" | "done">;
      list: string[];
      listLabel: string;
      order: string[];
      depth: Record<string, number>;
      msg: string;
      stats: Stats;
    };

export type AlgoKind = "search" | "sort" | "graph";

/** Distinct values from 5 to 99. */
export function randomArray(n: number): number[] {
  const pool: number[] = [];
  for (let v = 5; v < 100; v++) pool.push(v);
  return shuffle(pool).slice(0, n);
}

export type InputOrder = "random" | "sorted" | "reversed";

/** Random distinct values, optionally pre-sorted to show best and worst cases. */
export function makeArray(n: number, order: InputOrder): number[] {
  const a = randomArray(n);
  if (order === "sorted") a.sort((x, y) => x - y);
  if (order === "reversed") a.sort((x, y) => y - x);
  return a;
}

function bubbleFrames(input: number[]): Frame[] {
  const a = input.slice(), n = a.length, f: Frame[] = [], sorted: Marks = {};
  let c = 0, sw = 0;
  const snap = (marks: Marks, msg: string) =>
    f.push({ kind: "bars", arr: a.slice(), marks: { ...sorted, ...marks }, msg, stats: { Comparisons: c, Swaps: sw } });
  snap({}, "Start. Bubble sort compares neighbors and swaps them if they are out of order.");
  for (let pass = 0; pass < n - 1; pass++) {
    let swapped = false;
    for (let i = 0; i < n - 1 - pass; i++) {
      c++;
      snap(
        { [i]: "compare", [i + 1]: "compare" },
        `Compare ${a[i]} and ${a[i + 1]}.` + (a[i] > a[i + 1] ? " Out of order, so swap." : " Already in order."),
      );
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        sw++;
        swapped = true;
        snap({ [i]: "swap", [i + 1]: "swap" }, `Swapped. ${a[i]} is now before ${a[i + 1]}.`);
      }
    }
    sorted[n - 1 - pass] = "sorted";
    if (!swapped) {
      for (let k = 0; k < n; k++) sorted[k] = "sorted";
      snap({}, "No swaps in that pass, so the array is sorted. This early exit is why the best case is O(n).");
      return f;
    }
    snap({}, `Pass ${pass + 1} done. ${a[n - 1 - pass]} is in its final place.`);
  }
  for (let j = 0; j < n; j++) sorted[j] = "sorted";
  snap({}, `Sorted after ${c} comparisons and ${sw} swaps.`);
  return f;
}

function mergeFrames(input: number[]): Frame[] {
  const a = input.slice(), n = a.length, f: Frame[] = [];
  let c = 0, w = 0;
  const snap = (marks: Marks, msg: string) =>
    f.push({ kind: "bars", arr: a.slice(), marks, msg, stats: { Comparisons: c, Writes: w } });
  const range = (lo: number, hi: number): Marks => {
    const m: Marks = {};
    for (let i = lo; i < hi; i++) m[i] = "range";
    return m;
  };
  snap({}, "Start. Merge sort splits the array in half, sorts each half, then merges them.");
  function sort(lo: number, hi: number) {
    if (hi - lo < 2) return;
    const mid = (lo + hi) >> 1;
    snap(range(lo, hi), `Split positions ${lo} to ${hi - 1} into two halves.`);
    sort(lo, mid);
    sort(mid, hi);
    const left = a.slice(lo, mid), right = a.slice(mid, hi);
    let i = 0, j = 0, k = lo;
    const write = (v: number, msg: string) => {
      a[k] = v;
      w++;
      snap({ ...range(lo, hi), [k]: "swap" }, msg);
      k++;
    };
    while (i < left.length && j < right.length) {
      c++;
      const v = left[i] <= right[j] ? left[i++] : right[j++];
      write(v, `Merge: the smaller front item is ${v}. Write it to position ${k}.`);
    }
    while (i < left.length) write(left[i++], `Copy the leftover ${left[i - 1]} to position ${k}.`);
    while (j < right.length) write(right[j++], `Copy the leftover ${right[j - 1]} to position ${k}.`);
  }
  sort(0, n);
  const done: Marks = {};
  for (let x = 0; x < n; x++) done[x] = "sorted";
  snap(done, `Sorted after ${c} comparisons and ${w} writes. Merging needs a temporary buffer, so space is O(n).`);
  return f;
}

function insertionFrames(input: number[]): Frame[] {
  const a = input.slice(), n = a.length, f: Frame[] = [];
  let c = 0, sh = 0;
  const snap = (marks: Marks, msg: string) =>
    f.push({ kind: "bars", arr: a.slice(), marks, msg, stats: { Comparisons: c, Shifts: sh } });
  const prefix = (end: number): Marks => {
    const m: Marks = {};
    for (let i = 0; i < end; i++) m[i] = "range";
    return m;
  };
  snap(prefix(1), "Start. The first item on its own is a sorted part. Each next item is inserted into it.");
  for (let i = 1; i < n; i++) {
    snap({ ...prefix(i), [i]: "mid" }, `Insert ${a[i]} into the sorted part on its left.`);
    for (let j = i; j > 0; j--) {
      c++;
      const out = a[j - 1] > a[j];
      snap(
        { ...prefix(i + 1), [j - 1]: "compare", [j]: "compare" },
        `Compare ${a[j - 1]} and ${a[j]}.` + (out ? " Out of order, so shift it left." : " In order, so it stays here."),
      );
      if (!out) break;
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      sh++;
      snap({ ...prefix(i + 1), [j - 1]: "swap", [j]: "swap" }, `Shifted ${a[j - 1]} one place left.`);
    }
    snap(prefix(i + 1), `The first ${i + 1} items are in order.`);
  }
  const done: Marks = {};
  for (let x = 0; x < n; x++) done[x] = "sorted";
  snap(
    done,
    `Sorted after ${c} comparisons and ${sh} shifts. On already-sorted input each item needs one comparison, which is the O(n) best case.`,
  );
  return f;
}

function quickFrames(input: number[]): Frame[] {
  const a = input.slice(), n = a.length, f: Frame[] = [], fixed: Marks = {};
  let c = 0, sw = 0, depth = 0, maxDepth = 0;
  const snap = (marks: Marks, msg: string) =>
    f.push({
      kind: "bars",
      arr: a.slice(),
      marks: { ...marks, ...fixed },
      msg,
      stats: { Comparisons: c, Swaps: sw, "Deepest recursion": maxDepth },
    });
  const range = (lo: number, hi: number): Marks => {
    const m: Marks = {};
    for (let i = lo; i <= hi; i++) m[i] = "range";
    return m;
  };
  snap({}, "Start. Quicksort picks a pivot, moves smaller items to its left and larger ones to its right, then sorts each side.");
  function sort(lo: number, hi: number) {
    if (lo > hi) return;
    depth++;
    maxDepth = Math.max(maxDepth, depth);
    if (lo === hi) {
      fixed[lo] = "sorted";
      snap({}, `Position ${lo} is a part of one item, so it is already in place.`);
      depth--;
      return;
    }
    const pivot = a[hi];
    snap({ ...range(lo, hi), [hi]: "mid" }, `Partition positions ${lo} to ${hi} around the pivot ${pivot}, the last item.`);
    let i = lo;
    for (let j = lo; j < hi; j++) {
      c++;
      const smaller = a[j] < pivot;
      snap(
        { ...range(lo, hi), [hi]: "mid", [j]: "compare" },
        `Compare ${a[j]} with the pivot ${pivot}.` + (smaller ? " Smaller, so it joins the left side." : " Not smaller, so it stays right."),
      );
      if (smaller) {
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          sw++;
          snap({ ...range(lo, hi), [hi]: "mid", [i]: "swap", [j]: "swap" }, `Swap ${a[j]} and ${a[i]}.`);
        }
        i++;
      }
    }
    if (i !== hi) {
      [a[i], a[hi]] = [a[hi], a[i]];
      sw++;
    }
    fixed[i] = "sorted";
    snap(range(lo, hi), `The pivot ${pivot} moves to position ${i}. Everything left of it is smaller and everything right of it is larger.`);
    sort(lo, i - 1);
    sort(i + 1, hi);
    depth--;
  }
  sort(0, n - 1);
  snap(
    {},
    `Sorted after ${c} comparisons and ${sw} swaps, with recursion ${maxDepth} levels deep. ` +
      "Even splits give about log₂ n levels and O(n log n) time. A last-item pivot on sorted input gives n levels and O(n²).",
  );
  return f;
}

function linearFrames(a: number[], target: number): Frame[] {
  const f: Frame[] = [], n = a.length;
  let c = 0;
  const snap = (marks: Marks, msg: string) =>
    f.push({ kind: "cells", arr: a, marks, msg, stats: { Comparisons: c }, target });
  snap({}, `Start. Look for ${target} by checking each item from the left.`);
  for (let i = 0; i < n; i++) {
    c++;
    const m: Marks = {};
    for (let k = 0; k < i; k++) m[k] = "out";
    m[i] = "compare";
    if (a[i] === target) {
      m[i] = "found";
      snap(m, `Position ${i} holds ${target}. Found after ${c} comparisons.`);
      return f;
    }
    snap(m, `Position ${i} holds ${a[i]}, not ${target}. Move on.`);
  }
  const all: Marks = {};
  for (let j = 0; j < n; j++) all[j] = "out";
  snap(all, `${target} is not in the array. That took all ${c} comparisons.`);
  return f;
}

function binaryFrames(input: number[], target: number): Frame[] {
  const a = input.slice().sort((x, y) => x - y), f: Frame[] = [];
  let c = 0;
  const snap = (lo: number, hi: number, mid: number | null, role: Role | null, msg: string) => {
    const m: Marks = {};
    for (let i = 0; i < a.length; i++) m[i] = i < lo || i > hi ? "out" : "range";
    if (mid != null) m[mid] = role || "mid";
    f.push({ kind: "cells", arr: a, marks: m, msg, stats: { Comparisons: c }, target });
  };
  let lo = 0, hi = a.length - 1;
  snap(lo, hi, null, null, `Start. The array is sorted. Look for ${target} in positions ${lo} to ${hi}.`);
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    c++;
    if (a[mid] === target) {
      snap(lo, hi, mid, "found", `Middle is position ${mid}, which holds ${target}. Found after ${c} comparisons.`);
      return f;
    }
    if (a[mid] < target) {
      snap(lo, hi, mid, "mid", `Middle holds ${a[mid]}, which is less than ${target}. Discard the left half.`);
      lo = mid + 1;
    } else {
      snap(lo, hi, mid, "mid", `Middle holds ${a[mid]}, which is greater than ${target}. Discard the right half.`);
      hi = mid - 1;
    }
    if (lo <= hi) snap(lo, hi, null, null, `Now search positions ${lo} to ${hi}.`);
  }
  const m: Marks = {};
  for (let i = 0; i < a.length; i++) m[i] = "out";
  f.push({
    kind: "cells",
    arr: a,
    marks: m,
    msg: `${target} is not in the array. The range is empty after ${c} comparisons.`,
    stats: { Comparisons: c },
    target,
  });
  return f;
}

/** A fixed graph so the layout is predictable and readable. */
export const GRAPH = {
  nodes: [
    { id: "A", x: 70, y: 150 }, { id: "B", x: 190, y: 70 }, { id: "C", x: 190, y: 230 },
    { id: "D", x: 320, y: 40 }, { id: "E", x: 320, y: 140 }, { id: "F", x: 320, y: 250 },
    { id: "G", x: 450, y: 190 }, { id: "H", x: 570, y: 130 },
  ],
  edges: [["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"], ["C", "F"], ["E", "G"], ["F", "G"], ["G", "H"], ["E", "D"]] as [string, string][],
};

const ADJ: Record<string, string[]> = {};
GRAPH.nodes.forEach((n) => (ADJ[n.id] = []));
GRAPH.edges.forEach(([u, v]) => {
  ADJ[u].push(v);
  ADJ[v].push(u);
});
Object.values(ADJ).forEach((l) => l.sort());

function graphFrames(kind: "bfs" | "dfs"): Frame[] {
  const f: Frame[] = [], order: string[] = [], depth: Record<string, number> = { A: 0 };
  const state: Record<string, "unseen" | "frontier" | "current" | "done"> = {};
  let edges = 0;
  GRAPH.nodes.forEach((n) => (state[n.id] = "unseen"));
  const snap = (msg: string, list: string[], listLabel: string) =>
    f.push({
      kind: "graph",
      state: { ...state },
      list: list.slice(),
      listLabel,
      order: order.slice(),
      depth: { ...depth },
      msg,
      stats: { Visited: order.length, "Edges checked": edges },
    });

  if (kind === "bfs") {
    const q = ["A"];
    state.A = "frontier";
    snap("Start at A. BFS uses a queue: the oldest discovered node is processed first.", q, "Queue");
    while (q.length) {
      const u = q.shift()!;
      state[u] = "current";
      order.push(u);
      snap(`Dequeue ${u} and look at its neighbors.`, q, "Queue");
      for (const v of ADJ[u]) {
        edges++;
        if (state[v] === "unseen") {
          state[v] = "frontier";
          depth[v] = depth[u] + 1;
          q.push(v);
          snap(`Neighbor ${v} is new. Add it to the queue at distance ${depth[v]}.`, q, "Queue");
        }
      }
      state[u] = "done";
      snap(`Finished ${u}.`, q, "Queue");
    }
    snap(
      `Done. BFS visited nodes in order of distance from A: ${order.join(", ")}. Each node and edge was handled once, so the cost is O(V + E).`,
      q,
      "Queue",
    );
  } else {
    const stack: string[] = [];
    const dfs = (u: string) => {
      state[u] = "current";
      order.push(u);
      stack.push(u);
      snap(`Visit ${u} and go deeper into its first unvisited neighbor.`, stack, "Call stack");
      for (const v of ADJ[u]) {
        edges++;
        if (state[v] === "unseen") {
          dfs(v);
          state[u] = "current";
          snap(`Back at ${u}. Try its next neighbor.`, stack, "Call stack");
        }
      }
      state[u] = "done";
      stack.pop();
      snap(`Finished ${u}. Backtrack.`, stack, "Call stack");
    };
    snap("Start at A. DFS follows one path as far as it can, then backtracks.", [], "Call stack");
    dfs("A");
    snap(
      `Done. DFS visited nodes in this order: ${order.join(", ")}. Each node and edge was handled once, so the cost is O(V + E).`,
      [],
      "Call stack",
    );
  }
  return f;
}

export interface Algo {
  id: string;
  label: string;
  kind: AlgoKind;
  /** The id of the matching topic. Its time and space are shown unless overridden here. */
  entry: string | null;
  /** Only for algorithms without a topic entry. */
  time?: string;
  space?: string;
  /** Overrides the legend for its kind when the colors mean something different. */
  legend?: [Role, string][];
  build(data: number[], target: number): Frame[];
}

export const ALGOS: Algo[] = [
  { id: "linear-search", label: "Linear search", kind: "search", entry: "linear-search", build: linearFrames },
  { id: "binary-search", label: "Binary search", kind: "search", entry: "binary-search", build: binaryFrames },
  { id: "bubble-sort", label: "Bubble sort", kind: "sort", entry: null, time: "O(n²), O(n) best with early exit", space: "O(1)", build: (d) => bubbleFrames(d) },
  {
    id: "insertion-sort",
    label: "Insertion sort",
    kind: "sort",
    entry: null,
    time: "O(n²) average and worst case; O(n) on already-sorted input",
    space: "O(1)",
    legend: [["mid", "Item being inserted"], ["compare", "Being compared"], ["swap", "Just shifted"], ["range", "Sorted part so far"], ["sorted", "In final position"]],
    build: (d) => insertionFrames(d),
  },
  { id: "merge-sort", label: "Merge sort", kind: "sort", entry: "mergesort", build: (d) => mergeFrames(d) },
  {
    id: "quicksort",
    label: "Quicksort",
    kind: "sort",
    entry: "quicksort",
    legend: [["mid", "Pivot"], ["compare", "Compared with the pivot"], ["swap", "Just swapped"], ["range", "Part being partitioned"], ["sorted", "In final position"]],
    build: (d) => quickFrames(d),
  },
  { id: "bfs", label: "Breadth-first search", kind: "graph", entry: "bfs", build: () => graphFrames("bfs") },
  { id: "dfs", label: "Depth-first search", kind: "graph", entry: "dfs", build: () => graphFrames("dfs") },
];

export const LEGEND: Record<AlgoKind, [Role, string][]> = {
  sort: [["compare", "Being compared"], ["swap", "Just swapped or written"], ["range", "Part being merged"], ["sorted", "In final position"]],
  search: [["compare", "Being checked"], ["mid", "Middle of the range"], ["range", "Still in play"], ["out", "Ruled out"], ["found", "Found"]],
  graph: [["frontier", "Discovered, not yet processed"], ["current", "Being processed"], ["done", "Finished"]],
};

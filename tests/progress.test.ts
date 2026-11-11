import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  STORAGE_KEY,
  commit,
  normalize,
  persistenceNote,
  read,
  resetCache,
  subscribe,
  toggle,
  withQuizResult,
} from "@/lib/progressStore";

class MemoryStorage {
  data = new Map<string, string>();
  failGet = false;
  failSet = false;
  getItem(k: string) {
    if (this.failGet) throw new Error("SecurityError");
    return this.data.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    if (this.failSet) throw new Error("QuotaExceededError");
    this.data.set(k, v);
  }
}

let storage: MemoryStorage;
let storageListeners: ((ev: { key: string | null }) => void)[];

beforeEach(() => {
  storage = new MemoryStorage();
  storageListeners = [];
  vi.stubGlobal("localStorage", storage);
  vi.stubGlobal("window", {
    addEventListener: (_: string, fn: (ev: { key: string | null }) => void) => storageListeners.push(fn),
    removeEventListener: () => {},
  });
  resetCache();
});
afterEach(() => vi.unstubAllGlobals());

describe("normalize", () => {
  it("fills in defaults for missing or non-object data", () => {
    for (const bad of [null, undefined, 42, "text", []]) {
      expect(normalize(bad)).toEqual({
        bookmarks: [],
        learned: [],
        last: null,
        quiz: { best: null, runs: 0 },
        challenge: { done: {} },
      });
    }
  });

  it("keeps valid data from the original site's shape", () => {
    const old = { bookmarks: ["bfs"], learned: ["dfs"], last: "bfs", quiz: { best: 80, runs: 3 }, challenge: { done: { pairs: true } } };
    expect(normalize(old)).toEqual(old);
  });

  it("drops wrong types, duplicates, and out-of-range values", () => {
    const s = normalize({
      bookmarks: ["bfs", 3, "bfs", null],
      learned: "dfs",
      last: 7,
      quiz: { best: 150, runs: -2 },
      challenge: { done: { a: true, b: "yes", c: false } },
    });
    expect(s.bookmarks).toEqual(["bfs"]);
    expect(s.learned).toEqual([]);
    expect(s.last).toBeNull();
    expect(s.quiz).toEqual({ best: null, runs: 0 });
    expect(s.challenge.done).toEqual({ a: true, c: false });
  });
});

describe("storage", () => {
  it("reads saved progress under the bigo:v1 key", () => {
    expect(STORAGE_KEY).toBe("bigo:v1");
    storage.data.set(STORAGE_KEY, JSON.stringify({ learned: ["trie"] }));
    expect(read()).toMatchObject({ persistent: true, state: { learned: ["trie"] } });
  });

  it("starts fresh on corrupt JSON without losing persistence", () => {
    storage.data.set(STORAGE_KEY, "{not json");
    expect(read()).toMatchObject({ persistent: true, state: { learned: [] } });
  });

  it("reports when storage is blocked", () => {
    storage.failGet = true;
    expect(read().persistent).toBe(false);
  });

  it("saves, notifies subscribers, and reports a full storage quota", () => {
    const seen: number[] = [];
    const off = subscribe(() => seen.push(1));
    commit({ ...read().state, learned: ["bfs"] });
    expect(JSON.parse(storage.data.get(STORAGE_KEY)!).learned).toEqual(["bfs"]);
    expect(read().persistent).toBe(true);

    storage.failSet = true;
    commit({ ...read().state, learned: ["bfs", "dfs"] });
    expect(read()).toMatchObject({ persistent: false, state: { learned: ["bfs", "dfs"] } });
    expect(seen).toHaveLength(2);
    off();
  });

  it("picks up changes made in another tab", () => {
    let calls = 0;
    subscribe(() => calls++);
    expect(read().state.learned).toEqual([]);
    storage.data.set(STORAGE_KEY, JSON.stringify({ learned: ["heapsort"] }));
    storageListeners.forEach((fn) => fn({ key: "other-key" }));
    expect(calls).toBe(0);
    storageListeners.forEach((fn) => fn({ key: STORAGE_KEY }));
    expect(calls).toBe(1);
    expect(read().state.learned).toEqual(["heapsort"]);
  });
});

describe("helpers", () => {
  it("toggle adds and removes, and says which", () => {
    expect(toggle(["a"], "b")).toEqual([["a", "b"], true]);
    expect(toggle(["a", "b"], "a")).toEqual([["b"], false]);
  });

  it("records quiz attempts and keeps the best percentage", () => {
    let s = normalize(null);
    s = withQuizResult(s, 7, 10);
    expect(s.quiz).toEqual({ best: 70, runs: 1 });
    s = withQuizResult(s, 5, 10);
    expect(s.quiz).toEqual({ best: 70, runs: 2 });
    s = withQuizResult(s, 10, 10);
    expect(s.quiz).toEqual({ best: 100, runs: 3 });
    expect(withQuizResult(normalize(null), 0, 0).quiz.best).toBe(0);
  });

  it("never claims progress syncs across devices", () => {
    expect(persistenceNote(true)).toMatch(/this browser on this device/);
    expect(persistenceNote(false)).toMatch(/only until you close this page/);
  });
});

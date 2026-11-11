/* Content integrity: every id, link, and answer in src/data points at something real.
   Each failure names the file and the item so it can be fixed directly. */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CHALLENGES } from "@/data/challenges";
import { COMPARE } from "@/data/compare";
import { ENTRIES, TOPIC_ORDER } from "@/data/entries";
import { LOOKUP } from "@/data/lookup";
import { MULTILANG } from "@/data/multilang";
import { QUIZ } from "@/data/quiz";
import { ROADMAP } from "@/data/roadmap";
import { COMPLEXITY_CLASSES, TOPICS } from "@/data/types";
import { NAV, TOPICS_PAGE, sectionHref } from "@/lib/routes";
import { ALGOS } from "@/lib/visualizer";

const ROOT = join(__dirname, "..");
const ids = new Set(ENTRIES.map((e) => e.id));

function duplicates<T>(list: T[]): T[] {
  return list.filter((x, i) => list.indexOf(x) !== i);
}

/** Every id="..." written in the page and section sources. */
function sourceIds(): Set<string> {
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const f of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, f.name);
      if (f.isDirectory()) walk(p);
      else if (p.endsWith(".tsx")) files.push(p);
    }
  };
  walk(join(ROOT, "src/app"));
  walk(join(ROOT, "src/components/sections"));
  const found = new Set<string>();
  for (const f of files) for (const m of readFileSync(f, "utf8").matchAll(/\bid="([a-z0-9-]+)"/g)) found.add(m[1]);
  return found;
}

function routeExists(href: string): boolean {
  const path = href.split("#")[0].replace(/^\/|\/$/g, "");
  if (existsSync(join(ROOT, "src/app/(sheet)", path, "page.tsx"))) return true;
  return existsSync(join(ROOT, "src/app", path, "page.tsx"));
}

describe("entries.ts", () => {
  it("has unique, URL-safe ids", () => {
    expect(duplicates(ENTRIES.map((e) => e.id)), "duplicate ids in entries.ts").toEqual([]);
    for (const e of ENTRIES) expect(e.id, `entries.ts: "${e.id}" is not lowercase-with-hyphens`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("uses known topics, classes, and relevance values", () => {
    for (const e of ENTRIES) {
      expect(TOPICS, `entries.ts "${e.id}": unknown topic "${e.topic}"`).toContain(e.topic);
      expect(e.classes.length, `entries.ts "${e.id}": no complexity classes`).toBeGreaterThan(0);
      for (const c of e.classes) expect(COMPLEXITY_CLASSES, `entries.ts "${e.id}": unknown class "${c}"`).toContain(c);
      expect(["High", "Medium"], `entries.ts "${e.id}": rel`).toContain(e.rel);
    }
    expect([...TOPIC_ORDER].sort()).toEqual([...TOPICS].sort());
  });

  it("fills in every text field", () => {
    for (const e of ENTRIES) {
      for (const k of ["name", "time", "space", "when", "why", "pitfall", "code"] as const) {
        expect(e[k].trim(), `entries.ts "${e.id}": empty ${k}`).not.toBe("");
      }
    }
  });

  it("links every non-pattern topic to an https reference", () => {
    for (const e of ENTRIES) {
      if (e.ref != null) expect(() => new URL(e.ref!), `entries.ts "${e.id}": bad ref`).not.toThrow();
      if (e.ref != null) expect(e.ref, `entries.ts "${e.id}": ref should use https`).toMatch(/^https:\/\//);
      // A few patterns have no good canonical page; every other topic needs a source.
      if (e.topic !== "Patterns") expect(e.ref, `entries.ts "${e.id}": missing ref`).not.toBeNull();
    }
  });

  it("points each section at a page and an id that exist", () => {
    const anchors = sourceIds();
    for (const e of ENTRIES) {
      const href = sectionHref(e.section);
      expect(routeExists(href), `entries.ts "${e.id}": section "${e.section}" maps to missing page ${href}`).toBe(true);
      expect(anchors.has(e.section), `entries.ts "${e.id}": no element with id="${e.section}"`).toBe(true);
    }
  });
});

describe("roadmap.ts", () => {
  const steps = ROADMAP.flatMap((l) => l.steps);

  it("lists every topic exactly once", () => {
    expect(duplicates(steps.map((s) => s.id)), "topics listed twice in roadmap.ts").toEqual([]);
    for (const s of steps) expect(ids.has(s.id), `roadmap.ts: unknown topic "${s.id}"`).toBe(true);
    for (const e of ENTRIES) expect(steps.some((s) => s.id === e.id), `roadmap.ts: "${e.id}" is missing`).toBe(true);
  });

  it("only needs topics that come earlier, so there are no cycles", () => {
    const seen = new Set<string>();
    for (const s of steps) {
      for (const n of s.needs) {
        expect(ids.has(n), `roadmap.ts "${s.id}": unknown prerequisite "${n}"`).toBe(true);
        expect(n, `roadmap.ts "${s.id}": needs itself`).not.toBe(s.id);
        expect(seen.has(n), `roadmap.ts "${s.id}": prerequisite "${n}" comes later in the order`).toBe(true);
      }
      seen.add(s.id);
    }
  });
});

describe("quiz.ts", () => {
  it("has a valid answer and distinct options for every question", () => {
    QUIZ.forEach((q, i) => {
      const where = `quiz.ts question ${i + 1} ("${q.q.slice(0, 40)}")`;
      expect(q.options.length, `${where}: needs 2 to 4 options for the 1-4 keys`).toBeGreaterThanOrEqual(2);
      expect(q.options.length, `${where}: needs 2 to 4 options for the 1-4 keys`).toBeLessThanOrEqual(4);
      expect(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, `${where}: answer index out of range`).toBe(true);
      expect(duplicates(q.options), `${where}: duplicate options`).toEqual([]);
      for (const o of q.options) expect(o.trim(), `${where}: empty option`).not.toBe("");
      expect(q.why.trim(), `${where}: missing explanation`).not.toBe("");
    });
  });

  it("has no repeated questions", () => {
    expect(duplicates(QUIZ.map((q) => q.q + "\n" + (q.code ?? "")))).toEqual([]);
  });
});

describe("challenges.ts", () => {
  it("has unique ids, every language, and answers inside the options", () => {
    expect(duplicates(CHALLENGES.map((c) => c.id)), "duplicate challenge ids").toEqual([]);
    for (const c of CHALLENGES) {
      for (const lang of ["python", "javascript", "java"] as const) {
        expect(c.langs[lang]?.trim(), `challenges.ts "${c.id}": missing ${lang} snippet`).toBeTruthy();
      }
      expect(c.timeOptions, `challenges.ts "${c.id}": time answer not in timeOptions`).toContain(c.time);
      expect(c.spaceOptions, `challenges.ts "${c.id}": space answer not in spaceOptions`).toContain(c.space);
      expect(duplicates(c.timeOptions), `challenges.ts "${c.id}": duplicate time options`).toEqual([]);
      expect(duplicates(c.spaceOptions), `challenges.ts "${c.id}": duplicate space options`).toEqual([]);
    }
  });
});

describe("lookup.ts, compare.ts, multilang.ts, visualizer.ts", () => {
  it("lookup rows have unique names and link to real topics", () => {
    expect(duplicates(LOOKUP.map((r) => r.name)), "duplicate lookup names").toEqual([]);
    for (const r of LOOKUP) {
      if (r.entry != null) expect(ids.has(r.entry), `lookup.ts "${r.name}": unknown entry "${r.entry}"`).toBe(true);
      for (const k of ["best", "avg", "worst", "space", "assume", "caveat"] as const) {
        expect(r[k].trim(), `lookup.ts "${r.name}": empty ${k}`).not.toBe("");
      }
    }
  });

  it("comparisons are keyed by real topics and use known kinds", () => {
    for (const [id, c] of Object.entries(COMPARE)) {
      expect(ids.has(id), `compare.ts: "${id}" is not a topic id`).toBe(true);
      expect(["sort", "graph", "search", "ds"], `compare.ts "${id}": kind`).toContain(c.kind);
    }
    // Every kind needs at least two items, or the topic page's "compare with" partner has nothing to pick.
    for (const kind of new Set(Object.values(COMPARE).map((c) => c.kind))) {
      expect(Object.values(COMPARE).filter((c) => c.kind === kind).length, `compare.ts: only one "${kind}"`).toBeGreaterThan(1);
    }
  });

  it("language variants belong to real topics and have code and a cost note", () => {
    for (const [id, v] of Object.entries(MULTILANG)) {
      expect(ids.has(id), `multilang.ts: "${id}" is not a topic id`).toBe(true);
      expect(Object.keys(v).length, `multilang.ts "${id}": no variants`).toBeGreaterThan(0);
      for (const [lang, x] of Object.entries(v)) {
        expect(["java", "cpp", "javascript"], `multilang.ts "${id}": unknown language ${lang}`).toContain(lang);
        expect(x!.code.trim(), `multilang.ts "${id}" ${lang}: empty code`).not.toBe("");
        expect(x!.cost.trim(), `multilang.ts "${id}" ${lang}: empty cost note`).not.toBe("");
      }
    }
  });

  it("visualizer algorithms have unique ids and real topics, or their own complexity", () => {
    expect(duplicates(ALGOS.map((a) => a.id))).toEqual([]);
    for (const a of ALGOS) {
      if (a.entry != null) expect(ids.has(a.entry), `visualizer.ts "${a.id}": unknown entry "${a.entry}"`).toBe(true);
      else expect(a.time && a.space, `visualizer.ts "${a.id}": needs time and space when it has no entry`).toBeTruthy();
    }
  });
});

describe("routes.ts", () => {
  const links = [TOPICS_PAGE, ...NAV.flatMap((g) => g.links)];

  it("has unique routes that all exist under src/app", () => {
    expect(duplicates(links.map((l) => l.href)), "duplicate routes in NAV").toEqual([]);
    for (const l of links) {
      expect(l.href, `routes.ts: "${l.href}" must start with / and have no trailing slash`).toMatch(/^\/[a-z0-9-]+$/);
      expect(routeExists(l.href), `routes.ts: no page for ${l.href}`).toBe(true);
      expect(l.blurb.trim(), `routes.ts ${l.href}: empty blurb`).not.toBe("");
    }
  });
});

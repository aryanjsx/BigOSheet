import { describe, expect, it } from "vitest";
import { complexityColor, firstBound } from "@/lib/complexity";
import { CURVES, OPS_PER_SEC, fmtDuration, fmtLog, fmtLogPlain, lg } from "@/lib/growth";

const curve = (key: string) => CURVES.find((c) => c.key === key)!;

describe("growth curves", () => {
  it("l(n) is log10 of f(n) wherever f(n) is finite", () => {
    for (const c of CURVES) {
      for (const n of [2, 3, 10, 30, 100, 1000]) {
        expect(c.l(n), `${c.label} at n=${n}`).toBeCloseTo(Math.log10(c.f(n)), 9);
      }
    }
  });

  it("stays finite for O(2ⁿ) far beyond what a double can hold", () => {
    const exp = curve("exp");
    expect(exp.f(1_000_000)).toBe(Infinity);
    expect(exp.l(1_000_000)).toBeCloseTo(1_000_000 * Math.log10(2), 6);
  });

  it("gives zero operations for log n at n = 1", () => {
    expect(curve("log").l(1)).toBe(-Infinity);
    expect(fmtLog(curve("log").l(1)).text).toBe("0");
  });

  it("orders the classes correctly for large n", () => {
    const n = 1e6;
    const ls = CURVES.map((c) => c.l(n));
    expect([...ls].sort((a, b) => a - b)).toEqual(ls);
  });
});

describe("fmtLog", () => {
  it("shows one decimal for small counts and grouping for medium ones", () => {
    expect(fmtLog(lg(19.93)).text).toBe("19.9");
    expect(fmtLog(lg(1_048_576)).text).toBe("1,048,576");
  });
  it("switches to scientific notation from 10⁹", () => {
    expect(fmtLog(lg(1e12))).toEqual({ text: "1.00 × 10", exp: 12 });
    expect(fmtLogPlain(lg(1e12))).toBe("1.00 × 10^12");
    // 2^1,000,000 is about 9.90 × 10^301029.
    expect(fmtLog(curve("exp").l(1_000_000))).toEqual({ text: "9.90 × 10", exp: 301029 });
  });
});

describe("fmtDuration", () => {
  const at = (ops: number) => fmtDuration(Math.log10(ops));
  it("assumes 10⁸ operations per second", () => {
    expect(OPS_PER_SEC).toBe(1e8);
    expect(at(1e8)).toBe("1.0 s");
  });
  it("covers each unit", () => {
    expect(fmtDuration(-Infinity)).toBe("instant");
    expect(at(1)).toBe("10 ns");
    expect(at(500)).toBe("5.0 µs");
    expect(at(1e3)).toBe("10 µs");
    expect(at(5e5)).toBe("5.0 ms");
    expect(at(1e6)).toBe("10 ms");
    expect(at(1e10)).toBe("2 min");
    expect(at(1e12)).toBe("2.8 hours");
    expect(at(8.64e12)).toBe("1 day");
    expect(at(3 * 8.64e12)).toBe("3 days");
    expect(at(3.15576e15)).toBe("1 year");
    expect(at(3.15576e16)).toBe("10 years");
    expect(at(3.15576e22)).toBe("10.0 million years");
  });
  it("caps astronomically long times instead of overflowing", () => {
    expect(fmtDuration(curve("exp").l(1_000_000))).toBe("longer than the age of the universe");
  });
});

describe("complexityColor", () => {
  it("colors by the first bound in the text", () => {
    expect(firstBound("O((V + E) log V) with a heap")).toBe("(V + E) log V");
    expect(complexityColor("O(1) expected; O(n) worst")).toBe("green");
    expect(complexityColor("O(α(n)) amortized")).toBe("green");
    expect(complexityColor("O(log n)")).toBe("yellow-green");
    expect(complexityColor("O(n)")).toBe("yellow");
    expect(complexityColor("O(V + E)")).toBe("yellow");
    expect(complexityColor("Θ(n log n)")).toBe("orange");
    expect(complexityColor("O((V + E) log V)")).toBe("orange");
    expect(complexityColor("O(n²)")).toBe("red");
    expect(complexityColor("O(V · E)")).toBe("red");
    expect(complexityColor("O(2ⁿ)")).toBe("dark-red");
    expect(complexityColor("O(n · n!)")).toBe("dark-red");
    expect(complexityColor("Depends on gaps")).toBe("gray");
  });
});

/* Growth classes and number formatting for the Big O playground. */

export const OPS_PER_SEC = 1e8;
const LOG2_10 = Math.log10(2);

/** log10 of a count, so huge values never overflow. */
export function lg(x: number): number {
  return x > 0 ? Math.log10(x) : -Infinity;
}

export interface Curve {
  key: string;
  label: string;
  name: string;
  color: string;
  /** Color class for the `<code>` swatch. */
  cls: string;
  /** Operation count. */
  f(n: number): number;
  /** log10 of the operation count. */
  l(n: number): number;
  dash: string;
}

export const CURVES: Curve[] = [
  { key: "c1", label: "O(1)", name: "Constant", color: "var(--c-green)", cls: "green", f: () => 1, l: () => 0, dash: "" },
  { key: "log", label: "O(log n)", name: "Logarithmic", color: "var(--c-yg)", cls: "yellow-green", f: (n) => Math.log2(n), l: (n) => lg(Math.log2(n)), dash: "6 3" },
  { key: "lin", label: "O(n)", name: "Linear", color: "var(--c-yellow)", cls: "yellow", f: (n) => n, l: (n) => lg(n), dash: "2 3" },
  { key: "nlog", label: "O(n log n)", name: "Linearithmic", color: "var(--c-orange)", cls: "orange", f: (n) => n * Math.log2(n), l: (n) => lg(n * Math.log2(n)), dash: "10 3 2 3" },
  { key: "quad", label: "O(n²)", name: "Quadratic", color: "var(--c-red)", cls: "red", f: (n) => n * n, l: (n) => 2 * lg(n), dash: "" },
  { key: "exp", label: "O(2ⁿ)", name: "Exponential", color: "var(--c-dred)", cls: "dark-red", f: (n) => Math.pow(2, n), l: (n) => n * LOG2_10, dash: "1 4" },
];

/** Splits a count, given as log10, into a mantissa and an optional power of ten. */
export function fmtLog(l: number): { text: string; exp?: number } {
  if (l === -Infinity) return { text: "0" };
  const v = Math.pow(10, l);
  if (l < 3) return { text: (Math.round(v * 10) / 10).toLocaleString("en-US") };
  if (l < 9) return { text: Math.round(v).toLocaleString("en-US") };
  const e = Math.floor(l);
  return { text: Math.pow(10, l - e).toFixed(2) + " × 10", exp: e };
}

export function fmtLogPlain(l: number): string {
  const f = fmtLog(l);
  return f.exp == null ? f.text : f.text + "^" + f.exp;
}

function plural(n: number, unit: string): string {
  return n.toLocaleString("en-US") + " " + unit + (n === 1 ? "" : "s");
}

/** An illustrative time: the operation count divided by OPS_PER_SEC. It is not a measurement.
    Takes log10 of the operation count, so astronomically large counts do not overflow. */
export function fmtDuration(lOps: number): string {
  if (lOps === -Infinity) return "instant";
  const ls = lOps - Math.log10(OPS_PER_SEC);
  const s = Math.pow(10, ls);
  if (ls < -6) return Math.max(1, Math.round(s * 1e9)) + " ns";
  if (ls < -3) return (s * 1e6 < 10 ? (s * 1e6).toFixed(1) : Math.round(s * 1e6)) + " µs";
  if (ls < 0) return (s * 1e3 < 10 ? (s * 1e3).toFixed(1) : Math.round(s * 1e3)) + " ms";
  if (ls < Math.log10(60)) return (s < 10 ? s.toFixed(1) : Math.round(s)) + " s";
  if (ls < Math.log10(3600)) return Math.round(s / 60) + " min";
  if (ls < Math.log10(86400)) return (s / 3600).toFixed(1) + " hours";
  const lyears = ls - Math.log10(31557600);
  if (lyears < 0) return plural(Math.round(s / 86400), "day");
  if (lyears > Math.log10(1.38e10)) return "longer than the age of the universe";
  const y = Math.pow(10, lyears);
  if (lyears < 6) return plural(Math.round(y), "year");
  return (y / 1e6).toFixed(1) + " million years";
}

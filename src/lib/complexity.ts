/* Picks the color class for a complexity string, so data written as plain text can be shown
   with the same color key as the hand-colored tables. Only the first bound in the string counts:
   "O(1) expected; O(n) worst" is colored as O(1). */

export type ColorClass = "green" | "yellow-green" | "yellow" | "orange" | "red" | "dark-red" | "gray";

/** The first O(...), Θ(...), or Ω(...) in the text, including nested parentheses. */
export function firstBound(text: string): string | null {
  const start = text.search(/[OΘΩ]\(/);
  if (start < 0) return null;
  let depth = 0;
  for (let i = start + 1; i < text.length; i++) {
    if (text[i] === "(") depth++;
    else if (text[i] === ")" && --depth === 0) return text.slice(start + 2, i);
  }
  return null;
}

export function complexityColor(text: string): ColorClass {
  const inner = firstBound(text);
  if (inner == null) return "gray";
  const x = inner.replace(/\s+/g, "");
  if (/2ⁿ|2\^n|n!/.test(x)) return "dark-red";
  if (/[²³]|V·E|V\*E/.test(x)) return "red";
  if (x === "1" || x === "α(n)") return "green";
  if (/^log[a-zA-Z]$/.test(x)) return "yellow-green";
  if (/log/.test(x)) return "orange";
  return "yellow";
}

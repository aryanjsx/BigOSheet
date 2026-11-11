"use client";

import CopyButton from "@/components/ui/CopyButton";
import Field from "@/components/ui/Field";
import { COMPARE } from "@/data/compare";
import type { CompareItem, CompareKind } from "@/data/types";
import { parsePair } from "@/lib/compare";
import { replaceHash, useHash } from "@/lib/hooks";
import { absoluteUrl, mdCell } from "@/lib/utils";

const KIND: Record<CompareKind, string> = { sort: "Sorting", graph: "Graph algorithms", search: "Searching", ds: "Data structures" };
const ROWS: [string, keyof CompareItem][] = [
  ["Time complexity", "time"],
  ["Auxiliary space", "space"],
  ["Stable", "stable"],
  ["In place", "inPlace"],
  ["Best used for", "useFor"],
  ["Trade-offs", "tradeoffs"],
];
const IDS = Object.keys(COMPARE);

/** Hides rows that do not apply to either side, such as stability for graph algorithms. */
function rowsFor(a: CompareItem, b: CompareItem) {
  return ROWS.filter(([, k]) => !(a[k] === "Not applicable" && b[k] === "Not applicable"));
}

function Picker({ id, label, value, onChange }: { id: string; label: string; value: string; onChange(v: string): void }) {
  return (
    <Field label={label} htmlFor={id}>
      <select id={id} value={value} onChange={(ev) => onChange(ev.target.value)}>
        {(Object.keys(KIND) as CompareKind[]).map((k) => (
          <optgroup key={k} label={KIND[k]}>
            {IDS.filter((i) => COMPARE[i].kind === k).map((i) => (
              <option key={i} value={i}>
                {COMPARE[i].name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </Field>
  );
}

export default function Compare() {
  // The pair lives in the URL hash (#mergesort,quicksort), so every comparison has its own link.
  const [ca, cb] = parsePair(useHash());
  const compare = { a: ca, b: cb };
  const setCompare = (a: string, b: string) => replaceHash(a + "," + b);
  const a = COMPARE[compare.a], b = COMPARE[compare.b];
  const rows = rowsFor(a, b);

  function markdown() {
    const lines = [`| Property | ${mdCell(a.name)} | ${mdCell(b.name)} |`, "| --- | --- | --- |"];
    rows.forEach(([label, k]) => lines.push(`| ${label} | ${mdCell(a[k])} | ${mdCell(b[k])} |`));
    return lines.join("\n");
  }

  return (
    <div className="compare">
      <div className="pg-controls">
        <Picker id="cmp-a" label="First" value={compare.a} onChange={(v) => setCompare(v, compare.b)} />
        <Picker id="cmp-b" label="Second" value={compare.b} onChange={(v) => setCompare(compare.a, v)} />
      </div>
      <div className="viz-buttons">
        <button type="button" className="btn" onClick={() => setCompare(compare.b, compare.a)}>
          Swap
        </button>
        <CopyButton label="Copy as Markdown" text={markdown} />
        <CopyButton label="Copy link" okLabel="Link copied" text={() => absoluteUrl(`/compare#${compare.a},${compare.b}`)} />
      </div>
      <p className="callout" hidden={a.kind === b.kind}>
        {a.kind === b.kind
          ? ""
          : "These two solve different kinds of problems. The table still lists their costs, but the choice between them is not a real trade-off."}
      </p>
      <div aria-live="polite">
        <div className="table-wrap" role="region" aria-label={`Comparison of ${a.name} and ${b.name}`} tabIndex={0}>
          <table className="table compare-table">
            <caption>
              {a.name} compared with {b.name}
            </caption>
            <thead>
              <tr>
                <th scope="col">Property</th>
                <th scope="col">{a.name}</th>
                <th scope="col">{b.name}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, k]) => (
                <tr key={k}>
                  <th scope="row">{label}</th>
                  <td className="notes">{a[k]}</td>
                  <td className="notes">{b[k]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

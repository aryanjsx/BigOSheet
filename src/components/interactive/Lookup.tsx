"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import { entryById } from "@/data/entries";
import { LOOKUP } from "@/data/lookup";
import type { LookupRow } from "@/data/types";
import { topicHref } from "@/lib/routes";
import { matchesTokens } from "@/lib/utils";

const MAX = 8;
const HAY = new Map(LOOKUP.map((r) => [r, (r.name + " " + r.group + " " + r.alias).toLowerCase()]));

function match(q: string): LookupRow[] {
  if (!q.trim()) return LOOKUP.slice(0, MAX);
  return LOOKUP.filter((r) => matchesTokens(q, HAY.get(r)!)).slice(0, MAX);
}

function Detail({ r }: { r: LookupRow | undefined }) {
  if (!r) return <p className="empty">Nothing matches. Try a shorter search, such as &quot;sort&quot; or &quot;heap&quot;.</p>;
  const rows: [string, string][] = [
    ["Best case", r.best],
    ["Average case", r.avg],
    ["Worst case", r.worst],
    ["Auxiliary space", r.space],
  ];
  return (
    <>
      <h2>{r.name}</h2>
      <div className="table-wrap" role="region" aria-label={"Complexity for " + r.name} tabIndex={0}>
        <table className="table lookup-table">
          <caption>Best, average, and worst-case time and auxiliary space for {r.name}.</caption>
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        <strong>Assumptions: </strong>
        {r.assume}
      </p>
      <p>
        <strong>Watch out for: </strong>
        {r.caveat}
      </p>
      <div className="links">
        {r.entry && entryById(r.entry) && <Link href={topicHref(r.entry)}>Read the full topic</Link>}
        <CopyButton
          className="btn btn-sm"
          label="Copy as text"
          text={`${r.name}\nBest: ${r.best}\nAverage: ${r.avg}\nWorst: ${r.worst}\nSpace: ${r.space}\nAssumptions: ${r.assume}\nCaveat: ${r.caveat}`}
        />
      </div>
    </>
  );
}

export default function Lookup() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [chosen, setChosen] = useState(0);
  const shown = useMemo(() => match(query), [query]);

  function choose(i: number) {
    setChosen(i);
    setActive(i);
  }

  function onKeyDown(ev: React.KeyboardEvent) {
    if (!shown.length) return;
    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      setActive((a) => (a + 1) % shown.length);
    } else if (ev.key === "ArrowUp") {
      ev.preventDefault();
      setActive((a) => (a - 1 + shown.length) % shown.length);
    } else if (ev.key === "Enter") {
      ev.preventDefault();
      choose(Math.max(active, 0));
    }
  }

  return (
    <div className="lookup">
      <label htmlFor="lookup-q">Operation or algorithm</label>
      <input
        id="lookup-q"
        type="search"
        autoComplete="off"
        placeholder="Try heap pop, quicksort, or hash lookup"
        role="combobox"
        aria-expanded={shown.length > 0}
        aria-controls="lookup-list"
        aria-autocomplete="list"
        aria-activedescendant={shown.length ? "lookup-opt-" + active : undefined}
        value={query}
        onChange={(ev) => {
          setQuery(ev.target.value);
          setActive(0);
          setChosen(0);
        }}
        onKeyDown={onKeyDown}
      />
      <ul className="lookup-list" id="lookup-list" role="listbox" aria-label="Matching operations">
        {shown.map((r, i) => (
          <li
            key={r.name}
            id={"lookup-opt-" + i}
            role="option"
            aria-selected={i === chosen}
            className={i === active ? "is-active" : undefined}
            onMouseDown={(ev) => ev.preventDefault()}
            onClick={() => choose(i)}
          >
            {r.name}
            <span className="lookup-group">{r.group}</span>
          </li>
        ))}
      </ul>
      <div className="lookup-detail" aria-live="polite">
        <Detail r={shown[chosen]} />
      </div>
    </div>
  );
}

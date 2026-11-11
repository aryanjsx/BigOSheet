"use client";

import { useRef } from "react";

export interface LangTab<K extends string> {
  key: K;
  label: string;
}

interface Props<K extends string> {
  tabs: LangTab<K>[];
  selected: K;
  onSelect(key: K): void;
  "aria-label": string;
}

/** An accessible tab list for switching code languages. Arrow keys, Home, and End move between tabs. */
export default function LangTabs<K extends string>({ tabs, selected, onSelect, ...rest }: Props<K>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(ev: React.KeyboardEvent, idx: number) {
    let n: number | null = null;
    if (ev.key === "ArrowRight") n = (idx + 1) % tabs.length;
    else if (ev.key === "ArrowLeft") n = (idx - 1 + tabs.length) % tabs.length;
    else if (ev.key === "Home") n = 0;
    else if (ev.key === "End") n = tabs.length - 1;
    if (n == null) return;
    ev.preventDefault();
    onSelect(tabs[n].key);
    refs.current[n]?.focus();
  }

  return (
    <div className="lang-tabs" role="tablist" aria-label={rest["aria-label"]}>
      {tabs.map((t, idx) => (
        <button
          key={t.key}
          ref={(b) => {
            refs.current[idx] = b;
          }}
          type="button"
          className="lang-tab"
          role="tab"
          aria-selected={t.key === selected}
          tabIndex={t.key === selected ? 0 : -1}
          onClick={() => onSelect(t.key)}
          onKeyDown={(ev) => onKeyDown(ev, idx)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

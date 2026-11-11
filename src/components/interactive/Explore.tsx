"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import TopicCard from "./TopicCard";
import { useProgress } from "@/context/ProgressContext";
import { useSheet } from "@/context/SheetContext";
import { ENTRIES, entryById } from "@/data/entries";
import { topicHref } from "@/lib/routes";
import { TOPICS } from "@/data/types";
import { EMPTY_FILTERS, matchesFilters, type Filters } from "@/lib/search";

const CLASS_OPTIONS: [string, string][] = [
  ["constant", "Constant, O(1)"],
  ["logarithmic", "Logarithmic, O(log n)"],
  ["linear", "Linear, O(n) or O(V + E)"],
  ["linearithmic", "Linearithmic, O(n log n)"],
  ["polynomial", "Polynomial, O(n²) or higher"],
  ["exponential", "Exponential or factorial"],
];

function Resume() {
  const { state } = useProgress();
  const e = entryById(state.last);
  if (!e) return <p id="resume" />;
  return (
    <p id="resume">
      Continue where you left off:{" "}
      <Link className="btn btn-sm" href={topicHref(e.id)} aria-label={"Open " + e.name + ", the last topic you viewed"}>
        {e.name}
      </Link>
    </p>
  );
}

export default function Explore() {
  const progress = useProgress();
  const { filters, setFilters } = useSheet();
  const qRef = useRef<HTMLInputElement>(null);
  const list = ENTRIES.filter((e) => matchesFilters(e, filters, progress));

  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters({ ...filters, [key]: value });
  }

  // The "/" shortcut from another page lands on #search.
  useEffect(() => {
    if (location.hash === "#search") qRef.current?.focus();
  }, []);

  return (
    <div id="search">
      <div className="filters" role="search">
        <div className="search-box">
          <label htmlFor="q">Search</label>
          <input
            id="q"
            ref={qRef}
            type="search"
            placeholder="Try heap, BFS, or two pointers"
            autoComplete="off"
            value={filters.q}
            onChange={(ev) => set("q", ev.target.value)}
          />
        </div>
        <div>
          <label htmlFor="f-topic">Topic</label>
          <select id="f-topic" value={filters.topic} onChange={(ev) => set("topic", ev.target.value as Filters["topic"])}>
            <option value="">All topics</option>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-class">Complexity class</label>
          <select id="f-class" value={filters.cls} onChange={(ev) => set("cls", ev.target.value as Filters["cls"])}>
            <option value="">Any complexity</option>
            {CLASS_OPTIONS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-rel">Interview relevance</label>
          <select id="f-rel" value={filters.rel} onChange={(ev) => set("rel", ev.target.value as Filters["rel"])}>
            <option value="">Any relevance</option>
            <option>High</option>
            <option>Medium</option>
          </select>
        </div>
        <div>
          <label htmlFor="f-status">My progress</label>
          <select id="f-status" value={filters.status} onChange={(ev) => set("status", ev.target.value as Filters["status"])}>
            <option value="">All topics</option>
            <option value="saved">Saved</option>
            <option value="learned">Learned</option>
            <option value="todo">Not learned yet</option>
          </select>
        </div>
        <button
          type="button"
          className="btn"
          id="f-reset"
          onClick={() => {
            setFilters(EMPTY_FILTERS);
            qRef.current?.focus();
          }}
        >
          Reset filters
        </button>
      </div>
      <Resume />
      <p id="result-count" aria-live="polite">
        {list.length} of {ENTRIES.length} topics shown
      </p>
      <div id="cards" className="cards">
        {list.length ? (
          list.map((e) => <TopicCard key={e.id} e={e} />)
        ) : (
          <p className="empty">Nothing matches. Try a shorter search or reset the filters.</p>
        )}
      </div>
    </div>
  );
}

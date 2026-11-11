"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSheet } from "@/context/SheetContext";
import { EMPTY_FILTERS } from "@/lib/search";

/** Starts a topic search from the home page. The query carries over to /topics through shared state. */
export default function HomeSearch() {
  const { setFilters } = useSheet();
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <form
      className="hero-search"
      role="search"
      onSubmit={(ev) => {
        ev.preventDefault();
        setFilters({ ...EMPTY_FILTERS, q: q.trim() });
        router.push("/topics");
      }}
    >
      <label htmlFor="home-q" className="sr-only">
        Search topics
      </label>
      <input
        id="home-q"
        type="search"
        placeholder="heap, BFS, two pointers…"
        autoComplete="off"
        value={q}
        onChange={(ev) => setQ(ev.target.value)}
      />
      <button type="submit" className="btn btn-primary">
        Search
      </button>
    </form>
  );
}

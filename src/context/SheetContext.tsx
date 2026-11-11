"use client";

/* UI state shared across pages: search filters (kept while you move between pages, so
   Export can use "topics matching your search"), the shortcuts dialog, printable cards,
   and screen reader announcements. */

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Entry } from "@/data/types";
import { EMPTY_FILTERS, type Filters } from "@/lib/search";

interface SheetApi {
  filters: Filters;
  setFilters(f: Filters): void;

  shortcutsOpen: boolean;
  setShortcutsOpen(open: boolean): void;

  printList: Entry[] | null;
  setPrintList(list: Entry[] | null): void;

  liveMessage: string;
  announce(msg: string): void;
}

const SheetContext = createContext<SheetApi | null>(null);

export function SheetProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [printList, setPrintList] = useState<Entry[] | null>(null);
  const [liveMessage, setLiveMessage] = useState("");

  const announce = useCallback((msg: string) => {
    setLiveMessage("");
    setTimeout(() => setLiveMessage(msg), 20);
  }, []);

  const api = useMemo<SheetApi>(
    () => ({ filters, setFilters, shortcutsOpen, setShortcutsOpen, printList, setPrintList, liveMessage, announce }),
    [filters, shortcutsOpen, printList, liveMessage, announce],
  );

  return <SheetContext.Provider value={api}>{children}</SheetContext.Provider>;
}

export function useSheet(): SheetApi {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("useSheet must be used inside <SheetProvider>");
  return ctx;
}

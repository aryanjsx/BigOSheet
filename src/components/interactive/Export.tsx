"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import Field from "@/components/ui/Field";
import { useProgress } from "@/context/ProgressContext";
import { useSheet } from "@/context/SheetContext";
import { ENTRIES } from "@/data/entries";
import { LOOKUP } from "@/data/lookup";
import type { Entry } from "@/data/types";
import { matchesFilters } from "@/lib/search";
import { copyText, download, mdCell, toCsv } from "@/lib/utils";

type Scope = "all" | "filtered" | "saved" | "learned";

const SCOPES: [Scope, string][] = [
  ["all", "All topics"],
  ["filtered", "Topics matching your last search"],
  ["saved", "Saved topics"],
  ["learned", "Learned topics"],
];

export default function Export() {
  const progress = useProgress();
  const { filters, setPrintList, announce } = useSheet();
  const [scope, setScope] = useState<Scope>("all");
  const [status, setStatus] = useState("");
  const [mdLabel, setMdLabel] = useState<string | null>(null);

  function list(): Entry[] {
    if (scope === "saved") return ENTRIES.filter((e) => progress.isSaved(e.id));
    if (scope === "learned") return ENTRIES.filter((e) => progress.isLearned(e.id));
    if (scope === "filtered") return ENTRIES.filter((e) => matchesFilters(e, filters, progress));
    return ENTRIES;
  }
  function nonEmpty(): Entry[] | null {
    const l = list();
    if (!l.length) {
      setStatus('Nothing to export for that choice. Save or mark a topic first, or pick "All topics".');
      return null;
    }
    return l;
  }

  async function copyMarkdown() {
    const l = nonEmpty();
    if (!l) return;
    const lines = ["| Topic | Group | Time | Space | Interview relevance |", "| --- | --- | --- | --- | --- |"];
    l.forEach((e) => lines.push(`| ${mdCell(e.name)} | ${mdCell(e.topic)} | ${mdCell(e.time)} | ${mdCell(e.space)} | ${mdCell(e.rel)} |`));
    const ok = await copyText(lines.join("\n"));
    const msg = ok ? "Copied " + l.length : "Copy failed";
    setMdLabel(msg);
    announce(msg);
    setTimeout(() => setMdLabel(null), 1500);
    setStatus(ok ? `Copied a Markdown table with ${l.length} topics.` : "");
  }

  function downloadCsv() {
    const l = nonEmpty();
    if (!l) return;
    const rows = l.map((e) => [e.id, e.name, e.topic, e.time, e.space, e.rel, e.classes.join(" "), e.keywords, e.ref || ""]);
    download(
      "big-o-cheat-sheet.csv",
      toCsv(["id", "name", "topic", "time", "space", "interview_relevance", "classes", "keywords", "reference"], rows),
      "text/csv;charset=utf-8",
    );
    setStatus(`Downloaded big-o-cheat-sheet.csv with ${l.length} topics.`);
  }

  function downloadLookup() {
    const rows = LOOKUP.map((r) => [r.name, r.group, r.best, r.avg, r.worst, r.space, r.assume, r.caveat]);
    download(
      "big-o-lookup.csv",
      toCsv(["operation", "group", "best", "average", "worst", "auxiliary_space", "assumptions", "caveats"], rows),
      "text/csv;charset=utf-8",
    );
    setStatus(`Downloaded big-o-lookup.csv with ${rows.length} rows.`);
  }

  function printCards() {
    const l = nonEmpty();
    if (!l) return;
    flushSync(() => setPrintList(l));
    document.body.classList.add("print-cards");
    const cleanup = () => {
      document.body.classList.remove("print-cards");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
  }

  return (
    <div className="export">
      <div className="pg-controls">
        <Field label="What to export" htmlFor="exp-scope">
          <select id="exp-scope" value={scope} onChange={(ev) => {
              setScope(ev.target.value as Scope);
              setStatus("");
            }}>
            {SCOPES.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="viz-buttons" role="group" aria-label="Export actions">
        <button type="button" className="btn" onClick={copyMarkdown}>
          {mdLabel ?? "Copy Markdown table"}
        </button>
        <button type="button" className="btn" onClick={downloadCsv}>
          Download CSV
        </button>
        <button type="button" className="btn" onClick={downloadLookup}>
          Download lookup CSV
        </button>
        <button type="button" className="btn" onClick={printCards}>
          Print topic cards
        </button>
      </div>
      <p className="footnotes" role="status">
        {status}
      </p>
      <p className="footnotes">
        To share a single topic, use Copy link on its card. Comparison links keep both choices. Opening a shared link works
        offline too.
      </p>
    </div>
  );
}

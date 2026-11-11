"use client";

import Link from "next/link";
import { useProgress } from "@/context/ProgressContext";
import { useSheet } from "@/context/SheetContext";
import { entryById } from "@/data/entries";
import { ROADMAP } from "@/data/roadmap";
import { topicHref } from "@/lib/routes";

// Only steps whose entry exists are shown, numbered in one continuous order across levels.
const LEVELS = ROADMAP.map((lvl) => ({ ...lvl, steps: lvl.steps.filter((s) => entryById(s.id)) }));
const STEPS = LEVELS.flatMap((l) => l.steps);
const STARTS = LEVELS.map((_, i) => LEVELS.slice(0, i).reduce((n, l) => n + l.steps.length, 0) + 1);

export default function Roadmap() {
  const progress = useProgress();
  const { announce } = useSheet();
  const { isLearned } = progress;

  const total = STEPS.length;
  const done = STEPS.filter((s) => isLearned(s.id)).length;
  const ready = (needs: string[]) => needs.every(isLearned);
  const next = STEPS.find((s) => !isLearned(s.id) && ready(s.needs));

  return (
    <>
      <p className="progress-summary" role="status">
        Learned {done} of {total} topics. Saved {progress.state.bookmarks.length}.
      </p>
      <div
        className="progress-bar"
        role="progressbar"
        aria-label="Topics learned"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
      >
        <div className="progress-fill" style={{ width: (total ? Math.round((done / total) * 100) : 0) + "%" }} />
      </div>
      <p className="footnotes">
        {progress.persistenceNote()}
        {next && done < total ? " Suggested next topic: " + entryById(next.id)!.name + "." : ""}
      </p>
      <div className="roadmap">
        {LEVELS.map((lvl, li) => (
          <section className="road-level" key={lvl.level}>
            <h2>{lvl.level}</h2>
            <p className="road-blurb">{lvl.blurb}</p>
            <ol className="road-steps" start={STARTS[li]}>
              {lvl.steps.map((s) => {
                const e = entryById(s.id)!;
                const learned = isLearned(s.id);
                const cls = ["road-step", learned && "is-learned", !learned && ready(s.needs) && "is-ready"];
                return (
                  <li className={cls.filter(Boolean).join(" ")} key={s.id}>
                    <div className="road-row">
                      <input
                        type="checkbox"
                        id={"road-" + s.id}
                        checked={learned}
                        onChange={() => {
                          const on = progress.toggleLearned(s.id);
                          announce(e.name + (on ? " marked as learned" : " marked as not learned"));
                        }}
                      />
                      <label htmlFor={"road-" + s.id}>{e.name}</label>
                      <Link className="road-open" href={topicHref(s.id)} aria-label={"Read about " + e.name}>
                        Read
                      </Link>
                    </div>
                    <p className="road-meta">
                      <span className="road-time">{e.time}</span>
                      {s.needs.length > 0 && (
                        <span className="road-needs">
                          Learn first: {s.needs.map((n) => entryById(n)?.name ?? n).join(", ")}.
                        </span>
                      )}
                    </p>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
      <p className="hint" style={{ marginTop: "1.5rem" }}>
        <button
          type="button"
          className="btn btn-sm"
          disabled={!done && !progress.state.bookmarks.length && progress.state.quiz.runs === 0}
          onClick={() => {
            if (!window.confirm("Clear saved topics, learned topics, and quiz scores in this browser? This can't be undone.")) return;
            progress.reset();
            announce("Progress cleared");
          }}
        >
          Reset all progress
        </button>{" "}
        Clears saved and learned topics, the last topic you opened, and quiz and challenge results.
      </p>
    </>
  );
}

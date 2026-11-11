"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@/context/ProgressContext";
import { QUIZ } from "@/data/quiz";
import type { QuizQuestion } from "@/data/types";
import { shuffle } from "@/lib/utils";

const LEN = 10;

interface Item {
  q: QuizQuestion;
  /** Display order of the option indexes. */
  order: number[];
  picked: number | null;
}

interface Run {
  items: Item[];
  i: number;
  score: number;
  finished: boolean;
}

function Code({ code, label }: { code: string; label?: string }) {
  return (
    <pre tabIndex={0} aria-label={label}>
      <code>{code}</code>
    </pre>
  );
}

export default function Quiz() {
  const progress = useProgress();
  const [run, setRun] = useState<Run | null>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const scoreRef = useRef<HTMLHeadingElement>(null);

  const item = run && !run.finished ? run.items[run.i] : null;

  useEffect(() => {
    if (item?.picked != null) nextRef.current?.focus();
  }, [item?.picked]);
  useEffect(() => {
    if (run?.finished) scoreRef.current?.focus();
  }, [run?.finished]);

  function start() {
    const items = shuffle(QUIZ)
      .slice(0, LEN)
      .map((q) => ({ q, order: shuffle(q.options.map((_, i) => i)), picked: null }));
    setRun({ items, i: 0, score: 0, finished: false });
  }

  function answer(orig: number) {
    if (!run || !item || item.picked != null) return;
    const items = run.items.slice();
    items[run.i] = { ...item, picked: orig };
    setRun({ ...run, items, score: run.score + (orig === item.q.answer ? 1 : 0) });
  }

  function next() {
    if (!run) return;
    if (run.i + 1 < run.items.length) setRun({ ...run, i: run.i + 1 });
    else {
      progress.recordQuiz(run.score, run.items.length);
      setRun({ ...run, finished: true });
    }
  }

  // 1 to 4 pick an answer (only while focus is inside the quiz).
  function onKeyDown(ev: React.KeyboardEvent) {
    if (!item || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    if (/^[1-4]$/.test(ev.key)) {
      ev.preventDefault();
      const pos = parseInt(ev.key, 10) - 1;
      if (item.order[pos] != null) answer(item.order[pos]);
    }
  }

  if (!run) {
    const best = progress.state.quiz.best;
    return (
      <div className="quiz">
        <p>
          Ten questions drawn at random from {QUIZ.length}. Each answer comes with an explanation, and you get a score at the
          end.
        </p>
        <p className="footnotes">{best == null ? "No score yet." : `Your best score: ${best}%.`}</p>
        <button type="button" className="btn" onClick={start}>
          Start the quiz
        </button>
      </div>
    );
  }

  if (run.finished) {
    const pct = Math.round((run.score / run.items.length) * 100);
    const missed = run.items.filter((it) => it.picked !== it.q.answer);
    return (
      <div className="quiz">
        <h2 ref={scoreRef} tabIndex={-1}>
          You scored {run.score} out of {run.items.length} ({pct}%)
        </h2>
        <p>
          {pct >= 80 ? "Strong result. " : pct >= 50 ? "Solid start. " : "Worth another pass. "}
          Your best score is {progress.state.quiz.best}%.
        </p>
        {missed.length > 0 && (
          <>
            <h3>Questions to review</h3>
            <ul className="quiz-review">
              {missed.map((it, k) => (
                <li key={k}>
                  <strong>{it.q.q} </strong>
                  {it.q.code && <Code code={it.q.code} />}
                  <p>
                    Answer: {it.q.options[it.q.answer]}. {it.q.why}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
        <button type="button" className="btn" onClick={start}>
          Try another set
        </button>
      </div>
    );
  }

  const q = item!.q;
  const picked = item!.picked;
  return (
    <div className="quiz" onKeyDown={onKeyDown}>
      <p className="quiz-count">
        Question {run.i + 1} of {run.items.length}. Score so far: {run.score}.
      </p>
      <fieldset className="quiz-q">
        <legend>{q.q}</legend>
        {q.code && <Code code={q.code} label={"Code for question " + (run.i + 1)} />}
        <div className="quiz-opts">
          {item!.order.map((orig, pos) => {
            const isAnswer = picked != null && orig === q.answer;
            const isWrong = picked != null && orig === picked && orig !== q.answer;
            return (
              <button
                key={orig}
                type="button"
                className={"quiz-opt" + (isAnswer ? " is-correct" : isWrong ? " is-wrong" : "")}
                disabled={picked != null}
                aria-label={`Answer ${pos + 1}: ${q.options[orig]}`}
                onClick={() => answer(orig)}
              >
                <span className="quiz-key">{pos + 1}</span>
                <span>{q.options[orig]}</span>
                {isAnswer && <span className="quiz-flag">Correct answer</span>}
                {isWrong && <span className="quiz-flag">Your answer</span>}
              </button>
            );
          })}
        </div>
      </fieldset>
      <div className="quiz-feedback" role="status">
        {picked != null && (
          <>
            <strong>
              {picked === q.answer ? "Correct. " : `Not quite. The answer is ${q.options[q.answer]}. `}
            </strong>
            {q.why}
          </>
        )}
      </div>
      <button type="button" className="btn" ref={nextRef} hidden={picked == null} onClick={next}>
        {run.i === run.items.length - 1 ? "See your score" : "Next question"}
      </button>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Field from "@/components/ui/Field";
import LangTabs, { type LangTab } from "@/components/ui/LangTabs";
import { useProgress } from "@/context/ProgressContext";
import { CHALLENGES } from "@/data/challenges";
import type { Challenge as ChallengeData, ChallengeLang } from "@/data/types";
import { useMounted } from "@/lib/hooks";
import { shuffle } from "@/lib/utils";

const LANGS: LangTab<ChallengeLang>[] = [
  { key: "python", label: "Python" },
  { key: "javascript", label: "JavaScript" },
  { key: "java", label: "Java" },
];

interface Round {
  order: ChallengeData[];
  pos: number;
  timeOptions: string[];
  spaceOptions: string[];
}

function makeRound(order: ChallengeData[], pos: number): Round {
  return { order, pos, timeOptions: shuffle(order[pos].timeOptions), spaceOptions: shuffle(order[pos].spaceOptions) };
}

type Result = { message: string } | { guess: [string, string] | null } | null;

export default function Challenge() {
  const progress = useProgress();
  const mounted = useMounted();
  const [round, setRound] = useState<Round>(() => makeRound(shuffle(CHALLENGES), 0));
  const [lang, setLang] = useState<ChallengeLang>("python");
  const [time, setTime] = useState("");
  const [space, setSpace] = useState("");
  const [result, setResult] = useState<Result>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const revealed = result != null && "guess" in result;
  useEffect(() => {
    if (revealed) nextRef.current?.focus();
  }, [revealed]);

  // The order is random, so render it in the browser only to keep the server HTML stable.
  if (!mounted) return <div className="challenge" />;
  const ch = round.order[round.pos];

  function show(guess: [string, string] | null) {
    if (guess) progress.recordChallenge(ch.id, guess[0] === ch.time && guess[1] === ch.space);
    setResult({ guess });
  }

  function next() {
    const pos = (round.pos + 1) % round.order.length;
    setRound(makeRound(pos === 0 ? shuffle(CHALLENGES) : round.order, pos));
    setTime("");
    setSpace("");
    setResult(null);
  }

  return (
    <div className="challenge">
      <p className="quiz-count">
        Challenge {round.pos + 1} of {round.order.length}: {ch.title}
      </p>
      <LangTabs<ChallengeLang> tabs={LANGS} selected={lang} onSelect={setLang} aria-label="Language" />
      <pre tabIndex={0} aria-label="Code snippet">
        <code>{ch.langs[lang]}</code>
      </pre>

      <div className="challenge-form">
        <Field label="Time complexity" htmlFor="ch-time">
          <select id="ch-time" value={time} disabled={revealed} onChange={(ev) => setTime(ev.target.value)}>
            <option value="">Choose one</option>
            {round.timeOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field label="Auxiliary space complexity" htmlFor="ch-space">
          <select id="ch-space" value={space} disabled={revealed} onChange={(ev) => setSpace(ev.target.value)}>
            <option value="">Choose one</option>
            {round.spaceOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <button
          type="button"
          className="btn"
          disabled={revealed}
          onClick={() => {
            if (!time || !space)
              setResult({ message: 'Pick both a time and a space answer first, or use "Reveal without guessing".' });
            else show([time, space]);
          }}
        >
          Check my answer
        </button>
      </div>

      <div className="quiz-feedback" role="status">
        {result && "message" in result && result.message}
        {revealed && (
          <>
            {result.guess ? (
              <>
                <p>
                  Time: you chose {result.guess[0]}
                  {result.guess[0] === ch.time ? ". Correct." : `. The answer is ${ch.time}.`}
                </p>
                <p>
                  Space: you chose {result.guess[1]}
                  {result.guess[1] === ch.space ? ". Correct." : `. The answer is ${ch.space}.`}
                </p>
              </>
            ) : (
              <p>
                Time: {ch.time}. Auxiliary space: {ch.space}.
              </p>
            )}
            <p>{ch.why}</p>
          </>
        )}
      </div>
      <div className="viz-buttons">
        <button type="button" className="btn" disabled={revealed} onClick={() => show(null)}>
          Reveal without guessing
        </button>
        <button type="button" className="btn" ref={nextRef} onClick={next}>
          {round.pos === round.order.length - 1 ? "Start over" : "Next challenge"}
        </button>
      </div>
    </div>
  );
}

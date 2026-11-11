"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Field from "@/components/ui/Field";
import { useSheet } from "@/context/SheetContext";
import { entryById } from "@/data/entries";
import { useMounted } from "@/lib/hooks";
import { topicHref } from "@/lib/routes";
import { reducedMotion } from "@/lib/utils";
import { ALGOS, GRAPH, LEGEND, makeArray, randomArray, type Algo, type Frame, type InputOrder } from "@/lib/visualizer";

const W = 640;

interface Run {
  data: number[];
  target: number;
}

function newRun(algo: Algo, size: number, targetMode: string, order: InputOrder = "random"): Run {
  const data = algo.kind === "sort" ? makeArray(size, order) : randomArray(size);
  let target = 0;
  if (algo.kind === "search") {
    target = data[Math.floor(Math.random() * size)];
    if (targetMode === "out") {
      do target = 5 + Math.floor(Math.random() * 95);
      while (data.includes(target));
    }
  }
  return { data, target };
}

function roleClass(role: string | undefined) {
  return "viz-item" + (role ? " viz-" + role : "");
}

function Bars({ fr }: { fr: Extract<Frame, { kind: "bars" }> }) {
  const n = fr.arr.length, H = 320, pad = 24, bw = (W - pad * 2) / n;
  return fr.arr.map((v, i) => {
    const h = (v / 100) * (H - 70), x = pad + i * bw;
    return (
      <g key={i} className={roleClass(fr.marks[i])}>
        <rect x={x + 3} y={H - 30 - h} width={bw - 6} height={h} rx={2} />
        <text x={x + bw / 2} y={H - 34 - h} textAnchor="middle" className="viz-num">
          {v}
        </text>
        <text x={x + bw / 2} y={H - 12} textAnchor="middle" className="viz-idx">
          {i}
        </text>
      </g>
    );
  });
}

function Cells({ fr }: { fr: Extract<Frame, { kind: "cells" }> }) {
  const n = fr.arr.length, pad = 16, cw = (W - pad * 2) / n, y = 120;
  return (
    <>
      <text x={W / 2} y={50} textAnchor="middle" className="viz-target">
        Target: {fr.target}
      </text>
      {fr.arr.map((v, i) => {
        const x = pad + i * cw;
        return (
          <g key={i} className={roleClass(fr.marks[i])}>
            <rect x={x + 2} y={y} width={cw - 4} height={64} rx={4} />
            <text x={x + cw / 2} y={y + 40} textAnchor="middle" className="viz-num viz-num-in">
              {v}
            </text>
            <text x={x + cw / 2} y={y + 88} textAnchor="middle" className="viz-idx">
              {i}
            </text>
          </g>
        );
      })}
    </>
  );
}

function Graph({ fr, showDepth }: { fr: Extract<Frame, { kind: "graph" }>; showDepth: boolean }) {
  const pos = Object.fromEntries(GRAPH.nodes.map((n) => [n.id, n]));
  return (
    <>
      {GRAPH.edges.map(([u, v]) => (
        <line key={u + v} x1={pos[u].x} y1={pos[u].y} x2={pos[v].x} y2={pos[v].y} className="viz-edge" />
      ))}
      {GRAPH.nodes.map((n) => {
        const st = fr.state[n.id];
        return (
          <g key={n.id} className={roleClass(st === "unseen" ? undefined : st)}>
            <circle cx={n.x} cy={n.y} r={22} />
            <text x={n.x} y={n.y + 5} textAnchor="middle" className="viz-num viz-num-in">
              {n.id}
            </text>
            {showDepth && fr.depth[n.id] != null && st !== "unseen" && (
              <text x={n.x} y={n.y + 40} textAnchor="middle" className="viz-idx">
                dist {fr.depth[n.id]}
              </text>
            )}
          </g>
        );
      })}
    </>
  );
}

function describe(fr: Frame): string {
  if (fr.kind === "graph") {
    return `${fr.msg} Visited so far: ${fr.order.join(", ") || "none"}. ${fr.listLabel}: ${fr.list.join(", ") || "empty"}.`;
  }
  const roles = Object.entries(fr.marks)
    .filter(([, r]) => r && r !== "out" && r !== "range" && r !== "sorted")
    .map(([k, r]) => r + " at position " + k);
  return `${fr.msg} Array: ${fr.arr.join(", ")}.` + (roles.length ? " Highlighted: " + roles.join("; ") + "." : "");
}

export default function Visualizer() {
  const { announce } = useSheet();
  const mounted = useMounted();
  const [algoId, setAlgoId] = useState(ALGOS[0].id);
  const [size, setSize] = useState(10);
  const [targetMode, setTargetMode] = useState("in");
  const [order, setOrder] = useState<InputOrder>("random");
  const [speed, setSpeed] = useState(600);
  // Random data differs between server and browser, so frames are drawn only after hydration.
  const [run, setRun] = useState<Run>(() => newRun(ALGOS[0], 10, "in"));
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const algo = ALGOS.find((a) => a.id === algoId)!;
  const reduced = mounted && reducedMotion();

  const frames = useMemo(() => algo.build(run.data, run.target), [algo, run]);
  const last = frames.length - 1;
  const topic = entryById(algo.entry);
  const fr = mounted ? frames[idx] : undefined;

  function regenerate(a = algo, s = size, t = targetMode, o = order) {
    setPlaying(false);
    setIdx(0);
    setRun(newRun(a, s, t, o));
  }

  // One timer per step while playing. Playback stops on the last frame.
  useEffect(() => {
    if (!playing) return;
    const delay = reduced ? Math.max(speed, 900) : speed;
    const timer = setTimeout(() => {
      const next = Math.min(idx + 1, last);
      setIdx(next);
      if (next === last) {
        setPlaying(false);
        announce(frames[last].msg);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [playing, idx, speed, reduced, last, frames, announce]);

  function play() {
    if (playing) return setPlaying(false);
    if (idx === last) setIdx(0);
    setPlaying(true);
  }
  function step(d: number) {
    setPlaying(false);
    setIdx((i) => Math.max(0, Math.min(last, i + d)));
  }

  function onKeyDown(ev: React.KeyboardEvent) {
    const t = (ev.target as HTMLElement).tagName;
    if (t === "SELECT" || t === "INPUT" || t === "TEXTAREA") return;
    if (ev.key === "ArrowRight") {
      ev.preventDefault();
      step(1);
    } else if (ev.key === "ArrowLeft") {
      ev.preventDefault();
      step(-1);
    } else if (ev.key === " " && t !== "BUTTON") {
      ev.preventDefault();
      play();
    }
  }

  const viewH = fr?.kind === "cells" ? 230 : fr?.kind === "graph" ? 290 : 320;

  return (
    <div className="viz" role="region" aria-label="Algorithm visualizer" tabIndex={-1} onKeyDown={onKeyDown}>
      <div className="pg-controls">
        <Field label="Algorithm" htmlFor="viz-algo">
          <select
            id="viz-algo"
            value={algoId}
            onChange={(ev) => {
              const a = ALGOS.find((x) => x.id === ev.target.value)!;
              setAlgoId(a.id);
              regenerate(a);
            }}
          >
            {ALGOS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Size" htmlFor="viz-size" hidden={algo.kind === "graph"}>
          <select
            id="viz-size"
            value={size}
            onChange={(ev) => {
              const s = parseInt(ev.target.value, 10);
              setSize(s);
              regenerate(algo, s);
            }}
          >
            {[6, 10, 14].map((n) => (
              <option key={n} value={n}>
                {n} items
              </option>
            ))}
          </select>
        </Field>
        <Field label="Search target" htmlFor="viz-target" hidden={algo.kind !== "search"}>
          <select
            id="viz-target"
            value={targetMode}
            onChange={(ev) => {
              setTargetMode(ev.target.value);
              regenerate(algo, size, ev.target.value);
            }}
          >
            <option value="in">In the array</option>
            <option value="out">Not in the array</option>
          </select>
        </Field>
        <Field label="Input order" htmlFor="viz-order" hidden={algo.kind !== "sort"}>
          <select
            id="viz-order"
            value={order}
            onChange={(ev) => {
              const o = ev.target.value as InputOrder;
              setOrder(o);
              regenerate(algo, size, targetMode, o);
            }}
          >
            <option value="random">Random</option>
            <option value="sorted">Already sorted</option>
            <option value="reversed">Reversed</option>
          </select>
        </Field>
        <Field label="Speed" htmlFor="viz-speed">
          <select id="viz-speed" value={speed} onChange={(ev) => setSpeed(parseInt(ev.target.value, 10))}>
            <option value={1100}>Slow</option>
            <option value={600}>Medium</option>
            <option value={250}>Fast</option>
          </select>
        </Field>
      </div>

      <div className="viz-buttons" role="group" aria-label="Playback">
        <button type="button" className="btn" disabled={idx === 0} onClick={() => step(-1)}>
          Back
        </button>
        <button type="button" className="btn" onClick={play} disabled={!fr}>
          {playing ? "Pause" : idx === last ? "Replay" : "Play"}
        </button>
        <button type="button" className="btn" disabled={idx >= last} onClick={() => step(1)}>
          Step
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setPlaying(false);
            setIdx(0);
          }}
        >
          Restart
        </button>
        {algo.kind !== "graph" && (
          <button type="button" className="btn" onClick={() => regenerate()}>
            New data
          </button>
        )}
      </div>

      <p className="footnotes">
        {reduced
          ? "Reduced motion is on in your system settings. Playback is slower and the visualizer never moves on its own until you press Play. Use Step and Back to go one move at a time."
          : ""}
      </p>
      <p className="viz-meta">
        <strong>Time: </strong>
        {algo.time ?? topic?.time}.{" "}
        <strong>Auxiliary space: </strong>
        {algo.space ?? topic?.space}.{" "}
        {topic && <Link href={topicHref(topic.id)}>Read the topic</Link>}
      </p>
      <div className="chart viz-stage">
        <svg
          viewBox={`0 0 ${W} ${viewH}`}
          role="img"
          className={fr ? "viz-svg viz-kind-" + fr.kind : "viz-svg"}
          aria-label={fr ? describe(fr) : "Loading the visualizer"}
        >
          {fr?.kind === "bars" && <Bars fr={fr} />}
          {fr?.kind === "cells" && <Cells fr={fr} />}
          {fr?.kind === "graph" && <Graph fr={fr} showDepth={algo.id === "bfs"} />}
        </svg>
      </div>
      <p className="viz-list">
        {fr?.kind === "graph"
          ? `${fr.listLabel}: ${fr.list.length ? fr.list.join(", ") : "empty"}   Visit order: ${fr.order.join(", ") || "none yet"}`
          : ""}
      </p>
      <p className="viz-msg" role="status" aria-live={playing ? "off" : "polite"}>
        {fr?.msg}
      </p>
      <p className="viz-stats">
        {fr &&
          Object.entries(fr.stats)
            .map(([k, v]) => k + ": " + v)
            .join("   ")}
      </p>
      <p className="viz-progress">{fr && `Step ${idx + 1} of ${frames.length}`}</p>
      <ul className="viz-legend" aria-label="What the colors and outlines mean">
        {(algo.legend ?? LEGEND[algo.kind]).map(([role, label]) => (
          <li key={role}>
            <span className={"viz-sw viz-" + role} aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

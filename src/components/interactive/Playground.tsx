"use client";

/* Big O playground: growth chart, operation counts, and time estimates. */

import { useId, useState } from "react";
import Field from "@/components/ui/Field";
import { CURVES, fmtDuration, fmtLog, fmtLogPlain, lg } from "@/lib/growth";

const W = 640, H = 360, L = 56, R = 16, T = 16, B = 44;
const N_CAP = 1_000_000;
const X_RANGES: [number, string][] = [
  [10, "n up to 10"],
  [30, "n up to 30"],
  [100, "n up to 100"],
  [1000, "n up to 1,000"],
];

function niceMax(v: number): number {
  const steps = [1, 1.5, 2, 3, 4, 5, 6, 8, 10];
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  for (const s of steps) if (s * p >= v) return s * p;
  return 10 * p;
}

function fmtTick(v: number): string {
  if (v >= 1e6) return v / 1e6 + "M";
  if (v >= 1e3) return v / 1e3 + "k";
  return String(v);
}

function Count({ l }: { l: number }) {
  const f = fmtLog(l);
  return (
    <>
      {f.text}
      {f.exp != null && <sup>{f.exp}</sup>}
    </>
  );
}

export default function Playground() {
  const [n, setNState] = useState(20);
  const [nText, setNText] = useState("20");
  const [xMax, setXMax] = useState(30);
  const [log, setLog] = useState(false);
  const [visible, setVisible] = useState<Record<string, boolean>>(() => Object.fromEntries(CURVES.map((c) => [c.key, true])));
  const clipId = useId().replace(/:/g, "") + "pg-clip";

  function setN(v: number, fromNum = false) {
    const clamped = Math.max(1, Math.min(N_CAP, Math.round(v)));
    setNState(clamped);
    if (!fromNum) setNText(String(clamped));
  }

  const shown = CURVES.filter((c) => visible[c.key]);
  const p = log ? { lo: -0.4, hi: 12 } : { lo: 0, hi: niceMax(xMax * 6) };
  const px = (x: number) => L + ((x - 1) / (xMax - 1)) * (W - L - R);
  const yOf = (y: number) => T + (1 - (y - p.lo) / (p.hi - p.lo)) * (H - T - B);
  const py = (v: number) => yOf(log ? Math.max(lg(Math.max(v, 1)), p.lo) : v);

  const yTicks = log
    ? [0, 2, 4, 6, 8, 10, 12].map((e) => ({ y: e, label: null as string | null, exp: e }))
    : [0, 1, 2, 3, 4].map((i) => {
        const v = (p.hi / 4) * i;
        return { y: v, label: fmtTick(Math.round(v)), exp: 0 };
      });
  const xTicks =
    xMax <= 10 ? [1, 2, 4, 6, 8, 10] : xMax === 30 ? [1, 5, 10, 15, 20, 25, 30] : xMax === 100 ? [1, 25, 50, 75, 100] : [1, 250, 500, 750, 1000];
  const step = xMax <= 30 ? 0.25 : xMax / 160;

  function path(c: (typeof CURVES)[number]): string {
    let d = "";
    for (let x = 1; x <= xMax + 0.001; x += step) {
      const val = log ? c.f(x) : Math.min(c.f(x), p.hi * 1.2);
      d += (d ? "L" : "M") + px(x).toFixed(1) + " " + py(val).toFixed(1);
    }
    return d;
  }

  const description = shown
    .map((c) => {
      let at = `At n = ${n.toLocaleString("en-US")}, ${c.label} does about ${fmtLogPlain(c.l(n))} operations`;
      if (!log) {
        for (let x = 1; x <= xMax; x++) {
          if (c.f(x) > p.hi) {
            at += " and leaves the top of the chart at n = " + x;
            break;
          }
        }
      }
      return at + ".";
    })
    .join(" ");

  const maxL = Math.max(...shown.map((c) => c.l(n)), 1);
  const markerX = px(n);
  const anchor = n > xMax * 0.8 ? "end" : "start";

  return (
    <div className="pg">
      <div className="pg-controls">
        <Field label="Input size n" htmlFor="pg-n">
          <input
            id="pg-n"
            type="number"
            min={1}
            max={N_CAP}
            step={1}
            inputMode="numeric"
            value={nText}
            onChange={(ev) => {
              setNText(ev.target.value);
              const v = parseInt(ev.target.value, 10);
              if (!isNaN(v)) setN(v, true);
            }}
            onBlur={() => {
              const v = nText === "" ? NaN : Number(nText);
              setN(isFinite(v) ? v : 20);
            }}
          />
        </Field>
        <Field label="Slide to change n" htmlFor="pg-range">
          <input
            id="pg-range"
            type="range"
            min={1}
            max={xMax}
            step={1}
            value={Math.min(n, xMax)}
            aria-label={"Input size n, chart range 1 to " + xMax}
            onChange={(ev) => setN(parseInt(ev.target.value, 10))}
          />
        </Field>
        <Field label="Chart range" htmlFor="pg-x">
          <select id="pg-x" value={xMax} onChange={(ev) => setXMax(parseInt(ev.target.value, 10))}>
            {X_RANGES.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Operations axis" htmlFor="pg-y">
          <select id="pg-y" value={log ? "log" : "linear"} onChange={(ev) => setLog(ev.target.value === "log")}>
            <option value="linear">Linear, clipped</option>
            <option value="log">Logarithmic</option>
          </select>
        </Field>
      </div>

      <fieldset className="pg-toggles">
        <legend>Curves to show</legend>
        {CURVES.map((c) => (
          <label className="pg-toggle" key={c.key}>
            <input
              type="checkbox"
              checked={visible[c.key]}
              onChange={(ev) => setVisible({ ...visible, [c.key]: ev.target.checked })}
            />
            <code className={c.cls}>{c.label}</code>
          </label>
        ))}
      </fieldset>

      <p className="pg-note" aria-live="polite">
        {n > xMax
          ? `The chart covers n up to ${xMax.toLocaleString("en-US")}. The table still reflects n = ${n.toLocaleString("en-US")}.`
          : ""}
      </p>

      <div className="explorer">
        <div>
          <div className="chart">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              role="img"
              aria-describedby="pg-desc"
              aria-label={`Growth curves for ${shown.map((c) => c.label).join(", ")} for input sizes 1 to ${xMax}, on a ${
                log ? "logarithmic" : "linear"
              } operations axis. The table beside the chart lists the exact values.`}
            >
              <defs>
                <clipPath id={clipId}>
                  <rect x={L} y={T} width={W - L - R} height={H - T - B} />
                </clipPath>
              </defs>
              {yTicks.map((t) => (
                <g key={"y" + t.y}>
                  <line className="grid" x1={L} x2={W - R} y1={yOf(t.y)} y2={yOf(t.y)} />
                  <text className="axis-label" x={L - 8} y={yOf(t.y) + 4} textAnchor="end">
                    {log ? (
                      t.exp === 0 ? (
                        "1"
                      ) : (
                        <>
                          10
                          <tspan dy="-4" fontSize="9">
                            {t.exp}
                          </tspan>
                        </>
                      )
                    ) : (
                      t.label
                    )}
                  </text>
                </g>
              ))}
              {xTicks.map((x) => (
                <g key={"x" + x}>
                  <line className="grid" x1={px(x)} x2={px(x)} y1={T} y2={H - B} />
                  <text className="axis-label" x={px(x)} y={H - B + 18} textAnchor="middle">
                    {x}
                  </text>
                </g>
              ))}
              <text className="axis-label" x={(L + W - R) / 2} y={H - 6} textAnchor="middle">
                Input size n
              </text>
              <text
                className="axis-label"
                x={14}
                y={(T + H - B) / 2}
                textAnchor="middle"
                transform={`rotate(-90 14 ${(T + H - B) / 2})`}
              >
                {log ? "Operations (log scale)" : "Operations"}
              </text>
              <g clipPath={`url(#${clipId})`}>
                {shown.map((c) => (
                  <path
                    key={c.key}
                    className="curve"
                    d={path(c)}
                    style={{ stroke: c.color }}
                    strokeDasharray={c.dash || undefined}
                  />
                ))}
              </g>
              {n <= xMax && (
                <>
                  <line className="marker" x1={markerX} x2={markerX} y1={T} y2={H - B} />
                  {shown.map((c) => {
                    const v = c.f(n);
                    const inside = log ? lg(v) <= p.hi : v <= p.hi;
                    return inside ? <circle key={c.key} cx={markerX} cy={py(v)} r={4} style={{ fill: c.color }} /> : null;
                  })}
                  <text
                    className="marker-label"
                    x={markerX + (anchor === "end" ? -6 : 6)}
                    y={T + 12}
                    textAnchor={anchor}
                  >
                    n = {n}
                  </text>
                </>
              )}
            </svg>
          </div>
          <p className="sr-only" id="pg-desc">
            {description}
          </p>
        </div>

        <div
          className="table-wrap"
          role="region"
          aria-label="Operation counts and estimated time by complexity class"
          tabIndex={0}
        >
          <table className="table">
            <caption>Approximate operations for n = {n.toLocaleString("en-US")}. Logarithms are base 2.</caption>
            <thead>
              <tr>
                <th scope="col">Complexity</th>
                <th scope="col">Operations</th>
                <th scope="col">Estimated time at 10⁸ operations per second</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((c) => {
                const l = c.l(n);
                return (
                  <tr key={c.key}>
                    <td>
                      <code className={c.cls}>{c.label}</code>
                      <span className="pg-name">{c.name}</span>
                    </td>
                    <td>
                      <Count l={l} />
                      <span className="pg-bar" aria-hidden="true">
                        <span
                          className="pg-bar-fill"
                          style={{ width: Math.max(l === -Infinity ? 0 : (l / maxL) * 100, 2) + "%", background: c.color }}
                        />
                      </span>
                    </td>
                    <td>{fmtDuration(l)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

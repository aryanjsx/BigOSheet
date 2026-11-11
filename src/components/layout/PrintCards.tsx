"use client";

import { useSheet } from "@/context/SheetContext";

/** Compact topic cards for printing. Only visible in print when body has the "print-cards" class. */
export default function PrintCards() {
  const { printList } = useSheet();
  return (
    <div id="print-cards">
      {printList && (
        <>
          <h2>Big O topic cards</h2>
          <div className="pc-grid">
            {printList.map((e) => (
              <article className="pc" key={e.id}>
                <h3>{e.name}</h3>
                <p className="pc-meta">
                  {e.topic}. {e.rel} interview relevance.
                </p>
                <dl>
                  <dt>Time</dt>
                  <dd>{e.time}</dd>
                  <dt>Space</dt>
                  <dd>{e.space}</dd>
                </dl>
                <p>
                  <strong>When to use: </strong>
                  {e.when}
                </p>
                <p>
                  <strong>Why: </strong>
                  {e.why}
                </p>
                <p>
                  <strong>Pitfall: </strong>
                  {e.pitfall}
                </p>
                <pre>
                  <code>{e.code}</code>
                </pre>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

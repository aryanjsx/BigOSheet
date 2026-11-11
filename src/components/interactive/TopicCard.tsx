"use client";

import Link from "next/link";
import { useProgress } from "@/context/ProgressContext";
import type { Entry } from "@/data/types";
import { topicHref } from "@/lib/routes";
import TopicActions from "./TopicActions";

/** A compact card for the topics list. The full explanation is on the topic's own page. */
export default function TopicCard({ e }: { e: Entry }) {
  const { isLearned } = useProgress();
  return (
    <article className={"card" + (isLearned(e.id) ? " is-learned" : "")} id={"card-" + e.id}>
      <h2>
        <Link href={topicHref(e.id)}>{e.name}</Link>
      </h2>
      <div className="badges">
        <span className="badge">{e.topic}</span>
        <span className={"badge " + e.rel.toLowerCase()}>{e.rel} interview relevance</span>
      </div>
      <TopicActions e={e} />
      <dl className="facts">
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
        <Link href={topicHref(e.id)} aria-label={"Read more about " + e.name}>
          Why it costs this, code, and pitfalls →
        </Link>
      </p>
    </article>
  );
}

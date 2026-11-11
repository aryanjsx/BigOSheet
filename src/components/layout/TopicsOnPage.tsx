import Link from "next/link";
import { ENTRIES } from "@/data/entries";
import { sectionHref, topicHref } from "@/lib/routes";

/** Links to the topic pages whose tables live on this reference page. */
export default function TopicsOnPage({ page }: { page: string }) {
  const list = ENTRIES.filter((e) => sectionHref(e.section).startsWith(page));
  if (!list.length) return null;
  return (
    <>
      <h2 id="topics-here">Topics on this page</h2>
      <p>Each one has its own page with an explanation, code, and the mistakes people make.</p>
      <ul className="index-list index-list-plain">
        {list.map((e) => (
          <li key={e.id}>
            <span>
              <Link href={topicHref(e.id)}>{e.name}</Link>
              <p>{e.time}</p>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

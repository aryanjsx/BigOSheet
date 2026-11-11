import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TopicActions from "@/components/interactive/TopicActions";
import TopicCode from "@/components/interactive/TopicCode";
import PageHeader from "@/components/layout/PageHeader";
import { COMPARE } from "@/data/compare";
import { ENTRIES, entryById } from "@/data/entries";
import { LOOKUP } from "@/data/lookup";
import { ROADMAP } from "@/data/roadmap";
import { partnerFor } from "@/lib/compare";
import { pageMeta } from "@/lib/meta";
import { compareHref, sectionHref, sectionPageLabel, topicHref } from "@/lib/routes";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return ENTRIES.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = entryById((await params).id);
  if (!e) return {};
  return pageMeta(
    `${e.name}: time and space complexity`,
    `${e.time}. ${e.when} ${e.pitfall}`,
    `topics/${e.id}/`,
  );
}

const STEPS = ROADMAP.flatMap((l) => l.steps.map((s) => ({ ...s, level: l.level })));

export default async function TopicPage({ params }: Props) {
  const e = entryById((await params).id);
  if (!e) notFound();

  const i = ENTRIES.indexOf(e);
  const prev = ENTRIES[i - 1];
  const next = ENTRIES[i + 1];
  const step = STEPS.find((s) => s.id === e.id);
  const needs = (step?.needs ?? []).map((id) => entryById(id)).filter((x) => x != null);
  const unlocks = STEPS.filter((s) => s.needs.includes(e.id)).map((s) => entryById(s.id)).filter((x) => x != null);
  const lookups = LOOKUP.filter((r) => r.entry === e.id);

  return (
    <div data-topic-page={e.id}>
      <PageHeader
        eyebrow={e.topic}
        eyebrowHref="/topics"
        title={e.name}
        lede={e.when}
        breadcrumbHref={topicHref(e.id)}
        breadcrumbParent={{ label: "Topics", href: "/topics" }}
        articleDescription={`${e.time} ${e.when}`}
      />

      <div className="topic-layout">
        <div>
          <div className="badges" style={{ marginTop: "1rem" }}>
            <span className={"badge " + e.rel.toLowerCase()}>{e.rel} interview relevance</span>
            {step && <span className="badge">Roadmap: {step.level}</span>}
          </div>
          <TopicActions e={e} />

          <div className="table-wrap" role="region" aria-label={"Cost of " + e.name} tabIndex={0}>
            <table className="table topic-facts">
              <caption>Time and auxiliary space complexity of {e.name}.</caption>
              <tbody>
                <tr>
                  <th scope="row">Time</th>
                  <td>{e.time}</td>
                </tr>
                <tr>
                  <th scope="row">Space</th>
                  <td>{e.space}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Why it costs this much</h2>
          <p>{e.why}</p>

          <h2>Code</h2>
          <TopicCode e={e} />

          <h2>Common pitfalls</h2>
          <p>{e.pitfall}</p>

          {lookups.length > 0 && (
            <>
              <h2>Operation by operation</h2>
              <div className="table-wrap" role="region" aria-label={"Operations for " + e.name} tabIndex={0}>
                <table className="table">
                  <caption>Best, average, worst-case, and space complexity for {e.name} operations.</caption>
                  <thead>
                    <tr>
                      <th scope="col">Operation</th>
                      <th scope="col">Best</th>
                      <th scope="col">Average</th>
                      <th scope="col">Worst</th>
                      <th scope="col">Space</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lookups.map((r) => (
                      <tr key={r.name}>
                        <td>{r.name}</td>
                        <td>{r.best}</td>
                        <td>{r.avg}</td>
                        <td>{r.worst}</td>
                        <td>{r.space}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {lookups.map((r) => (
                <p key={r.name} className="footnotes">
                  <strong>{r.name}.</strong> {r.assume} {r.caveat}
                </p>
              ))}
            </>
          )}
        </div>

        <aside className="topic-aside" aria-label="Related">
          <section>
            <h2>In the tables</h2>
            <Link href={sectionHref(e.section)}>See it in {sectionPageLabel(e.section)}</Link>
          </section>
          {needs.length > 0 && (
            <section>
              <h2>Learn first</h2>
              <ul>
                {needs.map((n) => (
                  <li key={n.id}>
                    <Link href={topicHref(n.id)}>{n.name}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {unlocks.length > 0 && (
            <section>
              <h2>Leads to</h2>
              <ul>
                {unlocks.map((n) => (
                  <li key={n.id}>
                    <Link href={topicHref(n.id)}>{n.name}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {COMPARE[e.id] && (
            <section>
              <h2>Compare</h2>
              <Link href={compareHref(e.id, partnerFor(e.id))}>
                {COMPARE[e.id].name} vs. {COMPARE[partnerFor(e.id)].name}
              </Link>
            </section>
          )}
          {e.ref && (
            <section>
              <h2>Further reading</h2>
              <a href={e.ref} rel="noopener">
                {new URL(e.ref).hostname.replace(/^www\.|^en\./, "")}
              </a>
            </section>
          )}
        </aside>
      </div>

      <nav className="pager" aria-label="Other topics">
        {prev && (
          <Link href={topicHref(prev.id)}>
            <span className="pager-dir">Previous</span>
            <span>{prev.name}</span>
          </Link>
        )}
        {next && (
          <Link href={topicHref(next.id)} className="next">
            <span className="pager-dir">Next</span>
            <span>{next.name}</span>
          </Link>
        )}
      </nav>
    </div>
  );
}

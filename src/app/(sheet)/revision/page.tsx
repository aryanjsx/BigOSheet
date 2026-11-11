import PageHeader from "@/components/layout/PageHeader";
import PrintButton from "@/components/layout/PrintButton";
import { ENTRIES, TOPIC_ORDER } from "@/data/entries";
import { pageMeta } from "@/lib/meta";
import { asset } from "@/lib/utils";

/* The one-page interview revision sheet. Lists every entry marked rel: "High", grouped by topic. */

export const metadata = pageMeta(
  "Interview revision sheet",
  "The Big O costs that come up most in coding interviews, on one printable page.",
  "revision/",
);

const SIZE_GUIDE: [string, string][] = [
  ["Up to about 10", "O(n!)"],
  ["Up to about 20", "O(2ⁿ)"],
  ["Up to about 500", "O(n³)"],
  ["Up to about 5,000", "O(n²)"],
  ["Up to about 1,000,000", "O(n log n)"],
  ["Up to about 100,000,000", "O(n)"],
];

export default function RevisionPage() {
  return (
    <div className="revision-page">
      <PageHeader
        eyebrow="Practice"
        title="Interview revision sheet"
        lede="The topics that come up most in interviews, on one page. These are typical costs, not guarantees: the reference pages list the assumptions."
        actions={
          <>
            <PrintButton />
            <a className="btn" href={asset("/Big-O-Sheet-one-page.pdf")} download>
              Download as PDF
            </a>
          </>
        }
      />
      <div id="rev-grid" className="rev-grid" style={{ marginTop: "1.25rem" }}>
        {TOPIC_ORDER.map((topic) => {
          const rows = ENTRIES.filter((e) => e.topic === topic && e.rel === "High");
          if (!rows.length) return null;
          return (
            <div className="rev-block" key={topic}>
              <h2>{topic}</h2>
              <table>
                <caption>Time and space complexity for high-relevance {topic.toLowerCase()} interview topics.</caption>
                <tbody>
                  <tr>
                    <th scope="col">Topic</th>
                    <th scope="col">Time</th>
                    <th scope="col">Space</th>
                  </tr>
                  {rows.map((e) => (
                    <tr key={e.id}>
                      <td>{e.name}</td>
                      <td>{e.time}</td>
                      <td>{e.space}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
      <div className="rev-rules rev-block" style={{ marginTop: ".75rem" }}>
        <h2>Rough guide: input size to complexity</h2>
        <table>
          <caption>Approximate input sizes commonly associated with each complexity class.</caption>
          <tbody>
            <tr>
              <th scope="col">Input size n</th>
              <th scope="col">Complexity that usually fits</th>
            </tr>
            {SIZE_GUIDE.map(([n, c]) => (
              <tr key={n}>
                <td>{n}</td>
                <td>{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="rev-note">
          Assumes roughly 10⁸ simple operations per second. Real limits depend on the language and the work per step.
        </p>
      </div>
    </div>
  );
}

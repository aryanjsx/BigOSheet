import Link from "next/link";
import HomeProgress from "@/components/home/HomeProgress";
import HomeSearch from "@/components/home/HomeSearch";
import { ENTRIES } from "@/data/entries";
import { LOOKUP } from "@/data/lookup";
import { complexityColor } from "@/lib/complexity";
import { CURVES, fmtDuration } from "@/lib/growth";
import { GITHUB_URL, NAV, TOPICS_PAGE, topicHref } from "@/lib/routes";
import { asset } from "@/lib/utils";

const FAQS = [
  {
    question: "What is Big O notation?",
    answer:
      "Big O notation describes an upper bound on how an algorithm's resource use grows with input size. It ignores constant factors and lower-order terms, so O(n) describes linear growth even if one implementation is several times faster than another.",
  },
  {
    question: "What is the difference between time and space complexity?",
    answer:
      "Time complexity describes how the number of operations grows as the input grows. Space complexity describes how memory use grows; this sheet reports auxiliary space separately from the input unless a table says otherwise.",
  },
  {
    question: "What is the time complexity of quicksort?",
    answer:
      "Quicksort is Θ(n log n) in the best and average cases and O(n²) in the worst case, when partitions are repeatedly very uneven. Its recursion stack is typically O(log n), but can reach O(n) in the worst case.",
  },
  {
    question: "What is the time complexity of merge sort?",
    answer:
      "Merge sort takes Θ(n log n) time in its best, average, and worst cases. Array implementations generally need Θ(n) auxiliary space for merging.",
  },
  {
    question: "What is the time complexity of binary search?",
    answer:
      "Binary search takes O(log n) time on sorted data that supports efficient random access. The iterative version uses O(1) auxiliary space; a recursive version uses O(log n) stack space.",
  },
  {
    question: "Which common complexity classes should I know?",
    answer:
      "Know constant O(1), logarithmic O(log n), linear O(n), linearithmic O(n log n), quadratic O(n²), and exponential O(2ⁿ). Their relative practicality depends on input size and the work each step performs.",
  },
  {
    question: "What are the average and worst-case costs of a hash table?",
    answer:
      "Lookup, insertion, and deletion are typically O(1) on average under suitable hashing and load-factor assumptions. A worst-case operation can be O(n) if many keys collide.",
  },
  {
    question: "What does amortized time complexity mean?",
    answer:
      "An amortized bound averages the cost across a sequence of operations, without assuming random input. For example, a dynamic-array append is O(1) amortized even though a resizing append can take O(n).",
  },
];

const N = 1_000_000;

// The costs people get asked about most, by row name in data/lookup.ts.
const MOST_ASKED = [
  "Hash table lookup, insert, delete",
  "Binary search",
  "Binary heap pop",
  "Merge sort",
  "Quicksort",
  "Breadth-first search",
  "Dijkstra shortest path",
  "Union-Find find and union",
].map((name) => LOOKUP.find((r) => r.name === name)!);

/** The Big O cheat sheet, as a section of the home page. */
export default function CheatSheetHome() {
  return (
    <div className="container sheet">
      <section className="home-section" aria-labelledby="sheet-title">
        <div className="section-head">
          <h2 id="sheet-title">The Big O cheat sheet</h2>
          <Link href={TOPICS_PAGE.href}>All topics →</Link>
        </div>
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Big O reference for coding interviews</p>
            <p className="lede">
              {ENTRIES.length} data structures, algorithms, and patterns. Every bound says whether it is average, amortized, or
              worst case, and what it assumes.
            </p>
            <HomeSearch />
            <p className="hero-links">
              <Link href="/revision">One-page revision sheet</Link>
              <Link href="/roadmap">Where to start</Link>
              <a href={asset("/Big-O-Sheet.pdf")} download>
                Download the PDF
              </a>
            </p>
          </div>

          <aside className="scale-card" aria-labelledby="scale-title">
            <h2 id="scale-title">One million items</h2>
            <p>Operation count divided by an assumed 10⁸ simple operations a second. An estimate, not a benchmark.</p>
            <table>
              <caption className="sr-only">Illustrative time for common operation-count growth rates at n = 1,000,000</caption>
              <tbody>
                {CURVES.map((c) => (
                  <tr key={c.key}>
                    <th scope="row">
                      <code className={c.cls}>{c.label}</code>
                    </th>
                    <td>{fmtDuration(c.l(N))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="scale-note">
              That gap is the whole point. <Link href="/basics">Try other sizes in the playground</Link>.
            </p>
          </aside>
        </div>
      </section>

      <HomeProgress />

      <section className="home-section" aria-labelledby="index-title">
        <h2 id="index-title">What&apos;s here</h2>
        <div className="index-grid">
          {NAV.map((group) => {
            const links = group.label === "Reference" ? [TOPICS_PAGE, ...group.links] : group.links;
            return (
              <div key={group.label}>
                <h3>{group.label}</h3>
                <ol className="index-list">
                  {links.map((l) => (
                    <li key={l.href}>
                      <span>
                        <Link href={l.href}>{l.label}</Link>
                        <p>{l.blurb}</p>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </section>

      <section className="home-section" aria-labelledby="asked-title">
        <h2 id="asked-title">The ones you will be asked about</h2>
        <p>
          If you only memorize eight lines, make it these. Each links to the full explanation, and the{" "}
          <Link href="/lookup">lookup</Link> has the assumptions.
        </p>
        <div className="table-wrap" role="region" aria-label="Most asked complexities" tabIndex={0}>
          <table className="table">
            <caption>Best-known, average, and worst-case time complexity for common DSA operations</caption>
            <thead>
              <tr>
                <th scope="col">Operation</th>
                <th scope="col">Average</th>
                <th scope="col">Worst</th>
              </tr>
            </thead>
            <tbody>
              {MOST_ASKED.map((r) => (
                <tr key={r.name}>
                  <td>{r.entry ? <Link href={topicHref(r.entry)}>{r.name}</Link> : r.name}</td>
                  <td>
                    <code className={complexityColor(r.avg)}>{r.avg}</code>
                  </td>
                  <td>
                    <code className={complexityColor(r.worst)}>{r.worst}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="footnotes">
          The hash table worst case assumes many keys collide. Quicksort hits O(n²) when the pivot keeps splitting badly, such
          as a first-element pivot on sorted input. Green is cheapest, dark red is exponential.
        </p>
      </section>

      <section className="home-section" aria-labelledby="big-o-intro-title">
        <h2 id="big-o-intro-title">What is Big O notation?</h2>
        <p>
          Big O notation describes how an algorithm&apos;s time or memory use grows as its input grows. It abstracts away
          machine-specific constants and lower-order terms to make the growth rate easier to compare. For example, an
          O(n log n) sort generally scales better than an O(n²) sort on large inputs, though real performance also depends
          on implementation and data.
        </p>
        <h3>Time vs. space complexity</h3>
        <p>
          <strong>Time complexity</strong> counts how an algorithm&apos;s work grows; <strong>space complexity</strong>{" "}
          describes memory growth. Tables here call out auxiliary space so you can distinguish extra working memory from
          the input itself. Bounds are labeled best, average, amortized, or worst case and include assumptions where they
          change the answer. Read the <Link href="/basics">Big O notation guide</Link> for growth-rate definitions, or
          compare <Link href="/sorting">sorting algorithm time and space</Link> and{" "}
          <Link href="/data-structures">data structure operation complexity</Link>.
        </p>
        <h3>Common complexity classes</h3>
        <ul className="complexity-list">
          <li><code>O(1)</code> constant: work does not grow with input size.</li>
          <li><code>O(log n)</code> logarithmic: work grows slowly, as in binary search.</li>
          <li><code>O(n)</code> linear: work grows with the number of items.</li>
          <li><code>O(n log n)</code> linearithmic: common for efficient comparison sorting.</li>
          <li><code>O(n²)</code> quadratic: often comes from comparing every pair of items.</li>
          <li><code>O(2ⁿ)</code> exponential: can arise when exploring every subset.</li>
        </ul>
      </section>

      <section className="home-section" aria-labelledby="faq-title">
        <h2 id="faq-title">Big O cheat sheet: frequently asked questions</h2>
        <div className="faq-list">
          {FAQS.map(({ question, answer }) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQS.map(({ question, answer }) => ({
                "@type": "Question",
                name: question,
                acceptedAnswer: { "@type": "Answer", text: answer },
              })),
            }).replace(/</g, "\\u003c"),
          }}
        />
      </section>

      <p className="home-note">
        Found a bound that looks wrong? <a href={GITHUB_URL + "/issues"}>Open an issue</a> with a source, and it gets fixed.
      </p>
    </div>
  );
}

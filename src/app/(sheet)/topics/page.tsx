import Explore from "@/components/interactive/Explore";
import PageHeader from "@/components/layout/PageHeader";
import { ENTRIES } from "@/data/entries";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta(
  "All topics",
  "Search 34 data structures, algorithms, and coding patterns by name, complexity class, or interview relevance.",
  "topics/",
);

export default function TopicsPage() {
  return (
    <>
      <PageHeader
        breadcrumbHref="/topics"
        title="Topics"
        lede={`All ${ENTRIES.length} topics on the site. Search by name or keyword, then narrow by topic, complexity class, interview relevance, or your own progress. Open a topic for the explanation, code, and pitfalls.`}
      />
      <div className="page-body">
        <Explore />
      </div>
    </>
  );
}

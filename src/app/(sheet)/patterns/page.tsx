import PageHeader from "@/components/layout/PageHeader";
import TopicsOnPage from "@/components/layout/TopicsOnPage";
import CodingPatterns from "@/components/sections/CodingPatterns";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta(
  "Coding pattern complexity",
  "Typical time and auxiliary space for two pointers, sliding window, prefix sums, hash map counting, monotonic stacks, backtracking, and dynamic programming.",
  "patterns/",
);

export default function PatternsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Reference"
        id="coding-patterns"
        title="Coding patterns"
        lede="Interview problems tend to reuse a handful of patterns. Knowing the typical cost of each lets you estimate a solution before you write it."
      />
      <div className="page-body">
        <CodingPatterns />
        <TopicsOnPage page="/patterns" />
      </div>
    </>
  );
}

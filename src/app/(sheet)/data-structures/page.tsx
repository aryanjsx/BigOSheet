import PageHeader from "@/components/layout/PageHeader";
import Toc from "@/components/layout/Toc";
import TopicsOnPage from "@/components/layout/TopicsOnPage";
import DataStructures from "@/components/sections/DataStructures";
import GraphRepresentations from "@/components/sections/GraphRepresentations";
import MoreDataStructures from "@/components/sections/MoreDataStructures";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta(
  "Data structure time and space complexity",
  "Access, search, insertion, and deletion costs for arrays, linked lists, hash tables, trees, heaps, tries, Union-Find, and graph representations.",
  "data-structures/",
);

export default function DataStructuresPage() {
  return (
    <>
      <PageHeader
        breadcrumbHref="/data-structures"
        articleDescription="Access, search, insertion, and deletion costs for arrays, linked lists, hash tables, trees, heaps, tries, Union-Find, and graph representations."
        eyebrow="Reference"
        title="Data structures"
        lede="Average and worst-case cost of the common operations, then the structures that answer narrower questions, then the three ways to store a graph."
      />
      <Toc
        links={[
          ["data-structures", "Common operations"],
          ["complexity-kinds", "Average, amortized, worst"],
          ["more-data-structures", "More data structures"],
          ["priority-queues", "Priority queues"],
          ["graph-representations", "Graph representations"],
          ["topics-here", "Topics"],
        ]}
      />
      <DataStructures />
      <MoreDataStructures />
      <GraphRepresentations />
      <TopicsOnPage page="/data-structures" />
    </>
  );
}

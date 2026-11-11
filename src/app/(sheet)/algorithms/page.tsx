import PageHeader from "@/components/layout/PageHeader";
import Toc from "@/components/layout/Toc";
import TopicsOnPage from "@/components/layout/TopicsOnPage";
import AlgorithmReference from "@/components/sections/AlgorithmReference";
import GraphTree from "@/components/sections/GraphTree";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta(
  "Search, graph, and tree algorithm complexity",
  "Time and space for binary search, BFS, DFS, tree traversals, heap operations, Dijkstra, Bellman–Ford, Floyd–Warshall, Kruskal, and Prim.",
  "algorithms/",
);

export default function AlgorithmsPage() {
  return (
    <>
      <PageHeader
        breadcrumbHref="/algorithms"
        articleDescription="Time and space for binary search, BFS, DFS, tree traversals, heap operations, Dijkstra, Bellman–Ford, Floyd–Warshall, Kruskal, and Prim."
        eyebrow="Reference"
        title="Search and graph algorithms"
        lede="A one-table summary first, then traversal, heap, shortest-path, and spanning-tree algorithms in detail."
      />
      <Toc
        links={[
          ["algorithms", "Summary"],
          ["traversal-search", "Traversal and search"],
          ["heap-operations", "Heap operations"],
          ["shortest-paths", "Shortest paths"],
          ["minimum-spanning-trees", "Spanning trees"],
          ["topics-here", "Topics"],
        ]}
      />
      <AlgorithmReference />
      <GraphTree />
      <TopicsOnPage page="/algorithms" />
    </>
  );
}

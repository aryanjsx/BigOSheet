import Visualizer from "@/components/interactive/Visualizer";
import PageHeader from "@/components/layout/PageHeader";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta(
  "Algorithm visualizer",
  "Step through linear and binary search, bubble, insertion, merge, and quicksort, BFS, and DFS one move at a time, with comparison and swap counters.",
  "visualizer/",
);

export default function VisualizerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tools"
        title="Algorithm visualizer"
        lede="Watch linear and binary search, bubble, insertion, merge, and quicksort, and BFS and DFS work one step at a time. For the sorts, try already-sorted or reversed input to see the best and worst cases. Each step shows what was compared or moved, and the counters show where the cost comes from. You can step back as well as forward. The counters measure the work in this one run, not how fast it would be on real hardware."
      />
      <div className="page-body">
        <Visualizer />
      </div>
    </>
  );
}

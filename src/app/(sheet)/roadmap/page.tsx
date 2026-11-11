import Roadmap from "@/components/interactive/Roadmap";
import PageHeader from "@/components/layout/PageHeader";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta(
  "DSA interview roadmap",
  "All 34 topics in a suggested learning order across beginner, intermediate, and advanced levels, with prerequisites and progress tracking.",
  "roadmap/",
);

export default function RoadmapPage() {
  return (
    <>
      <PageHeader
        eyebrow="Practice"
        title="DSA interview roadmap"
        lede="A suggested order for learning the topics on this site. Each step lists what to learn first. Tick a topic when you are comfortable with it. Your progress is stored in this browser only."
      />
      <div className="page-body">
        <Roadmap />
      </div>
    </>
  );
}

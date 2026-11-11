import Compare from "@/components/interactive/Compare";
import PageHeader from "@/components/layout/PageHeader";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta(
  "Compare two algorithms",
  "Compare the time, space, stability, best uses, and trade-offs of two sorts, searches, graph algorithms, or data structures side by side.",
  "compare/",
);

export default function ComparePage() {
  return (
    <>
      <PageHeader
        eyebrow="Tools"
        title="Compare two algorithms"
        lede="Pick any two topics to compare time, space, stability, best uses, and trade-offs. Copy the result as a Markdown table, or copy the link to share this exact comparison."
      />
      <div className="page-body">
        <Compare />
      </div>
    </>
  );
}

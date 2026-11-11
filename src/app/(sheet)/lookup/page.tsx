import Lookup from "@/components/interactive/Lookup";
import PageHeader from "@/components/layout/PageHeader";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta(
  "Complexity lookup",
  "Search an operation or algorithm to see its best, average, and worst-case time and auxiliary space, with the assumption and caveat behind each.",
  "lookup/",
);

export default function LookupPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tools"
        title="Complexity lookup"
        lede="Type an operation or algorithm to see its best, average, and worst case in one place, with the assumption behind the average case and the caveat people usually miss."
      />
      <div className="page-body">
        <Lookup />
      </div>
    </>
  );
}

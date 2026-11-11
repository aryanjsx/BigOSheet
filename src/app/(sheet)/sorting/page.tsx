import PageHeader from "@/components/layout/PageHeader";
import TopicsOnPage from "@/components/layout/TopicsOnPage";
import Sorting from "@/components/sections/Sorting";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta(
  "Sorting algorithm complexity",
  "Best, average, and worst-case time and auxiliary space for quicksort, mergesort, heapsort, Timsort, counting sort, and more.",
  "sorting/",
);

export default function SortingPage() {
  return (
    <>
      <PageHeader
        breadcrumbHref="/sorting"
        articleDescription="Best, average, and worst-case time and auxiliary space for quicksort, mergesort, heapsort, Timsort, counting sort, and more."
        eyebrow="Reference"
        id="sorting"
        title="Sorting algorithms"
        lede="Best, average, and worst-case time for array sorts, with auxiliary space. The notes under the table say when a bound only holds for certain inputs or implementations."
      />
      <div className="page-body">
        <Sorting />
        <TopicsOnPage page="/sorting" />
      </div>
    </>
  );
}

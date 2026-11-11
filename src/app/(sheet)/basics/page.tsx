import PageHeader from "@/components/layout/PageHeader";
import Fundamentals from "@/components/sections/Fundamentals";
import Notation from "@/components/sections/Notation";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta(
  "Big O basics and growth playground",
  "What Big O notation means, how O(1) through O(2ⁿ) grow, and how to read average, amortized, and worst-case bounds.",
  "basics/",
);

export default function BasicsPage() {
  return (
    <>
      <PageHeader
        breadcrumbHref="/basics"
        articleDescription="What Big O notation means, how O(1) through O(2ⁿ) grow, and how to read average, amortized, and worst-case bounds."
        eyebrow="Reference"
        id="fundamentals"
        title="Big O basics"
        lede={
          <>
            Big O describes how the work an algorithm does grows as the input size <code>n</code> grows. It ignores constants
            and lower-order terms, so it tells you which algorithm wins on large inputs, not which one is faster on ten items.
            Change <code>n</code> below to see how the growth classes pull apart.
          </>
        }
      />
      <div className="page-body">
        <Fundamentals />
        <Notation />
      </div>
    </>
  );
}

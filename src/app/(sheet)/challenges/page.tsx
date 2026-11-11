import Challenge from "@/components/interactive/Challenge";
import PageHeader from "@/components/layout/PageHeader";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta(
  "Code complexity challenges",
  "Predict the time and auxiliary space of short Python, JavaScript, and Java snippets, then check your answer.",
  "challenges/",
);

export default function ChallengesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Practice"
        title="Code complexity challenges"
        lede="Read the snippet, then predict both its time and its auxiliary space before you reveal the answer. Snippets are shown in Python, JavaScript, and Java. Costs can differ between languages, and the explanation says when they do."
      />
      <div className="page-body">
        <Challenge />
      </div>
    </>
  );
}

import Quiz from "@/components/interactive/Quiz";
import PageHeader from "@/components/layout/PageHeader";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta(
  "Big O quiz",
  "Ten random Big O questions from a bank of 23, with an explanation after every answer and a review of what you missed.",
  "quiz/",
);

export default function QuizPage() {
  return (
    <>
      <PageHeader
        eyebrow="Practice"
        title="Big O quiz"
      />
      <div className="page-body">
        <Quiz />
      </div>
    </>
  );
}

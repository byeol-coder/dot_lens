import { ExpertReviewQueue } from "@/components/ExpertReviewQueue";
import { KeyedPageHeader } from "@/components/KeyedPageHeader";

export const metadata = {
  title: "Expert Review | Dot Lens",
  description: "Review and approve AI-generated tactile materials before they reach students.",
};

export default function ExpertReviewPage() {
  return (
    <>
      <KeyedPageHeader
        eyebrowKey="term.expertReview"
        titleKey="review.title"
        descriptionKey="review.description"
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <ExpertReviewQueue />
      </div>
    </>
  );
}

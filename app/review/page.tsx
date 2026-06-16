import { PageHeader, ComingNext } from "@/components/PageScaffold";
import { BrailleReviewConsole } from "@/components/BrailleReviewConsole";
import { ExpertReviewQueue } from "@/components/ExpertReviewQueue";
import Link from "next/link";

export default function ReviewPage() {
  return (
    <>
      <PageHeader
        eyebrow="Expert · Braille QA"
        title="Verify and approve tactile materials"
        titleKo="촉각 자료를 검토하고 승인하기"
        description="AI-generated tactile materials go through expert review before reaching students. Review tactile quality, approve or request revisions."
        phase={3}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 space-y-12">

        {/* Tactile Materials Review Queue */}
        <section aria-labelledby="tactile-review-heading">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 id="tactile-review-heading" className="text-[17px] font-semibold text-ink">
                Tactile Material Review Queue
              </h2>
              <p className="mt-1 text-[13px] text-muted">
                AI가 생성한 촉각 그래픽의 품질을 검수합니다.
              </p>
            </div>
            <Link
              href="/expert-review"
              className="rounded-xl border border-accent bg-accent-tint px-4 py-2 text-[13px] font-semibold text-accent hover:bg-accent hover:text-white transition-colors"
            >
              Full Review Mode →
            </Link>
          </div>
          <ExpertReviewQueue />
        </section>

        {/* Original Braille QA */}
        <section aria-labelledby="braille-qa-heading">
          <h2 id="braille-qa-heading" className="mb-4 text-[17px] font-semibold text-ink">
            Braille QA Console
          </h2>
          <BrailleReviewConsole />
          <div className="mt-6">
            <ComingNext
              points={[
                "UEB Grade 2 contractions and Korean 약자 (abbreviations).",
                "Nemeth and Korean math braille for equations.",
                "Reviewer roles, audit trail, and certified TVI queue.",
              ]}
            />
          </div>
        </section>
      </div>
    </>
  );
}

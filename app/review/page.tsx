import { PageHeader, ComingNext } from "@/components/PageScaffold";
import { BrailleReviewConsole } from "@/components/BrailleReviewConsole";

export default function ReviewPage() {
  return (
    <>
      <PageHeader
        eyebrow="Global Braille · QA"
        title="Verify braille before it reaches a student"
        titleKo="학생에게 닿기 전에 점자를 검수하기"
        description="Generated braille passes automated QA checks, then an expert approves it. Only approved braille is surfaced on the Dot Pad (F4)."
        phase={3}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
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
      </div>
    </>
  );
}

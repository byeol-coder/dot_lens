import { PageHeader, ComingNext } from "@/components/PageScaffold";
import { StudentExperienceShowcase } from "@/components/premium/StudentExperienceShowcase";

export default function StudentPage() {
  return (
    <>
      <PageHeader
        eyebrow="Student · tactile explorer"
        title="Explore the water cycle by touch"
        titleKo="손끝으로 물의 순환 탐색하기"
        description="Connect the Dot Pad, then pan through each part of the diagram. The tactile grid, braille line, and Gemini tutor update with every key — the emotional heart of Dot Lens."
        phase={2}
      />
      <StudentExperienceShowcase />
      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <ComingNext
          points={[
            "Full tactile quiz with F3 answer-checking and scoring.",
            "Expert-reviewed braille from the Global Braille QA layer (real cells).",
            "Bilingual audio guidance and a Korean braille line.",
          ]}
        />
      </div>
    </>
  );
}

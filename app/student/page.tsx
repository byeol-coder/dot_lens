import { PageHeader, ComingNext } from "@/components/PageScaffold";
import { StudentExperienceShowcase } from "@/components/premium/StudentExperienceShowcase";

export default function StudentPage() {
  return (
    <>
      <PageHeader
        eyebrow="Student Demo"
        eyebrowKo="학생 체험"
        title="Explore the lesson by touch"
        titleKo="손끝으로 수업 탐색하기"
        description="Experience the lesson as a blind or low-vision learner. Use ← → to move between parts and F1–F4 to explain, hint, quiz, and hear the braille summary — on the Dot Pad's 60×40 pins and 20-cell braille line."
        descriptionKo="시각장애·저시력 학생의 입장에서 수업을 체험합니다. ← →로 부분을 이동하고 F1–F4로 설명·힌트·퀴즈·점자 요약을 들으며, Dot Pad의 60×40 핀과 20칸 점자 라인으로 탐색합니다."
      />
      <StudentExperienceShowcase />
      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <ComingNext
          points={[
            "Full tactile quiz with F3 answer-checking and scoring.",
            "Expert-reviewed braille (real cells) before it reaches a student.",
            "Bilingual audio guidance and a Korean braille line.",
          ]}
          pointsKo={[
            "F3로 답을 확인하고 점수를 매기는 촉각 퀴즈",
            "학생에게 닿기 전 전문가 검수를 거친 실제 점자 셀",
            "한국어 음성 안내와 한글 점자 라인",
          ]}
        />
      </div>
    </>
  );
}

import { PageHeader, ComingNext } from "@/components/PageScaffold";
import { StudentExperienceShowcase } from "@/components/premium/StudentExperienceShowcase";

export default function StudentPage() {
  return (
    <>
      <PageHeader
        eyebrow="Student · tactile explorer"
        eyebrowKo="학생 · 촉각 탐색"
        title="Explore the water cycle by touch"
        titleKo="손끝으로 물의 순환 탐색하기"
        description="Connect the Dot Pad and move through each part of the diagram. The tactile grid, braille line, and audio guide respond to every key — so the student follows the same lesson as the class, by touch."
        descriptionKo="Dot Pad를 연결하고 다이어그램의 각 부분을 이동하며 탐색하세요. 촉각 그리드·점자 라인·음성 안내가 키 입력마다 반응해, 학생이 반 전체와 같은 수업을 손끝으로 따라갑니다."
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

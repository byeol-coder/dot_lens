import { PageHeader } from "@/components/PageScaffold";
import { LessonLibraryPage } from "@/components/LessonLibraryPage";

export default function LessonLibraryRoute() {
  return (
    <>
      <PageHeader
        eyebrow="Dot Lens · Lessons"
        eyebrowKo="닷 렌즈 · 수업 자료"
        title="Reuse a lesson, ready for touch"
        titleKo="검증된 수업 자료를 골라 바로 촉각으로"
        description="Pick a diagram from the lesson library and Dot Lens turns it into a Dot Pad tactile layout in one step. Browse approved lessons below to reuse in class."
        descriptionKo="라이브러리에서 다이어그램을 고르면 닷 렌즈가 한 번에 Dot Pad 촉각 자료로 바꿔줍니다. 아래에서 승인된 수업 자료를 골라 수업에 바로 활용하세요."
      />
      <LessonLibraryPage />
    </>
  );
}

import { PageHeader } from "@/components/PageScaffold";
import { LessonLibraryPage } from "@/components/LessonLibraryPage";

export default function LessonLibraryRoute() {
  return (
    <>
      <PageHeader
        eyebrow="Google for Education · Lesson Library"
        title="교육 자료를 손끝으로 — 원클릭 촉각 변환"
        titleKo="국어 · 수학 · 과학 레슨을 Dot Pad로"
        description="Google for Education 레슨 라이브러리의 다이어그램을 선택하면 Gemini가 분석하고 Dot Pad 촉각 출력을 즉시 생성합니다. 레슨 URL을 붙여넣거나 아래에서 직접 선택하세요."
        phase={1}
      />
      <LessonLibraryPage />
    </>
  );
}

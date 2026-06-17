import { PageHeader } from "@/components/PageScaffold";
import { CustomLessonBuilder } from "@/components/CustomLessonBuilder";

export const metadata = {
  title: "Tactile Builder | Dot Lens",
  description:
    "Build a custom tactile lesson from your own material — shape each object, label it in braille, narrate it, and explore it on the Dot Pad.",
};

export default function BuilderPage() {
  return (
    <>
      <PageHeader
        eyebrow="Build · custom tactile material"
        eyebrowKo="제작 · 커스텀 촉각 자료"
        title="Build your own tactile lesson"
        titleKo="나만의 촉각 수업 만들기"
        description="Turn any classroom material into a tactile lesson students can explore by touch. Place each object on the 60×40 Dot Pad, label it in braille (auto-checked by the Global Braille QA layer), add audio guidance, and try it the way a student would — no coding required."
        descriptionKo="어떤 수업 자료든 손끝으로 탐색하는 촉각 수업으로 바꾸세요. 각 객체를 60×40 Dot Pad에 배치하고, 점자 라벨을 달면 글로벌 점자 QA 레이어가 자동 검수합니다. 음성 안내를 더하고 학생처럼 직접 체험해 보세요 — 코딩이 필요 없습니다."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-2 sm:px-6">
        <CustomLessonBuilder />
      </div>
    </>
  );
}

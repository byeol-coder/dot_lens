import { PageHeader } from "@/components/PageScaffold";
import { ChampionKit } from "@/components/ChampionKit";

export const metadata = {
  title: "Champion Kit | Dot Lens",
  description:
    "Training materials for champion teachers: a quick-start guide, a 1-day workshop agenda, and a review checklist.",
};

export default function ChampionKitPage() {
  return (
    <>
      <PageHeader
        eyebrow="Empower · champion kit"
        eyebrowKo="역량 강화 · 챔피언 패키지"
        title="Train champion teachers in a day"
        titleKo="하루 만에 챔피언 교사 양성"
        description="Everything a facilitator needs to spread tactile lessons: a 10-minute quick-start, a 1-day workshop agenda, and a review checklist teachers can print or save as PDF."
        descriptionKo="촉각 수업을 확산하는 데 필요한 모든 것: 10분 퀵스타트, 1일 워크숍 일정, 그리고 인쇄·PDF 저장이 가능한 검수 체크리스트."
      />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <ChampionKit />
      </div>
    </>
  );
}

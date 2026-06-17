import { TrainerAcademyPanel } from "@/components/TrainerAcademyPanel";
import { PageHeader } from "@/components/PageScaffold";

export const metadata = {
  title: "Trainer Academy | Dot Lens",
  description:
    "A certification ladder and country-partner network that grows local trainers and champions for tactile education.",
};

export default function AcademyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Dot Lens · Trainer Academy"
        eyebrowKo="닷 렌즈 · 트레이너 아카데미"
        title="Tactile Trainer Academy"
        titleKo="촉각 트레이너 아카데미"
        description="A certification path and country-partner network that lets each country grow its own tactile-education trainers — so the program sustains itself locally."
        descriptionKo="각국이 스스로 촉각 교육 트레이너를 길러낼 수 있도록 돕는 인증 과정과 파트너 네트워크입니다. 등급 과정·역량 평가·시연 심사·공개 디렉터리·연 재인증으로 현지 자립을 지원합니다."
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <TrainerAcademyPanel />
      </div>
    </>
  );
}

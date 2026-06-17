import { TrainerAcademyPanel } from "@/components/TrainerAcademyPanel";

export const metadata = {
  title: "Trainer Academy — Dot Lens",
  description:
    "A certification ladder and country-partner network that grows local trainers and champions for tactile graphic education — modeled on the Google for Education trainer program.",
};

export default function AcademyPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 border-b border-line pb-6">
        <p className="eyebrow">05 · Empower local teachers</p>
        <h1 className="mt-2 text-balance text-3xl font-semibold text-ink sm:text-4xl">
          Tactile Trainer Academy
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
          각국 파트너와 챔피언 교사를 ‘촉각 그래픽 교육이 가능한 공인 트레이너’로
          양성하는 인증 체계입니다. Google for Education 인증 트레이너 프로그램의
          구조(등급 사다리 · 역량 평가 · 시연 심사 · 공개 디렉터리 · 연 재인증)를
          촉각 교육 맥락에 맞게 옮겼습니다.
        </p>
        <p className="mt-1 max-w-2xl text-[14px] text-muted">
          A certification ladder + country-partner network that lets each country
          grow its own tactile-education trainers, so the program sustains itself.
        </p>
      </div>

      <TrainerAcademyPanel />
    </div>
  );
}

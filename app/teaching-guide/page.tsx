import { TeachingGuide } from "@/components/TeachingGuide";

export const metadata = {
  title: "Teaching Guide — Dot Lens",
  description: "Step-by-step guide for teachers on how to use tactile materials in class.",
};

export default function TeachingGuidePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 border-b border-line pb-6">
        <p className="eyebrow">Teacher · Teaching Guide</p>
        <h1 className="mt-2 text-balance text-3xl font-semibold text-ink sm:text-4xl">
          Teaching Guide
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
          AI가 생성한 수업 가이드입니다. 탐색 순서, 핵심 개념, 질문 예시, 혼동 포인트를 확인하고 수업에 활용하세요.
        </p>
        <p className="mt-1 max-w-2xl text-[14px] text-muted">
          AI-generated teaching guide. Use the exploration order, key concepts, and classroom questions to lead an effective tactile lesson.
        </p>
      </div>

      <TeachingGuide diagramType="water_cycle" />
    </div>
  );
}

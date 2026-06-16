import { FieldDataPanel } from "@/components/FieldDataPanel";

export const metadata = {
  title: "Field Data — Dot Lens",
  description: "Monitor teacher usage, champion teacher progress, and field impact across mission schools.",
};

export default function FieldDataPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 border-b border-line pb-6">
        <p className="eyebrow">Field Activist · Mode</p>
        <h1 className="mt-2 text-balance text-3xl font-semibold text-ink sm:text-4xl">
          Field Data &amp; Impact
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
          선교지 및 저자원 학교 현장에서의 플랫폼 활용 현황과 챔피언 교사 양성 현황을 모니터링합니다.
        </p>
        <p className="mt-1 max-w-2xl text-[14px] text-muted">
          Monitor platform adoption, teacher empowerment progress, and field reports from mission schools and low-resource classrooms.
        </p>
      </div>

      <FieldDataPanel />
    </div>
  );
}

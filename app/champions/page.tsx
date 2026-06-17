import { ChampionsPanel } from "@/components/ChampionsPanel";

export const metadata = {
  title: "Champion Teachers — Dot Lens",
  description:
    "Recommend and grow local champion teachers from real usage data so tactile education sustains itself.",
};

export default function ChampionsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 border-b border-line pb-6">
        <p className="eyebrow">05 · Empower local teachers</p>
        <h1 className="mt-2 text-balance text-3xl font-semibold text-ink sm:text-4xl">
          Champion Teachers
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
          실제 활용 데이터를 바탕으로 챔피언 교사 후보를 추천하고, 현지 교사가
          스스로 촉각 교육을 이어가도록 양성합니다.
        </p>
        <p className="mt-1 max-w-2xl text-[14px] text-muted">
          The final stage of the loop: recommend and grow local champion teachers
          so the program runs without outside delivery.
        </p>
        <a
          href="/academy"
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-accent bg-accent-tint px-4 py-2.5 text-[13.5px] font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
        >
          촉각 트레이너 인증 체계 보기 · Tactile Trainer Academy →
        </a>
      </div>

      <ChampionsPanel />
    </div>
  );
}

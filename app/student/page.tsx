import { PageHeader, ComingNext } from "@/components/PageScaffold";
import { DotPadSimulator } from "@/components/DotPadSimulator";
import { StatusBadge } from "@/components/StatusBadge";
import { WATER_CYCLE_ASSIGNMENT as A } from "@/lib/constants";

export default function StudentPage() {
  return (
    <>
      <PageHeader
        eyebrow="Student · tactile explorer"
        title="Explore the water cycle by touch"
        titleKo="손끝으로 물의 순환 탐색하기"
        description="Connect the Dot Pad, then pan through each part of the diagram. The tactile grid, braille line, and Gemini tutor update with every key."
        phase={2}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Assignment context */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-5 py-3 shadow-card">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">
              Assignment
            </p>
            <p className="text-[15px] font-semibold text-ink">{A.title.en}</p>
          </div>
          <StatusBadge variant="verified">tactile-ready</StatusBadge>
        </div>

        {/* The device */}
        <DotPadSimulator />

        {/* How to use */}
        <div className="mt-5 rounded-2xl border border-line bg-surface px-5 py-4 shadow-card">
          <p className="eyebrow">How to use</p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
            Use the six keys below the device, or your keyboard:{" "}
            <span className="font-medium text-ink">← →</span> to pan between objects,{" "}
            <span className="font-medium text-ink">1–4</span> for F1–F4. F1 explains
            where you are, F2 gives a hint, F3 starts the quiz, and F4 repeats the
            braille summary.
          </p>
        </div>

        <div className="mt-6">
          <ComingNext
            points={[
              "Full tactile quiz with F3 answer-checking and scoring.",
              "Expert-reviewed braille from the Global Braille QA layer (real cells).",
              "Bilingual audio guidance and a Korean braille line.",
            ]}
          />
        </div>
      </div>
    </>
  );
}

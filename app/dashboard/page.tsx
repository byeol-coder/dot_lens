import { PlatformDashboard } from "@/components/PlatformDashboard";
import { DashboardTable } from "@/components/DashboardTable";
import { ComingNext } from "@/components/PageScaffold";

export const metadata = {
  title: "Dashboard — Dot Lens",
  description: "Platform overview: lessons created, teachers active, student sessions, and field impact.",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Page header */}
      <div className="mb-8 border-b border-line pb-6">
        <p className="eyebrow">Platform · Dashboard</p>
        <h1 className="mt-2 text-balance text-3xl font-semibold text-ink sm:text-4xl">
          Platform Overview
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
          실시간 수업 자료 생성 현황, 검수 대기, 교사 참여 수, 학생 학습 세션을 한눈에 확인하세요.
        </p>
        <p className="mt-1 max-w-2xl text-[14px] text-muted">
          Live stats across lesson creation, expert reviews, teacher participation, and student learning sessions.
        </p>
      </div>

      <PlatformDashboard />

      {/* Original student-progress table preserved below */}
      <div className="mt-12 border-t border-line pt-8">
        <h2 className="text-[17px] font-semibold text-ink">Student Progress (Demo Lesson)</h2>
        <p className="mt-1 text-[13px] text-muted">
          Per-student Dot Pad session progress for the water cycle assignment.
        </p>
        <div className="mt-4">
          <DashboardTable />
        </div>
        <div className="mt-6">
          <ComingNext
            points={[
              "Replay a student's session and quiz answers.",
              "Export a short summary for IEP records.",
              "Charts mirrored as accessible tables.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}

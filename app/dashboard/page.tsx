import { PlatformDashboard } from "@/components/PlatformDashboard";
import { DashboardTable } from "@/components/DashboardTable";
import { ComingNext } from "@/components/PageScaffold";
import { DashboardHeader, StudentProgressSectionHeader } from "@/components/DashboardHeader";

export const metadata = {
  title: "Dashboard | Dot Lens",
  description: "Track created lessons, review status, and classroom usage in one place.",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <DashboardHeader />

      <PlatformDashboard />

      {/* Student-progress table */}
      <div className="mt-12 border-t border-line pt-8">
        <StudentProgressSectionHeader />
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
            pointsKo={[
              "학생 세션과 퀴즈 답변 다시 보기",
              "IEP 기록을 위한 요약 내보내기",
              "차트를 접근 가능한 표로 표시",
            ]}
          />
        </div>
      </div>
    </div>
  );
}

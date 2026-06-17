import { PlatformDashboard } from "@/components/PlatformDashboard";
import { DashboardTable } from "@/components/DashboardTable";
import { ComingNext } from "@/components/PageScaffold";
import { DashboardHeader } from "@/components/DashboardHeader";

export const metadata = {
  title: "Dashboard | Dot Lens",
  description: "Track created lessons, review status, and classroom usage in one place.",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <DashboardHeader />

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

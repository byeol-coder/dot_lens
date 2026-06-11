import { PageHeader, ComingNext } from "@/components/PageScaffold";
import { DashboardTable } from "@/components/DashboardTable";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Teacher · dashboard"
        title="See who explored what — and where they got stuck"
        titleKo="누가 무엇을 탐색했고 어디서 막혔는지"
        description="Live per-student progress for the tactile assignment, saved from the student's Dot Pad session, with a Gemini summary for each."
        phase={3}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <DashboardTable />

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
    </>
  );
}

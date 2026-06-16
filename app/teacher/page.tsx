import Link from "next/link";
import { TeacherFlow } from "@/components/TeacherFlow";

export const metadata = {
  title: "Teacher Mode — Dot Lens",
  description: "Create AI-powered tactile lesson materials for blind and low-vision students.",
};

export default function TeacherPage() {
  return (
    <>
      {/* Teacher mode header */}
      <div className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="eyebrow">Teacher · Mode</p>
          <h1 className="mt-2 text-balance text-3xl font-semibold text-ink sm:text-4xl">
            Create Tactile Lesson
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
            수업 자료를 업로드하면 AI가 다이어그램을 분석하고 촉각 그래픽·음성 설명·수업 가이드를 생성합니다.
          </p>
          <p className="mt-1 max-w-2xl text-[14px] text-muted">
            Upload a classroom diagram. AI analyzes it and generates tactile graphics, audio descriptions, and a teaching guide — ready for Dot Pad.
          </p>

          {/* Quick links */}
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/teaching-guide"
              className="rounded-xl border border-line bg-paper px-4 py-2 text-[13px] font-medium text-muted transition-colors hover:bg-surface-sunk hover:text-ink"
              aria-label="Open Teaching Guide"
            >
              📖 Teaching Guide
            </Link>
            <Link
              href="/expert-review"
              className="rounded-xl border border-line bg-paper px-4 py-2 text-[13px] font-medium text-muted transition-colors hover:bg-surface-sunk hover:text-ink"
              aria-label="Request expert review"
            >
              🔍 Request Expert Review
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-line bg-paper px-4 py-2 text-[13px] font-medium text-muted transition-colors hover:bg-surface-sunk hover:text-ink"
              aria-label="View platform dashboard"
            >
              📊 Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <TeacherFlow />
      </div>
    </>
  );
}

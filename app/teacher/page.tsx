import Link from "next/link";
import { TeacherFlow } from "@/components/TeacherFlow";
import { TeacherPageHeader } from "@/components/TeacherPageHeader";

export const metadata = {
  title: "Create Lesson | Dot Lens",
  description: "Create AI-powered tactile lesson materials students can explore by touch.",
};

export default function TeacherPage() {
  return (
    <>
      <TeacherPageHeader />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link
          href="/builder"
          className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/40 bg-accent-tint/50 px-5 py-4 transition-colors hover:bg-accent-tint"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-eyebrow text-accent">
              Build from your own material · 내 자료로 직접 만들기
            </p>
            <p className="mt-1 text-[14px] font-semibold text-ink">
              Open the Tactile Builder to author a custom lesson, object by object.
            </p>
            <p className="text-[13px] text-muted">
              템플릿에서 시작해 객체별로 모양·점자·음성을 정하고 Dot Pad에서 바로 체험하세요.
            </p>
          </div>
          <span className="rounded-xl bg-accent px-4 py-2.5 text-[13.5px] font-semibold text-white">
            Tactile Builder →
          </span>
        </Link>
        <TeacherFlow />
      </div>
    </>
  );
}

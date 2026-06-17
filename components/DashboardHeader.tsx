"use client";

import Link from "next/link";
import { useT, useLang } from "@/lib/i18n";

export function DashboardHeader() {
  const { t } = useT();
  return (
    <div className="mb-8 border-b border-line pb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{t("brand.name")} · {t("nav.dashboard")}</p>
          <h1 className="mt-2 text-balance text-3xl font-semibold text-ink sm:text-4xl">
            {t("dashboard.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
            {t("dashboard.description")}
          </p>
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-accent-soft">
            {t("dashboard.brandHelper")}
          </p>
        </div>
        <Link
          href="/demo"
          className="shrink-0 rounded-xl border border-accent bg-surface px-4 py-2.5 text-[14px] font-semibold text-accent transition-colors hover:bg-accent-tint"
        >
          {t("dashboard.sampleButton")} →
        </Link>
      </div>
    </div>
  );
}

export function StudentProgressSectionHeader() {
  const { lang } = useLang();
  return (
    <div>
      <h2 className="text-[17px] font-semibold text-ink">
        {lang === "ko" ? "학생 학습 현황 (체험 수업)" : "Student Progress (Demo Lesson)"}
      </h2>
      <p className="mt-1 text-[13px] text-muted">
        {lang === "ko"
          ? "물의 순환 수업 실시간 학생 Dot Pad 세션 현황입니다."
          : "Per-student Dot Pad session progress for the water cycle assignment."}
      </p>
    </div>
  );
}

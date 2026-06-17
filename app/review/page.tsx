"use client";

import { PageHeader, ComingNext } from "@/components/PageScaffold";
import { BrailleReviewConsole } from "@/components/BrailleReviewConsole";
import { ExpertReviewQueue } from "@/components/ExpertReviewQueue";
import { CustomReviewConsole } from "@/components/CustomReviewConsole";
import { useT } from "@/lib/i18n";
import Link from "next/link";

export default function ReviewPage() {
  const { t, lang } = useT();
  const L = (en: string, ko: string) => (lang === "ko" ? ko : en);

  return (
    <>
      <PageHeader
        eyebrow="Expert Review"
        eyebrowKo="전문가 검토"
        title="Verify and approve tactile materials"
        titleKo="촉각 자료를 검토하고 승인하기"
        description={L(
          "Review AI-generated tactile materials before classroom use.",
          "AI가 생성한 촉각 자료를 수업 전에 전문가 관점으로 검토합니다."
        )}
        descriptionKo="AI가 생성한 촉각 자료를 수업 전에 전문가 관점으로 검토합니다."
      />
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-10 sm:px-6">
        {/* What to check — review criteria */}
        <section aria-labelledby="criteria-heading" className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <h2 id="criteria-heading" className="eyebrow">{t("review.criteriaTitle")}</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-3">
            {[t("review.q.touch"), t("review.q.goal"), t("review.q.align")].map((q, i) => (
              <li key={i} className="flex items-start gap-2.5 rounded-xl border border-line bg-surface-sunk px-4 py-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-accent-tint font-mono text-[12px] font-semibold text-accent">
                  {i + 1}
                </span>
                <span className="text-[13.5px] leading-snug text-ink">{q}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Teacher-built lessons review console (real, localStorage-backed) */}
        <section aria-labelledby="custom-review-heading">
          <div className="mb-6">
            <h2 id="custom-review-heading" className="text-[17px] font-semibold text-ink">
              {L("Field review · teacher-built lessons", "현장 검토 · 교사 제작 수업")}
            </h2>
            <p className="mt-1 text-[13px] text-muted">
              {L(
                "Field staff review, edit, and approve teacher-built tactile lessons and leave feedback.",
                "현장 담당자가 교사 제작 촉각 수업을 검토·수정·승인하고 피드백을 남깁니다."
              )}
            </p>
          </div>
          <CustomReviewConsole />
        </section>

        {/* Tactile Materials Review Queue */}
        <section aria-labelledby="tactile-review-heading">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 id="tactile-review-heading" className="text-[17px] font-semibold text-ink">
                {L("Tactile material review queue", "촉각 자료 검수 대기열")}
              </h2>
              <p className="mt-1 text-[13px] text-muted">
                {L("Review the quality of AI-generated tactile graphics.", "AI가 생성한 촉각 그래픽의 품질을 검수합니다.")}
              </p>
            </div>
            <Link
              href="/expert-review"
              className="shrink-0 rounded-xl border border-accent bg-accent-tint px-4 py-2 text-[13px] font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
            >
              {L("Full review mode →", "전체 검수 모드 →")}
            </Link>
          </div>
          <ExpertReviewQueue />
        </section>

        {/* Braille QA */}
        <section aria-labelledby="braille-qa-heading">
          <h2 id="braille-qa-heading" className="mb-4 text-[17px] font-semibold text-ink">
            {L("Braille QA console", "점자 검수 콘솔")}
          </h2>
          <BrailleReviewConsole />
          <div className="mt-6">
            <ComingNext
              points={[
                "UEB Grade 2 contractions and Korean abbreviations (약자).",
                "Nemeth and Korean math braille for equations.",
                "Reviewer roles, audit trail, and a certified TVI queue.",
              ]}
              pointsKo={[
                "UEB 2종(축약)과 한국어 약자 지원",
                "수식용 Nemeth·한국어 수학 점자",
                "검수자 역할, 변경 이력, 인증 TVI 대기열",
              ]}
            />
          </div>
        </section>
      </div>
    </>
  );
}

"use client";

import { useState, useCallback } from "react";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import {
  SAMPLE_PACKAGES,
  REVIEW_STATUS_META,
  type ReviewStatus,
  type TactileLessonPackage,
} from "@/lib/tactileLessonPackage";

const FILTER_TABS: { id: ReviewStatus | "all"; en: string; ko: string }[] = [
  { id: "all",               en: "All",                ko: "전체" },
  { id: "ai_generated",      en: "AI Generated",       ko: "AI 생성" },
  { id: "needs_review",      en: "Needs Review",       ko: "검수 필요" },
  { id: "revision_requested",en: "Revision Requested", ko: "수정 요청" },
  { id: "approved",          en: "Approved",           ko: "승인 완료" },
  { id: "ready_for_dot_pad", en: "Ready for Dot Pad",  ko: "Dot Pad 출력 가능" },
  { id: "published",         en: "Published",          ko: "배포됨" },
];

const CHECKLIST_ITEMS: { key: keyof TactileLessonPackage["reviewChecklist"]; en: string; ko: string }[] = [
  { key: "tactileReadability",    en: "Tactile readability",      ko: "촉각 인지성" },
  { key: "educationalAccuracy",   en: "Educational accuracy",     ko: "교육 정확도" },
  { key: "brailleLabelClarity",   en: "Braille label clarity",    ko: "점자 라벨 명료성" },
  { key: "audioGuidanceQuality",  en: "Audio guidance quality",   ko: "음성 안내 품질" },
  { key: "dotPadSuitability",     en: "Dot Pad 60×40 suitability", ko: "Dot Pad 60×40 적합성" },
  { key: "studentExplorationFlow",en: "Student exploration flow", ko: "학생 탐색 흐름" },
];

const SUBJECT_LABEL: Record<string, { ko: string; en: string }> = {
  science:  { ko: "과학",  en: "Science" },
  math:     { ko: "수학",  en: "Math" },
  korean:   { ko: "국어",  en: "Korean" },
  social:   { ko: "사회",  en: "Social" },
};

export function ReviewConsoleView() {
  const { lang } = useLang();
  const L = useCallback((en: string, ko: string) => (lang === "ko" ? ko : en), [lang]);

  const [filter, setFilter] = useState<ReviewStatus | "all">("all");
  const [selected, setSelected] = useState<string>(SAMPLE_PACKAGES[0].id);
  const [notes, setNotes] = useState("");
  const [checklist, setChecklist] = useState<Record<string, Record<string, boolean>>>(() =>
    Object.fromEntries(SAMPLE_PACKAGES.map((p) => [p.id, { ...p.reviewChecklist }]))
  );

  const visible = filter === "all"
    ? SAMPLE_PACKAGES
    : SAMPLE_PACKAGES.filter((p) => p.reviewStatus === filter);

  const pkg = SAMPLE_PACKAGES.find((p) => p.id === selected) ?? SAMPLE_PACKAGES[0];
  const pkgChecklist = checklist[pkg.id] ?? {};
  const checkCount = Object.values(pkgChecklist).filter(Boolean).length;
  const meta = REVIEW_STATUS_META[pkg.reviewStatus];

  const toggleCheck = (key: string) =>
    setChecklist((prev) => ({
      ...prev,
      [pkg.id]: { ...prev[pkg.id], [key]: !prev[pkg.id]?.[key] },
    }));

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">

      {/* ── Header ── */}
      <header className="mb-6 space-y-1">
        <p className="eyebrow">{L("Review Console", "검수 콘솔")}</p>
        <h1 className="text-[28px] font-semibold text-ink sm:text-[34px]">
          {L("Tactile Lesson Review", "촉각 수업 자료 검수")}
        </h1>
        <p className="text-[14px] text-muted">
          {L(
            "Review AI-generated materials before they reach students. Approve or request revisions.",
            "학생에게 전달되기 전에 AI 생성 자료를 검수하고 승인하거나 수정을 요청하세요."
          )}
        </p>
      </header>

      {/* ── Filter tabs ── */}
      <div className="mb-6 flex flex-wrap gap-1.5 border-b border-line pb-4">
        {FILTER_TABS.map((tab) => {
          const count = tab.id === "all"
            ? SAMPLE_PACKAGES.length
            : SAMPLE_PACKAGES.filter((p) => p.reviewStatus === tab.id).length;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors",
                filter === tab.id
                  ? "bg-accent text-white"
                  : "bg-surface-sunk text-muted hover:bg-accent-tint hover:text-accent"
              )}
            >
              {lang === "ko" ? tab.ko : tab.en}
              {count > 0 && (
                <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-bold", filter === tab.id ? "bg-white/20 text-white" : "bg-surface text-faint")}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">

        {/* ── Left: lesson list ── */}
        <aside className="space-y-2">
          {visible.length === 0 && (
            <p className="rounded-xl border border-line bg-surface p-4 text-[13px] text-muted">
              {L("No lessons match this filter.", "이 필터에 해당하는 수업 자료가 없습니다.")}
            </p>
          )}
          {visible.map((p) => {
            const m = REVIEW_STATUS_META[p.reviewStatus];
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelected(p.id)}
                className={cn(
                  "w-full rounded-xl border p-4 text-left transition-all",
                  selected === p.id
                    ? "border-accent bg-accent-tint"
                    : "border-line bg-surface hover:border-accent/30"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13.5px] font-semibold text-ink leading-tight">
                    {lang === "ko" ? p.title.ko : p.title.en}
                  </p>
                  <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold", m.color)}>
                    {lang === "ko" ? m.labelKo : m.label}
                  </span>
                </div>
                <p className="mt-1 text-[11.5px] text-muted">
                  {lang === "ko" ? SUBJECT_LABEL[p.subject]?.ko : SUBJECT_LABEL[p.subject]?.en}
                  {" · v"}
                  {p.version}
                  {" · "}
                  {p.explorationSteps.length} {L("steps", "단계")}
                </p>
              </button>
            );
          })}
        </aside>

        {/* ── Right: detail panel ── */}
        <div className="space-y-5">

          {/* Title + status */}
          <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-line bg-surface p-5 shadow-card">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
                {L("Tactile Lesson Package", "촉각 수업 패키지")} · v{pkg.version}
              </p>
              <h2 className="mt-1 text-[20px] font-semibold text-ink">
                {lang === "ko" ? pkg.title.ko : pkg.title.en}
              </h2>
              <p className="mt-1 text-[13px] text-muted">
                {lang === "ko" ? SUBJECT_LABEL[pkg.subject]?.ko : SUBJECT_LABEL[pkg.subject]?.en}
                {" · "}
                {pkg.explorationSteps.length} {L("exploration steps", "탐색 단계")}
                {" · "}
                {pkg.localizationPacks.filter((l) => l.status === "complete").length}
                /{pkg.localizationPacks.length} {L("locale packs", "언어팩")}
              </p>
            </div>
            <span className={cn("rounded-full px-3 py-1.5 text-[12px] font-semibold", meta.color)}>
              {lang === "ko" ? meta.labelKo : meta.label}
            </span>
          </div>

          {/* Checklist */}
          <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-ink">
                {L("Review Checklist", "검수 체크리스트")}
              </h3>
              <span className="text-[12px] font-semibold text-accent">
                {checkCount}/{CHECKLIST_ITEMS.length} {L("checked", "완료")}
              </span>
            </div>
            <div className="space-y-2">
              {CHECKLIST_ITEMS.map((item) => {
                const checked = !!pkgChecklist[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleCheck(item.key)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                      checked ? "bg-verify-tint/50" : "bg-surface-sunk/50 hover:bg-surface-sunk"
                    )}
                  >
                    <span className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold transition-colors",
                      checked ? "border-verify bg-verify text-white" : "border-line bg-surface text-faint"
                    )}>
                      {checked && "✓"}
                    </span>
                    <span className={cn("text-[13px] font-medium", checked ? "text-ink" : "text-muted")}>
                      {lang === "ko" ? item.ko : item.en}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review notes */}
          <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
            <label className="mb-2 block text-[13px] font-semibold text-ink">
              {L("Review Notes", "검수 의견")}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={L(
                "Note clarity, complexity, and anything to refine before classroom use…",
                "촉각 인지성, 난이도, 수업 전 보완할 점 등을 자유롭게 적어주세요…"
              )}
              rows={3}
              className="w-full resize-none rounded-xl border border-line bg-surface-sunk px-3 py-2.5 text-[13px] text-ink placeholder:text-faint focus:border-accent focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-xl bg-verify px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-verify/90"
            >
              {L("Approve", "승인하기")}
            </button>
            <button
              type="button"
              className="rounded-xl bg-accent px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-accent-soft"
            >
              {L("Mark Ready for Dot Pad", "Dot Pad 출력 가능으로 표시")}
            </button>
            <button
              type="button"
              className="rounded-xl border border-line bg-surface px-4 py-2.5 text-[13px] font-semibold text-muted transition-colors hover:bg-surface-sunk"
            >
              {L("Request Revision", "수정 요청")}
            </button>
            <button
              type="button"
              className="rounded-xl border border-line bg-surface px-4 py-2.5 text-[13px] font-semibold text-muted transition-colors hover:bg-surface-sunk"
            >
              {L("Publish to Tactile World", "Tactile World에 배포")}
            </button>
          </div>

          {/* Localization packs */}
          <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
            <h3 className="mb-3 text-[13px] font-semibold text-ink">
              {L("Localization Packs", "언어팩")}
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {pkg.localizationPacks.map((lp) => (
                <div key={lp.locale} className="flex items-center justify-between rounded-lg border border-line bg-surface-sunk px-3 py-2">
                  <span className="text-[12.5px] font-semibold text-ink">{lp.localeName}</span>
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    lp.status === "complete" ? "bg-verify-tint text-verify" :
                    lp.status === "partial"  ? "bg-warn/10 text-warn" :
                    "bg-surface text-faint border border-line"
                  )}>
                    {lp.status === "complete" ? L("Complete", "완료") :
                     lp.status === "partial"  ? L("Partial", "부분 완료") :
                     L("Pending", "준비 중")}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

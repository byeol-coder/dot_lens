"use client";

import { useState } from "react";
import { SAMPLE_AI_ANALYSES } from "@/lib/mockPlatformData";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

interface TeachingGuideProps {
  diagramType?: keyof typeof SAMPLE_AI_ANALYSES;
}

export function TeachingGuide({ diagramType = "water_cycle" }: TeachingGuideProps) {
  const { lang } = useLang();
  const analysis = SAMPLE_AI_ANALYSES[diagramType] ?? SAMPLE_AI_ANALYSES.water_cycle;
  const [lessonUsed, setLessonUsed] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-6">
      {/* AI Summary */}
      <div className="rounded-2xl border border-accent/20 bg-accent-tint p-5">
        <p className="eyebrow">{lang === "ko" ? "AI 수업 분석 요약" : "AI Lesson Analysis"}</p>
        <p className="mt-2 text-[14px] leading-relaxed text-ink">
          {lang === "ko" ? analysis.summary.ko : analysis.summary.en}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lesson Goals + Exploration Order */}
        <section aria-labelledby="exploration-heading" className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <h2 id="exploration-heading" className="text-[15px] font-semibold text-ink">
            {lang === "ko" ? "탐색 순서 가이드" : "Exploration Order"}
          </h2>
          <p className="mt-1 text-[12px] text-muted">
            {lang === "ko" ? "학생이 손으로 탐색할 순서입니다." : "Guide students to explore in this order."}
          </p>
          <div className="mt-3 rounded-xl bg-accent-tint p-3">
            <p className="text-[12px] font-semibold text-accent">
              {lang === "ko" ? "탐색 시작 위치:" : "Start here:"}
            </p>
            <p className="mt-1 text-[13px] text-ink">
              {lang === "ko" ? analysis.explorationStart.ko : analysis.explorationStart.en}
            </p>
          </div>
          <ol className="mt-3 space-y-2">
            {analysis.explorationOrder.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <span className="text-[13px] leading-relaxed text-ink">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Key objects + relationships */}
        <section aria-labelledby="objects-heading" className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <h2 id="objects-heading" className="text-[15px] font-semibold text-ink">
            {lang === "ko" ? "핵심 개념 및 관계" : "Key Concepts & Relationships"}
          </h2>
          <div className="mt-3">
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-muted">
              {lang === "ko" ? "주요 객체" : "Main Objects"}
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {analysis.mainObjects.map((obj) => (
                <li key={obj} className="rounded-full bg-surface-sunk px-3 py-1 text-[12px] font-medium text-ink">
                  {obj}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-muted">
              {lang === "ko" ? "객체 간 관계" : "Relationships"}
            </p>
            <ul className="mt-2 space-y-1.5">
              {analysis.relationships.map((rel, i) => (
                <li key={i} className="flex items-center gap-2 text-[12px] text-muted">
                  <span className="text-accent" aria-hidden>→</span>
                  {rel}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Confusion Points */}
        <section aria-labelledby="confusion-heading" className="rounded-2xl border border-warn/20 bg-pin-soft/30 p-5">
          <h2 id="confusion-heading" className="text-[15px] font-semibold text-ink">
            {lang === "ko" ? "주의할 혼동 요소" : "Potential Confusion Points"}
          </h2>
          <p className="mt-1 text-[12px] text-muted">
            {lang === "ko" ? "학생이 혼동할 수 있는 부분입니다. 미리 설명해 주세요." : "Explain these carefully before students explore."}
          </p>
          <ul className="mt-3 space-y-2">
            {analysis.confusionPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-ink">
                <span className="mt-0.5 text-warn font-bold" aria-hidden>!</span>
                {pt}
              </li>
            ))}
          </ul>
        </section>

        {/* Classroom Questions */}
        <section aria-labelledby="questions-heading" className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <h2 id="questions-heading" className="text-[15px] font-semibold text-ink">
            {lang === "ko" ? "수업 질문 예시" : "Classroom Questions"}
          </h2>
          <p className="mt-1 text-[12px] text-muted">
            {lang === "ko" ? "학생의 이해도를 확인할 수 있는 질문입니다." : "Use these to check understanding."}
          </p>
          <ol className="mt-3 space-y-2">
            {analysis.classroomQuestions.map((q, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px]">
                <span className="font-mono font-semibold text-accent">Q{i + 1}.</span>
                <span className="text-ink">{q}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Dot Pad Layout Preview */}
      <section aria-labelledby="dotpad-preview-heading" className="rounded-2xl border border-line bg-surface p-5 shadow-card">
        <h2 id="dotpad-preview-heading" className="text-[15px] font-semibold text-ink">
          {lang === "ko" ? "Dot Pad 레이아웃 설명" : "Dot Pad Layout Description"}
        </h2>
        <p className="mt-2 rounded-xl bg-surface-sunk p-3 font-mono text-[12px] leading-relaxed text-muted">
          {analysis.dotPadLayout}
        </p>
        <p className="mt-2 text-[12px] text-muted">
          {lang === "ko"
            ? "* Dot Pad 60×40 기준. 실제 출력 시 DotPadEngine을 통해 렌더링됩니다."
            : "* Based on Dot Pad 60×40. Rendered via DotPadEngine on actual device output."}
        </p>
      </section>

      {/* Post-lesson feedback form */}
      {!submitted ? (
        <section aria-labelledby="feedback-heading" className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <h2 id="feedback-heading" className="text-[15px] font-semibold text-ink">
            {lang === "ko" ? "수업 후 기록" : "Post-Lesson Record"}
          </h2>
          <p className="mt-1 text-[12px] text-muted">
            {lang === "ko"
              ? "수업 후 실제 활용 여부와 피드백을 기록해 주세요."
              : "Record whether you used this lesson and how it went."}
          </p>

          <div className="mt-4 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={lessonUsed}
                onChange={(e) => setLessonUsed(e.target.checked)}
                className="h-4 w-4 rounded border-line accent-accent"
              />
              <span className="text-[13px] font-medium text-ink">
                {lang === "ko" ? "이 자료를 실제 수업에 활용했습니다." : "I used this material in class."}
              </span>
            </label>

            <div>
              <label className="block text-[12px] font-semibold text-muted mb-1">
                {lang === "ko" ? "교사 자신감 점수 (1–5)" : "Teacher Confidence Score (1–5)"}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setConfidence(n)}
                    aria-label={`${n} out of 5`}
                    aria-pressed={confidence === n}
                    className={cn(
                      "h-9 w-9 rounded-full border text-[14px] font-semibold transition-colors",
                      confidence === n
                        ? "border-accent bg-accent text-white"
                        : "border-line bg-paper text-muted hover:border-accent hover:text-accent"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="feedback-text" className="block text-[12px] font-semibold text-muted mb-1">
                {lang === "ko" ? "피드백 메모" : "Feedback Notes"}
              </label>
              <textarea
                id="feedback-text"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder={
                  lang === "ko"
                    ? "학생 반응, 어려웠던 점, 개선 사항 등을 자유롭게 적어주세요..."
                    : "Student reactions, difficulties, suggestions for improvement..."
                }
              />
            </div>

            <button
              onClick={() => setSubmitted(true)}
              aria-label={lang === "ko" ? "피드백 저장" : "Save feedback"}
              className="w-full rounded-xl bg-accent py-3 text-[14px] font-semibold text-white shadow-glow transition-colors hover:bg-accent-soft"
            >
              {lang === "ko" ? "피드백 저장" : "Save Feedback"}
            </button>
          </div>
        </section>
      ) : (
        <div className="rounded-2xl border border-verify/20 bg-verify-tint p-5 text-center">
          <p className="text-[15px] font-semibold text-verify">
            {lang === "ko" ? "✓ 피드백이 저장되었습니다." : "✓ Feedback saved."}
          </p>
          <p className="mt-1 text-[12px] text-muted">
            {lang === "ko"
              ? "소중한 피드백 감사합니다. 플랫폼 개선에 반영됩니다."
              : "Thank you. Your feedback helps improve the platform."}
          </p>
        </div>
      )}
    </div>
  );
}

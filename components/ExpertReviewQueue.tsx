"use client";

import { useState } from "react";
import { EXPERT_REVIEW_QUEUE, type ExpertReviewRecord, type ReviewStatus } from "@/lib/mockPlatformData";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const STATUS_CONFIG: Record<ReviewStatus, { label: string; labelKo: string; cls: string }> = {
  pending: { label: "Pending", labelKo: "대기중", cls: "bg-pin-soft text-warn border-pin-soft" },
  approved: { label: "Approved", labelKo: "승인", cls: "bg-verify-tint text-verify border-verify/20" },
  revision_requested: { label: "Revision Needed", labelKo: "수정 요청", cls: "bg-accent-tint text-accent border-accent/20" },
  rejected: { label: "Rejected", labelKo: "반려", cls: "bg-red-50 text-red-600 border-red-200" },
};

function ScoreDots({ score, max = 5 }: { score: number | null; max?: number }) {
  if (score === null) return <span className="text-[12px] text-muted">—</span>;
  return (
    <span className="flex gap-0.5" aria-label={`${score} out of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={cn("h-2.5 w-2.5 rounded-full", i < score ? "bg-accent" : "bg-line")}
          aria-hidden
        />
      ))}
    </span>
  );
}

function ReviewCard({
  record,
  onAction,
}: {
  record: ExpertReviewRecord;
  onAction: (id: string, action: ReviewStatus) => void;
}) {
  const { lang } = useLang();
  const [expanded, setExpanded] = useState(false);
  const [comment, setComment] = useState(record.comments);
  const status = STATUS_CONFIG[record.status];
  const aiPct = Math.round(record.aiConfidence * 100);

  return (
    <article
      className="rounded-2xl border border-line bg-surface shadow-card"
      aria-label={`Review: ${record.lessonTitle}`}
    >
      <div className="p-5">
        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted">
              {record.subject} · {record.diagramType.replace(/_/g, " ")}
            </p>
            <h3 className="mt-1 text-[15px] font-semibold text-ink">{record.lessonTitle}</h3>
            <p className="mt-0.5 text-[12px] text-muted">
              {lang === "ko" ? "교사:" : "Teacher:"} {record.teacherName}
            </p>
          </div>
          <span className={cn("rounded-full border px-3 py-1 text-[11px] font-semibold", status.cls)}>
            {lang === "ko" ? status.labelKo : status.label}
          </span>
        </div>

        {/* Metrics row */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <p className="text-[11px] text-muted">{lang === "ko" ? "AI 신뢰도" : "AI Confidence"}</p>
            <div className="mt-1 flex items-center gap-2">
              <div
                className="h-1.5 w-20 overflow-hidden rounded-full bg-surface-sunk"
                role="img"
                aria-label={`AI confidence: ${aiPct}%`}
              >
                <div
                  className={cn("h-full rounded-full", aiPct >= 85 ? "bg-verify" : aiPct >= 70 ? "bg-pin" : "bg-warn")}
                  style={{ width: `${aiPct}%` }}
                />
              </div>
              <span className="font-mono text-[11px] text-ink">{aiPct}%</span>
            </div>
          </div>
          <div>
            <p className="text-[11px] text-muted">{lang === "ko" ? "명확도" : "Clarity"}</p>
            <div className="mt-1"><ScoreDots score={record.clarityScore} /></div>
          </div>
          <div>
            <p className="text-[11px] text-muted">{lang === "ko" ? "촉각 가독성" : "Tactile Read."}</p>
            <div className="mt-1"><ScoreDots score={record.tactileReadabilityScore} /></div>
          </div>
          <div>
            <p className="text-[11px] text-muted">{lang === "ko" ? "교육 정확도" : "Edu. Accuracy"}</p>
            <div className="mt-1"><ScoreDots score={record.educationalAccuracyScore} /></div>
          </div>
        </div>

        {/* Comments */}
        {record.comments && (
          <div className="mt-4 rounded-xl bg-surface-sunk p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              {lang === "ko" ? "검수 의견" : "Review Notes"}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink">{record.comments}</p>
            {record.expertName && (
              <p className="mt-1.5 text-[11px] text-muted">— {record.expertName}</p>
            )}
          </div>
        )}

        {/* Expand for action panel */}
        {record.status === "pending" && (
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-4 w-full rounded-xl border border-line bg-paper py-2 text-[13px] font-medium text-muted hover:bg-surface-sunk hover:text-ink transition-colors"
          >
            {expanded
              ? lang === "ko" ? "닫기" : "Close review panel"
              : lang === "ko" ? "검수 시작" : "Start Review"}
          </button>
        )}
      </div>

      {/* Inline review panel */}
      {expanded && record.status === "pending" && (
        <div className="border-t border-line bg-surface-sunk/50 p-5 space-y-4">
          <p className="text-[14px] font-semibold text-ink">
            {lang === "ko" ? "검수 의견 작성" : "Write Review"}
          </p>
          <textarea
            aria-label={lang === "ko" ? "검수 코멘트" : "Review comment"}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder={lang === "ko" ? "촉각 인지성, 난이도, 수정 사항 등을 작성해 주세요..." : "Note clarity, complexity, and any required changes..."}
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onAction(record.reviewId, "approved")}
              aria-label={lang === "ko" ? "승인" : "Approve this material"}
              className="rounded-xl bg-verify px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:opacity-90"
            >
              {lang === "ko" ? "✓ 승인" : "✓ Approve"}
            </button>
            <button
              onClick={() => onAction(record.reviewId, "revision_requested")}
              aria-label={lang === "ko" ? "수정 요청" : "Request revision"}
              className="rounded-xl border border-accent bg-accent-tint px-4 py-2 text-[13px] font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
            >
              {lang === "ko" ? "↺ 수정 요청" : "↺ Request Revision"}
            </button>
            <button
              onClick={() => onAction(record.reviewId, "rejected")}
              aria-label={lang === "ko" ? "반려" : "Reject this material"}
              className="rounded-xl border border-line bg-paper px-4 py-2 text-[13px] font-medium text-muted transition-colors hover:bg-surface-sunk hover:text-ink"
            >
              {lang === "ko" ? "✕ 반려" : "✕ Reject"}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export function ExpertReviewQueue() {
  const { lang } = useLang();
  const [filter, setFilter] = useState<ReviewStatus | "all">("all");
  const [queue, setQueue] = useState(EXPERT_REVIEW_QUEUE);

  const filtered = filter === "all" ? queue : queue.filter((r) => r.status === filter);
  const counts = {
    all: queue.length,
    pending: queue.filter((r) => r.status === "pending").length,
    approved: queue.filter((r) => r.status === "approved").length,
    revision_requested: queue.filter((r) => r.status === "revision_requested").length,
    rejected: queue.filter((r) => r.status === "rejected").length,
  };

  function handleAction(reviewId: string, action: ReviewStatus) {
    setQueue((prev) =>
      prev.map((r) =>
        r.reviewId === reviewId
          ? { ...r, status: action, expertName: "You (Demo Expert)", reviewedAt: new Date().toISOString() }
          : r
      )
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div
        role="tablist"
        aria-label={lang === "ko" ? "검수 상태 필터" : "Filter by review status"}
        className="flex flex-wrap gap-2"
      >
        {(["all", "pending", "approved", "revision_requested"] as const).map((s) => (
          <button
            key={s}
            role="tab"
            aria-selected={filter === s}
            onClick={() => setFilter(s)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
              filter === s
                ? "border-accent bg-accent text-white"
                : "border-line bg-surface text-muted hover:text-ink"
            )}
          >
            {s === "all"
              ? lang === "ko" ? `전체 (${counts.all})` : `All (${counts.all})`
              : s === "pending"
              ? lang === "ko" ? `대기 (${counts.pending})` : `Pending (${counts.pending})`
              : s === "approved"
              ? lang === "ko" ? `승인 (${counts.approved})` : `Approved (${counts.approved})`
              : lang === "ko" ? `수정 요청 (${counts.revision_requested})` : `Revision (${counts.revision_requested})`}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-4" role="tabpanel" aria-label={lang === "ko" ? "검수 목록" : "Review items"}>
        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface p-8 text-center text-muted">
            {lang === "ko" ? "해당 상태의 검수 자료가 없습니다." : "No items in this status."}
          </p>
        ) : (
          filtered.map((r) => (
            <ReviewCard key={r.reviewId} record={r} onAction={handleAction} />
          ))
        )}
      </div>
    </div>
  );
}

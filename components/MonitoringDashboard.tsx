"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getEvents,
  subscribeTelemetry,
  computeStats,
  computeScorecard,
  clearEvents,
  logEvent,
  type TelemetryEvent,
  type TelemetryType,
} from "@/lib/telemetry";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const TYPE_LABEL: Record<TelemetryType, { en: string; ko: string }> = {
  lesson_created: { en: "Lessons created", ko: "수업 생성" },
  lesson_published: { en: "Lessons published", ko: "수업 게시" },
  lesson_reviewed: { en: "Reviews completed", ko: "검수 완료" },
  lesson_explored: { en: "Explore sessions", ko: "탐색 세션" },
  quiz_completed: { en: "Quizzes completed", ko: "퀴즈 완료" },
  feedback_submitted: { en: "Feedback received", ko: "피드백 수신" },
  pack_uploaded: { en: "Language packs added", ko: "언어 팩 추가" },
  error: { en: "Errors", ko: "오류" },
};

export function MonitoringDashboard() {
  const { lang } = useLang();
  const L = (en: string, ko: string) => (lang === "ko" ? ko : en);

  const [events, setEvents] = useState<TelemetryEvent[]>([]);

  useEffect(() => {
    setEvents(getEvents());
    return subscribeTelemetry(() => setEvents(getEvents()));
  }, []);

  const stats = useMemo(() => computeStats(events), [events]);
  const scorecard = useMemo(() => computeScorecard(stats), [stats]);
  const recent = useMemo(() => [...events].slice(-12).reverse(), [events]);
  const goalsMet = scorecard.filter((r) => r.met).length;

  function fmt(row: { unit: "count" | "rate"; actual: number; target: number }) {
    return row.unit === "rate"
      ? `${Math.round(row.actual * 100)}% / ${Math.round(row.target * 100)}%`
      : `${row.actual} / ${row.target}`;
  }

  return (
    <div className="space-y-5">
      {/* KPI tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi label={L("Events logged", "기록된 이벤트")} value={stats.total} />
        <Kpi label={L("Active days", "활동 일수")} value={stats.activeDays} />
        <Kpi label={L("Errors", "오류")} value={stats.byType.error} warn={stats.byType.error > 0} />
        <Kpi label={L("Feedback", "피드백")} value={stats.feedbackCount} />
      </div>

      {/* Scorecard */}
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="eyebrow">{L("Success criteria", "성과 기준")}</p>
            <h3 className="mt-1 text-[16px] font-semibold text-ink">
              {L("Are we on track?", "목표 달성 중인가요?")}
              <span className="ml-2 font-mono text-[13px] font-normal text-muted">{goalsMet}/{scorecard.length}</span>
            </h3>
          </div>
        </div>
        <ul className="mt-3 divide-y divide-line">
          {scorecard.map((row) => (
            <li key={row.key} className="flex items-center justify-between gap-3 py-2.5">
              <span className="text-[13.5px] text-ink">{L(row.label.en, row.label.ko)}</span>
              <span className="flex items-center gap-3">
                <span className="font-mono text-[13px] text-muted">{fmt(row)}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase",
                    row.met ? "bg-verify-tint text-verify" : "bg-[#FBF3E2] text-warn"
                  )}
                >
                  {row.met ? L("met", "달성") : L("below", "미달")}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[12px] text-faint">
          {L(
            "Targets are defined in lib/telemetry.ts (SUCCESS_TARGETS) and adjust as the program matures.",
            "목표값은 lib/telemetry.ts(SUCCESS_TARGETS)에 정의되어 있으며 프로그램 성숙도에 따라 조정합니다."
          )}
        </p>
      </div>

      {/* Usage breakdown */}
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
        <p className="eyebrow">{L("Usage by type", "유형별 사용량")}</p>
        <ul className="mt-3 space-y-2">
          {(Object.keys(TYPE_LABEL) as TelemetryType[]).map((t) => {
            const count = stats.byType[t] ?? 0;
            const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
            return (
              <li key={t} className="flex items-center gap-3">
                <span className="w-40 shrink-0 text-[12.5px] text-ink">{L(TYPE_LABEL[t].en, TYPE_LABEL[t].ko)}</span>
                <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-sunk">
                  <span
                    className={cn("block h-full rounded-full", t === "error" ? "bg-warn" : "bg-accent")}
                    style={{ width: `${pct}%` }}
                  />
                </span>
                <span className="w-10 text-right font-mono text-[12px] text-muted">{count}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Recent events + controls */}
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
        <div className="flex items-center justify-between">
          <p className="eyebrow">{L("Recent events", "최근 이벤트")}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => logEvent("error", { where: "monitoring", message: "manual test error" })}
              className="rounded-lg border border-line px-2.5 py-1 text-[12px] font-semibold text-ink hover:bg-surface-sunk"
            >
              {L("Log test error", "테스트 오류 기록")}
            </button>
            <button
              type="button"
              onClick={() => { if (window.confirm(L("Clear all telemetry?", "모든 텔레메트리를 지울까요?"))) clearEvents(); }}
              className="rounded-lg border border-line px-2.5 py-1 text-[12px] font-semibold text-[#B23B2E] hover:bg-[#FBE3DD]"
            >
              {L("Clear", "지우기")}
            </button>
          </div>
        </div>
        {recent.length === 0 ? (
          <p className="mt-3 text-[13px] text-muted">{L("No events yet. Use the builder and explorer to generate activity.", "아직 이벤트가 없습니다. 빌더와 탐색기를 사용하면 기록됩니다.")}</p>
        ) : (
          <ul className="mt-3 space-y-1">
            {recent.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface-sunk px-3 py-1.5 text-[12.5px]">
                <span className="font-mono text-ink">{L(TYPE_LABEL[e.type]?.en ?? e.type, TYPE_LABEL[e.type]?.ko ?? e.type)}</span>
                <span className="font-mono text-[11px] text-faint">{e.at.slice(0, 19).replace("T", " ")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div className={cn("rounded-2xl border bg-surface px-4 py-3 text-center shadow-card", warn ? "border-warn" : "border-line")}>
      <p className={cn("font-mono text-[24px] font-semibold", warn ? "text-warn" : "text-ink")}>{value}</p>
      <p className="mt-0.5 text-[11px] text-muted">{label}</p>
    </div>
  );
}

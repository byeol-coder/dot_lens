"use client";

import { useCallback, useEffect, useState } from "react";
import type { StudentProgress } from "@/types";
import { ScreenCard } from "@/components/ScreenCard";
import { clientApi } from "@/lib/clientApi";
import { StatusBadge, type StatusVariant } from "@/components/StatusBadge";
import { useLang } from "@/lib/i18n";

const ASSIGNMENT_ID = "wc-001";

function fmtTime(sec: number): string {
  if (!sec) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function statusOf(p: StudentProgress, lang: "en" | "ko"): { variant: StatusVariant; label: string } {
  if (!p.opened) return { variant: "draft", label: lang === "ko" ? "미시작" : "not started" };
  if (p.quizTotal && p.quizScore === p.quizTotal)
    return { variant: "verified", label: lang === "ko" ? "완료" : "completed" };
  return { variant: "review", label: lang === "ko" ? "진행 중" : "in progress" };
}

export function DashboardTable() {
  const { lang } = useLang();
  const L = (en: string, ko: string) => lang === "ko" ? ko : en;
  const [rows, setRows] = useState<StudentProgress[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = (await clientApi.getProgress(ASSIGNMENT_ID)) as { progress: StudentProgress[] };
      setRows(data.progress);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load progress");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ScreenCard
      eyebrow={L("Class 5B · Science", "5학년 B반 · 과학")}
      title={L("Water Cycle progress", "물의 순환 학습 현황")}
      action={
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="rounded-xl border border-line bg-surface px-3 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-surface-sunk disabled:opacity-50"
        >
          {loading ? L("Refreshing…", "새로고침 중…") : L("Refresh", "새로고침")}
        </button>
      }
    >
      {error ? (
        <p className="font-mono text-[12px] text-faint">{error}</p>
      ) : !rows ? (
        <p className="text-[13.5px] text-muted">{L("Loading…", "불러오는 중…")}</p>
      ) : rows.length === 0 ? (
        <p className="text-[13.5px] text-muted">{L("No student activity yet.", "학생 활동 기록이 없습니다.")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13.5px]">
            <caption className="sr-only">
              {L("Live student progress for the Water Cycle assignment", "물의 순환 수업 학생별 실시간 학습 현황")}
            </caption>
            <thead>
              <tr className="border-b border-line text-left">
                <th scope="col" className="py-2 pr-4 font-medium text-muted">{L("Student", "학생")}</th>
                <th scope="col" className="py-2 pr-4 font-medium text-muted">{L("Status", "상태")}</th>
                <th scope="col" className="py-2 pr-4 font-medium text-muted">{L("Objects", "탐색 객체")}</th>
                <th scope="col" className="py-2 pr-4 font-medium text-muted">{L("Hints", "힌트")}</th>
                <th scope="col" className="py-2 pr-4 font-medium text-muted">{L("Quiz", "퀴즈")}</th>
                <th scope="col" className="py-2 pr-4 font-medium text-muted">{L("Time", "시간")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const st = statusOf(p, lang);
                return (
                  <tr key={p.studentId} className="border-b border-line/70 align-top">
                    <th scope="row" className="py-3 pr-4 font-medium text-ink">
                      {p.studentName}
                      {p.geminiSummary && (
                        <span className="mt-0.5 block max-w-xs text-[11.5px] font-normal text-muted">
                          {p.geminiSummary[lang] ?? p.geminiSummary.en}
                        </span>
                      )}
                    </th>
                    <td className="py-3 pr-4">
                      <StatusBadge variant={st.variant}>{st.label}</StatusBadge>
                    </td>
                    <td className="py-3 pr-4 font-mono text-ink">
                      {p.objectsExplored}/{p.objectsTotal}
                    </td>
                    <td className="py-3 pr-4 font-mono text-ink">{p.hintsUsed}</td>
                    <td className="py-3 pr-4 font-mono text-ink">
                      {p.quizScore !== undefined ? `${p.quizScore}/${p.quizTotal}` : "—"}
                    </td>
                    <td className="py-3 pr-4 font-mono text-ink">
                      {fmtTime(p.timeOnTaskSec)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </ScreenCard>
  );
}

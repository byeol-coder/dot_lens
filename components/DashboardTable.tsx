"use client";

import { useCallback, useEffect, useState } from "react";
import type { StudentProgress } from "@/types";
import { ScreenCard } from "@/components/ScreenCard";
import { clientApi } from "@/lib/clientApi";
import { StatusBadge, type StatusVariant } from "@/components/StatusBadge";

const ASSIGNMENT_ID = "wc-001";

function fmtTime(sec: number): string {
  if (!sec) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function statusOf(p: StudentProgress): { variant: StatusVariant; label: string } {
  if (!p.opened) return { variant: "draft", label: "not started" };
  if (p.quizTotal && p.quizScore === p.quizTotal)
    return { variant: "verified", label: "completed" };
  return { variant: "review", label: "in progress" };
}

export function DashboardTable() {
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
      eyebrow="Class 5B · Science"
      title="Water Cycle progress"
      action={
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="rounded-xl border border-line bg-surface px-3 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-surface-sunk disabled:opacity-50"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      }
    >
      {error ? (
        <p className="font-mono text-[12px] text-faint">{error}</p>
      ) : !rows ? (
        <p className="text-[13.5px] text-muted">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-[13.5px] text-muted">No student activity yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13.5px]">
            <caption className="sr-only">
              Live student progress for the Water Cycle assignment
            </caption>
            <thead>
              <tr className="border-b border-line text-left">
                <th scope="col" className="py-2 pr-4 font-medium text-muted">Student</th>
                <th scope="col" className="py-2 pr-4 font-medium text-muted">Status</th>
                <th scope="col" className="py-2 pr-4 font-medium text-muted">Objects</th>
                <th scope="col" className="py-2 pr-4 font-medium text-muted">Hints</th>
                <th scope="col" className="py-2 pr-4 font-medium text-muted">Quiz</th>
                <th scope="col" className="py-2 pr-4 font-medium text-muted">Time</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const st = statusOf(p);
                return (
                  <tr key={p.studentId} className="border-b border-line/70 align-top">
                    <th scope="row" className="py-3 pr-4 font-medium text-ink">
                      {p.studentName}
                      {p.geminiSummary && (
                        <span className="mt-0.5 block max-w-xs text-[11.5px] font-normal text-muted">
                          {p.geminiSummary.en}
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

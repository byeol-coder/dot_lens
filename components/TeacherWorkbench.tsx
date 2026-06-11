"use client";

import { useEffect, useState } from "react";
import type { Assignment, VisualAnalysis } from "@/types";
import { ScreenCard } from "@/components/ScreenCard";
import { StatusBadge } from "@/components/StatusBadge";
import { DotLensSidePanel } from "@/components/DotLensSidePanel";
import { cn } from "@/lib/cn";

type ScanState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "done"; analysis: VisualAnalysis }
  | { phase: "error"; message: string };

export function TeacherWorkbench() {
  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scan, setScan] = useState<ScanState>({ phase: "idle" });

  // Fetch the assignment list on mount.
  useEffect(() => {
    let active = true;
    fetch("/api/assignments")
      .then((r) => {
        if (!r.ok) throw new Error(`Request failed (${r.status})`);
        return r.json();
      })
      .then((data: { assignments: Assignment[] }) => {
        if (!active) return;
        setAssignments(data.assignments);
        // Default to the first tactile-ready assignment, else the first one.
        const preferred =
          data.assignments.find((a) => a.tactileReady) ?? data.assignments[0];
        setSelectedId(preferred?.id ?? null);
      })
      .catch((e: Error) => active && setLoadError(e.message));
    return () => {
      active = false;
    };
  }, []);

  const selected =
    assignments?.find((a) => a.id === selectedId) ?? null;

  async function runScan() {
    if (!selected) return;
    const materialId = selected.materials?.[0]?.id ?? selected.source.ref;
    setScan({ phase: "loading" });
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId: selected.id, materialId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? `Scan failed (${res.status})`);
      setScan({ phase: "done", analysis: data.analysis as VisualAnalysis });
    } catch (e) {
      setScan({
        phase: "error",
        message: e instanceof Error ? e.message : "Scan failed",
      });
    }
  }

  // Reset any prior scan result when switching assignment.
  function select(id: string) {
    setSelectedId(id);
    setScan({ phase: "idle" });
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6">
        <p className="text-[14px] text-ink">Couldn&apos;t load assignments.</p>
        <p className="mt-1 font-mono text-[12px] text-faint">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr_300px]">
      {/* Assignment list */}
      <ScreenCard eyebrow="Class 5B" title="Assignments" className="self-start">
        {!assignments ? (
          <p className="text-[13.5px] text-muted">Loading…</p>
        ) : (
          <ul className="space-y-1.5">
            {assignments.map((a) => {
              const active = a.id === selectedId;
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => select(a.id)}
                    aria-pressed={active}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2.5 text-left transition-colors",
                      active
                        ? "border-accent bg-accent-tint"
                        : "border-line hover:bg-surface-sunk"
                    )}
                  >
                    <span className="block text-[13.5px] font-medium text-ink">
                      {a.title.en}
                    </span>
                    <span className="mt-1 inline-block">
                      {a.tactileReady ? (
                        <StatusBadge variant="verified">tactile-ready</StatusBadge>
                      ) : (
                        <StatusBadge variant="draft">not scanned</StatusBadge>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </ScreenCard>

      {/* Selected assignment + scan */}
      <div className="space-y-6">
        <ScreenCard
          eyebrow={selected ? `${selected.subject} · ${selected.gradeLevel}` : "Assignment"}
          title={selected ? selected.title.en : "Select an assignment"}
          action={
            <button
              type="button"
              onClick={runScan}
              disabled={!selected || scan.phase === "loading"}
              className={cn(
                "rounded-xl px-4 py-2.5 text-[14px] font-semibold text-white shadow-card transition-colors",
                "bg-accent hover:bg-accent-soft",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              {scan.phase === "loading" ? "Scanning…" : "Scan with Dot Lens"}
            </button>
          }
        >
          {selected ? (
            <>
              <p className="text-[13.5px] leading-relaxed text-muted">
                {selected.learningObjective?.en}
              </p>
              <p className="mt-1 font-mono text-[12px] text-accent-soft">
                {selected.learningObjective?.ko}
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-[13px] sm:grid-cols-3">
                {selected.materials?.[0] && (
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">Material</dt>
                    <dd className="mt-1 text-ink">{selected.materials[0].name.en}</dd>
                  </div>
                )}
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">Default mode</dt>
                  <dd className="mt-1 capitalize text-ink">{selected.defaultMode}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">Due</dt>
                  <dd className="mt-1 text-ink">{selected.dueDate}</dd>
                </div>
              </dl>
            </>
          ) : (
            <p className="text-[13.5px] text-muted">
              Pick an assignment from the list to begin.
            </p>
          )}

          {/* Live region announces scan status to screen readers */}
          <p className="sr-only" role="status" aria-live="polite">
            {scan.phase === "loading"
              ? "Scanning material with Dot Lens"
              : scan.phase === "done"
              ? "Analysis ready"
              : scan.phase === "error"
              ? `Scan failed: ${scan.message}`
              : ""}
          </p>
        </ScreenCard>

        {/* Analysis result */}
        {scan.phase === "error" && (
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-[14px] text-ink">Scan failed.</p>
            <p className="mt-1 font-mono text-[12px] text-faint">{scan.message}</p>
          </div>
        )}

        {scan.phase === "done" && <AnalysisResult analysis={scan.analysis} />}

        {scan.phase === "idle" && selected && (
          <div className="rounded-2xl border border-dashed border-line bg-surface-sunk p-5 text-[13.5px] text-muted">
            Press <span className="font-medium text-ink">Scan with Dot Lens</span> to
            run Gemini analysis on this material.
          </div>
        )}
      </div>

      {/* Side panel */}
      <DotLensSidePanel className="self-start" />
    </div>
  );
}

function AnalysisResult({ analysis }: { analysis: VisualAnalysis }) {
  return (
    <ScreenCard
      eyebrow="Gemini analysis"
      title="Detected diagram"
      action={
        <StatusBadge variant="review">
          {Math.round(analysis.confidence * 100)}% confidence
        </StatusBadge>
      }
    >
      <p className="text-[14px] leading-relaxed text-ink">
        {analysis.summary?.en}
      </p>

      {/* Detected objects */}
      <section className="mt-5">
        <h3 className="eyebrow">Detected objects</h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {analysis.detectedObjects.map((o) => (
            <li
              key={o.id}
              className="rounded-full border border-line bg-paper px-3 py-1.5 text-[13px] text-ink"
            >
              {o.label.en}
              <span className="ml-2 font-mono text-[10px] uppercase tracking-wide text-faint">
                {o.recommendedModality}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {/* Tactile priority */}
        <section>
          <h3 className="eyebrow">Tactile priority</h3>
          <ol className="mt-2 space-y-1.5">
            {analysis.tactilePriority?.map((p) => (
              <li key={p.aspect} className="flex items-center gap-2.5 text-[13.5px] text-ink">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-pin-soft font-mono text-[11px] text-ink">
                  {p.rank}
                </span>
                {p.label.en}
              </li>
            ))}
          </ol>
        </section>

        {/* Learning steps */}
        <section>
          <h3 className="eyebrow">Learning steps</h3>
          <ol className="mt-2 space-y-1.5">
            {analysis.learningSteps?.map((s) => (
              <li key={s.index} className="flex items-start gap-2.5 text-[13.5px] text-ink">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-accent-tint font-mono text-[11px] text-accent">
                  {s.index}
                </span>
                {s.instruction.en}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </ScreenCard>
  );
}

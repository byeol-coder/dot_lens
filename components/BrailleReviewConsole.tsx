"use client";

import { useEffect, useState } from "react";
import type { BrailleQAIssue, BrailleTranslationJob } from "@/types";
import { ScreenCard } from "@/components/ScreenCard";
import { StatusBadge, type StatusVariant } from "@/components/StatusBadge";
import { BrailleCellsView } from "@/components/BrailleCellsView";
import { clientApi } from "@/lib/clientApi";
import { cn } from "@/lib/cn";

const STATUS_VARIANT: Record<BrailleTranslationJob["status"], StatusVariant> = {
  queued: "draft",
  translating: "draft",
  qa_pending: "pending",
  approved: "verified",
  changes_requested: "review",
};

const SEVERITY_STYLE: Record<BrailleQAIssue["severity"], string> = {
  info: "bg-accent-tint text-accent",
  minor: "bg-[#FBF1DF] text-warn",
  major: "bg-[#FBE3E3] text-[#9b2c2c]",
  blocker: "bg-[#FBE3E3] text-[#9b2c2c]",
};

export function BrailleReviewConsole() {
  const [jobs, setJobs] = useState<BrailleTranslationJob[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reviewer, setReviewer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load(selectFirst = false) {
    try {
      const data = (await clientApi.listBrailleJobs()) as { jobs: BrailleTranslationJob[] };
      setJobs(data.jobs);
      if (selectFirst && data.jobs.length) {
        const pending = data.jobs.find((j) => j.status === "qa_pending");
        setSelectedId((prev) => prev ?? (pending ?? data.jobs[0]).id);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load jobs");
    }
  }

  useEffect(() => {
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected = jobs?.find((j) => j.id === selectedId) ?? null;

  async function review(decision: "approved" | "changes_requested") {
    if (!selected) return;
    setBusy(true);
    try {
      await clientApi.reviewBrailleJob(
        selected.id,
        decision,
        reviewer.trim() || "Reviewer"
      );
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Review failed");
    } finally {
      setBusy(false);
    }
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6">
        <p className="text-[14px] text-ink">Something went wrong.</p>
        <p className="mt-1 font-mono text-[12px] text-faint">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* Queue */}
      <ScreenCard eyebrow="Review queue" title="Braille jobs" className="self-start">
        {!jobs ? (
          <p className="text-[13.5px] text-muted">Loading…</p>
        ) : (
          <ul className="space-y-1.5">
            {jobs.map((j) => {
              const active = j.id === selectedId;
              return (
                <li key={j.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(j.id)}
                    aria-pressed={active}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2.5 text-left transition-colors",
                      active ? "border-accent bg-accent-tint" : "border-line hover:bg-surface-sunk"
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[12px] text-ink">{j.standard}</span>
                      <StatusBadge variant={STATUS_VARIANT[j.status]}>
                        {j.status.replace("_", " ")}
                      </StatusBadge>
                    </span>
                    <span className="mt-1 block truncate text-[13px] text-muted">
                      {j.summary.pages[0]?.text || "(empty)"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </ScreenCard>

      {/* Detail */}
      {selected ? (
        <ScreenCard
          eyebrow={`${selected.standard} · ${selected.language.toUpperCase()}`}
          title="Braille review"
          action={
            <StatusBadge variant={STATUS_VARIANT[selected.status]}>
              {selected.status.replace("_", " ")}
            </StatusBadge>
          }
        >
          <h3 className="eyebrow">Braille summary</h3>
          <BrailleCellsView
            className="mt-2"
            cells={selected.summary.pages.flatMap((p) => p.cells)}
            text={selected.summary.pages.map((p) => p.text).join(" ").trim()}
          />

          <h3 className="eyebrow mt-5">QA issues ({selected.issues.length})</h3>
          {selected.issues.length === 0 ? (
            <p className="mt-2 text-[13.5px] text-muted">No issues found.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {selected.issues.map((issue) => (
                <li
                  key={issue.id}
                  className="rounded-xl border border-line bg-surface px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase",
                        SEVERITY_STYLE[issue.severity]
                      )}
                    >
                      {issue.severity}
                    </span>
                    <span className="font-mono text-[11px] text-faint">{issue.rule}</span>
                    {issue.resolved && (
                      <span className="font-mono text-[11px] text-verify">✓ resolved</span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[13.5px] text-ink">{issue.message.en}</p>
                  {issue.suggestion && (
                    <p className="mt-0.5 text-[12.5px] text-muted">
                      Suggestion: {issue.suggestion.en}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}

          {selected.review && (
            <p className="mt-4 rounded-xl bg-surface-sunk px-4 py-2.5 text-[12.5px] text-muted">
              Last decision: <span className="font-medium text-ink">{selected.review.decision.replace("_", " ")}</span>
              {" · "}
              {selected.review.reviewerName}
              {selected.review.notes ? ` — ${selected.review.notes.en}` : ""}
            </p>
          )}

          {/* Review actions */}
          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
            <label className="sr-only" htmlFor="reviewer">
              Reviewer name
            </label>
            <input
              id="reviewer"
              type="text"
              value={reviewer}
              onChange={(e) => setReviewer(e.target.value)}
              placeholder="Reviewer name"
              className="min-w-[160px] flex-1 rounded-xl border border-line bg-surface px-3 py-2.5 text-[14px] text-ink placeholder:text-faint"
            />
            <button
              type="button"
              onClick={() => review("changes_requested")}
              disabled={busy}
              className="rounded-xl border border-line bg-surface px-4 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:bg-surface-sunk disabled:opacity-50"
            >
              Request changes
            </button>
            <button
              type="button"
              onClick={() => review("approved")}
              disabled={busy}
              className="rounded-xl bg-verify px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:brightness-95 disabled:opacity-50"
            >
              {busy ? "Saving…" : "Approve braille"}
            </button>
          </div>
        </ScreenCard>
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-surface-sunk p-6 text-[14px] text-muted">
          Select a job from the queue to review.
        </div>
      )}
    </div>
  );
}

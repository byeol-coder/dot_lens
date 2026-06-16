"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DotPadKey, DotPadState, StudentProgress } from "@/types";
import {
  applyKey,
  getConnectedState,
  getInitialState,
} from "@/lib/dotpadEngine";
import { OBJECT_COUNT } from "@/lib/tactileMatrix";
import { DotPadScreen } from "@/components/premium/DotPadScreen";
import { PanningKeyControls } from "@/components/PanningKeyControls";
import { cn } from "@/lib/cn";

const STUDENT = { id: "s-self", name: "You (demo)" };
const ASSIGNMENT_ID = "wc-001";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function DotPadSimulator({ className }: { className?: string }) {
  const [state, setState] = useState<DotPadState>(() => getInitialState("en"));
  const [connecting, setConnecting] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const autoSaved = useRef(false);

  const handleKey = useCallback((key: DotPadKey) => {
    setState((s) => (s.connected ? applyKey(s, key, "en") : s));
  }, []);

  // Keyboard fallback: ← → = panning, 1–4 = F1–F4.
  useEffect(() => {
    if (!state.connected) return;
    function onKeyDown(e: KeyboardEvent) {
      const el = document.activeElement;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
      const map: Record<string, DotPadKey> = {
        ArrowLeft: "leftPan",
        ArrowRight: "rightPan",
        "1": "f1",
        "2": "f2",
        "3": "f3",
        "4": "f4",
      };
      const key = map[e.key];
      if (key) {
        e.preventDefault();
        handleKey(key);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state.connected, handleKey]);

  function buildProgress(): StudentProgress {
    const attempted = state.quizState.active || state.quizState.finished;
    return {
      studentId: STUDENT.id,
      studentName: STUDENT.name,
      assignmentId: ASSIGNMENT_ID,
      opened: true,
      modesUsed: attempted ? ["guided", "quiz"] : ["guided"],
      objectsExplored: state.exploredIds.length,
      objectsTotal: OBJECT_COUNT,
      hintsUsed: state.hintsUsed,
      quizScore: attempted ? state.quizState.score : undefined,
      quizTotal: attempted ? state.quizState.total : undefined,
      timeOnTaskSec: startedAt ? Math.round((Date.now() - startedAt) / 1000) : 0,
      lastActivity: new Date().toISOString(),
      geminiSummary: state.quizState.finished
        ? {
            en: `Completed the quiz, ${state.quizState.score}/${state.quizState.total}. Explored ${state.exploredIds.length} of ${OBJECT_COUNT} parts.`,
            ko: `퀴즈 완료, ${state.quizState.score}/${state.quizState.total}점. ${OBJECT_COUNT}개 중 ${state.exploredIds.length}개 탐색.`,
          }
        : undefined,
    };
  }

  const saveSession = useCallback(async (progress: StudentProgress) => {
    setSaveStatus("saving");
    try {
      const r = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(progress),
      });
      if (!r.ok) throw new Error(`Save failed (${r.status})`);
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  }, []);

  // Auto-save once when the quiz finishes.
  useEffect(() => {
    if (state.quizState.finished && !autoSaved.current) {
      autoSaved.current = true;
      saveSession(buildProgress());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.quizState.finished]);

  async function connect() {
    setConnecting(true);
    try {
      await fetch("/api/dotpad/connect", { method: "POST" }).catch(() => null);
      let approved: string | undefined;
      try {
        const r = await fetch("/api/braille/approved/wc-001");
        const d = (await r.json()) as { approvedText: string | null };
        approved = d?.approvedText ?? undefined;
      } catch {
        /* fall back to "pending review" */
      }
      setState({ ...getConnectedState("en"), approvedBrailleSummary: approved });
      setStartedAt(Date.now());
      setSaveStatus("idle");
      autoSaved.current = false;
    } finally {
      setConnecting(false);
    }
  }

  function disconnect() {
    setState({ ...getInitialState("en"), connected: false });
    setStartedAt(null);
    setSaveStatus("idle");
    autoSaved.current = false;
  }

  const connected = state.connected;
  const q = state.quizState;

  return (
    <section
      aria-label="Dot Pad simulator"
      className={cn(
        "overflow-hidden rounded-3xl border border-line bg-surface shadow-lift",
        className
      )}
    >
      {/* Device header */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-sunk px-5 py-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              connected ? "bg-verify shadow-[0_0_10px] shadow-verify" : "bg-faint"
            )}
            aria-hidden
          />
          <div>
            <p className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">
              Dot Pad · 60 × 40
            </p>
            <p className="text-[13px] font-medium text-ink">
              {connected ? "Connected" : "Not connected"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={connected ? disconnect : connect}
          disabled={connecting}
          className={cn(
            "rounded-xl px-4 py-2 text-[13.5px] font-semibold transition-colors disabled:opacity-50",
            connected
              ? "border border-line bg-surface text-ink hover:bg-surface-sunk"
              : "bg-accent text-white hover:bg-accent-soft"
          )}
        >
          {connecting ? "Connecting…" : connected ? "Disconnect" : "Connect Dot Pad"}
        </button>
      </header>

      <div className="grid gap-5 p-5 lg:grid-cols-[1.4fr_1fr]">
        {/* Device surface — the Dot Pad screen */}
        <DotPadScreen
          matrix={state.currentMatrix}
          brailleText={state.currentBrailleText}
          demoLabel={connected ? state.currentObjectName : "water cycle"}
          objectName={state.currentObjectName}
        />

        {/* Readout + tutor + keys + session */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-line bg-paper px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-accent-soft">
                Now exploring
              </p>
              {connected && q.active && (
                <span className="rounded-full bg-pin-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-ink">
                  {q.finished
                    ? `Quiz done · ${q.score}/${q.total}`
                    : `Quiz · Q${q.questionIndex + 1}/${q.total} · ${q.score} ✓`}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xl font-semibold text-ink">
              {connected ? state.currentObjectName : "—"}
            </p>
            <p className="font-mono text-[11px] text-faint">
              {connected
                ? `Object ${state.currentObjectIndex + 1} of ${OBJECT_COUNT}`
                : "Connect to begin"}
            </p>
          </div>

          {/* Gemini tutor — live region */}
          <div className="flex-1 rounded-2xl border border-accent/30 bg-accent-tint/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <span
                className="grid h-6 w-6 place-items-center rounded-lg bg-accent font-mono text-[11px] font-semibold text-white"
                aria-hidden
              >
                G
              </span>
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-accent">
                Gemini tutor
              </p>
            </div>
            <p
              className="mt-2 text-[14px] leading-relaxed text-ink"
              aria-live="polite"
              role="status"
            >
              {state.currentTutorMessage}
            </p>
          </div>

          <PanningKeyControls
            onKey={handleKey}
            lastKey={state.lastKeyPressed}
            disabled={!connected}
          />

          {/* Session + save */}
          {connected && (
            <div className="rounded-2xl border border-line bg-surface px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="eyebrow">Session</p>
                <span className="font-mono text-[11px] text-faint" aria-live="polite">
                  {saveStatus === "saving"
                    ? "saving…"
                    : saveStatus === "saved"
                    ? "saved ✓"
                    : saveStatus === "error"
                    ? "save failed"
                    : ""}
                </span>
              </div>
              <dl className="mt-2 grid grid-cols-3 gap-2 text-center">
                <div>
                  <dd className="font-mono text-[15px] text-ink">
                    {state.exploredIds.length}/{OBJECT_COUNT}
                  </dd>
                  <dt className="text-[10px] text-muted">objects</dt>
                </div>
                <div>
                  <dd className="font-mono text-[15px] text-ink">{state.hintsUsed}</dd>
                  <dt className="text-[10px] text-muted">hints</dt>
                </div>
                <div>
                  <dd className="font-mono text-[15px] text-ink">
                    {q.active || q.finished ? `${q.score}/${q.total}` : "–"}
                  </dd>
                  <dt className="text-[10px] text-muted">quiz</dt>
                </div>
              </dl>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => saveSession(buildProgress())}
                  disabled={saveStatus === "saving"}
                  className="flex-1 rounded-xl bg-accent px-3 py-2 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-soft disabled:opacity-50"
                >
                  Save to dashboard
                </button>
                {saveStatus === "saved" && (
                  <Link
                    href="/dashboard"
                    className="rounded-xl border border-line px-3 py-2 text-[13.5px] font-semibold text-accent hover:bg-accent-tint"
                  >
                    View dashboard
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

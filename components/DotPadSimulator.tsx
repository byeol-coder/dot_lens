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
import { DotPadDeviceBar, useDotPadDevice, useDotPadKeys } from "@/components/DotPadDeviceControl";
import { cn } from "@/lib/cn";
import { clientApi } from "@/lib/clientApi";
import { useLang } from "@/lib/i18n";

const STUDENT = { id: "s-self", name: "You (demo)" };
const ASSIGNMENT_ID = "wc-001";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function DotPadSimulator({ className }: { className?: string }) {
  const { lang } = useLang();
  const L = (en: string, ko: string) => lang === "ko" ? ko : en;
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

  // Physical Dot Pad keys drive the same handler; connecting a device starts the
  // session automatically so its keys + live pin output work right away.
  const device = useDotPadDevice();
  useDotPadKeys(handleKey);
  useEffect(() => {
    if (device.connected && !state.connected) connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device.connected]);

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
      await clientApi.saveProgress(progress);
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
      await clientApi.dotpadConnect().catch(() => null);
      let approved: string | undefined;
      try {
        const d = await clientApi.approvedBraille("wc-001", "en");
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
            <p className="text-[13px] font-medium text-ink" role="status" aria-live="polite">
              {connected
                ? L("Keyboard demo mode is active", "키보드 데모 모드가 실행 중입니다")
                : L("Dot Pad not connected", "Dot Pad가 연결되어 있지 않습니다")}
            </p>
            <p className="text-[11.5px] text-muted">
              {connected
                ? L("Simulates Dot Pad output for presentation and classroom preview.", "발표와 수업 미리보기를 위해 Dot Pad 출력을 시뮬레이션합니다.")
                : L("You can still try the keyboard demo mode — no device needed.", "기기 없이도 키보드 데모 모드로 체험할 수 있습니다.")}
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
          {connecting
            ? L("Starting…", "시작 중…")
            : connected
            ? L("Exit demo", "데모 종료")
            : L("Try without device", "기기 없이 체험하기")}
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
                {L("Now exploring", "지금 탐색 중")}
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
                ? L(`Object ${state.currentObjectIndex + 1} of ${OBJECT_COUNT}`, `${state.currentObjectIndex + 1} / ${OBJECT_COUNT} 탐색`)
                : L("Connect to begin", "연결 후 시작")}
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
                {L("Dot Lens tutor", "닷 렌즈 튜터")}
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

          <DotPadDeviceBar matrix={state.currentMatrix} brailleText={state.currentBrailleText} />

          {/* Session + save */}
          {connected && (
            <div className="rounded-2xl border border-line bg-surface px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="eyebrow">{L("Session", "세션")}</p>
                <span className="font-mono text-[11px] text-faint" aria-live="polite">
                  {saveStatus === "saving"
                    ? L("saving…", "저장 중…")
                    : saveStatus === "saved"
                    ? L("saved ✓", "저장됨 ✓")
                    : saveStatus === "error"
                    ? L("save failed", "저장 실패")
                    : ""}
                </span>
              </div>
              <dl className="mt-2 grid grid-cols-3 gap-2 text-center">
                <div>
                  <dd className="font-mono text-[15px] text-ink">
                    {state.exploredIds.length}/{OBJECT_COUNT}
                  </dd>
                  <dt className="text-[10px] text-muted">{L("objects", "객체")}</dt>
                </div>
                <div>
                  <dd className="font-mono text-[15px] text-ink">{state.hintsUsed}</dd>
                  <dt className="text-[10px] text-muted">{L("hints", "힌트")}</dt>
                </div>
                <div>
                  <dd className="font-mono text-[15px] text-ink">
                    {q.active || q.finished ? `${q.score}/${q.total}` : "–"}
                  </dd>
                  <dt className="text-[10px] text-muted">{L("quiz", "퀴즈")}</dt>
                </div>
              </dl>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => saveSession(buildProgress())}
                  disabled={saveStatus === "saving"}
                  className="flex-1 rounded-xl bg-accent px-3 py-2 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-soft disabled:opacity-50"
                >
                  {L("Save to dashboard", "대시보드에 저장")}
                </button>
                {saveStatus === "saved" && (
                  <Link
                    href="/dashboard"
                    className="rounded-xl border border-line px-3 py-2 text-[13.5px] font-semibold text-accent hover:bg-accent-tint"
                  >
                    {L("View dashboard", "대시보드 보기")}
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

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DotPadKey, DotPadState } from "@/types";
import type { PlayableLesson } from "@/lib/lessonPlayer";
import { playerApplyKey, playerConnected, playerInitial } from "@/lib/lessonPlayer";
import { logEvent } from "@/lib/telemetry";
import { DotPadScreen } from "@/components/premium/DotPadScreen";
import { PanningKeyControls } from "@/components/PanningKeyControls";
import { DotPadDeviceBar } from "@/components/DotPadDeviceControl";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/**
 * Scene-driven Dot Pad simulator for ANY lesson (custom or catalog).
 *
 * Unlike `DotPadSimulator` (hard-wired to the water cycle), this plays whatever
 * `PlayableLesson` it is given through `lessonPlayer`. Used by the builder's
 * live preview and the lesson library's "explore" action, so a teacher's own
 * material is explored with the exact same six-key model.
 */
export function LessonExplorer({
  lesson,
  className,
  autoConnect = false,
}: {
  lesson: PlayableLesson;
  className?: string;
  autoConnect?: boolean;
}) {
  const { lang } = useLang();
  const L = (en: string, ko: string) => (lang === "ko" ? ko : en);

  const [state, setState] = useState<DotPadState>(() =>
    autoConnect ? playerConnected(lesson, lang) : playerInitial(lesson, lang)
  );
  const loggedFinish = useRef(false);

  // Reset when the lesson identity changes (e.g. builder edits, library switch).
  const total = lesson.objects.length;
  useEffect(() => {
    setState(autoConnect ? playerConnected(lesson, lang) : playerInitial(lesson, lang));
    loggedFinish.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, autoConnect]);

  // Log a completed quiz once per session.
  useEffect(() => {
    if (state.quizState.finished && !loggedFinish.current) {
      loggedFinish.current = true;
      logEvent("quiz_completed", {
        lesson: lesson.id,
        score: state.quizState.score,
        total: state.quizState.total,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.quizState.finished]);

  const handleKey = useCallback(
    (key: DotPadKey) => {
      setState((s) => (s.connected ? playerApplyKey(lesson, s, key, lang) : s));
    },
    [lesson, lang]
  );

  // Keyboard fallback: ← → panning, 1–4 = F1–F4.
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

  function connect() {
    setState(playerConnected(lesson, lang));
    loggedFinish.current = false;
    logEvent("lesson_explored", { lesson: lesson.id });
  }
  function disconnect() {
    setState(playerInitial(lesson, lang));
  }

  const connected = state.connected;
  const q = state.quizState;
  const titleText = useMemo(() => (lang === "ko" ? lesson.title.ko || lesson.title.en : lesson.title.en), [lesson, lang]);

  if (total === 0) {
    return (
      <div className={cn("rounded-2xl border border-dashed border-line bg-surface-sunk p-6 text-[13.5px] text-muted", className)}>
        {L("Add at least one object to explore this lesson.", "탐색하려면 객체를 최소 1개 추가하세요.")}
      </div>
    );
  }

  return (
    <section
      aria-label={L("Dot Pad lesson explorer", "Dot Pad 수업 탐색기")}
      className={cn("overflow-hidden rounded-3xl border border-line bg-surface shadow-lift", className)}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-sunk px-5 py-3">
        <div className="flex items-center gap-3">
          <span
            className={cn("h-2.5 w-2.5 rounded-full", connected ? "bg-verify shadow-[0_0_10px] shadow-verify" : "bg-faint")}
            aria-hidden
          />
          <div>
            <p className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">Dot Pad · 60 × 40</p>
            <p className="text-[13px] font-medium text-ink">
              {connected ? L("Connected", "연결됨") : L("Not connected", "미연결")} · {titleText}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={connected ? disconnect : connect}
          className={cn(
            "rounded-xl px-4 py-2 text-[13.5px] font-semibold transition-colors",
            connected
              ? "border border-line bg-surface text-ink hover:bg-surface-sunk"
              : "bg-accent text-white hover:bg-accent-soft"
          )}
        >
          {connected ? L("Disconnect", "연결 해제") : L("Connect Dot Pad", "Dot Pad 연결")}
        </button>
      </header>

      <div className="grid gap-5 p-5 lg:grid-cols-[1.4fr_1fr]">
        <DotPadScreen
          matrix={state.currentMatrix}
          brailleText={state.currentBrailleText}
          demoLabel={connected ? state.currentObjectName : titleText}
          objectName={state.currentObjectName || titleText}
        />

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-line bg-paper px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-accent-soft">
                {L("Now exploring", "지금 탐색 중")}
              </p>
              {connected && q.active && (
                <span className="rounded-full bg-pin-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-ink">
                  {q.finished ? `Quiz · ${q.score}/${q.total}` : `Quiz · Q${q.questionIndex + 1}/${q.total} · ${q.score} ✓`}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xl font-semibold text-ink">{connected ? state.currentObjectName : "—"}</p>
            <p className="font-mono text-[11px] text-faint">
              {connected
                ? L(`Object ${state.currentObjectIndex + 1} of ${total}`, `${state.currentObjectIndex + 1} / ${total} 탐색`)
                : L("Connect to begin", "연결 후 시작")}
            </p>
          </div>

          <div className="flex-1 rounded-2xl border border-accent/30 bg-accent-tint/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-lg bg-accent font-mono text-[11px] font-semibold text-white" aria-hidden>
                G
              </span>
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-accent">
                {L("Dot Lens tutor", "닷 렌즈 튜터")}
              </p>
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-ink" aria-live="polite" role="status">
              {state.currentTutorMessage}
            </p>
          </div>

          <PanningKeyControls onKey={handleKey} lastKey={state.lastKeyPressed} disabled={!connected} />

          <DotPadDeviceBar matrix={state.currentMatrix} brailleText={state.currentBrailleText} />
        </div>
      </div>
    </section>
  );
}

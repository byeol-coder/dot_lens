"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import {
  getDevices,
  subscribeFleet,
  simulateFleet,
  startLessonForAll,
  nextStepForAll,
  resetAllDevices,
  disconnectAll,
  type DotPadDevice,
} from "@/lib/dotpadFleet";
import { SAMPLE_PACKAGES } from "@/lib/tactileLessonPackage";

const CURRENT_LESSON = SAMPLE_PACKAGES[0];

type ButtonLog = { deviceId: string; label: string; key: string; time: string };

function statusColor(s: DotPadDevice["status"]) {
  if (s === "ready")         return "bg-verify text-white";
  if (s === "syncing")       return "bg-accent text-white";
  if (s === "connecting")    return "bg-warn text-white";
  if (s === "demo")          return "bg-purple-500 text-white";
  if (s === "error")         return "bg-red-500 text-white";
  if (s === "not_connected") return "bg-surface-sunk text-muted";
  return "bg-surface-sunk text-muted";
}

function statusLabel(s: DotPadDevice["status"], lang: "ko" | "en") {
  const map: Record<DotPadDevice["status"], [string, string]> = {
    ready:        ["Ready",       "준비됨"],
    connected:    ["Connected",   "연결됨"],
    syncing:      ["Syncing",     "동기화 중"],
    connecting:   ["Connecting",  "연결 중"],
    demo:         ["Demo",        "데모"],
    error:        ["Error",       "오류"],
    not_connected:["Offline",     "오프라인"],
  };
  const [en, ko] = map[s];
  return lang === "ko" ? ko : en;
}

export function ClassroomModeView() {
  const { lang } = useLang();
  const L = useCallback((en: string, ko: string) => (lang === "ko" ? ko : en), [lang]);

  const [devices, setDevices] = useState<DotPadDevice[]>([]);
  const [log, setLog] = useState<ButtonLog[]>([]);
  const [sessionStarted, setSessionStarted] = useState(false);

  useEffect(() => {
    setDevices(getDevices());
    return subscribeFleet(() => setDevices([...getDevices()]));
  }, []);

  const activeDevices = devices.filter((d) => d.status !== "not_connected");
  const currentStep = activeDevices[0]?.currentStep ?? 1;
  const totalSteps  = CURRENT_LESSON.explorationSteps.length;

  const handleStart = () => {
    if (devices.length === 0) simulateFleet(3);
    startLessonForAll();
    setSessionStarted(true);
    addLog("ALL", "Session started");
  };

  const handleNext = () => {
    nextStepForAll();
    addLog("ALL", "→ Next step");
  };

  const handleReset = () => {
    resetAllDevices();
    setSessionStarted(false);
    setLog([]);
  };

  const addLog = (deviceId: string, key: string) => {
    const now = new Date().toLocaleTimeString();
    const d = devices.find((d) => d.id === deviceId);
    setLog((prev) => [
      { deviceId, label: d?.label ?? deviceId, key, time: now },
      ...prev.slice(0, 19),
    ]);
  };

  return (
    <main id="main-content" className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">

      {/* ── Header ── */}
      <header className="space-y-1">
        <p className="eyebrow">{L("Classroom Mode", "교실 모드")}</p>
        <h1 className="text-[28px] font-semibold text-ink sm:text-[34px]">
          {L("Live Classroom Session", "실시간 교실 수업")}
        </h1>
        <p className="text-[14px] text-muted">
          {L(
            "Manage Dot Pads, sync lesson steps, and track every student in real time.",
            "Dot Pad를 관리하고, 수업 단계를 동기화하며, 모든 학생의 진행 상황을 실시간으로 확인합니다."
          )}
        </p>
      </header>

      {/* ── No devices ── */}
      {devices.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center">
          <p className="text-[15px] font-semibold text-ink">
            {L("No Dot Pads connected", "연결된 Dot Pad 없음")}
          </p>
          <p className="mt-2 text-[13px] text-muted">
            {L(
              "Go to Device Management to add devices, or simulate a classroom fleet.",
              "기기 관리에서 기기를 추가하거나 교실용 플릿을 시뮬레이션하세요."
            )}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button onClick={() => { simulateFleet(3); setDevices([...getDevices()]); }} type="button"
              className="rounded-xl bg-accent px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-accent-soft">
              {L("Simulate 3 Dot Pads", "3대 시뮬레이션")}
            </button>
            <Link href="/device-management"
              className="rounded-xl border border-line bg-surface px-5 py-2.5 text-[13px] font-semibold text-muted hover:bg-surface-sunk">
              {L("Device Management →", "기기 관리 →")}
            </Link>
          </div>
        </div>
      )}

      {devices.length > 0 && (
        <>
          {/* ── Session info bar ── */}
          <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
                {L("Current Lesson", "현재 수업")}
              </p>
              <p className="mt-0.5 truncate text-[16px] font-semibold text-ink">
                {lang === "ko" ? CURRENT_LESSON.title.ko : CURRENT_LESSON.title.en}
              </p>
            </div>
            {/* Step indicator */}
            <div className="flex items-center gap-2 rounded-xl bg-surface-sunk px-4 py-2">
              <span className="text-[12px] font-medium text-muted">{L("Step", "단계")}</span>
              <span className="text-[20px] font-bold text-accent">{currentStep}</span>
              <span className="text-[12px] text-muted">/ {totalSteps}</span>
            </div>
            {/* Connected count */}
            <div className="flex items-center gap-1.5 rounded-xl bg-verify-tint/50 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-verify" aria-hidden />
              <span className="text-[13px] font-semibold text-verify">
                {activeDevices.length} {L("devices synced", "대 동기화됨")}
              </span>
            </div>
          </div>

          {/* ── Controls ── */}
          <div className="flex flex-wrap gap-2">
            {!sessionStarted ? (
              <button onClick={handleStart} type="button"
                className="rounded-xl bg-accent px-6 py-2.5 text-[14px] font-semibold text-white hover:bg-accent-soft">
                {L("▶  Start Session", "▶  수업 시작")}
              </button>
            ) : (
              <>
                <button onClick={handleNext} type="button"
                  className="rounded-xl bg-accent px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-accent-soft"
                  disabled={currentStep >= totalSteps}>
                  {L("→ Next Step", "→ 다음 단계")}
                </button>
                <button onClick={startLessonForAll} type="button"
                  className="rounded-xl border border-accent/30 bg-accent-tint px-5 py-2.5 text-[13px] font-semibold text-accent hover:bg-accent hover:text-white">
                  {L("Sync All", "전체 동기화")}
                </button>
              </>
            )}
            <button onClick={handleReset} type="button"
              className="rounded-xl border border-line bg-surface px-4 py-2.5 text-[13px] font-semibold text-muted hover:bg-surface-sunk">
              {L("Reset Session", "세션 초기화")}
            </button>
            <button onClick={disconnectAll} type="button"
              className="rounded-xl border border-line bg-surface px-4 py-2.5 text-[13px] font-semibold text-muted hover:bg-surface-sunk">
              {L("Disconnect All", "전체 연결 해제")}
            </button>
          </div>

          {/* ── Device grid ── */}
          <section aria-label={L("Student Dot Pad status", "학생 Dot Pad 상태")}>
            <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-widest text-muted">
              {L("Student Progress", "학생별 진행 현황")}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {devices.map((d) => {
                const progress = d.currentStep && d.totalSteps
                  ? (d.currentStep / d.totalSteps) * 100
                  : 0;
                const offline = d.status === "not_connected";
                return (
                  <div
                    key={d.id}
                    className={cn(
                      "rounded-xl border p-4 shadow-card",
                      offline ? "border-line opacity-50" : "border-line bg-surface"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[13.5px] font-semibold text-ink">{d.assignedStudent ?? d.label}</p>
                        <p className="text-[11.5px] text-muted">{d.label}</p>
                      </div>
                      <span className={cn("rounded-full px-2.5 py-1 text-[10.5px] font-semibold", statusColor(d.status))}>
                        {statusLabel(d.status, lang)}
                      </span>
                    </div>

                    {/* Progress bar */}
                    {!offline && (
                      <div className="mt-3">
                        <div className="mb-1 flex items-center justify-between text-[11px]">
                          <span className="text-muted">{L("Step", "단계")} {d.currentStep ?? 1}/{d.totalSteps ?? totalSteps}</span>
                          <span className="font-semibold text-accent">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunk">
                          <div
                            className="h-full rounded-full bg-accent transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* F-key buttons for logging */}
                    {!offline && (
                      <div className="mt-3 flex gap-1.5">
                        {["F1", "F2", "F3", "F4"].map((k) => (
                          <button key={k} type="button"
                            onClick={() => addLog(d.id, k)}
                            className="flex-1 rounded-lg border border-line bg-surface-sunk px-1 py-1 text-[10.5px] font-semibold text-muted hover:bg-accent-tint hover:text-accent">
                            {k}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Exploration steps sidebar ── */}
          <section aria-label={L("Lesson exploration steps", "수업 탐색 단계")}>
            <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-widest text-muted">
              {L("Exploration Steps", "탐색 단계")}
            </h2>
            <div className="space-y-2">
              {CURRENT_LESSON.explorationSteps.map((s) => (
                <div
                  key={s.step}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                    s.step === currentStep
                      ? "border-accent bg-accent-tint"
                      : s.step < currentStep
                      ? "border-verify/30 bg-verify-tint/30 opacity-60"
                      : "border-line bg-surface"
                  )}
                >
                  <span className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold",
                    s.step === currentStep ? "bg-accent text-white" :
                    s.step < currentStep   ? "bg-verify text-white" :
                    "bg-surface-sunk text-muted"
                  )}>
                    {s.step < currentStep ? "✓" : s.step}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-ink">
                      {lang === "ko" ? s.instruction.ko : s.instruction.en}
                    </p>
                    <p className="text-[11px] text-muted">{L("Focus", "탐색")}: {s.focusArea} · ⠿ {s.brailleHint}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Button log ── */}
          <section aria-label={L("Button input log", "버튼 입력 로그")}>
            <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-widest text-muted">
              {L("Button Input Log", "버튼 입력 로그")}
            </h2>
            <div className="rounded-xl border border-line bg-surface-sunk p-3 font-mono text-[11.5px]">
              {log.length === 0 ? (
                <p className="text-faint">{L("No inputs recorded yet.", "아직 입력 기록이 없습니다.")}</p>
              ) : (
                <ul className="space-y-1">
                  {log.map((entry, i) => (
                    <li key={i} className="flex items-center gap-2 text-muted">
                      <span className="text-faint">{entry.time}</span>
                      <span className="font-semibold text-ink">{entry.label}</span>
                      <span className="rounded bg-surface px-1.5 py-0.5 text-accent">{entry.key}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

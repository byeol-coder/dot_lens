"use client";

import { useEffect, useState } from "react";
import {
  getDevices,
  subscribeFleet,
  fleetSummary,
  simulateFleet,
  clearFleet,
  reconnectDotPad,
  disconnectDotPad,
  testTactileOutput,
  removeDevice,
  syncLessonToDevice,
  syncLessonToAllDevices,
  startLessonForAll,
  pauseAll,
  nextStepForAll,
  resetAllDevices,
  disconnectAll,
  simulateError,
  hasFleetSdk,
  connectRealDotPad,
  MAX_DEVICES,
  type DotPadDevice,
  type DotPadConnectionStatus,
} from "@/lib/dotpadFleet";
import { useLang } from "@/lib/i18n";
import { useA11y } from "@/components/AccessibilityProvider";
import { cn } from "@/lib/cn";

/* Status meta — text + glyph (never colour alone), for a11y + high contrast. */
const STATUS: Record<DotPadConnectionStatus, { en: string; ko: string; glyph: string; tone: string }> = {
  ready:        { en: "Ready",          ko: "준비됨",        glyph: "✓", tone: "bg-verify-tint text-verify" },
  connected:    { en: "Connected",      ko: "연결됨",        glyph: "●", tone: "bg-accent-tint text-accent" },
  connecting:   { en: "Connecting",     ko: "연결 중",       glyph: "⟳", tone: "bg-accent-tint text-accent" },
  syncing:      { en: "Syncing lesson", ko: "수업 동기화 중", glyph: "⟳", tone: "bg-[#FBF3E2] text-warn" },
  demo:         { en: "Demo mode",      ko: "데모 모드",     glyph: "◐", tone: "bg-pin-soft text-ink" },
  error:        { en: "Error",          ko: "오류",          glyph: "⚠", tone: "bg-[#FBE3DD] text-[#B23B2E]" },
  not_connected:{ en: "Not connected",  ko: "연결 안 됨",    glyph: "○", tone: "bg-surface-sunk text-faint" },
};

function useFleet() {
  const [devices, setDevices] = useState<DotPadDevice[]>(getDevices());
  useEffect(() => subscribeFleet(() => setDevices([...getDevices()])), []);
  return devices;
}

export function DotPadManager() {
  const { lang } = useLang();
  const { announce } = useA11y();
  const L = (en: string, ko: string) => (lang === "ko" ? ko : en);
  const devices = useFleet();
  const sum = fleetSummary();

  function summaryText(): string {
    if (sum.total === 0) return L("No Dot Pads in the fleet yet.", "플릿에 Dot Pad가 아직 없습니다.");
    if (sum.needsAttention === 0 && sum.ready === sum.total)
      return L("All Dot Pads are ready.", "모든 Dot Pad가 준비되었습니다.");
    if (sum.needsAttention > 0)
      return L(
        `${sum.connected} of ${sum.total} Dot Pads connected · some need attention.`,
        `Dot Pad ${sum.total}대 중 ${sum.connected}대 연결됨 · 일부 확인이 필요합니다.`
      );
    return L(`${sum.connected} of ${sum.total} Dot Pads connected.`, `Dot Pad ${sum.total}대 중 ${sum.connected}대 연결됨.`);
  }

  function sim(n: 1 | 3 | 5) {
    simulateFleet(n);
    announce(L(`Simulating ${n} Dot Pad${n > 1 ? "s" : ""}.`, `Dot Pad ${n}대 시뮬레이션.`));
  }

  return (
    <div className="space-y-5">
      {/* Status summary (aria-live) */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 shadow-card">
        <div>
          <p className="eyebrow">{L("Fleet status", "플릿 상태")}</p>
          <p className="mt-1 text-[15px] font-semibold text-ink" role="status" aria-live="polite">
            {summaryText()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label={L("Dot Pad controls", "Dot Pad 제어")}>
          {hasFleetSdk() && (
            <button
              type="button"
              onClick={async () => {
                const ok = await connectRealDotPad();
                announce(ok ? L("Dot Pad connected.", "Dot Pad가 연결되었습니다.") : L("Could not connect a Dot Pad.", "Dot Pad를 연결하지 못했습니다."));
              }}
              disabled={devices.length >= MAX_DEVICES}
              className="rounded-xl bg-accent px-3 py-2 text-[13px] font-semibold text-white hover:bg-accent-soft disabled:opacity-50"
            >
              + {L("Connect real Dot Pad", "실제 Dot Pad 연결")}
            </button>
          )}
          {[1, 3, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => sim(n as 1 | 3 | 5)}
              className="rounded-xl border border-accent bg-surface px-3 py-2 text-[13px] font-semibold text-accent hover:bg-accent-tint"
            >
              {L(`Simulate ${n} Dot Pad${n > 1 ? "s" : ""}`, `Dot Pad ${n}대 시뮬레이션`)}
            </button>
          ))}
        </div>
      </div>

      {devices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface-sunk p-8 text-center">
          <p className="text-[14px] font-medium text-ink">
            {L("No Dot Pads connected", "연결된 Dot Pad가 없습니다")}
          </p>
          <p className="mx-auto mt-1 max-w-md text-[13px] text-muted">
            {L(
              "Connect up to 5 Dot Pads, or simulate a classroom set above to preview multi-device control.",
              "최대 5대의 Dot Pad를 연결하거나, 위에서 교실 세트를 시뮬레이션해 다중 기기 제어를 미리 볼 수 있습니다."
            )}
          </p>
        </div>
      ) : (
        <>
          {/* Global controls */}
          <div className="rounded-2xl border border-line bg-surface p-4 shadow-card">
            <p className="eyebrow">{L("All devices", "전체 제어")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { en: "Sync all Dot Pads", ko: "모든 Dot Pad 동기화", fn: () => { syncLessonToAllDevices("demo-lesson"); announce(L("Lesson synced to all connected Dot Pads.", "연결된 모든 Dot Pad에 수업이 동기화되었습니다.")); } },
                { en: "Start lesson for all", ko: "전체 수업 시작", fn: startLessonForAll },
                { en: "Pause all", ko: "전체 일시정지", fn: pauseAll },
                { en: "Move all to next step", ko: "전체 다음 단계로 이동", fn: nextStepForAll },
                { en: "Reset all devices", ko: "전체 기기 초기화", fn: resetAllDevices },
                { en: "Disconnect all", ko: "전체 연결 해제", fn: disconnectAll },
              ].map((b) => (
                <button
                  key={b.en}
                  type="button"
                  onClick={b.fn}
                  className="rounded-xl border border-line bg-surface px-3 py-2 text-[13px] font-semibold text-ink hover:bg-surface-sunk"
                >
                  {L(b.en, b.ko)}
                </button>
              ))}
            </div>
          </div>

          {/* Device cards */}
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {devices.map((d) => {
              const s = STATUS[d.status];
              const name = `${d.label}${d.assignedStudent ? ` · ${d.assignedStudent}` : ""}`;
              return (
                <li
                  key={d.id}
                  className="flex flex-col rounded-2xl border border-line bg-surface p-4 shadow-card"
                  aria-label={`${name} — ${L(s.en, s.ko)}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[14px] font-semibold text-ink">{d.label}</span>
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold", s.tone)}>
                      <span aria-hidden>{s.glyph}</span> {L(s.en, s.ko)}
                    </span>
                  </div>
                  {d.assignedStudent && (
                    <p className="mt-1 text-[12.5px] text-muted">{d.assignedStudent}</p>
                  )}
                  <p className="mt-2 font-mono text-[11px] text-faint">
                    {d.status === "not_connected"
                      ? L("Waiting", "대기 중")
                      : L(`Step ${d.currentStep ?? 1} of ${d.totalSteps ?? 4}`, `${d.currentStep ?? 1} / ${d.totalSteps ?? 4}단계`)}
                  </p>
                  {d.errorMessage && (
                    <p className="mt-1 text-[12px] text-[#B23B2E]" role="alert">⚠ {d.errorMessage}</p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <DeviceBtn label={L("Send to this Dot Pad", "이 Dot Pad로 보내기")} onClick={() => syncLessonToDevice(d.id, "demo-lesson")} />
                    <DeviceBtn label={L("Test tactile output", "촉각 출력 테스트")} onClick={() => testTactileOutput(d.id)} />
                    <DeviceBtn label={L("Reconnect", "다시 연결")} onClick={() => reconnectDotPad(d.id)} />
                    {d.status !== "not_connected" && (
                      <DeviceBtn label={L("Disconnect", "연결 해제")} onClick={() => disconnectDotPad(d.id)} />
                    )}
                    <DeviceBtn label={L("Simulate error", "오류 시뮬레이션")} onClick={() => simulateError(d.id, L(`${d.label} is not responding.`, `${d.label}이(가) 응답하지 않습니다.`))} />
                    <DeviceBtn label={L("Remove device", "기기 제거")} danger onClick={() => removeDevice(d.id)} />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="flex justify-end">
            <button type="button" onClick={clearFleet} className="text-[12.5px] text-faint hover:text-ink hover:underline">
              {L("Clear fleet", "플릿 비우기")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function DeviceBtn({ label, onClick, danger }: { label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition-colors",
        danger ? "border-line text-[#B23B2E] hover:bg-[#FBE3DD]" : "border-line text-ink hover:bg-surface-sunk"
      )}
    >
      {label}
    </button>
  );
}

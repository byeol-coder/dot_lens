"use client";

import { useState, useEffect, useCallback } from "react";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import {
  getDevices,
  subscribeFleet,
  simulateFleet,
  connectRealDotPad,
  disconnectDotPad,
  reconnectDotPad,
  testTactileOutput,
  removeDevice,
  disconnectAll,
  fleetSummary,
  hasFleetSdk,
  type DotPadDevice,
} from "@/lib/dotpadFleet";

function StatusDot({ status }: { status: DotPadDevice["status"] }) {
  const color =
    status === "ready"       ? "bg-verify" :
    status === "connected"   ? "bg-accent" :
    status === "syncing"     ? "bg-accent animate-pulse" :
    status === "connecting"  ? "bg-warn animate-pulse" :
    status === "demo"        ? "bg-purple-400" :
    status === "error"       ? "bg-red-500" :
    "bg-line";
  return <span className={cn("inline-block h-2 w-2 rounded-full", color)} aria-hidden />;
}

function statusLabel(s: DotPadDevice["status"], lang: "ko" | "en") {
  const map: Record<DotPadDevice["status"], [string, string]> = {
    ready:        ["Ready",      "준비됨"],
    connected:    ["Connected",  "연결됨"],
    syncing:      ["Syncing…",   "동기화 중…"],
    connecting:   ["Connecting…","연결 중…"],
    demo:         ["Demo Mode",  "데모 모드"],
    error:        ["Error",      "오류"],
    not_connected:["Offline",    "오프라인"],
  };
  const [en, ko] = map[s];
  return lang === "ko" ? ko : en;
}

export function DeviceManagementView() {
  const { lang } = useLang();
  const L = useCallback((en: string, ko: string) => (lang === "ko" ? ko : en), [lang]);

  const [devices, setDevices] = useState<DotPadDevice[]>([]);
  const [sdkAvailable] = useState(hasFleetSdk);

  useEffect(() => {
    setDevices(getDevices());
    return subscribeFleet(() => setDevices([...getDevices()]));
  }, []);

  const summary = fleetSummary();

  const handleSimulate = (n: 1 | 3 | 5) => simulateFleet(n);
  const handleConnectReal = async () => { await connectRealDotPad(); };

  return (
    <main id="main-content" className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">

      {/* ── Header ── */}
      <header className="space-y-1">
        <p className="eyebrow">{L("Device Management", "기기 관리")}</p>
        <h1 className="text-[28px] font-semibold text-ink sm:text-[34px]">
          {L("Dot Pad Fleet", "Dot Pad 플릿")}
        </h1>
        <p className="text-[14px] text-muted">
          {L("Connect, monitor, and control up to 5 Dot Pad devices.", "최대 5대의 Dot Pad 기기를 연결하고 모니터링하고 제어합니다.")}
        </p>
      </header>

      {/* ── SDK status banner ── */}
      <div className={cn(
        "flex items-center gap-3 rounded-xl border px-4 py-3 text-[13px] font-medium",
        sdkAvailable
          ? "border-verify/30 bg-verify-tint/40 text-verify"
          : "border-line bg-surface-sunk text-muted"
      )}>
        <span className={cn("h-2 w-2 rounded-full", sdkAvailable ? "bg-verify" : "bg-faint")} aria-hidden />
        {sdkAvailable
          ? L("SDK Connected — real Dot Pad devices can be paired.", "SDK 연결됨 — 실제 Dot Pad 기기를 연결할 수 있습니다.")
          : L("SDK Not Connected — running in simulation mode. Real hardware can be injected via RealDotPadAdapter.", "SDK 미연결 — 시뮬레이션 모드로 실행 중. RealDotPadAdapter를 통해 실 기기를 주입할 수 있습니다.")}
      </div>

      {/* ── Fleet summary stats ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: L("Total Devices", "전체 기기"),   value: summary.total,          color: "text-ink" },
          { label: L("Connected",     "연결됨"),       value: summary.connected,      color: "text-accent" },
          { label: L("Ready",         "준비됨"),       value: summary.ready,          color: "text-verify" },
          { label: L("Needs Attention","주의 필요"),   value: summary.needsAttention, color: "text-warn" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-surface p-4 shadow-card">
            <p className={cn("text-[24px] font-bold", s.color)}>{s.value}</p>
            <p className="mt-0.5 text-[12px] text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Global actions ── */}
      <div className="flex flex-wrap gap-2">
        {sdkAvailable && (
          <button onClick={handleConnectReal} type="button"
            className="rounded-xl bg-accent px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-accent-soft">
            {L("Connect Real Dot Pad", "실 기기 연결")}
          </button>
        )}
        <button onClick={() => handleSimulate(1)} type="button"
          className="rounded-xl border border-line bg-surface px-3 py-2 text-[12.5px] font-semibold text-muted hover:bg-surface-sunk">
          {L("Simulate 1", "1대 시뮬레이션")}
        </button>
        <button onClick={() => handleSimulate(3)} type="button"
          className="rounded-xl border border-line bg-surface px-3 py-2 text-[12.5px] font-semibold text-muted hover:bg-surface-sunk">
          {L("Simulate 3", "3대 시뮬레이션")}
        </button>
        <button onClick={() => handleSimulate(5)} type="button"
          className="rounded-xl border border-line bg-surface px-3 py-2 text-[12.5px] font-semibold text-muted hover:bg-surface-sunk">
          {L("Simulate 5", "5대 시뮬레이션")}
        </button>
        {devices.length > 0 && (
          <button onClick={disconnectAll} type="button"
            className="rounded-xl border border-line bg-surface px-3 py-2 text-[12.5px] font-semibold text-muted hover:bg-surface-sunk">
            {L("Disconnect All", "전체 연결 해제")}
          </button>
        )}
      </div>

      {/* ── Device cards ── */}
      {devices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center">
          <p className="text-[15px] font-semibold text-ink">
            {L("No Dot Pads connected", "연결된 Dot Pad 없음")}
          </p>
          <p className="mt-2 text-[13px] text-muted">
            {L(
              "Connect a real Dot Pad or simulate a fleet for demo.",
              "실 기기를 연결하거나 데모용 플릿을 시뮬레이션하세요."
            )}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button onClick={() => handleSimulate(3)} type="button"
              className="rounded-xl bg-accent px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-accent-soft">
              {L("Simulate 3 Devices", "3대 시뮬레이션")}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {devices.map((d) => (
            <DeviceCard key={d.id} device={d} lang={lang} L={L}
              onReconnect={() => reconnectDotPad(d.id)}
              onDisconnect={() => disconnectDotPad(d.id)}
              onTest={() => testTactileOutput(d.id)}
              onRemove={() => removeDevice(d.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}

interface DeviceCardProps {
  device: DotPadDevice;
  lang: "ko" | "en";
  L: (en: string, ko: string) => string;
  onReconnect: () => void;
  onDisconnect: () => void;
  onTest: () => void;
  onRemove: () => void;
}

function DeviceCard({ device: d, lang, L, onReconnect, onDisconnect, onTest, onRemove }: DeviceCardProps) {
  const isOffline = d.status === "not_connected";
  const isError   = d.status === "error";
  const typeBadge = d.deviceType === "real"
    ? { label: L("Real Device", "실 기기"), cls: "bg-accent/10 text-accent" }
    : { label: L("Simulated", "시뮬레이션"), cls: "bg-surface-sunk text-muted" };

  return (
    <article className={cn(
      "flex flex-col gap-4 rounded-2xl border p-5 shadow-card",
      isError  ? "border-red-300 bg-red-50/40" :
      isOffline ? "border-line bg-surface-sunk/40 opacity-70" :
      "border-line bg-surface"
    )}>
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <StatusDot status={d.status} />
          <span className="text-[14px] font-semibold text-ink">{d.label}</span>
        </div>
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", typeBadge.cls)}>
          {typeBadge.label}
        </span>
      </div>

      {/* Meta grid */}
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
        <div>
          <dt className="text-faint">{L("Student", "학생")}</dt>
          <dd className="font-medium text-ink truncate">{d.assignedStudent ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-faint">{L("Status", "상태")}</dt>
          <dd className={cn("font-semibold", isError ? "text-red-600" : isOffline ? "text-muted" : "text-verify")}>
            {statusLabel(d.status, lang)}
          </dd>
        </div>
        {d.batteryLevel !== undefined && (
          <div>
            <dt className="text-faint">{L("Battery", "배터리")}</dt>
            <dd className="font-medium text-ink">{d.batteryLevel}%</dd>
          </div>
        )}
        {d.firmwareVersion && (
          <div>
            <dt className="text-faint">{L("Firmware", "펌웨어")}</dt>
            <dd className="font-medium text-ink">v{d.firmwareVersion}</dd>
          </div>
        )}
        {d.currentLessonId && (
          <div className="col-span-2">
            <dt className="text-faint">{L("Lesson", "수업")}</dt>
            <dd className="truncate font-medium text-ink">{d.currentLessonId}</dd>
          </div>
        )}
        {d.currentStep !== undefined && (
          <div>
            <dt className="text-faint">{L("Step", "단계")}</dt>
            <dd className="font-medium text-ink">
              {d.currentStep}{d.totalSteps ? `/${d.totalSteps}` : ""}
            </dd>
          </div>
        )}
        {d.lastSyncedAt && (
          <div className="col-span-2">
            <dt className="text-faint">{L("Last Sent", "마지막 전송")}</dt>
            <dd className="font-medium text-ink">{new Date(d.lastSyncedAt).toLocaleTimeString()}</dd>
          </div>
        )}
      </dl>

      {/* Error message */}
      {isError && d.errorMessage && (
        <p className="rounded-lg bg-red-100 px-3 py-2 text-[11.5px] text-red-700">{d.errorMessage}</p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-1.5 pt-1 border-t border-line/60">
        {isOffline || isError ? (
          <button onClick={onReconnect} type="button"
            className="flex-1 rounded-lg bg-accent px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-accent-soft">
            {L("Reconnect", "재연결")}
          </button>
        ) : (
          <>
            <button onClick={onTest} type="button"
              className="rounded-lg border border-line bg-surface px-3 py-1.5 text-[12px] font-medium text-muted hover:bg-surface-sunk">
              {L("Test", "테스트")}
            </button>
            <button onClick={onDisconnect} type="button"
              className="rounded-lg border border-line bg-surface px-3 py-1.5 text-[12px] font-medium text-muted hover:bg-surface-sunk">
              {L("Disconnect", "해제")}
            </button>
          </>
        )}
        <button onClick={onRemove} type="button"
          className="ml-auto rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-faint hover:bg-surface-sunk">
          {L("Remove", "삭제")}
        </button>
      </div>
    </article>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { DotPadKey, TactileGridData } from "@/types";
import {
  hasRealDotPad,
  isDeviceConnected,
  deviceName,
  subscribeDotPad,
  connectDevice,
  disconnectDevice,
  deviceShow,
} from "@/lib/dotpadDevice";
import { logEvent, logError } from "@/lib/telemetry";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/**
 * Maps physical Dot Pad key codes (forwarded by the bridge as a `dotpad:key`
 * event) to the app's six-key model.
 *   ← / →   panning      → previous / next part
 *   F1–F4   function keys → explain / hint / quiz / whole-picture+braille
 */
const KEYMAP: Record<string, DotPadKey> = {
  PanningLeft: "leftPan",
  PanningRight: "rightPan",
  KeyFunction1: "f1",
  KeyFunction2: "f2",
  KeyFunction3: "f3",
  KeyFunction4: "f4",
  PanningAll: "f4", // both panning bars → show the whole picture
  LPF1: "f1",
  RPF4: "f4",
};

/** Subscribe to physical Dot Pad keys and drive the app's key handler. */
export function useDotPadKeys(onKey: (k: DotPadKey) => void) {
  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<{ key?: string }>).detail;
      const mapped = detail?.key ? KEYMAP[detail.key] : undefined;
      if (mapped) onKey(mapped);
    }
    window.addEventListener("dotpad:key", handler as EventListener);
    return () => window.removeEventListener("dotpad:key", handler as EventListener);
  }, [onKey]);
}

/** Reflects device availability + connection, exposing connect/disconnect. */
export function useDotPadDevice() {
  const [available, setAvailable] = useState(false);
  const [connected, setConnected] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const sync = () => {
      setAvailable(hasRealDotPad());
      setConnected(isDeviceConnected());
      setName(deviceName());
    };
    sync();
    return subscribeDotPad(sync);
  }, []);

  async function connect() {
    setBusy(true);
    try {
      const ok = await connectDevice();
      if (ok) logEvent("lesson_explored", { device: deviceName() });
    } catch (e) {
      logError("dotpad.connect", e instanceof Error ? e.message : "connect failed");
    } finally {
      setBusy(false);
    }
  }

  async function disconnect() {
    setBusy(true);
    try {
      await disconnectDevice();
    } finally {
      setBusy(false);
    }
  }

  return { available, connected, name, busy, connect, disconnect };
}

/**
 * Mirrors the current on-screen frame to a connected Dot Pad. Renders nothing
 * unless a device SDK bridge is registered, so the pure-simulator demo is
 * unchanged.
 */
export function DotPadDeviceBar({
  matrix,
  brailleText,
  className,
}: {
  matrix: TactileGridData;
  brailleText: string;
  className?: string;
}) {
  const { lang } = useLang();
  const L = (en: string, ko: string) => (lang === "ko" ? ko : en);
  const { available, connected, name, busy, connect, disconnect } = useDotPadDevice();

  useEffect(() => {
    if (connected) deviceShow(matrix, brailleText, lang);
  }, [matrix, brailleText, connected, lang]);

  if (!available) return null;

  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-2.5",
        connected ? "border-verify/40 bg-verify-tint/40" : "border-line bg-surface-sunk",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", connected ? "bg-verify shadow-[0_0_10px] shadow-verify" : "bg-faint")} aria-hidden />
          <span className="text-[13px] font-medium text-ink">
            {connected
              ? L(`Live on ${name || "Dot Pad"}`, `${name || "Dot Pad"}에 실시간 출력`)
              : L("Physical Dot Pad ready", "실물 Dot Pad 연결 가능")}
          </span>
        </div>
        <button
          type="button"
          onClick={connected ? disconnect : connect}
          disabled={busy}
          className={cn(
            "rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-colors disabled:opacity-50",
            connected ? "border border-line bg-surface text-ink hover:bg-surface-sunk" : "bg-accent text-white hover:bg-accent-soft"
          )}
        >
          {busy ? "…" : connected ? L("Disconnect device", "기기 연결 해제") : L("Connect Dot Pad", "Dot Pad 기기 연결")}
        </button>
      </div>
      {connected && (
        <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted">
          {L(
            "Use the Dot Pad keys: ◀▶ move parts · F1 explain · F2 hint · F3 quiz · F4 whole picture + braille",
            "닷패드 키 사용: ◀▶ 부분 이동 · F1 설명 · F2 힌트 · F3 퀴즈 · F4 전체 그림 + 점자"
          )}
        </p>
      )}
    </div>
  );
}

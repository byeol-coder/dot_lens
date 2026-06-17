"use client";

import { useEffect, useState } from "react";
import type { TactileGridData } from "@/types";
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
        "flex flex-wrap items-center justify-between gap-2 rounded-2xl border px-4 py-2.5",
        connected ? "border-verify/40 bg-verify-tint/40" : "border-line bg-surface-sunk",
        className
      )}
    >
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
  );
}

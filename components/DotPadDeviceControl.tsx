"use client";

import { useEffect, useState } from "react";
import type { TactileGridData } from "@/types";
import {
  getDotPad,
  hasRealDotPad,
  subscribeDotPad,
  deviceShow,
} from "@/lib/dotpadDevice";
import { logEvent, logError } from "@/lib/telemetry";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/** Tracks whether a real Dot Pad SDK binding is registered + its connection. */
export function useDotPadDevice() {
  const [available, setAvailable] = useState(false);
  const [connected, setConnected] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setAvailable(hasRealDotPad());
    return subscribeDotPad(() => setAvailable(hasRealDotPad()));
  }, []);

  async function connect() {
    const b = getDotPad();
    if (!b) return;
    setBusy(true);
    try {
      const r = await b.connect();
      setName(r.name);
      setConnected(true);
      logEvent("lesson_explored", { device: r.name }); // device session started
    } catch (e) {
      logError("dotpad.connect", e instanceof Error ? e.message : "connect failed");
    } finally {
      setBusy(false);
    }
  }

  async function disconnect() {
    const b = getDotPad();
    setBusy(true);
    try {
      await b?.disconnect();
    } catch {
      /* ignore */
    } finally {
      setConnected(false);
      setBusy(false);
    }
  }

  return { available, connected, name, busy, connect, disconnect };
}

/**
 * Device bar — mirrors the current on-screen frame to a real Dot Pad when one is
 * connected. Renders nothing unless a device SDK binding is registered, so the
 * pure-simulator demo is visually unchanged.
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

  // Push every frame to the device while connected.
  useEffect(() => {
    if (connected) deviceShow(matrix, brailleText);
  }, [matrix, brailleText, connected]);

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
          {connected ? L(`Live on ${name || "Dot Pad"}`, `${name || "Dot Pad"}에 실시간 출력`) : L("Physical Dot Pad detected", "실물 Dot Pad 감지됨")}
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
        {busy ? L("…", "…") : connected ? L("Disconnect device", "기기 연결 해제") : L("Connect device", "기기 연결")}
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { TactileGridData } from "@/types";
import { TactileGrid, type PinColor } from "@/components/TactileGrid";
import { BrailleDisplay } from "@/components/BrailleDisplay";
import { cn } from "@/lib/cn";

/**
 * The canonical Dot Pad screen — black device with:
 *  1. Header label auto-synced to demoLabel prop (changes with scene/lesson)
 *  2. Pin colour toggle: white ↔ amber
 *  3. Scan-sweep beam: on/off toggle
 *
 * Used by the live simulator AND the presentation preview so both look
 * identical to the physical device.
 */
export function DotPadScreen({
  matrix,
  brailleText,
  demoLabel,
  objectName,
  className,
  showControls = true,
}: {
  matrix: TactileGridData;
  brailleText: string;
  demoLabel?: string;
  objectName?: string;
  className?: string;
  /** Set false to hide the device controls (e.g. for a compact preview card). */
  showControls?: boolean;
}) {
  const [pinColor, setPinColor] = useState<PinColor>("white");
  const [sweep, setSweep] = useState(false);

  return (
    <div
      className={cn(
        "rounded-2xl bg-black p-4 shadow-glow ring-1 ring-white/10 sm:p-5",
        className
      )}
    >
      {/* ── header row ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 px-1">
        <span className="font-mono text-[11px] uppercase tracking-[0.34em] text-white/55">
          Dot&nbsp;Pad
        </span>

        {/* demo label — auto-synced to whatever scene/lesson is active */}
        <span
          className="truncate font-mono text-[12px] uppercase tracking-[0.2em]"
          aria-live="polite"
        >
          {demoLabel ? (
            <>
              <span className="text-white/35">Demo: </span>
              <span className="text-white/90">{demoLabel}</span>
            </>
          ) : (
            <span className="text-white/25">—</span>
          )}
        </span>

        {/* ── device controls ──────────────────────────────────── */}
        {showControls && (
          <div className="flex items-center gap-1.5 shrink-0">
            {/* pin colour toggle */}
            <button
              type="button"
              onClick={() => setPinColor(c => c === "white" ? "amber" : "white")}
              aria-label={`Pin colour: ${pinColor === "white" ? "switch to amber" : "switch to white"}`}
              title="핀 색상 전환 (흰색 ↔ 앰버)"
              className={cn(
                "h-6 w-6 rounded-md border transition-colors",
                pinColor === "amber"
                  ? "border-[#E0A12E]/60 bg-[#E0A12E]/20"
                  : "border-white/20 bg-white/8 hover:bg-white/14"
              )}
            >
              <span
                className="mx-auto block h-2.5 w-2.5 rounded-full"
                style={{ background: pinColor === "amber" ? "#E0A12E" : "#f3f4f6" }}
                aria-hidden
              />
            </button>

            {/* scan-sweep toggle */}
            <button
              type="button"
              onClick={() => setSweep(s => !s)}
              aria-label={sweep ? "스캔 스윕 끄기" : "스캔 스윕 켜기"}
              title="스캔 스윕 연출"
              className={cn(
                "flex h-6 items-center gap-1 rounded-md border px-1.5 font-mono text-[9px] uppercase tracking-wide transition-colors",
                sweep
                  ? "border-brand-cyan/50 bg-brand-cyan/15 text-brand-cyan"
                  : "border-white/20 bg-white/8 text-white/40 hover:bg-white/14"
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  sweep ? "bg-brand-cyan animate-pulse" : "bg-white/30"
                )}
                aria-hidden
              />
              scan
            </button>
          </div>
        )}
      </div>

      {/* ── framed device area ─────────────────────────────────── */}
      <div className="mt-3 rounded-md border border-white/15 p-3 sm:p-4">
        <TactileGrid
          matrix={matrix}
          objectName={objectName}
          pinColor={pinColor}
          scanSweep={sweep}
        />

        <div className="my-3 h-px w-full bg-white/12" />

        <div className="flex items-center justify-between px-0.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            Text&nbsp;20
          </span>
          <span className="truncate font-mono text-[10px] text-white/30">
            {brailleText}
          </span>
        </div>
        <div className="mt-2">
          <BrailleDisplay text={brailleText} />
        </div>
      </div>
    </div>
  );
}

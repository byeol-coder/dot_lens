"use client";

import type { DotPadKey } from "@/types";
import { cn } from "@/lib/cn";

interface KeyDef {
  key: DotPadKey;
  glyph: string;
  label: string;
  action: string;
  shortcut: string;
  aria: string;
}

const KEYS: KeyDef[] = [
  { key: "leftPan", glyph: "◀", label: "Left", action: "Previous object / step", shortcut: "←", aria: "Left panning. Move to the previous object or step." },
  { key: "rightPan", glyph: "▶", label: "Right", action: "Next object / step", shortcut: "→", aria: "Right panning. Move to the next object or step." },
  { key: "f1", glyph: "F1", label: "Where", action: "Explain current area", shortcut: "1", aria: "F1. Explain the current tactile area." },
  { key: "f2", glyph: "F2", label: "Hint", action: "Give a hint", shortcut: "2", aria: "F2. Give a hint." },
  { key: "f3", glyph: "F3", label: "Quiz", action: "Start quiz / check", shortcut: "3", aria: "F3. Start the quiz or check an answer." },
  { key: "f4", glyph: "F4", label: "Repeat", action: "Braille / full summary", shortcut: "4", aria: "F4. Repeat the approved braille summary or full summary." },
];

export function PanningKeyControls({
  onKey,
  lastKey,
  disabled,
}: {
  onKey: (key: DotPadKey) => void;
  lastKey?: DotPadKey | null;
  disabled?: boolean;
}) {
  function Btn({ def }: { def: KeyDef }) {
    const active = lastKey === def.key;
    return (
      <button
        type="button"
        onClick={() => onKey(def.key)}
        disabled={disabled}
        aria-label={def.aria}
        className={cn(
          "flex min-h-[64px] flex-col items-start justify-center gap-0.5 rounded-2xl border px-4 py-3 text-left transition-all",
          "border-line bg-surface shadow-card hover:border-accent-soft hover:shadow-lift",
          "active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-line disabled:hover:shadow-card",
          active && !disabled && "border-accent bg-accent-tint"
        )}
      >
        <span className="flex w-full items-center justify-between">
          <span className="font-mono text-[13px] font-semibold text-accent">
            {def.glyph}
          </span>
          <kbd className="rounded border border-line bg-surface-sunk px-1.5 py-0.5 font-mono text-[10px] text-faint">
            {def.shortcut}
          </kbd>
        </span>
        <span className="text-[14px] font-semibold text-ink">{def.label}</span>
        <span className="text-[11px] leading-tight text-muted">{def.action}</span>
      </button>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2.5">
        <Btn def={KEYS[0]} />
        <Btn def={KEYS[1]} />
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <Btn def={KEYS[2]} />
        <Btn def={KEYS[3]} />
        <Btn def={KEYS[4]} />
        <Btn def={KEYS[5]} />
      </div>
    </div>
  );
}

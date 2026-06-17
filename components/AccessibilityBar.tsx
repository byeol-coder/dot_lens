"use client";

import { useState } from "react";
import { useA11y, type FontScale } from "@/components/AccessibilityProvider";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const SCALES: FontScale[] = ["sm", "base", "lg", "xl"];
const SCALE_LABEL: Record<FontScale, string> = {
  sm: "A−",
  base: "A",
  lg: "A+",
  xl: "A++",
};

/**
 * Floating accessibility control, available on every screen.
 * Fully keyboard operable; every toggle exposes its on/off state in text
 * (aria-pressed + a visible "On/Off" word) so state is never colour-only.
 */
export function AccessibilityBar() {
  const { lang } = useLang();
  const {
    highContrast,
    setHighContrast,
    fontScale,
    setFontScale,
    reduceMotion,
    setReduceMotion,
    announce,
  } = useA11y();
  const [open, setOpen] = useState(false);

  const tr = (en: string, ko: string) => (lang === "ko" ? ko : en);
  const onOff = (v: boolean) => (v ? tr("On", "켬") : tr("Off", "끔"));

  const stepFont = (dir: 1 | -1) => {
    const i = SCALES.indexOf(fontScale);
    const next = SCALES[Math.min(SCALES.length - 1, Math.max(0, i + dir))];
    setFontScale(next);
    announce(tr(`Text size ${next}`, `글자 크기 ${next}`));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 print:hidden">
      {open && (
        <div
          role="group"
          aria-label={tr("Accessibility controls", "접근성 설정")}
          className="w-64 rounded-2xl border border-line bg-surface p-4 shadow-lift"
        >
          <p className="mb-3 font-display text-[14px] font-semibold text-ink">
            {tr("Accessibility", "접근성")}
          </p>

          {/* High contrast */}
          <div className="flex items-center justify-between py-1.5">
            <span className="text-[13px] text-ink">
              {tr("High contrast", "고대비")}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={highContrast}
              onClick={() => {
                const v = !highContrast;
                setHighContrast(v);
                announce(tr(`High contrast ${onOff(v)}`, `고대비 ${onOff(v)}`));
              }}
              className={cn(
                "inline-flex min-w-[54px] items-center justify-center gap-1 rounded-full border px-2.5 py-1 text-[12px] font-semibold transition-colors",
                highContrast
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-surface-sunk text-muted"
              )}
            >
              {highContrast && <span aria-hidden>✓</span>}
              {onOff(highContrast)}
            </button>
          </div>

          {/* Font size */}
          <div className="flex items-center justify-between py-1.5">
            <span className="text-[13px] text-ink">
              {tr("Text size", "글자 크기")}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => stepFont(-1)}
                disabled={fontScale === "sm"}
                aria-label={tr("Decrease text size", "글자 크기 줄이기")}
                className="grid h-7 w-7 place-items-center rounded-lg border border-line text-[13px] font-semibold text-ink disabled:opacity-40"
              >
                −
              </button>
              <span
                className="min-w-[40px] text-center font-mono text-[12px] text-accent"
                aria-hidden
              >
                {SCALE_LABEL[fontScale]}
              </span>
              <button
                type="button"
                onClick={() => stepFont(1)}
                disabled={fontScale === "xl"}
                aria-label={tr("Increase text size", "글자 크기 키우기")}
                className="grid h-7 w-7 place-items-center rounded-lg border border-line text-[13px] font-semibold text-ink disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>

          {/* Reduce motion */}
          <div className="flex items-center justify-between py-1.5">
            <span className="text-[13px] text-ink">
              {tr("Reduce motion", "모션 줄이기")}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={reduceMotion}
              onClick={() => {
                const v = !reduceMotion;
                setReduceMotion(v);
                announce(tr(`Reduce motion ${onOff(v)}`, `모션 줄이기 ${onOff(v)}`));
              }}
              className={cn(
                "inline-flex min-w-[54px] items-center justify-center gap-1 rounded-full border px-2.5 py-1 text-[12px] font-semibold transition-colors",
                reduceMotion
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-surface-sunk text-muted"
              )}
            >
              {reduceMotion && <span aria-hidden>✓</span>}
              {onOff(reduceMotion)}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={tr("Accessibility settings", "접근성 설정 열기")}
        className="grid h-12 w-12 place-items-center rounded-full bg-accent text-white shadow-glow transition-transform hover:scale-105 focus-visible:outline-accent"
      >
        {/* Universal-access glyph */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="4" r="1.8" fill="currentColor" />
          <path
            d="M4 8h16M12 8v6m0 0l-3 6m3-6l3 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

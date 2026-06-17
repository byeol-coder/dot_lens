"use client";

import { useA11y, type FontScale } from "@/components/AccessibilityProvider";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const SCALES: { key: FontScale; label: string }[] = [
  { key: "sm", label: "A−" },
  { key: "base", label: "A" },
  { key: "lg", label: "A+" },
  { key: "xl", label: "A++" },
];

function ToggleRow({
  label,
  labelKo,
  on,
  onToggle,
}: {
  label: string;
  labelKo: string;
  on: boolean;
  onToggle: () => void;
}) {
  const { lang } = useLang();
  const onOff = on ? (lang === "ko" ? "켬" : "On") : lang === "ko" ? "끔" : "Off";
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <span className="text-[14px] text-ink">{lang === "ko" ? labelKo : label}</span>
        <span className="ml-2 font-mono text-[11px] text-faint">
          {lang === "ko" ? label : labelKo}
        </span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={onToggle}
        className={cn(
          "inline-flex min-w-[60px] items-center justify-center gap-1 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
          on ? "border-accent bg-accent text-white" : "border-line bg-surface-sunk text-muted"
        )}
      >
        {on && <span aria-hidden>✓</span>}
        {onOff}
      </button>
    </div>
  );
}

export function AccessibilitySettings() {
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
  const tr = (en: string, ko: string) => (lang === "ko" ? ko : en);

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
      <p className="font-mono text-[11px] uppercase tracking-eyebrow text-accent">
        {tr("Display & accessibility", "화면·접근성")}
      </p>
      <h2 className="mt-1 text-[17px] font-semibold text-ink">
        {tr("These controls work and are saved", "실제로 작동하며 저장됩니다")}
      </h2>
      <p className="mt-1 text-[13px] text-muted">
        {tr(
          "Settings apply across every screen and persist on this device.",
          "설정은 모든 화면에 적용되며 이 기기에 저장됩니다."
        )}
      </p>

      <div className="mt-4 divide-y divide-line">
        <ToggleRow
          label="High contrast"
          labelKo="고대비"
          on={highContrast}
          onToggle={() => {
            const v = !highContrast;
            setHighContrast(v);
            announce(tr(`High contrast ${v ? "on" : "off"}`, `고대비 ${v ? "켬" : "끔"}`));
          }}
        />

        {/* Font size */}
        <div className="flex items-center justify-between py-3">
          <div>
            <span className="text-[14px] text-ink">{tr("Text size", "글자 크기")}</span>
            <span className="ml-2 font-mono text-[11px] text-faint">
              {tr("글자 크기", "Text size")}
            </span>
          </div>
          <div
            className="flex items-center gap-1"
            role="radiogroup"
            aria-label={tr("Text size", "글자 크기")}
          >
            {SCALES.map((s) => (
              <button
                key={s.key}
                type="button"
                role="radio"
                aria-checked={fontScale === s.key}
                onClick={() => {
                  setFontScale(s.key);
                  announce(tr(`Text size ${s.key}`, `글자 크기 ${s.key}`));
                }}
                className={cn(
                  "min-w-[40px] rounded-lg border px-2 py-1.5 text-[12px] font-semibold transition-colors",
                  fontScale === s.key
                    ? "border-accent bg-accent text-white"
                    : "border-line bg-surface-sunk text-muted"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <ToggleRow
          label="Reduce motion"
          labelKo="모션 줄이기"
          on={reduceMotion}
          onToggle={() => {
            const v = !reduceMotion;
            setReduceMotion(v);
            announce(tr(`Reduce motion ${v ? "on" : "off"}`, `모션 줄이기 ${v ? "켬" : "끔"}`));
          }}
        />
      </div>
    </div>
  );
}

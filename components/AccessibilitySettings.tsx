"use client";

import { useA11y, type FontScale } from "@/components/AccessibilityProvider";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const SCALES: { key: FontScale; label: string }[] = [
  { key: "sm", label: "A−" },
  { key: "base", label: "A" },
  { key: "lg", label: "A+" },
  { key: "xl", label: "A++" },
];

function ToggleRow({
  label,
  on,
  onToggle,
}: {
  label: string;
  on: boolean;
  onToggle: () => void;
}) {
  const { t } = useT();
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-[14px] text-ink">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={onToggle}
        className={cn(
          "inline-flex min-w-[60px] items-center justify-center gap-1 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
          on ? "border-accent bg-accent text-white" : "border-line bg-surface-sunk text-muted"
        )}
      >
        {on && <span aria-hidden>✓</span>}
        {on ? t("settings.on") : t("settings.off")}
      </button>
    </div>
  );
}

export function AccessibilitySettings() {
  const { t } = useT();
  const {
    highContrast,
    setHighContrast,
    fontScale,
    setFontScale,
    reduceMotion,
    setReduceMotion,
    announce,
  } = useA11y();

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
      <p className="font-mono text-[11px] uppercase tracking-eyebrow text-accent">{t("settings.display")}</p>
      <h2 className="mt-1 text-[17px] font-semibold text-ink">
        {t("settings.display")}
      </h2>

      <div className="mt-4 divide-y divide-line">
        <ToggleRow
          label={t("settings.highContrast")}
          on={highContrast}
          onToggle={() => {
            const v = !highContrast;
            setHighContrast(v);
            announce(`${t("settings.highContrast")} ${v ? t("settings.on") : t("settings.off")}`);
          }}
        />

        {/* Font size */}
        <div className="flex items-center justify-between py-3">
          <span className="text-[14px] text-ink">{t("settings.textSize")}</span>
          <div className="flex items-center gap-1" role="radiogroup" aria-label={t("settings.textSize")}>
            {SCALES.map((s) => (
              <button
                key={s.key}
                type="button"
                role="radio"
                aria-checked={fontScale === s.key}
                aria-label={`${t("settings.textSize")} ${s.label}`}
                onClick={() => {
                  setFontScale(s.key);
                  announce(`${t("settings.textSize")} ${s.label}`);
                }}
                className={cn(
                  "min-w-[40px] rounded-lg border px-2 py-1.5 text-[12px] font-semibold transition-colors",
                  fontScale === s.key ? "border-accent bg-accent text-white" : "border-line bg-surface-sunk text-muted"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <ToggleRow
          label={t("settings.reduceMotion")}
          on={reduceMotion}
          onToggle={() => {
            const v = !reduceMotion;
            setReduceMotion(v);
            announce(`${t("settings.reduceMotion")} ${v ? t("settings.on") : t("settings.off")}`);
          }}
        />
      </div>
    </div>
  );
}

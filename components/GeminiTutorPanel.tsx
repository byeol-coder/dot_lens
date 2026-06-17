"use client";

import { cn } from "@/lib/cn";
import { useLang } from "@/lib/i18n";

/** Placeholder for the Dot Lens tutor. Static sample exchange in Phase 0. */
export function GeminiTutorPanel({ className }: { className?: string }) {
  const { lang } = useLang();
  const L = (en: string, ko: string) => lang === "ko" ? ko : en;

  return (
    <div
      aria-label={L("Dot Lens tutor panel (placeholder)", "닷 렌즈 튜터 패널 (예시)")}
      className={cn(
        "rounded-2xl border border-line bg-surface p-4 shadow-card",
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="eyebrow">{L("Dot Lens tutor", "닷 렌즈 튜터")}</p>
        <span className="font-mono text-[11px] text-faint">Phase 2</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2.5">
          <span
            className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-accent-tint font-mono text-[11px] font-semibold text-accent"
            aria-hidden
          >
            DL
          </span>
          <p className="text-[13.5px] leading-relaxed text-ink">
            {L(
              "Feel the dotted lines rising from the ocean. When the sun heats the water, what do you think happens to it?",
              "바다에서 점선이 올라오는 느낌을 느껴보세요. 태양이 물을 데우면 어떻게 될까요?"
            )}
          </p>
        </div>
        <p className="pl-9 text-[12px] italic text-muted">
          {L(
            "Sample guidance · the live tutor connects in a later phase.",
            "예시 안내 · 실시간 튜터는 이후 단계에서 연결됩니다."
          )}
        </p>
      </div>
    </div>
  );
}

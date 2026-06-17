"use client";

import { useLang } from "@/lib/i18n";
import { useA11y } from "@/components/AccessibilityProvider";
import { cn } from "@/lib/cn";

export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  const { announce } = useA11y();

  const choose = (next: "en" | "ko") => {
    setLang(next);
    // Announce in the language being switched TO.
    announce(next === "ko" ? "언어가 한국어로 바뀌었습니다." : "Language switched to English.");
  };

  return (
    <div
      role="group"
      aria-label={lang === "ko" ? "언어 선택" : "Language"}
      className={cn(
        "flex items-center rounded-lg border border-line bg-surface-sunk p-0.5 text-[12px] font-medium",
        className
      )}
    >
      <button
        type="button"
        onClick={() => choose("en")}
        aria-pressed={lang === "en"}
        aria-label={lang === "en" ? "Current language: English" : "Switch to English"}
        className={cn(
          "rounded-md px-2 py-0.5 text-[11px] transition-colors sm:px-2.5 sm:py-1 sm:text-[12px]",
          lang === "en" ? "bg-accent text-white shadow-sm" : "text-muted hover:text-ink"
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => choose("ko")}
        aria-pressed={lang === "ko"}
        aria-label={lang === "ko" ? "현재 언어: 한국어" : "한국어로 전환"}
        className={cn(
          "rounded-md px-2 py-0.5 text-[11px] transition-colors sm:px-2.5 sm:py-1 sm:text-[12px]",
          lang === "ko" ? "bg-accent text-white shadow-sm" : "text-muted hover:text-ink"
        )}
      >
        KR
      </button>
    </div>
  );
}

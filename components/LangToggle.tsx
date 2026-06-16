"use client";

import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div
      role="group"
      aria-label="Language / 언어"
      className={cn("flex items-center rounded-lg border border-line bg-surface-sunk p-0.5 text-[12px] font-medium", className)}
    >
      <button
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={cn(
          "rounded-md px-2.5 py-1 transition-colors",
          lang === "en"
            ? "bg-accent text-white shadow-sm"
            : "text-muted hover:text-ink"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLang("ko")}
        aria-pressed={lang === "ko"}
        className={cn(
          "rounded-md px-2.5 py-1 transition-colors",
          lang === "ko"
            ? "bg-accent text-white shadow-sm"
            : "text-muted hover:text-ink"
        )}
      >
        KR
      </button>
    </div>
  );
}

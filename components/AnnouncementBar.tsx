"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";

/**
 * Apple/Gemini-style announcement strip — sits above the top nav.
 * Dismissible per session. Shows bilingual copy based on active language.
 */
export function AnnouncementBar() {
  const { lang } = useLang();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const copy =
    lang === "ko"
      ? "TIB에서 만든 촉각 자료는 이젠 실시간 교육 시스템에서 활용해보세요."
      : "Tactile materials created with TIB are now ready for live classroom sessions.";

  return (
    <div
      role="banner"
      aria-label={lang === "ko" ? "신규 기능 공지" : "Announcement"}
      className="relative z-50 overflow-hidden bg-[#0f172a] print:hidden"
    >
      {/* Subtle accent glow line */}
      <div className="spectrum-bar absolute bottom-0 left-0 h-[1.5px] w-full opacity-70" aria-hidden />

      <div className="mx-auto flex h-9 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Spacer left — mirrors the close button width so text stays truly centred */}
        <span className="w-5 shrink-0" aria-hidden />

        <p className="min-w-0 flex-1 text-center text-[11.5px] font-medium leading-none tracking-[0.01em] text-white/90 sm:text-[12.5px]">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#60a5fa]" aria-hidden />
          {copy}
          <span className="ml-1.5 opacity-60" aria-hidden>→</span>
        </p>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label={lang === "ko" ? "공지 닫기" : "Dismiss announcement"}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white/80"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

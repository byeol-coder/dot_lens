"use client";

import Link from "next/link";
import { JOURNEY, type JourneyStage } from "@/lib/journey";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const ROLE_LABEL: Record<JourneyStage["role"], { en: string; ko: string }> = {
  teacher: { en: "Teacher", ko: "교사" },
  expert: { en: "Expert", ko: "전문가" },
  activist: { en: "Field activist", ko: "현장 활동가" },
  student: { en: "Student", ko: "학생" },
  all: { en: "Whole program", ko: "프로그램 전체" },
};

/**
 * The operating loop, rendered as the page's structural spine.
 * `variant="full"` shows detail copy (landing); `variant="compact"` is a
 * single scannable strip (dashboard header).
 */
export function JourneyFlow({
  variant = "full",
  activeKey,
}: {
  variant?: "full" | "compact";
  activeKey?: JourneyStage["key"];
}) {
  const { lang } = useLang();

  if (variant === "compact") {
    return (
      <ol
        className="flex flex-wrap items-center gap-x-1.5 gap-y-2"
        aria-label={lang === "ko" ? "운영 흐름 단계" : "Operating loop stages"}
      >
        {JOURNEY.map((s, i) => {
          const active = activeKey === s.key;
          return (
            <li key={s.key} className="flex items-center gap-1.5">
              <Link
                href={s.href}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-medium transition-colors",
                  active
                    ? "border-accent bg-accent-tint text-accent"
                    : "border-line bg-surface text-muted hover:border-accent hover:text-accent"
                )}
              >
                <span className="font-mono text-[10px] text-faint">
                  {String(s.step).padStart(2, "0")}
                </span>
                {s.label[lang]}
              </Link>
              {i < JOURNEY.length - 1 && (
                <span className="text-faint" aria-hidden>
                  →
                </span>
              )}
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <ol
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
      aria-label={lang === "ko" ? "운영 흐름: 제작 → 검수 → 수업 → 개선 → 현지 교사 자립" : "Operating loop: Build, Review, Teach, Improve, Empower local teachers"}
    >
      {JOURNEY.map((s, i) => {
        const active = activeKey === s.key;
        return (
          <li key={s.key} className="relative">
            <Link
              href={s.href}
              aria-current={active ? "step" : undefined}
              className={cn(
                "group flex h-full flex-col rounded-2xl border bg-surface p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift",
                active ? "border-accent ring-1 ring-accent" : "border-line"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] font-semibold text-accent">
                  {String(s.step).padStart(2, "0")}
                </span>
                {i < JOURNEY.length - 1 ? (
                  <span className="text-faint" aria-hidden>
                    →
                  </span>
                ) : (
                  <span
                    className="rounded-full bg-pin-soft px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-eyebrow text-warn"
                    aria-hidden
                  >
                    loops back
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-[15px] font-semibold leading-tight text-ink">
                {s.label[lang]}
              </h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
                {s.action[lang]}
              </p>
              <span className="mt-auto pt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-eyebrow text-faint">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-soft" aria-hidden />
                {ROLE_LABEL[s.role][lang]}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import { DEMO_SCENARIOS } from "@/lib/demoScenarios";
import { cn } from "@/lib/cn";

export function DemoModePanel() {
  const { t } = useT();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-accent/20 bg-accent-tint p-5">
        <p className="text-[13px] leading-relaxed text-ink">{t("demo.banner")}</p>
      </div>

      <h2 className="text-[15px] font-semibold text-ink">{t("demo.pickScenario")}</h2>

      <div className="grid gap-4 lg:grid-cols-3">
        {DEMO_SCENARIOS.map((s) => (
          <article
            key={s.id}
            className="flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-card"
          >
            <span
              className={cn(
                "grid h-11 w-11 place-items-center rounded-xl text-[20px]",
                s.accent === "green"
                  ? "bg-verify-tint text-verify"
                  : s.accent === "blue"
                  ? "bg-accent-tint text-accent"
                  : "bg-pin-soft text-warn"
              )}
              aria-hidden
            >
              {s.icon}
            </span>
            <h3 className="mt-3 text-[15px] font-semibold text-ink">{t(s.titleKey)}</h3>
            {s.audienceKey && (
              <p className="mt-0.5 text-[12px] font-medium text-muted">{t(s.audienceKey)}</p>
            )}
            <ul className="mt-3 space-y-2">
              {s.lineKeys.map((k) => (
                <li key={k} className="flex items-start gap-2 text-[13px] leading-relaxed text-muted">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                  {t(k)}
                </li>
              ))}
            </ul>
            {s.altKey && (
              <p className="mt-3 rounded-xl bg-surface-sunk p-3 text-[12px] leading-relaxed text-muted">
                <span className="font-semibold text-ink">{t("preview.altHeading")}: </span>
                {t(s.altKey)}
              </p>
            )}
            <Link
              href={s.href}
              className="mt-auto pt-4 text-[14px] font-semibold text-accent hover:underline"
            >
              {t(s.ctaKey)} →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

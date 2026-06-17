"use client";

import { useT } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useT();
  return (
    <footer className="mt-8 border-t border-line bg-surface/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-[14px] font-semibold text-ink">
            {t("brand.name")} · {t("brand.subtitle")}
          </p>
          <p className="mt-0.5 text-[12px] text-muted">{t("brand.tagline")}</p>
        </div>
        <div className="flex flex-col gap-1 sm:items-end">
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">
            {t("brand.flow.visual")} → {t("brand.flow.analysis")} → {t("brand.flow.tactile")}
          </p>
          <p className="font-mono text-[10px] text-faint">
            prototype · mock data
          </p>
        </div>
      </div>
    </footer>
  );
}

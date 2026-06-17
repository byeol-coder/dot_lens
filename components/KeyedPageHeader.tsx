"use client";

import { useT, type TKey } from "@/lib/i18n";

/** Page header driven by i18n keys (single source of truth, fully localized). */
export function KeyedPageHeader({
  eyebrowKey,
  titleKey,
  descriptionKey,
}: {
  eyebrowKey: TKey;
  titleKey: TKey;
  descriptionKey: TKey;
}) {
  const { t } = useT();
  return (
    <div className="relative overflow-hidden border-b border-line bg-surface">
      <div className="spectrum-bar absolute inset-x-0 top-0 h-0.5 opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="eyebrow">{t("brand.name")} · {t(eyebrowKey)}</p>
        <h1 className="mt-2.5 text-balance text-3xl font-semibold leading-tight text-ink sm:text-[40px]">
          {t(titleKey)}
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
          {t(descriptionKey)}
        </p>
      </div>
    </div>
  );
}

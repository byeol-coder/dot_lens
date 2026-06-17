"use client";

import { useT } from "@/lib/i18n";

export function DemoPageHeader() {
  const { t } = useT();
  return (
    <div className="mb-8 border-b border-line pb-6">
      <p className="eyebrow">{t("brand.name")} · {t("term.demoMode")}</p>
      <h1 className="mt-2 text-balance text-3xl font-semibold text-ink sm:text-4xl">
        {t("brand.message.see")}
      </h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
        {t("brand.message.help")}
      </p>
    </div>
  );
}

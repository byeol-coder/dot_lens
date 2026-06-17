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
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent-tint px-3 py-1 text-[12.5px] font-medium text-accent" role="note">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
        {t("demo.guided")}
      </p>
    </div>
  );
}

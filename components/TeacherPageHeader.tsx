"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

export function TeacherPageHeader() {
  const { t } = useT();
  const links = [
    { href: "/teaching-guide", icon: "📖", key: "guide.title" as const },
    { href: "/expert-review", icon: "🔍", key: "preview.sendReview" as const },
    { href: "/dashboard", icon: "📊", key: "nav.dashboard" as const },
  ];
  return (
    <div className="border-b border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="eyebrow">{t("brand.name")} · {t("nav.teacher")}</p>
        <h1 className="mt-2 text-balance text-3xl font-semibold text-ink sm:text-4xl">
          {t("create.title")}
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
          {t("subtitle.teacher")}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-xl border border-line bg-paper px-4 py-2 text-[13px] font-medium text-muted transition-colors hover:bg-surface-sunk hover:text-ink"
            >
              {l.icon} {t(l.key)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

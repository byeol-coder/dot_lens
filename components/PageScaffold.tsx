"use client";

import { useLang } from "@/lib/i18n";

/**
 * Localized page header. Pass bilingual props; the header shows the active
 * language as the main heading (no stacked KR/EN). `*Ko` props are optional —
 * they fall back to the English copy if omitted.
 */
export function PageHeader({
  eyebrow,
  eyebrowKo,
  title,
  titleKo,
  description,
  descriptionKo,
}: {
  eyebrow: string;
  eyebrowKo?: string;
  title: string;
  titleKo?: string;
  description: string;
  descriptionKo?: string;
  /** Deprecated; accepted for backward compatibility, no longer rendered. */
  phase?: number;
}) {
  const { lang } = useLang();
  const pick = (en: string, ko?: string) => (lang === "ko" && ko ? ko : en);
  return (
    <div className="relative overflow-hidden border-b border-line bg-surface">
      <div className="spectrum-bar absolute inset-x-0 top-0 h-0.5 opacity-60" aria-hidden />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-60" aria-hidden>
        <div className="absolute right-[-10%] top-[-40%] h-72 w-72 rounded-full bg-brand-blue/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="eyebrow">{pick(eyebrow, eyebrowKo)}</p>
        <h1 className="mt-2.5 text-balance text-3xl font-semibold leading-tight text-ink sm:text-[40px]">
          {pick(title, titleKo)}
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
          {pick(description, descriptionKo)}
        </p>
      </div>
    </div>
  );
}

export function ComingNext({ points, pointsKo }: { points: string[]; pointsKo?: string[] }) {
  const { lang } = useLang();
  const list = lang === "ko" && pointsKo ? pointsKo : points;
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface-sunk p-6">
      <p className="eyebrow">{lang === "ko" ? "다음 단계" : "Coming next"}</p>
      <ul className="mt-3 space-y-2">
        {list.map((p) => (
          <li key={p} className="flex items-start gap-2.5 text-[14px] text-ink">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pin" aria-hidden />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

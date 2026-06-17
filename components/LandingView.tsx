"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/* The Dot Lens "lens" flow: a visual material, read through the lens, becomes
   a tactile lesson. This is the brand metaphor made concrete on the landing. */
function LensFlow() {
  const { t } = useT();
  const steps = [
    { key: "brand.flow.visual" as const, icon: "🖼", tone: "muted" },
    { key: "brand.flow.analysis" as const, icon: "◎", tone: "accent" },
    { key: "brand.flow.tactile" as const, icon: "⠿", tone: "verify" },
  ];
  return (
    <div
      className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-3 shadow-card"
      aria-label={t("landing.flowHint")}
    >
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          <div className="flex min-w-[92px] flex-col items-center gap-1 rounded-xl bg-surface-sunk px-3 py-3 text-center">
            <span
              className={cn(
                "grid h-8 w-8 place-items-center rounded-full text-[15px]",
                s.tone === "accent"
                  ? "bg-accent text-white"
                  : s.tone === "verify"
                  ? "bg-verify-tint text-verify"
                  : "bg-surface text-muted"
              )}
              aria-hidden
            >
              {s.icon}
            </span>
            <span className="text-[12px] font-semibold leading-tight text-ink">
              {t(s.key)}
            </span>
          </div>
          {i < steps.length - 1 && (
            <span className="text-[16px] text-accent" aria-hidden>
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

const ROLES = [
  {
    href: "/teacher",
    stage: "01",
    en: { label: "Teacher", desc: "Upload material and generate a tactile graphic with a teaching guide." },
    ko: { label: "교사", desc: "자료를 업로드하면 촉각 그래픽과 수업 가이드가 만들어집니다." },
  },
  {
    href: "/expert-review",
    stage: "02",
    en: { label: "Expert", desc: "Review materials for clarity and tactile readability, then approve." },
    ko: { label: "전문가", desc: "선명도와 촉각 인지성을 검토하고 승인합니다." },
  },
  {
    href: "/field-data",
    stage: "03",
    en: { label: "Field Activist", desc: "See how lessons are used across schools and regions." },
    ko: { label: "현장 활동가", desc: "학교·지역별로 수업이 어떻게 활용되는지 살펴봅니다." },
  },
  {
    href: "/student",
    stage: "04",
    en: { label: "Student", desc: "Explore tactile material with audio guidance, at the same lesson as the class." },
    ko: { label: "학생", desc: "반 전체와 같은 수업을 음성 안내와 함께 촉각으로 탐색합니다." },
  },
] as const;

const WHY_POINTS = [
  { titleKey: "why.point.see.title", bodyKey: "why.point.see.body", icon: "◎" },
  { titleKey: "why.point.touch.title", bodyKey: "why.point.touch.body", icon: "⠿" },
  { titleKey: "why.point.together.title", bodyKey: "why.point.together.body", icon: "♥" },
] as const;

export function LandingView() {
  const { t, lang } = useT();

  return (
    <>
      {/* Hero — the lens brand */}
      <section className="relative overflow-hidden border-b border-line bg-surface">
        <div className="pin-texture absolute inset-0 opacity-[0.5]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="eyebrow">{t("brand.subtitle")}</p>
          <h1 className="mt-3 max-w-3xl text-balance text-4xl font-semibold leading-[1.12] text-ink sm:text-[44px]">
            {t("landing.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted">
            {t("landing.description")}
          </p>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-muted">
            {t("landing.supporting")}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/teacher"
              className="rounded-xl bg-accent px-5 py-3 text-[15px] font-semibold text-white shadow-glow transition-colors hover:bg-accent-soft"
            >
              {t("landing.primaryCta")} →
            </Link>
            <Link
              href="/demo"
              className="rounded-xl border border-accent bg-surface px-5 py-3 text-[15px] font-semibold text-accent transition-colors hover:bg-accent-tint"
            >
              {t("landing.secondaryCta")}
            </Link>
          </div>

          <div className="mt-9 max-w-xl">
            <LensFlow />
          </div>
        </div>
      </section>

      {/* Why Dot Lens */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="why-heading">
        <h2 id="why-heading" className="text-balance text-2xl font-semibold text-ink sm:text-3xl">
          {t("why.title")}
        </h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted">
          {t("why.description")}
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {WHY_POINTS.map((p) => (
            <div key={p.titleKey} className="rounded-2xl border border-line bg-surface p-5 shadow-card">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-tint text-[18px] text-accent" aria-hidden>
                {p.icon}
              </span>
              <h3 className="mt-3 text-[15px] font-semibold text-ink">{t(p.titleKey)}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{t(p.bodyKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Four roles */}
      <section className="border-y border-line bg-surface/60">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6" aria-labelledby="roles-heading">
          <h2 id="roles-heading" className="text-2xl font-semibold text-ink">
            {lang === "ko" ? "한 플랫폼, 네 가지 역할" : "One platform, four roles"}
          </h2>
          <p className="mt-2 text-[14px] text-muted">
            {lang === "ko"
              ? "교사·전문가·현장 활동가·학생이 각자의 모드로 같은 수업을 함께 만듭니다."
              : "Teachers, experts, field activists, and students each work in their own mode on the same lesson."}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROLES.map((role) => {
              const c = role[lang];
              return (
                <Link
                  key={role.href}
                  href={role.href}
                  className="group flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-accent"
                  aria-label={`${c.label} — ${c.desc}`}
                >
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-eyebrow text-accent">
                    {role.stage}
                  </span>
                  <h3 className="mt-2 text-[15px] font-semibold text-ink">{c.label}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">{c.desc}</p>
                  <span className="mt-auto pt-4 text-[13px] font-semibold text-accent group-hover:underline">
                    {lang === "ko" ? "열기 →" : "Open →"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demo invite */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-8 shadow-card sm:p-10">
          <div className="spectrum-bar absolute inset-x-0 top-0 h-1 opacity-70" aria-hidden />
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow">{t("term.demoMode")}</p>
              <h2 className="mt-2 text-balance text-[26px] font-semibold leading-tight text-ink">
                {t("brand.message.help")}
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                {lang === "ko"
                  ? "실시간 연결 없이도 샘플 수업으로 전체 흐름을 끊김 없이 둘러볼 수 있습니다."
                  : "Walk through the whole flow on sample lessons — no live connection required."}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/demo"
                className="rounded-xl bg-accent px-5 py-3 text-center text-[15px] font-semibold text-white shadow-glow transition-colors hover:bg-accent-soft"
              >
                {t("landing.secondaryCta")} →
              </Link>
              <Link
                href="/dashboard"
                className="rounded-xl border border-line bg-surface px-5 py-3 text-center text-[15px] font-semibold text-ink transition-colors hover:bg-surface-sunk"
              >
                {t("nav.dashboard")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { getDevices, subscribeFleet, fleetSummary } from "@/lib/dotpadFleet";
import { SAMPLE_PACKAGES, REVIEW_STATUS_META } from "@/lib/tactileLessonPackage";
import { VoiceSearchHero } from "@/components/VoiceSearchHero";

/* ── 4 platform CTAs ── */
const CTAS = [
  {
    id: "create",
    href: "/studio",
    icon: "⬆",
    accentBg: "bg-accent",
    accentText: "text-accent",
    accentTint: "bg-accent-tint",
    en: {
      title: "Create a tactile lesson",
      desc: "Upload a diagram, PDF, or worksheet and turn it into tactile, braille, and audio-guided material.",
      cta: "Open Studio →",
    },
    ko: {
      title: "촉각 수업 만들기",
      desc: "다이어그램·PDF·학습지를 업로드하면 촉각 그래픽, 점자, 음성 안내가 포함된 수업 자료가 만들어집니다.",
      cta: "스튜디오 열기 →",
    },
  },
  {
    id: "review",
    href: "/review-console",
    icon: "✓",
    accentBg: "bg-verify",
    accentText: "text-verify",
    accentTint: "bg-verify-tint",
    en: {
      title: "Review for classroom use",
      desc: "Check tactile readability, braille labels, audio guidance, and educational accuracy before using it with students.",
      cta: "Open Review Console →",
    },
    ko: {
      title: "수업 전 전문가 검토",
      desc: "학생에게 배포하기 전 촉각 인지성·점자 라벨·음성 안내·교육 정확성을 점검하세요.",
      cta: "검수 콘솔 열기 →",
    },
  },
  {
    id: "send",
    href: "/device-management",
    icon: "◉",
    accentBg: "bg-blue-600",
    accentText: "text-blue-600",
    accentTint: "bg-blue-50",
    en: {
      title: "Send to Dot Pad",
      desc: "Output the approved tactile frame to one or multiple Dot Pad devices.",
      cta: "Manage Devices →",
    },
    ko: {
      title: "Dot Pad로 출력",
      desc: "승인된 촉각 프레임을 1대 또는 여러 대의 Dot Pad로 전송합니다.",
      cta: "기기 관리 →",
    },
  },
  {
    id: "run",
    href: "/classroom",
    icon: "▶",
    accentBg: "bg-purple-600",
    accentText: "text-purple-600",
    accentTint: "bg-purple-50",
    en: {
      title: "Run classroom session",
      desc: "Sync Dot Pads, guide students through exploration steps, and monitor learning progress.",
      cta: "Enter Classroom Mode →",
    },
    ko: {
      title: "교실 수업 실행",
      desc: "Dot Pad를 동기화하고 학생을 단계별로 안내하며 학습 진행 상황을 모니터링합니다.",
      cta: "교실 모드 →",
    },
  },
] as const;

export function LandingView() {
  const { lang } = useLang();
  const L = useCallback((en: string, ko: string) => (lang === "ko" ? ko : en), [lang]);

  const [devSummary, setDevSummary] = useState(fleetSummary());
  useEffect(() => {
    setDevSummary(fleetSummary());
    return subscribeFleet(() => setDevSummary(fleetSummary()));
  }, []);

  const pendingReview = SAMPLE_PACKAGES.filter((p) =>
    p.reviewStatus === "ai_generated" || p.reviewStatus === "needs_review"
  ).length;
  const readyForDotPad = SAMPLE_PACKAGES.filter((p) =>
    p.reviewStatus === "approved" || p.reviewStatus === "ready_for_dot_pad"
  ).length;

  return (
    <div className="flex flex-col">

      {/* ── Platform Hero ── */}
      <section className="relative overflow-hidden border-b border-line bg-surface">
        <div className="pin-texture absolute inset-0 opacity-30" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
          <p className="eyebrow">
            {L("Dot Pad Classroom Operating Platform", "Dot Pad 교실 운영 플랫폼")}
          </p>
          <h1 className="mt-3 max-w-3xl text-balance text-[26px] font-semibold leading-tight text-ink sm:text-[36px] lg:text-[44px]">
            {L(
              "From visual material to tactile classroom — end to end.",
              "시각 자료에서 촉각 수업까지 — 모든 단계가 하나의 플랫폼에."
            )}
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted">
            {L(
              "Create tactile lessons with AI, get them expert-reviewed, output to Dot Pad devices, and run live classroom sessions — all in one place.",
              "AI로 촉각 수업을 제작하고, 전문가 검수를 받고, Dot Pad로 출력하고, 교실 수업을 실행하세요 — 모두 하나의 플랫폼에서."
            )}
          </p>

          {/* Quick status strip */}
          <div className="mt-8 flex flex-wrap gap-3">
            <div className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-2 text-[13px] font-semibold",
              devSummary.connected > 0
                ? "border-verify/30 bg-verify-tint/50 text-verify"
                : "border-line bg-surface-sunk text-muted"
            )}>
              <span className={cn("h-2 w-2 rounded-full", devSummary.connected > 0 ? "bg-verify" : "bg-line")} aria-hidden />
              {devSummary.connected > 0
                ? `${devSummary.connected} ${L("devices online", "대 기기 온라인")}`
                : L("No devices connected", "연결된 기기 없음")}
            </div>
            {pendingReview > 0 && (
              <div className="flex items-center gap-2 rounded-xl border border-warn/30 bg-warn/10 px-4 py-2 text-[13px] font-semibold text-warn">
                <span className="h-2 w-2 rounded-full bg-warn" aria-hidden />
                {pendingReview} {L("lessons pending review", "개 수업 자료 검수 대기")}
              </div>
            )}
            {readyForDotPad > 0 && (
              <div className="flex items-center gap-2 rounded-xl border border-accent/30 bg-accent-tint px-4 py-2 text-[13px] font-semibold text-accent">
                <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
                {readyForDotPad} {L("lessons ready for Dot Pad", "개 수업 자료 Dot Pad 출력 가능")}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 4 Platform CTAs ── */}
      <section
        className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6"
        aria-label={L("Platform actions", "플랫폼 주요 기능")}
      >
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-widest text-muted">
          {L("Core Workflows", "핵심 워크플로우")}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CTAS.map((cta, i) => {
            const copy = lang === "ko" ? cta.ko : cta.en;
            return (
              <Link
                key={cta.id}
                href={cta.href}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-all hover:border-accent/30 hover:shadow-lift"
              >
                {/* Step number */}
                <span className="absolute right-4 top-4 text-[28px] font-bold text-line/40 select-none">
                  0{i + 1}
                </span>

                <div className="flex flex-1 flex-col gap-4 p-5">
                  {/* Icon */}
                  <span className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl text-[20px] font-bold text-white",
                    cta.accentBg
                  )}>
                    {cta.icon}
                  </span>

                  <div className="flex-1">
                    <h2 className={cn("text-[15px] font-semibold text-ink group-hover:text-accent")}>
                      {copy.title}
                    </h2>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
                      {copy.desc}
                    </p>
                  </div>

                  <span className={cn("text-[13px] font-semibold", cta.accentText)}>
                    {copy.cta}
                  </span>
                </div>

                {/* Bottom accent bar */}
                <div className={cn("h-1 w-full opacity-70", cta.accentBg)} aria-hidden />
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Voice search (quick lesson finder) ── */}
      <VoiceSearchHero />

      {/* ── Platform overview strip ── */}
      <section className="border-t border-line bg-surface-sunk/50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="mb-6 text-[11px] font-semibold uppercase tracking-widest text-muted">
            {L("Recent Lesson Packages", "최근 수업 패키지")}
          </p>
          <div className="space-y-2">
            {SAMPLE_PACKAGES.slice(0, 3).map((pkg) => {
              const meta = REVIEW_STATUS_META[pkg.reviewStatus];
              return (
                <div
                  key={pkg.id}
                  className="flex items-center gap-4 rounded-xl border border-line bg-surface px-4 py-3.5 shadow-card"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-[15px] text-accent">
                    {pkg.subject === "science" ? "🔬" : pkg.subject === "math" ? "∑" : "𝒜"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold text-ink">
                      {lang === "ko" ? pkg.title.ko : pkg.title.en}
                    </p>
                    <p className="text-[11.5px] text-muted">
                      {pkg.explorationSteps.length} {L("steps", "단계")}
                      {" · "}
                      {pkg.dotPadOutputMetadata.cols}×{pkg.dotPadOutputMetadata.rows} Dot Pad
                      {" · "}
                      {pkg.localizationPacks.filter((l) => l.status === "complete").length} {L("locales", "언어팩")}
                    </p>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-semibold", meta.color)}>
                    {lang === "ko" ? meta.labelKo : meta.label}
                  </span>
                  <Link
                    href="/review-console"
                    className="shrink-0 rounded-lg border border-line bg-surface px-3 py-1.5 text-[12px] font-semibold text-muted hover:border-accent/30 hover:text-accent"
                  >
                    {L("Review →", "검수 →")}
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex gap-3">
            <Link href="/studio" className="rounded-xl bg-accent px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-accent-soft">
              {L("Open Studio", "스튜디오 열기")}
            </Link>
            <Link href="/guided-demo" className="rounded-xl border border-line bg-surface px-5 py-2.5 text-[13px] font-semibold text-muted hover:bg-surface-sunk">
              {L("Watch Guided Demo", "가이드 데모 보기")}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

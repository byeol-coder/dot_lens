import Link from "next/link";
import { VALUE_CARDS, PRODUCT } from "@/lib/constants";
import { Braille } from "@/components/Braille";
import { JourneyFlow } from "@/components/JourneyFlow";
import { HeroSection } from "@/components/premium/HeroSection";
import { TactilePipelineSection } from "@/components/premium/TactilePipelineSection";
import {
  FeatureHighlightCard,
  SectionHeading,
} from "@/components/premium/cards";

const ACCENTS = ["blue", "cyan", "pin", "green"] as const;
const ICONS: Record<string, React.ReactNode> = {
  chromebook: <span className="text-[15px]">▭</span>,
  gemini: <span className="font-mono text-[14px] font-semibold">G</span>,
  dotpad: (
    <span className="grid grid-cols-2 grid-rows-2 gap-[3px]" aria-hidden>
      {[1, 0, 0, 1].map((on, i) => (
        <span key={i} className={`h-[4px] w-[4px] rounded-full ${on ? "bg-pin" : "bg-pin-soft"}`} />
      ))}
    </span>
  ),
  braille: <span className="font-mono text-[15px] font-semibold">⠺</span>,
};

const ROLES = [
  {
    href: "/teacher",
    stage: "01 · Build",
    label: "Teacher Mode",
    labelKo: "교사 모드",
    desc: "Upload material, run AI analysis, generate the tactile graphic and a teaching guide, then log post-lesson feedback.",
    descKo: "자료 업로드 · AI 분석 · 촉각 그래픽 생성 · 수업 가이드 · 수업 후 피드백 입력",
    cta: "Create a lesson",
  },
  {
    href: "/expert-review",
    stage: "02 · Review",
    label: "Expert Review Mode",
    labelKo: "전문가 검수 모드",
    desc: "Check tactile-graphic quality, leave comments, and approve or request changes.",
    descKo: "촉각 그래픽 품질 검수 · 코멘트 · 승인/보완 요청",
    cta: "Open review queue",
  },
  {
    href: "/student",
    stage: "03 · Teach",
    label: "Student Learning Mode",
    labelKo: "학생 학습 모드",
    desc: "Explore the tactile material, hear audio explanations, and answer comprehension checks.",
    descKo: "촉각 자료 탐색 · 음성 설명 · 이해도 확인 질문",
    cta: "Start learning",
  },
  {
    href: "/field-data",
    stage: "04 · Improve",
    label: "Field Activist Mode",
    labelKo: "현장 활동가 모드",
    desc: "Track usage by region and school, log teacher inquiries, and record workshop needs.",
    descKo: "지역·학교별 활용 현황 · 교사 문의 · 워크숍 필요 항목 기록",
    cta: "View field data",
  },
] as const;

export default function HomePage() {
  return (
    <>
      {/* Hero: the repositioning */}
      <section className="relative overflow-hidden border-b border-line bg-surface">
        <div className="pin-texture absolute inset-0 opacity-[0.5]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="eyebrow">{PRODUCT.positioning.en}</p>
          <h1 className="mt-3 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] text-ink sm:text-5xl">
            From handing out content to{" "}
            <span className="spectrum-text">running it without us.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted">
            {PRODUCT.subtitle.ko}
          </p>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted">
            {PRODUCT.thesis.ko}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/teacher"
              className="rounded-xl bg-accent px-5 py-3 text-[15px] font-semibold text-white shadow-glow transition-colors hover:bg-accent-soft"
            >
              Create a lesson →
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-line bg-surface px-5 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-surface-sunk"
            >
              View dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* The operating loop — the structural spine */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHeading
          eyebrow="The operating loop"
          title="Build → Review → Teach → Improve → Empower"
          intro="The core problem isn't a lack of content — it's that teachers receive materials with no methodology or ongoing support. Dot Lens closes that gap as a loop, and the loop ends by handing ownership to local champion teachers."
        />
        <div className="mt-4 rounded-xl border border-line bg-surface-sunk/60 p-3">
          <p className="text-[13px] leading-relaxed text-muted">
            <span className="font-semibold text-ink">현장의 핵심 문제:</span>{" "}
            교사는 촉각 자료를 받아도 실제 수업에서 어떻게 설명하고 활용할지에 대한
            방법론과 지속적 지원이 부족합니다. Dot Lens는 제작 → 검수 → 수업 →
            개선 → <span className="font-semibold text-accent">현지 교사 자립</span>의
            선순환으로 이 간극을 메웁니다.
          </p>
        </div>
        <div className="mt-6">
          <JourneyFlow variant="full" />
        </div>
      </section>

      {/* Role entry points */}
      <section className="border-y border-line bg-surface/60">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <SectionHeading
            eyebrow="Choose your role"
            title="One platform, four modes"
            intro="Each role drives one stage of the loop, with a dedicated mode."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROLES.map((role) => (
              <Link
                key={role.href}
                href={role.href}
                className="group flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-accent"
                aria-label={`${role.label}: ${role.desc}`}
              >
                <span className="font-mono text-[11px] font-semibold uppercase tracking-eyebrow text-accent">
                  {role.stage}
                </span>
                <h3 className="mt-2 text-[15px] font-semibold text-ink">{role.label}</h3>
                <p className="mt-0.5 text-[12px] font-medium text-muted">{role.labelKo}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{role.desc}</p>
                <p className="mt-1 text-[12px] text-muted">{role.descKo}</p>
                <span className="mt-auto pt-4 text-[13px] font-semibold text-accent group-hover:underline">
                  {role.cta} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Original hero section — preserved */}
      <div className="border-b border-line">
        <HeroSection />
      </div>

      {/* Why it works */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Why it works"
            title="Four pieces, one accessible lesson"
            intro="Each layer does one job well — and only together do they make a diagram learnable by touch."
          />
          <Braille word="touch" className="hidden shrink-0 sm:inline-flex" />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_CARDS.map((card, i) => (
            <FeatureHighlightCard
              key={card.key}
              accent={ACCENTS[i % ACCENTS.length]}
              icon={ICONS[card.key]}
              title={card.title}
              titleKo={card.titleKo}
              body={card.body}
              footer={<Braille word={card.brailleWord} />}
            />
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <div className="border-y border-line bg-surface/60">
        <TactilePipelineSection />
      </div>

      {/* Stage 05 — Empower: the sustainability payoff */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-8 shadow-card sm:p-10">
          <div className="spectrum-bar absolute inset-x-0 top-0 h-1 opacity-70" aria-hidden />
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow">05 · Empower local teachers</p>
              <h2 className="mt-2 text-balance text-[26px] font-semibold leading-tight text-ink">
                The goal is a program that no longer needs us.
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                꾸준히 수업을 운영하고 동료를 돕는 교사를 챔피언으로 추천·양성합니다.
                현지 교사가 방법론을 이어가면, 외부 전달에 의존하지 않는 지속 가능한
                교육 현장이 됩니다.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  "Track teacher confidence, student understanding, and content reuse over time.",
                  "Surface champion-teacher candidates from real usage and peer-training data.",
                  "Convert field inquiries into targeted workshops instead of one-off fixes.",
                  "Hand methodology to local champions so the loop sustains itself.",
                ].map((pt) => (
                  <li key={pt} className="flex items-start gap-2 text-[13px] text-muted">
                    <span className="mt-0.5 font-bold text-verify" aria-hidden>✓</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/champions"
                className="rounded-xl bg-accent px-5 py-3 text-center text-[15px] font-semibold text-white shadow-glow transition-colors hover:bg-accent-soft"
              >
                Champion teachers →
              </Link>
              <Link
                href="/field-data"
                className="rounded-xl border border-line bg-surface px-5 py-3 text-center text-[15px] font-semibold text-ink transition-colors hover:bg-surface-sunk"
              >
                Field & impact
              </Link>
              <Link
                href="/dashboard"
                className="rounded-xl border border-accent bg-surface px-5 py-3 text-center text-[15px] font-semibold text-accent transition-colors hover:bg-accent-tint"
              >
                Platform dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { VALUE_CARDS } from "@/lib/constants";
import { Braille } from "@/components/Braille";
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
    icon: "📋",
    label: "Teacher Mode",
    labelKo: "교사 모드",
    desc: "Create tactile lessons & generate AI teaching guides",
    descKo: "촉각 수업 자료 생성 및 AI 수업 가이드 제작",
    cta: "Start Creating",
    color: "accent",
  },
  {
    href: "/expert-review",
    icon: "🔍",
    label: "Expert Review",
    labelKo: "전문가 검수",
    desc: "Review, score, and approve tactile materials",
    descKo: "AI 생성 자료 검토 및 품질 승인",
    cta: "Review Queue",
    color: "verify",
  },
  {
    href: "/field-data",
    icon: "🌍",
    label: "Field Activist",
    labelKo: "현장 활동가",
    desc: "Monitor teachers, record field reports, track impact",
    descKo: "교사 현황 모니터링 및 현장 데이터 수집",
    cta: "View Field Data",
    color: "pin",
  },
  {
    href: "/student",
    icon: "✋",
    label: "Student Mode",
    labelKo: "학생 모드",
    desc: "Explore diagrams by touch with Dot Pad + audio guide",
    descKo: "Dot Pad로 도표를 손으로 탐색하며 학습",
    cta: "Start Learning",
    color: "brand-cyan",
  },
] as const;

const PLATFORM_MESSAGES = [
  {
    en: "AI converts classroom diagrams into tactile learning experiences.",
    ko: "AI가 수업 자료를 촉각 학습 경험으로 변환합니다.",
  },
  {
    en: "Teachers can create, review, teach, and improve tactile materials.",
    ko: "교사가 직접 촉각 자료를 만들고, 검수하고, 수업하고, 개선합니다.",
  },
  {
    en: "Designed for blind and low-vision students in real classrooms.",
    ko: "실제 교실의 시각장애 및 저시력 학생을 위해 설계되었습니다.",
  },
  {
    en: "Built for sustainable education in mission fields and low-resource schools.",
    ko: "선교지와 저자원 교육 현장을 위한 지속 가능한 교육 기반을 만듭니다.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Platform positioning banner */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="eyebrow">AI Tactile Education Platform</p>
          <h1 className="mt-3 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] text-ink sm:text-5xl">
            From content delivery to{" "}
            <span className="spectrum-text">teacher empowerment.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-muted">
            콘텐츠 제공을 넘어, 현지 교사가 스스로 가르칠 수 있는 기반을 만듭니다.
          </p>

          {/* Core messages */}
          <ul className="mt-6 grid gap-3 sm:grid-cols-2" aria-label="Platform key messages">
            {PLATFORM_MESSAGES.map((msg, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4 shadow-card">
                <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-accent-tint text-center text-[11px] font-bold leading-5 text-accent" aria-hidden>
                  {i + 1}
                </span>
                <div>
                  <p className="text-[13px] font-medium text-ink">{msg.en}</p>
                  <p className="mt-0.5 text-[12px] text-muted">{msg.ko}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Role entry points */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHeading
          eyebrow="Choose your role"
          title="Build, review, teach, and improve."
          intro="Dot Lens serves four roles in the tactile education ecosystem. Each role has a dedicated mode."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((role) => (
            <Link
              key={role.href}
              href={role.href}
              className="group flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-accent"
              aria-label={`${role.label}: ${role.desc}`}
            >
              <span className="text-2xl" aria-hidden>{role.icon}</span>
              <h3 className="mt-3 text-[15px] font-semibold text-ink">{role.label}</h3>
              <p className="mt-0.5 text-[12px] font-medium text-muted">{role.labelKo}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{role.desc}</p>
              <p className="mt-1 text-[12px] text-muted">{role.descKo}</p>
              <span className="mt-auto pt-4 text-[13px] font-semibold text-accent group-hover:underline">
                {role.cta} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Original hero section — preserved */}
      <div className="border-t border-line">
        <HeroSection />
      </div>

      {/* Why it works */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Why it works"
            title="Four pieces, one accessible assignment"
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

      {/* Mission & sustainability */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-8 shadow-card sm:p-10">
          <div className="spectrum-bar absolute inset-x-0 top-0 h-1 opacity-70" aria-hidden />
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow">Sustainable Education Model</p>
              <h2 className="mt-2 text-balance text-[26px] font-semibold leading-tight text-ink">
                Help local teachers become tactile learning leaders.
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                현지 교사를 촉각 교육 리더로 성장시킵니다.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  "Turn classroom diagrams into accessible learning experiences.",
                  "AI-generated tactile lessons for inclusive classrooms.",
                  "Designed for sustainable education in mission fields.",
                  "Champion teacher program for local ownership.",
                ].map((pt) => (
                  <li key={pt} className="flex items-start gap-2 text-[13px] text-muted">
                    <span className="mt-0.5 text-verify font-bold" aria-hidden>✓</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/dashboard"
                className="rounded-xl bg-accent px-5 py-3 text-center text-[15px] font-semibold text-white shadow-glow transition-colors hover:bg-accent-soft"
              >
                View Dashboard
              </Link>
              <Link
                href="/teacher"
                className="rounded-xl border border-line bg-surface px-5 py-3 text-center text-[15px] font-semibold text-ink transition-colors hover:bg-surface-sunk"
              >
                Teacher Mode
              </Link>
              <Link
                href="/expert-review"
                className="rounded-xl border border-accent bg-surface px-5 py-3 text-center text-[15px] font-semibold text-accent transition-colors hover:bg-accent-tint"
              >
                Expert Review
              </Link>
              <Link
                href="/field-data"
                className="rounded-xl border border-line bg-surface px-5 py-3 text-center text-[14px] font-medium text-muted transition-colors hover:bg-surface-sunk hover:text-ink"
              >
                Field Data &amp; Impact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

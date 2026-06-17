"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

function useL() {
  const { lang } = useLang();
  const L = (en: string, ko: string) => (lang === "ko" ? ko : en);
  return L;
}

/* ── How it works ── */
const HOW_STEPS = [
  {
    n: "01",
    icon: "🖼",
    en: { title: "Upload your material", body: "Drop in a diagram, image, PDF or slide from your lesson — anything your sighted students see on screen." },
    ko: { title: "수업 자료 업로드", body: "수업 시간에 화면에 띄우는 다이어그램·이미지·PDF·슬라이드를 그대로 올리세요." },
  },
  {
    n: "02",
    icon: "◎",
    en: { title: "AI builds the tactile map", body: "Dot Lens identifies every object, its position, and how it relates to others — then designs a touch-navigable layout and braille summary." },
    ko: { title: "AI가 촉각 지도 생성", body: "닷 렌즈가 각 요소의 위치·관계를 분석하고 손으로 탐색할 수 있는 배치와 점자 요약을 만들어 냅니다." },
  },
  {
    n: "03",
    icon: "⠿",
    en: { title: "Students explore by touch", body: "The Dot Pad raises the graphic. Six keys navigate, explain, hint, and quiz — the same lesson, at the same moment, by touch." },
    ko: { title: "학생이 손끝으로 탐색", body: "Dot Pad가 그래픽을 올립니다. 여섯 개의 키로 이동·설명·힌트·퀴즈를 — 반 전체와 같은 수업을 손끝으로 따라갑니다." },
  },
];

/* ── Personas ── */
const PERSONAS = [
  {
    href: "/teacher",
    icon: "📋",
    accent: "bg-accent-tint text-accent",
    en: {
      role: "Teacher",
      quote: '“I want my blind students in the front of the room, not on the sidelines.”',
      body: "Upload any classroom material and Dot Lens turns it into a tactile lesson with a teaching guide — in minutes.",
      cta: "Create a Lesson",
    },
    ko: {
      role: "교사",
      quote: '“우리 시각장애 학생이 교실 한가운데서 함께 배울 수 있으면 좋겠어요.”',
      body: "수업 자료를 올리면 닷 렌즈가 수업 가이드까지 함께 촉각 수업으로 만들어줍니다 — 몇 분이면 충분합니다.",
      cta: "수업 자료 만들기",
    },
  },
  {
    href: "/student",
    icon: "✋",
    accent: "bg-verify-tint text-verify",
    en: {
      role: "Learner",
      quote: '“I want to follow the same lesson as my class — just by touch.”',
      body: "Navigate every part of the diagram with six keys. Audio explains, braille confirms, and a quiz checks your understanding.",
      cta: "Try Student Mode",
    },
    ko: {
      role: "학습자",
      quote: '“반 친구들과 똑같은 수업을, 손으로 따라가고 싶어요.”',
      body: "여섯 개의 키로 다이어그램의 모든 부분을 탐색합니다. 음성으로 설명하고, 점자로 확인하고, 퀴즈로 이해를 점검합니다.",
      cta: "학생 체험하기",
    },
  },
  {
    href: "/expert-review",
    icon: "🔍",
    accent: "bg-warn-soft text-warn-dark",
    en: {
      role: "TVI / Braille Expert",
      quote: '“Every tactile material that reaches a student should pass through expert hands first.”',
      body: "Review AI-generated graphics for accuracy and tactile readability. Approve, request revision, or add notes — before it goes to class.",
      cta: "Review Queue",
    },
    ko: {
      role: "시각장애 교육 전문가 / 점자 검수자",
      quote: '“학생 손에 닿는 촉각 자료라면 반드시 전문가 검수를 거쳐야 합니다.”',
      body: "AI가 생성한 그래픽의 정확도와 촉각 인지성을 검토합니다. 승인·수정 요청·의견 추가까지 — 수업 전에 미리.",
      cta: "검수 대기 목록",
    },
  },
  {
    href: "/champions",
    icon: "🌟",
    accent: "bg-pin-soft text-pin-dark",
    en: {
      role: "Champion Teacher",
      quote: '“I lead tactile education at my school and help other teachers grow.”',
      body: "Champions are recognized educators who mentor peers, pilot new materials, and expand Dot Lens in their communities.",
      cta: "Champion Programme",
    },
    ko: {
      role: "챔피언 교사",
      quote: '“학교에서 촉각 교육을 이끌고, 동료 교사들이 함께 성장하도록 돕습니다.”',
      body: "챔피언 교사는 동료 멘토링·신규 자료 파일럿·커뮤니티 확산을 이끄는 인정받은 교육자입니다.",
      cta: "챔피언 프로그램",
    },
  },
  {
    href: "/impact",
    icon: "🌍",
    accent: "bg-surface-sunk text-muted",
    en: {
      role: "Field Activist",
      quote: '“I need to know whether inclusive education actually reaches remote and mission schools.”',
      body: "Track lesson usage by region, school, and teacher group. See what is working and where Dot Lens still needs to grow.",
      cta: "Field Data",
    },
    ko: {
      role: "현장 활동가",
      quote: '“통합 교육이 선교지·저자원 학교에 실제로 닿고 있는지 확인해야 합니다.”',
      body: "지역·학교·교사 그룹별 수업 활용 현황을 추적합니다. 무엇이 효과적인지, 닷 렌즈가 어디에서 더 성장해야 하는지.",
      cta: "현장 데이터",
    },
  },
];

/* ── Impact stats ── */
const STATS = [
  { value: "47", en: "Lessons created", ko: "생성된 수업" },
  { value: "234", en: "Student sessions", ko: "학생 학습 세션" },
  { value: "18", en: "Teachers active", ko: "활동 중인 교사" },
  { value: "3", en: "Countries", ko: "참여 국가" },
];

/* ── Voices ── */
const VOICES = [
  {
    en: {
      quote: "For the first time, my student understood the water cycle by feeling it — not just hearing about it.",
      name: "Mrs. Anjali Sharma",
      school: "Blind School Pune · India",
      badge: "Champion Teacher",
    },
    ko: {
      quote: "처음으로 우리 학생이 물의 순환을 듣기만 하는 게 아니라 손으로 만지며 이해했어요.",
      name: "Anjali Sharma 선생님",
      school: "맹학교 푸네 · 인도",
      badge: "챔피언 교사",
    },
  },
  {
    en: {
      quote: "Students no longer wait for a separate version. They join the class at exactly the same moment.",
      name: "Rev. James Banda",
      school: "Mission School Lusaka · Zambia",
      badge: "Champion Teacher",
    },
    ko: {
      quote: "이제 학생들이 따로 준비된 자료를 기다리지 않아요. 수업 시작과 동시에 함께 합니다.",
      name: "James Banda 목사",
      school: "선교학교 루사카 · 잠비아",
      badge: "챔피언 교사",
    },
  },
];

/* ══════════════════════════════════════════════════════ */

export function LandingView() {
  const L = useL();

  return (
    <>
      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-line bg-surface">
        <div className="pin-texture absolute inset-0 opacity-[0.5]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <p className="eyebrow">{L("AI Tactile Learning Platform", "AI 촉각 교육 플랫폼")}</p>

          <h1 className="mt-3 max-w-3xl text-balance text-[28px] font-semibold leading-[1.15] text-ink sm:text-[38px] lg:text-[48px] sm:leading-[1.12]">
            {L(
              "See classroom visuals through a tactile lens.",
              "보이지 않던 수업 자료를, 촉각으로 이해할 수 있게."
            )}
          </h1>

          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted">
            {L(
              "Dot Lens turns diagrams and images into tactile lessons that blind and low-vision students can explore with their classmates.",
              "닷 렌즈는 교실 속 다이어그램과 이미지를 시각장애 및 저시력 학생이 함께 탐색할 수 있는 촉각 수업 자료로 바꿉니다."
            )}
          </p>

          <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <Link
              href="/guided-demo"
              className="rounded-xl bg-accent px-5 py-3 text-center text-[15px] font-semibold text-white shadow-glow transition-colors hover:bg-accent-soft sm:w-auto"
            >
              {L("Start Guided Demo →", "시연 시작하기 →")}
            </Link>
            <Link
              href="/teacher"
              className="rounded-xl border border-accent bg-surface px-5 py-3 text-center text-[15px] font-semibold text-accent transition-colors hover:bg-accent-tint sm:w-auto"
            >
              {L("Create a Lesson", "수업 자료 만들기")}
            </Link>
          </div>

          {/* Flow chip */}
          <div className="mt-9 flex max-w-md items-center gap-2 rounded-2xl border border-line bg-surface p-3 shadow-card">
            {[
              { icon: "🖼", en: "Visual material", ko: "수업 자료", tone: "muted" },
              { icon: "◎", en: "Dot Lens analysis", ko: "렌즈 분석", tone: "accent" },
              { icon: "⠿", en: "Tactile lesson", ko: "촉각 수업", tone: "verify" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex min-w-[84px] flex-col items-center gap-1 rounded-xl bg-surface-sunk px-2 py-2.5 text-center">
                  <span
                    className={cn(
                      "grid h-8 w-8 place-items-center rounded-full text-[14px]",
                      s.tone === "accent" ? "bg-accent text-white" :
                      s.tone === "verify" ? "bg-verify-tint text-verify" :
                      "bg-surface text-muted"
                    )}
                    aria-hidden
                  >
                    {s.icon}
                  </span>
                  <span className="text-[11px] font-semibold leading-tight text-ink">{L(s.en, s.ko)}</span>
                </div>
                {i < 2 && <span className="text-[15px] text-accent" aria-hidden>→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. HOW IT WORKS ──────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="how-heading">
        <p className="eyebrow">{L("How it works", "어떻게 작동하나요")}</p>
        <h2 id="how-heading" className="mt-2 text-balance text-2xl font-semibold text-ink sm:text-3xl">
          {L("From a classroom diagram to a tactile lesson in three steps.", "수업 다이어그램에서 촉각 수업까지 세 단계.")}
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {HOW_STEPS.map((s) => (
            <div key={s.n} className="relative flex flex-col rounded-2xl border border-line bg-surface p-6 shadow-card">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-tint text-[20px]" aria-hidden>
                  {s.icon}
                </span>
                <span className="font-mono text-[13px] font-semibold text-accent">{s.n}</span>
              </div>
              <h3 className="mt-3 text-[16px] font-semibold text-ink">
                {L(s.en.title, s.ko.title)}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                {L(s.en.body, s.ko.body)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. PERSONAS ──────────────────────────────────────── */}
      <section className="border-y border-line bg-surface/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="personas-heading">
          <p className="eyebrow">{L("Who is Dot Lens for?", "누가 사용하나요?")}</p>
          <h2 id="personas-heading" className="mt-2 text-balance text-2xl font-semibold text-ink sm:text-3xl">
            {L(
              "One platform — five roles, one shared lesson.",
              "하나의 플랫폼 — 다섯 가지 역할, 하나의 수업."
            )}
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            {L(
              "Whether you create, review, teach, learn, or advocate — Dot Lens has a mode built for you.",
              "만들고, 검수하고, 가르치고, 배우고, 현장을 이끄는 모든 분을 위한 모드가 있습니다."
            )}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PERSONAS.map((p) => {
              const c = { role: L(p.en.role, p.ko.role), quote: L(p.en.quote, p.ko.quote), body: L(p.en.body, p.ko.body), cta: L(p.en.cta, p.ko.cta) };
              return (
                <Link
                  key={p.href}
                  href={p.href}
                  className="group flex flex-col rounded-2xl border border-line bg-surface p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent-soft/40 hover:shadow-lift focus-visible:outline-accent"
                >
                  <span className={cn("mb-3 grid h-11 w-11 place-items-center rounded-xl text-[22px]", p.accent)} aria-hidden>
                    {p.icon}
                  </span>
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-eyebrow text-accent">
                    {c.role}
                  </span>
                  <p className="mt-2 text-[14px] font-semibold italic leading-snug text-ink">
                    {c.quote}
                  </p>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted">
                    {c.body}
                  </p>
                  <span className="mt-4 inline-block text-[13px] font-semibold text-accent group-hover:underline">
                    {c.cta} →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. IMPACT STATS ──────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <p className="eyebrow text-center">{L("Platform impact", "플랫폼 임팩트")}</p>
        <h2 className="mt-2 text-center text-2xl font-semibold text-ink">
          {L("Growing across classrooms and countries.", "교실과 국가를 넘어 성장 중입니다.")}
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.value} className="rounded-2xl border border-line bg-surface p-5 text-center shadow-card">
              <p className="font-display text-[40px] font-semibold leading-none spectrum-text">{s.value}</p>
              <p className="mt-2 text-[13px] font-medium text-muted">{L(s.en, s.ko)}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-[12px] text-faint">
          {L("India · Nigeria · Zambia — and growing.", "인도 · 나이지리아 · 잠비아 — 그리고 더 많은 곳으로.")}
        </p>
      </section>

      {/* ── 5. VOICES ────────────────────────────────────────── */}
      <section className="border-t border-line bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="eyebrow">{L("Voices from the field", "현장의 목소리")}</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">
            {L("From teachers and champions around the world.", "세계 각지의 교사와 챔피언 교사들로부터.")}
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {VOICES.map((v, i) => {
              const c = { quote: L(v.en.quote, v.ko.quote), name: L(v.en.name, v.ko.name), school: L(v.en.school, v.ko.school), badge: L(v.en.badge, v.ko.badge) };
              return (
                <blockquote key={i} className="flex flex-col rounded-2xl border border-line bg-surface p-6 shadow-card">
                  <span className="mb-3 font-mono text-[24px] leading-none text-accent-soft" aria-hidden>&ldquo;</span>
                  <p className="flex-1 text-[15px] leading-relaxed text-ink">{c.quote}</p>
                  <footer className="mt-4 border-t border-line pt-4">
                    <p className="text-[14px] font-semibold text-ink">{c.name}</p>
                    <p className="text-[12px] text-muted">{c.school}</p>
                    <span className="mt-1.5 inline-block rounded-full bg-accent-tint px-2.5 py-0.5 font-mono text-[10px] text-accent">
                      {c.badge}
                    </span>
                  </footer>
                </blockquote>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. DEMO CTA ──────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-8 shadow-card sm:p-10">
          <div className="spectrum-bar absolute inset-x-0 top-0 h-1 opacity-70" aria-hidden />
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow">{L("No sign-up required", "회원가입 불필요")}</p>
              <h2 className="mt-2 text-balance text-[26px] font-semibold leading-tight text-ink">
                {L(
                  "Try the full Dot Lens experience — right now.",
                  "지금 바로 닷 렌즈 전체 흐름을 체험해보세요."
                )}
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                {L(
                  "Walk through every step — upload, AI analysis, tactile preview, braille review, and publishing — on a sample water-cycle lesson. Nothing to install.",
                  "업로드부터 AI 분석·촉각 미리보기·점자 검수·게시까지 — 물의 순환 샘플 수업으로 전체 흐름을 체험합니다. 설치 불필요."
                )}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/guided-demo"
                className="rounded-xl bg-accent px-5 py-3 text-center text-[15px] font-semibold text-white shadow-glow transition-colors hover:bg-accent-soft"
              >
                {L("Start Guided Demo →", "시연 시작하기 →")}
              </Link>
              <Link
                href="/teacher"
                className="rounded-xl border border-line bg-surface px-5 py-3 text-center text-[15px] font-semibold text-ink transition-colors hover:bg-surface-sunk"
              >
                {L("Create a Lesson", "수업 자료 만들기")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

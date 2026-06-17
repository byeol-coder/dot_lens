"use client";

import { useState } from "react";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { DotPadSimulator } from "@/components/DotPadSimulator";

/* ── Plant Life Cycle mock data ── */
const PLANT_OBJECTS_EN = ["Seed", "Roots", "Stem", "Leaves"];
const PLANT_OBJECTS_KO = ["씨앗", "뿌리", "줄기", "잎"];
const QUESTIONS_EN = [
  "Where does the seed start its journey? (lower-left area)",
  "Why do roots grow downward toward the soil?",
  "What connects the roots to the leaves?",
];
const QUESTIONS_KO = [
  "씨앗은 어디서 시작하나요? (왼쪽 하단 영역)",
  "뿌리는 왜 토양 아래 방향으로 자라나요?",
  "뿌리와 잎을 연결하는 것은 무엇인가요?",
];
const GUIDE_EN = {
  objective: "Students will identify and sequence the stages of plant growth through tactile exploration.",
  sequence: "lower-left seed → roots (downward threads) → upward stem → leaves at top",
  script: "Begin at the lower-left area — feel the rounded seed shape. Move upward: those thread-like textures reaching downward are the roots, growing toward water. Now follow the single raised line upward — that is the stem. At the top, the broader flat areas are the leaves.",
  checkQ: ["Can you feel the difference between the root texture and the stem?", "How many growth stages can you identify by touch?"],
};
const GUIDE_KO = {
  objective: "학생이 촉각 탐색을 통해 식물 성장 단계를 파악하고 순서를 나열할 수 있다.",
  sequence: "왼쪽 하단 씨앗 → 아래로 뻗은 뿌리 → 위로 뻗은 줄기 → 위쪽 잎",
  script: "왼쪽 아래에서 둥근 씨앗 모양을 느껴보세요. 위쪽으로 이동합니다. 아래 방향으로 실처럼 뻗은 것이 뿌리입니다 — 물을 찾아 아래로 자라고 있어요. 이제 위로 올라가는 하나의 굵은 선을 따라가세요 — 줄기입니다. 맨 위의 넓고 평평한 부분이 잎입니다.",
  checkQ: ["뿌리의 질감과 줄기의 차이를 손으로 느낄 수 있나요?", "촉각으로 몇 개의 성장 단계를 구분할 수 있나요?"],
};

const STEPS = [
  "guided.intro.eyebrow",
  "guided.material.eyebrow",
  "guided.lensInsight.eyebrow",
  "guided.tactile.eyebrow",
  "guided.guide.eyebrow",
  "guided.student.eyebrow",
  "guided.review.eyebrow",
  "guided.impact.eyebrow",
] as const;

type StepKey = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/* ── Step sub-components ── */

function StepIntro({ t, lang }: { t: ReturnType<typeof useT>["t"]; lang: string }) {
  const L = (en: string, ko: string) => lang === "ko" ? ko : en;
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-accent/20 bg-accent-tint/30 p-6">
        <p className="eyebrow text-accent">{t("guided.intro.eyebrow")}</p>
        <h2 className="mt-2 text-balance text-[26px] font-semibold leading-tight text-ink sm:text-[32px]">
          {t("guided.intro.title")}
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
          {t("guided.intro.description")}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: t("guided.intro.subject"), icon: "🔬" },
          { label: t("guided.intro.audience"), icon: "✋" },
          { label: t("guided.intro.location"), icon: "📍" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4">
            <span className="text-[22px]" aria-hidden>{item.icon}</span>
            <span className="text-[13px] font-medium text-ink">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="eyebrow">{L("What you'll see in this demo", "이 데모에서 확인할 내용")}</p>
        <ol className="mt-3 space-y-2">
          {[
            L("A real plant life cycle classroom diagram", "실제 식물 성장 과정 수업 다이어그램"),
            L("AI Lens Insight — objects, sequence, confusion points", "AI 렌즈 인사이트 — 객체, 탐색 순서, 혼동 포인트"),
            L("Tactile version comparison (Before/After)", "촉각 버전 비교 (전/후)"),
            L("Complete teaching guide", "완성된 교사용 수업 가이드"),
            L("Simulated Dot Pad student experience", "시뮬레이션 Dot Pad 학생 체험"),
            L("Expert review results", "전문가 검수 결과"),
            L("India Mission School field impact data", "인도 미션 스쿨 현장 데이터"),
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-ink">
              <span className="mt-0.5 font-mono text-[11px] font-semibold text-accent">{String(i + 1).padStart(2, "0")}</span>
              {item}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function StepMaterial({ t, lang }: { t: ReturnType<typeof useT>["t"]; lang: string }) {
  const L = (en: string, ko: string) => lang === "ko" ? ko : en;
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-accent">{t("guided.material.eyebrow")}</p>
        <h2 className="mt-2 text-[24px] font-semibold text-ink">{t("guided.material.title")}</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">{t("guided.material.description")}</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        <div className="border-b border-line bg-surface-sunk px-4 py-2">
          <p className="font-mono text-[11px] text-faint">{L("plant_life_cycle_grade3.png · Science · Grade 3", "plant_life_cycle_grade3.png · 과학 · 초등 3학년")}</p>
        </div>
        <div className="flex min-h-[200px] items-center justify-center bg-gradient-to-br from-surface to-surface-sunk p-8">
          <div className="w-full max-w-sm space-y-3 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-tint text-[32px]">🌱</div>
            <p className="font-semibold text-ink">{L("Plant Life Cycle", "식물의 성장 과정")}</p>
            <div className="flex items-center justify-center gap-3 text-[13px] text-muted">
              {(lang === "ko" ? PLANT_OBJECTS_KO : PLANT_OBJECTS_EN).map((obj, i) => (
                <span key={obj} className="flex items-center gap-1">
                  {i > 0 && <span className="text-faint" aria-hidden>→</span>}
                  <span className="rounded-full border border-line bg-surface px-2 py-0.5 text-[11px] font-medium">{obj}</span>
                </span>
              ))}
            </div>
            <p className="text-[11px] italic text-faint">{L("Sample visual material — as seen by sighted students", "시력이 있는 학생에게 보이는 수업 자료 예시")}</p>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-warn/20 bg-pin-soft/20 p-4">
        <p className="text-[13px] font-semibold text-ink">
          {L("Why this material needs Dot Lens", "이 자료에 닷 렌즈가 필요한 이유")}
        </p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
          {L(
            "A blind or low-vision student sees none of this. Without tactile transformation, they must rely on verbal description alone — unable to explore the spatial relationships independently.",
            "시각장애 또는 저시력 학생에게는 이 내용이 전혀 보이지 않습니다. 촉각 변환 없이는 구두 설명에만 의존해야 하며, 공간적 관계를 스스로 탐색할 수 없습니다."
          )}
        </p>
      </div>
    </div>
  );
}

function StepLensInsight({ t, lang }: { t: ReturnType<typeof useT>["t"]; lang: string }) {
  const L = (en: string, ko: string) => lang === "ko" ? ko : en;
  const objects = lang === "ko" ? PLANT_OBJECTS_KO : PLANT_OBJECTS_EN;
  const questions = lang === "ko" ? QUESTIONS_KO : QUESTIONS_EN;
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-accent">{t("guided.lensInsight.eyebrow")}</p>
        <h2 className="mt-2 text-[24px] font-semibold text-ink">{t("guided.lensInsight.title")}</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">{t("guided.lensInsight.description")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <p className="eyebrow text-accent">{t("guided.lensInsight.objects")}</p>
          <ul className="mt-3 space-y-2">
            {objects.map((obj, i) => (
              <li key={obj} className="flex items-center gap-2 text-[13.5px] font-medium text-ink">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-accent-tint font-mono text-[11px] font-semibold text-accent">{i + 1}</span>
                {obj}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl border border-line bg-surface p-4 shadow-card">
            <p className="eyebrow">{t("guided.lensInsight.sequence")}</p>
            <p className="mt-2 text-[13px] font-medium text-ink">
              {L("lower-left seed → roots → stem → leaves", "왼쪽 하단 씨앗 → 뿌리 → 줄기 → 잎")}
            </p>
          </div>
          <div className="rounded-2xl border border-warn/20 bg-pin-soft/20 p-4">
            <p className="eyebrow text-warn">{t("guided.lensInsight.confusion")}</p>
            <p className="mt-2 text-[13px] text-ink">
              {L("Roots grow downward while stem grows upward — students may confuse direction.", "뿌리는 아래로, 줄기는 위로 자라기 때문에 학생이 방향을 혼동할 수 있습니다.")}
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
        <p className="eyebrow">{t("guided.lensInsight.questions")}</p>
        <ol className="mt-3 space-y-2">
          {questions.map((q, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-ink">
              <span className="mt-0.5 font-mono text-[11px] font-semibold text-accent">{String(i + 1).padStart(2, "0")}</span>
              {q}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function StepTactilePreview({ t, lang }: { t: ReturnType<typeof useT>["t"]; lang: string }) {
  const L = (en: string, ko: string) => lang === "ko" ? ko : en;
  const objects = lang === "ko" ? PLANT_OBJECTS_KO : PLANT_OBJECTS_EN;
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-accent">{t("guided.tactile.eyebrow")}</p>
        <h2 className="mt-2 text-[24px] font-semibold text-ink">{t("guided.tactile.title")}</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">{t("guided.tactile.description")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Before */}
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
          <div className="border-b border-line bg-surface-sunk px-4 py-2">
            <p className="font-mono text-[11px] font-semibold text-muted">{t("guided.tactile.before")}</p>
          </div>
          <div className="flex min-h-[180px] items-center justify-center p-6 text-center">
            <div>
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-surface-sunk text-[28px]">🌱</div>
              <p className="text-[12px] text-muted">{L("Colour diagram · spatial layout · visual arrows", "컬러 다이어그램 · 공간 배치 · 시각적 화살표")}</p>
              <p className="mt-1 text-[11px] italic text-faint">{L("Not accessible without sight", "시력 없이는 접근 불가")}</p>
            </div>
          </div>
        </div>
        {/* After */}
        <div className="overflow-hidden rounded-2xl border border-accent/30 bg-accent-tint/10 shadow-card">
          <div className="border-b border-accent/20 bg-accent-tint/30 px-4 py-2">
            <p className="font-mono text-[11px] font-semibold text-accent">{t("guided.tactile.after")}</p>
          </div>
          <div className="p-4">
            <div
              className="grid gap-[2px] rounded-xl bg-ink/5 p-3"
              style={{ gridTemplateColumns: "repeat(20, 1fr)" }}
              aria-label={L("Simulated Dot Pad tactile preview — plant life cycle", "시뮬레이션 Dot Pad 촉각 미리보기 — 식물 성장 과정")}
              role="img"
            >
              {Array.from({ length: 160 }, (_, i) => {
                const col = i % 20;
                const row = Math.floor(i / 20);
                const isSeed = row >= 6 && row <= 7 && col >= 1 && col <= 3;
                const isRoot = row >= 4 && row <= 6 && (col === 2 || col === 1 || col === 3) && row > 5;
                const isStem = col === 9 && row >= 1 && row <= 6;
                const isLeaf = row <= 2 && col >= 7 && col <= 12;
                const isActive = isSeed || isRoot || isStem || isLeaf;
                return (
                  <span
                    key={i}
                    className={cn(
                      "aspect-square rounded-full",
                      isActive ? "bg-accent" : "bg-ink/8"
                    )}
                    aria-hidden
                  />
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {objects.map((obj, i) => (
                <span key={obj} className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                  <span className="font-mono">{i + 1}</span> {obj}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="rounded-xl border border-line bg-surface-sunk/60 p-3 text-[12px] italic text-muted">
        {L(
          "Dot Pad tactile preview — 20×8 simulation. The real Dot Pad renders 60×40 refreshable braille pins.",
          "Dot Pad 촉각 미리보기 — 20×8 시뮬레이션. 실제 Dot Pad는 60×40 점자 핀으로 구성됩니다."
        )}
      </p>
    </div>
  );
}

function StepTeachingGuide({ t, lang }: { t: ReturnType<typeof useT>["t"]; lang: string }) {
  const L = (en: string, ko: string) => lang === "ko" ? ko : en;
  const guide = lang === "ko" ? GUIDE_KO : GUIDE_EN;
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-accent">{t("guided.guide.eyebrow")}</p>
        <h2 className="mt-2 text-[24px] font-semibold text-ink">{t("guided.guide.title")}</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">{t("guided.guide.description")}</p>
      </div>
      <div className="grid gap-4">
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <p className="eyebrow">{L("Learning objective", "수업 목표")}</p>
          <p className="mt-2 text-[14px] leading-relaxed text-ink">{guide.objective}</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <p className="eyebrow">{L("Exploration sequence", "탐색 순서")}</p>
          <p className="mt-2 font-mono text-[13px] text-accent">{guide.sequence}</p>
        </div>
        <div className="rounded-2xl border border-accent/20 bg-accent-tint/20 p-5">
          <p className="eyebrow text-accent">{L("Teacher script", "교사 설명 문장")}</p>
          <p className="mt-2 text-[14px] italic leading-relaxed text-ink">&ldquo;{guide.script}&rdquo;</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <p className="eyebrow">{L("Check questions", "확인 질문")}</p>
          <ul className="mt-3 space-y-2">
            {guide.checkQ.map((q, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-ink">
                <span className="mt-0.5 font-mono text-[11px] font-semibold text-accent">Q{i + 1}</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StepStudentLearning({ t, lang }: { t: ReturnType<typeof useT>["t"]; lang: string }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-accent">{t("guided.student.eyebrow")}</p>
        <h2 className="mt-2 text-[24px] font-semibold text-ink">{t("guided.student.title")}</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">{t("guided.student.description")}</p>
      </div>
      <DotPadSimulator />
    </div>
  );
}

function StepExpertReview({ t, lang }: { t: ReturnType<typeof useT>["t"]; lang: string }) {
  const L = (en: string, ko: string) => lang === "ko" ? ko : en;
  const scores = [
    { label: t("guided.review.accuracy"), value: 94 },
    { label: t("guided.review.readability"), value: 88 },
    { label: t("guided.review.clarity"), value: 91 },
  ];
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-accent">{t("guided.review.eyebrow")}</p>
        <h2 className="mt-2 text-[24px] font-semibold text-ink">{t("guided.review.title")}</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">{t("guided.review.description")}</p>
      </div>
      <div className="rounded-2xl border border-verify/30 bg-verify-tint/20 p-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-verify px-3 py-1 text-[12px] font-semibold text-white">{t("guided.review.approved")}</span>
          <p className="text-[13px] font-semibold text-ink">Dr. Priya Nair</p>
          <p className="text-[12px] text-muted">· {L("National Institute for the Visually Impaired, Chennai", "전국 시각장애인 교육원, 첸나이")}</p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {scores.map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-line bg-surface p-3 text-center shadow-card">
              <p className="font-display text-[28px] font-semibold text-accent">{value}%</p>
              <p className="mt-1 text-[11px] font-medium text-muted">{label}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-sunk">
                <div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-line bg-surface p-4">
          <p className="text-[12px] font-semibold text-muted">{t("guided.review.comment")}</p>
          <p className="mt-1 text-[13px] leading-relaxed text-ink italic">
            &ldquo;{L(
              "Excellent tactile representation. Object sizes are well differentiated. The exploration sequence is intuitive for Grade 3 students. Recommend adding a texture cue for the soil boundary line.",
              "촉각 표현이 우수합니다. 객체 크기가 잘 구분됩니다. 탐색 순서가 초등 3학년 학생에게 직관적입니다. 토양 경계선에 대한 질감 큐 추가를 권장합니다."
            )}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

function StepFieldImpact({ t, lang }: { t: ReturnType<typeof useT>["t"]; lang: string }) {
  const L = (en: string, ko: string) => lang === "ko" ? ko : en;
  const stats = [
    { value: 4, label: L("Teachers active", "활동 중인 교사") },
    { value: 12, label: L("Lessons created", "생성된 수업") },
    { value: 47, label: L("Student sessions", "학생 세션") },
    { value: "89%", label: L("Review completion", "검수 완료율") },
    { value: 2, label: L("Champion candidates", "챔피언 후보") },
  ];
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-accent">{t("guided.impact.eyebrow")}</p>
        <h2 className="mt-2 text-[24px] font-semibold text-ink">{t("guided.impact.title")}</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">{t("guided.impact.description")}</p>
      </div>
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
        <div className="flex items-center gap-2">
          <span className="text-[22px]" aria-hidden>📍</span>
          <div>
            <p className="font-semibold text-ink">{t("guided.impact.school")}</p>
            <p className="text-[12px] text-muted">{t("guided.impact.region")}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map(({ value, label }) => (
            <div key={label} className="rounded-xl border border-line bg-surface-sunk/60 p-3 text-center">
              <p className="font-display text-[26px] font-semibold text-ink">{value}</p>
              <p className="mt-1 text-[11px] text-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-accent/20 bg-accent-tint/20 p-5">
        <p className="font-semibold text-ink">
          {L("What happens next?", "다음 단계는?")}
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
          {L(
            "Two teachers have been identified as Champion Teacher candidates. They will join the next champion workshop to become local leaders who train others — making Dot Lens self-sustaining in this community.",
            "두 명의 교사가 챔피언 교사 후보로 선발되었습니다. 이들은 다음 챔피언 워크숍에 참여해 다른 교사를 교육하는 현지 리더가 됩니다 — 이 지역에서 닷 렌즈가 자생적으로 확산될 수 있습니다."
          )}
        </p>
      </div>
      <div className="rounded-xl border border-line bg-surface p-4 text-center">
        <p className="text-[14px] font-semibold text-ink">
          {L("You've seen the complete Dot Lens journey.", "닷 렌즈의 전체 여정을 함께 살펴봤습니다.")}
        </p>
        <p className="mt-1 text-[13px] text-muted">
          {L(
            "From a classroom diagram to a tactile lesson — reviewed, used in class, and driving real field impact.",
            "수업 다이어그램에서 촉각 수업까지 — 검수 완료, 수업 활용, 그리고 실제 현장 임팩트."
          )}
        </p>
      </div>
    </div>
  );
}

/* ── Step indicator ── */
const STEP_LABELS_EN = ["Intro", "Material", "Lens Insight", "Tactile", "Guide", "Student", "Review", "Impact"];
const STEP_LABELS_KO = ["소개", "자료", "렌즈 인사이트", "촉각", "가이드", "학생", "검수", "임팩트"];

/* ── Main component ── */
export function GuidedDemo() {
  const { t, lang } = useT();
  const [step, setStep] = useState<StepKey>(0);
  const labels = lang === "ko" ? STEP_LABELS_KO : STEP_LABELS_EN;
  const total = 8;

  const STEP_CTAS: Record<StepKey, string> = {
    0: t("guided.intro.cta"),
    1: t("guided.material.cta"),
    2: t("guided.lensInsight.cta"),
    3: t("guided.tactile.cta"),
    4: t("guided.guide.cta"),
    5: t("guided.student.cta"),
    6: t("guided.review.cta"),
    7: t("guided.impact.cta"),
  };

  const stepContent: Record<StepKey, JSX.Element> = {
    0: <StepIntro t={t} lang={lang} />,
    1: <StepMaterial t={t} lang={lang} />,
    2: <StepLensInsight t={t} lang={lang} />,
    3: <StepTactilePreview t={t} lang={lang} />,
    4: <StepTeachingGuide t={t} lang={lang} />,
    5: <StepStudentLearning t={t} lang={lang} />,
    6: <StepExpertReview t={t} lang={lang} />,
    7: <StepFieldImpact t={t} lang={lang} />,
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
      {/* Step indicator */}
      <nav aria-label={lang === "ko" ? "데모 진행 단계" : "Demo progress"}>
        <ol className="flex flex-wrap gap-1.5">
          {labels.map((label, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setStep(i as StepKey)}
                aria-current={i === step ? "step" : undefined}
                aria-label={`${lang === "ko" ? `${i + 1}단계: ${label}` : `Step ${i + 1}: ${label}`}`}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-[11px] font-semibold transition-colors",
                  i === step
                    ? "border-accent bg-accent text-white"
                    : i < step
                    ? "border-verify/40 bg-verify-tint text-verify"
                    : "border-line bg-surface text-muted hover:border-accent/40 hover:text-accent"
                )}
              >
                {i + 1} · {label}
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-2 font-mono text-[11px] text-faint">
          {lang === "ko" ? `${step + 1} / ${total}` : `Step ${step + 1} of ${total}`}
        </p>
      </nav>

      {/* Step content */}
      <div
        key={step}
        aria-live="polite"
        aria-atomic="true"
        role="region"
        aria-label={lang === "ko" ? `데모 ${step + 1}단계` : `Demo step ${step + 1}`}
      >
        {stepContent[step]}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-line pt-6">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1) as StepKey)}
          disabled={step === 0}
          aria-label={t("guided.nav.prev")}
          className="rounded-xl border border-line px-4 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:bg-surface-sunk disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← {t("guided.nav.prev")}
        </button>

        {step < 7 ? (
          <button
            type="button"
            onClick={() => setStep((s) => (s + 1) as StepKey)}
            aria-label={STEP_CTAS[step]}
            className="rounded-xl bg-accent px-5 py-2.5 text-[14px] font-semibold text-white shadow-glow transition-colors hover:bg-accent-soft focus-visible:outline-accent"
          >
            {STEP_CTAS[step]} →
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="rounded-xl border border-accent px-4 py-2.5 text-[14px] font-semibold text-accent transition-colors hover:bg-accent-tint"
            >
              {t("guided.impact.restart")}
            </button>
            <Link
              href="/teacher"
              className="rounded-xl bg-accent px-5 py-2.5 text-[14px] font-semibold text-white shadow-glow transition-colors hover:bg-accent-soft"
            >
              {lang === "ko" ? "수업 만들기 →" : "Create a Lesson →"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

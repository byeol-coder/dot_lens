"use client";

import Link from "next/link";
import { useCallback } from "react";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { SAMPLE_PACKAGES, REVIEW_STATUS_META } from "@/lib/tactileLessonPackage";

/* ── workflow pipeline ── */
const WORKFLOW_STEPS = [
  { key: "upload",     icon: "⬆", color: "bg-accent text-white" },
  { key: "analysis",   icon: "◎", color: "bg-accent/80 text-white" },
  { key: "tactileMap", icon: "⠿", color: "bg-accent/60 text-white" },
  { key: "braille",    icon: "⠂", color: "bg-accent/50 text-white" },
  { key: "audio",      icon: "♪", color: "bg-accent/40 text-white" },
  { key: "steps",      icon: "›", color: "bg-accent/30 text-ink" },
  { key: "review",     icon: "✓", color: "bg-verify-tint text-verify" },
  { key: "send",       icon: "→", color: "bg-surface-sunk text-muted" },
  { key: "session",    icon: "▶", color: "bg-surface-sunk text-muted" },
] as const;

type WorkflowKey = typeof WORKFLOW_STEPS[number]["key"];

/* ── start options ── */
type StartOption = {
  id: string;
  icon: string;
  accentClass: string;
  labelKey: "studio.start.upload" | "studio.start.importTib" | "studio.start.tactileWorld" | "studio.start.sample";
  descKey: "studio.start.uploadDesc" | "studio.start.importTibDesc" | "studio.start.tactileWorldDesc" | "studio.start.sampleDesc";
  href: string;
  badge?: string;
};

const START_OPTIONS: StartOption[] = [
  {
    id: "upload",
    icon: "⬆",
    accentClass: "bg-accent text-white",
    labelKey: "studio.start.upload",
    descKey: "studio.start.uploadDesc",
    href: "/teacher",
  },
  {
    id: "tib",
    icon: "⠿",
    accentClass: "bg-blue-600 text-white",
    labelKey: "studio.start.importTib",
    descKey: "studio.start.importTibDesc",
    href: "/teacher",
    badge: "TIB",
  },
  {
    id: "tactileworld",
    icon: "🌐",
    accentClass: "bg-purple-600 text-white",
    labelKey: "studio.start.tactileWorld",
    descKey: "studio.start.tactileWorldDesc",
    href: "/teacher",
  },
  {
    id: "sample",
    icon: "▶",
    accentClass: "bg-surface-sunk text-muted",
    labelKey: "studio.start.sample",
    descKey: "studio.start.sampleDesc",
    href: "/guided-demo",
  },
];

const SUBJECT_LABEL: Record<string, { ko: string; en: string }> = {
  science:  { ko: "과학",   en: "Science" },
  math:     { ko: "수학",   en: "Math" },
  korean:   { ko: "국어",   en: "Korean" },
  social:   { ko: "사회",   en: "Social" },
};
const GRADE_LABEL: Record<string, { ko: string; en: string }> = {
  elementary: { ko: "초등", en: "Elem." },
  middle:     { ko: "중등", en: "Mid." },
  high:       { ko: "고등", en: "High" },
};

export function StudioView() {
  const { lang } = useLang();
  const L = useCallback((en: string, ko: string) => (lang === "ko" ? ko : en), [lang]);
  const wfLabel = useCallback((key: WorkflowKey): string => {
    const map: Record<WorkflowKey, [string, string]> = {
      upload:     ["Upload / Import",          "업로드 / 불러오기"],
      analysis:   ["AI Analysis",              "AI 분석"],
      tactileMap: ["Tactile Map",              "촉각 지도"],
      braille:    ["Braille Labels",           "점자 라벨"],
      audio:      ["Audio Guide",              "음성 안내"],
      steps:      ["Exploration Steps",        "탐색 단계"],
      review:     ["Expert Review",            "전문가 검수"],
      send:       ["Send to Dot Pad",          "Dot Pad 전송"],
      session:    ["Start Classroom Session",  "교실 수업 시작"],
    };
    const [en, ko] = map[key];
    return L(en, ko);
  }, [L]);

  return (
    <main id="main-content" className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6">

      {/* ── Header ── */}
      <header className="space-y-2">
        <p className="eyebrow">{L("Dot Lens Studio", "닷 렌즈 스튜디오")}</p>
        <h1 className="text-[28px] font-semibold text-ink sm:text-[34px]">
          {L("Create a Tactile Lesson", "촉각 수업 만들기")}
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
          {L(
            "Upload your material or import from TIB to build a Tactile Lesson Package — ready for expert review and Dot Pad output.",
            "자료를 업로드하거나 TIB에서 불러와 촉각 수업 패키지를 제작하세요 — 전문가 검수와 Dot Pad 출력까지 한 흐름으로."
          )}
        </p>
      </header>

      {/* ── Start options ── */}
      <section aria-label={L("Start a new lesson", "새 수업 시작")}>
        <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-widest text-muted">
          {L("How would you like to start?", "어떻게 시작하시겠어요?")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {START_OPTIONS.map((opt) => {
            const label = L(
              opt.labelKey === "studio.start.upload" ? "Upload Material" :
              opt.labelKey === "studio.start.importTib" ? "Import from TIB" :
              opt.labelKey === "studio.start.tactileWorld" ? "Open from Tactile World" :
              "Use Sample Lesson",
              opt.labelKey === "studio.start.upload" ? "자료 업로드" :
              opt.labelKey === "studio.start.importTib" ? "TIB에서 불러오기" :
              opt.labelKey === "studio.start.tactileWorld" ? "Tactile World에서 열기" :
              "샘플 수업 사용"
            );
            const desc = L(
              opt.descKey === "studio.start.uploadDesc" ? "Drag in a diagram, image, PDF, or worksheet from your device." :
              opt.descKey === "studio.start.importTibDesc" ? "Browse the Tactile Image Bank and pull approved tactile assets directly." :
              opt.descKey === "studio.start.tactileWorldDesc" ? "Access community-shared tactile lesson templates." :
              "Start with a pre-built sample to explore the full workflow without uploading.",
              opt.descKey === "studio.start.uploadDesc" ? "기기에서 다이어그램·이미지·PDF·학습지를 끌어다 놓으세요." :
              opt.descKey === "studio.start.importTibDesc" ? "Tactile Image Bank를 탐색해 검수된 촉각 자산을 직접 가져옵니다." :
              opt.descKey === "studio.start.tactileWorldDesc" ? "커뮤니티가 공유한 촉각 수업 템플릿에 접근합니다." :
              "업로드 없이 완성된 샘플로 전체 흐름을 체험하세요."
            );
            return (
              <Link
                key={opt.id}
                href={opt.href}
                className="group flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 shadow-card transition-all hover:border-accent/30 hover:shadow-lift"
              >
                <div className="flex items-start justify-between">
                  <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-[18px]", opt.accentClass)}>
                    {opt.icon}
                  </span>
                  {opt.badge && (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      {opt.badge}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-ink group-hover:text-accent">{label}</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Workflow pipeline ── */}
      <section aria-label={L("Lesson creation workflow", "수업 제작 흐름")}>
        <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-widest text-muted">
          {L("Lesson Creation Workflow", "수업 제작 흐름")}
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface p-5 shadow-card">
          <div className="flex min-w-max items-center gap-0">
            {WORKFLOW_STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <span className={cn("flex h-9 w-9 items-center justify-center rounded-full text-[15px] font-bold", s.color)}>
                    {s.icon}
                  </span>
                  <span className="w-20 text-center text-[10.5px] font-medium leading-tight text-muted">
                    {wfLabel(s.key)}
                  </span>
                </div>
                {i < WORKFLOW_STEPS.length - 1 && (
                  <span className="mx-2 mb-4 text-[13px] text-faint">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent packages ── */}
      <section aria-label={L("Recent lesson packages", "최근 패키지")}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-muted">
            {L("Recent Packages", "최근 패키지")}
          </h2>
          <Link href="/lesson-library" className="text-[12.5px] font-medium text-accent hover:underline">
            {L("View all →", "모두 보기 →")}
          </Link>
        </div>
        <div className="space-y-3">
          {SAMPLE_PACKAGES.map((pkg) => {
            const meta = REVIEW_STATUS_META[pkg.reviewStatus];
            const completePacks = pkg.localizationPacks.filter((p) => p.status === "complete").length;
            return (
              <div
                key={pkg.id}
                className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4 shadow-card transition-colors hover:border-accent/20"
              >
                {/* Subject icon */}
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-[18px] text-accent">
                  {pkg.subject === "science" ? "🔬" : pkg.subject === "math" ? "∑" : "𝒜"}
                </span>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-ink">
                    {lang === "ko" ? pkg.title.ko : pkg.title.en}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-surface-sunk px-2 py-0.5 text-[10.5px] font-medium text-muted">
                      {lang === "ko" ? SUBJECT_LABEL[pkg.subject]?.ko : SUBJECT_LABEL[pkg.subject]?.en}
                      {" · "}
                      {lang === "ko" ? GRADE_LABEL[pkg.grade]?.ko : GRADE_LABEL[pkg.grade]?.en}
                    </span>
                    <span className="rounded-full bg-surface-sunk px-2 py-0.5 text-[10.5px] font-medium text-muted">
                      {pkg.explorationSteps.length} {L("steps", "단계")}
                    </span>
                    <span className="rounded-full bg-surface-sunk px-2 py-0.5 text-[10.5px] font-medium text-muted">
                      {completePacks}/{pkg.localizationPacks.length} {L("locales", "언어팩")}
                    </span>
                  </div>
                </div>

                {/* Review badge */}
                <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold", meta.color)}>
                  {lang === "ko" ? meta.labelKo : meta.label}
                </span>

                {/* Action */}
                <Link
                  href={`/review-console`}
                  className="shrink-0 rounded-lg border border-accent/30 bg-accent-tint px-3 py-1.5 text-[12px] font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
                >
                  {L("Open", "열기")}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

    </main>
  );
}

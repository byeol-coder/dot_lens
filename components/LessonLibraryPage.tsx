"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { renderScene } from "@/lib/tactileScene";
import { getMatrix } from "@/lib/tactileMatrix";
import {
  LESSON_CATALOG,
  SUBJECTS,
  type LessonEntry,
  type Subject,
} from "@/lib/lessonLibrary";
import { DotPadScreen } from "@/components/premium/DotPadScreen";
import { ChromebookMockup } from "@/components/premium/ChromebookMockup";
import { GeminiInsightPanel } from "@/components/premium/cards";
import { StatusBadge } from "@/components/StatusBadge";
import { MyLessonsSection } from "@/components/MyLessonsSection";
import { cn } from "@/lib/cn";
import { useLang } from "@/lib/i18n";

const SUBJECT_TABS: Array<{ key: Subject | "all"; en: string; ko: string }> = [
  { key: "all",     en: "All",     ko: "전체" },
  { key: "korean",  en: "Korean",  ko: "국어" },
  { key: "math",    en: "Math",    ko: "수학" },
  { key: "science", en: "Science", ko: "과학" },
];

const GRADE_LABEL: Record<string, { en: string; ko: string }> = {
  elementary: { en: "Elementary", ko: "초등" },
  middle:     { en: "Middle",     ko: "중등" },
  high:       { en: "High",       ko: "고등" },
};

type ConvertStep = "idle" | "scanning" | "analyzing" | "ready";

const SCAN_MSGS: Array<{ en: string; ko: string }> = [
  { en: "Reading Google for Education lesson…",  ko: "Google for Education 레슨 읽는 중…" },
  { en: "Detecting diagram elements…",           ko: "다이어그램 요소 감지 중…" },
  { en: "Planning tactile layers…",              ko: "촉각 레이어 계획 중…" },
  { en: "Drafting braille & quiz…",              ko: "점자 & 퀴즈 초안 생성 중…" },
];

export function LessonLibraryPage() {
  const { lang } = useLang();
  const L = (en: string, ko: string) => lang === "ko" ? ko : en;

  const [activeSubject, setActiveSubject] = useState<Subject | "all">("all");
  const [urlInput, setUrlInput] = useState("");
  const [selectedLesson, setSelectedLesson] = useState<LessonEntry | null>(null);
  const [convertStep, setConvertStep] = useState<ConvertStep>("idle");
  const [scanMsg, setScanMsg] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered =
    activeSubject === "all"
      ? LESSON_CATALOG
      : LESSON_CATALOG.filter((l) => l.subject === activeSubject);

  function getMatrix4Lesson(lesson: LessonEntry) {
    if (lesson.id === "sci-water-cycle") return getMatrix("cycle");
    return renderScene(lesson.scene);
  }

  function startConvert(lesson: LessonEntry) {
    setSelectedLesson(lesson);
    setConvertStep("scanning");
    setScanMsg(0);

    let i = 0;
    const tick = () => {
      i += 1;
      if (i < SCAN_MSGS.length) {
        setScanMsg(i);
        timerRef.current = setTimeout(tick, 480);
      } else {
        setConvertStep("analyzing");
        timerRef.current = setTimeout(() => setConvertStep("ready"), 900);
      }
    };
    timerRef.current = setTimeout(tick, 450);
  }

  function handleUrlSubmit() {
    const match = LESSON_CATALOG.find((l) =>
      l.id.includes(
        urlInput.includes("kor") ? "kor" :
        urlInput.includes("math") ? "math" : "sci"
      )
    ) ?? LESSON_CATALOG[0];
    startConvert(match);
    setUrlInput("");
  }

  const isConverting = convertStep === "scanning" || convertStep === "analyzing";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">

      {/* URL 입력 훅 */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        <div className="relative overflow-hidden">
          <div className="spectrum-bar absolute inset-x-0 top-0 h-0.5 opacity-70" aria-hidden />
          <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono text-[11px] uppercase tracking-eyebrow text-accent">
                Google for Education
              </span>
              <StatusBadge variant="review">{L("Lesson Library", "Lesson Library 연동")}</StatusBadge>
            </div>
            <div className="flex flex-1 gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && urlInput && handleUrlSubmit()}
                placeholder={L("Paste https://lessonlibrary.withgoogle.com/… URL", "https://lessonlibrary.withgoogle.com/… URL 붙여넣기")}
                className="flex-1 rounded-xl border border-line bg-surface-sunk px-3 py-2.5 font-mono text-[13px] text-ink placeholder:text-faint"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                disabled={!urlInput || isConverting}
                className="rounded-xl bg-accent px-4 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-soft disabled:opacity-50"
              >
                {L("Convert →", "촉각 변환")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher-authored custom lessons (localStorage) */}
      <MyLessonsSection />

      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">

        {/* 레슨 카탈로그 */}
        <div>
          {/* 과목 탭 */}
          <div className="mb-5 flex gap-2">
            {SUBJECT_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveSubject(tab.key)}
                aria-pressed={activeSubject === tab.key}
                className={cn(
                  "rounded-xl border px-4 py-2 text-[13.5px] font-semibold transition-colors",
                  activeSubject === tab.key
                    ? "border-accent bg-accent text-white"
                    : "border-line bg-surface text-muted hover:bg-surface-sunk"
                )}
              >
                {L(tab.en, tab.ko)}
              </button>
            ))}
            <span className="ml-auto self-center font-mono text-[12px] text-faint">
              {L(`${filtered.length} lessons`, `${filtered.length}개 레슨`)}
            </span>
          </div>

          {/* 레슨 그리드 */}
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((lesson) => {
              const subject = SUBJECTS[lesson.subject];
              const active = selectedLesson?.id === lesson.id;
              return (
                <article
                  key={lesson.id}
                  className={cn(
                    "group relative flex flex-col rounded-2xl border bg-surface transition-all cursor-pointer",
                    "hover:-translate-y-0.5 hover:shadow-lift",
                    active
                      ? "border-accent shadow-glow"
                      : "border-line shadow-card"
                  )}
                  onClick={() => startConvert(lesson)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && startConvert(lesson)}
                  aria-pressed={active}
                >
                  {/* 촉각 미니 프리뷰 */}
                  <div className="relative overflow-hidden rounded-t-2xl bg-black">
                    <div className="h-[120px] overflow-hidden opacity-80">
                      <MiniTactile matrix={getMatrix4Lesson(lesson)} />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-3 pb-2">
                      <span
                        className="rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold text-ink"
                        style={{ background: subject.color }}
                      >
                        {L(subject.en, subject.ko)}
                      </span>
                      <span className="rounded-full bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white/80">
                        {L(GRADE_LABEL[lesson.grade].en, GRADE_LABEL[lesson.grade].ko)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <p className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">
                      {lesson.diagramType} · {L(`${lesson.objects.length} elements`, `${lesson.objects.length}개 요소`)}
                    </p>
                    <h3 className="mt-1 text-[15px] font-semibold text-ink">
                      {L(lesson.title.en, lesson.title.ko)}
                    </h3>
                    <p className="mt-1 flex-1 text-[13px] leading-relaxed text-muted line-clamp-2">
                      {L(lesson.description.en, lesson.description.ko)}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-mono text-[11px] text-faint">
                        {L(`${lesson.steps}-step explore`, `${lesson.steps}단계 탐색`)}
                      </span>
                      <span
                        className={cn(
                          "rounded-xl px-3 py-1.5 text-[12.5px] font-semibold transition-colors",
                          active
                            ? "bg-accent text-white"
                            : "bg-accent-tint text-accent group-hover:bg-accent group-hover:text-white"
                        )}
                      >
                        {active && convertStep !== "idle" ? L("Converting…", "변환 중…") : L("Convert →", "촉각 변환 →")}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* 변환 결과 패널 */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          {!selectedLesson ? (
            <div className="rounded-2xl border border-dashed border-line bg-surface-sunk p-8 text-center">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-surface shadow-card">
                <span className="font-mono text-[20px]">⠿</span>
              </div>
              <p className="text-[14px] font-medium text-ink">{L("Select a lesson", "레슨을 선택하세요")}</p>
              <p className="mt-1 text-[13px] text-muted">
                {L(
                  "Click a lesson card and Dot Lens will analyse the diagram and generate tactile output instantly.",
                  "레슨 카드를 클릭하면 닷 렌즈가 다이어그램을 분석하고 촉각 출력을 즉시 생성합니다."
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Chromebook + Dot Pad 목업 */}
              <ChromebookMockup barLabel="lessonlibrary.withgoogle.com · Dot Lens">
                <div className="space-y-3 p-3">
                  <div className="flex items-center justify-between">
                    <p className="eyebrow">
                      {L(SUBJECTS[selectedLesson.subject].en, SUBJECTS[selectedLesson.subject].ko)} · {L(GRADE_LABEL[selectedLesson.grade].en, GRADE_LABEL[selectedLesson.grade].ko)}
                    </p>
                    <StatusBadge variant={convertStep === "ready" ? "verified" : "pending"}>
                      {convertStep === "ready" ? "tactile-ready" : L("Converting…", "변환 중…")}
                    </StatusBadge>
                  </div>
                  <p className="font-display text-[15px] font-semibold text-ink">
                    {L(selectedLesson.title.en, selectedLesson.title.ko)}
                  </p>

                  {isConverting && (
                    <div className="space-y-2">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunk">
                        <div
                          className="h-full rounded-full spectrum-bar transition-all duration-500"
                          style={{ width: `${((scanMsg + 1) / SCAN_MSGS.length) * 100}%` }}
                        />
                      </div>
                      <p className="font-mono text-[11px] text-accent" aria-live="polite">
                        {L(SCAN_MSGS[scanMsg].en, SCAN_MSGS[scanMsg].ko)}
                      </p>
                    </div>
                  )}

                  {convertStep === "ready" && (
                    <GeminiInsightPanel>
                      {L(
                        `${selectedLesson.objects.length} elements detected · ${selectedLesson.diagramType} · ${selectedLesson.steps}-step tactile sequence generated`,
                        `${selectedLesson.objects.length}개 요소 감지 · ${selectedLesson.diagramType} · ${selectedLesson.steps}단계 촉각 시퀀스 생성됨`
                      )}
                    </GeminiInsightPanel>
                  )}
                </div>
              </ChromebookMockup>

              {/* Dot Pad 출력 */}
              {convertStep === "ready" && (
                <DotPadScreen
                  matrix={getMatrix4Lesson(selectedLesson)}
                  brailleText={selectedLesson.brailleLabel}
                  demoLabel={L(selectedLesson.title.en, selectedLesson.title.ko)}
                  objectName={L(selectedLesson.title.en, selectedLesson.title.ko)}
                />
              )}

              {/* 상세 정보 */}
              {convertStep === "ready" && (
                <div className="rounded-2xl border border-line bg-surface p-4 shadow-card">
                  <p className="eyebrow">{L("Audio guidance (F1)", "음성 안내 (F1)")}</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink">
                    {L(selectedLesson.audioGuide.en, selectedLesson.audioGuide.ko)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedLesson.scene.brailleKey?.map((k) => (
                      <span
                        key={k.mark}
                        className="rounded-lg border border-line bg-surface-sunk px-2.5 py-1 font-mono text-[11px] text-ink"
                      >
                        <span className="text-pin">{k.mark}</span> = {L(k.label.en, k.label.ko)}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link
                      href="/teacher"
                      className="flex-1 rounded-xl bg-accent px-3 py-2.5 text-center text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-soft"
                    >
                      {L("Go to Teacher Flow →", "교사 플로우로 이동 →")}
                    </Link>
                    <Link
                      href="/student"
                      className="flex-1 rounded-xl border border-line bg-surface px-3 py-2.5 text-center text-[13.5px] font-semibold text-ink transition-colors hover:bg-surface-sunk"
                    >
                      {L("Student Experience", "학생 체험")}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── 레슨 카드용 초소형 촉각 미리보기 (장식용, 100% 폭 채우기) ─ */
function MiniTactile({ matrix }: { matrix: ReturnType<typeof renderScene> }) {
  const cell = 5;
  const w = matrix.cols * cell;
  const h = matrix.rows * cell;
  const raised: Array<[number, number]> = [];
  for (let y = 0; y < matrix.rows; y++) {
    const row = matrix.cells[y] ?? [];
    for (let x = 0; x < matrix.cols; x++) {
      if (row[x]) raised.push([x, y]);
    }
  }
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" aria-hidden>
      <defs>
        <pattern id="mini-low" width={cell} height={cell} patternUnits="userSpaceOnUse">
          <circle cx={cell / 2} cy={cell / 2} r={0.9} fill="#2b2c30" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#mini-low)" />
      {raised.map(([x, y]) => (
        <circle
          key={`${x}-${y}`}
          cx={x * cell + cell / 2}
          cy={y * cell + cell / 2}
          r={2.0}
          fill="#f3f4f6"
        />
      ))}
    </svg>
  );
}

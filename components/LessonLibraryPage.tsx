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
import { cn } from "@/lib/cn";

const SUBJECT_TABS: Array<{ key: Subject | "all"; label: string }> = [
  { key: "all",     label: "전체" },
  { key: "korean",  label: "국어" },
  { key: "math",    label: "수학" },
  { key: "science", label: "과학" },
];

const GRADE_LABEL: Record<string, string> = {
  elementary: "초등",
  middle: "중등",
  high: "고등",
};

type ConvertStep = "idle" | "scanning" | "analyzing" | "ready";

const SCAN_MSGS = [
  "Google for Education 레슨 읽는 중…",
  "다이어그램 요소 감지 중…",
  "촉각 레이어 계획 중…",
  "점자 & 퀴즈 초안 생성 중…",
];

export function LessonLibraryPage() {
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
              <StatusBadge variant="review">Lesson Library 연동</StatusBadge>
            </div>
            <div className="flex flex-1 gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && urlInput && handleUrlSubmit()}
                placeholder="https://lessonlibrary.withgoogle.com/… URL 붙여넣기"
                className="flex-1 rounded-xl border border-line bg-surface-sunk px-3 py-2.5 font-mono text-[13px] text-ink placeholder:text-faint"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                disabled={!urlInput || isConverting}
                className="rounded-xl bg-accent px-4 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-soft disabled:opacity-50"
              >
                촉각 변환
              </button>
            </div>
          </div>
        </div>
      </div>

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
                {tab.label}
              </button>
            ))}
            <span className="ml-auto self-center font-mono text-[12px] text-faint">
              {filtered.length}개 레슨
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
                        {subject.ko}
                      </span>
                      <span className="rounded-full bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white/80">
                        {GRADE_LABEL[lesson.grade]}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <p className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">
                      {lesson.diagramType} · {lesson.objects.length}개 요소
                    </p>
                    <h3 className="mt-1 text-[15px] font-semibold text-ink">
                      {lesson.title.ko}
                    </h3>
                    <p className="mt-1 flex-1 text-[13px] leading-relaxed text-muted line-clamp-2">
                      {lesson.description.ko}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-mono text-[11px] text-faint">
                        {lesson.steps}단계 탐색
                      </span>
                      <span
                        className={cn(
                          "rounded-xl px-3 py-1.5 text-[12.5px] font-semibold transition-colors",
                          active
                            ? "bg-accent text-white"
                            : "bg-accent-tint text-accent group-hover:bg-accent group-hover:text-white"
                        )}
                      >
                        {active && convertStep !== "idle" ? "변환 중…" : "촉각 변환 →"}
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
              <p className="text-[14px] font-medium text-ink">레슨을 선택하세요</p>
              <p className="mt-1 text-[13px] text-muted">
                레슨 카드를 클릭하면 Gemini가 다이어그램을 분석하고<br />
                촉각 출력을 즉시 생성합니다.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Chromebook + Dot Pad 목업 */}
              <ChromebookMockup barLabel="lessonlibrary.withgoogle.com · Dot Lens">
                <div className="space-y-3 p-3">
                  <div className="flex items-center justify-between">
                    <p className="eyebrow">{SUBJECTS[selectedLesson.subject].ko} · {GRADE_LABEL[selectedLesson.grade]}</p>
                    <StatusBadge variant={convertStep === "ready" ? "verified" : "pending"}>
                      {convertStep === "ready" ? "tactile-ready" : "변환 중…"}
                    </StatusBadge>
                  </div>
                  <p className="font-display text-[15px] font-semibold text-ink">
                    {selectedLesson.title.ko}
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
                        {SCAN_MSGS[scanMsg]}
                      </p>
                    </div>
                  )}

                  {convertStep === "ready" && (
                    <GeminiInsightPanel>
                      {selectedLesson.objects.length}개 요소 감지 · {selectedLesson.diagramType} ·{" "}
                      {selectedLesson.steps}단계 촉각 시퀀스 생성됨
                    </GeminiInsightPanel>
                  )}
                </div>
              </ChromebookMockup>

              {/* Dot Pad 출력 */}
              {convertStep === "ready" && (
                <DotPadScreen
                  matrix={getMatrix4Lesson(selectedLesson)}
                  brailleText={selectedLesson.brailleLabel}
                  demoLabel={selectedLesson.title.ko}
                  objectName={selectedLesson.title.ko}
                />
              )}

              {/* 상세 정보 */}
              {convertStep === "ready" && (
                <div className="rounded-2xl border border-line bg-surface p-4 shadow-card">
                  <p className="eyebrow">음성 안내 (F1)</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink">
                    {selectedLesson.audioGuide.ko}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                  {selectedLesson.scene.brailleKey?.map((k) => (
                      <span
                        key={k.mark}
                        className="rounded-lg border border-line bg-surface-sunk px-2.5 py-1 font-mono text-[11px] text-ink"
                      >
                        <span className="text-pin">{k.mark}</span> = {k.label.ko}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link
                      href="/teacher"
                      className="flex-1 rounded-xl bg-accent px-3 py-2.5 text-center text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-soft"
                    >
                      교사 플로우로 이동 →
                    </Link>
                    <Link
                      href="/student"
                      className="flex-1 rounded-xl border border-line bg-surface px-3 py-2.5 text-center text-[13.5px] font-semibold text-ink transition-colors hover:bg-surface-sunk"
                    >
                      학생 체험
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

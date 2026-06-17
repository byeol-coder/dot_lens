"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Assignment, LocalizedText, VisualAnalysis } from "@/types";
import { ScreenCard } from "@/components/ScreenCard";
import { StatusBadge, type StatusVariant } from "@/components/StatusBadge";
import { TactileGrid } from "@/components/TactileGrid";
import { DotPadSimulator } from "@/components/DotPadSimulator";
import { Braille } from "@/components/Braille";
import { getMatrix } from "@/lib/tactileMatrix";
import { clientApi } from "@/lib/clientApi";
import { useLang, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const ASSIGNMENT_ID = "wc-001";

/** Resolve a bilingual string for the active language. */
const L = (o: LocalizedText | undefined, lang: Lang) => (o ? o[lang] : "");

interface BiStep {
  n: number;
  label: { en: string; ko: string };
}
const STEPS: BiStep[] = [
  { n: 1, label: { en: "Setup", ko: "설정" } },
  { n: 2, label: { en: "Scan", ko: "분석" } },
  { n: 3, label: { en: "Lens Insight", ko: "렌즈 인사이트" } },
  { n: 4, label: { en: "Tactile layers", ko: "촉각 레이어" } },
  { n: 5, label: { en: "Publish", ko: "게시" } },
];

const SCAN_STAGES: { en: string; ko: string }[] = [
  { en: "Reading the material…", ko: "자료를 읽고 있습니다…" },
  { en: "Detecting objects…", ko: "객체를 인식하고 있습니다…" },
  { en: "Planning tactile layers…", ko: "촉각 레이어를 구성하고 있습니다…" },
  { en: "Drafting braille & questions…", ko: "점자와 질문을 준비하고 있습니다…" },
];

interface LayerDef {
  id: string;
  name: { en: string; ko: string };
  matrixId: string;
  audio: { en: string; ko: string };
  difficulty: { en: string; ko: string };
}
const LAYERS: LayerDef[] = [
  {
    id: "overview",
    name: { en: "Overview Layer", ko: "전체 개요 레이어" },
    matrixId: "cycle",
    audio: { en: "Feel the whole water cycle as one connected loop.", ko: "물의 순환 전체를 하나의 연결된 흐름으로 느껴보세요." },
    difficulty: { en: "Intro", ko: "도입" },
  },
  {
    id: "object",
    name: { en: "Object Layer", ko: "객체 레이어" },
    matrixId: "cloud",
    audio: { en: "Each part — sun, water, cloud, rain — as a distinct shape.", ko: "태양·물·구름·비를 각각 구별되는 모양으로 만져봅니다." },
    difficulty: { en: "Core", ko: "핵심" },
  },
  {
    id: "arrow",
    name: { en: "Direction Layer", ko: "방향 레이어" },
    matrixId: "evaporation",
    audio: { en: "Follow the arrows: water rises, falls, and returns.", ko: "화살표를 따라가세요: 물이 오르고, 내리고, 다시 돌아옵니다." },
    difficulty: { en: "Core", ko: "핵심" },
  },
  {
    id: "quiz",
    name: { en: "Quiz Layer", ko: "확인 레이어" },
    matrixId: "rain",
    audio: { en: "Find each part when asked, then press F3 to check.", ko: "물어보는 부분을 찾고 F3을 눌러 확인하세요." },
    difficulty: { en: "Core", ko: "핵심" },
  },
];

type ScanPhase = "idle" | "scanning" | "done" | "error";

export function TeacherFlow() {
  const { lang } = useLang();
  const tr = (en: string, ko: string) => (lang === "ko" ? ko : en);
  const [step, setStep] = useState(1);

  // Step 1 — assignment setup
  const [form, setForm] = useState({
    title: tr("Explore the Water Cycle Diagram", "물의 순환 다이어그램 살펴보기"),
    subject: tr("Science", "과학"),
    gradeLevel: tr("Elementary", "초등"),
    objective: tr(
      "Understand evaporation, condensation, precipitation, and collection through tactile exploration.",
      "촉각 탐색을 통해 증발·응결·강수·모임의 과정을 이해합니다."
    ),
    material: tr("Water Cycle Diagram", "물의 순환 다이어그램"),
  });
  const [draftSaved, setDraftSaved] = useState(false);

  // Step 2/3 — scan + analysis
  const [scanPhase, setScanPhase] = useState<ScanPhase>("idle");
  const [scanStage, setScanStage] = useState(0);
  const [analysis, setAnalysis] = useState<VisualAnalysis | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  // Step 4/5 — tactile + braille QA gate
  const [generating, setGenerating] = useState(false);
  const [brailleJobId, setBrailleJobId] = useState<string | null>(null);
  const [brailleStatus, setBrailleStatus] = useState<string>("qa_pending");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [published, setPublished] = useState(false);
  const [simplified, setSimplified] = useState<Record<string, boolean>>({});
  const [labelled, setLabelled] = useState<Record<string, boolean>>({});

  // Prefill from the existing assignment (best-effort).
  useEffect(() => {
    clientApi
      .getAssignment(ASSIGNMENT_ID)
      .then((d: { assignment?: Assignment }) => {
        const a = d.assignment;
        if (!a) return;
        setForm((f) => ({
          ...f,
          title: a.title[lang] ?? f.title,
          subject: a.subject?.[lang] ?? f.subject,
          gradeLevel: a.gradeLevel?.[lang] ?? f.gradeLevel,
          objective: a.learningObjective?.[lang] ?? f.objective,
          material: a.materials?.[0]?.name[lang] ?? f.material,
        }));
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  async function runScan() {
    setScanPhase("scanning");
    setScanStage(0);
    setScanError(null);
    const interval = setInterval(
      () => setScanStage((s) => Math.min(s + 1, SCAN_STAGES.length - 1)),
      350
    );
    try {
      const data = await clientApi.scan(ASSIGNMENT_ID, "mat-wc-1");
      await new Promise((r) => setTimeout(r, 900));
      setAnalysis(data.analysis as VisualAnalysis);
      setScanPhase("done");
    } catch (e) {
      setScanError(e instanceof Error ? e.message : "scan error");
      setScanPhase("error");
    } finally {
      clearInterval(interval);
    }
  }

  async function refreshBraille(jobId: string) {
    try {
      const d = await clientApi.getBrailleJob(jobId);
      setBrailleStatus(d.job?.status ?? "qa_pending");
    } catch {
      /* ignore */
    }
  }

  async function generateTactile() {
    if (!analysis) return;
    setGenerating(true);
    try {
      const data = await clientApi.convert(analysis.id, "core");
      const jobId: string | undefined = data?.result?.brailleJobId;
      if (jobId) {
        setBrailleJobId(jobId);
        await refreshBraille(jobId);
      }
      setStep(4);
    } finally {
      setGenerating(false);
    }
  }

  const canPublish = brailleStatus === "approved";

  function goScan() {
    setStep(2);
    if (scanPhase === "idle") runScan();
  }

  function canGoTo(target: number): boolean {
    if (target <= step) return true;
    if (target >= 3 && scanPhase !== "done") return false;
    if (target >= 5 && !brailleJobId) return false;
    return true;
  }

  return (
    <div className="space-y-6">
      <Stepper step={step} onGo={(n) => canGoTo(n) && setStep(n)} canGoTo={canGoTo} />

      {step === 1 && (
        <SetupStep
          form={form}
          setForm={setForm}
          draftSaved={draftSaved}
          onSaveDraft={() => setDraftSaved(true)}
          onScan={goScan}
          scanned={scanPhase === "done"}
          canPublish={canPublish}
        />
      )}

      {step === 2 && (
        <ScannerStep
          phase={scanPhase}
          stage={scanStage}
          analysis={analysis}
          error={scanError}
          onRetry={runScan}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && analysis && (
        <AnalysisStep
          analysis={analysis}
          generating={generating}
          onGenerate={generateTactile}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <LayerEditorStep
          brailleStatus={brailleStatus}
          previewOpen={previewOpen}
          onTogglePreview={() => setPreviewOpen((v) => !v)}
          simplified={simplified}
          setSimplified={setSimplified}
          labelled={labelled}
          setLabelled={setLabelled}
          onBack={() => setStep(3)}
          onNext={() => setStep(5)}
        />
      )}

      {step === 5 && (
        <PublishStep
          brailleStatus={brailleStatus}
          canPublish={canPublish}
          published={published}
          onPublish={() => canPublish && setPublished(true)}
          onRecheck={() => brailleJobId && refreshBraille(brailleJobId)}
          onBack={() => setStep(4)}
        />
      )}
    </div>
  );
}

/* ============================ Stepper ============================ */
function Stepper({
  step,
  onGo,
  canGoTo,
}: {
  step: number;
  onGo: (n: number) => void;
  canGoTo: (n: number) => boolean;
}) {
  const { lang } = useLang();
  return (
    <nav aria-label={lang === "ko" ? "수업 만들기 단계" : "Lesson creation steps"}>
      <ol className="flex flex-wrap items-center gap-1 sm:gap-2">
        {STEPS.map((s, i) => {
          const active = s.n === step;
          const done = s.n < step;
          const reachable = canGoTo(s.n);
          return (
            <li key={s.n} className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => onGo(s.n)}
                disabled={!reachable}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:py-1.5 sm:text-[13px]",
                  active
                    ? "border-accent bg-accent text-white"
                    : done
                    ? "border-verify/40 bg-verify-tint text-verify"
                    : "border-line bg-surface text-muted hover:bg-surface-sunk"
                )}
              >
                <span className="grid h-5 w-5 place-items-center rounded-full bg-black/10 font-mono text-[11px]">
                  {done ? "✓" : s.n}
                </span>
                <span className="hidden sm:inline">{s.label[lang]}</span>
              </button>
              {i < STEPS.length - 1 && <span className="text-faint" aria-hidden>›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ============================ Step 1 — Setup ============================ */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[11px] uppercase tracking-eyebrow text-faint">
        {label}
      </span>
      {children}
    </label>
  );
}
const inputCls =
  "w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-[14px] text-ink placeholder:text-faint";

function SetupStep({
  form,
  setForm,
  draftSaved,
  onSaveDraft,
  onScan,
  scanned,
  canPublish,
}: {
  form: { title: string; subject: string; gradeLevel: string; objective: string; material: string };
  setForm: React.Dispatch<React.SetStateAction<typeof form>>;
  draftSaved: boolean;
  onSaveDraft: () => void;
  onScan: () => void;
  scanned: boolean;
  canPublish: boolean;
}) {
  const { lang } = useLang();
  const tr = (en: string, ko: string) => (lang === "ko" ? ko : en);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileTypeLabel, setFileTypeLabel] = useState<string>(tr("image", "이미지"));
  const [isDragOver, setIsDragOver] = useState(false);

  function handleFileChange(file: File) {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const typeLabel =
      ext === "pdf" ? "PDF" :
      ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)
        ? tr("image", "이미지") :
      ext === "pptx" || ext === "ppt" ? "PPT" :
      tr("file", "파일");
    setFileTypeLabel(typeLabel);
    setForm((f) => ({ ...f, material: file.name }));
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileChange(file);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  }

  const hasFile = !!form.material;

  return (
    <ScreenCard
      eyebrow={tr("Step 1 · lesson setup", "1단계 · 수업 설정")}
      title={tr("Set up the lesson", "수업 자료를 준비하세요")}
    >
      <p className="-mt-1 mb-4 text-[13px] leading-relaxed text-muted">
        {tr(
          "You don't need to create a perfect lesson on the first try. Start with a draft, then improve it through expert review.",
          "완벽한 자료를 만들 필요는 없습니다. 먼저 초안을 만든 뒤 전문가 검수를 통해 개선할 수 있습니다."
        )}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label={tr("Lesson title", "수업 제목")}>
            <input
              className={inputCls}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </Field>
        </div>
        <Field label={tr("Subject", "과목")}>
          <input className={inputCls} value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />
        </Field>
        <Field label={tr("Grade level", "학년")}>
          <input className={inputCls} value={form.gradeLevel} onChange={(e) => setForm((f) => ({ ...f, gradeLevel: e.target.value }))} />
        </Field>
        <div className="sm:col-span-2">
          <Field label={tr("Learning objective", "학습 목표")}>
            <textarea
              className={cn(inputCls, "min-h-[72px] resize-y")}
              value={form.objective}
              onChange={(e) => setForm((f) => ({ ...f, objective: e.target.value }))}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <span className="mb-1 block font-mono text-[11px] uppercase tracking-eyebrow text-faint">
            {tr("Classroom material", "수업 자료")}
          </span>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.ppt,.pptx"
            className="sr-only"
            aria-label={tr("Upload classroom material", "수업 자료 업로드")}
            onChange={onInputChange}
          />
          {hasFile ? (
            /* File selected — show name + change button */
            <div className="flex items-center justify-between rounded-xl border border-verify/40 bg-verify-tint/30 px-3 py-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-verify text-[15px]" aria-hidden>✓</span>
                <span className="truncate text-[14px] font-medium text-ink">{form.material}</span>
              </div>
              <div className="flex shrink-0 items-center gap-2 ml-2">
                <StatusBadge variant="verified">{fileTypeLabel}</StatusBadge>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="font-mono text-[11px] text-accent hover:underline"
                >
                  {tr("change", "변경")}
                </button>
              </div>
            </div>
          ) : (
            /* Drop zone — click or drag */
            <div
              role="button"
              tabIndex={0}
              aria-label={tr("Click or drag a file to upload", "클릭하거나 파일을 끌어다 놓아 업로드")}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={onDrop}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors",
                isDragOver
                  ? "border-accent bg-accent-tint/40"
                  : "border-line bg-surface-sunk hover:border-accent hover:bg-accent-tint/20"
              )}
            >
              <span className="text-[22px]" aria-hidden>⬆</span>
              <p className="text-[14px] font-medium text-ink">
                {tr("Click to upload a file", "클릭하여 파일 업로드")}
              </p>
              <p className="text-[12px] text-faint">
                {tr("or drag and drop · image, PDF, PPT", "또는 파일을 끌어다 놓으세요 · 이미지, PDF, PPT")}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <button
          type="button"
          onClick={onScan}
          className="rounded-xl bg-accent px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-accent-soft"
        >
          {tr("Analyze with Dot Lens", "닷 렌즈로 자료 분석하기")}
        </button>
        <button
          type="button"
          onClick={onSaveDraft}
          className="rounded-xl border border-line bg-surface px-4 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:bg-surface-sunk"
        >
          {tr("Save Draft", "임시 저장")}
        </button>
        {draftSaved && (
          <span className="font-mono text-[12px] text-verify" role="status">
            {tr("draft saved ✓", "임시 저장됨 ✓")}
          </span>
        )}
      </div>
    </ScreenCard>
  );
}

/* ============================ Step 2 — Scanner ============================ */
function ScannerStep({
  phase,
  stage,
  analysis,
  error,
  onRetry,
  onNext,
}: {
  phase: ScanPhase;
  stage: number;
  analysis: VisualAnalysis | null;
  error: string | null;
  onRetry: () => void;
  onNext: () => void;
}) {
  const { lang } = useLang();
  const tr = (en: string, ko: string) => (lang === "ko" ? ko : en);
  return (
    <ScreenCard
      eyebrow={tr("Step 2 · reading the material", "2단계 · 자료 분석")}
      title={tr("Dot Lens is reading your material", "닷 렌즈가 자료를 살펴봅니다")}
    >
      {phase === "scanning" && (
        <div className="py-6">
          <div className="mx-auto flex max-w-md flex-col items-center gap-4">
            <div className="pin-texture-dense h-24 w-full overflow-hidden rounded-xl border border-line bg-surface-sunk">
              <div className="h-0.5 w-full animate-pulse bg-accent" />
            </div>
            <p className="font-mono text-[13px] text-accent" aria-live="polite">
              {SCAN_STAGES[stage][lang]}
            </p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunk">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${((stage + 1) / SCAN_STAGES.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {phase === "error" && (
        <div className="py-4" role="alert">
          <p className="text-[14px] text-ink">
            {tr(
              "We couldn't read this material. You can try again or continue with a sample lesson.",
              "자료를 읽는 중 문제가 발생했습니다. 다시 시도하거나 샘플 자료로 계속 진행할 수 있습니다."
            )}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={onRetry} className="rounded-xl border border-accent bg-surface px-4 py-2 text-[13.5px] font-semibold text-accent hover:bg-accent-tint">
              {tr("Try again", "다시 시도")}
            </button>
            <button type="button" onClick={onRetry} className="rounded-xl bg-accent px-4 py-2 text-[13.5px] font-semibold text-white hover:bg-accent-soft">
              {tr("Continue with a sample lesson", "샘플 수업으로 계속하기")}
            </button>
          </div>
        </div>
      )}

      {phase === "done" && analysis && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">
              {tr("Recognized diagram", "인식된 다이어그램")}
            </span>
            <StatusBadge variant="review">{tr("Science process diagram", "과학 과정 다이어그램")}</StatusBadge>
            <StatusBadge variant="verified">{Math.round(analysis.confidence * 100)}% {tr("confidence", "신뢰도")}</StatusBadge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Recommendation title={tr("Key objects", "주요 객체")}>
              {analysis.detectedObjects.map((o) => L(o.label, lang)).join(", ")}
            </Recommendation>
            <Recommendation title={tr("Recommended tactile layers", "추천 촉각 레이어")}>
              {LAYERS.map((l) => l.name[lang].replace(/ Layer| 레이어/, "")).join(", ")}
            </Recommendation>
            <Recommendation title={tr("Braille summary", "점자 요약")}>
              <span className="inline-flex items-center gap-2">
                {tr("“water cycle”", "“물의 순환”")} <StatusBadge variant="pending">{tr("needs expert review", "전문가 검수 필요")}</StatusBadge>
              </span>
            </Recommendation>
            <Recommendation title={tr("Guided check", "안내형 확인")}>
              {tr(
                `${analysis.learningSteps?.length ?? 6}-step exploration + 3 questions`,
                `${analysis.learningSteps?.length ?? 6}단계 탐색 + 질문 3개`
              )}
            </Recommendation>
          </div>

          <div className="flex justify-end border-t border-line pt-4">
            <button type="button" onClick={onNext} className="rounded-xl bg-accent px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-accent-soft">
              {tr("Review Lens Insight →", "렌즈 인사이트 확인하기 →")}
            </button>
          </div>
        </div>
      )}
    </ScreenCard>
  );
}
function Recommendation({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-surface-sunk px-4 py-3">
      <p className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">{title}</p>
      <p className="mt-1 text-[13.5px] text-ink">{children}</p>
    </div>
  );
}

/* ============================ Step 3 — Lens Insight ============================ */
function AnalysisStep({
  analysis,
  generating,
  onGenerate,
  onBack,
}: {
  analysis: VisualAnalysis;
  generating: boolean;
  onGenerate: () => void;
  onBack: () => void;
}) {
  const { lang } = useLang();
  const tr = (en: string, ko: string) => (lang === "ko" ? ko : en);
  return (
    <ScreenCard
      eyebrow={tr("Step 3 · Lens Insight", "3단계 · 렌즈 인사이트")}
      title={tr("What Dot Lens found in the material", "닷 렌즈가 자료에서 찾은 것")}
    >
      <p className="text-[14px] leading-relaxed text-ink">{L(analysis.summary, lang)}</p>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <section>
          <h3 className="eyebrow">{tr("Key objects", "주요 객체")}</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {analysis.detectedObjects.map((o) => (
              <li key={o.id} className="rounded-full border border-line bg-paper px-3 py-1.5 text-[13px] text-ink">
                {L(o.label, lang)}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="eyebrow">{tr("Focus Area (touch first)", "핵심 탐색 영역")}</h3>
          <ol className="mt-2 space-y-1.5">
            {analysis.tactilePriority?.map((p) => (
              <li key={p.aspect} className="flex items-center gap-2.5 text-[13.5px] text-ink">
                <span className="grid h-5 w-5 place-items-center rounded-md bg-pin-soft font-mono text-[11px]">{p.rank}</span>
                {L(p.label, lang)}
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h3 className="eyebrow">{tr("Exploration order", "탐색 순서")}</h3>
          <ol className="mt-2 space-y-1.5">
            {analysis.learningSteps?.map((s) => (
              <li key={s.index} className="flex items-start gap-2.5 text-[13.5px] text-ink">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-accent-tint font-mono text-[11px] text-accent">{s.index}</span>
                {L(s.instruction, lang)}
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <button type="button" onClick={onBack} className="rounded-xl border border-line bg-surface px-4 py-2.5 text-[14px] font-semibold text-ink hover:bg-surface-sunk">
          ← {tr("Back", "이전")}
        </button>
        <button type="button" onClick={onGenerate} disabled={generating} className="rounded-xl bg-accent px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-accent-soft disabled:opacity-50">
          {generating ? tr("Generating…", "생성 중…") : tr("Generate Tactile View →", "촉각 보기 생성하기 →")}
        </button>
      </div>
    </ScreenCard>
  );
}

/* ============================ Step 4 — Layer editor ============================ */
function LayerEditorStep({
  brailleStatus,
  previewOpen,
  onTogglePreview,
  simplified,
  setSimplified,
  labelled,
  setLabelled,
  onBack,
  onNext,
}: {
  brailleStatus: string;
  previewOpen: boolean;
  onTogglePreview: () => void;
  simplified: Record<string, boolean>;
  setSimplified: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  labelled: Record<string, boolean>;
  setLabelled: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onBack: () => void;
  onNext: () => void;
}) {
  const { lang } = useLang();
  const tr = (en: string, ko: string) => (lang === "ko" ? ko : en);
  const brailleApproved = brailleStatus === "approved";
  return (
    <div className="space-y-5">
      <ScreenCard
        eyebrow={tr("Step 4 · tactile layers", "4단계 · 촉각 레이어")}
        title={tr("Review the tactile layers", "촉각 레이어를 확인하세요")}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {LAYERS.map((layer) => (
            <article key={layer.id} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-ink">{layer.name[lang]}</h3>
                <StatusBadge variant="draft">{layer.difficulty[lang]}</StatusBadge>
              </div>

              <TactileGrid
                className="mt-3"
                matrix={getMatrix(simplified[layer.id] ? "cycle" : layer.matrixId)}
                objectName={layer.name[lang]}
              />

              <div className="mt-3 space-y-2 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-muted">{tr("Braille summary", "점자 요약")}</span>
                  <span className="inline-flex items-center gap-2">
                    {labelled[layer.id] && <Braille word="cycle" />}
                    <StatusBadge variant={brailleApproved ? "verified" : "pending"}>
                      {brailleApproved ? tr("approved", "승인됨") : tr("needs review", "검수 필요")}
                    </StatusBadge>
                  </span>
                </div>
                <p className="text-muted">
                  <span className="font-medium text-ink">{tr("Audio", "음성")}:</span> {layer.audio[lang]}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="rounded-full bg-verify-tint px-2 py-0.5 font-mono text-verify">{tr("Tactile: Ready", "촉각: 준비됨")}</span>
                  <span className="rounded-full bg-verify-tint px-2 py-0.5 font-mono text-verify">{tr("Audio: Ready", "음성: 준비됨")}</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSimplified((s) => ({ ...s, [layer.id]: !s[layer.id] }))}
                  aria-pressed={!!simplified[layer.id]}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                    simplified[layer.id] ? "border-accent bg-accent-tint text-accent" : "border-line text-ink hover:bg-surface-sunk"
                  )}
                >
                  {tr("Simplify", "단순화")}{simplified[layer.id] ? " ✓" : ""}
                </button>
                <button
                  type="button"
                  onClick={() => setLabelled((s) => ({ ...s, [layer.id]: !s[layer.id] }))}
                  aria-pressed={!!labelled[layer.id]}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                    labelled[layer.id] ? "border-accent bg-accent-tint text-accent" : "border-line text-ink hover:bg-surface-sunk"
                  )}
                >
                  {tr("Add Braille Label", "점자 라벨 추가")}{labelled[layer.id] ? " ✓" : ""}
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <button type="button" onClick={onTogglePreview} className="rounded-xl border border-accent bg-surface px-4 py-2.5 text-[14px] font-semibold text-accent hover:bg-accent-tint">
            {previewOpen ? tr("Hide Dot Pad preview", "Dot Pad 미리보기 닫기") : tr("Preview on Dot Pad", "Dot Pad로 미리보기")}
          </button>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onBack} className="rounded-xl border border-line bg-surface px-4 py-2.5 text-[14px] font-semibold text-ink hover:bg-surface-sunk">
              ← {tr("Back", "이전")}
            </button>
            <button type="button" onClick={onNext} className="rounded-xl bg-accent px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-accent-soft">
              {tr("Publish readiness →", "게시 준비 →")}
            </button>
          </div>
        </div>
      </ScreenCard>

      {previewOpen && (
        <div>
          <p className="mb-2 eyebrow">{tr("Live Dot Pad preview", "Dot Pad 실시간 미리보기")}</p>
          <DotPadSimulator />
        </div>
      )}
    </div>
  );
}

/* ============================ Step 5 — Publish readiness ============================ */
function PublishStep({
  brailleStatus,
  canPublish,
  published,
  onPublish,
  onRecheck,
  onBack,
}: {
  brailleStatus: string;
  canPublish: boolean;
  published: boolean;
  onPublish: () => void;
  onRecheck: () => void;
  onBack: () => void;
}) {
  const { lang } = useLang();
  const tr = (en: string, ko: string) => (lang === "ko" ? ko : en);
  const rows: Array<{ label: string; variant: StatusVariant; status: string }> = [
    { label: tr("Tactile Graphic", "촉각 그래픽"), variant: "verified", status: tr("Ready", "준비됨") },
    {
      label: tr("Braille Summary", "점자 요약"),
      variant: canPublish ? "verified" : "pending",
      status: canPublish ? tr("Ready", "준비됨") : tr("Needs Expert Review", "전문가 검수 필요"),
    },
    { label: tr("Audio Guide", "음성 안내"), variant: "verified", status: tr("Ready", "준비됨") },
    { label: tr("Check Questions", "확인 질문"), variant: "verified", status: tr("Ready", "준비됨") },
  ];

  return (
    <ScreenCard
      eyebrow={tr("Step 5 · publish readiness", "5단계 · 게시 준비")}
      title={tr("Ready to publish?", "게시할 준비가 되었나요?")}
    >
      <ul className="divide-y divide-line">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center justify-between py-3">
            <span className="text-[14px] text-ink">{r.label}</span>
            <StatusBadge variant={r.variant}>{r.status}</StatusBadge>
          </li>
        ))}
      </ul>

      {!canPublish && (
        <div className="mt-4 rounded-xl border border-[#EBD9B6] bg-[#FBF3E2] px-4 py-3">
          <p className="text-[13.5px] text-warn">
            {tr(
              "Braille is sent for expert review before students use it — this keeps the quality high.",
              "점자는 학생이 사용하기 전에 전문가 검수를 거칩니다. 수업 전 품질을 함께 확인할 수 있습니다."
            )}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link href="/expert-review" className="rounded-lg bg-warn px-3 py-1.5 text-[13px] font-semibold text-white hover:brightness-95">
              {tr("Open expert review", "전문가 검수 열기")}
            </Link>
            <button type="button" onClick={onRecheck} className="rounded-lg border border-line bg-surface px-3 py-1.5 text-[13px] font-semibold text-ink hover:bg-surface-sunk">
              {tr("Re-check status", "상태 다시 확인")}
            </button>
          </div>
        </div>
      )}

      {published && (
        <p className="mt-4 rounded-xl bg-verify-tint px-4 py-3 text-[13.5px] text-verify" role="status">
          {tr(
            "Added to Class 5B ✓ — students can now open it on their Dot Pad.",
            "5B 학급에 추가되었습니다 ✓ — 이제 학생이 Dot Pad에서 열어볼 수 있습니다."
          )}
        </p>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <button type="button" onClick={onBack} className="rounded-xl border border-line bg-surface px-4 py-2.5 text-[14px] font-semibold text-ink hover:bg-surface-sunk">
          ← {tr("Back", "이전")}
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={!canPublish || published}
          title={canPublish ? undefined : tr("Expert review must pass first", "전문가 검수를 먼저 통과해야 합니다")}
          className="rounded-xl bg-accent px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          {published ? tr("Published ✓", "게시됨 ✓") : tr("Add to Class", "학급에 추가")}
        </button>
      </div>
    </ScreenCard>
  );
}

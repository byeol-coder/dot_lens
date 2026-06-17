"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Assignment, VisualAnalysis } from "@/types";
import { ScreenCard } from "@/components/ScreenCard";
import { StatusBadge, type StatusVariant } from "@/components/StatusBadge";
import { TactileGrid } from "@/components/TactileGrid";
import { DotPadSimulator } from "@/components/DotPadSimulator";
import { Braille } from "@/components/Braille";
import { getMatrix } from "@/lib/tactileMatrix";
import { clientApi } from "@/lib/clientApi";
import { cn } from "@/lib/cn";

const ASSIGNMENT_ID = "wc-001";

const STEPS = [
  { n: 1, label: "Setup" },
  { n: 2, label: "Scan" },
  { n: 3, label: "Analysis" },
  { n: 4, label: "Tactile layers" },
  { n: 5, label: "Publish" },
];

const SCAN_STAGES = [
  "Reading the material…",
  "Detecting objects…",
  "Planning tactile layers…",
  "Drafting braille & quiz…",
];

interface LayerDef {
  id: string;
  name: string;
  matrixId: string;
  audio: string;
  difficulty: string;
}
const LAYERS: LayerDef[] = [
  { id: "overview", name: "Overview Layer", matrixId: "cycle", audio: "Feel the whole water cycle as one connected loop.", difficulty: "Intro" },
  { id: "object", name: "Object Layer", matrixId: "cloud", audio: "Each part — sun, water, cloud, rain — as a distinct shape.", difficulty: "Core" },
  { id: "arrow", name: "Direction Arrow Layer", matrixId: "evaporation", audio: "Follow the arrows: water rises, falls, and returns.", difficulty: "Core" },
  { id: "quiz", name: "Quiz Layer", matrixId: "rain", audio: "Find each part when asked, then press F3 to check.", difficulty: "Core" },
];

type ScanPhase = "idle" | "scanning" | "done" | "error";

export function TeacherFlow() {
  const [step, setStep] = useState(1);

  // Step 1 — assignment setup
  const [form, setForm] = useState({
    title: "Explore the Water Cycle Diagram",
    subject: "Science",
    gradeLevel: "Elementary",
    objective:
      "Understand evaporation, condensation, precipitation, and collection through tactile exploration.",
    material: "Water Cycle Diagram",
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

  // Prefill from the existing assignment API (best-effort).
  useEffect(() => {
    clientApi
      .getAssignment(ASSIGNMENT_ID)
      .then((d: { assignment?: Assignment }) => {
        const a = d.assignment;
        if (!a) return;
        setForm((f) => ({
          ...f,
          title: a.title.en,
          subject: a.subject ?? f.subject,
          gradeLevel: a.gradeLevel ?? f.gradeLevel,
          objective: a.learningObjective?.en ?? f.objective,
          material: a.materials?.[0]?.name.en ?? f.material,
        }));
      })
      .catch(() => {});
  }, []);

  async function runScan() {
    setScanPhase("scanning");
    setScanStage(0);
    setScanError(null);
    const started = Date.now();
    const interval = setInterval(
      () => setScanStage((s) => Math.min(s + 1, SCAN_STAGES.length - 1)),
      350
    );
    try {
      const data = await clientApi.scan(ASSIGNMENT_ID, "mat-wc-1");
      // keep the animation visible for a moment
      await new Promise((r) => setTimeout(r, Math.max(0, 1300 - (Date.now() - started))));
      setAnalysis(data.analysis as VisualAnalysis);
      setScanPhase("done");
    } catch (e) {
      setScanError(e instanceof Error ? e.message : "Scan failed");
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

  /* ----- step navigation guard ----- */
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
  return (
    <nav aria-label="Assignment creation steps">
      <ol className="flex flex-wrap items-center gap-2">
        {STEPS.map((s, i) => {
          const active = s.n === step;
          const done = s.n < step;
          const reachable = canGoTo(s.n);
          return (
            <li key={s.n} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onGo(s.n)}
                disabled={!reachable}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
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
                {s.label}
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
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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
  return (
    <ScreenCard eyebrow="Step 1 · assignment builder" title="Set up the assignment">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Assignment title">
            <input
              className={inputCls}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </Field>
        </div>
        <Field label="Subject">
          <input className={inputCls} value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />
        </Field>
        <Field label="Grade level">
          <input className={inputCls} value={form.gradeLevel} onChange={(e) => setForm((f) => ({ ...f, gradeLevel: e.target.value }))} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Learning objective">
            <textarea
              className={cn(inputCls, "min-h-[72px] resize-y")}
              value={form.objective}
              onChange={(e) => setForm((f) => ({ ...f, objective: e.target.value }))}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Visual material">
            <div className="flex items-center justify-between rounded-xl border border-line bg-surface-sunk px-3 py-2.5">
              <span className="text-[14px] text-ink">{form.material}</span>
              <StatusBadge variant="draft">image</StatusBadge>
            </div>
          </Field>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <button
          type="button"
          onClick={onScan}
          className="rounded-xl bg-accent px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-accent-soft"
        >
          Scan Material
        </button>
        <button
          type="button"
          disabled={!scanned}
          title={scanned ? undefined : "Scan the material first"}
          className="rounded-xl border border-line bg-surface px-4 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:bg-surface-sunk disabled:opacity-50"
        >
          Generate Tactile Version
        </button>
        <button
          type="button"
          onClick={onSaveDraft}
          className="rounded-xl border border-line bg-surface px-4 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:bg-surface-sunk"
        >
          Save Draft
        </button>
        <button
          type="button"
          disabled={!canPublish}
          title={canPublish ? undefined : "Braille must pass expert review first"}
          className="rounded-xl border border-line bg-surface px-4 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:bg-surface-sunk disabled:opacity-50"
        >
          Attach to Classroom
        </button>
        {draftSaved && (
          <span className="font-mono text-[12px] text-verify" role="status">draft saved ✓</span>
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
  return (
    <ScreenCard eyebrow="Step 2 · material scanner" title="Scan with Dot Lens (Gemini)">
      {phase === "scanning" && (
        <div className="py-6">
          <div className="mx-auto flex max-w-md flex-col items-center gap-4">
            <div className="pin-texture-dense h-24 w-full overflow-hidden rounded-xl border border-line bg-surface-sunk">
              <div className="h-0.5 w-full animate-pulse bg-accent" />
            </div>
            <p className="font-mono text-[13px] text-accent" aria-live="polite">
              {SCAN_STAGES[stage]}
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
        <div className="py-4">
          <p className="text-[14px] text-ink">Scan failed.</p>
          <p className="mt-1 font-mono text-[12px] text-faint">{error}</p>
          <button type="button" onClick={onRetry} className="mt-3 rounded-xl border border-line bg-surface px-4 py-2 text-[13.5px] font-semibold text-ink hover:bg-surface-sunk">
            Try again
          </button>
        </div>
      )}

      {phase === "done" && analysis && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">Detected diagram type</span>
            <StatusBadge variant="review">Science process diagram</StatusBadge>
            <StatusBadge variant="verified">{Math.round(analysis.confidence * 100)}% confidence</StatusBadge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Recommendation title="Detected objects">
              {analysis.detectedObjects.map((o) => o.label.en).join(", ")}
            </Recommendation>
            <Recommendation title="Recommended tactile layers">
              {LAYERS.map((l) => l.name.replace(" Layer", "")).join(", ")}
            </Recommendation>
            <Recommendation title="Recommended braille summary">
              <span className="inline-flex items-center gap-2">
                “water cycle” <StatusBadge variant="pending">needs expert review</StatusBadge>
              </span>
            </Recommendation>
            <Recommendation title="Recommended guided quiz">
              {analysis.learningSteps?.length ?? 6}-step exploration + 3-question quiz
            </Recommendation>
          </div>

          <div className="flex justify-end border-t border-line pt-4">
            <button type="button" onClick={onNext} className="rounded-xl bg-accent px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-accent-soft">
              View full analysis →
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

/* ============================ Step 3 — Analysis ============================ */
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
  return (
    <ScreenCard eyebrow="Step 3 · Gemini tactile analysis" title="Detected diagram">
      <p className="text-[14px] leading-relaxed text-ink">{analysis.summary?.en}</p>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <section>
          <h3 className="eyebrow">Detected objects</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {analysis.detectedObjects.map((o) => (
              <li key={o.id} className="rounded-full border border-line bg-paper px-3 py-1.5 text-[13px] text-ink">
                {o.label.en}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="eyebrow">Tactile priority</h3>
          <ol className="mt-2 space-y-1.5">
            {analysis.tactilePriority?.map((p) => (
              <li key={p.aspect} className="flex items-center gap-2.5 text-[13.5px] text-ink">
                <span className="grid h-5 w-5 place-items-center rounded-md bg-pin-soft font-mono text-[11px]">{p.rank}</span>
                {p.label.en}
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h3 className="eyebrow">Learning steps</h3>
          <ol className="mt-2 space-y-1.5">
            {analysis.learningSteps?.map((s) => (
              <li key={s.index} className="flex items-start gap-2.5 text-[13.5px] text-ink">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-accent-tint font-mono text-[11px] text-accent">{s.index}</span>
                {s.instruction.en}
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <button type="button" onClick={onBack} className="rounded-xl border border-line bg-surface px-4 py-2.5 text-[14px] font-semibold text-ink hover:bg-surface-sunk">
          ← Back
        </button>
        <button type="button" onClick={onGenerate} disabled={generating} className="rounded-xl bg-accent px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-accent-soft disabled:opacity-50">
          {generating ? "Generating…" : "Generate Tactile Version →"}
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
  const brailleApproved = brailleStatus === "approved";
  return (
    <div className="space-y-5">
      <ScreenCard eyebrow="Step 4 · tactile layer editor" title="Review the tactile layers">
        <div className="grid gap-5 sm:grid-cols-2">
          {LAYERS.map((layer) => (
            <article key={layer.id} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-ink">{layer.name}</h3>
                <StatusBadge variant="draft">{layer.difficulty}</StatusBadge>
              </div>

              <TactileGrid
                className="mt-3"
                matrix={getMatrix(simplified[layer.id] ? "cycle" : layer.matrixId)}
                objectName={layer.name}
              />

              <div className="mt-3 space-y-2 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Braille summary</span>
                  <span className="inline-flex items-center gap-2">
                    {labelled[layer.id] && <Braille word="cycle" />}
                    <StatusBadge variant={brailleApproved ? "verified" : "pending"}>
                      {brailleApproved ? "approved" : "needs review"}
                    </StatusBadge>
                  </span>
                </div>
                <p className="text-muted">
                  <span className="font-medium text-ink">Audio:</span> {layer.audio}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="rounded-full bg-verify-tint px-2 py-0.5 font-mono text-verify">Tactile: Ready</span>
                  <span className="rounded-full bg-verify-tint px-2 py-0.5 font-mono text-verify">Audio: Ready</span>
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
                  Simplify{simplified[layer.id] ? " ✓" : ""}
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
                  Add Braille Label{labelled[layer.id] ? " ✓" : ""}
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <button type="button" onClick={onTogglePreview} className="rounded-xl border border-accent bg-surface px-4 py-2.5 text-[14px] font-semibold text-accent hover:bg-accent-tint">
            {previewOpen ? "Hide Dot Pad preview" : "Preview on Dot Pad"}
          </button>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onBack} className="rounded-xl border border-line bg-surface px-4 py-2.5 text-[14px] font-semibold text-ink hover:bg-surface-sunk">
              ← Back
            </button>
            <button type="button" onClick={onNext} className="rounded-xl bg-accent px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-accent-soft">
              Publish readiness →
            </button>
          </div>
        </div>
      </ScreenCard>

      {previewOpen && (
        <div>
          <p className="mb-2 eyebrow">Live Dot Pad preview</p>
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
  const rows: Array<{ label: string; variant: StatusVariant; status: string }> = [
    { label: "Tactile Graphic", variant: "verified", status: "Ready" },
    {
      label: "Braille Summary",
      variant: canPublish ? "verified" : "pending",
      status: canPublish ? "Ready" : "Needs Expert Review",
    },
    { label: "Audio Guide", variant: "verified", status: "Ready" },
    { label: "Quiz", variant: "verified", status: "Ready" },
  ];

  return (
    <ScreenCard eyebrow="Step 5 · publish readiness" title="Ready to publish?">
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
            Braille output requires expert review before publishing to students.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link href="/review" className="rounded-lg bg-warn px-3 py-1.5 text-[13px] font-semibold text-white hover:brightness-95">
              Open Braille QA review
            </Link>
            <button type="button" onClick={onRecheck} className="rounded-lg border border-line bg-surface px-3 py-1.5 text-[13px] font-semibold text-ink hover:bg-surface-sunk">
              Re-check braille status
            </button>
          </div>
        </div>
      )}

      {published && (
        <p className="mt-4 rounded-xl bg-verify-tint px-4 py-3 text-[13.5px] text-verify" role="status">
          Published to Class 5B ✓ (mock) — students can now open it on their Dot Pad.
        </p>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <button type="button" onClick={onBack} className="rounded-xl border border-line bg-surface px-4 py-2.5 text-[14px] font-semibold text-ink hover:bg-surface-sunk">
          ← Back
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={!canPublish || published}
          title={canPublish ? undefined : "Braille must pass expert review first"}
          className="rounded-xl bg-accent px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          {published ? "Published ✓" : "Attach to Classroom"}
        </button>
      </div>
    </ScreenCard>
  );
}

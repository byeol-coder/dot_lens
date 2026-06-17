"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { BrailleStandard, LocalizedText } from "@/types";
import type { Primitive } from "@/lib/tactileScene";
import { renderScene } from "@/lib/tactileScene";
import { buildSummary } from "@/lib/brailleEngine";
import { runQA, hasBlockingIssues } from "@/lib/brailleQA";
import {
  LESSON_TEMPLATES,
  buildFromTemplate,
  saveCustomLesson,
  getCustomLesson,
  newId,
  suggestBrailleLabel,
  toPlayableLesson,
  type BuilderObject,
  type CustomLesson,
} from "@/lib/customLessons";
import { DotPadScreen } from "@/components/premium/DotPadScreen";
import { LessonExplorer } from "@/components/LessonExplorer";
import { StatusBadge } from "@/components/StatusBadge";
import { ScreenCard } from "@/components/ScreenCard";
import { useLang } from "@/lib/i18n";
import { useA11y } from "@/components/AccessibilityProvider";
import { cn } from "@/lib/cn";

/* sessionStorage handoff: library "Edit" stashes a lesson id here. */
const EDIT_KEY = "dotlens.builder.editId";

type ShapeKind = Primitive["kind"];
const EDITABLE_KINDS: ShapeKind[] = ["disc", "ring", "rect", "line", "arrow", "texture"];

const KIND_LABEL: Record<ShapeKind, { en: string; ko: string }> = {
  disc: { en: "Filled circle", ko: "채운 원" },
  ring: { en: "Ring (outline circle)", ko: "링 (원 테두리)" },
  rect: { en: "Rectangle / box", ko: "사각형 / 상자" },
  line: { en: "Line", ko: "선" },
  arrow: { en: "Arrow", ko: "화살표" },
  texture: { en: "Textured area", ko: "질감 영역" },
  dots: { en: "Dot set", ko: "점 집합" },
};

function defaultPrimitive(kind: ShapeKind): Primitive {
  switch (kind) {
    case "disc": return { kind: "disc", cx: 30, cy: 20, r: 6 };
    case "ring": return { kind: "ring", cx: 30, cy: 20, r: 8 };
    case "rect": return { kind: "rect", x: 22, y: 14, w: 16, h: 12, fill: false };
    case "line": return { kind: "line", x1: 10, y1: 20, x2: 50, y2: 20 };
    case "arrow": return { kind: "arrow", x1: 10, y1: 20, x2: 50, y2: 20 };
    case "texture": return { kind: "texture", x: 20, y: 12, w: 20, h: 16, step: 2 };
    case "dots": return { kind: "dots", points: [[30, 20] as [number, number]] };
  }
}

function brailleStandardFor(lesson: CustomLesson): BrailleStandard {
  return lesson.language === "ko" ? "KO-G1" : "UEB-G1";
}

/* ─────────────────────────────────────────────────────────────── */

export function CustomLessonBuilder() {
  const { lang } = useLang();
  const { announce } = useA11y();
  const L = (en: string, ko: string) => (lang === "ko" ? ko : en);

  const [lesson, setLesson] = useState<CustomLesson | null>(null);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [previewOverview, setPreviewOverview] = useState(false);
  const [tryOpen, setTryOpen] = useState(false);
  const [tryNonce, setTryNonce] = useState(0);
  const [saved, setSaved] = useState(false);

  // Load an edit target (from the library) or show the template picker.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const editId = window.sessionStorage.getItem(EDIT_KEY);
    if (editId) {
      window.sessionStorage.removeItem(EDIT_KEY);
      const existing = getCustomLesson(editId);
      if (existing) {
        setLesson(existing);
        setSelectedObjectId(existing.objects[0]?.id ?? null);
      }
    }
  }, []);

  function start(templateId: string) {
    const l = buildFromTemplate(templateId);
    setLesson(l);
    setSelectedObjectId(l.objects[0]?.id ?? null);
    setSaved(false);
  }

  function update(patch: Partial<CustomLesson>) {
    setLesson((l) => (l ? { ...l, ...patch } : l));
    setSaved(false);
  }

  function updateObject(id: string, patch: Partial<BuilderObject>) {
    setLesson((l) =>
      l ? { ...l, objects: l.objects.map((o) => (o.id === id ? { ...o, ...patch } : o)) } : l
    );
    setSaved(false);
  }

  function addObject() {
    if (!lesson) return;
    const o: BuilderObject = {
      id: newId("o"),
      name: { en: `Object ${lesson.objects.length + 1}`, ko: `객체 ${lesson.objects.length + 1}` },
      brailleLabel: `Object ${lesson.objects.length + 1}`,
      primitives: [defaultPrimitive("disc")],
      explain: { en: "", ko: "" },
      hint: { en: "", ko: "" },
    };
    update({ objects: [...lesson.objects, o] });
    setSelectedObjectId(o.id);
    announce(L("Object added", "객체가 추가되었습니다"));
  }

  function removeObject(id: string) {
    if (!lesson) return;
    const objects = lesson.objects.filter((o) => o.id !== id);
    update({
      objects,
      quiz: lesson.quiz.filter((q) => q.answerObjectId !== id),
    });
    if (selectedObjectId === id) setSelectedObjectId(objects[0]?.id ?? null);
  }

  function moveObject(id: string, dir: -1 | 1) {
    if (!lesson) return;
    const i = lesson.objects.findIndex((o) => o.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= lesson.objects.length) return;
    const objects = [...lesson.objects];
    [objects[i], objects[j]] = [objects[j], objects[i]];
    update({ objects });
  }

  /* ---- derived: braille QA over labels + summary ---- */
  const qa = useMemo(() => {
    if (!lesson) return null;
    const std = brailleStandardFor(lesson);
    const text = [lesson.brailleSummary, ...lesson.objects.map((o) => o.brailleLabel)]
      .filter(Boolean)
      .join(" ");
    const { summary, untranslatable } = buildSummary(text || " ", std, lesson.language);
    const cells = summary.pages.flatMap((p) => p.cells);
    const issues = runQA(text, lesson.language, summary.standard, cells, untranslatable);
    return { issues, blocked: hasBlockingIssues(issues), standard: summary.standard };
  }, [lesson]);

  const playable = useMemo(() => (lesson ? toPlayableLesson(lesson) : null), [lesson]);

  const selected = lesson?.objects.find((o) => o.id === selectedObjectId) ?? null;
  const previewMatrix = useMemo(() => {
    if (!lesson) return { cols: 60, rows: 40, cells: [] as number[][] };
    if (previewOverview) {
      return renderScene({
        id: "ov",
        title: lesson.title,
        type: "process",
        primitives: lesson.objects.flatMap((o) => o.primitives),
      });
    }
    if (!selected) return { cols: 60, rows: 40, cells: [] as number[][] };
    return renderScene({ id: selected.id, title: selected.name, type: "process", primitives: selected.primitives });
  }, [lesson, selected, previewOverview]);

  function doSave(markReady: boolean) {
    if (!lesson) return;
    if (markReady && qa?.blocked) {
      announce(L("Resolve braille issues before publishing", "게시 전 점자 문제를 해결하세요"));
      return;
    }
    const status = markReady ? "ready" : lesson.status;
    const stored = saveCustomLesson({ ...lesson, status });
    setLesson(stored);
    setSaved(true);
    announce(markReady ? L("Lesson published", "수업이 게시되었습니다") : L("Draft saved", "임시 저장되었습니다"));
  }

  /* ─────────────── template picker ─────────────── */
  if (!lesson) {
    return (
      <div className="space-y-5">
        <ScreenCard
          eyebrow={L("New tactile lesson", "새 촉각 수업")}
          title={L("Start from a template", "템플릿에서 시작하기")}
        >
          <p className="-mt-1 mb-4 text-[13.5px] leading-relaxed text-muted">
            {L(
              "Pick a starting point — every template is fully editable. You shape, label, and narrate each object; Dot Lens renders it on the 60×40 Dot Pad and checks the braille.",
              "시작점을 고르세요 — 모든 템플릿은 자유롭게 편집됩니다. 객체마다 모양·라벨·설명을 정하면, 닷 렌즈가 60×40 Dot Pad에 렌더링하고 점자를 검수합니다."
            )}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {LESSON_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => start(t.id)}
                className="rounded-2xl border border-line bg-surface p-4 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-lift"
              >
                <h3 className="text-[15px] font-semibold text-ink">{L(t.name.en, t.name.ko)}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{L(t.description.en, t.description.ko)}</p>
                <span className="mt-3 inline-block rounded-lg bg-accent-tint px-3 py-1.5 text-[12.5px] font-semibold text-accent">
                  {L("Use template →", "템플릿 사용 →")}
                </span>
              </button>
            ))}
          </div>
        </ScreenCard>
      </div>
    );
  }

  /* ─────────────── editor ─────────────── */
  return (
    <div className="space-y-5">
      {/* Lesson meta */}
      <ScreenCard
        eyebrow={L("Lesson details", "수업 정보")}
        title={L("Describe the lesson", "수업을 설명하세요")}
        action={
          <StatusBadge variant={lesson.status === "ready" ? "verified" : "draft"}>
            {lesson.status === "ready" ? L("ready", "준비됨") : L("draft", "초안")}
          </StatusBadge>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <BiField
            label={L("Title", "제목")}
            value={lesson.title}
            onChange={(v) => update({ title: v })}
            lang={lang}
          />
          <div className="grid grid-cols-2 gap-3">
            <BiField label={L("Subject", "과목")} value={lesson.subject} onChange={(v) => update({ subject: v })} lang={lang} compact />
            <BiField label={L("Grade", "학년")} value={lesson.gradeLevel} onChange={(v) => update({ gradeLevel: v })} lang={lang} compact />
          </div>
          <label className="block">
            <span className="mb-1 block font-mono text-[11px] uppercase tracking-eyebrow text-faint">
              {L("Braille language", "점자 언어")}
            </span>
            <select
              className={inputCls}
              value={lesson.language}
              onChange={(e) => update({ language: e.target.value as "en" | "ko" })}
            >
              <option value="en">English (UEB-G1)</option>
              <option value="ko">한국어 (KO-G1)</option>
            </select>
          </label>
          <BiField
            label={L("Summary (F4)", "요약 (F4)")}
            value={lesson.summary}
            onChange={(v) => update({ summary: v })}
            lang={lang}
            textarea
          />
        </div>
      </ScreenCard>

      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        {/* Object list + editor */}
        <div className="space-y-5">
          <ScreenCard
            eyebrow={L("Objects", "객체")}
            title={L("Build the tactile objects", "촉각 객체를 만드세요")}
            action={
              <button
                type="button"
                onClick={addObject}
                className="rounded-xl bg-accent px-3 py-2 text-[13px] font-semibold text-white hover:bg-accent-soft"
              >
                + {L("Add object", "객체 추가")}
              </button>
            }
          >
            {/* object chips */}
            <ul className="mb-4 flex flex-wrap gap-2">
              {lesson.objects.map((o, i) => (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => { setSelectedObjectId(o.id); setPreviewOverview(false); }}
                    aria-pressed={o.id === selectedObjectId}
                    className={cn(
                      "rounded-xl border px-3 py-1.5 text-[13px] transition-colors",
                      o.id === selectedObjectId ? "border-accent bg-accent-tint text-accent" : "border-line hover:bg-surface-sunk"
                    )}
                  >
                    <span className="font-mono text-[10px] text-faint">{i + 1}</span>{" "}
                    {L(o.name.en, o.name.ko) || L("(unnamed)", "(이름 없음)")}
                  </button>
                </li>
              ))}
              {lesson.objects.length === 0 && (
                <li className="text-[13px] text-muted">{L("No objects yet — add one.", "아직 객체가 없습니다 — 추가하세요.")}</li>
              )}
            </ul>

            {selected ? (
              <ObjectEditor
                key={selected.id}
                object={selected}
                lang={lang}
                onChange={(patch) => updateObject(selected.id, patch)}
                onRemove={() => removeObject(selected.id)}
                onMove={(d) => moveObject(selected.id, d)}
              />
            ) : (
              <p className="text-[13px] text-muted">{L("Select or add an object to edit it.", "편집할 객체를 선택하거나 추가하세요.")}</p>
            )}
          </ScreenCard>

          {/* Quiz */}
          <QuizEditor lesson={lesson} lang={lang} onChange={(quiz) => update({ quiz })} />
        </div>

        {/* Sticky preview + QA + save */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-surface p-4 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <p className="eyebrow">{L("Live Dot Pad preview", "Dot Pad 실시간 미리보기")}</p>
              <button
                type="button"
                onClick={() => setPreviewOverview((v) => !v)}
                aria-pressed={previewOverview}
                className={cn(
                  "rounded-lg border px-2.5 py-1 text-[12px] font-medium transition-colors",
                  previewOverview ? "border-accent bg-accent-tint text-accent" : "border-line text-ink hover:bg-surface-sunk"
                )}
              >
                {previewOverview ? L("Whole picture", "전체 그림") : L("Selected object", "선택 객체")}
              </button>
            </div>
            <DotPadScreen
              matrix={previewMatrix}
              brailleText={previewOverview ? lesson.brailleSummary : selected?.brailleLabel ?? ""}
              demoLabel={previewOverview ? L(lesson.title.en, lesson.title.ko) : selected ? L(selected.name.en, selected.name.ko) : ""}
              objectName={previewOverview ? L(lesson.title.en, lesson.title.ko) : selected ? L(selected.name.en, selected.name.ko) : ""}
              showControls={false}
            />
            <button
              type="button"
              onClick={() => { setTryOpen((v) => !v); setTryNonce((n) => n + 1); }}
              className="mt-3 w-full rounded-xl border border-accent bg-surface px-3 py-2 text-[13.5px] font-semibold text-accent hover:bg-accent-tint"
            >
              {tryOpen ? L("Hide interactive try", "체험 닫기") : L("Try it interactively ▶", "직접 체험하기 ▶")}
            </button>
          </div>

          {/* Braille QA */}
          {qa && (
            <div className="rounded-2xl border border-line bg-surface p-4 shadow-card">
              <div className="flex items-center justify-between">
                <p className="eyebrow">{L("Braille QA", "점자 검수")}</p>
                <StatusBadge variant={qa.blocked ? "pending" : "verified"}>
                  {qa.blocked ? L("needs fixes", "수정 필요") : L("passes", "통과")}
                </StatusBadge>
              </div>
              <p className="mt-1 font-mono text-[11px] text-faint">{qa.standard}</p>
              <ul className="mt-2 space-y-1.5">
                {qa.issues.length === 0 && (
                  <li className="text-[13px] text-verify">{L("No issues found.", "발견된 문제가 없습니다.")}</li>
                )}
                {qa.issues.map((iss) => (
                  <li key={iss.id} className="flex items-start gap-2 text-[12.5px]">
                    <span
                      className={cn(
                        "mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] uppercase",
                        iss.severity === "blocker" || iss.severity === "major"
                          ? "bg-[#FBE3DD] text-[#B23B2E]"
                          : iss.severity === "minor"
                          ? "bg-[#FBF3E2] text-warn"
                          : "bg-surface-sunk text-faint"
                      )}
                    >
                      {iss.severity}
                    </span>
                    <span className="text-ink">{L(iss.message.en, iss.message.ko)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Save */}
          <div className="rounded-2xl border border-line bg-surface p-4 shadow-card">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => doSave(false)}
                className="flex-1 rounded-xl border border-line bg-surface px-3 py-2.5 text-[13.5px] font-semibold text-ink hover:bg-surface-sunk"
              >
                {L("Save draft", "임시 저장")}
              </button>
              <button
                type="button"
                onClick={() => doSave(true)}
                disabled={!!qa?.blocked || lesson.objects.length === 0}
                title={qa?.blocked ? L("Resolve braille issues first", "점자 문제를 먼저 해결하세요") : undefined}
                className="flex-1 rounded-xl bg-accent px-3 py-2.5 text-[13.5px] font-semibold text-white hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
              >
                {L("Publish to library", "라이브러리에 게시")}
              </button>
            </div>
            {saved && (
              <p className="mt-3 flex items-center justify-between rounded-xl bg-verify-tint px-3 py-2 text-[13px] text-verify" role="status">
                {L("Saved ✓", "저장됨 ✓")}
                <Link href="/lesson-library" className="font-semibold underline">
                  {L("Open library", "라이브러리 열기")}
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Interactive try */}
      {tryOpen && playable && (
        <div>
          <p className="mb-2 eyebrow">{L("Interactive preview — explore like a student", "체험 미리보기 — 학생처럼 탐색")}</p>
          <LessonExplorer key={tryNonce} lesson={playable} autoConnect />
        </div>
      )}
    </div>
  );
}

/* ════════════════════════ Object editor ════════════════════════ */

function ObjectEditor({
  object,
  lang,
  onChange,
  onRemove,
  onMove,
}: {
  object: BuilderObject;
  lang: "en" | "ko";
  onChange: (patch: Partial<BuilderObject>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const L = (en: string, ko: string) => (lang === "ko" ? ko : en);
  const p = object.primitives[0] ?? defaultPrimitive("disc");

  function patchPrimary(patch: Record<string, number | boolean>) {
    const merged = { ...p, ...patch } as unknown as Primitive;
    onChange({ primitives: [merged, ...object.primitives.slice(1)] });
  }
  function setKind(kind: ShapeKind) {
    onChange({ primitives: [defaultPrimitive(kind), ...object.primitives.slice(1)] });
  }

  return (
    <div className="rounded-2xl border border-line bg-surface-sunk p-4">
      <div className="mb-3 flex items-center justify-between">
        <BiField
          label={L("Object name", "객체 이름")}
          value={object.name}
          lang={lang}
          onChange={(name) => onChange({ name })}
          compact
        />
        <div className="ml-3 flex shrink-0 items-center gap-1">
          <IconBtn label={L("Move earlier", "앞으로")} onClick={() => onMove(-1)}>↑</IconBtn>
          <IconBtn label={L("Move later", "뒤로")} onClick={() => onMove(1)}>↓</IconBtn>
          <IconBtn label={L("Delete object", "객체 삭제")} onClick={onRemove} danger>✕</IconBtn>
        </div>
      </div>

      {/* Braille label */}
      <label className="block">
        <span className="mb-1 flex items-center justify-between font-mono text-[11px] uppercase tracking-eyebrow text-faint">
          {L("Braille label", "점자 라벨")}
          <button
            type="button"
            onClick={() => onChange({ brailleLabel: suggestBrailleLabel(object.name) })}
            className="text-accent hover:underline"
          >
            {L("auto", "자동")}
          </button>
        </span>
        <input className={inputCls} value={object.brailleLabel} onChange={(e) => onChange({ brailleLabel: e.target.value })} maxLength={20} />
      </label>

      {/* Shape */}
      <div className="mt-3">
        <span className="mb-1 block font-mono text-[11px] uppercase tracking-eyebrow text-faint">{L("Shape", "모양")}</span>
        <select className={inputCls} value={p.kind} onChange={(e) => setKind(e.target.value as ShapeKind)}>
          {EDITABLE_KINDS.map((k) => (
            <option key={k} value={k}>{L(KIND_LABEL[k].en, KIND_LABEL[k].ko)}</option>
          ))}
        </select>
        {object.primitives.length > 1 && (
          <p className="mt-1 text-[11px] text-faint">
            {L(`This object has ${object.primitives.length} shapes; you're editing the primary one.`, `이 객체에는 ${object.primitives.length}개의 모양이 있습니다; 기본 모양을 편집 중입니다.`)}
          </p>
        )}
        {!EDITABLE_KINDS.includes(p.kind) && (
          <p className="mt-1 text-[11px] text-faint">{L("This shape type is preset and not editable here.", "이 모양 유형은 사전 설정이며 여기서 편집할 수 없습니다.")}</p>
        )}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <ShapeParams p={p} onPatch={patchPrimary} lang={lang} />
        </div>
      </div>

      {/* Audio */}
      <div className="mt-3 grid gap-3">
        <BiField label={L("Explain (F1)", "설명 (F1)")} value={object.explain} lang={lang} onChange={(explain) => onChange({ explain })} textarea />
        <BiField label={L("Hint (F2)", "힌트 (F2)")} value={object.hint} lang={lang} onChange={(hint) => onChange({ hint })} textarea />
      </div>
    </div>
  );
}

function ShapeParams({
  p,
  onPatch,
  lang,
}: {
  p: Primitive;
  onPatch: (patch: Record<string, number | boolean>) => void;
  lang: "en" | "ko";
}) {
  const L = (en: string, ko: string) => (lang === "ko" ? ko : en);
  if (p.kind === "disc" || p.kind === "ring") {
    return (
      <>
        <Range label={L("Center X", "중심 X")} value={p.cx} min={0} max={59} onChange={(v) => onPatch({ cx: v })} />
        <Range label={L("Center Y", "중심 Y")} value={p.cy} min={0} max={39} onChange={(v) => onPatch({ cy: v })} />
        <Range label={L("Radius", "반지름")} value={p.r} min={1} max={19} onChange={(v) => onPatch({ r: v })} />
      </>
    );
  }
  if (p.kind === "rect" || p.kind === "texture") {
    return (
      <>
        <Range label={L("X", "X")} value={p.x} min={0} max={59} onChange={(v) => onPatch({ x: v })} />
        <Range label={L("Y", "Y")} value={p.y} min={0} max={39} onChange={(v) => onPatch({ y: v })} />
        <Range label={L("Width", "너비")} value={p.w} min={1} max={60} onChange={(v) => onPatch({ w: v })} />
        <Range label={L("Height", "높이")} value={p.h} min={1} max={40} onChange={(v) => onPatch({ h: v })} />
        {p.kind === "rect" && (
          <label className="col-span-2 flex items-center gap-2 text-[12.5px] text-ink">
            <input type="checkbox" checked={p.fill ?? true} onChange={(e) => onPatch({ fill: e.target.checked })} />
            {L("Fill solid (otherwise outline)", "채우기 (해제 시 테두리)")}
          </label>
        )}
      </>
    );
  }
  if (p.kind === "line" || p.kind === "arrow") {
    return (
      <>
        <Range label={L("Start X", "시작 X")} value={p.x1} min={0} max={59} onChange={(v) => onPatch({ x1: v })} />
        <Range label={L("Start Y", "시작 Y")} value={p.y1} min={0} max={39} onChange={(v) => onPatch({ y1: v })} />
        <Range label={L("End X", "끝 X")} value={p.x2} min={0} max={59} onChange={(v) => onPatch({ x2: v })} />
        <Range label={L("End Y", "끝 Y")} value={p.y2} min={0} max={39} onChange={(v) => onPatch({ y2: v })} />
      </>
    );
  }
  return null;
}

/* ════════════════════════ Quiz editor ════════════════════════ */

function QuizEditor({
  lesson,
  lang,
  onChange,
}: {
  lesson: CustomLesson;
  lang: "en" | "ko";
  onChange: (quiz: CustomLesson["quiz"]) => void;
}) {
  const L = (en: string, ko: string) => (lang === "ko" ? ko : en);

  function add() {
    onChange([
      ...lesson.quiz,
      {
        id: newId("q"),
        answerObjectId: lesson.objects[0]?.id ?? "",
        prompt: { en: "", ko: "" },
        hint: { en: "", ko: "" },
      },
    ]);
  }
  function patch(id: string, p: Partial<CustomLesson["quiz"][number]>) {
    onChange(lesson.quiz.map((q) => (q.id === id ? { ...q, ...p } : q)));
  }
  function remove(id: string) {
    onChange(lesson.quiz.filter((q) => q.id !== id));
  }

  return (
    <ScreenCard
      eyebrow={L("Check questions (F3)", "확인 질문 (F3)")}
      title={L("Optional tactile quiz", "선택형 촉각 퀴즈")}
      action={
        <button type="button" onClick={add} className="rounded-xl bg-accent px-3 py-2 text-[13px] font-semibold text-white hover:bg-accent-soft">
          + {L("Add question", "질문 추가")}
        </button>
      }
    >
      {lesson.quiz.length === 0 ? (
        <p className="text-[13px] text-muted">
          {L("Add questions where the student finds an object by touch and presses F3 to check.", "학생이 객체를 손으로 찾고 F3로 확인하는 질문을 추가하세요.")}
        </p>
      ) : (
        <ul className="space-y-3">
          {lesson.quiz.map((q, i) => (
            <li key={q.id} className="rounded-xl border border-line bg-surface-sunk p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[11px] text-faint">Q{i + 1}</span>
                <IconBtn label={L("Delete question", "질문 삭제")} onClick={() => remove(q.id)} danger>✕</IconBtn>
              </div>
              <BiField label={L("Question", "질문")} value={q.prompt} lang={lang} onChange={(prompt) => patch(q.id, { prompt })} />
              <div className="mt-2">
                <span className="mb-1 block font-mono text-[11px] uppercase tracking-eyebrow text-faint">{L("Answer object", "정답 객체")}</span>
                <select className={inputCls} value={q.answerObjectId} onChange={(e) => patch(q.id, { answerObjectId: e.target.value })}>
                  {lesson.objects.map((o) => (
                    <option key={o.id} value={o.id}>{L(o.name.en, o.name.ko) || o.id}</option>
                  ))}
                </select>
              </div>
              <div className="mt-2">
                <BiField label={L("Hint", "힌트")} value={q.hint} lang={lang} onChange={(hint) => patch(q.id, { hint })} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </ScreenCard>
  );
}

/* ════════════════════════ small shared bits ════════════════════════ */

const inputCls =
  "w-full rounded-xl border border-line bg-surface px-3 py-2 text-[14px] text-ink placeholder:text-faint";

function BiField({
  label,
  value,
  lang,
  onChange,
  textarea = false,
  compact = false,
}: {
  label: string;
  value: LocalizedText;
  lang: "en" | "ko";
  onChange: (v: LocalizedText) => void;
  textarea?: boolean;
  compact?: boolean;
}) {
  // Edit the active language inline; the other language is kept and editable
  // via the small toggle so a bilingual lesson stays in sync.
  const [editKo, setEditKo] = useState(lang === "ko");
  const key = editKo ? "ko" : "en";
  const fieldCls = cn(inputCls, textarea && "min-h-[56px] resize-y", compact && "py-1.5");
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between font-mono text-[11px] uppercase tracking-eyebrow text-faint">
        {label}
        <button
          type="button"
          onClick={() => setEditKo((v) => !v)}
          className="rounded border border-line px-1.5 text-[10px] text-muted hover:bg-surface-sunk"
          aria-label={editKo ? "Switch to English field" : "한국어 입력으로 전환"}
        >
          {editKo ? "KO" : "EN"}
        </button>
      </span>
      {textarea ? (
        <textarea
          className={fieldCls}
          value={value[key]}
          onChange={(e) => onChange({ ...value, [key]: e.target.value })}
        />
      ) : (
        <input
          className={fieldCls}
          value={value[key]}
          onChange={(e) => onChange({ ...value, [key]: e.target.value })}
        />
      )}
    </label>
  );
}

function Range({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between text-[12px] text-muted">
        {label}
        <span className="font-mono text-[11px] text-ink">{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: "#1F3A5F" }}
      />
    </label>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  danger = false,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "grid h-7 w-7 place-items-center rounded-lg border text-[13px] transition-colors",
        danger ? "border-line text-[#B23B2E] hover:bg-[#FBE3DD]" : "border-line text-ink hover:bg-surface-sunk"
      )}
    >
      {children}
    </button>
  );
}

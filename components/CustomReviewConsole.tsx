"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  listCustomLessons,
  subscribeCustomLessons,
  reviewCustomLesson,
  addFeedback,
  toPlayableLesson,
  type CustomLesson,
  type LessonStatus,
} from "@/lib/customLessons";
import { renderScene } from "@/lib/tactileScene";
import { buildSummary } from "@/lib/brailleEngine";
import { runQA } from "@/lib/brailleQA";
import { logEvent } from "@/lib/telemetry";
import { TactileGrid } from "@/components/TactileGrid";
import { StatusBadge, type StatusVariant } from "@/components/StatusBadge";
import { LessonExplorer } from "@/components/LessonExplorer";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const EDIT_KEY = "dotlens.builder.editId";

const STATUS_META: Record<LessonStatus, { variant: StatusVariant; en: string; ko: string }> = {
  draft: { variant: "draft", en: "draft", ko: "초안" },
  ready: { variant: "review", en: "awaiting review", ko: "검수 대기" },
  approved: { variant: "verified", en: "approved", ko: "승인됨" },
  changes_requested: { variant: "pending", en: "changes requested", ko: "수정 요청" },
};

export function statusBadge(status: LessonStatus, lang: "en" | "ko") {
  const m = STATUS_META[status];
  return <StatusBadge variant={m.variant}>{lang === "ko" ? m.ko : m.en}</StatusBadge>;
}

export function CustomReviewConsole() {
  const { lang } = useLang();
  const router = useRouter();
  const L = (en: string, ko: string) => (lang === "ko" ? ko : en);

  const [lessons, setLessons] = useState<CustomLesson[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reviewer, setReviewer] = useState("");
  const [notes, setNotes] = useState("");
  const [fbAuthor, setFbAuthor] = useState("");
  const [fbRole, setFbRole] = useState("field staff");
  const [fbMessage, setFbMessage] = useState("");

  useEffect(() => {
    setLessons(listCustomLessons());
    return subscribeCustomLessons(() => setLessons(listCustomLessons()));
  }, []);

  const selected = useMemo(
    () => lessons.find((l) => l.id === selectedId) ?? null,
    [lessons, selectedId]
  );

  // Report rollup
  const report = useMemo(() => {
    const by: Record<LessonStatus, number> = { draft: 0, ready: 0, approved: 0, changes_requested: 0 };
    let feedback = 0;
    for (const l of lessons) {
      by[l.status] = (by[l.status] ?? 0) + 1;
      feedback += l.feedback?.length ?? 0;
    }
    return { by, feedback, total: lessons.length };
  }, [lessons]);

  // Braille QA recap for the selected lesson (labels + summary)
  const qa = useMemo(() => {
    if (!selected) return null;
    const std = selected.language === "ko" ? ("KO-G1" as const) : ("UEB-G1" as const);
    const text = [selected.brailleSummary, ...selected.objects.map((o) => o.brailleLabel)].filter(Boolean).join(" ");
    const { summary, untranslatable } = buildSummary(text || " ", std, selected.language);
    const cells = summary.pages.flatMap((p) => p.cells);
    const issues = runQA(text, selected.language, summary.standard, cells, untranslatable);
    return issues.filter((i) => !i.resolved);
  }, [selected]);

  const overview = useMemo(() => {
    if (!selected) return null;
    return renderScene({
      id: `${selected.id}-rev`,
      title: selected.title,
      type: "process",
      primitives: selected.objects.flatMap((o) => o.primitives),
    });
  }, [selected]);

  function decide(decision: "approved" | "changes_requested") {
    if (!selected) return;
    const note = { en: notes, ko: notes };
    reviewCustomLesson(selected.id, decision, reviewer || "Reviewer", note);
    logEvent("lesson_reviewed", { decision, lesson: selected.id });
    setNotes("");
  }

  function submitFeedback() {
    if (!selected || !fbMessage.trim()) return;
    addFeedback(selected.id, { author: fbAuthor || "Anonymous", role: fbRole, message: fbMessage.trim() });
    logEvent("feedback_submitted", { lesson: selected.id, role: fbRole });
    setFbMessage("");
  }

  function editInBuilder() {
    if (!selected) return;
    try {
      window.sessionStorage.setItem(EDIT_KEY, selected.id);
    } catch {
      /* ignore */
    }
    router.push("/builder");
  }

  if (lessons.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface-sunk p-8 text-center">
        <p className="text-[14px] font-medium text-ink">{L("No teacher-built lessons to review yet", "검수할 교사 제작 수업이 아직 없습니다")}</p>
        <p className="mt-1 text-[13px] text-muted">
          {L("When a teacher publishes a lesson in the Tactile Builder, it lands here for review.", "교사가 촉각 빌더에서 수업을 게시하면 여기로 들어와 검수됩니다.")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Report rollup */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Metric label={L("Total", "전체")} value={report.total} />
        <Metric label={L("Awaiting", "대기")} value={report.by.ready} accent />
        <Metric label={L("Approved", "승인")} value={report.by.approved} />
        <Metric label={L("Changes", "수정요청")} value={report.by.changes_requested} />
        <Metric label={L("Feedback", "피드백")} value={report.feedback} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        {/* Queue */}
        <ul className="space-y-1.5 self-start rounded-2xl border border-line bg-surface p-3">
          {lessons.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => setSelectedId(l.id)}
                aria-pressed={l.id === selectedId}
                className={cn(
                  "w-full rounded-xl border px-3 py-2.5 text-left transition-colors",
                  l.id === selectedId ? "border-accent bg-accent-tint" : "border-line hover:bg-surface-sunk"
                )}
              >
                <span className="block text-[13.5px] font-medium text-ink">{L(l.title.en, l.title.ko)}</span>
                <span className="mt-1 flex items-center gap-2">
                  {statusBadge(l.status, lang)}
                  <span className="font-mono text-[10px] text-faint">{L(`${l.objects.length} obj`, `객체 ${l.objects.length}`)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* Detail */}
        {selected ? (
          <div className="space-y-4 rounded-2xl border border-line bg-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-[17px] font-semibold text-ink">{L(selected.title.en, selected.title.ko)}</h3>
                <p className="font-mono text-[11px] text-faint">
                  {L(selected.subject.en, selected.subject.ko)} · {L(selected.gradeLevel.en, selected.gradeLevel.ko)} · {selected.language.toUpperCase()}
                </p>
              </div>
              {statusBadge(selected.status, lang)}
            </div>

            {overview && (
              <div className="overflow-hidden rounded-xl border border-line">
                <TactileGrid matrix={overview} objectName={L(selected.title.en, selected.title.ko)} className="max-h-[170px]" />
              </div>
            )}

            {/* Object + braille recap */}
            <div>
              <p className="eyebrow">{L("Objects & braille labels", "객체 및 점자 라벨")}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {selected.objects.map((o) => (
                  <li key={o.id} className="rounded-full border border-line bg-paper px-3 py-1.5 text-[12.5px] text-ink">
                    {L(o.name.en, o.name.ko)} <span className="font-mono text-[10px] text-faint">⠿ {o.brailleLabel}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* QA recap */}
            <div className={cn("rounded-xl px-4 py-2.5 text-[12.5px]", qa && qa.length ? "bg-[#FBF3E2] text-warn" : "bg-verify-tint text-verify")}>
              {qa && qa.length
                ? L(`${qa.length} open braille issue(s) — review before approving.`, `미해결 점자 문제 ${qa.length}건 — 승인 전 확인하세요.`)
                : L("Braille checks pass.", "점자 검수 통과.")}
            </div>

            {/* Interactive review */}
            <details className="rounded-xl border border-line bg-surface-sunk p-3">
              <summary className="cursor-pointer text-[13px] font-semibold text-accent">{L("Open interactive Dot Pad review", "Dot Pad 대화형 검수 열기")}</summary>
              <div className="mt-3">
                <LessonExplorer key={selected.id} lesson={toPlayableLesson(selected)} />
              </div>
            </details>

            {/* Existing review */}
            {selected.review && (
              <div className="rounded-xl border border-line bg-paper px-4 py-3 text-[13px]">
                <p className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">{L("Last decision", "최근 결정")}</p>
                <p className="mt-1 text-ink">
                  {selected.review.decision === "approved" ? L("Approved", "승인") : L("Changes requested", "수정 요청")} · {selected.review.reviewer}
                </p>
                {(selected.review.notes.en || selected.review.notes.ko) && (
                  <p className="mt-1 text-muted">{L(selected.review.notes.en, selected.review.notes.ko)}</p>
                )}
              </div>
            )}

            {/* Decision form */}
            <div className="rounded-xl border border-line bg-surface-sunk p-4">
              <p className="eyebrow">{L("Review decision", "검수 결정")}</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <input
                  value={reviewer}
                  onChange={(e) => setReviewer(e.target.value)}
                  placeholder={L("Reviewer name", "검수자 이름")}
                  className="rounded-xl border border-line bg-surface px-3 py-2 text-[14px] text-ink placeholder:text-faint"
                />
                <button type="button" onClick={editInBuilder} className="rounded-xl border border-line bg-surface px-3 py-2 text-[13.5px] font-semibold text-ink hover:bg-surface-sunk">
                  {L("Edit in builder ✎", "빌더에서 수정 ✎")}
                </button>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={L("Notes for the teacher (optional)", "교사에게 남길 메모 (선택)")}
                className="mt-2 min-h-[60px] w-full rounded-xl border border-line bg-surface px-3 py-2 text-[14px] text-ink placeholder:text-faint"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" onClick={() => decide("approved")} className="rounded-xl bg-accent px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-accent-soft">
                  {L("Approve", "승인")}
                </button>
                <button type="button" onClick={() => decide("changes_requested")} className="rounded-xl border border-warn bg-surface px-4 py-2.5 text-[13.5px] font-semibold text-warn hover:bg-[#FBF3E2]">
                  {L("Request changes", "수정 요청")}
                </button>
              </div>
            </div>

            {/* Feedback thread */}
            <div className="rounded-xl border border-line bg-surface-sunk p-4">
              <p className="eyebrow">{L("Feedback", "피드백")} {selected.feedback?.length ? `· ${selected.feedback.length}` : ""}</p>
              {selected.feedback && selected.feedback.length > 0 && (
                <ul className="mt-2 space-y-2">
                  {selected.feedback.map((f) => (
                    <li key={f.id} className="rounded-lg border border-line bg-surface px-3 py-2 text-[13px]">
                      <span className="font-semibold text-ink">{f.author}</span>
                      <span className="ml-1 font-mono text-[10px] text-faint">{f.role}</span>
                      <p className="mt-0.5 text-muted">{f.message}</p>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <input value={fbAuthor} onChange={(e) => setFbAuthor(e.target.value)} placeholder={L("Your name", "이름")} className="rounded-xl border border-line bg-surface px-3 py-2 text-[14px] text-ink placeholder:text-faint" />
                <select value={fbRole} onChange={(e) => setFbRole(e.target.value)} className="rounded-xl border border-line bg-surface px-3 py-2 text-[14px] text-ink">
                  <option value="field staff">{L("Field staff", "현장 담당자")}</option>
                  <option value="teacher">{L("Teacher", "교사")}</option>
                  <option value="reviewer">{L("Reviewer", "검수자")}</option>
                </select>
              </div>
              <textarea value={fbMessage} onChange={(e) => setFbMessage(e.target.value)} placeholder={L("Add feedback…", "피드백 입력…")} className="mt-2 min-h-[52px] w-full rounded-xl border border-line bg-surface px-3 py-2 text-[14px] text-ink placeholder:text-faint" />
              <button type="button" onClick={submitFeedback} disabled={!fbMessage.trim()} className="mt-2 rounded-xl border border-accent bg-surface px-4 py-2 text-[13.5px] font-semibold text-accent hover:bg-accent-tint disabled:opacity-50">
                {L("Submit feedback", "피드백 제출")}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid place-items-center rounded-2xl border border-dashed border-line bg-surface-sunk p-10 text-[13.5px] text-muted">
            {L("Select a lesson from the queue to review it.", "검수할 수업을 큐에서 선택하세요.")}
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={cn("rounded-2xl border bg-surface px-4 py-3 text-center shadow-card", accent ? "border-accent" : "border-line")}>
      <p className={cn("font-mono text-[22px] font-semibold", accent ? "text-accent" : "text-ink")}>{value}</p>
      <p className="mt-0.5 text-[11px] text-muted">{label}</p>
    </div>
  );
}

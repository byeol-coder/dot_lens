/**
 * Lightweight, privacy-conscious telemetry — the data-collection & monitoring
 * backbone.
 *
 * Everything is stored locally (localStorage ring buffer); no network, no PII
 * beyond what a caller passes. It exists so field staff can answer "is this
 * working?": usage counts, error counts, and collected feedback, plus a
 * scorecard that compares actuals against explicit success criteria.
 *
 * TODO(real backend): forward batched events to an analytics endpoint and keep
 * the same `logEvent` call sites unchanged.
 */

export type TelemetryType =
  | "lesson_created"
  | "lesson_published"
  | "lesson_reviewed"
  | "lesson_explored"
  | "quiz_completed"
  | "feedback_submitted"
  | "pack_uploaded"
  | "error";

export interface TelemetryEvent {
  id: string;
  type: TelemetryType;
  /** ISO 8601 timestamp. */
  at: string;
  /** Free-form, caller-supplied context (kept small). */
  props: Record<string, string | number | boolean>;
}

const STORAGE_KEY = "dotlens.telemetry.v1";
const CHANGE_EVENT = "dotlens:telemetry";
const MAX_EVENTS = 1000;

function canStore(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function getEvents(): TelemetryEvent[] {
  if (!canStore()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TelemetryEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(events: TelemetryEvent[]): void {
  if (!canStore()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    /* storage full / unavailable — telemetry is best-effort */
  }
}

export function logEvent(
  type: TelemetryType,
  props: Record<string, string | number | boolean> = {}
): void {
  if (!canStore()) return;
  const event: TelemetryEvent = {
    id: `ev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    at: new Date().toISOString(),
    props,
  };
  write([...getEvents(), event]);
}

/** Convenience for instrumenting failures without throwing. */
export function logError(where: string, message: string): void {
  logEvent("error", { where, message: message.slice(0, 200) });
}

export function clearEvents(): void {
  write([]);
}

/** Append a batch of pre-built events (used by the demo seeder). */
export function seedEvents(events: TelemetryEvent[]): void {
  if (!canStore()) return;
  write([...getEvents(), ...events]);
}

export function subscribeTelemetry(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onChange = () => cb();
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/* ---------------------------------------------------------------------------
 * Aggregation + success scorecard
 * ------------------------------------------------------------------------- */

export interface TelemetryStats {
  total: number;
  byType: Record<TelemetryType, number>;
  /** Distinct days with at least one event. */
  activeDays: number;
  errorRate: number; // errors / total, 0–1
  quizAttempts: number;
  /** Average quiz score as a fraction 0–1 (only over quiz_completed events). */
  avgQuizScore: number;
  feedbackCount: number;
}

const ALL_TYPES: TelemetryType[] = [
  "lesson_created",
  "lesson_published",
  "lesson_reviewed",
  "quiz_completed",
  "lesson_explored",
  "feedback_submitted",
  "pack_uploaded",
  "error",
];

export function computeStats(events: TelemetryEvent[]): TelemetryStats {
  const byType = ALL_TYPES.reduce(
    (acc, t) => ({ ...acc, [t]: 0 }),
    {} as Record<TelemetryType, number>
  );
  const days = new Set<string>();
  let scoreSum = 0;
  let scoreN = 0;

  for (const e of events) {
    byType[e.type] = (byType[e.type] ?? 0) + 1;
    days.add(e.at.slice(0, 10));
    if (e.type === "quiz_completed") {
      const total = Number(e.props.total) || 0;
      const score = Number(e.props.score) || 0;
      if (total > 0) {
        scoreSum += score / total;
        scoreN += 1;
      }
    }
  }

  const total = events.length;
  return {
    total,
    byType,
    activeDays: days.size,
    errorRate: total ? byType.error / total : 0,
    quizAttempts: byType.quiz_completed,
    avgQuizScore: scoreN ? scoreSum / scoreN : 0,
    feedbackCount: byType.feedback_submitted,
  };
}

export interface ScorecardRow {
  key: string;
  label: { en: string; ko: string };
  target: number;
  actual: number;
  /** "count" → integer goal; "rate" → 0–1 fraction shown as %. */
  unit: "count" | "rate";
  met: boolean;
  /** For rates, whether lower is better (e.g. error rate). */
  lowerIsBetter?: boolean;
}

/** Default success criteria — editable as a program matures. */
export const SUCCESS_TARGETS = {
  lessonsPublished: 5,
  approvals: 3,
  studentSessions: 10,
  avgQuizScore: 0.7,
  maxErrorRate: 0.05,
};

export function computeScorecard(stats: TelemetryStats): ScorecardRow[] {
  const rows: ScorecardRow[] = [
    {
      key: "published",
      label: { en: "Lessons published", ko: "게시된 수업" },
      target: SUCCESS_TARGETS.lessonsPublished,
      actual: stats.byType.lesson_published,
      unit: "count",
      met: stats.byType.lesson_published >= SUCCESS_TARGETS.lessonsPublished,
    },
    {
      key: "approvals",
      label: { en: "Lessons approved in review", ko: "검수 승인된 수업" },
      target: SUCCESS_TARGETS.approvals,
      actual: stats.byType.lesson_reviewed,
      unit: "count",
      met: stats.byType.lesson_reviewed >= SUCCESS_TARGETS.approvals,
    },
    {
      key: "sessions",
      label: { en: "Student explore sessions", ko: "학생 탐색 세션" },
      target: SUCCESS_TARGETS.studentSessions,
      actual: stats.byType.lesson_explored,
      unit: "count",
      met: stats.byType.lesson_explored >= SUCCESS_TARGETS.studentSessions,
    },
    {
      key: "quiz",
      label: { en: "Average quiz score", ko: "평균 퀴즈 점수" },
      target: SUCCESS_TARGETS.avgQuizScore,
      actual: stats.avgQuizScore,
      unit: "rate",
      met: stats.avgQuizScore >= SUCCESS_TARGETS.avgQuizScore,
    },
    {
      key: "errors",
      label: { en: "Error rate", ko: "오류율" },
      target: SUCCESS_TARGETS.maxErrorRate,
      actual: stats.errorRate,
      unit: "rate",
      lowerIsBetter: true,
      met: stats.errorRate <= SUCCESS_TARGETS.maxErrorRate,
    },
  ];
  return rows;
}

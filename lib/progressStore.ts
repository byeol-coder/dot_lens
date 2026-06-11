import type { StudentProgress } from "@/types";
import { STUDENT_PROGRESS } from "@/lib/constants";

/**
 * In-memory mock progress store.
 *
 * The Map is attached to `globalThis` so every API route handler shares one
 * instance (Next.js bundles route segments separately, which would otherwise
 * give each route its own module-scoped copy).
 *
 * NOTE: state lives in the running server process — it resets on restart and is
 * not shared across serverless instances. It exists only to make the demo feel
 * live.
 *
 * TODO(real backend): replace with a database / Classroom add-on store.
 */

function key(assignmentId: string, studentId: string): string {
  return `${assignmentId}::${studentId}`;
}

function seed(): Map<string, StudentProgress> {
  const map = new Map<string, StudentProgress>();
  for (const p of STUDENT_PROGRESS) {
    map.set(key(p.assignmentId, p.studentId), p);
  }
  return map;
}

const globalForStore = globalThis as unknown as {
  __dotLensProgress?: Map<string, StudentProgress>;
};

const store: Map<string, StudentProgress> =
  globalForStore.__dotLensProgress ??
  (globalForStore.__dotLensProgress = seed());

export function saveProgress(progress: StudentProgress): StudentProgress {
  const record: StudentProgress = {
    ...progress,
    lastActivity: progress.lastActivity ?? new Date().toISOString(),
  };
  store.set(key(record.assignmentId, record.studentId), record);
  return record;
}

export function getProgressByAssignment(
  assignmentId: string
): StudentProgress[] {
  return [...store.values()]
    .filter((p) => p.assignmentId === assignmentId)
    .sort((a, b) => a.studentName.localeCompare(b.studentName));
}

export function getAllProgress(): StudentProgress[] {
  return [...store.values()];
}

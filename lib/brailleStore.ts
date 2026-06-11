import type {
  BrailleReview,
  BrailleStandard,
  BrailleTranslationJob,
  Language,
} from "@/types";
import { buildSummary } from "@/lib/brailleEngine";
import { runQA, hasBlockingIssues } from "@/lib/brailleQA";

/**
 * In-memory Global Braille job store (globalThis-backed so every API route
 * shares one instance). Resets on server restart.
 *
 * TODO(real backend): persist jobs + reviews; integrate a certified TVI queue.
 */

let seq = 0;
function newId(prefix: string): string {
  seq += 1;
  return `${prefix}-${seq}`;
}

function makeJob(
  id: string,
  assignmentId: string,
  text: string,
  standard: BrailleStandard,
  language: Language
): BrailleTranslationJob {
  const { summary, untranslatable } = buildSummary(text, standard, language);
  const effectiveStandard = summary.standard; // normalized to what the engine produced
  const cells = summary.pages.flatMap((p) => p.cells);
  const issues = runQA(text, language, effectiveStandard, cells, untranslatable);
  return {
    id,
    assignmentId,
    standard: effectiveStandard,
    language,
    status: "qa_pending",
    submittedAt: new Date().toISOString(),
    summary,
    issues,
  };
}

function seed(): Map<string, BrailleTranslationJob> {
  const map = new Map<string, BrailleTranslationJob>();

  // English job — pre-approved so the device (F4) shows verified braille now.
  const en = makeJob("bj-wc-en", "wc-001", "water cycle", "UEB-G1", "en");
  en.status = "approved";
  en.issues = en.issues.map((i) => ({ ...i, resolved: true }));
  en.review = {
    reviewerId: "rev-7",
    reviewerName: "J. Han (TVI)",
    decision: "approved",
    notes: { en: "Reads cleanly for elementary. Approved.", ko: "초등 수준에서 자연스럽게 읽힘. 승인." },
    reviewedAt: new Date().toISOString(),
  };

  // Korean job — pending, so a reviewer can act on it live.
  const ko = makeJob("bj-wc-ko", "wc-001", "물 흐름", "KO-G1", "ko");

  map.set(en.id, en);
  map.set(ko.id, ko);
  return map;
}

const g = globalThis as unknown as {
  __dotLensBrailleJobs?: Map<string, BrailleTranslationJob>;
};
const store: Map<string, BrailleTranslationJob> =
  g.__dotLensBrailleJobs ?? (g.__dotLensBrailleJobs = seed());

export function listJobs(): BrailleTranslationJob[] {
  return [...store.values()].sort((a, b) =>
    a.submittedAt < b.submittedAt ? 1 : -1
  );
}

export function getJob(id: string): BrailleTranslationJob | undefined {
  return store.get(id);
}

export function createJob(
  assignmentId: string,
  text: string,
  standard: BrailleStandard,
  language: Language
): BrailleTranslationJob {
  const job = makeJob(newId("bj"), assignmentId, text, standard, language);
  store.set(job.id, job);
  return job;
}

export function reviewJob(
  id: string,
  decision: "approved" | "changes_requested",
  reviewerName: string,
  notes?: { en: string; ko: string }
): BrailleTranslationJob | undefined {
  const job = store.get(id);
  if (!job) return undefined;

  // Cannot approve while blocking issues remain unresolved.
  if (decision === "approved" && hasBlockingIssues(job.issues)) {
    job.status = "changes_requested";
  } else {
    job.status = decision;
  }

  const review: BrailleReview = {
    reviewerId: "rev-app",
    reviewerName: reviewerName || "Reviewer",
    decision: job.status === "approved" ? "approved" : "changes_requested",
    notes,
    reviewedAt: new Date().toISOString(),
  };
  if (job.status === "approved") {
    job.issues = job.issues.map((i) => ({ ...i, resolved: true }));
  }
  job.review = review;
  store.set(id, job);
  return job;
}

/** The approved braille summary text for an assignment (used by Dot Pad F4). */
export function getApprovedSummaryText(
  assignmentId: string,
  language: Language = "en"
): string | null {
  for (const job of store.values()) {
    if (
      job.assignmentId === assignmentId &&
      job.language === language &&
      job.status === "approved"
    ) {
      return job.summary.pages[0]?.text ?? null;
    }
  }
  return null;
}

/**
 * Client-side API shim.
 *
 * The original /api/* route handlers were thin wrappers over synchronous mock
 * libraries. To run on static hosting (GitHub Pages) with no server, the same
 * library functions are called directly in the browser here, returning the
 * exact response shapes the routes used. UI components call these instead of
 * `fetch("/api/...")`.
 *
 * Going live with a real backend later: reimplement these as `fetch` calls and
 * nothing in the components changes.
 */

import { getAssignments, getAssignmentById } from "@/lib/mockAssignments";
import { analyzeVisual, convertToTactile } from "@/lib/mockGemini";
import {
  createJob,
  getJob,
  listJobs,
  reviewJob,
  getApprovedSummaryText,
} from "@/lib/brailleStore";
import { buildSummary } from "@/lib/brailleEngine";
import { saveProgress, getProgressByAssignment } from "@/lib/progressStore";
import { computeKeyEvent } from "@/lib/dotpadEngine";
import { OBJECT_SEQUENCE } from "@/lib/tactileMatrix";
import type {
  AccessibilityProfile,
  BrailleStandard,
  Difficulty,
  DotPadKey,
  Language,
  StudentProgress,
} from "@/types";

const STANDARDS: BrailleStandard[] = [
  "UEB-G1", "UEB-G2", "KO-G1", "KO-G2", "Nemeth", "KO-Math",
];

export const clientApi = {
  // --- assignments ---
  listAssignments: async () => ({ assignments: getAssignments() }),
  getAssignment: async (id: string) => {
    const assignment = getAssignmentById(id);
    if (!assignment) throw new Error(`Assignment '${id}' not found`);
    return { assignment };
  },

  // --- Gemini scan / convert ---
  scan: async (assignmentId: string, materialId: string) => {
    if (!getAssignmentById(assignmentId))
      throw new Error(`Assignment '${assignmentId}' not found`);
    return { analysis: analyzeVisual(assignmentId, materialId) };
  },
  convert: async (
    analysisId: string,
    difficulty?: Difficulty,
    accessibilityProfile?: AccessibilityProfile
  ) => {
    const result = convertToTactile(analysisId, difficulty, accessibilityProfile);
    const assignmentId = analysisId.replace(/^an-/, "");
    const standard = result.accessibilityProfile.brailleStandard;
    const language = result.accessibilityProfile.language;
    const job = createJob(assignmentId, "water cycle", standard, language);
    result.brailleSummaries = [job.summary];
    result.brailleJobId = job.id;
    return { result };
  },

  // --- braille ---
  listBrailleJobs: async () => ({ jobs: listJobs() }),
  getBrailleJob: async (id: string) => {
    const job = getJob(id);
    if (!job) throw new Error(`Job '${id}' not found`);
    return { job };
  },
  reviewBrailleJob: async (
    jobId: string,
    decision: "approved" | "changes_requested",
    reviewerName = "Reviewer",
    notes?: { en: string; ko: string }
  ) => {
    const job = reviewJob(jobId, decision, reviewerName, notes);
    if (!job) throw new Error(`Job '${jobId}' not found`);
    return { job };
  },
  approvedBraille: async (assignmentId: string, lang: Language = "en") => ({
    approvedText: getApprovedSummaryText(assignmentId, lang),
    language: lang,
  }),
  translateBraille: async (
    text: string,
    standard?: BrailleStandard,
    language: Language = "en"
  ) => {
    const std: BrailleStandard =
      standard && STANDARDS.includes(standard)
        ? standard
        : language === "ko"
        ? "KO-G1"
        : "UEB-G1";
    return buildSummary(text, std, language);
  },

  // --- progress ---
  getProgress: async (assignmentId: string) => ({
    progress: getProgressByAssignment(assignmentId),
  }),
  saveProgress: async (progress: StudentProgress) => ({
    saved: saveProgress(progress),
  }),

  // --- Dot Pad (mock device) ---
  dotpadConnect: async () => ({
    connected: true,
    deviceName: "Dot Pad (mock)",
    currentObject: OBJECT_SEQUENCE[0].name.en,
    mode: "guided" as const,
  }),
  dotpadStatus: async () => ({
    connected: false,
    deviceName: "Dot Pad (mock)",
    currentObject: OBJECT_SEQUENCE[0].name.en,
    mode: "guided" as const,
  }),
  dotpadKeyEvent: async (key: DotPadKey, currentObjectIndex = 0) =>
    computeKeyEvent(key, currentObjectIndex, "en"),
};

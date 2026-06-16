/**
 * Client-side API shim for static hosting (GitHub Pages).
 *
 * The app was built with Next.js route handlers under app/api/*. A static
 * export cannot run those handlers, so this module patches window.fetch to
 * answer the same `/api/*` calls in-browser, dispatching to the exact same
 * lib functions the route handlers used. Non-/api requests pass through
 * untouched. Installed once, at module import time (before any component
 * effect fires).
 */
import { getAssignments, getAssignmentById } from "@/lib/mockAssignments";
import { analyzeVisual, convertToTactile } from "@/lib/mockGemini";
import {
  listJobs,
  getJob,
  createJob,
  reviewJob,
  getApprovedSummaryText,
} from "@/lib/brailleStore";
import { buildSummary } from "@/lib/brailleEngine";
import { getProgressByAssignment, saveProgress } from "@/lib/progressStore";
import { computeKeyEvent } from "@/lib/dotpadEngine";
import { OBJECT_SEQUENCE } from "@/lib/tactileMatrix";
import type {
  AccessibilityProfile,
  BrailleStandard,
  Difficulty,
  DotPadKey,
  Language,
  LocalizedText,
  StudentProgress,
} from "@/types";

const STANDARDS: BrailleStandard[] = [
  "UEB-G1",
  "UEB-G2",
  "KO-G1",
  "KO-G2",
  "Nemeth",
  "KO-Math",
];
const VALID_KEYS: DotPadKey[] = ["leftPan", "rightPan", "f1", "f2", "f3", "f4"];

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Route `/api/...` (method, path, query, body) to the matching mock handler. */
async function handle(
  method: string,
  path: string,
  search: URLSearchParams,
  body: any
): Promise<Response> {
  // ── Assignments ──────────────────────────────────────────────
  if (method === "GET" && path === "/api/assignments") {
    return json({ assignments: getAssignments() });
  }
  let m = path.match(/^\/api\/assignments\/([^/]+)$/);
  if (method === "GET" && m) {
    const assignment = getAssignmentById(decodeURIComponent(m[1]));
    return assignment
      ? json({ assignment })
      : json({ error: `Assignment '${m[1]}' not found` }, 404);
  }

  // ── Scan / Convert (Gemini mock) ─────────────────────────────
  if (method === "POST" && path === "/api/scan") {
    const { assignmentId, materialId } = body ?? {};
    if (!assignmentId || !materialId)
      return json({ error: "assignmentId and materialId are required" }, 400);
    if (!getAssignmentById(assignmentId))
      return json({ error: `Assignment '${assignmentId}' not found` }, 404);
    return json({ analysis: analyzeVisual(assignmentId, materialId) });
  }
  if (method === "POST" && path === "/api/convert") {
    const analysisId: string | undefined = body?.analysisId;
    if (!analysisId) return json({ error: "analysisId is required" }, 400);
    const result = convertToTactile(
      analysisId,
      body?.difficulty as Difficulty | undefined,
      body?.accessibilityProfile as AccessibilityProfile | undefined
    );
    const assignmentId = analysisId.replace(/^an-/, "");
    const job = createJob(
      assignmentId,
      "water cycle",
      result.accessibilityProfile.brailleStandard,
      result.accessibilityProfile.language
    );
    result.brailleSummaries = [job.summary];
    result.brailleJobId = job.id;
    return json({ result });
  }

  // ── Braille QA ───────────────────────────────────────────────
  if (method === "GET" && path === "/api/braille/jobs") {
    return json({ jobs: listJobs() });
  }
  m = path.match(/^\/api\/braille\/jobs\/([^/]+)$/);
  if (method === "GET" && m) {
    const job = getJob(decodeURIComponent(m[1]));
    return job ? json({ job }) : json({ error: `Job '${m[1]}' not found` }, 404);
  }
  m = path.match(/^\/api\/braille\/approved\/([^/]+)$/);
  if (method === "GET" && m) {
    const lang: Language = search.get("lang") === "ko" ? "ko" : "en";
    return json({
      approvedText: getApprovedSummaryText(decodeURIComponent(m[1]), lang),
      language: lang,
    });
  }
  if (method === "POST" && path === "/api/braille/review") {
    const jobId: string | undefined = body?.jobId;
    const decision = body?.decision;
    if (
      !jobId ||
      (decision !== "approved" && decision !== "changes_requested")
    )
      return json({ error: "jobId and a valid decision are required" }, 400);
    const job = reviewJob(
      jobId,
      decision,
      body?.reviewerName ?? "Reviewer",
      body?.notes as LocalizedText | undefined
    );
    return job ? json({ job }) : json({ error: `Job '${jobId}' not found` }, 404);
  }
  if (method === "POST" && path === "/api/braille/translate") {
    const text = body?.text;
    if (typeof text !== "string")
      return json({ error: "text is required" }, 400);
    const language: Language = body?.language === "ko" ? "ko" : "en";
    const standard: BrailleStandard =
      body?.standard && STANDARDS.includes(body.standard)
        ? body.standard
        : language === "ko"
        ? "KO-G1"
        : "UEB-G1";
    const { summary, untranslatable } = buildSummary(text, standard, language);
    return json({ summary, untranslatable });
  }

  // ── Progress ─────────────────────────────────────────────────
  m = path.match(/^\/api\/progress\/([^/]+)$/);
  if (method === "GET" && m) {
    return json({ progress: getProgressByAssignment(decodeURIComponent(m[1])) });
  }
  if (method === "POST" && path === "/api/progress") {
    if (!body?.studentId || !body?.assignmentId)
      return json({ error: "studentId and assignmentId are required" }, 400);
    return json({ saved: saveProgress(body as StudentProgress) });
  }

  // ── Dot Pad (mock device) ────────────────────────────────────
  if (method === "POST" && path === "/api/dotpad/connect") {
    return json({
      connected: true,
      deviceName: "Dot Pad (mock)",
      currentObject: OBJECT_SEQUENCE[0].name.en,
      mode: "guided",
    });
  }
  if (method === "GET" && path === "/api/dotpad/status") {
    return json({
      connected: false,
      deviceName: "Dot Pad (mock)",
      currentObject: OBJECT_SEQUENCE[0].name.en,
      mode: "guided",
    });
  }
  if (method === "POST" && path === "/api/dotpad/key-event") {
    const key = body?.key as DotPadKey | undefined;
    const index = body?.currentObjectIndex ?? 0;
    if (!key || !VALID_KEYS.includes(key))
      return json({ error: `key must be one of: ${VALID_KEYS.join(", ")}` }, 400);
    return json(computeKeyEvent(key, index, "en"));
  }

  return json({ error: `No mock handler for ${method} ${path}` }, 404);
}

let installed = false;

/** Patch window.fetch to answer /api/* in-browser. Idempotent, client-only. */
export function installApiShim(): void {
  if (installed || typeof window === "undefined") return;
  installed = true;

  const original = window.fetch.bind(window);

  window.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    let url: string;
    if (typeof input === "string") url = input;
    else if (input instanceof URL) url = input.toString();
    else url = input.url;

    let parsed: URL;
    try {
      parsed = new URL(url, window.location.origin);
    } catch {
      return original(input, init);
    }

    const apiIdx = parsed.pathname.indexOf("/api/");
    if (apiIdx === -1) return original(input, init);

    const apiPath = parsed.pathname.slice(apiIdx).replace(/\/$/, "") || "/api";
    const method = (
      init?.method ||
      (input instanceof Request ? input.method : "GET")
    ).toUpperCase();

    let body: any = null;
    const rawBody =
      init?.body ?? (input instanceof Request ? undefined : undefined);
    if (rawBody && typeof rawBody === "string") {
      try {
        body = JSON.parse(rawBody);
      } catch {
        body = null;
      }
    }

    try {
      return await handle(method, apiPath, parsed.searchParams, body);
    } catch (err) {
      return json(
        { error: err instanceof Error ? err.message : "shim error" },
        500
      );
    }
  };
}

// Install at import time so the patch is in place before component effects run.
installApiShim();

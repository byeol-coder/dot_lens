import { NextResponse } from "next/server";
import { convertToTactile } from "@/lib/mockGemini";
import { createJob } from "@/lib/brailleStore";
import type { AccessibilityProfile, Difficulty } from "@/types";

interface ConvertBody {
  analysisId?: string;
  difficulty?: Difficulty;
  accessibilityProfile?: AccessibilityProfile;
}

// POST /api/convert — convert an analysis into tactile/braille/audio/quiz output.
// Phase 3: braille is now produced by the real braille engine and submitted to
// the Global Braille QA layer (a job is created in `qa_pending`).
// Body: { analysisId, difficulty?, accessibilityProfile? }
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as ConvertBody | null;
  const analysisId = body?.analysisId;

  if (!analysisId) {
    return NextResponse.json({ error: "analysisId is required" }, { status: 400 });
  }

  const result = convertToTactile(
    analysisId,
    body?.difficulty,
    body?.accessibilityProfile
  );

  // Derive the assignment and submit a real braille summary for QA review.
  const assignmentId = analysisId.replace(/^an-/, "");
  const standard = result.accessibilityProfile.brailleStandard;
  const language = result.accessibilityProfile.language;
  const summaryText = "water cycle"; // demo summary; real impl derives from analysis
  const job = createJob(assignmentId, summaryText, standard, language);

  // Replace the placeholder braille with the engine output + link the QA job.
  result.brailleSummaries = [job.summary];
  result.brailleJobId = job.id;

  return NextResponse.json({ result });
}

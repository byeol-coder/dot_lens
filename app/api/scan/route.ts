import { NextResponse } from "next/server";
import { getAssignmentById } from "@/lib/mockAssignments";
import { analyzeVisual } from "@/lib/mockGemini";

interface ScanBody {
  assignmentId?: string;
  materialId?: string;
}

// POST /api/scan — mock Gemini visual analysis for a material.
// Body: { assignmentId, materialId }
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as ScanBody | null;
  const assignmentId = body?.assignmentId;
  const materialId = body?.materialId;

  if (!assignmentId || !materialId) {
    return NextResponse.json(
      { error: "assignmentId and materialId are required" },
      { status: 400 }
    );
  }

  const assignment = getAssignmentById(assignmentId);
  if (!assignment) {
    return NextResponse.json(
      { error: `Assignment '${assignmentId}' not found` },
      { status: 404 }
    );
  }

  // TODO(real Gemini): swap this synchronous mock for the multimodal call.
  const analysis = analyzeVisual(assignmentId, materialId);
  return NextResponse.json({ analysis });
}

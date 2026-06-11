import { NextResponse } from "next/server";
import { saveProgress } from "@/lib/progressStore";
import type { StudentProgress } from "@/types";

// POST /api/progress — mock-save a student's progress.
// Body: StudentProgress
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<StudentProgress> | null;

  if (!body?.studentId || !body?.assignmentId) {
    return NextResponse.json(
      { error: "studentId and assignmentId are required" },
      { status: 400 }
    );
  }

  // TODO(real backend): persist to a database / Classroom add-on store.
  const saved = saveProgress(body as StudentProgress);
  return NextResponse.json({ saved });
}

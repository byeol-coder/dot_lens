import { NextResponse } from "next/server";
import { getProgressByAssignment } from "@/lib/progressStore";

// GET /api/progress/[assignmentId] — mock teacher dashboard progress.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  const { assignmentId } = await params;
  const progress = getProgressByAssignment(assignmentId);
  return NextResponse.json({ progress });
}

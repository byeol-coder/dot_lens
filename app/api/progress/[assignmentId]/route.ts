import { NextResponse } from "next/server";
import { getProgressByAssignment } from "@/lib/progressStore";

// GET /api/progress/[assignmentId] — mock teacher dashboard progress.
export async function GET(
  _req: Request,
  { params }: { params: { assignmentId: string } }
) {
  const progress = getProgressByAssignment(params.assignmentId);
  return NextResponse.json({ progress });
}

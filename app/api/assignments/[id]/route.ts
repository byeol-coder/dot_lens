import { NextResponse } from "next/server";
import { getAssignmentById } from "@/lib/mockAssignments";

// GET /api/assignments/[id] — a single assignment (e.g. the Water Cycle).
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const assignment = getAssignmentById(params.id);
  if (!assignment) {
    return NextResponse.json(
      { error: `Assignment '${params.id}' not found` },
      { status: 404 }
    );
  }
  return NextResponse.json({ assignment });
}

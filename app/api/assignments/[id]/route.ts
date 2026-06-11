import { NextResponse } from "next/server";
import { getAssignmentById } from "@/lib/mockAssignments";

// GET /api/assignments/[id] — a single assignment (e.g. the Water Cycle).
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const assignment = getAssignmentById(id);

  if (!assignment) {
    return NextResponse.json(
      { error: `Assignment '${id}' not found` },
      { status: 404 }
    );
  }

  return NextResponse.json({ assignment });
}

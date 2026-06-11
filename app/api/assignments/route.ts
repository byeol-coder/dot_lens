import { NextResponse } from "next/server";
import { getAssignments } from "@/lib/mockAssignments";

// GET /api/assignments — list sample Classroom assignments.
export async function GET() {
  return NextResponse.json({ assignments: getAssignments() });
}

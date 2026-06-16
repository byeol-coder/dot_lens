import { NextResponse } from "next/server";
import { getJob } from "@/lib/brailleStore";

// GET /api/braille/jobs/[id] — a single braille translation job.
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const job = getJob(params.id);
  if (!job) {
    return NextResponse.json(
      { error: `Job '${params.id}' not found` },
      { status: 404 }
    );
  }
  return NextResponse.json({ job });
}

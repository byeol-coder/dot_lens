import { NextResponse } from "next/server";
import { reviewJob } from "@/lib/brailleStore";
import type { LocalizedText } from "@/types";

interface ReviewBody {
  jobId?: string;
  decision?: "approved" | "changes_requested";
  reviewerName?: string;
  notes?: LocalizedText;
}

// POST /api/braille/review — expert approve / request changes on a braille job.
// Body: { jobId, decision, reviewerName?, notes? }
// Note: approval is blocked while unresolved blocker/major issues remain.
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as ReviewBody | null;
  const jobId = body?.jobId;
  const decision = body?.decision;

  if (!jobId || (decision !== "approved" && decision !== "changes_requested")) {
    return NextResponse.json(
      { error: "jobId and a valid decision are required" },
      { status: 400 }
    );
  }

  const job = reviewJob(jobId, decision, body?.reviewerName ?? "Reviewer", body?.notes);
  if (!job) {
    return NextResponse.json({ error: `Job '${jobId}' not found` }, { status: 404 });
  }
  return NextResponse.json({ job });
}

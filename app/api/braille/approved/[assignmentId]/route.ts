import { NextResponse } from "next/server";
import { getApprovedSummaryText } from "@/lib/brailleStore";
import type { Language } from "@/types";

// GET /api/braille/approved/[assignmentId]?lang=en
// Returns the QA-approved braille summary text for an assignment (used by F4),
// or null if nothing has been approved yet.
export async function GET(
  req: Request,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  const { assignmentId } = await params;
  const url = new URL(req.url);
  const lang: Language = url.searchParams.get("lang") === "ko" ? "ko" : "en";
  const approvedText = getApprovedSummaryText(assignmentId, lang);
  return NextResponse.json({ approvedText, language: lang });
}

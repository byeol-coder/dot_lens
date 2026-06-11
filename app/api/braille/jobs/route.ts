import { NextResponse } from "next/server";
import { listJobs } from "@/lib/brailleStore";

// GET /api/braille/jobs — the Global Braille QA review queue.
export async function GET() {
  return NextResponse.json({ jobs: listJobs() });
}

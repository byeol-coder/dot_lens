import { NextResponse } from "next/server";
import { computeKeyEvent } from "@/lib/dotpadEngine";
import type { DotPadKey } from "@/types";

const VALID_KEYS: DotPadKey[] = ["leftPan", "rightPan", "f1", "f2", "f3", "f4"];

interface KeyEventBody {
  key?: DotPadKey;
  currentObjectIndex?: number;
}

// POST /api/dotpad/key-event — compute the result of a key press.
// Body: { key, currentObjectIndex }
// Shares the exact engine the client simulator uses, so results match.
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as KeyEventBody | null;
  const key = body?.key;
  const index = body?.currentObjectIndex ?? 0;

  if (!key || !VALID_KEYS.includes(key)) {
    return NextResponse.json(
      { error: `key must be one of: ${VALID_KEYS.join(", ")}` },
      { status: 400 }
    );
  }

  const result = computeKeyEvent(key, index, "en");
  return NextResponse.json(result);
}

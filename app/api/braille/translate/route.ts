import { NextResponse } from "next/server";
import { buildSummary } from "@/lib/brailleEngine";
import type { BrailleStandard, Language } from "@/types";

const STANDARDS: BrailleStandard[] = [
  "UEB-G1", "UEB-G2", "KO-G1", "KO-G2", "Nemeth", "KO-Math",
];

interface TranslateBody {
  text?: string;
  standard?: BrailleStandard;
  language?: Language;
}

// POST /api/braille/translate — translate text into braille cells.
// Body: { text, standard?, language? }
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as TranslateBody | null;
  const text = body?.text;
  if (typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }
  const language: Language = body?.language === "ko" ? "ko" : "en";
  const standard: BrailleStandard =
    body?.standard && STANDARDS.includes(body.standard)
      ? body.standard
      : language === "ko"
      ? "KO-G1"
      : "UEB-G1";

  const { summary, untranslatable } = buildSummary(text, standard, language);
  return NextResponse.json({ summary, untranslatable });
}

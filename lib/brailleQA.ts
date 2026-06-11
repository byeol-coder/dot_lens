import type {
  BrailleCell,
  BrailleQAIssue,
  BrailleStandard,
  Language,
} from "@/types";
import type { UntranslatableMark } from "@/lib/brailleEngine";

/**
 * Global Braille QA layer (rules).
 *
 * Deterministic checks that surface likely problems for a human reviewer.
 * These are illustrative but realistic; a production system would add the full
 * UEB / Korean rule sets and a certified TVI in the loop.
 *
 * TODO(future): Grade 2 contraction checks, Nemeth validation, Korean 약자.
 */

let counter = 0;
function nextId(): string {
  counter += 1;
  return `qa-${Date.now().toString(36)}-${counter}`;
}

export function runQA(
  text: string,
  language: Language,
  standard: BrailleStandard,
  cells: BrailleCell[],
  untranslatable: UntranslatableMark[]
): BrailleQAIssue[] {
  const issues: BrailleQAIssue[] = [];

  // 1) Untranslatable characters → blocker
  for (const u of untranslatable) {
    issues.push({
      id: nextId(),
      pageIndex: 0,
      cellRange: [u.index, u.index],
      severity: "blocker",
      rule: language === "ko" ? "KO — unsupported jamo" : "UEB — unsupported character",
      message: {
        en: `Could not translate "${u.char}". A reviewer must provide an equivalent.`,
        ko: `"${u.char}"을(를) 변환할 수 없습니다. 검수자가 대체 표기를 제공해야 합니다.`,
      },
      resolved: false,
    });
  }

  // 2) Empty input → major
  if (text.trim().length === 0) {
    issues.push({
      id: nextId(),
      pageIndex: 0,
      cellRange: [0, 0],
      severity: "major",
      rule: "Content — empty summary",
      message: { en: "The braille summary is empty.", ko: "점자 요약이 비어 있습니다." },
      resolved: false,
    });
  }

  // 3) All-caps word → minor (capitalized-word indicator)
  if (standard.startsWith("UEB") && /\b[A-Z]{2,}\b/.test(text)) {
    issues.push({
      id: nextId(),
      pageIndex: 0,
      cellRange: [0, Math.min(cells.length, 20)],
      severity: "minor",
      rule: "UEB §8 — capitalization",
      message: {
        en: "All-caps word detected; consider the capitalized-word indicator (⠠⠠).",
        ko: "대문자 단어가 감지됨; 대문자 단어 표시(⠠⠠) 사용을 검토하세요.",
      },
      suggestion: {
        en: "Use a single capitalized-word indicator instead of per-letter signs.",
        ko: "글자마다 표시 대신 단어 단위 대문자 표시를 사용하세요.",
      },
      resolved: false,
    });
  }

  // 4) Digits present → info (number sign applied)
  if (/\d/.test(text)) {
    issues.push({
      id: nextId(),
      pageIndex: 0,
      cellRange: [0, Math.min(cells.length, 20)],
      severity: "info",
      rule: "UEB §6 — numerals",
      message: {
        en: "Number sign applied before numerals.",
        ko: "숫자 앞에 수표가 적용되었습니다.",
      },
      resolved: true,
    });
  }

  // 5) Korean uncontracted note → info
  if (standard === "KO-G1") {
    issues.push({
      id: nextId(),
      pageIndex: 0,
      cellRange: [0, Math.min(cells.length, 20)],
      severity: "info",
      rule: "KO — uncontracted",
      message: {
        en: "Rendered without abbreviations (약자). Confirm this is appropriate for the grade level.",
        ko: "약자 없이 표기되었습니다. 학년 수준에 적절한지 확인하세요.",
      },
      resolved: false,
    });
  }

  // 6) Spans multiple braille lines → info
  if (cells.length > 20) {
    issues.push({
      id: nextId(),
      pageIndex: 0,
      cellRange: [20, cells.length],
      severity: "info",
      rule: "Layout — line length",
      message: {
        en: `Summary spans ${Math.ceil(cells.length / 20)} braille lines.`,
        ko: `요약이 점자 ${Math.ceil(cells.length / 20)}줄에 걸쳐 있습니다.`,
      },
      resolved: true,
    });
  }

  return issues;
}

/** A job is blocked from approval while any unresolved blocker/major remains. */
export function hasBlockingIssues(issues: BrailleQAIssue[]): boolean {
  return issues.some(
    (i) => !i.resolved && (i.severity === "blocker" || i.severity === "major")
  );
}

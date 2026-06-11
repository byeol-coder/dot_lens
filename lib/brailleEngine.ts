import type {
  BrailleCell,
  BrailleStandard,
  BrailleSummary,
  Language,
} from "@/types";

/**
 * Braille translation engine.
 *
 * Phase 3 implements REAL braille (not placeholders) for:
 *  - English: UEB Grade 1 (uncontracted) — letters, digits (number sign),
 *    capital sign, and common punctuation.
 *  - Korean:  한글 점자 (uncontracted) — 초성 / 중성 / 종성 decomposition.
 *
 * TODO(future): UEB Grade 2 contractions, Nemeth (math), and Korean 약자
 * (abbreviations). Unsupported characters are reported as `untranslatable`
 * so the QA layer can flag them rather than silently dropping them.
 */

const CELLS_PER_PAGE = 20;

/* ---- English (UEB Grade 1) -------------------------------------------- */

const EN_LETTER: Record<string, number[]> = {
  a: [1], b: [1, 2], c: [1, 4], d: [1, 4, 5], e: [1, 5], f: [1, 2, 4],
  g: [1, 2, 4, 5], h: [1, 2, 5], i: [2, 4], j: [2, 4, 5], k: [1, 3],
  l: [1, 2, 3], m: [1, 3, 4], n: [1, 3, 4, 5], o: [1, 3, 5], p: [1, 2, 3, 4],
  q: [1, 2, 3, 4, 5], r: [1, 2, 3, 5], s: [2, 3, 4], t: [2, 3, 4, 5],
  u: [1, 3, 6], v: [1, 2, 3, 6], w: [2, 4, 5, 6], x: [1, 3, 4, 6],
  y: [1, 3, 4, 5, 6], z: [1, 3, 5, 6],
};

// digits reuse a–j with a preceding number sign
const EN_DIGIT: Record<string, number[]> = {
  "1": EN_LETTER.a, "2": EN_LETTER.b, "3": EN_LETTER.c, "4": EN_LETTER.d,
  "5": EN_LETTER.e, "6": EN_LETTER.f, "7": EN_LETTER.g, "8": EN_LETTER.h,
  "9": EN_LETTER.i, "0": EN_LETTER.j,
};

const EN_PUNCT: Record<string, number[]> = {
  ".": [2, 5, 6], ",": [2], ";": [2, 3], ":": [2, 5], "?": [2, 3, 6],
  "!": [2, 3, 5], "'": [3], "-": [3, 6],
};

const CAP_SIGN = [6];
const NUMBER_SIGN = [3, 4, 5, 6];

/* ---- Korean (한글 점자, uncontracted) --------------------------------- */
// Lead index order:  ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ
const KO_LEAD: Record<number, number[]> = {
  0: [4], 2: [1, 4], 3: [2, 4], 5: [5], 6: [1, 5], 7: [4, 5], 9: [6],
  11: [], 12: [4, 6], 14: [5, 6], 15: [1, 2, 4], 16: [1, 2, 5],
  17: [1, 4, 5], 18: [2, 4, 5],
};
// Vowel index order: ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ
const KO_VOWEL: Record<number, number[]> = {
  0: [1, 2, 6], 1: [1, 2, 3, 5], 2: [3, 4, 5], 4: [2, 3, 4], 5: [1, 3, 4, 5],
  6: [1, 5, 6], 8: [1, 3, 6], 12: [3, 4, 6], 13: [1, 3, 4], 17: [1, 4, 6],
  18: [2, 4, 6], 20: [1, 3, 5],
};
// Tail index order: (none)ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ
const KO_TAIL: Record<number, number[]> = {
  1: [1], 4: [2, 5], 7: [3, 5], 8: [2], 16: [2, 6], 17: [1, 2], 19: [3],
  21: [2, 3, 5, 6], 22: [1, 3],
};

export interface UntranslatableMark {
  char: string;
  index: number;
}

export interface TranslateResult {
  cells: BrailleCell[];
  untranslatable: UntranslatableMark[];
}

function translateEnglish(text: string): TranslateResult {
  const cells: BrailleCell[] = [];
  const untranslatable: UntranslatableMark[] = [];
  let numberMode = false;

  [...text].forEach((ch, i) => {
    if (ch === " ") {
      cells.push([]);
      numberMode = false;
      return;
    }
    if (EN_DIGIT[ch]) {
      if (!numberMode) {
        cells.push(NUMBER_SIGN);
        numberMode = true;
      }
      cells.push(EN_DIGIT[ch]);
      return;
    }
    numberMode = false;
    const lower = ch.toLowerCase();
    if (EN_LETTER[lower]) {
      if (ch !== lower) cells.push(CAP_SIGN); // capital indicator
      cells.push(EN_LETTER[lower]);
      return;
    }
    if (EN_PUNCT[ch]) {
      cells.push(EN_PUNCT[ch]);
      return;
    }
    untranslatable.push({ char: ch, index: i });
  });

  return { cells, untranslatable };
}

function translateKorean(text: string): TranslateResult {
  const cells: BrailleCell[] = [];
  const untranslatable: UntranslatableMark[] = [];

  [...text].forEach((ch, i) => {
    if (ch === " ") {
      cells.push([]);
      return;
    }
    const code = ch.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) {
      const s = code - 0xac00;
      const lead = Math.floor(s / 588);
      const vowel = Math.floor((s % 588) / 28);
      const tail = s % 28;

      const leadCell = KO_LEAD[lead];
      if (leadCell === undefined) {
        untranslatable.push({ char: ch, index: i });
        return;
      }
      if (leadCell.length) cells.push(leadCell); // ㅇ initial is silent

      const vowelCell = KO_VOWEL[vowel];
      if (vowelCell === undefined) {
        untranslatable.push({ char: ch, index: i });
        return;
      }
      cells.push(vowelCell);

      if (tail > 0) {
        const tailCell = KO_TAIL[tail];
        if (tailCell === undefined) {
          untranslatable.push({ char: ch, index: i });
          return;
        }
        cells.push(tailCell);
      }
      return;
    }
    // allow basic latin/digits inside Korean text via the English path
    const en = translateEnglish(ch);
    if (en.untranslatable.length) untranslatable.push({ char: ch, index: i });
    else cells.push(...en.cells);
  });

  return { cells, untranslatable };
}

export function translate(
  text: string,
  language: Language
): TranslateResult {
  return language === "ko" ? translateKorean(text) : translateEnglish(text);
}

/** Build a paginated 20-cell summary plus the untranslatable marks. */
export function buildSummary(
  text: string,
  standard: BrailleStandard,
  language: Language
): { summary: BrailleSummary; untranslatable: UntranslatableMark[] } {
  // The engine currently produces uncontracted (Grade 1) braille only, so we
  // label the output honestly regardless of the requested grade.
  // TODO(future): honor UEB-G2 / KO-G2 / Nemeth once contractions are added.
  const effectiveStandard: BrailleStandard =
    language === "ko" || standard.startsWith("KO") ? "KO-G1" : "UEB-G1";

  const { cells, untranslatable } = translate(text, language);
  const pages = [];
  for (let i = 0; i < Math.max(cells.length, 1); i += CELLS_PER_PAGE) {
    pages.push({
      index: pages.length,
      text: i === 0 ? text : "",
      cells: cells.slice(i, i + CELLS_PER_PAGE),
    });
  }
  return {
    summary: { standard: effectiveStandard, language, cellsPerPage: CELLS_PER_PAGE, pages },
    untranslatable,
  };
}

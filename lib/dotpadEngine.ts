import type { DotPadKey, DotPadState, Language, QuizState } from "@/types";
import {
  OBJECT_SEQUENCE,
  OBJECT_COUNT,
  getMatrix,
} from "@/lib/tactileMatrix";

/**
 * Dot Pad interaction engine.
 *
 * This is the single source of truth for what each key does. It is used by:
 *  - the client simulator (instant, local — no network round-trip), and
 *  - POST /api/dotpad/key-event (so the API returns identical results).
 *
 * TODO(real device): replace this with the Dot Pad SDK adapter; the key
 * semantics and return shape stay the same.
 */

/* Per-object tutoring copy (bilingual; Phase 2 UI uses English). */
interface ObjectCopy {
  audio: Record<Language, string>;
  explain: Record<Language, string>;
  hint: Record<Language, string>;
}

const COPY: Record<string, ObjectCopy> = {
  sun: {
    audio: { en: "The sun.", ko: "태양이에요." },
    explain: { en: "The sun is in the upper-right. It heats the water and starts the cycle.", ko: "태양은 오른쪽 위에 있어요. 물을 데워 순환을 시작해요." },
    hint: { en: "Move your fingers to the upper-right corner and feel the round shape with rays.", ko: "오른쪽 위 모서리로 손가락을 옮겨 광선이 있는 둥근 모양을 느껴 보세요." },
  },
  water: {
    audio: { en: "Water.", ko: "물이에요." },
    explain: { en: "Water sits along the bottom as a wide band — this is where the cycle begins.", ko: "물은 아래쪽에 넓은 띠로 있어요. 여기서 순환이 시작돼요." },
    hint: { en: "Slide your fingers to the bottom and feel the wide band with a wavy top.", ko: "손가락을 아래쪽으로 밀어 물결 모양 위가 있는 넓은 띠를 느껴 보세요." },
  },
  evaporation: {
    audio: { en: "Evaporation arrow.", ko: "증발 화살표예요." },
    explain: { en: "An arrow points up from the water — warmth turns water into vapor that rises.", ko: "물에서 위로 향하는 화살표예요. 열이 물을 수증기로 바꿔 위로 올라가요." },
    hint: { en: "Feel the tall arrow on the left, pointing up.", ko: "왼쪽의 위를 가리키는 긴 화살표를 느껴 보세요." },
  },
  cloud: {
    audio: { en: "Cloud.", ko: "구름이에요." },
    explain: { en: "Vapor cools and gathers into a cloud near the top.", ko: "수증기가 식어 위쪽에 구름으로 모여요." },
    hint: { en: "Move to the upper-center and feel the wide, rounded shape.", ko: "위쪽 가운데로 가서 넓고 둥근 모양을 느껴 보세요." },
  },
  rain: {
    audio: { en: "Rain.", ko: "비예요." },
    explain: { en: "Water falls from the cloud as rain — feel the slanted dashes coming down.", ko: "물이 구름에서 비로 떨어져요. 비스듬히 내려오는 점선을 느껴 보세요." },
    hint: { en: "Feel the short slanted lines below the cloud.", ko: "구름 아래의 짧은 비스듬한 선들을 느껴 보세요." },
  },
  river: {
    audio: { en: "River.", ko: "강이에요." },
    explain: { en: "A winding river carries the water back toward the sea.", ko: "구불구불한 강이 물을 다시 바다로 옮겨요." },
    hint: { en: "Feel the wavy band winding across the lower-middle.", ko: "중간 아래를 가로지르는 물결 모양 띠를 느껴 보세요." },
  },
  cycle: {
    audio: { en: "The full water cycle.", ko: "전체 물의 순환이에요." },
    explain: { en: "This loop shows the whole cycle: heat, evaporation, cloud, rain, river, and back again.", ko: "이 고리는 전체 순환을 보여줘요: 열, 증발, 구름, 비, 강, 그리고 다시." },
    hint: { en: "Feel the large oval ring that connects every part.", ko: "모든 부분을 잇는 큰 타원 고리를 느껴 보세요." },
  },
};

/** Placeholder “reviewed braille” + full summary used by F4 (Phase 3 = real braille + QA). */
const REVIEWED_BRAILLE_SUMMARY = "WATER CYCLE SUMMARY";
const FULL_SUMMARY: Record<Language, string> = {
  en: "Full summary: the sun heats the water, it evaporates and forms a cloud, falls as rain, flows through a river, and returns to the water — the cycle repeats.",
  ko: "전체 요약: 태양이 물을 데우고, 증발해 구름이 되며, 비로 떨어져 강을 따라 흘러 다시 물로 돌아와요 — 순환이 반복돼요.",
};
const QUIZ_PLACEHOLDER: Record<Language, string> = {
  en: "Quiz mode is starting. Find the part I describe, then press F3 to check. (Full quiz arrives next.)",
  ko: "퀴즈 모드를 시작해요. 설명하는 부분을 찾고 F3을 눌러 확인하세요. (전체 퀴즈는 다음에 추가됩니다.)",
};

function clamp(i: number): number {
  return Math.max(0, Math.min(OBJECT_COUNT - 1, i));
}

/* ---------------------------------------------------------------------------
 * Tactile quiz (F3) — find the object, then F3 to check
 * ------------------------------------------------------------------------- */

interface QuizQuestion {
  answerObjectId: string;
  prompt: Record<Language, string>;
  hint: Record<Language, string>;
}

const QUIZ: QuizQuestion[] = [
  {
    answerObjectId: "evaporation",
    prompt: { en: "Find the part where water rises from the water into the air.", ko: "물에서 공기로 올라가는 부분을 찾으세요." },
    hint: { en: "It's the tall upward arrow, just above the water.", ko: "물 바로 위, 위로 향하는 긴 화살표예요." },
  },
  {
    answerObjectId: "cloud",
    prompt: { en: "Now find where the vapor gathers near the top.", ko: "이제 수증기가 위쪽에 모이는 곳을 찾으세요." },
    hint: { en: "Upper-center — a wide, rounded shape.", ko: "위쪽 가운데 — 넓고 둥근 모양이에요." },
  },
  {
    answerObjectId: "rain",
    prompt: { en: "Last one: find where water falls back down.", ko: "마지막: 물이 다시 떨어지는 곳을 찾으세요." },
    hint: { en: "Slanted lines coming down from the cloud.", ko: "구름에서 비스듬히 내려오는 선들이에요." },
  },
];

const QUIZ_START: Record<Language, string> = {
  en: "Quiz time! Use Left and Right to move, then press F3 to check your answer.",
  ko: "퀴즈 시간! 왼쪽·오른쪽으로 이동하고 F3을 눌러 정답을 확인하세요.",
};
const QUIZ_CORRECT: Record<Language, string> = { en: "Correct!", ko: "정답이에요!" };
function quizIncorrect(name: string, lang: Language): string {
  return lang === "en"
    ? `Not quite — that's the ${name.toLowerCase()}. Try again, or press F2 for a hint.`
    : `아쉬워요 — 그건 ${name}이에요. 다시 시도하거나 F2로 힌트를 받으세요.`;
}
function quizDone(score: number, total: number, lang: Language): string {
  return lang === "en"
    ? `Quiz complete! You scored ${score} out of ${total}. Great tactile exploring.`
    : `퀴즈 완료! ${total}점 만점에 ${score}점이에요. 촉각 탐색을 아주 잘했어요.`;
}

export const initialQuizState: QuizState = {
  active: false,
  questionIndex: 0,
  total: QUIZ.length,
  score: 0,
  lastResult: null,
  finished: false,
};

/* ---------------------------------------------------------------------------
 * Result shape returned to the API (and used to build client state)
 * ------------------------------------------------------------------------- */

export interface KeyEventResult {
  nextObjectIndex: number;
  currentObjectName: string;
  brailleText: string;
  tutorMessage: string;
  tactileMatrix: ReturnType<typeof getMatrix>;
}

/** Pure, stateless computation of a key press. Used by the API route. */
export function computeKeyEvent(
  key: DotPadKey,
  currentObjectIndex: number,
  lang: Language = "en"
): KeyEventResult {
  let index = clamp(currentObjectIndex);
  let atEdge: "start" | "end" | null = null;

  if (key === "leftPan") {
    if (index === 0) atEdge = "start";
    index = clamp(index - 1);
  } else if (key === "rightPan") {
    if (index === OBJECT_COUNT - 1) atEdge = "end";
    index = clamp(index + 1);
  }

  const obj = OBJECT_SEQUENCE[index];
  const copy = COPY[obj.id];

  let brailleText = obj.brailleLabel;
  let tutorMessage = copy.audio[lang];

  switch (key) {
    case "leftPan":
    case "rightPan":
      tutorMessage =
        atEdge === "start"
          ? (lang === "en" ? "You're at the start. " : "처음이에요. ") + copy.audio[lang]
          : atEdge === "end"
          ? (lang === "en" ? "You're at the end. " : "끝이에요. ") + copy.audio[lang]
          : copy.audio[lang];
      break;
    case "f1":
      tutorMessage = copy.explain[lang];
      break;
    case "f2":
      tutorMessage = copy.hint[lang];
      break;
    case "f3":
      tutorMessage = QUIZ_PLACEHOLDER[lang];
      break;
    case "f4":
      brailleText = REVIEWED_BRAILLE_SUMMARY; // TODO(Phase 3): QA-approved braille
      tutorMessage = FULL_SUMMARY[lang];
      break;
  }

  return {
    nextObjectIndex: index,
    currentObjectName: obj.name[lang],
    brailleText,
    tutorMessage,
    tactileMatrix: getMatrix(key === "f4" ? "cycle" : obj.id),
  };
}

/* ---------------------------------------------------------------------------
 * Client state helpers
 * ------------------------------------------------------------------------- */

export function getInitialState(lang: Language = "en"): DotPadState {
  const obj = OBJECT_SEQUENCE[0];
  return {
    connected: false,
    currentObjectIndex: 0,
    currentObjectName: obj.name[lang],
    currentBrailleText: obj.brailleLabel,
    currentTutorMessage:
      lang === "en"
        ? "Connect the Dot Pad to begin exploring the water cycle."
        : "Dot Pad를 연결해 물의 순환 탐색을 시작하세요.",
    currentMatrix: getMatrix(obj.id),
    lastKeyPressed: null,
    quizState: { ...initialQuizState },
    exploredIds: [],
    hintsUsed: 0,
  };
}

/** Build the connected starting state (object 0 shown). */
export function getConnectedState(lang: Language = "en"): DotPadState {
  const obj = OBJECT_SEQUENCE[0];
  return {
    connected: true,
    currentObjectIndex: 0,
    currentObjectName: obj.name[lang],
    currentBrailleText: obj.brailleLabel,
    currentTutorMessage:
      lang === "en"
        ? `Dot Pad connected. You're at the ${obj.name.en.toLowerCase()}. Press Right to move on, or F1 to learn more.`
        : `Dot Pad가 연결됐어요. 지금 ${obj.name.ko}에 있어요. 오른쪽을 눌러 이동하거나 F1로 더 알아보세요.`,
    currentMatrix: getMatrix(obj.id),
    lastKeyPressed: null,
    quizState: { ...initialQuizState },
    exploredIds: [obj.id],
    hintsUsed: 0,
  };
}

/** Apply a key to the client state (drives the live quiz + session metrics). */
export function applyKey(
  state: DotPadState,
  key: DotPadKey,
  lang: Language = "en"
): DotPadState {
  const res = computeKeyEvent(key, state.currentObjectIndex, lang);

  let quizState: QuizState = state.quizState;
  let tutorMessage = res.tutorMessage;

  // Phase 3: F4 shows the QA-approved braille summary (gated by expert review).
  const brailleText =
    key === "f4"
      ? state.approvedBrailleSummary ??
        (lang === "en" ? "pending review" : "검수 대기")
      : res.brailleText;

  // During an active quiz, F2 gives the question-specific hint.
  if (key === "f2" && state.quizState.active && !state.quizState.finished) {
    tutorMessage = QUIZ[state.quizState.questionIndex].hint[lang];
  }

  // F3 — start the quiz, or check the focused object against the answer.
  if (key === "f3") {
    if (!state.quizState.active) {
      quizState = {
        active: true,
        questionIndex: 0,
        total: QUIZ.length,
        score: 0,
        lastResult: null,
        finished: false,
      };
      tutorMessage = `${QUIZ_START[lang]} ${QUIZ[0].prompt[lang]}`;
    } else if (!state.quizState.finished) {
      const q = QUIZ[state.quizState.questionIndex];
      const focusedId = OBJECT_SEQUENCE[state.currentObjectIndex].id;
      const focusedName = OBJECT_SEQUENCE[state.currentObjectIndex].name[lang];
      if (focusedId === q.answerObjectId) {
        const score = state.quizState.score + 1;
        const isLast = state.quizState.questionIndex + 1 >= QUIZ.length;
        if (isLast) {
          quizState = { ...state.quizState, score, lastResult: "correct", finished: true };
          tutorMessage = `${QUIZ_CORRECT[lang]} ${quizDone(score, QUIZ.length, lang)}`;
        } else {
          const qi = state.quizState.questionIndex + 1;
          quizState = { ...state.quizState, score, questionIndex: qi, lastResult: "correct" };
          tutorMessage = `${QUIZ_CORRECT[lang]} ${QUIZ[qi].prompt[lang]}`;
        }
      } else {
        quizState = { ...state.quizState, lastResult: "incorrect" };
        tutorMessage = quizIncorrect(focusedName, lang);
      }
    } else {
      tutorMessage = quizDone(state.quizState.score, QUIZ.length, lang);
    }
  }

  // Session metrics: distinct objects focused + hints requested.
  const focusedId = OBJECT_SEQUENCE[res.nextObjectIndex].id;
  const exploredIds = state.exploredIds.includes(focusedId)
    ? state.exploredIds
    : [...state.exploredIds, focusedId];
  const hintsUsed = state.hintsUsed + (key === "f2" ? 1 : 0);

  return {
    ...state,
    currentObjectIndex: res.nextObjectIndex,
    currentObjectName: res.currentObjectName,
    currentBrailleText: brailleText,
    currentTutorMessage: tutorMessage,
    currentMatrix: res.tactileMatrix,
    lastKeyPressed: key,
    quizState,
    exploredIds,
    hintsUsed,
  };
}

import type {
  DotPadKey,
  DotPadState,
  Language,
  LocalizedText,
  QuizState,
  TactileGridData,
} from "@/types";

/**
 * Scene-driven lesson player — the generalized Dot Pad engine.
 *
 * Where `dotpadEngine.ts` is hard-coded to the flagship water-cycle lesson,
 * this engine plays ANY lesson described as a list of pre-rendered tactile
 * objects plus an optional quiz and summary. The custom-material builder and
 * the lesson library both feed lessons through here, so a teacher's own
 * creation is explored with the exact same six-key model as the demo lesson.
 *
 * It is pure and stateless: every key press maps (lesson, state, key) → state.
 */

/** One explorable object/step in a playable lesson. */
export interface PlayableObject {
  id: string;
  name: LocalizedText;
  /** Short label rendered on the 20-cell braille line. */
  brailleLabel: string;
  /** Pre-rendered 60×40 pin grid for this object. */
  matrix: TactileGridData;
  /** F1 — what this part is. */
  explain: LocalizedText;
  /** F2 — where to find / how to feel it. */
  hint: LocalizedText;
}

export interface PlayableQuizQuestion {
  answerObjectId: string;
  prompt: LocalizedText;
  hint: LocalizedText;
}

export interface PlayableLesson {
  id: string;
  title: LocalizedText;
  objects: PlayableObject[];
  /** Composite "whole picture" grid, surfaced on F4. */
  overviewMatrix: TactileGridData;
  /** Spoken summary surfaced on F4. */
  summary: LocalizedText;
  /** Braille line shown on F4 (already QA-checked at authoring time). */
  brailleSummary: string;
  quiz: PlayableQuizQuestion[];
}

const pick = (o: LocalizedText, lang: Language) => o[lang] || o.en;

function clampIndex(lesson: PlayableLesson, i: number): number {
  return Math.max(0, Math.min(lesson.objects.length - 1, i));
}

export function initialQuiz(lesson: PlayableLesson): QuizState {
  return {
    active: false,
    questionIndex: 0,
    total: lesson.quiz.length,
    score: 0,
    lastResult: null,
    finished: false,
  };
}

function emptyState(lang: Language): DotPadState {
  return {
    connected: false,
    currentObjectIndex: 0,
    currentObjectName: "",
    currentBrailleText: "",
    currentTutorMessage: "",
    currentMatrix: { cols: 60, rows: 40, cells: [] },
    lastKeyPressed: null,
    quizState: { active: false, questionIndex: 0, total: 0, score: 0, lastResult: null, finished: false },
    exploredIds: [],
    hintsUsed: 0,
  };
}

/** Disconnected starting state for a lesson. */
export function playerInitial(lesson: PlayableLesson, lang: Language = "en"): DotPadState {
  const obj = lesson.objects[0];
  if (!obj) return emptyState(lang);
  return {
    connected: false,
    currentObjectIndex: 0,
    currentObjectName: pick(obj.name, lang),
    currentBrailleText: obj.brailleLabel,
    currentTutorMessage:
      lang === "ko"
        ? `Dot Pad를 연결해 "${pick(lesson.title, "ko")}" 탐색을 시작하세요.`
        : `Connect the Dot Pad to start exploring "${pick(lesson.title, "en")}".`,
    currentMatrix: obj.matrix,
    lastKeyPressed: null,
    quizState: initialQuiz(lesson),
    exploredIds: [],
    hintsUsed: 0,
    approvedBrailleSummary: lesson.brailleSummary,
  };
}

/** Connected starting state — first object shown. */
export function playerConnected(lesson: PlayableLesson, lang: Language = "en"): DotPadState {
  const obj = lesson.objects[0];
  if (!obj) return { ...emptyState(lang), connected: true };
  const name = pick(obj.name, lang);
  return {
    connected: true,
    currentObjectIndex: 0,
    currentObjectName: name,
    currentBrailleText: obj.brailleLabel,
    currentTutorMessage:
      lang === "ko"
        ? `Dot Pad가 연결됐어요. 지금 "${name}"에 있어요. 오른쪽으로 이동하거나 F1로 더 알아보세요.`
        : `Dot Pad connected. You're at "${name}". Press Right to move on, or F1 to learn more.`,
    currentMatrix: obj.matrix,
    lastKeyPressed: null,
    quizState: initialQuiz(lesson),
    exploredIds: [obj.id],
    hintsUsed: 0,
    approvedBrailleSummary: lesson.brailleSummary,
  };
}

function edgeNote(edge: "start" | "end" | null, lang: Language): string {
  if (!edge) return "";
  if (edge === "start") return lang === "ko" ? "처음이에요. " : "You're at the start. ";
  return lang === "ko" ? "끝이에요. " : "You're at the end. ";
}

/** Apply one key press to the player state. */
export function playerApplyKey(
  lesson: PlayableLesson,
  state: DotPadState,
  key: DotPadKey,
  lang: Language = "en"
): DotPadState {
  if (lesson.objects.length === 0) return state;

  let index = clampIndex(lesson, state.currentObjectIndex);
  let edge: "start" | "end" | null = null;

  if (key === "leftPan") {
    if (index === 0) edge = "start";
    index = clampIndex(lesson, index - 1);
  } else if (key === "rightPan") {
    if (index === lesson.objects.length - 1) edge = "end";
    index = clampIndex(lesson, index + 1);
  }

  const obj = lesson.objects[index];
  let quizState: QuizState = state.quizState;
  let brailleText = obj.brailleLabel;
  let tutorMessage = pick(obj.name, lang);
  let matrix: TactileGridData = obj.matrix;

  switch (key) {
    case "leftPan":
    case "rightPan":
      tutorMessage = edgeNote(edge, lang) + pick(obj.name, lang);
      break;
    case "f1":
      tutorMessage = pick(obj.explain, lang);
      break;
    case "f2":
      tutorMessage = state.quizState.active && !state.quizState.finished && lesson.quiz.length
        ? pick(lesson.quiz[state.quizState.questionIndex].hint, lang)
        : pick(obj.hint, lang);
      break;
    case "f4":
      matrix = lesson.overviewMatrix;
      brailleText = lesson.brailleSummary;
      tutorMessage = pick(lesson.summary, lang);
      break;
    case "f3": {
      if (lesson.quiz.length === 0) {
        tutorMessage =
          lang === "ko"
            ? "이 수업에는 퀴즈가 없어요. 좌우로 이동하며 자유롭게 탐색하세요."
            : "This lesson has no quiz. Use Left and Right to explore freely.";
        break;
      }
      if (!state.quizState.active) {
        quizState = {
          active: true,
          questionIndex: 0,
          total: lesson.quiz.length,
          score: 0,
          lastResult: null,
          finished: false,
        };
        tutorMessage =
          (lang === "ko"
            ? "퀴즈 시간! 좌우로 이동하고 F3을 눌러 정답을 확인하세요. "
            : "Quiz time! Use Left and Right to move, then press F3 to check. ") +
          pick(lesson.quiz[0].prompt, lang);
      } else if (!state.quizState.finished) {
        const q = lesson.quiz[state.quizState.questionIndex];
        if (obj.id === q.answerObjectId) {
          const score = state.quizState.score + 1;
          const isLast = state.quizState.questionIndex + 1 >= lesson.quiz.length;
          if (isLast) {
            quizState = { ...state.quizState, score, lastResult: "correct", finished: true };
            tutorMessage =
              lang === "ko"
                ? `정답이에요! 퀴즈 완료 — ${lesson.quiz.length}점 만점에 ${score}점이에요.`
                : `Correct! Quiz complete — you scored ${score} of ${lesson.quiz.length}.`;
          } else {
            const qi = state.quizState.questionIndex + 1;
            quizState = { ...state.quizState, score, questionIndex: qi, lastResult: "correct" };
            tutorMessage =
              (lang === "ko" ? "정답이에요! " : "Correct! ") + pick(lesson.quiz[qi].prompt, lang);
          }
        } else {
          quizState = { ...state.quizState, lastResult: "incorrect" };
          tutorMessage =
            lang === "ko"
              ? `아쉬워요 — 그건 "${pick(obj.name, "ko")}"이에요. 다시 시도하거나 F2로 힌트를 받으세요.`
              : `Not quite — that's "${pick(obj.name, "en")}". Try again, or press F2 for a hint.`;
        }
      } else {
        tutorMessage =
          lang === "ko"
            ? `퀴즈는 이미 끝났어요. ${state.quizState.total}점 만점에 ${state.quizState.score}점이에요.`
            : `Quiz already complete. You scored ${state.quizState.score} of ${state.quizState.total}.`;
      }
      break;
    }
  }

  const exploredIds = state.exploredIds.includes(obj.id)
    ? state.exploredIds
    : [...state.exploredIds, obj.id];
  const hintsUsed = state.hintsUsed + (key === "f2" ? 1 : 0);

  return {
    ...state,
    currentObjectIndex: index,
    currentObjectName: pick(obj.name, lang),
    currentBrailleText: brailleText,
    currentTutorMessage: tutorMessage,
    currentMatrix: matrix,
    lastKeyPressed: key,
    quizState,
    exploredIds,
    hintsUsed,
  };
}

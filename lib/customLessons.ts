import type { Language, LocalizedText } from "@/types";
import type { Primitive, TactileScene } from "@/lib/tactileScene";
import { renderScene } from "@/lib/tactileScene";
import type {
  PlayableLesson,
  PlayableObject,
  PlayableQuizQuestion,
} from "@/lib/lessonPlayer";

/**
 * Custom tactile lessons — a teacher's own material, authored in the builder.
 *
 * A lesson is a list of objects; each object is one labeled tactile shape placed
 * on the 60×40 grid (a `Primitive`), with audio explanation + hint + braille
 * label. The composite "whole picture" (F4) is the union of every object's
 * primitives. This is the same model the deterministic renderer already uses,
 * so custom material is rendered, brailled, and explored exactly like the
 * built-in lessons — and survives a reload via localStorage.
 */

export interface BuilderObject {
  id: string;
  name: LocalizedText;
  /** Short label for the 20-cell braille line (kept ASCII for the device). */
  brailleLabel: string;
  /** Shapes that make up this object on the 60×40 grid. */
  primitives: Primitive[];
  /** F1 — what this part is. */
  explain: LocalizedText;
  /** F2 — where to find / how to feel it. */
  hint: LocalizedText;
}

export interface CustomQuizQuestion {
  id: string;
  answerObjectId: string;
  prompt: LocalizedText;
  hint: LocalizedText;
}

export type LessonStatus = "draft" | "ready";

export interface CustomLesson {
  id: string;
  title: LocalizedText;
  /** Free-text subject (e.g. "Science" / "과학"). */
  subject: LocalizedText;
  /** Free-text grade band (e.g. "Elementary" / "초등"). */
  gradeLevel: LocalizedText;
  /** Primary language used for braille verification. */
  language: Language;
  objects: BuilderObject[];
  /** F4 spoken summary. */
  summary: LocalizedText;
  /** F4 braille line text. */
  brailleSummary: string;
  quiz: CustomQuizQuestion[];
  status: LessonStatus;
  createdAt: string;
  updatedAt: string;
}

/* ---------------------------------------------------------------------------
 * ID helpers
 * ------------------------------------------------------------------------- */

export function newId(prefix = "cl"): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now().toString(36)}-${rand}`;
}

/* ---------------------------------------------------------------------------
 * localStorage-backed store (survives reloads on the static-hosted app)
 * ------------------------------------------------------------------------- */

const STORAGE_KEY = "dotlens.customLessons.v1";
const CHANGE_EVENT = "dotlens:customLessons";

function canStore(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function listCustomLessons(): CustomLesson[] {
  if (!canStore()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CustomLesson[];
    return Array.isArray(parsed)
      ? parsed.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
      : [];
  } catch {
    return [];
  }
}

export function getCustomLesson(id: string): CustomLesson | undefined {
  return listCustomLessons().find((l) => l.id === id);
}

function writeAll(lessons: CustomLesson[]): void {
  if (!canStore()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    /* storage full / unavailable — non-fatal in the demo */
  }
}

/** Insert or update a lesson (matched by id) and stamp `updatedAt`. */
export function saveCustomLesson(lesson: CustomLesson): CustomLesson {
  const stamped: CustomLesson = { ...lesson, updatedAt: new Date().toISOString() };
  const all = listCustomLessons();
  const idx = all.findIndex((l) => l.id === lesson.id);
  if (idx >= 0) all[idx] = stamped;
  else all.unshift(stamped);
  writeAll(all);
  return stamped;
}

export function deleteCustomLesson(id: string): void {
  writeAll(listCustomLessons().filter((l) => l.id !== id));
}

/** Subscribe to store changes (same-tab via CustomEvent, cross-tab via storage). */
export function subscribeCustomLessons(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onChange = () => cb();
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/* ---------------------------------------------------------------------------
 * Conversion to a playable lesson (render scenes → pin grids)
 * ------------------------------------------------------------------------- */

function objectScene(o: BuilderObject): TactileScene {
  return { id: o.id, title: o.name, type: "process", primitives: o.primitives };
}

export function toPlayableLesson(lesson: CustomLesson): PlayableLesson {
  const objects: PlayableObject[] = lesson.objects.map((o) => ({
    id: o.id,
    name: o.name,
    brailleLabel: o.brailleLabel,
    matrix: renderScene(objectScene(o)),
    explain: o.explain,
    hint: o.hint,
  }));

  const overviewMatrix = renderScene({
    id: `${lesson.id}-overview`,
    title: lesson.title,
    type: "process",
    primitives: lesson.objects.flatMap((o) => o.primitives),
  });

  const quiz: PlayableQuizQuestion[] = lesson.quiz.map((q) => ({
    answerObjectId: q.answerObjectId,
    prompt: q.prompt,
    hint: q.hint,
  }));

  return {
    id: lesson.id,
    title: lesson.title,
    objects,
    overviewMatrix,
    summary: lesson.summary,
    brailleSummary: lesson.brailleSummary,
    quiz,
  };
}

/* ---------------------------------------------------------------------------
 * Templates — remove the blank-canvas problem for non-technical teachers
 * ------------------------------------------------------------------------- */

const bi = (en: string, ko: string): LocalizedText => ({ en, ko });

/**
 * Default braille label: the English name reduced to ASCII and fit to the
 * 20-cell line. Case is preserved (not forced upper) so the QA layer doesn't
 * flag an all-caps indicator on every label.
 */
export function suggestBrailleLabel(name: LocalizedText): string {
  return (name.en || name.ko)
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .trim()
    .slice(0, 20) || "label";
}

export interface LessonTemplate {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  build: () => CustomLesson;
}

function baseLesson(partial: Partial<CustomLesson>): CustomLesson {
  const now = new Date().toISOString();
  return {
    id: newId(),
    title: bi("Untitled lesson", "제목 없는 수업"),
    subject: bi("Science", "과학"),
    gradeLevel: bi("Elementary", "초등"),
    language: "en",
    objects: [],
    summary: bi("", ""),
    brailleSummary: "",
    quiz: [],
    status: "draft",
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
}

function obj(
  name: LocalizedText,
  primitives: Primitive[],
  explain: LocalizedText,
  hint: LocalizedText
): BuilderObject {
  return {
    id: newId("o"),
    name,
    brailleLabel: suggestBrailleLabel(name),
    primitives,
    explain,
    hint,
  };
}

export const LESSON_TEMPLATES: LessonTemplate[] = [
  {
    id: "blank",
    name: bi("Blank lesson", "빈 수업"),
    description: bi("Start from scratch — add your own objects.", "백지에서 시작 — 객체를 직접 추가합니다."),
    build: () =>
      baseLesson({
        title: bi("My tactile lesson", "내 촉각 수업"),
        objects: [
          obj(
            bi("First object", "첫 번째 객체"),
            [{ kind: "disc", cx: 30, cy: 20, r: 6 }],
            bi("Describe what this object is.", "이 객체가 무엇인지 설명하세요."),
            bi("Tell the student where to feel it.", "학생에게 어디를 만질지 알려주세요.")
          ),
        ],
        summary: bi("Add a one-line summary of the whole picture.", "전체 그림을 한 줄로 요약하세요."),
        brailleSummary: "Lesson",
      }),
  },
  {
    id: "process",
    name: bi("Process / flow (3 steps)", "흐름도 (3단계)"),
    description: bi("Three boxes connected by arrows, left to right.", "왼쪽에서 오른쪽으로 화살표로 연결된 3개의 상자."),
    build: () =>
      baseLesson({
        title: bi("Three-step process", "3단계 과정"),
        objects: [
          obj(
            bi("Step 1", "1단계"),
            [{ kind: "rect", x: 4, y: 14, w: 12, h: 12, fill: false }],
            bi("The first step, on the left.", "왼쪽에 있는 첫 번째 단계예요."),
            bi("Feel the box on the far left.", "맨 왼쪽의 상자를 만져 보세요.")
          ),
          obj(
            bi("Step 2", "2단계"),
            [{ kind: "rect", x: 24, y: 14, w: 12, h: 12, fill: false }, { kind: "arrow", x1: 16, y1: 20, x2: 24, y2: 20 }],
            bi("The middle step. An arrow leads into it.", "가운데 단계예요. 화살표가 이어집니다."),
            bi("Move right from step 1, past the arrow.", "1단계에서 오른쪽으로, 화살표를 지나 이동하세요.")
          ),
          obj(
            bi("Step 3", "3단계"),
            [{ kind: "rect", x: 44, y: 14, w: 12, h: 12, fill: false }, { kind: "arrow", x1: 36, y1: 20, x2: 44, y2: 20 }],
            bi("The final step, on the right.", "오른쪽에 있는 마지막 단계예요."),
            bi("Feel the box on the far right.", "맨 오른쪽의 상자를 만져 보세요.")
          ),
        ],
        summary: bi("Three steps flow left to right, joined by arrows.", "세 단계가 화살표로 이어져 왼쪽에서 오른쪽으로 흐릅니다."),
        brailleSummary: "Process",
        quiz: [
          {
            id: newId("q"),
            answerObjectId: "",
            prompt: bi("Find the final step.", "마지막 단계를 찾으세요."),
            hint: bi("It's the box on the far right.", "맨 오른쪽 상자예요."),
          },
        ],
      }),
  },
  {
    id: "barchart",
    name: bi("Bar chart (4 bars)", "막대그래프 (막대 4개)"),
    description: bi("Axes with four bars of different heights.", "축과 높이가 다른 막대 4개."),
    build: () =>
      baseLesson({
        title: bi("Bar chart", "막대그래프"),
        subject: bi("Math", "수학"),
        objects: [
          obj(
            bi("Axes", "좌표축"),
            [{ kind: "line", x1: 10, y1: 4, x2: 10, y2: 34 }, { kind: "line", x1: 10, y1: 34, x2: 54, y2: 34 }],
            bi("An L-shape: the vertical and horizontal axes.", "L자 모양의 세로축과 가로축이에요."),
            bi("Feel the corner at the lower left.", "왼쪽 아래 모서리를 만져 보세요.")
          ),
          obj(bi("Bar 1", "막대 1"), [{ kind: "rect", x: 15, y: 24, w: 5, h: 10 }], bi("The shortest bar.", "가장 낮은 막대예요."), bi("First bar from the left, short.", "왼쪽 첫 막대, 낮아요.")),
          obj(bi("Bar 2", "막대 2"), [{ kind: "rect", x: 25, y: 16, w: 5, h: 18 }], bi("A tall bar.", "높은 막대예요."), bi("Second bar, taller.", "두 번째 막대, 더 높아요.")),
          obj(bi("Bar 3", "막대 3"), [{ kind: "rect", x: 35, y: 26, w: 5, h: 8 }], bi("The shortest of all.", "가장 낮은 막대예요."), bi("Third bar, shortest.", "세 번째 막대, 가장 낮아요.")),
          obj(bi("Bar 4", "막대 4"), [{ kind: "rect", x: 45, y: 12, w: 5, h: 22 }], bi("The tallest bar.", "가장 높은 막대예요."), bi("Fourth bar, tallest.", "네 번째 막대, 가장 높아요.")),
        ],
        summary: bi("Four bars on an axis; the fourth is tallest, the third shortest.", "축 위의 막대 4개 — 네 번째가 가장 높고 세 번째가 가장 낮아요."),
        brailleSummary: "Bar chart",
        quiz: [
          { id: newId("q"), answerObjectId: "", prompt: bi("Find the tallest bar.", "가장 높은 막대를 찾으세요."), hint: bi("It's the bar on the far right.", "맨 오른쪽 막대예요.") },
        ],
      }),
  },
  {
    id: "triangle",
    name: bi("Right triangle", "직각삼각형"),
    description: bi("A right triangle with three labeled vertices.", "꼭짓점 3개가 표시된 직각삼각형."),
    build: () =>
      baseLesson({
        title: bi("Right triangle", "직각삼각형"),
        subject: bi("Math", "수학"),
        objects: [
          obj(
            bi("Base (side AB)", "밑변 (변 AB)"),
            [{ kind: "line", x1: 10, y1: 32, x2: 48, y2: 32 }],
            bi("The horizontal base along the bottom.", "아래쪽을 따라가는 수평 밑변이에요."),
            bi("Slide along the bottom edge.", "아래 모서리를 따라 손가락을 미세요.")
          ),
          obj(
            bi("Height (side AC)", "높이 (변 AC)"),
            [{ kind: "line", x1: 10, y1: 32, x2: 10, y2: 8 }],
            bi("The vertical side on the left — the height.", "왼쪽의 수직변, 곧 높이예요."),
            bi("Feel the left edge, going up.", "왼쪽 모서리를 위로 만져 보세요.")
          ),
          obj(
            bi("Hypotenuse (side BC)", "빗변 (변 BC)"),
            [{ kind: "line", x1: 48, y1: 32, x2: 10, y2: 8 }],
            bi("The slanted longest side.", "비스듬한 가장 긴 변이에요."),
            bi("Feel the diagonal from lower-right to upper-left.", "오른쪽 아래에서 왼쪽 위로 향하는 대각선을 느껴 보세요.")
          ),
        ],
        summary: bi("A right triangle: a flat base, a vertical height, and a slanted hypotenuse.", "직각삼각형 — 평평한 밑변, 수직 높이, 비스듬한 빗변."),
        brailleSummary: "Triangle",
        quiz: [
          { id: newId("q"), answerObjectId: "", prompt: bi("Find the hypotenuse.", "빗변을 찾으세요."), hint: bi("It's the longest, slanted side.", "가장 길고 비스듬한 변이에요.") },
        ],
      }),
  },
];

export function buildFromTemplate(templateId: string): CustomLesson {
  const tpl = LESSON_TEMPLATES.find((t) => t.id === templateId) ?? LESSON_TEMPLATES[0];
  const lesson = tpl.build();
  // Wire any template quiz answers to the first object by default.
  if (lesson.quiz.length && lesson.objects.length) {
    lesson.quiz = lesson.quiz.map((q) => ({
      ...q,
      answerObjectId: q.answerObjectId || lesson.objects[lesson.objects.length - 1].id,
    }));
  }
  return lesson;
}

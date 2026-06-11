import type {
  Assignment,
  BrailleTranslationJob,
  StudentProgress,
  TactileLayer,
  TactileMatrix,
  VisualAnalysis,
} from "@/types";

/* ----------------------------------------------------------------------------
 * Product copy
 * ------------------------------------------------------------------------- */

export const PRODUCT = {
  name: "Dot Lens with Gemini for Chromebook",
  shortName: "Dot Lens",
  subtitle: {
    en: "AI-powered tactile learning for Google Classroom",
    ko: "Google Classroom을 위한 AI 촉각 학습",
  },
  value: {
    en: "Gemini understands the lesson. Global Braille Layer verifies the braille. Dot Pad makes learning touchable.",
    ko: "Gemini가 수업 자료를 이해하고, Global Braille Layer가 점자를 검수하며, Dot Pad가 손끝으로 학습하게 합니다.",
  },
} as const;

/** Fixed Dot Pad geometry. */
export const DOT_PAD: TactileMatrix = { cols: 60, rows: 40, brailleCells: 20 };

/* ----------------------------------------------------------------------------
 * Value cards (landing)
 * ------------------------------------------------------------------------- */

export interface ValueCard {
  key: string;
  title: string;
  titleKo: string;
  body: string;
  /** A short word rendered as a braille motif on the card. */
  brailleWord: string;
}

export const VALUE_CARDS: ValueCard[] = [
  {
    key: "chromebook",
    title: "Chromebook-first",
    titleKo: "Chromebook 우선",
    body: "Runs on the managed device already in the student's hands — no new procurement, controlled from the admin console.",
    brailleWord: "device",
  },
  {
    key: "gemini",
    title: "Gemini-guided",
    titleKo: "Gemini 안내",
    body: "Gemini interprets the diagram, sequences it for learning, and tutors with Socratic hints — not just a summary.",
    brailleWord: "guide",
  },
  {
    key: "dotpad",
    title: "Dot Pad tactile control",
    titleKo: "Dot Pad 촉각 제어",
    body: "A 60×40 graphic area and 20-cell braille line, driven entirely by six keys — the only surface that conveys layout by touch.",
    brailleWord: "touch",
  },
  {
    key: "braille",
    title: "Expert-reviewed braille",
    titleKo: "전문가 검수 점자",
    body: "Every braille summary passes the Global Braille QA layer and human review before it reaches a student.",
    brailleWord: "verified",
  },
];

/* ----------------------------------------------------------------------------
 * Layer 1 — Assignment (Classroom content)
 * ------------------------------------------------------------------------- */

export const WATER_CYCLE_ASSIGNMENT: Assignment = {
  id: "wc-001",
  title: {
    en: "Explore the Water Cycle Diagram",
    ko: "물의 순환 다이어그램 탐색하기",
  },
  instructions: {
    en: "Feel each part of the water cycle on your Dot Pad and follow Gemini's guidance.",
    ko: "Dot Pad로 물의 순환의 각 부분을 만져 보고 Gemini의 안내를 따라가세요.",
  },
  courseId: "sci-5b",
  dueDate: "2026-06-20",
  source: { kind: "image", ref: "mock://water-cycle.png" },
  tactileReady: true,
  analysisId: "an-001",
  defaultMode: "guided",
  difficulty: "core",
};

/* ----------------------------------------------------------------------------
 * Layer 2 — Gemini analysis (mock)
 * ------------------------------------------------------------------------- */

export const WATER_CYCLE_ANALYSIS: VisualAnalysis = {
  id: "an-001",
  sourceAssignmentId: "wc-001",
  detectedObjects: [
    { id: "ocean", label: { en: "Ocean", ko: "바다" }, role: "source", bbox: [0.0, 0.82, 1.0, 0.18], recommendedModality: "tactile" },
    { id: "evaporation", label: { en: "Evaporation", ko: "증발" }, role: "transfer", bbox: [0.12, 0.5, 0.38, 0.3], recommendedModality: "tactile" },
    { id: "cloud", label: { en: "Cloud", ko: "구름" }, role: "store", bbox: [0.45, 0.12, 0.45, 0.22], recommendedModality: "tactile" },
    { id: "rain", label: { en: "Rain", ko: "비" }, role: "transfer", bbox: [0.52, 0.4, 0.3, 0.35], recommendedModality: "tactile" },
  ],
  relationships: [
    { from: "ocean", to: "evaporation", type: "evaporates" },
    { from: "evaporation", to: "cloud", type: "rises" },
    { from: "cloud", to: "rain", type: "precipitates" },
    { from: "rain", to: "ocean", type: "returns" },
  ],
  suggestedMode: "guided",
  modalityPlan: [
    { objectId: "ocean", modality: "tactile", rationale: { en: "Position and extent are spatial.", ko: "위치와 범위는 공간 정보입니다." } },
    { objectId: "evaporation", modality: "tactile", rationale: { en: "Direction of movement is felt, not read.", ko: "움직임의 방향은 읽기보다 느끼는 것입니다." } },
    { objectId: "cloud", modality: "braille", rationale: { en: "Short label fits the braille line.", ko: "짧은 라벨은 점자 라인에 적합합니다." } },
    { objectId: "rain", modality: "audio", rationale: { en: "Cause-and-effect is explained.", ko: "인과관계는 음성으로 설명합니다." } },
  ],
  confidence: 0.92,
  needsTeacherReview: false,
  createdAt: "2026-06-09T09:14:00.000Z",
};

/* ----------------------------------------------------------------------------
 * Layer 4 — Tactile layer (mock; pin maps rendered by the engine in a later phase)
 * ------------------------------------------------------------------------- */

export const WATER_CYCLE_LAYER: TactileLayer = {
  id: "L0",
  label: { en: "Water cycle — overview", ko: "물의 순환 — 개요" },
  objects: [
    {
      id: "ocean",
      label: { en: "Ocean", ko: "바다" },
      role: "source",
      pins: "RLE:pending",
      centroid: [10, 36],
      braille: {},
      audio: { en: "The ocean is along the bottom of the diagram.", ko: "바다는 다이어그램의 아래쪽에 있어요." },
      hint: { en: "Slide your fingers to the lower area and feel the wide band.", ko: "손가락을 아래쪽으로 밀어 넓은 띠를 느껴 보세요." },
      relations: [{ to: "evaporation", type: "evaporates" }],
    },
    {
      id: "evaporation",
      label: { en: "Evaporation", ko: "증발" },
      role: "transfer",
      pins: "RLE:pending",
      centroid: [20, 26],
      braille: {},
      audio: { en: "Water rises from the ocean into the air as it warms.", ko: "물이 데워지며 바다에서 공기 중으로 올라가요." },
      hint: { en: "Slide up from the ocean — feel the small rising dots.", ko: "바다에서 위로 밀어 올라가는 작은 점들을 느껴 보세요." },
      relations: [{ to: "cloud", type: "rises" }],
    },
    {
      id: "cloud",
      label: { en: "Cloud", ko: "구름" },
      role: "store",
      pins: "RLE:pending",
      centroid: [40, 11],
      braille: {},
      audio: { en: "Vapor cools and gathers into a cloud near the top.", ko: "수증기가 식어 위쪽에 구름으로 모여요." },
      hint: { en: "Move to the upper-center and feel the rounded shape.", ko: "위쪽 가운데로 가서 둥근 모양을 느껴 보세요." },
      relations: [{ to: "rain", type: "precipitates" }],
    },
    {
      id: "rain",
      label: { en: "Rain", ko: "비" },
      role: "transfer",
      pins: "RLE:pending",
      centroid: [43, 24],
      braille: {},
      audio: { en: "Water falls from the cloud back toward the ocean as rain.", ko: "물이 구름에서 비가 되어 다시 바다로 떨어져요." },
      hint: { en: "Feel the slanted lines coming down from the cloud.", ko: "구름에서 기울어져 내려오는 선들을 느껴 보세요." },
      relations: [{ to: "ocean", type: "returns" }],
    },
  ],
};

/* ----------------------------------------------------------------------------
 * Layer 3 — Braille QA job (mock)
 * ------------------------------------------------------------------------- */

export const WATER_CYCLE_BRAILLE_JOB: BrailleTranslationJob = {
  id: "bj-001",
  assignmentId: "wc-001",
  standard: "UEB-G2",
  language: "en",
  status: "approved",
  submittedAt: "2026-06-09T09:20:00.000Z",
  summary: {
    standard: "UEB-G2",
    language: "en",
    cellsPerPage: 20,
    pages: [
      { index: 0, text: "Water cycle", cells: [] },
      { index: 1, text: "ocean evaporation", cells: [] },
      { index: 2, text: "cloud rain", cells: [] },
    ],
  },
  issues: [
    {
      id: "qa-1",
      pageIndex: 1,
      cellRange: [0, 4],
      severity: "minor",
      rule: "UEB §10.4 — contraction",
      message: { en: "Consider the 'ea' contraction in 'ocean'.", ko: "'ocean'의 'ea' 약자 사용을 검토하세요." },
      suggestion: { en: "Apply the 'ea' contraction.", ko: "'ea' 약자를 적용하세요." },
      resolved: true,
    },
  ],
  review: {
    reviewerId: "rev-7",
    reviewerName: "J. Han (TVI)",
    decision: "approved",
    notes: { en: "Reads cleanly for grade 5. Approved.", ko: "5학년 수준에서 자연스럽게 읽힙니다. 승인." },
    reviewedAt: "2026-06-09T10:05:00.000Z",
  },
};

/* ----------------------------------------------------------------------------
 * Reporting — student progress (mock)
 * ------------------------------------------------------------------------- */

export const STUDENT_PROGRESS: StudentProgress[] = [
  {
    studentId: "s-01",
    studentName: "Min-jun",
    assignmentId: "wc-001",
    opened: true,
    modesUsed: ["guided", "quiz"],
    objectsExplored: 4,
    objectsTotal: 4,
    hintsUsed: 1,
    quizScore: 2,
    quizTotal: 2,
    timeOnTaskSec: 372,
    lastActivity: "2026-06-09T11:02:00.000Z",
    geminiSummary: {
      en: "Understood the cycle; briefly unsure that rain comes from clouds — resolved with one hint.",
      ko: "순환을 이해함; 비가 구름에서 온다는 점을 잠시 헷갈렸으나 힌트 1회로 해결.",
    },
  },
  {
    studentId: "s-02",
    studentName: "Aria",
    assignmentId: "wc-001",
    opened: true,
    modesUsed: ["guided", "explore"],
    objectsExplored: 3,
    objectsTotal: 4,
    hintsUsed: 0,
    timeOnTaskSec: 240,
    lastActivity: "2026-06-09T10:48:00.000Z",
    geminiSummary: {
      en: "Strong on evaporation and cloud; has not reached the rain step yet.",
      ko: "증발과 구름은 잘 이해함; 아직 비 단계에 도달하지 않음.",
    },
  },
  {
    studentId: "s-03",
    studentName: "Leo",
    assignmentId: "wc-001",
    opened: false,
    modesUsed: [],
    objectsExplored: 0,
    objectsTotal: 4,
    hintsUsed: 0,
    timeOnTaskSec: 0,
    lastActivity: "2026-06-08T16:00:00.000Z",
  },
];

/** Tactile Lesson Package — the full deliverable produced by Dot Lens Studio. */

export type ReviewStatus =
  | "ai_generated"
  | "needs_review"
  | "revision_requested"
  | "approved"
  | "ready_for_dot_pad"
  | "published";

export type LocaleCode = "en" | "ko" | "hi" | "mr" | "bn" | "ar";

export interface LocalizationPack {
  locale: LocaleCode;
  localeName: string;
  uiLabels: Record<string, string>;
  teacherGuide: string;
  studentInstructions: string;
  audioNarration: string;
  brailleLabelTerms: Record<string, string>;
  subjectVocabulary: Record<string, string>;
  localCurriculumNotes: string;
  status: "complete" | "partial" | "pending";
}

export interface ReviewChecklist {
  tactileReadability: boolean;
  educationalAccuracy: boolean;
  brailleLabelClarity: boolean;
  audioGuidanceQuality: boolean;
  dotPadSuitability: boolean;
  studentExplorationFlow: boolean;
}

export interface TactileLessonPackage {
  id: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  title: { ko: string; en: string };
  subject: string;
  grade: string;
  topic: string;

  visualPreview: string;
  tactileFrame: { cols: 60; rows: 40; cells: number[][] };
  brailleLabels: Record<string, string>;
  audioGuide: { ko: string; en: string };

  explorationSteps: Array<{
    step: number;
    instruction: { ko: string; en: string };
    focusArea: string;
    brailleHint: string;
  }>;
  teacherGuide: {
    objective: { ko: string; en: string };
    sequence: string;
    script: { ko: string; en: string };
    checkQuestions: string[];
  };
  studentQuiz: Array<{
    q: { ko: string; en: string };
    options: string[];
    answer: number;
  }>;

  reviewStatus: ReviewStatus;
  reviewNotes: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewChecklist: ReviewChecklist;

  localizationPacks: LocalizationPack[];

  dotPadOutputMetadata: {
    cols: 60;
    rows: 40;
    frameCount: number;
    encoding: "graphic_hex" | "text_hex";
    sdkVersion: string;
  };

  classroomSyncData: {
    sessionId?: string;
    syncedDevices: string[];
    lastSyncedAt?: string;
    currentStep: number;
  };
}

export const LOCALES: { code: LocaleCode; name: string; nameLocal: string }[] = [
  { code: "en", name: "English",  nameLocal: "English" },
  { code: "ko", name: "Korean",   nameLocal: "한국어" },
  { code: "hi", name: "Hindi",    nameLocal: "हिन्दी" },
  { code: "mr", name: "Marathi",  nameLocal: "मराठी" },
  { code: "bn", name: "Bengali",  nameLocal: "বাংলা" },
  { code: "ar", name: "Arabic",   nameLocal: "العربية" },
];

export const REVIEW_STATUS_META: Record<ReviewStatus, { label: string; labelKo: string; color: string }> = {
  ai_generated:       { label: "AI Generated",         labelKo: "AI 생성",         color: "text-faint bg-surface-sunk" },
  needs_review:       { label: "Needs Review",          labelKo: "검수 필요",        color: "text-warn bg-warn/10" },
  revision_requested: { label: "Revision Requested",    labelKo: "수정 요청",        color: "text-red-600 bg-red-50" },
  approved:           { label: "Approved",              labelKo: "승인",             color: "text-verify bg-verify-tint" },
  ready_for_dot_pad:  { label: "Ready for Dot Pad",     labelKo: "Dot Pad 출력 가능", color: "text-accent bg-accent-tint" },
  published:          { label: "Published",             labelKo: "배포됨",           color: "text-purple-700 bg-purple-50" },
};

/* ── sample packages (demo data) ── */
export const SAMPLE_PACKAGES: TactileLessonPackage[] = [
  {
    id: "pkg-plant-g3",
    version: 2,
    createdAt: "2026-06-01T09:00:00Z",
    updatedAt: "2026-06-18T08:00:00Z",
    title: { ko: "식물의 성장 과정", en: "Plant Life Cycle" },
    subject: "science", grade: "elementary", topic: "plant-growth",
    visualPreview: "",
    tactileFrame: { cols: 60, rows: 40, cells: [] },
    brailleLabels: { S: "Seed", R: "Roots", T: "Stem", L: "Leaves" },
    audioGuide: {
      ko: "아래 왼쪽부터 시작하세요. 씨앗에서 뿌리, 줄기, 잎 순서로 탐색합니다.",
      en: "Start at the lower left. Explore from the seed through roots, stem, and leaves.",
    },
    explorationSteps: [
      { step: 1, instruction: { ko: "씨앗 찾기", en: "Find the seed" }, focusArea: "lower-left", brailleHint: "S" },
      { step: 2, instruction: { ko: "뿌리 탐색", en: "Explore roots" }, focusArea: "lower-center", brailleHint: "R" },
      { step: 3, instruction: { ko: "줄기 따라가기", en: "Follow the stem" }, focusArea: "center", brailleHint: "T" },
      { step: 4, instruction: { ko: "잎 확인", en: "Find the leaves" }, focusArea: "upper-center", brailleHint: "L" },
    ],
    teacherGuide: {
      objective: { ko: "식물 성장 단계를 촉각으로 탐색하고 순서를 파악한다.", en: "Identify and sequence plant growth stages through touch." },
      sequence: "seed → roots → stem → leaves",
      script: { ko: "아래 왼쪽 씨앗부터 시작하여 위로 탐색하도록 안내하세요.", en: "Guide students from the lower-left seed upward through each growth stage." },
      checkQuestions: ["What comes after the seed?", "How many growth stages can you find?"],
    },
    studentQuiz: [
      { q: { ko: "씨앗 다음 단계는?", en: "What comes after the seed?" }, options: ["Leaf", "Root", "Stem", "Flower"], answer: 1 },
    ],
    reviewStatus: "approved",
    reviewNotes: "Tactile layout is clear. Exploration order is well-structured.",
    reviewedBy: "Expert A", reviewedAt: "2026-06-10T14:00:00Z",
    reviewChecklist: { tactileReadability: true, educationalAccuracy: true, brailleLabelClarity: true, audioGuidanceQuality: true, dotPadSuitability: true, studentExplorationFlow: true },
    localizationPacks: [
      { locale: "en", localeName: "English",  uiLabels: {}, teacherGuide: "", studentInstructions: "", audioNarration: "", brailleLabelTerms: {}, subjectVocabulary: {}, localCurriculumNotes: "", status: "complete" },
      { locale: "ko", localeName: "Korean",   uiLabels: {}, teacherGuide: "", studentInstructions: "", audioNarration: "", brailleLabelTerms: {}, subjectVocabulary: {}, localCurriculumNotes: "", status: "complete" },
      { locale: "hi", localeName: "Hindi",    uiLabels: {}, teacherGuide: "", studentInstructions: "", audioNarration: "", brailleLabelTerms: {}, subjectVocabulary: {}, localCurriculumNotes: "", status: "partial" },
      { locale: "mr", localeName: "Marathi",  uiLabels: {}, teacherGuide: "", studentInstructions: "", audioNarration: "", brailleLabelTerms: {}, subjectVocabulary: {}, localCurriculumNotes: "", status: "pending" },
      { locale: "bn", localeName: "Bengali",  uiLabels: {}, teacherGuide: "", studentInstructions: "", audioNarration: "", brailleLabelTerms: {}, subjectVocabulary: {}, localCurriculumNotes: "", status: "pending" },
      { locale: "ar", localeName: "Arabic",   uiLabels: {}, teacherGuide: "", studentInstructions: "", audioNarration: "", brailleLabelTerms: {}, subjectVocabulary: {}, localCurriculumNotes: "", status: "pending" },
    ],
    dotPadOutputMetadata: { cols: 60, rows: 40, frameCount: 4, encoding: "graphic_hex", sdkVersion: "1.3.0" },
    classroomSyncData: { syncedDevices: [], currentStep: 1 },
  },
  {
    id: "pkg-quadratic-m2",
    version: 1,
    createdAt: "2026-06-05T11:00:00Z",
    updatedAt: "2026-06-17T09:00:00Z",
    title: { ko: "이차함수 그래프", en: "Quadratic Graph" },
    subject: "math", grade: "middle", topic: "quadratic-function",
    visualPreview: "",
    tactileFrame: { cols: 60, rows: 40, cells: [] },
    brailleLabels: { V: "Vertex", A: "Axis", X: "X-intercept" },
    audioGuide: { ko: "꼭짓점에서 시작하여 포물선 양쪽을 탐색하세요.", en: "Start at the vertex and explore both sides of the parabola." },
    explorationSteps: [
      { step: 1, instruction: { ko: "꼭짓점 찾기", en: "Find vertex" }, focusArea: "center", brailleHint: "V" },
      { step: 2, instruction: { ko: "왼쪽 탐색", en: "Left branch" }, focusArea: "left", brailleHint: "A" },
      { step: 3, instruction: { ko: "오른쪽 탐색", en: "Right branch" }, focusArea: "right", brailleHint: "A" },
    ],
    teacherGuide: {
      objective: { ko: "이차함수의 대칭성을 촉각으로 파악한다.", en: "Understand quadratic symmetry through touch." },
      sequence: "vertex → left → right",
      script: { ko: "꼭짓점에서 시작해 양쪽 대칭을 느껴보도록 안내하세요.", en: "Guide students from vertex outward to feel symmetry." },
      checkQuestions: ["Is the parabola symmetric?", "Where is the vertex?"],
    },
    studentQuiz: [],
    reviewStatus: "needs_review",
    reviewNotes: "Awaiting tactile readability check.",
    reviewChecklist: { tactileReadability: false, educationalAccuracy: true, brailleLabelClarity: false, audioGuidanceQuality: true, dotPadSuitability: false, studentExplorationFlow: true },
    localizationPacks: [
      { locale: "en", localeName: "English", uiLabels: {}, teacherGuide: "", studentInstructions: "", audioNarration: "", brailleLabelTerms: {}, subjectVocabulary: {}, localCurriculumNotes: "", status: "complete" },
      { locale: "ko", localeName: "Korean",  uiLabels: {}, teacherGuide: "", studentInstructions: "", audioNarration: "", brailleLabelTerms: {}, subjectVocabulary: {}, localCurriculumNotes: "", status: "complete" },
      { locale: "hi", localeName: "Hindi",   uiLabels: {}, teacherGuide: "", studentInstructions: "", audioNarration: "", brailleLabelTerms: {}, subjectVocabulary: {}, localCurriculumNotes: "", status: "pending" },
      { locale: "mr", localeName: "Marathi", uiLabels: {}, teacherGuide: "", studentInstructions: "", audioNarration: "", brailleLabelTerms: {}, subjectVocabulary: {}, localCurriculumNotes: "", status: "pending" },
      { locale: "bn", localeName: "Bengali", uiLabels: {}, teacherGuide: "", studentInstructions: "", audioNarration: "", brailleLabelTerms: {}, subjectVocabulary: {}, localCurriculumNotes: "", status: "pending" },
      { locale: "ar", localeName: "Arabic",  uiLabels: {}, teacherGuide: "", studentInstructions: "", audioNarration: "", brailleLabelTerms: {}, subjectVocabulary: {}, localCurriculumNotes: "", status: "pending" },
    ],
    dotPadOutputMetadata: { cols: 60, rows: 40, frameCount: 3, encoding: "graphic_hex", sdkVersion: "1.3.0" },
    classroomSyncData: { syncedDevices: [], currentStep: 1 },
  },
  {
    id: "pkg-sentence-k1",
    version: 1,
    createdAt: "2026-06-10T10:00:00Z",
    updatedAt: "2026-06-18T07:00:00Z",
    title: { ko: "문장 성분 구조", en: "Sentence Structure" },
    subject: "korean", grade: "elementary", topic: "sentence-components",
    visualPreview: "",
    tactileFrame: { cols: 60, rows: 40, cells: [] },
    brailleLabels: { S: "Subject", P: "Predicate", O: "Object" },
    audioGuide: { ko: "나무 구조처럼 문장 뿌리에서 가지로 탐색하세요.", en: "Explore the tree structure from root sentence to branches." },
    explorationSteps: [
      { step: 1, instruction: { ko: "문장 뿌리", en: "Root sentence" }, focusArea: "top-center", brailleHint: "S" },
      { step: 2, instruction: { ko: "주어 가지", en: "Subject branch" }, focusArea: "left", brailleHint: "S" },
      { step: 3, instruction: { ko: "서술어 가지", en: "Predicate branch" }, focusArea: "right", brailleHint: "P" },
    ],
    teacherGuide: {
      objective: { ko: "문장 성분의 구조를 촉각 트리로 이해한다.", en: "Understand sentence structure through a tactile tree." },
      sequence: "root → subject → predicate → object",
      script: { ko: "뿌리 노드에서 시작해 아래로 내려가며 각 가지를 탐색하도록 안내하세요.", en: "Guide students from the root node downward through each branch." },
      checkQuestions: ["Which node is the subject?", "How many branches does the predicate have?"],
    },
    studentQuiz: [],
    reviewStatus: "ai_generated",
    reviewNotes: "",
    reviewChecklist: { tactileReadability: false, educationalAccuracy: false, brailleLabelClarity: false, audioGuidanceQuality: false, dotPadSuitability: false, studentExplorationFlow: false },
    localizationPacks: [
      { locale: "en", localeName: "English", uiLabels: {}, teacherGuide: "", studentInstructions: "", audioNarration: "", brailleLabelTerms: {}, subjectVocabulary: {}, localCurriculumNotes: "", status: "partial" },
      { locale: "ko", localeName: "Korean",  uiLabels: {}, teacherGuide: "", studentInstructions: "", audioNarration: "", brailleLabelTerms: {}, subjectVocabulary: {}, localCurriculumNotes: "", status: "complete" },
      { locale: "hi", localeName: "Hindi",   uiLabels: {}, teacherGuide: "", studentInstructions: "", audioNarration: "", brailleLabelTerms: {}, subjectVocabulary: {}, localCurriculumNotes: "", status: "pending" },
      { locale: "mr", localeName: "Marathi", uiLabels: {}, teacherGuide: "", studentInstructions: "", audioNarration: "", brailleLabelTerms: {}, subjectVocabulary: {}, localCurriculumNotes: "", status: "pending" },
      { locale: "bn", localeName: "Bengali", uiLabels: {}, teacherGuide: "", studentInstructions: "", audioNarration: "", brailleLabelTerms: {}, subjectVocabulary: {}, localCurriculumNotes: "", status: "pending" },
      { locale: "ar", localeName: "Arabic",  uiLabels: {}, teacherGuide: "", studentInstructions: "", audioNarration: "", brailleLabelTerms: {}, subjectVocabulary: {}, localCurriculumNotes: "", status: "pending" },
    ],
    dotPadOutputMetadata: { cols: 60, rows: 40, frameCount: 3, encoding: "graphic_hex", sdkVersion: "1.3.0" },
    classroomSyncData: { syncedDevices: [], currentStep: 1 },
  },
];

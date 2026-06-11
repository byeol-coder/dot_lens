import type {
  AccessibilityProfile,
  AnalysisObject,
  AudioGuidance,
  BrailleSummary,
  ConversionResult,
  Difficulty,
  LearningStep,
  QuizPrompt,
  TactileLayer,
  TactilePriority,
  VisualAnalysis,
} from "@/types";

/**
 * Mock Gemini adapter.
 *
 * Phase 1 returns deterministic, realistic data for the Water Cycle demo.
 * No real model is called.
 *
 * TODO(real Gemini): replace `analyzeVisual` with a multimodal call, e.g.
 *   const res = await gemini.models.generateContent({
 *     model: "gemini-*",
 *     contents: [{ role: "user", parts: [{ inlineData: image }, { text: ANALYSIS_PROMPT }] }],
 *   });
 *   // parse res into VisualAnalysis (objects, relationships, modality, steps)
 */

/* ---------------------------------------------------------------------------
 * Detected objects — the canonical Water Cycle set
 * ------------------------------------------------------------------------- */

const WATER_CYCLE_OBJECTS: AnalysisObject[] = [
  { id: "sun", label: { en: "Sun", ko: "태양" }, role: "source", bbox: [0.74, 0.06, 0.2, 0.18], recommendedModality: "tactile" },
  { id: "water", label: { en: "Water", ko: "물" }, role: "store", bbox: [0.0, 0.78, 0.55, 0.22], recommendedModality: "tactile" },
  { id: "evaporation", label: { en: "Evaporation arrow", ko: "증발 화살표" }, role: "transfer", bbox: [0.14, 0.46, 0.22, 0.32], recommendedModality: "tactile" },
  { id: "cloud", label: { en: "Cloud", ko: "구름" }, role: "store", bbox: [0.4, 0.1, 0.4, 0.22], recommendedModality: "tactile" },
  { id: "rain", label: { en: "Rain", ko: "비" }, role: "transfer", bbox: [0.5, 0.36, 0.26, 0.34], recommendedModality: "tactile" },
  { id: "river", label: { en: "River", ko: "강" }, role: "transfer", bbox: [0.55, 0.7, 0.4, 0.18], recommendedModality: "tactile" },
  { id: "cycle", label: { en: "Cycle direction", ko: "순환 방향" }, role: "process", bbox: [0.05, 0.05, 0.9, 0.9], recommendedModality: "audio" },
];

const TACTILE_PRIORITY: TactilePriority[] = [
  { rank: 1, aspect: "flow-direction", label: { en: "Flow direction", ko: "흐름 방향" } },
  { rank: 2, aspect: "object-boundaries", label: { en: "Object boundaries", ko: "객체 경계" } },
  { rank: 3, aspect: "sequential-steps", label: { en: "Sequential steps", ko: "순차적 단계" } },
  { rank: 4, aspect: "labels", label: { en: "Labels", ko: "라벨" } },
];

const LEARNING_STEPS: LearningStep[] = [
  { index: 1, instruction: { en: "Find the sun", ko: "태양을 찾으세요" }, targetObjectId: "sun" },
  { index: 2, instruction: { en: "Move to the water", ko: "물로 이동하세요" }, targetObjectId: "water" },
  { index: 3, instruction: { en: "Follow evaporation", ko: "증발을 따라가세요" }, targetObjectId: "evaporation" },
  { index: 4, instruction: { en: "Explore cloud formation", ko: "구름 형성을 탐색하세요" }, targetObjectId: "cloud" },
  { index: 5, instruction: { en: "Find rain", ko: "비를 찾으세요" }, targetObjectId: "rain" },
  { index: 6, instruction: { en: "Complete the cycle", ko: "순환을 완성하세요" }, targetObjectId: "cycle" },
];

/* ---------------------------------------------------------------------------
 * analyzeVisual — POST /api/scan
 * ------------------------------------------------------------------------- */

export function analyzeVisual(
  assignmentId: string,
  materialId: string
): VisualAnalysis {
  // TODO(real Gemini): send the material image + ANALYSIS_PROMPT to the model
  // and map the response into this VisualAnalysis shape.
  return {
    id: `an-${assignmentId}`,
    sourceAssignmentId: assignmentId,
    detectedObjects: WATER_CYCLE_OBJECTS,
    relationships: [
      { from: "sun", to: "water", type: "heats" },
      { from: "water", to: "evaporation", type: "evaporates" },
      { from: "evaporation", to: "cloud", type: "condenses" },
      { from: "cloud", to: "rain", type: "precipitates" },
      { from: "rain", to: "river", type: "collects" },
      { from: "river", to: "water", type: "returns" },
    ],
    suggestedMode: "guided",
    modalityPlan: [
      { objectId: "evaporation", modality: "tactile", rationale: { en: "Direction of movement is felt, not read.", ko: "움직임의 방향은 읽기보다 느끼는 것입니다." } },
      { objectId: "cloud", modality: "braille", rationale: { en: "Short label fits the braille line.", ko: "짧은 라벨은 점자 라인에 적합합니다." } },
      { objectId: "cycle", modality: "audio", rationale: { en: "The overall loop is explained aloud.", ko: "전체 순환은 음성으로 설명합니다." } },
    ],
    confidence: 0.93,
    needsTeacherReview: false,
    createdAt: new Date().toISOString(),
    summary: {
      en: "Gemini detected a science process diagram. The recommended tactile format is guided step-by-step exploration.",
      ko: "Gemini가 과학 과정 다이어그램을 감지했습니다. 권장 촉각 형식은 단계별 안내 탐색입니다.",
    },
    tactilePriority: TACTILE_PRIORITY,
    learningSteps: LEARNING_STEPS,
    // materialId is accepted so a real implementation can fetch the right asset.
    ...(materialId ? {} : {}),
  };
}

/* ---------------------------------------------------------------------------
 * convertToTactile — POST /api/convert  (placeholders in Phase 1)
 * ------------------------------------------------------------------------- */

const DEFAULT_PROFILE: AccessibilityProfile = {
  brailleStandard: "UEB-G2",
  language: "en",
  speechRate: "normal",
  hintFrequency: "medium",
  highContrast: true,
};

export function convertToTactile(
  analysisId: string,
  difficulty: Difficulty = "core",
  accessibilityProfile: AccessibilityProfile = DEFAULT_PROFILE
): ConversionResult {
  // TODO(Phase 2/3): generate real tactile pin maps (tactile engine),
  // braille via the braille engine + Global Braille QA, and Gemini audio scripts.
  const tactileLayers: TactileLayer[] = [
    {
      id: "L0",
      label: { en: "Water cycle — overview", ko: "물의 순환 — 개요" },
      objects: WATER_CYCLE_OBJECTS.map((o) => ({
        id: o.id,
        label: o.label,
        role: o.role,
        pins: "RLE:pending", // TODO: real pin map from the tactile engine
        centroid: [
          Math.round((o.bbox[0] + o.bbox[2] / 2) * 60),
          Math.round((o.bbox[1] + o.bbox[3] / 2) * 40),
        ],
        braille: {}, // TODO: filled by the braille engine + QA layer
        audio: { en: `${o.label.en}.`, ko: `${o.label.ko}.` },
        hint: { en: `Find the ${o.label.en.toLowerCase()}.`, ko: `${o.label.ko}을(를) 찾으세요.` },
      })),
    },
  ];

  const brailleSummaries: BrailleSummary[] = [
    {
      standard: accessibilityProfile.brailleStandard,
      language: accessibilityProfile.language,
      cellsPerPage: 20,
      pages: [
        { index: 0, text: "Water cycle", cells: [] }, // TODO: real cells from braille engine
        { index: 1, text: "sun water cloud rain", cells: [] },
      ],
    },
  ];

  const audioGuidance: AudioGuidance[] = WATER_CYCLE_OBJECTS.map((o) => ({
    objectId: o.id,
    script: {
      en: `This is the ${o.label.en.toLowerCase()}.`,
      ko: `여기는 ${o.label.ko}이에요.`,
    },
  }));

  const quizPrompts: QuizPrompt[] = [
    {
      id: "q1",
      prompt: { en: "Find the part where water rises into the air.", ko: "물이 공기로 올라가는 부분을 찾으세요." },
      answerObjectId: "evaporation",
      hint: { en: "It's just above the water.", ko: "물 바로 위예요." },
    },
    {
      id: "q2",
      prompt: { en: "Find the part where water falls from the cloud.", ko: "물이 구름에서 떨어지는 부분을 찾으세요." },
      answerObjectId: "rain",
      hint: { en: "It comes down from the cloud.", ko: "구름에서 내려와요." },
    },
  ];

  return {
    id: `cv-${analysisId}`,
    analysisId,
    difficulty,
    accessibilityProfile,
    tactileLayers,
    brailleSummaries,
    audioGuidance,
    quizPrompts,
    createdAt: new Date().toISOString(),
  };
}

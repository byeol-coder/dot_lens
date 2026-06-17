/**
 * Shared domain types for Dot Lens with Gemini.
 *
 * These model the four-layer system end to end:
 *   1. Classroom / Chromebook content   → Assignment, AssignmentSource
 *   2. Gemini understanding & tutoring   → VisualAnalysis, ModalityDecision
 *   3. Global Braille QA layer           → BrailleTranslationJob, BrailleQAIssue, BrailleReview
 *   4. Dot Pad tactile interaction       → TactileLayer, TactileObject, DotPadState, DotPadKey
 *
 * Phase 0: types only. Engines/adapters that populate them arrive in later phases.
 */

/** Any user-facing string is bilingual in this product. */
export interface LocalizedText {
  en: string;
  ko: string;
}

export type Language = "en" | "ko";

/* ----------------------------------------------------------------------------
 * Braille standards & QA layer
 * ------------------------------------------------------------------------- */

export type BrailleStandard =
  | "UEB-G1" // Unified English Braille, grade 1 (uncontracted)
  | "UEB-G2" // Unified English Braille, grade 2 (contracted)
  | "KO-G1" // Korean braille, uncontracted
  | "KO-G2" // Korean braille, with abbreviations (약자)
  | "Nemeth" // English math braille
  | "KO-Math"; // Korean math braille

/** Raised dot numbers in a single braille cell (positions 1–6). */
export type BrailleCell = number[];

export interface BraillePage {
  index: number;
  /** Plain-text mirror of this page, for sighted review and the side panel. */
  text: string;
  cells: BrailleCell[]; // up to `cellsPerPage`
}

export interface BrailleSummary {
  standard: BrailleStandard;
  language: Language;
  /** Dot Pad braille line width. */
  cellsPerPage: number;
  pages: BraillePage[];
}

export type BrailleJobStatus =
  | "queued"
  | "translating"
  | "qa_pending"
  | "approved"
  | "changes_requested";

export type QASeverity = "info" | "minor" | "major" | "blocker";

export interface BrailleQAIssue {
  id: string;
  /** [startCellIndex, endCellIndex] within the page being reviewed. */
  cellRange: [number, number];
  pageIndex: number;
  severity: QASeverity;
  /** Human-readable rule reference, e.g. "UEB §10.4 — contraction". */
  rule: string;
  message: LocalizedText;
  suggestion?: LocalizedText;
  resolved: boolean;
}

export interface BrailleReview {
  reviewerId: string;
  reviewerName: string;
  decision: "approved" | "changes_requested";
  notes?: LocalizedText;
  /** ISO 8601 timestamp. */
  reviewedAt: string;
}

export interface BrailleTranslationJob {
  id: string;
  assignmentId: string;
  standard: BrailleStandard;
  language: Language;
  status: BrailleJobStatus;
  /** ISO 8601 timestamp. */
  submittedAt: string;
  summary: BrailleSummary;
  issues: BrailleQAIssue[];
  review?: BrailleReview;
}

/* ----------------------------------------------------------------------------
 * Tactile model (Dot Pad output)
 * ------------------------------------------------------------------------- */

/** Semantic role of an object, used by Gemini to decide modality & sequencing. */
export type TactileRole =
  | "source"
  | "process"
  | "store"
  | "transfer"
  | "region"
  | "point"
  | "axis"
  | "data"
  | "label";

export type Modality = "tactile" | "braille" | "audio";

export interface TactileRelation {
  to: string;
  /** e.g. "evaporates", "feeds", "borders". */
  type: string;
}

export interface TactileObject {
  id: string;
  label: LocalizedText;
  role: TactileRole;
  /**
   * Pin map within the 60×40 graphic area.
   * Encoded later by the tactile engine (e.g. run-length encoded);
   * Phase 0 leaves this as a placeholder token.
   */
  pins: string;
  /** [col, row] centroid in the 60×40 matrix. */
  centroid: [number, number];
  /** Pre-rendered braille label per standard (populated by the braille layer). */
  braille: Partial<Record<BrailleStandard, BrailleCell[]>>;
  audio: LocalizedText;
  hint: LocalizedText;
  relations?: TactileRelation[];
}

export interface TactileLayer {
  id: string;
  label: LocalizedText;
  objects: TactileObject[];
}

/** Fixed Dot Pad geometry. */
export interface TactileMatrix {
  cols: 60;
  rows: 40;
  brailleCells: 20;
}

/* ----------------------------------------------------------------------------
 * Gemini understanding & tutoring layer
 * ------------------------------------------------------------------------- */

export type TactileMode =
  | "scan"
  | "explore"
  | "guided"
  | "quiz"
  | "compare"
  | "map"
  | "chart"
  | "math"
  | "review";

export interface AnalysisObject {
  id: string;
  label: LocalizedText;
  role: TactileRole;
  /** Normalized bounding box [x, y, w, h] in 0–1. */
  bbox: [number, number, number, number];
  recommendedModality: Modality;
}

export interface AnalysisRelationship {
  from: string;
  to: string;
  type: string;
}

export interface ModalityDecision {
  objectId: string;
  modality: Modality;
  rationale: LocalizedText;
}

export interface VisualAnalysis {
  id: string;
  sourceAssignmentId: string;
  detectedObjects: AnalysisObject[];
  relationships: AnalysisRelationship[];
  suggestedMode: TactileMode;
  modalityPlan: ModalityDecision[];
  /** Model confidence 0–1; below threshold ⇒ needsTeacherReview. */
  confidence: number;
  needsTeacherReview: boolean;
  /** ISO 8601 timestamp. */
  createdAt: string;
  // --- Phase 1 additions (optional, additive) ---
  /** Plain-language Gemini summary of the detected diagram. */
  summary?: LocalizedText;
  /** Ranked tactile rendering priorities (what to convey first by touch). */
  tactilePriority?: TactilePriority[];
  /** Ordered guided learning steps. */
  learningSteps?: LearningStep[];
}

/* ----------------------------------------------------------------------------
 * Dot Pad interaction layer
 * ------------------------------------------------------------------------- */

export type DotPadKey = "leftPan" | "rightPan" | "f1" | "f2" | "f3" | "f4";

/** A serializable 60×40 raised-pin grid. cells[y][x] === 1 when the pin is raised. */
export interface TactileGridData {
  cols: number;
  rows: number;
  cells: number[][];
}

/** Quiz state for the tactile quiz (F3). */
export interface QuizState {
  active: boolean;
  questionIndex: number;
  total: number;
  score: number;
  lastResult: "correct" | "incorrect" | null;
  finished: boolean;
}

export interface DotPadState {
  connected: boolean;
  // --- Phase 2 simulator fields (active) ---
  currentObjectIndex: number;
  currentObjectName: string;
  currentBrailleText: string;
  currentTutorMessage: string;
  currentMatrix: TactileGridData;
  lastKeyPressed: DotPadKey | null;
  quizState: QuizState;
  /** Phase 4: distinct object ids the student has focused (for progress). */
  exploredIds: string[];
  /** Phase 4: hints requested this session (active). */
  hintsUsed: number;
  /** Phase 3: QA-approved braille summary surfaced by F4 (if any). */
  approvedBrailleSummary?: string;
  // --- Phase 0 fields (retained, optional) ---
  mode?: TactileMode;
  layerIndex?: number;
  objectIndex?: number;
  stepIndex?: number;
  helpOpen?: boolean;
  /** Plain-text mirror of the current braille line. */
  currentBraille?: string;
}

/* ----------------------------------------------------------------------------
 * Classroom / Chromebook content layer
 * ------------------------------------------------------------------------- */

export interface AssignmentSource {
  kind: "image" | "slide" | "pdf" | "doc" | "web";
  /** Mock reference (no real Classroom API in the prototype). */
  ref: string;
  thumbnail?: string;
}

/** An attachable piece of lesson content within an assignment. */
export interface Material {
  id: string;
  name: LocalizedText;
  kind: AssignmentSource["kind"];
  /** Mock reference (no real Classroom API in the prototype). */
  ref: string;
  thumbnail?: string;
}

export type Difficulty = "intro" | "core" | "advanced";

export interface Assignment {
  id: string;
  title: LocalizedText;
  instructions: LocalizedText;
  courseId: string;
  /** ISO 8601 date. */
  dueDate?: string;
  source: AssignmentSource;
  tactileReady: boolean;
  analysisId?: string;
  defaultMode: TactileMode;
  difficulty: Difficulty;
  // --- Phase 1 additions (optional, additive) ---
  /** e.g. { en: "Science", ko: "과학" }. */
  subject?: LocalizedText;
  /** e.g. { en: "Elementary", ko: "초등" }. */
  gradeLevel?: LocalizedText;
  learningObjective?: LocalizedText;
  materials?: Material[];
}

/* ----------------------------------------------------------------------------
 * Progress / reporting
 * ------------------------------------------------------------------------- */

export interface StudentProgress {
  studentId: string;
  studentName: string;
  assignmentId: string;
  opened: boolean;
  modesUsed: TactileMode[];
  objectsExplored: number;
  objectsTotal: number;
  hintsUsed: number;
  quizScore?: number;
  quizTotal?: number;
  timeOnTaskSec: number;
  /** ISO 8601 timestamp. */
  lastActivity: string;
  geminiSummary?: LocalizedText;
}

/* ----------------------------------------------------------------------------
 * Phase 1 — analysis, conversion & guidance types
 * ------------------------------------------------------------------------- */

/** One step in a guided tactile exploration. */
export interface LearningStep {
  index: number;
  instruction: LocalizedText;
  /** Object the student should locate/feel at this step. */
  targetObjectId?: string;
}

/** A ranked priority for what the tactile rendering should convey first. */
export interface TactilePriority {
  rank: number;
  /** Stable key, e.g. "flow-direction". */
  aspect: string;
  label: LocalizedText;
}

/** Per-student accessibility preferences passed into conversion. */
export interface AccessibilityProfile {
  brailleStandard: BrailleStandard;
  language: Language;
  speechRate?: "slow" | "normal" | "fast";
  hintFrequency?: "low" | "medium" | "high";
  highContrast?: boolean;
}

/** A tactile quiz prompt produced for an assignment. */
export interface QuizPrompt {
  id: string;
  prompt: LocalizedText;
  /** The object that is the correct answer. */
  answerObjectId: string;
  hint: LocalizedText;
}

/** Spoken guidance attached to a specific object. */
export interface AudioGuidance {
  objectId: string;
  script: LocalizedText;
}

/** The bundled output of the conversion step (placeholders in Phase 1). */
export interface ConversionResult {
  id: string;
  analysisId: string;
  difficulty: Difficulty;
  accessibilityProfile: AccessibilityProfile;
  tactileLayers: TactileLayer[];
  brailleSummaries: BrailleSummary[];
  audioGuidance: AudioGuidance[];
  quizPrompts: QuizPrompt[];
  /** Phase 3: the braille QA job created for this conversion. */
  brailleJobId?: string;
  /** ISO 8601 timestamp. */
  createdAt: string;
}

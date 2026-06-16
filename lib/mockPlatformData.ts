/**
 * Mock platform data for Dot Lens - AI Tactile Education Platform
 * Replace with Supabase/Firebase calls in production.
 */

/* ─── Lesson Usage ───────────────────────────────────────────── */

export interface LessonUsageRecord {
  lessonId: string;
  teacherId: string;
  teacherName: string;
  country: string;
  school: string;
  subject: string;
  grade: string;
  diagramType: string;
  createdAt: string;
  usedInClass: boolean;
  studentCount: number;
  blindStudentCount: number;
  lowVisionStudentCount: number;
  tactileOutputUsed: boolean;
  audioGuideUsed: boolean;
  teacherConfidenceScore: number; // 1-5
  studentUnderstandingScore: number; // 1-5
  feedbackText: string;
  needsExpertSupport: boolean;
  status: "draft" | "pending_review" | "approved" | "used_in_class";
}

export const LESSON_USAGE_DATA: LessonUsageRecord[] = [
  {
    lessonId: "les-001",
    teacherId: "tch-01",
    teacherName: "Mrs. Anjali Sharma",
    country: "India",
    school: "Blind School Pune",
    subject: "Science",
    grade: "Grade 5",
    diagramType: "water_cycle",
    createdAt: "2026-06-10T08:30:00Z",
    usedInClass: true,
    studentCount: 12,
    blindStudentCount: 8,
    lowVisionStudentCount: 4,
    tactileOutputUsed: true,
    audioGuideUsed: true,
    teacherConfidenceScore: 4,
    studentUnderstandingScore: 4,
    feedbackText: "Students were very engaged with the tactile water cycle diagram. The audio guide helped them follow along.",
    needsExpertSupport: false,
    status: "used_in_class",
  },
  {
    lessonId: "les-002",
    teacherId: "tch-02",
    teacherName: "Mr. Samuel Okafor",
    country: "Nigeria",
    school: "Special Education Centre Lagos",
    subject: "Mathematics",
    grade: "Grade 7",
    diagramType: "geometry_shapes",
    createdAt: "2026-06-11T10:00:00Z",
    usedInClass: true,
    studentCount: 9,
    blindStudentCount: 7,
    lowVisionStudentCount: 2,
    tactileOutputUsed: true,
    audioGuideUsed: false,
    teacherConfidenceScore: 3,
    studentUnderstandingScore: 3,
    feedbackText: "Geometry shapes were a bit complex for my students. The lines were hard to distinguish.",
    needsExpertSupport: true,
    status: "approved",
  },
  {
    lessonId: "les-003",
    teacherId: "tch-03",
    teacherName: "Ms. Priya Nair",
    country: "India",
    school: "National School for Blind Chennai",
    subject: "Biology",
    grade: "Grade 8",
    diagramType: "cell_structure",
    createdAt: "2026-06-12T09:15:00Z",
    usedInClass: false,
    studentCount: 0,
    blindStudentCount: 0,
    lowVisionStudentCount: 0,
    tactileOutputUsed: false,
    audioGuideUsed: false,
    teacherConfidenceScore: 0,
    studentUnderstandingScore: 0,
    feedbackText: "",
    needsExpertSupport: false,
    status: "pending_review",
  },
  {
    lessonId: "les-004",
    teacherId: "tch-01",
    teacherName: "Mrs. Anjali Sharma",
    country: "India",
    school: "Blind School Pune",
    subject: "Geography",
    grade: "Grade 6",
    diagramType: "map_india",
    createdAt: "2026-06-09T14:00:00Z",
    usedInClass: true,
    studentCount: 12,
    blindStudentCount: 8,
    lowVisionStudentCount: 4,
    tactileOutputUsed: true,
    audioGuideUsed: true,
    teacherConfidenceScore: 5,
    studentUnderstandingScore: 5,
    feedbackText: "Excellent results. Students could identify all major states independently.",
    needsExpertSupport: false,
    status: "used_in_class",
  },
  {
    lessonId: "les-005",
    teacherId: "tch-04",
    teacherName: "Rev. James Banda",
    country: "Zambia",
    school: "Mission School Lusaka",
    subject: "Science",
    grade: "Grade 4",
    diagramType: "plant_parts",
    createdAt: "2026-06-13T07:00:00Z",
    usedInClass: true,
    studentCount: 6,
    blindStudentCount: 4,
    lowVisionStudentCount: 2,
    tactileOutputUsed: true,
    audioGuideUsed: true,
    teacherConfidenceScore: 4,
    studentUnderstandingScore: 4,
    feedbackText: "Children loved touching the plant diagram. Very effective for grade 4.",
    needsExpertSupport: false,
    status: "used_in_class",
  },
  {
    lessonId: "les-006",
    teacherId: "tch-05",
    teacherName: "Ms. Kavitha Reddy",
    country: "India",
    school: "Hyderabad Blind School",
    subject: "History",
    grade: "Grade 9",
    diagramType: "timeline",
    createdAt: "2026-06-14T11:30:00Z",
    usedInClass: false,
    studentCount: 0,
    blindStudentCount: 0,
    lowVisionStudentCount: 0,
    tactileOutputUsed: false,
    audioGuideUsed: false,
    teacherConfidenceScore: 0,
    studentUnderstandingScore: 0,
    feedbackText: "",
    needsExpertSupport: false,
    status: "draft",
  },
];

/* ─── Expert Review ──────────────────────────────────────────── */

export type ReviewStatus = "pending" | "approved" | "revision_requested" | "rejected";

export interface ExpertReviewRecord {
  reviewId: string;
  lessonId: string;
  lessonTitle: string;
  subject: string;
  teacherName: string;
  expertId: string | null;
  expertName: string | null;
  clarityScore: number | null; // 1-5
  tactileReadabilityScore: number | null;
  educationalAccuracyScore: number | null;
  complexityLevel: "beginner" | "intermediate" | "advanced" | null;
  comments: string;
  status: ReviewStatus;
  aiConfidence: number; // 0-1
  diagramType: string;
  createdAt: string;
  reviewedAt: string | null;
}

export const EXPERT_REVIEW_QUEUE: ExpertReviewRecord[] = [
  {
    reviewId: "rev-001",
    lessonId: "les-003",
    lessonTitle: "Cell Structure - Grade 8 Biology",
    subject: "Biology",
    teacherName: "Ms. Priya Nair",
    expertId: null,
    expertName: null,
    clarityScore: null,
    tactileReadabilityScore: null,
    educationalAccuracyScore: null,
    complexityLevel: null,
    comments: "",
    status: "pending",
    aiConfidence: 0.84,
    diagramType: "cell_structure",
    createdAt: "2026-06-12T09:15:00Z",
    reviewedAt: null,
  },
  {
    reviewId: "rev-002",
    lessonId: "les-002",
    lessonTitle: "Geometry Shapes - Grade 7 Math",
    subject: "Mathematics",
    teacherName: "Mr. Samuel Okafor",
    expertId: "exp-01",
    expertName: "Dr. Ji-yeon Kim (TVI)",
    clarityScore: 3,
    tactileReadabilityScore: 2,
    educationalAccuracyScore: 4,
    complexityLevel: "intermediate",
    comments: "The line patterns for different shapes are too similar. Recommend using distinct textures: solid lines for triangles, dashed for circles, dotted for squares.",
    status: "revision_requested",
    aiConfidence: 0.71,
    diagramType: "geometry_shapes",
    createdAt: "2026-06-11T10:00:00Z",
    reviewedAt: "2026-06-12T14:30:00Z",
  },
  {
    reviewId: "rev-003",
    lessonId: "les-001",
    lessonTitle: "Water Cycle - Grade 5 Science",
    subject: "Science",
    teacherName: "Mrs. Anjali Sharma",
    expertId: "exp-02",
    expertName: "Mr. Han Soo Park (TVI)",
    clarityScore: 5,
    tactileReadabilityScore: 4,
    educationalAccuracyScore: 5,
    complexityLevel: "beginner",
    comments: "Excellent tactile design. Flow of water cycle is clear and tactile elements are well-differentiated. Approved for classroom use.",
    status: "approved",
    aiConfidence: 0.92,
    diagramType: "water_cycle",
    createdAt: "2026-06-10T08:30:00Z",
    reviewedAt: "2026-06-10T16:00:00Z",
  },
  {
    reviewId: "rev-004",
    lessonId: "les-006",
    lessonTitle: "Historical Timeline - Grade 9 History",
    subject: "History",
    teacherName: "Ms. Kavitha Reddy",
    expertId: null,
    expertName: null,
    clarityScore: null,
    tactileReadabilityScore: null,
    educationalAccuracyScore: null,
    complexityLevel: null,
    comments: "",
    status: "pending",
    aiConfidence: 0.68,
    diagramType: "timeline",
    createdAt: "2026-06-14T11:30:00Z",
    reviewedAt: null,
  },
  {
    reviewId: "rev-005",
    lessonId: "les-005",
    lessonTitle: "Plant Parts - Grade 4 Science",
    subject: "Science",
    teacherName: "Rev. James Banda",
    expertId: "exp-01",
    expertName: "Dr. Ji-yeon Kim (TVI)",
    clarityScore: 5,
    tactileReadabilityScore: 5,
    educationalAccuracyScore: 5,
    complexityLevel: "beginner",
    comments: "Perfect for early learners. Root, stem, leaf, and flower are all clearly distinguishable by touch.",
    status: "approved",
    aiConfidence: 0.95,
    diagramType: "plant_parts",
    createdAt: "2026-06-13T07:00:00Z",
    reviewedAt: "2026-06-13T13:00:00Z",
  },
];

/* ─── Champion Teacher ───────────────────────────────────────── */

export type ChampionStatus = "candidate" | "champion" | "none";

export interface ChampionTeacherRecord {
  teacherId: string;
  teacherName: string;
  country: string;
  school: string;
  totalLessonsCreated: number;
  totalLessonsUsed: number;
  feedbackRate: number; // 0-1
  reviewPassRate: number; // 0-1
  workshopParticipation: number;
  peerTrainingCount: number;
  championStatus: ChampionStatus;
  score: number; // composite 0-100
  joinedAt: string;
  avatarInitials: string;
}

export const CHAMPION_TEACHERS: ChampionTeacherRecord[] = [
  {
    teacherId: "tch-01",
    teacherName: "Mrs. Anjali Sharma",
    country: "India",
    school: "Blind School Pune",
    totalLessonsCreated: 14,
    totalLessonsUsed: 12,
    feedbackRate: 0.93,
    reviewPassRate: 0.92,
    workshopParticipation: 3,
    peerTrainingCount: 5,
    championStatus: "champion",
    score: 91,
    joinedAt: "2026-02-01T00:00:00Z",
    avatarInitials: "AS",
  },
  {
    teacherId: "tch-05",
    teacherName: "Ms. Kavitha Reddy",
    country: "India",
    school: "Hyderabad Blind School",
    totalLessonsCreated: 8,
    totalLessonsUsed: 6,
    feedbackRate: 0.75,
    reviewPassRate: 0.80,
    workshopParticipation: 2,
    peerTrainingCount: 2,
    championStatus: "candidate",
    score: 72,
    joinedAt: "2026-03-15T00:00:00Z",
    avatarInitials: "KR",
  },
  {
    teacherId: "tch-04",
    teacherName: "Rev. James Banda",
    country: "Zambia",
    school: "Mission School Lusaka",
    totalLessonsCreated: 7,
    totalLessonsUsed: 6,
    feedbackRate: 0.86,
    reviewPassRate: 0.85,
    workshopParticipation: 2,
    peerTrainingCount: 1,
    championStatus: "candidate",
    score: 68,
    joinedAt: "2026-04-01T00:00:00Z",
    avatarInitials: "JB",
  },
  {
    teacherId: "tch-02",
    teacherName: "Mr. Samuel Okafor",
    country: "Nigeria",
    school: "Special Education Centre Lagos",
    totalLessonsCreated: 5,
    totalLessonsUsed: 4,
    feedbackRate: 0.60,
    reviewPassRate: 0.50,
    workshopParticipation: 1,
    peerTrainingCount: 0,
    championStatus: "none",
    score: 42,
    joinedAt: "2026-05-01T00:00:00Z",
    avatarInitials: "SO",
  },
  {
    teacherId: "tch-03",
    teacherName: "Ms. Priya Nair",
    country: "India",
    school: "National School for Blind Chennai",
    totalLessonsCreated: 3,
    totalLessonsUsed: 1,
    feedbackRate: 0.33,
    reviewPassRate: 0.66,
    workshopParticipation: 1,
    peerTrainingCount: 0,
    championStatus: "none",
    score: 28,
    joinedAt: "2026-05-20T00:00:00Z",
    avatarInitials: "PN",
  },
];

/* ─── Platform Stats ─────────────────────────────────────────── */

export interface PlatformStats {
  totalLessonsCreated: number;
  pendingReview: number;
  usedInClass: number;
  totalTeachers: number;
  totalStudentSessions: number;
  topSubjects: Array<{ subject: string; count: number }>;
  recentFeedback: Array<{ teacherName: string; text: string; score: number; date: string }>;
  needsImprovement: Array<{ lessonId: string; title: string; reason: string }>;
  countriesActive: number;
  expertReviewCompletionRate: number;
}

export const PLATFORM_STATS: PlatformStats = {
  totalLessonsCreated: 47,
  pendingReview: 6,
  usedInClass: 31,
  totalTeachers: 18,
  totalStudentSessions: 234,
  topSubjects: [
    { subject: "Science", count: 18 },
    { subject: "Mathematics", count: 12 },
    { subject: "Geography", count: 8 },
    { subject: "Biology", count: 5 },
    { subject: "History", count: 4 },
  ],
  recentFeedback: [
    {
      teacherName: "Mrs. Anjali Sharma",
      text: "Students could independently identify all water cycle stages. Best lesson yet!",
      score: 5,
      date: "2026-06-10T16:00:00Z",
    },
    {
      teacherName: "Rev. James Banda",
      text: "Plant parts lesson was very effective. Children loved the tactile experience.",
      score: 4,
      date: "2026-06-13T15:00:00Z",
    },
    {
      teacherName: "Mr. Samuel Okafor",
      text: "Geometry shapes need improvement — hard to distinguish by touch.",
      score: 3,
      date: "2026-06-11T14:00:00Z",
    },
  ],
  needsImprovement: [
    {
      lessonId: "les-002",
      title: "Geometry Shapes - Grade 7",
      reason: "Low tactile readability score (2/5) — expert requested distinct textures",
    },
    {
      lessonId: "les-006",
      title: "Historical Timeline - Grade 9",
      reason: "Low AI confidence (0.68) — pending expert review",
    },
  ],
  countriesActive: 3,
  expertReviewCompletionRate: 0.6,
};

/* ─── AI Analysis Result (mock) ──────────────────────────────── */

export interface AIAnalysisResult {
  summary: { en: string; ko: string };
  mainObjects: string[];
  relationships: string[];
  tactileScore: number; // 0-1
  simplificationNeeded: string[];
  explorationStart: { en: string; ko: string };
  explorationOrder: string[];
  confusionPoints: string[];
  classroomQuestions: string[];
  dotPadLayout: string;
}

export const SAMPLE_AI_ANALYSES: Record<string, AIAnalysisResult> = {
  water_cycle: {
    summary: {
      en: "This diagram shows the water cycle process. It depicts the movement of water from the ocean through evaporation, cloud formation, and precipitation back to the ocean.",
      ko: "이 자료는 물의 순환 과정을 설명하는 다이어그램입니다. 촉각 그래픽에서는 씨앗, 뿌리, 줄기, 잎을 순서대로 탐색하도록 구성하는 것이 좋습니다.",
    },
    mainObjects: ["Ocean (바다)", "Evaporation (증발)", "Cloud (구름)", "Rain/Precipitation (강수)"],
    relationships: ["Ocean → Evaporation (물이 증발함)", "Evaporation → Cloud (수증기가 구름이 됨)", "Cloud → Rain (구름에서 비가 내림)", "Rain → Ocean (빗물이 바다로 돌아옴)"],
    tactileScore: 0.92,
    simplificationNeeded: ["Evaporation arrows — simplify to 3 upward dots", "Rain lines — use consistent diagonal pattern"],
    explorationStart: {
      en: "Start at the bottom-left where the ocean is. Feel the wide horizontal band.",
      ko: "왼쪽 아래의 바다부터 시작하세요. 넓은 수평 띠를 느껴보세요.",
    },
    explorationOrder: ["1. Ocean (bottom-left)", "2. Evaporation arrows (center-left, upward)", "3. Cloud (top-center)", "4. Rain lines (center-right, downward)", "5. Return to ocean"],
    confusionPoints: ["Evaporation vs. precipitation direction — emphasize arrows", "Multiple cloud shapes — simplify to single outline"],
    classroomQuestions: [
      "Where does the water go when it gets warm?",
      "What happens when water vapor gets cold?",
      "How does rain water get back to the ocean?",
    ],
    dotPadLayout: "60x40: Ocean occupies rows 30-40 (full width). Evaporation arrows at cols 10-25, rows 15-30. Cloud at cols 30-50, rows 5-15. Rain at cols 35-55, rows 15-30.",
  },
  plant_parts: {
    summary: {
      en: "This diagram shows the parts of a plant: roots, stem, leaves, and flower. Students explore from bottom to top.",
      ko: "이 다이어그램은 식물의 부위를 보여줍니다. 학생은 아래쪽 뿌리에서 위쪽 꽃까지 순서대로 탐색합니다.",
    },
    mainObjects: ["Roots (뿌리)", "Stem (줄기)", "Leaves (잎)", "Flower (꽃)"],
    relationships: ["Roots → Stem (물·영양 이동)", "Stem → Leaves (수분 공급)", "Stem → Flower (성장 지원)"],
    tactileScore: 0.95,
    simplificationNeeded: ["Root branches — simplify to 3 main roots", "Leaf veins — use ridge pattern only"],
    explorationStart: {
      en: "Begin at the very bottom. Feel the branching root system spreading downward.",
      ko: "맨 아래에서 시작하세요. 아래로 뻗어 있는 뿌리를 느껴보세요.",
    },
    explorationOrder: ["1. Roots (bottom)", "2. Stem (center vertical line)", "3. Left leaf", "4. Right leaf", "5. Flower (top)"],
    confusionPoints: ["Leaf vs. flower shape — use distinct outlines", "Stem width — make thicker than root branches"],
    classroomQuestions: [
      "Which part of the plant absorbs water from the soil?",
      "What does the stem do for the plant?",
      "How do you know where the flower is on the diagram?",
    ],
    dotPadLayout: "60x40: Roots at rows 30-40 (center). Stem at cols 28-32, rows 10-30. Leaves at cols 15-27 and 33-45, rows 15-25. Flower at cols 22-38, rows 2-10.",
  },
};

/* ─── Field Activist Data ────────────────────────────────────── */

export interface FieldReport {
  reportId: string;
  activistName: string;
  region: string;
  country: string;
  date: string;
  schoolsVisited: number;
  teachersMet: number;
  issuesReported: string[];
  workshopNeeds: string[];
  notes: string;
}

export const FIELD_REPORTS: FieldReport[] = [
  {
    reportId: "fr-001",
    activistName: "Ms. Sunita Verma",
    region: "Maharashtra",
    country: "India",
    date: "2026-06-08T00:00:00Z",
    schoolsVisited: 3,
    teachersMet: 7,
    issuesReported: [
      "Teachers unsure how to explain tactile arrows to students",
      "Dot Pad charging cable missing at 1 school",
    ],
    workshopNeeds: ["Tactile diagram explanation techniques", "How to use audio guide alongside Dot Pad"],
    notes: "Pune and Nashik schools are very motivated. Mrs. Sharma is becoming a natural leader and helping other teachers.",
  },
  {
    reportId: "fr-002",
    activistName: "Mr. Peter Mwanza",
    region: "Lusaka Province",
    country: "Zambia",
    date: "2026-06-12T00:00:00Z",
    schoolsVisited: 2,
    teachersMet: 4,
    issuesReported: [
      "Internet connectivity issues — offline mode needed urgently",
      "Teachers want local language (Nyanja) audio support",
    ],
    workshopNeeds: ["Offline content creation", "Local language audio recording"],
    notes: "Mission schools are highly engaged but connectivity is a real barrier. Rev. Banda is a strong champion candidate.",
  },
];

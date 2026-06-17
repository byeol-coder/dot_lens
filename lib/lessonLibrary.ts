import type { TactileScene } from "@/lib/tactileScene";

export type Subject = "korean" | "math" | "science" | "social" | "art" | "mobility";
export type Grade = "elementary" | "middle" | "high";

export interface LessonEntry {
  id: string;
  subject: Subject;
  grade: Grade;
  title: { ko: string; en: string };
  description: { ko: string; en: string };
  sourceUrl: string;       // lessonlibrary.withgoogle.com 스타일 URL (mock)
  diagramType: string;
  objects: string[];
  steps: number;
  scene: TactileScene;     // 실제 렌더러로 그릴 촉각 장면
  brailleLabel: string;
  audioGuide: { ko: string; en: string };
}

/* ─── helpers ──────────────────────────────────────────────── */
function blank(): number[][] {
  return Array.from({ length: 40 }, () => new Array<number>(60).fill(0));
}

/* ─── 국어: 문장 성분 구조도 ─────────────────────────────── */
const SENTENCE_STRUCTURE: TactileScene = {
  id: "korean-sentence",
  title: { en: "Sentence structure diagram", ko: "문장 성분 구조도" },
  type: "process",
  primitives: [
    // 뿌리(문장) 노드
    { kind: "rect", x: 22, y: 2, w: 16, h: 4, fill: true },
    // 주어 가지
    { kind: "line", x1: 30, y1: 6, x2: 14, y2: 13 },
    { kind: "rect", x: 6,  y: 13, w: 16, h: 4, fill: true },
    // 서술어 가지
    { kind: "line", x1: 30, y1: 6, x2: 46, y2: 13 },
    { kind: "rect", x: 38, y: 13, w: 16, h: 4, fill: true },
    // 목적어 가지 (서술어 하위)
    { kind: "line", x1: 46, y1: 17, x2: 38, y2: 24 },
    { kind: "rect", x: 30, y: 24, w: 16, h: 4, fill: true },
    // 부사어 가지 (서술어 하위)
    { kind: "line", x1: 46, y1: 17, x2: 52, y2: 24 },
    { kind: "rect", x: 44, y: 24, w: 14, h: 4, fill: true },
    // 수식어 가지 (주어 하위)
    { kind: "line", x1: 14, y1: 17, x2: 10, y2: 24 },
    { kind: "rect", x: 3,  y: 24, w: 14, h: 4, fill: true },
  ],
  brailleKey: [
    { mark: "S", label: { en: "subject", ko: "주어" } },
    { mark: "P", label: { en: "predicate", ko: "서술어" } },
    { mark: "O", label: { en: "object", ko: "목적어" } },
    { mark: "A", label: { en: "adverbial", ko: "부사어" } },
    { mark: "M", label: { en: "modifier", ko: "관형어" } },
  ],
};

/* ─── 수학: 이차함수 포물선 ───────────────────────────────── */
const QUADRATIC_GRAPH: TactileScene = {
  id: "math-quadratic",
  title: { en: "Quadratic function y = x²", ko: "이차함수 y = x² 그래프" },
  type: "graph",
  primitives: [
    // x축, y축
    { kind: "arrow", x1: 30, y1: 20, x2: 56, y2: 20 },
    { kind: "arrow", x1: 30, y1: 20, x2: 4,  y2: 20 },
    { kind: "arrow", x1: 30, y1: 20, x2: 30, y2: 2  },
    { kind: "arrow", x1: 30, y1: 20, x2: 30, y2: 38 },
    // 눈금
    ...([6,14,22,38,46,54] as number[]).map(x =>
      ({ kind: "line" as const, x1: x, y1: 19, x2: x, y2: 21 })
    ),
    ...([4,12,28,36] as number[]).map(y =>
      ({ kind: "line" as const, x1: 29, y1: y, x2: 31, y2: y })
    ),
    // y = x² 포물선 점들 (꼭짓점 (30,20), 대칭)
    { kind: "dots", points: [
      [30, 20],
      [32, 20],[28, 20],
      [34, 21],[26, 21],
      [36, 24],[24, 24],
      [38, 28],[22, 28],
      [40, 34],[20, 34],
    ]},
    // 꼭짓점 강조
    { kind: "disc", cx: 30, cy: 20, r: 2 },
  ],
  brailleKey: [
    { mark: "v", label: { en: "vertex (0, 0)", ko: "꼭짓점 (0, 0)" } },
    { mark: "~", label: { en: "parabola", ko: "포물선" } },
  ],
};

/* ─── 수학: 평행사변형 (도형의 성질) ─────────────────────── */
const PARALLELOGRAM: TactileScene = {
  id: "math-parallelogram",
  title: { en: "Parallelogram — properties", ko: "평행사변형의 성질" },
  type: "geometry",
  primitives: [
    // 평행사변형 ABCD
    { kind: "line", x1: 12, y1: 30, x2: 32, y2: 10 }, // AB
    { kind: "line", x1: 32, y1: 10, x2: 52, y2: 10 }, // BC
    { kind: "line", x1: 52, y1: 10, x2: 32, y2: 30 }, // CD
    { kind: "line", x1: 32, y1: 30, x2: 12, y2: 30 }, // DA
    // 대각선
    { kind: "line", x1: 12, y1: 30, x2: 52, y2: 10 },
    { kind: "line", x1: 32, y1: 10, x2: 32, y2: 30 },
    // 꼭짓점
    { kind: "disc", cx: 12, cy: 30, r: 2 },
    { kind: "disc", cx: 32, cy: 10, r: 2 },
    { kind: "disc", cx: 52, cy: 10, r: 2 },
    { kind: "disc", cx: 32, cy: 30, r: 2 },
    // 중심점 (대각선 교점)
    { kind: "disc", cx: 32, cy: 20, r: 2 },
  ],
  brailleKey: [
    { mark: "a", label: { en: "vertex A", ko: "꼭짓점 A" } },
    { mark: "b", label: { en: "vertex B", ko: "꼭짓점 B" } },
    { mark: "m", label: { en: "midpoint", ko: "대각선 교점" } },
  ],
};

/* ─── 과학: 세포 구조 (식물세포) ──────────────────────────── */
const CELL_STRUCTURE: TactileScene = {
  id: "science-cell",
  title: { en: "Plant cell structure", ko: "식물 세포 구조" },
  type: "process",
  primitives: [
    // 세포벽 (외곽 사각형)
    { kind: "rect", x: 4, y: 3, w: 52, h: 34, fill: false },
    // 세포막 (안쪽 사각형)
    { kind: "rect", x: 7, y: 6, w: 46, h: 28, fill: false },
    // 핵 (중앙 원)
    { kind: "ring", cx: 30, cy: 20, r: 7 },
    // 인 (핵 내부 작은 점)
    { kind: "disc", cx: 30, cy: 20, r: 2 },
    // 엽록체 (좌측 타원형 → disc로 표현)
    { kind: "disc", cx: 14, cy: 14, r: 3 },
    { kind: "disc", cx: 14, cy: 26, r: 3 },
    // 미토콘드리아 (우측)
    { kind: "disc", cx: 46, cy: 14, r: 3 },
    { kind: "disc", cx: 46, cy: 26, r: 3 },
    // 액포 (우하단 큰 원)
    { kind: "ring", cx: 44, cy: 30, r: 5 },
    // 소포체 (수평 선들)
    { kind: "line", x1: 20, y1: 16, x2: 26, y2: 16 },
    { kind: "line", x1: 20, y1: 18, x2: 26, y2: 18 },
    { kind: "line", x1: 20, y1: 22, x2: 26, y2: 22 },
    { kind: "line", x1: 20, y1: 24, x2: 26, y2: 24 },
  ],
  brailleKey: [
    { mark: "w", label: { en: "cell wall", ko: "세포벽" } },
    { mark: "n", label: { en: "nucleus", ko: "핵" } },
    { mark: "c", label: { en: "chloroplast", ko: "엽록체" } },
    { mark: "v", label: { en: "vacuole", ko: "액포" } },
  ],
};

/* ─── 과학: 지구 내부 구조 ─────────────────────────────────── */
const EARTH_LAYERS: TactileScene = {
  id: "science-earth",
  title: { en: "Earth's internal structure", ko: "지구 내부 구조" },
  type: "process",
  primitives: [
    // 내핵 (가장 안쪽, 가득 채움)
    { kind: "disc", cx: 30, cy: 20, r: 5 },
    // 외핵 (ring)
    { kind: "ring", cx: 30, cy: 20, r: 9 },
    // 맨틀 (texture ring 표현 — 두꺼운 ring + texture)
    { kind: "ring", cx: 30, cy: 20, r: 14 },
    { kind: "ring", cx: 30, cy: 20, r: 16 },
    { kind: "ring", cx: 30, cy: 20, r: 15 },
    // 지각 (외곽 ring)
    { kind: "ring", cx: 30, cy: 20, r: 18 },
    // 단면 표시선 (우측 절반 잘라낸 효과)
    { kind: "line", x1: 30, y1: 2, x2: 30, y2: 38 },
    // 화살표 — 각 층 지시
    { kind: "arrow", x1: 36, y1: 20, x2: 42, y2: 13 },
    { kind: "arrow", x1: 46, y1: 20, x2: 50, y2: 13 },
  ],
  brailleKey: [
    { mark: "i", label: { en: "inner core", ko: "내핵" } },
    { mark: "o", label: { en: "outer core", ko: "외핵" } },
    { mark: "m", label: { en: "mantle", ko: "맨틀" } },
    { mark: "c", label: { en: "crust", ko: "지각" } },
  ],
};

/* ─── 국어: 이야기 구조 (기승전결) ──────────────────────────── */
const NARRATIVE_STRUCTURE: TactileScene = {
  id: "korean-narrative",
  title: { en: "Narrative structure (4-part)", ko: "이야기 구조 (기승전결)" },
  type: "process",
  primitives: [
    // 4단계 흐름 (가로 화살표 + 박스)
    { kind: "rect", x: 2,  y: 14, w: 10, h: 12, fill: true },
    { kind: "arrow", x1: 12, y1: 20, x2: 16, y2: 20 },
    { kind: "rect", x: 16, y: 14, w: 10, h: 12, fill: true },
    { kind: "arrow", x1: 26, y1: 20, x2: 30, y2: 20 },
    { kind: "rect", x: 30, y: 14, w: 10, h: 12, fill: true },
    { kind: "arrow", x1: 40, y1: 20, x2: 44, y2: 20 },
    { kind: "rect", x: 44, y: 14, w: 14, h: 12, fill: true },
    // 클라이맥스 표시 (세 번째 상자 위 ▲)
    { kind: "line", x1: 33, y1: 14, x2: 35, y2: 10 },
    { kind: "line", x1: 37, y1: 14, x2: 35, y2: 10 },
    // 긴장감 곡선
    { kind: "line", x1: 7,  y1: 26, x2: 21, y2: 24 },
    { kind: "line", x1: 21, y1: 24, x2: 35, y2: 10 },
    { kind: "line", x1: 35, y1: 10, x2: 51, y2: 22 },
  ],
  brailleKey: [
    { mark: "1", label: { en: "introduction (기)", ko: "기" } },
    { mark: "2", label: { en: "development (승)", ko: "승" } },
    { mark: "3", label: { en: "turn (전)", ko: "전" } },
    { mark: "4", label: { en: "conclusion (결)", ko: "결" } },
  ],
};

/* ─── 레슨 카탈로그 ──────────────────────────────────────────── */
export const LESSON_CATALOG: LessonEntry[] = [
  {
    id: "kor-sentence",
    subject: "korean",
    grade: "middle",
    title: { ko: "문장 성분과 문장 구조", en: "Sentence components & structure" },
    description: { ko: "주어, 서술어, 목적어, 부사어, 관형어의 계층 관계를 구조도로 탐색합니다.", en: "Explore the hierarchical relationships of Korean sentence components through a structure diagram." },
    sourceUrl: "https://lessonlibrary.withgoogle.com/intl/ALL_kr/view/lesson/kor-sentence-structure",
    diagramType: "구조도",
    objects: ["주어", "서술어", "목적어", "부사어", "관형어"],
    steps: 5,
    scene: SENTENCE_STRUCTURE,
    brailleLabel: "문장 구조",
    audioGuide: { ko: "가장 위에 있는 마디가 전체 문장입니다. 왼쪽 아래로 내려가면 주어, 오른쪽으로 내려가면 서술어입니다.", en: "The top node is the whole sentence. Go left for subject, right for predicate." },
  },
  {
    id: "kor-narrative",
    subject: "korean",
    grade: "elementary",
    title: { ko: "이야기의 기승전결 구조", en: "Narrative structure: rising action" },
    description: { ko: "이야기의 흐름을 기·승·전·결 네 단계로 나누고 긴장감 곡선을 촉각으로 느낍니다.", en: "Divide the story flow into four parts and feel the tension curve with your fingertips." },
    sourceUrl: "https://lessonlibrary.withgoogle.com/intl/ALL_kr/view/lesson/kor-narrative-4parts",
    diagramType: "흐름 다이어그램",
    objects: ["기", "승", "전", "결", "긴장감 곡선"],
    steps: 4,
    scene: NARRATIVE_STRUCTURE,
    brailleLabel: "기승전결",
    audioGuide: { ko: "왼쪽에서 오른쪽으로 네 개의 마디가 있습니다. 세 번째 마디(전)에서 긴장감이 가장 높습니다.", en: "There are four nodes left to right. Tension peaks at the third node (turn)." },
  },
  {
    id: "math-quadratic",
    subject: "math",
    grade: "middle",
    title: { ko: "이차함수 y = x² 그래프", en: "Quadratic function y = x²" },
    description: { ko: "꼭짓점을 중심으로 좌우 대칭인 포물선의 모양을 촉각으로 탐색합니다.", en: "Explore the bilaterally symmetric parabola centered at the vertex." },
    sourceUrl: "https://lessonlibrary.withgoogle.com/intl/ALL_kr/view/lesson/math-quadratic-parabola",
    diagramType: "함수 그래프",
    objects: ["x축", "y축", "꼭짓점", "포물선", "대칭축"],
    steps: 5,
    scene: QUADRATIC_GRAPH,
    brailleLabel: "이차함수",
    audioGuide: { ko: "중앙이 꼭짓점(0,0)입니다. 위쪽으로 갈수록 포물선이 벌어집니다.", en: "The center is the vertex at (0,0). The parabola opens upward." },
  },
  {
    id: "math-parallelogram",
    subject: "math",
    grade: "elementary",
    title: { ko: "평행사변형의 성질", en: "Properties of a parallelogram" },
    description: { ko: "대각선의 교점, 평행한 두 쌍의 변, 꼭짓점을 손끝으로 확인합니다.", en: "Identify diagonals, parallel sides, and vertices by touch." },
    sourceUrl: "https://lessonlibrary.withgoogle.com/intl/ALL_kr/view/lesson/math-parallelogram-properties",
    diagramType: "기하 도형",
    objects: ["꼭짓점 A~D", "대각선", "교점", "평행변"],
    steps: 4,
    scene: PARALLELOGRAM,
    brailleLabel: "평행사변형",
    audioGuide: { ko: "네 꼭짓점과 두 개의 대각선이 중심에서 만납니다. 위아래 두 변은 서로 평행합니다.", en: "Four vertices with two diagonals meeting at the center." },
  },
  {
    id: "sci-cell",
    subject: "science",
    grade: "middle",
    title: { ko: "식물 세포의 구조", en: "Plant cell structure" },
    description: { ko: "세포벽·세포막·핵·엽록체·액포의 위치와 크기를 촉각 다이어그램으로 탐색합니다.", en: "Explore the positions and sizes of cell wall, membrane, nucleus, chloroplasts, and vacuole." },
    sourceUrl: "https://lessonlibrary.withgoogle.com/intl/ALL_kr/view/lesson/sci-plant-cell",
    diagramType: "과학 다이어그램",
    objects: ["세포벽", "세포막", "핵", "인", "엽록체", "미토콘드리아", "액포"],
    steps: 7,
    scene: CELL_STRUCTURE,
    brailleLabel: "식물 세포",
    audioGuide: { ko: "가장 바깥 사각형이 세포벽, 그 안쪽이 세포막입니다. 중앙의 링이 핵입니다.", en: "The outer rectangle is the cell wall, inner is the membrane. The central ring is the nucleus." },
  },
  {
    id: "sci-earth",
    subject: "science",
    grade: "middle",
    title: { ko: "지구 내부 구조", en: "Earth's internal structure" },
    description: { ko: "내핵·외핵·맨틀·지각의 층 구조를 동심원 형태로 손끝으로 느낍니다.", en: "Feel the concentric-layer structure of inner core, outer core, mantle, and crust." },
    sourceUrl: "https://lessonlibrary.withgoogle.com/intl/ALL_kr/view/lesson/sci-earth-layers",
    diagramType: "단면 다이어그램",
    objects: ["내핵", "외핵", "맨틀", "지각"],
    steps: 4,
    scene: EARTH_LAYERS,
    brailleLabel: "지구 구조",
    audioGuide: { ko: "가운데 채워진 원이 내핵입니다. 바깥으로 나갈수록 외핵·맨틀·지각 순서입니다.", en: "The solid center disc is the inner core. Moving outward: outer core, mantle, crust." },
  },
  {
    id: "sci-water-cycle",
    subject: "science",
    grade: "elementary",
    title: { ko: "물의 순환", en: "The Water Cycle" },
    description: { ko: "태양·증발·구름·비·강을 따라 물이 어떻게 순환하는지 Dot Pad로 탐색합니다.", en: "Explore how water cycles through sun, evaporation, cloud, rain, and river on the Dot Pad." },
    sourceUrl: "https://lessonlibrary.withgoogle.com/intl/ALL_kr/view/lesson/sci-water-cycle",
    diagramType: "순환 다이어그램",
    objects: ["태양", "물", "증발", "구름", "비", "강", "순환"],
    steps: 6,
    scene: {
      id: "water-cycle",
      title: { en: "Water cycle", ko: "물의 순환" },
      type: "process",
      primitives: [],   // uses existing getMatrix("cycle") — see LessonPlayerPage
    },
    brailleLabel: "물의 순환",
    audioGuide: { ko: "태양에서 시작해 시계 방향으로 증발→구름→비→강 순서로 탐색하세요.", en: "Start at the sun and explore clockwise: evaporation, cloud, rain, river." },
  },

  /* ─── 사회: 우리 지역 지도 ─────────────────────────────────── */
  {
    id: "soc-region-map",
    subject: "social",
    grade: "elementary",
    title: { ko: "우리 지역 지도 읽기", en: "Reading a local map" },
    description: { ko: "지역 경계, 강, 큰 길, 중심지를 촉각 지도로 탐색합니다.", en: "Explore the region boundary, river, main road, and town center on a tactile map." },
    sourceUrl: "https://lessonlibrary.withgoogle.com/intl/ALL_kr/view/lesson/soc-region-map",
    diagramType: "지도",
    objects: ["지역 경계", "강", "큰 길", "중심지"],
    steps: 4,
    scene: {
      id: "region-map",
      title: { en: "Local map", ko: "우리 지역 지도" },
      type: "map",
      primitives: [
        { kind: "rect", x: 8, y: 6, w: 44, h: 28, fill: false }, // 지역 경계
        { kind: "line", x1: 12, y1: 10, x2: 26, y2: 20 },        // 강
        { kind: "line", x1: 26, y1: 20, x2: 22, y2: 32 },
        { kind: "line", x1: 8, y1: 24, x2: 52, y2: 24 },         // 큰 길
        { kind: "disc", cx: 36, cy: 16, r: 2 },                  // 중심지
      ],
      brailleKey: [
        { mark: "b", label: { en: "boundary", ko: "지역 경계" } },
        { mark: "r", label: { en: "river", ko: "강" } },
        { mark: "d", label: { en: "main road", ko: "큰 길" } },
        { mark: "c", label: { en: "town center", ko: "중심지" } },
      ],
    },
    brailleLabel: "지역 지도",
    audioGuide: { ko: "바깥 사각형이 지역 경계입니다. 가운데를 가로지르는 긴 선이 큰 길, 점이 중심지입니다.", en: "The outer rectangle is the boundary. The long line across the middle is the main road; the dot is the town center." },
  },

  /* ─── 미술: 점·선·면 구성 감상 ─────────────────────────────── */
  {
    id: "art-composition",
    subject: "art",
    grade: "elementary",
    title: { ko: "점·선·면으로 보는 구성", en: "Dots, lines, and planes" },
    description: { ko: "작품의 기본 조형 요소인 점, 선, 면을 손끝으로 비교하며 감상합니다.", en: "Compare the basic art elements — a dot, a line, and a plane — by touch." },
    sourceUrl: "https://lessonlibrary.withgoogle.com/intl/ALL_kr/view/lesson/art-dot-line-plane",
    diagramType: "작품 감상",
    objects: ["점", "선", "면"],
    steps: 3,
    scene: {
      id: "art-comp",
      title: { en: "Composition", ko: "구성" },
      type: "geometry",
      primitives: [
        { kind: "disc", cx: 15, cy: 13, r: 4 },                  // 점
        { kind: "line", x1: 8, y1: 32, x2: 52, y2: 10 },         // 선
        { kind: "rect", x: 36, y: 22, w: 16, h: 12, fill: false }, // 면
      ],
      brailleKey: [
        { mark: "p", label: { en: "dot", ko: "점" } },
        { mark: "l", label: { en: "line", ko: "선" } },
        { mark: "f", label: { en: "plane", ko: "면" } },
      ],
    },
    brailleLabel: "점 선 면",
    audioGuide: { ko: "왼쪽 위의 둥근 것이 점, 비스듬히 가로지르는 것이 선, 오른쪽 아래 사각형이 면입니다.", en: "The round shape upper-left is a dot, the diagonal is a line, the rectangle lower-right is a plane." },
  },

  /* ─── 보행·이동: 횡단보도 건너기 ───────────────────────────── */
  {
    id: "mob-crosswalk",
    subject: "mobility",
    grade: "elementary",
    title: { ko: "횡단보도 건너기", en: "Crossing at a crosswalk" },
    description: { ko: "양쪽 연석, 횡단보도 줄무늬, 건너는 방향을 촉각으로 익혀 안전하게 보행합니다.", en: "Learn the curbs, crosswalk stripes, and crossing direction by touch for safe travel." },
    sourceUrl: "https://lessonlibrary.withgoogle.com/intl/ALL_kr/view/lesson/mob-crosswalk",
    diagramType: "흐름도",
    objects: ["출발 연석", "줄무늬", "건너는 방향", "도착 연석"],
    steps: 4,
    scene: {
      id: "crosswalk",
      title: { en: "Crosswalk", ko: "횡단보도" },
      type: "process",
      primitives: [
        { kind: "line", x1: 4, y1: 32, x2: 56, y2: 32 },  // 출발 연석 (아래)
        { kind: "line", x1: 4, y1: 8, x2: 56, y2: 8 },    // 도착 연석 (위)
        { kind: "rect", x: 14, y: 10, w: 4, h: 20 },      // 줄무늬
        { kind: "rect", x: 22, y: 10, w: 4, h: 20 },
        { kind: "rect", x: 30, y: 10, w: 4, h: 20 },
        { kind: "rect", x: 38, y: 10, w: 4, h: 20 },
        { kind: "rect", x: 46, y: 10, w: 4, h: 20 },
        { kind: "arrow", x1: 30, y1: 30, x2: 30, y2: 10 }, // 건너는 방향
      ],
      brailleKey: [
        { mark: "s", label: { en: "start curb", ko: "출발 연석" } },
        { mark: "z", label: { en: "stripes", ko: "줄무늬" } },
        { mark: "a", label: { en: "cross direction", ko: "건너는 방향" } },
        { mark: "e", label: { en: "end curb", ko: "도착 연석" } },
      ],
    },
    brailleLabel: "횡단보도",
    audioGuide: { ko: "아래 선이 출발 연석, 위 선이 도착 연석입니다. 세로 줄무늬를 따라 위쪽 화살표 방향으로 건넙니다.", en: "The lower line is the start curb, the upper line the end curb. Cross upward along the vertical stripes following the arrow." },
  },
];

export const SUBJECTS: Record<Subject, { ko: string; en: string; color: string }> = {
  korean:  { ko: "국어", en: "Korean",          color: "#E9F0FE" },
  math:    { ko: "수학", en: "Math",             color: "#E4F4EC" },
  science: { ko: "과학", en: "Science",          color: "#FBF3E2" },
  social:  { ko: "사회", en: "Social Studies",   color: "#F3ECFB" },
  art:     { ko: "미술", en: "Art",              color: "#FDECEF" },
  mobility:{ ko: "보행·이동", en: "Orientation & Mobility", color: "#EAF6F6" },
};

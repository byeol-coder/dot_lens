import type { Assignment, Material } from "@/types";

/**
 * Mock Classroom assignments for the demo.
 *
 * TODO(real API): replace these with the Google Classroom add-on
 * (coursework + roster). No real Classroom API is used in the prototype.
 */

export const WATER_CYCLE_MATERIAL: Material = {
  id: "mat-wc-1",
  name: { en: "Water Cycle Diagram", ko: "물의 순환 다이어그램" },
  kind: "image",
  ref: "mock://water-cycle.png",
};

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "wc-001",
    title: { en: "Explore the Water Cycle Diagram", ko: "물의 순환 다이어그램 탐색하기" },
    instructions: {
      en: "Feel each part of the water cycle on your Dot Pad and follow the audio guidance.",
      ko: "Dot Pad로 물의 순환의 각 부분을 만져 보고 음성 안내를 따라가세요.",
    },
    courseId: "sci-5b",
    dueDate: "2026-06-20",
    source: { kind: "image", ref: "mock://water-cycle.png" },
    tactileReady: true,
    analysisId: "an-wc-001",
    defaultMode: "guided",
    difficulty: "core",
    subject: { en: "Science", ko: "과학" },
    gradeLevel: { en: "Elementary", ko: "초등" },
    learningObjective: {
      en: "Understand evaporation, condensation, precipitation, and collection through tactile exploration.",
      ko: "증발, 응결, 강수, 모임을 촉각 탐색을 통해 이해한다.",
    },
    materials: [WATER_CYCLE_MATERIAL],
  },
  {
    id: "plant-002",
    title: { en: "Label the Parts of a Plant", ko: "식물의 부분 이름 붙이기" },
    instructions: {
      en: "Identify roots, stem, leaves, and flower by touch.",
      ko: "뿌리, 줄기, 잎, 꽃을 촉각으로 식별하세요.",
    },
    courseId: "sci-5b",
    dueDate: "2026-06-24",
    source: { kind: "image", ref: "mock://plant.png" },
    tactileReady: false,
    defaultMode: "explore",
    difficulty: "intro",
    subject: { en: "Science", ko: "과학" },
    gradeLevel: { en: "Elementary", ko: "초등" },
    learningObjective: {
      en: "Recognize the main parts of a plant and their positions.",
      ko: "식물의 주요 부분과 위치를 인식한다.",
    },
    materials: [
      { id: "mat-pl-1", name: { en: "Plant Diagram", ko: "식물 다이어그램" }, kind: "image", ref: "mock://plant.png" },
    ],
  },
  {
    id: "shapes-003",
    title: { en: "Compare 2D Shapes", ko: "2D 도형 비교하기" },
    instructions: {
      en: "Feel and compare a triangle, square, and circle.",
      ko: "삼각형, 정사각형, 원을 만져 보고 비교하세요.",
    },
    courseId: "math-5a",
    dueDate: "2026-06-27",
    source: { kind: "slide", ref: "mock://shapes.slide" },
    tactileReady: false,
    defaultMode: "compare",
    difficulty: "intro",
    subject: { en: "Math", ko: "수학" },
    gradeLevel: { en: "Elementary", ko: "초등" },
    learningObjective: {
      en: "Distinguish 2D shapes by their number of sides and corners.",
      ko: "변과 꼭짓점의 수로 2D 도형을 구별한다.",
    },
    materials: [
      { id: "mat-sh-1", name: { en: "Shapes Slide", ko: "도형 슬라이드" }, kind: "slide", ref: "mock://shapes.slide" },
    ],
  },
];

export function getAssignments(): Assignment[] {
  return MOCK_ASSIGNMENTS;
}

export function getAssignmentById(id: string): Assignment | undefined {
  return MOCK_ASSIGNMENTS.find((a) => a.id === id);
}

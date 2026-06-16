import type { TactileScene } from "@/lib/tactileScene";

/**
 * A small library of scenes across subjects/exam formats, built from primitives
 * (not hand-coded pixels). These demonstrate the conversion engine generalizing
 * beyond the water-cycle diagram.
 *
 * TODO(real Gemini): these scenes would be produced by the model from an
 * uploaded image, then reviewed in the Tactile/Braille QA layer before reaching
 * a student — mandatory for exam material.
 */

/** Bar chart — e.g. "monthly rainfall" (data / statistics, exam staple). */
export const BAR_CHART: TactileScene = {
  id: "bar-chart",
  title: { en: "Bar chart — monthly rainfall", ko: "막대그래프 — 월별 강수량" },
  type: "chart",
  primitives: [
    // axes (L-shape)
    { kind: "line", x1: 10, y1: 4, x2: 10, y2: 34 },
    { kind: "line", x1: 10, y1: 34, x2: 54, y2: 34 },
    // bars (different heights)
    { kind: "rect", x: 15, y: 24, w: 5, h: 10 },
    { kind: "rect", x: 25, y: 16, w: 5, h: 18 },
    { kind: "rect", x: 35, y: 26, w: 5, h: 8 },
    { kind: "rect", x: 45, y: 12, w: 5, h: 22 },
  ],
  brailleKey: [
    { mark: "1", label: { en: "Jan", ko: "1월" } },
    { mark: "2", label: { en: "Feb", ko: "2월" } },
    { mark: "3", label: { en: "Mar", ko: "3월" } },
    { mark: "4", label: { en: "Apr", ko: "4월" } },
  ],
};

/** Right triangle with labeled vertices + right-angle marker (geometry exam). */
export const RIGHT_TRIANGLE: TactileScene = {
  id: "right-triangle",
  title: { en: "Right triangle", ko: "직각삼각형" },
  type: "geometry",
  primitives: [
    // sides: A(10,32) B(48,32) C(10,8)
    { kind: "line", x1: 10, y1: 32, x2: 48, y2: 32 }, // base AB
    { kind: "line", x1: 10, y1: 32, x2: 10, y2: 8 }, // height AC
    { kind: "line", x1: 48, y1: 32, x2: 10, y2: 8 }, // hypotenuse BC
    // right-angle marker at A
    { kind: "line", x1: 14, y1: 32, x2: 14, y2: 28 },
    { kind: "line", x1: 10, y1: 28, x2: 14, y2: 28 },
    // vertices
    { kind: "disc", cx: 10, cy: 32, r: 1 },
    { kind: "disc", cx: 48, cy: 32, r: 1 },
    { kind: "disc", cx: 10, cy: 8, r: 1 },
  ],
  brailleKey: [
    { mark: "a", label: { en: "vertex A (right angle)", ko: "꼭짓점 A (직각)" } },
    { mark: "b", label: { en: "vertex B", ko: "꼭짓점 B" } },
    { mark: "c", label: { en: "vertex C", ko: "꼭짓점 C" } },
  ],
};

/** Number line with ticks and a plotted point (math exam). */
export const NUMBER_LINE: TactileScene = {
  id: "number-line",
  title: { en: "Number line — point at 4", ko: "수직선 — 4에 점" },
  type: "graph",
  primitives: [
    // axis with arrowheads both ends
    { kind: "arrow", x1: 30, y1: 20, x2: 56, y2: 20 },
    { kind: "arrow", x1: 30, y1: 20, x2: 4, y2: 20 },
    // ticks at 0..6 (x = 10,18,26,34,42,50, plus origin 6)
    ...[6, 14, 22, 30, 38, 46, 54].map(
      (x) => ({ kind: "line", x1: x, y1: 18, x2: x, y2: 22 } as const)
    ),
    // plotted point at value "4" (x = 38)
    { kind: "disc", cx: 38, cy: 20, r: 2 },
  ],
  brailleKey: [
    { mark: "0", label: { en: "zero", ko: "영" } },
    { mark: "4", label: { en: "plotted point", ko: "표시된 점" } },
  ],
};

export const SAMPLE_SCENES: TactileScene[] = [
  BAR_CHART,
  RIGHT_TRIANGLE,
  NUMBER_LINE,
];

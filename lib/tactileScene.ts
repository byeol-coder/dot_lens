import type { TactileGridData } from "@/types";

/**
 * Tactile Scene IR + deterministic renderer.
 *
 * The conversion pipeline's general core: instead of hand-coding pixel patterns
 * per diagram, the (mock) Gemini layer emits a structured TactileScene of
 * primitives, and this deterministic renderer rasterizes it to the 60×40 pin
 * grid. Deterministic + reviewable = safe for the Global Braille/Tactile QA gate
 * and for exam material.
 *
 * Coordinates are in grid units: x 0..59 (left→right), y 0..39 (top→bottom).
 *
 * TODO(real Gemini): have analyzeVisual() return a TactileScene built from the
 * model's multimodal reading of an arbitrary diagram/chart/map/figure.
 */

export const COLS = 60;
export const ROWS = 40;

export type SceneType =
  | "process"
  | "chart"
  | "geometry"
  | "graph"
  | "map"
  | "table";

export type Primitive =
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number }
  | { kind: "arrow"; x1: number; y1: number; x2: number; y2: number }
  | { kind: "disc"; cx: number; cy: number; r: number }
  | { kind: "ring"; cx: number; cy: number; r: number }
  | { kind: "rect"; x: number; y: number; w: number; h: number; fill?: boolean }
  | { kind: "texture"; x: number; y: number; w: number; h: number; step?: number }
  | { kind: "dots"; points: Array<[number, number]> };

export interface BrailleKeyEntry {
  mark: string;
  label: { en: string; ko: string };
}

export interface TactileScene {
  id: string;
  title: { en: string; ko: string };
  type: SceneType;
  primitives: Primitive[];
  /** Symbol → label legend, rendered as a braille key for the student. */
  brailleKey?: BrailleKeyEntry[];
}

/* ---- raster helpers ---------------------------------------------------- */

function blank(): number[][] {
  return Array.from({ length: ROWS }, () => new Array<number>(COLS).fill(0));
}
function set(g: number[][], x: number, y: number) {
  const xi = Math.round(x);
  const yi = Math.round(y);
  if (xi >= 0 && xi < COLS && yi >= 0 && yi < ROWS) g[yi][xi] = 1;
}
function line(g: number[][], x1: number, y1: number, x2: number, y2: number) {
  // Bresenham
  let x0 = Math.round(x1);
  let y0 = Math.round(y1);
  const xe = Math.round(x2);
  const ye = Math.round(y2);
  const dx = Math.abs(xe - x0);
  const dy = -Math.abs(ye - y0);
  const sx = x0 < xe ? 1 : -1;
  const sy = y0 < ye ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    set(g, x0, y0);
    if (x0 === xe && y0 === ye) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x0 += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y0 += sy;
    }
  }
}
function disc(g: number[][], cx: number, cy: number, r: number) {
  for (let y = cy - r; y <= cy + r; y++)
    for (let x = cx - r; x <= cx + r; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r * r) set(g, x, y);
    }
}
function ring(g: number[][], cx: number, cy: number, r: number) {
  for (let y = cy - r - 1; y <= cy + r + 1; y++)
    for (let x = cx - r - 1; x <= cx + r + 1; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (Math.abs(d - r) <= 0.6) set(g, x, y);
    }
}
function rect(
  g: number[][],
  x: number,
  y: number,
  w: number,
  h: number,
  fill = true
) {
  if (fill) {
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) set(g, xx, yy);
  } else {
    line(g, x, y, x + w - 1, y);
    line(g, x, y + h - 1, x + w - 1, y + h - 1);
    line(g, x, y, x, y + h - 1);
    line(g, x + w - 1, y, x + w - 1, y + h - 1);
  }
}
function texture(g: number[][], x: number, y: number, w: number, h: number, step = 2) {
  for (let yy = y; yy < y + h; yy++)
    for (let xx = x; xx < x + w; xx++) if ((xx + yy) % step === 0) set(g, xx, yy);
}
function arrow(g: number[][], x1: number, y1: number, x2: number, y2: number) {
  line(g, x1, y1, x2, y2);
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const len = 3;
  for (const off of [Math.PI - 0.5, Math.PI + 0.5]) {
    const bx = x2 + len * Math.cos(ang + off);
    const by = y2 + len * Math.sin(ang + off);
    line(g, x2, y2, bx, by);
  }
}

/* ---- renderer ---------------------------------------------------------- */

export function renderScene(scene: TactileScene): TactileGridData {
  const g = blank();
  for (const p of scene.primitives) {
    switch (p.kind) {
      case "line":
        line(g, p.x1, p.y1, p.x2, p.y2);
        break;
      case "arrow":
        arrow(g, p.x1, p.y1, p.x2, p.y2);
        break;
      case "disc":
        disc(g, p.cx, p.cy, p.r);
        break;
      case "ring":
        ring(g, p.cx, p.cy, p.r);
        break;
      case "rect":
        rect(g, p.x, p.y, p.w, p.h, p.fill ?? true);
        break;
      case "texture":
        texture(g, p.x, p.y, p.w, p.h, p.step ?? 2);
        break;
      case "dots":
        for (const [x, y] of p.points) set(g, x, y);
        break;
    }
  }
  return { cols: COLS, rows: ROWS, cells: g };
}

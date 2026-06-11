import type { LocalizedText, TactileGridData } from "@/types";

export const COLS = 60;
export const ROWS = 40;

export interface TactileObjectMeta {
  id: string;
  name: LocalizedText;
  /** Short uppercase label rendered on the braille line (English, Phase 2). */
  brailleLabel: string;
}

/** Panning order through the Water Cycle. */
export const OBJECT_SEQUENCE: TactileObjectMeta[] = [
  { id: "sun", name: { en: "Sun", ko: "태양" }, brailleLabel: "SUN" },
  { id: "water", name: { en: "Water", ko: "물" }, brailleLabel: "WATER" },
  { id: "evaporation", name: { en: "Evaporation arrow", ko: "증발 화살표" }, brailleLabel: "EVAPORATION" },
  { id: "cloud", name: { en: "Cloud", ko: "구름" }, brailleLabel: "CLOUD" },
  { id: "rain", name: { en: "Rain", ko: "비" }, brailleLabel: "RAIN" },
  { id: "river", name: { en: "River", ko: "강" }, brailleLabel: "RIVER" },
  { id: "cycle", name: { en: "Full cycle overview", ko: "전체 순환" }, brailleLabel: "CYCLE" },
];

export const OBJECT_COUNT = OBJECT_SEQUENCE.length;

/* ---------------------------------------------------------------------------
 * Grid helpers
 * ------------------------------------------------------------------------- */

function blank(): number[][] {
  return Array.from({ length: ROWS }, () => new Array<number>(COLS).fill(0));
}
function set(g: number[][], x: number, y: number) {
  const xi = Math.round(x);
  const yi = Math.round(y);
  if (xi >= 0 && xi < COLS && yi >= 0 && yi < ROWS) g[yi][xi] = 1;
}
function disc(g: number[][], cx: number, cy: number, r: number) {
  for (let y = cy - r; y <= cy + r; y++) {
    for (let x = cx - r; x <= cx + r; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r * r) set(g, x, y);
    }
  }
}
function rect(g: number[][], x0: number, y0: number, x1: number, y1: number) {
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) set(g, x, y);
}

/* ---------------------------------------------------------------------------
 * Object patterns — each is visibly distinct
 * ------------------------------------------------------------------------- */

function sunPattern(): number[][] {
  const g = blank();
  const cx = 49;
  const cy = 8;
  disc(g, cx, cy, 5);
  // eight rays
  const rays: Array<[number, number]> = [
    [0, -1], [0, 1], [-1, 0], [1, 0],
    [-1, -1], [1, -1], [-1, 1], [1, 1],
  ];
  for (const [dx, dy] of rays) {
    for (let t = 7; t <= 9; t++) set(g, cx + dx * t, cy + dy * t);
  }
  return g;
}

function waterPattern(): number[][] {
  const g = blank();
  rect(g, 0, 34, COLS - 1, 39); // body
  for (let x = 0; x < COLS; x++) {
    if (x % 4 < 2) set(g, x, 32); // wave crest
    if (x % 4 >= 2) set(g, x, 33);
  }
  return g;
}

function evaporationPattern(): number[][] {
  const g = blank();
  // arrowhead (points up)
  for (let y = 7; y <= 13; y++) {
    const w = y - 7;
    for (let x = 17 - w; x <= 17 + w; x++) set(g, x, y);
  }
  // shaft
  rect(g, 16, 14, 18, 33);
  return g;
}

function cloudPattern(): number[][] {
  const g = blank();
  disc(g, 33, 9, 6);
  disc(g, 26, 11, 4);
  disc(g, 41, 11, 4);
  rect(g, 26, 12, 41, 13); // flat base
  return g;
}

function rainPattern(): number[][] {
  const g = blank();
  const cols = [27, 31, 35, 39, 43];
  for (const c of cols) {
    for (let y = 16; y <= 31; y++) {
      if (y % 2 === 0) set(g, c + Math.floor((y - 16) / 4), y); // slanted dashes
    }
  }
  return g;
}

function riverPattern(): number[][] {
  const g = blank();
  for (let x = 0; x < COLS; x++) {
    const off = Math.round(2.4 * Math.sin(x / 5));
    set(g, x, 28 + off);
    set(g, x, 29 + off);
  }
  return g;
}

function cyclePattern(): number[][] {
  const g = blank();
  const cx = 30;
  const cy = 20;
  const rx = 24;
  const ry = 15;
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      const v = dx * dx + dy * dy;
      if (Math.abs(v - 1) < 0.16) set(g, x, y); // ring
    }
  }
  // arrowheads suggesting rotation (top-right, bottom-left)
  rect(g, 50, 6, 52, 9);
  rect(g, 8, 31, 10, 34);
  return g;
}

const PATTERNS: Record<string, () => number[][]> = {
  sun: sunPattern,
  water: waterPattern,
  evaporation: evaporationPattern,
  cloud: cloudPattern,
  rain: rainPattern,
  river: riverPattern,
  cycle: cyclePattern,
};

export function getMatrix(objectId: string): TactileGridData {
  const make = PATTERNS[objectId] ?? blank;
  return { cols: COLS, rows: ROWS, cells: make() };
}

export function emptyMatrix(): TactileGridData {
  return { cols: COLS, rows: ROWS, cells: blank() };
}

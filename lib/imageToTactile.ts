import type { TactileGridData } from "@/types";

/**
 * Client-side image → tactile conversion.
 *
 * Turns ANY uploaded image into a 60×40 raised-pin grid, entirely in the
 * browser (canvas) — no model, no API, works on the static site. This is the
 * "the image you uploaded, made touchable" step: change the image, the Dot Pad
 * output changes with it.
 *
 * Two modes:
 *  - "contrast": luminance threshold (best for diagrams/line art on a light
 *    background). Auto-inverts when the subject is light-on-dark.
 *  - "edges": Sobel gradient magnitude (best for photos / busy images — keeps
 *    outlines instead of filling large dark areas).
 *
 * Semantic object naming (sun, water, …) needs the optional AI vision step;
 * this converter handles shape/layout faithfully and the teacher labels objects
 * in the Tactile Builder.
 */

export const COLS = 60;
export const ROWS = 40;

export type ConvertMode = "contrast" | "edges";

export interface ImageTactileMeta {
  /** Fraction of raised pins, 0–1. */
  coverage: number;
  /** Rough count of distinct raised regions (connected components). */
  regions: number;
  /** Whether the contrast pass inverted polarity (light subject on dark bg). */
  inverted: boolean;
  mode: ConvertMode;
  sourceWidth: number;
  sourceHeight: number;
}

export interface ImageTactileResult {
  grid: TactileGridData;
  meta: ImageTactileMeta;
}

interface Options {
  mode?: ConvertMode;
  /** Sensitivity 0–1 (higher = more pins). Default 0.5. */
  sensitivity?: number;
}

type Source = CanvasImageSource & { width: number; height: number };

function loadSource(file: File): Promise<Source> {
  // Prefer createImageBitmap (fast, handles orientation); fall back to <img>.
  if (typeof window !== "undefined" && "createImageBitmap" in window) {
    return createImageBitmap(file).catch(() => loadViaImg(file));
  }
  return loadViaImg(file);
}

function loadViaImg(file: File): Promise<Source> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img as Source);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load image"));
    };
    img.src = url;
  });
}

function blank(): number[][] {
  return Array.from({ length: ROWS }, () => new Array<number>(COLS).fill(0));
}

/** Count connected raised regions (4-neighbour flood fill). Cheap on 60×40. */
function countRegions(cells: number[][]): number {
  const seen = Array.from({ length: ROWS }, () => new Array<boolean>(COLS).fill(false));
  let regions = 0;
  const stack: Array<[number, number]> = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (!cells[y][x] || seen[y][x]) continue;
      regions += 1;
      stack.length = 0;
      stack.push([x, y]);
      seen[y][x] = true;
      while (stack.length) {
        const [cx, cy] = stack.pop()!;
        const nb: Array<[number, number]> = [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]];
        for (const [nx, ny] of nb) {
          if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS && cells[ny][nx] && !seen[ny][nx]) {
            seen[ny][nx] = true;
            stack.push([nx, ny]);
          }
        }
      }
    }
  }
  return regions;
}

/** Sample the source into a 60×40 luminance grid (0–1). */
function sampleLuminance(source: Source): number[][] {
  const canvas = document.createElement("canvas");
  canvas.width = COLS;
  canvas.height = ROWS;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  // White backdrop so transparent PNGs read as light background.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, COLS, ROWS);
  // The browser box-filters when downscaling, giving us averaged cells.
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(source, 0, 0, COLS, ROWS);
  const { data } = ctx.getImageData(0, 0, COLS, ROWS);
  const lum: number[][] = blank();
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const i = (y * COLS + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      lum[y][x] = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    }
  }
  return lum;
}

function mean(grid: number[][]): number {
  let s = 0;
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) s += grid[y][x];
  return s / (COLS * ROWS);
}

function coverageOf(cells: number[][]): number {
  let n = 0;
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) n += cells[y][x];
  return n / (COLS * ROWS);
}

function contrastPass(lum: number[][], sensitivity: number): { cells: number[][]; inverted: boolean } {
  const m = mean(lum);
  // Higher sensitivity → threshold closer to the mean → more pins.
  const offset = 0.28 - sensitivity * 0.24;
  // Adapt to polarity: dark ink on a light background (mean high) raises the
  // dark pixels; light subject on a dark background (mean low) raises the light
  // pixels. This keeps the subject — not the background — as the raised pins.
  const darkBackground = m < 0.5;
  const cells = blank();
  if (darkBackground) {
    const thr = m + offset;
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) cells[y][x] = lum[y][x] > thr ? 1 : 0;
  } else {
    const thr = m - offset;
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) cells[y][x] = lum[y][x] < thr ? 1 : 0;
  }
  let inverted = darkBackground;
  // Safety: if the raised area still fills most of the field, flip it.
  if (coverageOf(cells) > 0.6) {
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) cells[y][x] = cells[y][x] ? 0 : 1;
    inverted = !inverted;
  }
  return { cells, inverted };
}

function edgePass(lum: number[][], sensitivity: number): number[][] {
  const cells = blank();
  const thr = 0.45 - sensitivity * 0.3; // higher sensitivity → lower threshold → more edges
  for (let y = 1; y < ROWS - 1; y++) {
    for (let x = 1; x < COLS - 1; x++) {
      const gx =
        -lum[y - 1][x - 1] - 2 * lum[y][x - 1] - lum[y + 1][x - 1] +
        lum[y - 1][x + 1] + 2 * lum[y][x + 1] + lum[y + 1][x + 1];
      const gy =
        -lum[y - 1][x - 1] - 2 * lum[y - 1][x] - lum[y - 1][x + 1] +
        lum[y + 1][x - 1] + 2 * lum[y + 1][x] + lum[y + 1][x + 1];
      const mag = Math.hypot(gx, gy);
      cells[y][x] = mag > thr ? 1 : 0;
    }
  }
  return cells;
}

/** Convert an already-loaded image source to a tactile grid. */
export function sourceToTactileGrid(source: Source, opts: Options = {}): ImageTactileResult {
  const mode: ConvertMode = opts.mode ?? "contrast";
  const sensitivity = Math.min(1, Math.max(0, opts.sensitivity ?? 0.5));
  const lum = sampleLuminance(source);

  let cells: number[][];
  let inverted = false;
  if (mode === "edges") {
    cells = edgePass(lum, sensitivity);
  } else {
    const r = contrastPass(lum, sensitivity);
    cells = r.cells;
    inverted = r.inverted;
  }

  return {
    grid: { cols: COLS, rows: ROWS, cells },
    meta: {
      coverage: coverageOf(cells),
      regions: countRegions(cells),
      inverted,
      mode,
      sourceWidth: source.width,
      sourceHeight: source.height,
    },
  };
}

/** Load a File and convert it to a tactile grid. */
export async function fileToTactileGrid(file: File, opts: Options = {}): Promise<ImageTactileResult> {
  const source = await loadSource(file);
  return sourceToTactileGrid(source, opts);
}

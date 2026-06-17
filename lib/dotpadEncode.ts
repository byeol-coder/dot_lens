import type { TactileGridData } from "@/types";
import { translate } from "@/lib/brailleEngine";

/**
 * Encoders that turn the app's output into Dot Pad SDK hex payloads.
 *
 * Graphic area: `numberCellRows × numberCellColumns` cells (default 10 × 30 →
 * 60×40 pins), each cell one byte = a 2-wide × 4-tall dot block. The SDK sends
 * GraphicMode bytes to the firmware as-is, so we pre-apply the SDK's own
 * braille→graphic bit reordering here (mirrored from DotPadSDK
 * `brailleToGraphic`). All-up therefore encodes to "FF"×cells, matching the
 * SDK's `displayAllUp`.
 *
 * Text line: braille-order bytes (dot1 = MSB … dot8 = LSB); the SDK applies the
 * braille→graphic reordering itself for TextMode.
 *
 * Dot layout in a cell (standard 8-dot braille):
 *   d1 d4      (lx,ly):  d1=(0,0) d4=(1,0)
 *   d2 d5                d2=(0,1) d5=(1,1)
 *   d3 d6                d3=(0,2) d6=(1,2)
 *   d7 d8                d7=(0,3) d8=(1,3)
 */

const hex2 = (n: number) => (n & 0xff).toString(16).toUpperCase().padStart(2, "0");

/** Mirror of DotPadSDK brailleToGraphic for a single byte (MSB = dot1). */
export function brailleByteToGraphic(b: number): number {
  const bit = (i: number) => (b >> (7 - i)) & 1; // i = 0..7, MSB first
  const g = [bit(0), bit(2), bit(3), bit(4), bit(1), bit(5), bit(6), bit(7)];
  let out = 0;
  for (let i = 0; i < 8; i++) out |= g[i] << (7 - i);
  return out;
}

export function gridToGraphicHex(grid: TactileGridData, devCols = 30, devRows = 10): string {
  const targetW = devCols * 2;
  const targetH = devRows * 4;
  const sx = grid.cols / targetW;
  const sy = grid.rows / targetH;
  const px = (tx: number, ty: number): number => {
    const gx = Math.min(grid.cols - 1, Math.floor(tx * sx));
    const gy = Math.min(grid.rows - 1, Math.floor(ty * sy));
    const row = grid.cells[gy];
    return row && row[gx] ? 1 : 0;
  };

  let hex = "";
  for (let cr = 0; cr < devRows; cr++) {
    for (let cc = 0; cc < devCols; cc++) {
      const x0 = cc * 2;
      const y0 = cr * 4;
      const d1 = px(x0, y0), d2 = px(x0, y0 + 1), d3 = px(x0, y0 + 2), d7 = px(x0, y0 + 3);
      const d4 = px(x0 + 1, y0), d5 = px(x0 + 1, y0 + 1), d6 = px(x0 + 1, y0 + 2), d8 = px(x0 + 1, y0 + 3);
      const brailleByte =
        (d1 << 7) | (d2 << 6) | (d3 << 5) | (d4 << 4) | (d5 << 3) | (d6 << 2) | (d7 << 1) | d8;
      hex += hex2(brailleByteToGraphic(brailleByte));
    }
  }
  return hex;
}

/** Braille cells (dot numbers 1–8) → text-line hex (braille order). */
export function brailleCellsToHex(cells: number[][], cellCount = 20): string {
  let hex = "";
  for (let i = 0; i < cellCount; i++) {
    const dots = cells[i] ?? [];
    let b = 0;
    for (const d of dots) if (d >= 1 && d <= 8) b |= 1 << (8 - d); // d1 → bit7 … d8 → bit0
    hex += hex2(b);
  }
  return hex;
}

export function textToTextHex(text: string, lang: "en" | "ko" = "en", cellCount = 20): string {
  const { cells } = translate(text || "", lang);
  return brailleCellsToHex(cells, cellCount);
}

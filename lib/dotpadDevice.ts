import type { TactileGridData } from "@/types";
import { gridToGraphicHex, textToTextHex } from "@/lib/dotpadEncode";

/**
 * Real Dot Pad device seam.
 *
 * The app produces a 60×40 pin grid + a braille line; `lib/dotpadEncode.ts`
 * turns those into Dot Pad SDK hex payloads. This module owns the connection
 * state and mirrors each on-screen frame to the device through a registered
 * binding. The binding itself (which calls the Dot Inc Web SDK) is provided by
 * an external bridge — see public/dotpad-sdk-bridge.js — via
 * `window.registerDotPad(...)`. No SDK is bundled into the app.
 *
 * Until a binding registers, everything stays an on-screen simulation.
 */

export interface DeviceProfile {
  name: string;
  /** Graphic area cell columns (pins wide = ×2). Default 30 → 60 pins. */
  graphicCols: number;
  /** Graphic area cell rows (pins tall = ×4). Default 10 → 40 pins. */
  graphicRows: number;
  /** Braille line cell count. Default 20. */
  brailleCells: number;
}

export interface DotPadBinding {
  connect: () => Promise<DeviceProfile>;
  disconnect: () => Promise<void>;
  /** Send a graphic-area hex payload (GraphicMode, device-native bytes). */
  showGraphicHex: (hex: string) => void;
  /** Send a braille-line hex payload (TextMode, braille-order bytes). */
  showTextHex: (hex: string) => void;
}

let binding: DotPadBinding | null = null;
let profile: DeviceProfile | null = null;
let connected = false;
const subs = new Set<() => void>();

function notify() {
  subs.forEach((f) => f());
}

/** Called by the external SDK bridge to make a real device available. */
export function registerDotPad(b: DotPadBinding | null): void {
  binding = b;
  if (!b) {
    connected = false;
    profile = null;
  }
  notify();
}

export function hasRealDotPad(): boolean {
  return binding !== null;
}
export function isDeviceConnected(): boolean {
  return connected;
}
export function deviceName(): string {
  return profile?.name ?? "";
}

export function subscribeDotPad(cb: () => void): () => void {
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
}

/** Open the device picker + connect via the registered binding. */
export async function connectDevice(): Promise<boolean> {
  if (!binding) return false;
  const p = await binding.connect();
  profile = {
    name: p.name || "Dot Pad",
    graphicCols: p.graphicCols || 30,
    graphicRows: p.graphicRows || 10,
    brailleCells: p.brailleCells || 20,
  };
  connected = true;
  notify();
  return true;
}

export async function disconnectDevice(): Promise<void> {
  try {
    await binding?.disconnect();
  } catch {
    /* ignore */
  }
  connected = false;
  notify();
}

/** Mirror the current frame to the device, if connected. Best-effort. */
export function deviceShow(grid: TactileGridData, text: string, lang: "en" | "ko" = "en"): void {
  if (!binding || !connected) return;
  const cols = profile?.graphicCols ?? 30;
  const rows = profile?.graphicRows ?? 10;
  const cells = profile?.brailleCells ?? 20;
  try {
    binding.showGraphicHex(gridToGraphicHex(grid, cols, rows));
    binding.showTextHex(textToTextHex(text, lang, cells));
  } catch {
    /* device write failed — the on-screen demo continues unaffected */
  }
}

/** Expose window.registerDotPad so the external bridge can register the SDK. */
export function exposeGlobalRegistrar(): void {
  if (typeof window === "undefined") return;
  (window as unknown as { registerDotPad?: typeof registerDotPad }).registerDotPad = registerDotPad;
}

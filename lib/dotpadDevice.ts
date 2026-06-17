import type { TactileGridData } from "@/types";

/**
 * Real Dot Pad device seam.
 *
 * The app already produces device-shaped output (a 60×40 `TactileGridData` pin
 * grid + a braille line). This module is the single integration point where the
 * Dot Inc Web SDK is plugged in: register a `DotPadBinding` and the explorer /
 * simulator mirror their on-screen output to the physical device.
 *
 * It is SDK-agnostic on purpose — the app bundles no SDK. An external bridge
 * script (see public/dotpad-sdk-bridge.example.js) loads the Dot Inc Web SDK and
 * calls `window.registerDotPad({...})`, mapping the SDK's methods to this
 * binding. Until a binding is registered, everything stays an on-screen
 * simulation (no false "connected" state).
 */

export interface DotPadBinding {
  /** Open a connection to the device; returns its display name. */
  connect: () => Promise<{ name: string }>;
  disconnect: () => Promise<void>;
  /** Render a 60×40 raised-pin grid on the device's graphic area. */
  showGraphic: (grid: TactileGridData) => void | Promise<void>;
  /** Render text on the refreshable braille line. */
  showText: (text: string) => void | Promise<void>;
}

let binding: DotPadBinding | null = null;
const subs = new Set<() => void>();

/** Called by the external SDK bridge to make a real device available. */
export function registerDotPad(b: DotPadBinding | null): void {
  binding = b;
  subs.forEach((f) => f());
}

export function getDotPad(): DotPadBinding | null {
  return binding;
}

export function hasRealDotPad(): boolean {
  return binding !== null;
}

/** Subscribe to availability changes (a bridge registering/unregistering). */
export function subscribeDotPad(cb: () => void): () => void {
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
}

/** Mirror the current frame to the device, if one is registered. Best-effort. */
export async function deviceShow(grid: TactileGridData, text: string): Promise<void> {
  if (!binding) return;
  try {
    await binding.showGraphic(grid);
    await binding.showText(text);
  } catch {
    /* device write failed — the on-screen demo continues unaffected */
  }
}

/**
 * Expose `window.registerDotPad` so an external bridge <script> can register the
 * Dot Inc Web SDK without it being bundled into the app.
 */
export function exposeGlobalRegistrar(): void {
  if (typeof window === "undefined") return;
  (window as unknown as { registerDotPad?: typeof registerDotPad }).registerDotPad = registerDotPad;
}

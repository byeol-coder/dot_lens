/**
 * Multi-Dot Pad fleet — manage up to 5 devices for classroom / demo use.
 *
 * Real hardware isn't required: a MockDotPadAdapter simulates 1/3/5 devices so
 * field demos work without physical units. The store is adapter-backed, so a
 * real Dot Pad SDK adapter can be injected later (`setFleetAdapter`) without
 * changing the UI.
 */

import { gridToGraphicHex, textToTextHex } from "@/lib/dotpadEncode";
import { getMatrix } from "@/lib/tactileMatrix";

export const MAX_DEVICES = 5;

export type DotPadConnectionStatus =
  | "connected"
  | "not_connected"
  | "connecting"
  | "syncing"
  | "ready"
  | "error"
  | "demo";

export interface DotPadDevice {
  id: string;
  label: string;
  assignedStudent?: string;
  status: DotPadConnectionStatus;
  currentLessonId?: string;
  currentStep?: number;
  totalSteps?: number;
  lastSyncedAt?: string;
  errorMessage?: string;
  isDemoDevice?: boolean;
}

export interface TactileFrame {
  cols: number;
  rows: number;
  cells: number[][];
}

/** Pluggable transport — swap MockDotPadAdapter for a real SDK adapter later. */
export interface DotPadAdapter {
  connect(deviceId: string): Promise<void>;
  disconnect(deviceId: string): Promise<void>;
  sendTactileFrame(deviceId: string, frame: TactileFrame): Promise<void>;
  sendBrailleLine(deviceId: string, text: string): Promise<void>;
  testOutput(deviceId: string): Promise<void>;
}

/* ── store ────────────────────────────────────────────────────────────────── */

let devices: DotPadDevice[] = [];
const subs = new Set<() => void>();
function emit() {
  subs.forEach((f) => f());
}
export function subscribeFleet(cb: () => void): () => void {
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
}
export function getDevices(): DotPadDevice[] {
  return devices;
}
function patch(id: string, p: Partial<DotPadDevice>) {
  devices = devices.map((d) => (d.id === id ? { ...d, ...p } : d));
  emit();
}

const STUDENTS = ["Student A", "Student B", "Student C", "Student D", "Student E"];
const nowIso = () => new Date().toISOString();

/** Per-step tactile frames pushed to real devices on start / next / reset. */
const STEP_OBJECTS = ["sun", "cloud", "rain", "cycle"];

/* ── mock adapter ─────────────────────────────────────────────────────────── */

export const MockDotPadAdapter: DotPadAdapter = {
  async connect(id) {
    patch(id, { status: "connecting", errorMessage: undefined });
    await wait(500);
    patch(id, { status: "ready" });
  },
  async disconnect(id) {
    patch(id, { status: "not_connected", currentStep: undefined });
  },
  async sendTactileFrame(id) {
    patch(id, { status: "syncing" });
    await wait(450);
    patch(id, { status: "ready", lastSyncedAt: nowIso() });
  },
  async sendBrailleLine() {
    /* mock: no-op */
  },
  async testOutput(id) {
    const prev = devices.find((d) => d.id === id)?.status ?? "ready";
    patch(id, { status: "syncing" });
    await wait(400);
    patch(id, { status: prev === "demo" ? "demo" : "ready" });
  },
};

let adapter: DotPadAdapter = MockDotPadAdapter;
export function setFleetAdapter(a: DotPadAdapter) {
  adapter = a;
}

/* ── real SDK fleet adapter (injected by the bridge) ──────────────────────── */

/**
 * Multi-device transport backed by the Dot Inc Web SDK. The bridge registers
 * this (via window.registerDotPadFleet) so up to 5 real Dot Pads can be added,
 * each tracked by an id the bridge maps to an SDK DotDevice handle.
 */
export interface FleetSdkAdapter {
  connectNew(): Promise<{ id: string; name: string; graphicCols: number; graphicRows: number; brailleCells: number }>;
  disconnect(id: string): Promise<void>;
  showGraphicHex(id: string, hex: string): void;
  showTextHex(id: string, hex: string): void;
  testOutput(id: string): void;
}

let sdk: FleetSdkAdapter | null = null;
const dims = new Map<string, { cols: number; rows: number; cells: number }>();

export function registerFleetSdk(a: FleetSdkAdapter | null): void {
  sdk = a;
  emit();
}
export function hasFleetSdk(): boolean {
  return sdk !== null;
}
/** Expose the registrar so the external bridge can inject the real SDK adapter. */
export function exposeFleetRegistrar(): void {
  if (typeof window === "undefined") return;
  (window as unknown as { registerDotPadFleet?: typeof registerFleetSdk }).registerDotPadFleet = registerFleetSdk;
}

/** Connect a real Dot Pad (opens the BLE picker) and add it to the fleet. */
export async function connectRealDotPad(): Promise<boolean> {
  if (!sdk || devices.length >= MAX_DEVICES) return false;
  try {
    const meta = await sdk.connectNew();
    dims.set(meta.id, { cols: meta.graphicCols || 30, rows: meta.graphicRows || 10, cells: meta.brailleCells || 20 });
    devices = [
      ...devices,
      {
        id: meta.id,
        label: meta.name || `Dot Pad ${devices.length + 1}`,
        assignedStudent: STUDENTS[devices.length],
        status: "ready",
        currentStep: 1,
        totalSteps: 4,
      },
    ];
    emit();
    return true;
  } catch {
    return false;
  }
}

function wait(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

/* ── lifecycle ────────────────────────────────────────────────────────────── */

function makeDevice(i: number, status: DotPadConnectionStatus, demo: boolean): DotPadDevice {
  return {
    id: `dp-${i}`,
    label: `Dot Pad ${i}`,
    assignedStudent: STUDENTS[i - 1],
    status,
    currentStep: status === "not_connected" ? undefined : 1,
    totalSteps: 4,
    isDemoDevice: demo,
  };
}

/** Populate the fleet with a simulated set (1, 3, or 5 devices). */
export function simulateFleet(n: 1 | 3 | 5): void {
  const pattern: DotPadConnectionStatus[] =
    n === 1
      ? ["ready"]
      : n === 3
      ? ["ready", "ready", "syncing"]
      : ["ready", "ready", "syncing", "demo", "not_connected"];
  devices = pattern.map((s, idx) => makeDevice(idx + 1, s, s === "demo"));
  emit();
}

export function clearFleet(): void {
  devices = [];
  emit();
}

export async function connectDotPad(id: string): Promise<void> {
  await adapter.connect(id);
}
export async function disconnectDotPad(id: string): Promise<void> {
  if (sdk && dims.has(id)) {
    try {
      await sdk.disconnect(id);
    } catch {
      /* ignore */
    }
    dims.delete(id);
    patch(id, { status: "not_connected", currentStep: undefined });
    return;
  }
  await adapter.disconnect(id);
}
export async function reconnectDotPad(id: string): Promise<void> {
  patch(id, { status: "connecting", errorMessage: undefined });
  await adapter.connect(id);
}
export async function testTactileOutput(id: string): Promise<void> {
  const dim = dims.get(id);
  if (sdk && dim) {
    sdk.testOutput(id);
    patch(id, { lastSyncedAt: nowIso() });
    return;
  }
  await adapter.testOutput(id);
}
export function setDeviceDemoMode(id: string): void {
  patch(id, { status: "demo", isDemoDevice: true });
}
export function removeDevice(id: string): void {
  devices = devices.filter((d) => d.id !== id);
  emit();
}

export async function syncLessonToDevice(id: string, lessonId: string): Promise<void> {
  patch(id, { currentLessonId: lessonId });
  const dim = dims.get(id);
  if (sdk && dim) {
    patch(id, { status: "syncing" });
    const grid = getMatrix("cycle");
    sdk.showGraphicHex(id, gridToGraphicHex(grid, dim.cols, dim.rows));
    sdk.showTextHex(id, textToTextHex("lesson", "en", dim.cells));
    patch(id, { status: "ready", lastSyncedAt: nowIso() });
    return;
  }
  await adapter.sendTactileFrame(id, { cols: 60, rows: 40, cells: [] });
}
export async function syncLessonToAllDevices(lessonId: string): Promise<void> {
  await Promise.all(
    devices.filter((d) => d.status !== "not_connected").map((d) => syncLessonToDevice(d.id, lessonId))
  );
}

/* ── global controls ──────────────────────────────────────────────────────── */

/** Push the frame for `step` to a real device (no-op for simulated devices). */
function pushStepFrame(id: string, step: number): void {
  const dim = dims.get(id);
  if (!sdk || !dim) return;
  const obj = STEP_OBJECTS[Math.max(0, Math.min(STEP_OBJECTS.length - 1, step - 1))];
  sdk.showGraphicHex(id, gridToGraphicHex(getMatrix(obj), dim.cols, dim.rows));
  sdk.showTextHex(id, textToTextHex(obj, "en", dim.cells));
}

export function startLessonForAll(): void {
  devices = devices.map((d) => (d.status === "not_connected" ? d : { ...d, currentStep: 1, status: "ready" }));
  devices.forEach((d) => d.status !== "not_connected" && pushStepFrame(d.id, 1));
  emit();
}
export function pauseAll(): void {
  devices = devices.map((d) => (d.status === "ready" ? { ...d, status: "connected" } : d));
  emit();
}
export function nextStepForAll(): void {
  devices = devices.map((d) =>
    d.status === "not_connected"
      ? d
      : { ...d, currentStep: Math.min((d.totalSteps ?? 4), (d.currentStep ?? 1) + 1) }
  );
  devices.forEach((d) => d.status !== "not_connected" && pushStepFrame(d.id, d.currentStep ?? 1));
  emit();
}
export function resetAllDevices(): void {
  devices = devices.map((d) => (d.status === "not_connected" ? d : { ...d, currentStep: 1, status: "ready" }));
  devices.forEach((d) => d.status !== "not_connected" && pushStepFrame(d.id, 1));
  emit();
}
export function disconnectAll(): void {
  devices = devices.map((d) => ({ ...d, status: "not_connected", currentStep: undefined }));
  emit();
}

/** Inject a connection failure on one device (for demoing error handling). */
export function simulateError(id: string, message: string): void {
  patch(id, { status: "error", errorMessage: message });
}

/* ── summary ──────────────────────────────────────────────────────────────── */

export interface FleetSummary {
  total: number;
  connected: number; // anything not 'not_connected'/'error'
  ready: number;
  needsAttention: number; // error or not_connected
}
export function fleetSummary(): FleetSummary {
  const total = devices.length;
  const ready = devices.filter((d) => d.status === "ready" || d.status === "demo").length;
  const connected = devices.filter((d) => d.status !== "not_connected" && d.status !== "error").length;
  const needsAttention = devices.filter((d) => d.status === "error" || d.status === "not_connected").length;
  return { total, connected, ready, needsAttention };
}

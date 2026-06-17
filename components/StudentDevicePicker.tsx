"use client";

import { useEffect, useState } from "react";
import {
  getDevices,
  subscribeFleet,
  simulateFleet,
  type DotPadDevice,
  type DotPadConnectionStatus,
} from "@/lib/dotpadFleet";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const STATUS_LABEL: Record<DotPadConnectionStatus, { en: string; ko: string; glyph: string }> = {
  ready: { en: "Ready", ko: "준비됨", glyph: "✓" },
  connected: { en: "Connected", ko: "연결됨", glyph: "●" },
  connecting: { en: "Connecting", ko: "연결 중", glyph: "⟳" },
  syncing: { en: "Syncing", ko: "동기화 중", glyph: "⟳" },
  demo: { en: "Demo mode", ko: "데모 모드", glyph: "◐" },
  error: { en: "Error", ko: "오류", glyph: "⚠" },
  not_connected: { en: "Not connected", ko: "연결 안 됨", glyph: "○" },
};

/**
 * Lets a teacher pick which student / Dot Pad the on-screen demo represents.
 * Works with simulated fleets so it's usable with no hardware.
 */
export function StudentDevicePicker() {
  const { lang } = useLang();
  const L = (en: string, ko: string) => (lang === "ko" ? ko : en);
  const [devices, setDevices] = useState<DotPadDevice[]>(getDevices());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => subscribeFleet(() => setDevices([...getDevices()])), []);

  const selected = devices.find((d) => d.id === selectedId) ?? null;

  if (devices.length === 0) {
    return (
      <div className="mb-6 rounded-2xl border border-line bg-surface p-4 shadow-card">
        <p className="eyebrow">{L("Choose a student / Dot Pad", "학생 / Dot Pad 선택")}</p>
        <p className="mt-1 text-[13px] text-muted">
          {L(
            "No Dot Pads connected. Simulate a classroom set to pick a student, or just try the keyboard demo below — no device needed.",
            "연결된 Dot Pad가 없습니다. 교실 세트를 시뮬레이션해 학생을 고르거나, 아래 키보드 데모를 바로 체험하세요 — 기기 불필요."
          )}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {[1, 3, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => simulateFleet(n as 1 | 3 | 5)}
              className="rounded-lg border border-accent bg-surface px-3 py-1.5 text-[12.5px] font-semibold text-accent hover:bg-accent-tint"
            >
              {L(`Simulate ${n} Dot Pad${n > 1 ? "s" : ""}`, `Dot Pad ${n}대 시뮬레이션`)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl border border-line bg-surface p-4 shadow-card">
      <p className="eyebrow">{L("Choose a student / Dot Pad", "학생 / Dot Pad 선택")}</p>
      <ul className="mt-3 flex flex-wrap gap-2" role="listbox" aria-label={L("Students and Dot Pads", "학생 및 Dot Pad")}>
        {devices.map((d) => {
          const s = STATUS_LABEL[d.status];
          const active = d.id === selectedId;
          return (
            <li key={d.id}>
              <button
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => setSelectedId(d.id)}
                className={cn(
                  "rounded-xl border px-3 py-2 text-left text-[13px] transition-colors",
                  active ? "border-accent bg-accent-tint text-accent" : "border-line hover:bg-surface-sunk"
                )}
              >
                <span className="block font-medium text-ink">
                  {d.assignedStudent ? `${d.assignedStudent} · ` : ""}{d.label}
                </span>
                <span className="font-mono text-[10.5px] text-faint">
                  <span aria-hidden>{s.glyph}</span> {L(s.en, s.ko)}
                  {d.status !== "not_connected" && ` · ${L(`Step ${d.currentStep ?? 1}/${d.totalSteps ?? 4}`, `${d.currentStep ?? 1}/${d.totalSteps ?? 4}단계`)}`}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {selected && (
        <p className="mt-3 rounded-xl bg-surface-sunk px-3 py-2 text-[12.5px] text-ink" role="status" aria-live="polite">
          {L(
            `Now previewing ${selected.assignedStudent ?? "this student"}'s session on ${selected.label}. The keyboard demo below mirrors what this student feels.`,
            `${selected.assignedStudent ?? "이 학생"}의 세션을 ${selected.label}에서 미리보기 중입니다. 아래 키보드 데모가 이 학생이 느끼는 내용을 보여줍니다.`
          )}
        </p>
      )}
    </div>
  );
}

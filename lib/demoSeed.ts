import type { LocalizedText } from "@/types";
import {
  buildFromTemplate,
  saveCustomLesson,
  reviewCustomLesson,
  addFeedback,
  listCustomLessons,
} from "@/lib/customLessons";
import { getEvents, seedEvents, type TelemetryEvent } from "@/lib/telemetry";

/**
 * Demo seeding — make every screen presentable on first visit.
 *
 * On the very first load (when nothing is stored yet) we drop in a few sample
 * teacher-built lessons across subjects with mixed review states, plus a small
 * spread of telemetry so the monitoring scorecard reads as a live program.
 * Runs once (guarded by a flag) and never clobbers a user's own data.
 */

const SEED_FLAG = "dotlens.seeded.v1";
const L = (en: string, ko: string): LocalizedText => ({ en, ko });

function seedLessons() {
  // 1) Right triangle — reviewed & approved, with feedback.
  const tri = buildFromTemplate("triangle");
  tri.title = L("Right triangle — sides & angle", "직각삼각형 — 변과 각");
  tri.subject = L("Math", "수학");
  tri.gradeLevel = L("Middle", "중등");
  tri.summary = L(
    "A right triangle: a flat base, a vertical height, and a slanted hypotenuse.",
    "직각삼각형 — 평평한 밑변, 수직 높이, 비스듬한 빗변."
  );
  saveCustomLesson({ ...tri, status: "ready" });
  reviewCustomLesson(tri.id, "approved", "J. Han (TVI)", L(
    "Reads cleanly for middle grade. Approved.",
    "중등 수준에서 자연스럽게 읽힘. 승인."
  ));
  addFeedback(tri.id, { author: "Asha", role: "field staff", message: "Students located the right angle quickly by touch." });

  // 2) Bar chart — published, awaiting review, with a teacher question.
  const bar = buildFromTemplate("barchart");
  bar.title = L("Monthly rainfall — bar chart", "월별 강수량 — 막대그래프");
  bar.subject = L("Math", "수학");
  bar.gradeLevel = L("Elementary", "초등");
  bar.summary = L("Four bars on an axis; the fourth is tallest, the third shortest.", "축 위의 막대 4개 — 네 번째가 가장 높고 세 번째가 가장 낮아요.");
  saveCustomLesson({ ...bar, status: "ready" });
  addFeedback(bar.id, { author: "Mr. Park", role: "teacher", message: "Could the axis labels be in braille too?" });

  // 3) Photosynthesis flow — still a draft.
  const proc = buildFromTemplate("process");
  proc.title = L("Photosynthesis — 3 steps", "광합성 — 3단계");
  proc.subject = L("Science", "과학");
  proc.gradeLevel = L("Elementary", "초등");
  const names: LocalizedText[] = [
    L("Sunlight in", "빛 흡수"),
    L("Water + CO₂", "물·이산화탄소"),
    L("Sugar + O₂", "당·산소"),
  ];
  proc.objects = proc.objects.map((o, i) =>
    names[i] ? { ...o, name: names[i], brailleLabel: names[i].en } : o
  );
  proc.summary = L("Three steps flow left to right, joined by arrows.", "세 단계가 화살표로 이어져 왼쪽에서 오른쪽으로 흐릅니다.");
  saveCustomLesson({ ...proc, status: "draft" });
}

function seedTelemetry() {
  const now = Date.now();
  let n = 0;
  const ev = (
    type: TelemetryEvent["type"],
    daysAgo: number,
    props: TelemetryEvent["props"] = {}
  ): TelemetryEvent => ({
    id: `seed-${type}-${n++}`,
    type,
    at: new Date(now - daysAgo * 86_400_000 - (n % 7) * 3_600_000).toISOString(),
    props,
  });

  const events: TelemetryEvent[] = [];
  [4, 4, 3, 2, 1, 0].forEach((d) => events.push(ev("lesson_published", d)));      // 6 ≥ target 5
  [3, 2, 1].forEach((d) => events.push(ev("lesson_reviewed", d, { decision: "approved" }))); // 3 ≥ target 3
  [4, 3, 3, 2, 2, 1, 1, 0].forEach((d) => events.push(ev("lesson_explored", d)));  // 8 < target 10 (shows "below")
  ([[4, 5], [3, 5], [3, 4], [5, 5], [4, 5], [5, 6]] as Array<[number, number]>).forEach(
    ([s, t], i) => events.push(ev("quiz_completed", (i % 4), { score: s, total: t })) // avg ≈ 0.80 ≥ 0.7
  );
  [4, 2].forEach((d) => events.push(ev("feedback_submitted", d, { role: "teacher" })));
  events.push(ev("pack_uploaded", 3, { code: "mr" }));
  [4, 2].forEach((d) => events.push(ev("lesson_created", d)));
  events.push(ev("error", 3, { where: "demo", message: "sample error" }));         // ~1/29 ≈ 3% ≤ 5%

  seedEvents(events);
}

export function seedDemoData(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.localStorage.getItem(SEED_FLAG)) return;
    if (listCustomLessons().length === 0) seedLessons();
    if (getEvents().length === 0) seedTelemetry();
    window.localStorage.setItem(SEED_FLAG, "1");
  } catch {
    /* seeding is best-effort */
  }
}

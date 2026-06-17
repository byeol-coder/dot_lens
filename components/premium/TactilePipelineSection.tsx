"use client";

import { SectionHeading } from "@/components/premium/cards";
import { cn } from "@/lib/cn";
import { useLang } from "@/lib/i18n";

interface Stage {
  step: string;
  title: { en: string; ko: string };
  body: { en: string; ko: string };
  motif: "scan" | "analyze" | "tactile";
}

const STAGES: Stage[] = [
  {
    step: "01",
    title: { en: "Scan the material", ko: "자료 스캔" },
    body: {
      en: "A teacher attaches any Classroom diagram. Dot Lens reads it on the Chromebook.",
      ko: "교사가 수업 자료를 첨부하면 닷 렌즈가 Chromebook에서 바로 읽어냅니다.",
    },
    motif: "scan",
  },
  {
    step: "02",
    title: { en: "Dot Lens analyzes", ko: "닷 렌즈 분석" },
    body: {
      en: "Objects, relationships, and flow are detected, then sequenced for learning.",
      ko: "객체·관계·흐름을 감지하고 학습에 최적화된 순서로 재구성합니다.",
    },
    motif: "analyze",
  },
  {
    step: "03",
    title: { en: "Tactile + braille out", ko: "촉각 + 점자 출력" },
    body: {
      en: "A 60×40 tactile graphic and reviewed braille reach the student's Dot Pad.",
      ko: "60×40 촉각 그래픽과 검수된 점자가 학생의 Dot Pad에 전달됩니다.",
    },
    motif: "tactile",
  },
];

function Motif({ kind }: { kind: Stage["motif"] }) {
  if (kind === "scan") {
    return (
      <div className="relative h-24 overflow-hidden rounded-xl border border-line bg-surface-sunk pin-texture-dense" aria-hidden>
        <div className="absolute inset-x-0 top-0 h-6 animate-scan-sweep bg-gradient-to-b from-brand-cyan/40 to-transparent" />
      </div>
    );
  }
  if (kind === "analyze") {
    return (
      <div className="relative grid h-24 place-items-center rounded-xl border border-line bg-surface-sunk" aria-hidden>
        <svg viewBox="0 0 160 80" className="h-full w-full">
          <line x1="30" y1="40" x2="80" y2="20" stroke="#4B79E6" strokeWidth="1.5" />
          <line x1="30" y1="40" x2="80" y2="60" stroke="#22C3DA" strokeWidth="1.5" />
          <line x1="80" y1="20" x2="130" y2="40" stroke="#22B07D" strokeWidth="1.5" />
          <line x1="80" y1="60" x2="130" y2="40" stroke="#4B79E6" strokeWidth="1.5" />
          {[[30, 40], [80, 20], [80, 60], [130, 40]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="5" fill="#2550C8" />
          ))}
        </svg>
      </div>
    );
  }
  return (
    <div className="grid h-24 place-items-center rounded-xl border border-[#1b2334] bg-[#0d1320]" aria-hidden>
      <div className="grid grid-cols-8 gap-1.5">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className={cn("h-1.5 w-1.5 rounded-full", [2, 3, 9, 12, 13, 18, 21].includes(i) ? "bg-pin" : "bg-[#283143]")}
          />
        ))}
      </div>
    </div>
  );
}

export function TactilePipelineSection() {
  const { lang } = useLang();
  const L = (en: string, ko: string) => lang === "ko" ? ko : en;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow={L("The pipeline", "변환 파이프라인")}
        title={L(
          "From a flat diagram to something a student can feel",
          "평면 다이어그램에서 학생이 손으로 느낄 수 있는 것으로"
        )}
        intro={L(
          "One assignment moves through three stages — without leaving the Chromebook the student already uses.",
          "수업 자료 하나가 세 단계를 거쳐 — 학생이 이미 쓰는 Chromebook을 벗어나지 않고."
        )}
      />
      <ol className="mt-8 grid gap-4 md:grid-cols-3">
        {STAGES.map((s, i) => (
          <li key={s.step} className="relative">
            <div className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-card">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] font-semibold spectrum-text">{s.step}</span>
                {i < STAGES.length - 1 && (
                  <span className="text-faint" aria-hidden>→</span>
                )}
              </div>
              <h3 className="mt-2 text-[16px] font-semibold text-ink">{lang === "ko" ? s.title.ko : s.title.en}</h3>
              <p className="mt-1.5 mb-4 flex-1 text-[13px] leading-relaxed text-muted">{lang === "ko" ? s.body.ko : s.body.en}</p>
              <Motif kind={s.motif} />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

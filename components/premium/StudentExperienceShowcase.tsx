"use client";

import { DotPadSimulator } from "@/components/DotPadSimulator";
import { StudentDevicePicker } from "@/components/StudentDevicePicker";
import {
  FeatureHighlightCard,
  GeminiInsightPanel,
  SectionHeading,
} from "@/components/premium/cards";
import { WATER_CYCLE_ASSIGNMENT as A } from "@/lib/constants";
import { useLang } from "@/lib/i18n";

const LOOP = [
  {
    n: "1",
    t: { en: "Pan", ko: "이동" },
    d: { en: "Left / Right keys move between objects.", ko: "좌우 키로 객체 간 이동합니다." },
  },
  {
    n: "2",
    t: { en: "Feel", ko: "느끼기" },
    d: { en: "60×40 pins raise the current shape.", ko: "60×40 핀이 현재 형태를 올립니다." },
  },
  {
    n: "3",
    t: { en: "Ask", ko: "질문하기" },
    d: { en: "F1 explains, F2 hints, F3 quizzes.", ko: "F1 설명, F2 힌트, F3 퀴즈." },
  },
  {
    n: "4",
    t: { en: "Confirm", ko: "확인하기" },
    d: { en: "Braille + audio close the loop.", ko: "점자와 음성으로 학습을 마무리합니다." },
  },
];

export function StudentExperienceShowcase() {
  const { lang } = useLang();
  const L = (en: string, ko: string) => lang === "ko" ? ko : en;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Assignment context */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-5 py-4 shadow-card">
        <div>
          <p className="eyebrow">{L("Now playing · the flagship experience", "지금 체험 중 · 대표 수업")}</p>
          <p className="mt-1 font-display text-[18px] font-semibold text-ink">
            {lang === "ko" && A.title.ko ? A.title.ko : A.title.en}
          </p>
        </div>
        <span className="rounded-full bg-verify-tint px-3 py-1 font-mono text-[11px] text-verify">
          tactile-ready
        </span>
      </div>

      {/* Pick which student / Dot Pad this demo represents */}
      <StudentDevicePicker />

      {/* The interactive device — the heart of the prototype */}
      <DotPadSimulator />

      {/* Supporting modules */}
      <div className="mt-8">
        <SectionHeading
          eyebrow={L("What the student feels", "학생이 느끼는 것")}
          title={L("A complete, accessible feedback loop", "완전한 접근 가능 피드백 루프")}
          intro={L(
            "Every part of the diagram is reachable by touch, explained by Dot Lens, and confirmed in braille — driven entirely by six keys.",
            "다이어그램의 모든 부분을 손끝으로 탐색하고, 닷 렌즈가 설명하며, 점자로 확인합니다 — 단 여섯 개의 키로."
          )}
        />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <FeatureHighlightCard
            accent="pin"
            title={L("60×40 tactile output", "60×40 촉각 출력")}
            body={L(
              "A real pin grid raises the shape, position, and flow of each object — the only surface that conveys layout by touch.",
              "실제 핀 그리드가 각 객체의 형태·위치·흐름을 올립니다 — 손끝으로 레이아웃을 전달하는 유일한 표면."
            )}
            icon={<DotMotif />}
          />
          <FeatureHighlightCard
            accent="blue"
            title={L("20-cell braille line", "20칸 점자 라인")}
            body={L(
              "Expert-reviewed braille labels appear on the refreshable line, gated by the Global Braille QA layer (F4).",
              "전문가 검수를 거친 점자 레이블이 갱신 가능 라인에 표시됩니다 — 글로벌 점자 QA 레이어(F4)를 통과한 것만."
            )}
            icon={<span className="font-mono text-[15px] font-semibold">⠺</span>}
          />
          <FeatureHighlightCard
            accent="cyan"
            title={L("F1–F4 key interaction", "F1–F4 키 상호작용")}
            body={L(
              "Explain, hint, quiz, and repeat — a small, learnable key model that works without sight or a mouse.",
              "설명·힌트·퀴즈·반복 — 시각이나 마우스 없이 동작하는 간단하고 배우기 쉬운 키 모델."
            )}
            icon={<span className="font-mono text-[13px] font-semibold">F1</span>}
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
            <p className="eyebrow">{L("The loop", "탐색 순서")}</p>
            <ol className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {LOOP.map((s) => (
                <li key={s.n} className="rounded-xl border border-line bg-paper p-3">
                  <span className="grid h-6 w-6 place-items-center rounded-lg bg-accent-tint font-mono text-[11px] text-accent">
                    {s.n}
                  </span>
                  <p className="mt-2 text-[13.5px] font-semibold text-ink">{lang === "ko" ? s.t.ko : s.t.en}</p>
                  <p className="mt-0.5 text-[12px] leading-snug text-muted">{lang === "ko" ? s.d.ko : s.d.en}</p>
                </li>
              ))}
            </ol>
          </div>
          <GeminiInsightPanel title={L("Dot Lens AI tutor", "닷 렌즈 AI 튜터")}>
            {L(
              "Dot Lens doesn't just label the diagram — it sequences it for learning, offers Socratic hints on F2, and checks understanding with a tactile quiz on F3, adapting to where the student gets stuck.",
              "닷 렌즈는 다이어그램에 레이블을 붙이는 것에서 그치지 않습니다 — 학습 순서를 정하고, F2로 소크라테스식 힌트를 주며, F3로 촉각 퀴즈를 통해 이해도를 확인하고 막히는 지점에 맞춰 조정합니다."
            )}
          </GeminiInsightPanel>
        </div>
      </div>
    </div>
  );
}

function DotMotif() {
  return (
    <span className="grid grid-cols-3 grid-rows-3 gap-[3px]" aria-hidden>
      {[1, 0, 1, 0, 1, 0, 1, 0, 1].map((on, i) => (
        <span
          key={i}
          className={`h-[4px] w-[4px] rounded-full ${on ? "bg-pin" : "bg-pin-soft"}`}
        />
      ))}
    </span>
  );
}

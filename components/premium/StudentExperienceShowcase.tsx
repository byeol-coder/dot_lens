import { DotPadSimulator } from "@/components/DotPadSimulator";
import {
  FeatureHighlightCard,
  GeminiInsightPanel,
  SectionHeading,
} from "@/components/premium/cards";
import { WATER_CYCLE_ASSIGNMENT as A } from "@/lib/constants";

const LOOP = [
  { n: "1", t: "Pan", d: "Left / Right keys move between objects." },
  { n: "2", t: "Feel", d: "60×40 pins raise the current shape." },
  { n: "3", t: "Ask", d: "F1 explains, F2 hints, F3 quizzes." },
  { n: "4", t: "Confirm", d: "Braille + audio close the loop." },
];

export function StudentExperienceShowcase() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Assignment context */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-5 py-4 shadow-card">
        <div>
          <p className="eyebrow">Now playing · the flagship experience</p>
          <p className="mt-1 font-display text-[18px] font-semibold text-ink">
            {A.title.en}
          </p>
        </div>
        <span className="rounded-full bg-verify-tint px-3 py-1 font-mono text-[11px] text-verify">
          tactile-ready
        </span>
      </div>

      {/* The interactive device — the heart of the prototype */}
      <DotPadSimulator />

      {/* Supporting modules */}
      <div className="mt-8">
        <SectionHeading
          eyebrow="What the student feels"
          title="A complete, accessible feedback loop"
          intro="Every part of the diagram is reachable by touch, explained by Gemini, and confirmed in braille — driven entirely by six keys."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <FeatureHighlightCard
            accent="pin"
            title="60 × 40 tactile output"
            titleKo="60×40 촉각 출력"
            body="A real pin grid raises the shape, position, and flow of each object — the only surface that conveys layout by touch."
            icon={<DotMotif />}
          />
          <FeatureHighlightCard
            accent="blue"
            title="20-cell braille line"
            titleKo="20칸 점자 라인"
            body="Expert-reviewed braille labels appear on the refreshable line, gated by the Global Braille QA layer (F4)."
            icon={<span className="font-mono text-[15px] font-semibold">⠺</span>}
          />
          <FeatureHighlightCard
            accent="cyan"
            title="F1–F4 key interaction"
            titleKo="F1–F4 키 상호작용"
            body="Explain, hint, quiz, and repeat — a small, learnable key model that works without sight or a mouse."
            icon={<span className="font-mono text-[13px] font-semibold">F1</span>}
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
            <p className="eyebrow">The loop</p>
            <ol className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {LOOP.map((s) => (
                <li key={s.n} className="rounded-xl border border-line bg-paper p-3">
                  <span className="grid h-6 w-6 place-items-center rounded-lg bg-accent-tint font-mono text-[11px] text-accent">
                    {s.n}
                  </span>
                  <p className="mt-2 text-[13.5px] font-semibold text-ink">{s.t}</p>
                  <p className="mt-0.5 text-[12px] leading-snug text-muted">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
          <GeminiInsightPanel title="Gemini learning support">
            Gemini doesn&apos;t just label the diagram — it sequences it for
            learning, offers Socratic hints on F2, and checks understanding with
            a tactile quiz on F3, adapting to where the student gets stuck.
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

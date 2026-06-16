import { SectionHeading } from "@/components/premium/cards";
import { cn } from "@/lib/cn";

interface Stage {
  step: string;
  title: string;
  body: string;
  motif: "scan" | "analyze" | "tactile";
}

const STAGES: Stage[] = [
  { step: "01", title: "Scan the material", body: "A teacher attaches any Classroom diagram. Dot Lens reads it on the Chromebook.", motif: "scan" },
  { step: "02", title: "Gemini analyzes", body: "Objects, relationships, and flow are detected, then sequenced for learning.", motif: "analyze" },
  { step: "03", title: "Tactile + braille out", body: "A 60×40 tactile graphic and reviewed braille reach the student's Dot Pad.", motif: "tactile" },
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
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="The pipeline"
        title="From a flat diagram to something a student can feel"
        intro="One assignment moves through three stages — without leaving the Chromebook the student already uses."
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
              <h3 className="mt-2 text-[16px] font-semibold text-ink">{s.title}</h3>
              <p className="mt-1.5 mb-4 flex-1 text-[13px] leading-relaxed text-muted">{s.body}</p>
              <Motif kind={s.motif} />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

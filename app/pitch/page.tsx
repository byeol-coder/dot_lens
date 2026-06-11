import { PageHeader, ComingNext } from "@/components/PageScaffold";

const SLIDES = [
  {
    n: "01",
    title: "The gap",
    body: "Chromebooks run the classroom — but blind and low-vision students still can't see the diagrams. Today that means hand-made tactile sheets, days late.",
  },
  {
    n: "02",
    title: "The product",
    body: "Dot Lens with Gemini turns any Classroom visual into a guided tactile session on the Dot Pad — same assignment, same day, same expectations.",
  },
  {
    n: "03",
    title: "Why now",
    body: "Gemini makes the interpretation possible, the managed Chromebook makes it deployable, and the Dot Pad makes it tangible.",
  },
];

export default function PitchPage() {
  return (
    <>
      <PageHeader
        eyebrow="Partner · pitch mode"
        title="The case for collaboration"
        titleKo="협업을 위한 제안"
        description="A three-slide story for a Google for Education partner. Live demo embeds connect in a later phase."
        phase={5}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-3">
          {SLIDES.map((s) => (
            <article
              key={s.n}
              className="flex flex-col rounded-2xl border border-line bg-surface p-6 shadow-card"
            >
              <span className="font-mono text-[13px] font-medium text-pin">
                {s.n}
              </span>
              <h2 className="mt-3 text-xl font-semibold text-ink">{s.title}</h2>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">
                {s.body}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-6">
          <ComingNext
            points={[
              "Embedded live demo (the student tactile explorer).",
              "Five-minute demo script and talking points.",
              "App Hub-style product description and marketplace notes.",
            ]}
          />
        </div>
      </div>
    </>
  );
}

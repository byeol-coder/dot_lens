import Link from "next/link";
import { PRODUCT, VALUE_CARDS } from "@/lib/constants";
import { ValueCard } from "@/components/ValueCard";
import { Braille } from "@/components/Braille";

const LAYERS = [
  { n: 1, title: "Chromebook / Classroom", body: "The lesson's materials, in the device the student already uses." },
  { n: 2, title: "Gemini understanding", body: "Interprets the diagram and tutors with Socratic guidance." },
  { n: 3, title: "Global Braille QA", body: "Verifies every braille summary before it reaches a student." },
  { n: 4, title: "Dot Pad tactile", body: "Makes layout, shape, and relationships touchable." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="pin-texture absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="eyebrow">Tactile learning · Chromebook · Gemini · Dot Pad</p>
          <h1 className="mt-3 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] text-ink sm:text-5xl">
            {PRODUCT.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            {PRODUCT.subtitle.en}
          </p>

          {/* Bilingual value copy */}
          <div className="mt-8 max-w-2xl space-y-3 rounded-2xl border border-line bg-surface/70 p-5 shadow-card">
            <p className="text-[15px] leading-relaxed text-ink">
              {PRODUCT.value.ko}
            </p>
            <p className="text-[14px] leading-relaxed text-muted">
              {PRODUCT.value.en}
            </p>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/teacher"
              className="rounded-xl bg-accent px-5 py-3 text-[15px] font-semibold text-white shadow-card transition-colors hover:bg-accent-soft"
            >
              Start Teacher Demo
            </Link>
            <Link
              href="/student"
              className="rounded-xl border border-accent bg-surface px-5 py-3 text-[15px] font-semibold text-accent transition-colors hover:bg-accent-tint"
            >
              Start Student Demo
            </Link>
            <Link
              href="/pitch"
              className="rounded-xl border border-line bg-surface px-5 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-surface-sunk"
            >
              View Partner Pitch
            </Link>
          </div>
        </div>
      </section>

      {/* Value cards */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold text-ink">Why it works</h2>
          <Braille word="touch" className="hidden sm:inline-flex" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_CARDS.map((card, i) => (
            <ValueCard key={card.key} data={card} index={i} />
          ))}
        </div>
      </section>

      {/* Four-layer map */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="eyebrow">The system</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">
            One assignment, four layers
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LAYERS.map((layer) => (
              <li
                key={layer.n}
                className="rounded-2xl border border-line bg-paper p-5"
              >
                <span className="font-mono text-[12px] font-medium text-pin">
                  Layer {layer.n}
                </span>
                <h3 className="mt-2 text-[15px] font-semibold text-ink">
                  {layer.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  {layer.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

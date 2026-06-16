import Link from "next/link";
import { PRODUCT } from "@/lib/constants";
import { getMatrix } from "@/lib/tactileMatrix";
import { ChromebookMockup } from "@/components/premium/ChromebookMockup";
import { DotPadPreview } from "@/components/premium/DotPadPreview";
import { GeminiInsightPanel } from "@/components/premium/cards";
import { Braille } from "@/components/Braille";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute right-[-10%] top-[-20%] h-[40rem] w-[40rem] rounded-full bg-brand-blue/10 blur-3xl" />
        <div className="absolute left-[-15%] top-[10%] h-[34rem] w-[34rem] rounded-full bg-brand-cyan/10 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        {/* Copy */}
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1.5 font-mono text-[11px] uppercase tracking-eyebrow text-accent shadow-card">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-green" aria-hidden />
            Chromebook · Gemini · Dot Pad
          </span>

          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] text-ink sm:text-5xl lg:text-[56px]">
            Learning you can{" "}
            <span className="spectrum-text">touch</span>, powered by Gemini.
          </h1>

          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">
            Dot Lens turns any Google Classroom diagram into a guided tactile
            session on the Dot Pad — so blind and low-vision students get the
            same assignment, the same day, on the Chromebook they already use.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/student"
              className="rounded-xl bg-accent px-5 py-3 text-[15px] font-semibold text-white shadow-glow transition-colors hover:bg-accent-soft"
            >
              Try the Student demo
            </Link>
            <Link
              href="/pitch"
              className="rounded-xl border border-line bg-surface px-5 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-surface-sunk"
            >
              View the partner pitch
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <Braille word="touch" />
            <p className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">
              60 × 40 tactile · 20-cell braille · F1–F4
            </p>
          </div>
        </div>

        {/* Composed showcase */}
        <div className="relative animate-fade-up [animation-delay:120ms]">
          <ChromebookMockup barLabel="classroom.google.com · Science 5B">
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <p className="eyebrow">Assignment</p>
                <span className="rounded-full bg-verify-tint px-2 py-0.5 font-mono text-[10px] text-verify">
                  tactile-ready
                </span>
              </div>
              <p className="font-display text-[17px] font-semibold text-ink">
                {PRODUCT.subtitle.en.includes("Water") ? PRODUCT.subtitle.en : "Explore the Water Cycle Diagram"}
              </p>
              <GeminiInsightPanel>
                Detected a science process diagram — 7 objects, flow direction
                prioritized. Sequenced into 6 tactile steps.
              </GeminiInsightPanel>
            </div>
          </ChromebookMockup>

          {/* Floating Dot Pad */}
          <div className="absolute -bottom-8 -right-2 w-[56%] max-w-[280px] sm:-right-6">
            <DotPadPreview
              matrix={getMatrix("cycle")}
              brailleText="water cycle"
              label="water cycle"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

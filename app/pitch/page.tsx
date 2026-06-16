import Link from "next/link";
import { getMatrix } from "@/lib/tactileMatrix";
import { ChromebookMockup } from "@/components/premium/ChromebookMockup";
import { DotPadPreview } from "@/components/premium/DotPadPreview";
import { TactilePipelineSection } from "@/components/premium/TactilePipelineSection";
import {
  SectionHeading,
  FeatureHighlightCard,
  StatImpactCard,
  GeminiInsightPanel,
  Callout,
} from "@/components/premium/cards";

const TODAY = [
  "Diagrams are visual-only — a blind student gets a verbal description at best.",
  "Tactile sheets are hand-made by a specialist, often arriving days late.",
  "The student works on a different task, on a different timeline, apart from peers.",
  "Teachers have no tooling — accessibility lives outside the Classroom workflow.",
];
const WITHLENS = [
  "Any diagram becomes a guided tactile session on the device in hand.",
  "Gemini drafts the tactile + braille in minutes; an expert approves it.",
  "Same assignment, same day, same expectations as the rest of the class.",
  "It lives inside Classroom and the managed Chromebook — no new workflow.",
];

const WHY_NOW = [
  { accent: "cyan" as const, t: "Gemini makes it possible", d: "Multimodal models can finally read a diagram's objects, relationships, and flow — the hard part of conversion." },
  { accent: "blue" as const, t: "Chromebook makes it deployable", d: "Managed devices and the admin console mean a district can roll this out without new hardware." },
  { accent: "pin" as const, t: "Dot Pad makes it tangible", d: "A refreshable 60×40 tactile display turns the analysis into something a student actually feels." },
];

const SCENARIOS = [
  { t: "One classroom", d: "A teacher attaches a diagram; a blind student explores it on their Dot Pad the same period." },
  { t: "A district pilot", d: "Admins enable Dot Lens for a special-education OU; braille is reviewed centrally by TVIs." },
  { t: "Exam settings", d: "Certified tactile + braille, locked exam mode, and an audit trail for high-stakes assessments." },
];

export default function PitchPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <div className="absolute right-[-10%] top-[-25%] h-[36rem] w-[36rem] rounded-full bg-brand-blue/10 blur-3xl" />
          <div className="absolute left-[-12%] bottom-[-30%] h-[32rem] w-[32rem] rounded-full bg-brand-green/10 blur-3xl" />
        </div>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1.5 font-mono text-[11px] uppercase tracking-eyebrow text-accent shadow-card">
              Partner pitch
            </span>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.06] text-ink sm:text-5xl">
              Every student deserves the{" "}
              <span className="spectrum-text">same diagram</span>.
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">
              A premium, Google-compatible tactile learning concept — powered by
              Gemini and the Dot Pad — that closes the diagram gap for blind and
              low-vision students without leaving the Chromebook ecosystem.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/student" className="rounded-xl bg-accent px-5 py-3 text-[15px] font-semibold text-white shadow-glow transition-colors hover:bg-accent-soft">
                See the live demo
              </Link>
              <Link href="/teacher" className="rounded-xl border border-line bg-surface px-5 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-surface-sunk">
                Teacher flow
              </Link>
            </div>
          </div>
          <div className="relative">
            <ChromebookMockup barLabel="classroom.google.com">
              <div className="space-y-3 p-4">
                <p className="eyebrow">Science 5B · assignment</p>
                <p className="font-display text-[16px] font-semibold text-ink">Explore the Water Cycle Diagram</p>
                <GeminiInsightPanel>7 objects · flow direction prioritized · 6 tactile steps · braille queued for review.</GeminiInsightPanel>
              </div>
            </ChromebookMockup>
            <div className="absolute -bottom-7 -right-2 w-[52%] max-w-[260px]">
              <DotPadPreview matrix={getMatrix("cloud")} brailleText="cloud" label="cloud" />
            </div>
          </div>
        </div>
      </section>

      {/* The problem */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="The problem"
          title="Chromebooks run the classroom — but the diagrams stay invisible"
          intro="Blind and low-vision students sit in the same lesson, on the same device, yet the single most common learning object — the diagram — is still out of reach."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
            <p className="font-mono text-[11px] uppercase tracking-eyebrow text-warn">Today</p>
            <h3 className="mt-2 text-[17px] font-semibold text-ink">Why current content fails blind students</h3>
            <ul className="mt-4 space-y-2.5">
              {TODAY.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[13.5px] text-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warn" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-accent/30 bg-accent-tint/40 p-6 shadow-card">
            <p className="font-mono text-[11px] uppercase tracking-eyebrow text-accent">With Dot Lens</p>
            <h3 className="mt-2 text-[17px] font-semibold text-ink">The same lesson, made touchable</h3>
            <ul className="mt-4 space-y-2.5">
              {WITHLENS.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[13.5px] text-ink">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-verify" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Opportunity */}
      <div className="border-y border-line bg-surface/60">
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeading eyebrow="The opportunity" title="The goal: parity, by default" align="center" />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatImpactCard value="Same day" label="Not days later" sub="Tactile + braille generated in the same lesson, not weeks behind." />
            <StatImpactCard value="0" label="New devices" sub="Runs on the managed Chromebook + Dot Pad a school already plans for." />
            <StatImpactCard value="1" label="Assignment, every student" sub="One Classroom task — sighted and blind students, side by side." />
          </div>
        </section>
      </div>

      {/* Solution */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="The solution"
          title="Dot Lens with Gemini"
          intro="An accessibility layer that interprets, verifies, and renders — turning a flat image into a guided, touchable, expert-checked experience."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureHighlightCard accent="cyan" title="Gemini understands" body="Detects objects, relationships, and flow, then sequences the diagram into learnable tactile steps with Socratic tutoring." icon={<span className="font-mono text-[14px] font-semibold">G</span>} />
          <FeatureHighlightCard accent="green" title="Experts verify" body="Every braille summary passes the Global Braille QA layer and human review before it can publish to a student." icon={<span className="font-mono text-[15px] font-semibold">⠺</span>} />
          <FeatureHighlightCard accent="pin" title="Dot Pad renders" body="A 60×40 tactile graphic and 20-cell braille line make layout, shape, and direction felt — driven by six keys." icon={<span className="text-[15px]">⠿</span>} />
        </div>
      </section>

      {/* How it works together */}
      <div className="border-y border-line bg-surface/60">
        <TactilePipelineSection />
      </div>

      {/* Why now */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading eyebrow="Why now" title="Three things just became true at once" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {WHY_NOW.map((w) => (
            <FeatureHighlightCard key={w.t} accent={w.accent} title={w.t} body={w.d} />
          ))}
        </div>
      </section>

      {/* Impact */}
      <div className="border-y border-line bg-surface/60">
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHeading eyebrow="Impact" title="What changes for a student" align="center" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatImpactCard value="Belonging" label="In the lesson, not beside it" />
            <StatImpactCard value="Autonomy" label="Explores without waiting for help" />
            <StatImpactCard value="Speed" label="Same-day access to content" />
            <StatImpactCard value="Trust" label="Braille checked by an expert" />
          </div>
          <Callout className="mx-auto mt-6 max-w-3xl text-center" tone="neutral">
            Directional framing for a prototype — the point is the shape of the
            outcome, validated with educators and TVIs before any deployment.
          </Callout>
        </section>
      </div>

      {/* Future collaboration */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Future collaboration"
          title="Where this could go with a Google for Education partner"
          intro="From a single classroom to district-wide and high-stakes exam settings."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {SCENARIOS.map((s) => (
            <div key={s.t} className="rounded-2xl border border-line bg-surface p-5 shadow-card">
              <h3 className="text-[16px] font-semibold text-ink">{s.t}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-line bg-surface p-8 text-center shadow-card sm:p-10">
          <div className="spectrum-bar h-1 w-24 rounded-full opacity-70" aria-hidden />
          <h2 className="text-balance text-[26px] font-semibold leading-tight text-ink">
            Let&apos;s make every diagram touchable.
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/student" className="rounded-xl bg-accent px-5 py-3 text-[15px] font-semibold text-white shadow-glow transition-colors hover:bg-accent-soft">
              Open the demo
            </Link>
            <Link href="/dashboard" className="rounded-xl border border-line bg-surface px-5 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-surface-sunk">
              See teacher reporting
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

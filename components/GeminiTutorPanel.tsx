import { cn } from "@/lib/cn";

/** Placeholder for the Gemini tutor. Static sample exchange in Phase 0. */
export function GeminiTutorPanel({ className }: { className?: string }) {
  return (
    <div
      aria-label="Gemini tutor panel (placeholder)"
      className={cn(
        "rounded-2xl border border-line bg-surface p-4 shadow-card",
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="eyebrow">Gemini tutor</p>
        <span className="font-mono text-[11px] text-faint">Phase 2</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2.5">
          <span
            className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-accent-tint font-mono text-[11px] font-semibold text-accent"
            aria-hidden
          >
            G
          </span>
          <p className="text-[13.5px] leading-relaxed text-ink">
            Feel the dotted lines rising from the ocean. When the sun heats the
            water, what do you think happens to it?
          </p>
        </div>
        <p className="pl-9 text-[12px] italic text-muted">
          Sample guidance · the live Socratic tutor connects in a later phase.
        </p>
      </div>
    </div>
  );
}

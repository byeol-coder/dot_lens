import { cn } from "@/lib/cn";
import { StatusBadge } from "@/components/StatusBadge";

const MODES = ["Guided", "Explore", "Quiz"];

/** Placeholder for the Chrome extension side panel. Wired up in a later phase. */
export function DotLensSidePanel({ className }: { className?: string }) {
  return (
    <aside
      aria-label="Dot Lens side panel (placeholder)"
      className={cn(
        "flex w-full flex-col rounded-2xl border border-line bg-surface shadow-card",
        className
      )}
    >
      <header className="flex items-center justify-between border-b border-line px-4 py-3">
        <p className="eyebrow">Dot Lens</p>
        <StatusBadge variant="verified">connected</StatusBadge>
      </header>

      <div className="space-y-4 px-4 py-4">
        <div className="flex gap-2">
          {MODES.map((m, i) => (
            <span
              key={m}
              className={cn(
                "flex-1 rounded-xl border px-2 py-2 text-center text-[13px] font-medium",
                i === 0
                  ? "border-accent bg-accent-tint text-accent"
                  : "border-line text-muted"
              )}
            >
              {m}
            </span>
          ))}
        </div>

        <div className="rounded-xl border border-dashed border-line bg-surface-sunk px-4 py-6 text-center">
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">
            Phase 2
          </p>
          <p className="mt-1 text-sm text-muted">
            Live transcript, hints, and key mirroring arrive with the Dot Pad
            interaction layer.
          </p>
        </div>
      </div>
    </aside>
  );
}

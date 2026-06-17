import { StatusBadge } from "@/components/StatusBadge";

export function PageHeader({
  eyebrow,
  title,
  titleKo,
  description,
  phase,
}: {
  eyebrow: string;
  title: string;
  titleKo?: string;
  description: string;
  phase?: number;
}) {
  return (
    <div className="relative overflow-hidden border-b border-line bg-surface">
      <div className="spectrum-bar absolute inset-x-0 top-0 h-0.5 opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-60"
        aria-hidden
      >
        <div className="absolute right-[-10%] top-[-40%] h-72 w-72 rounded-full bg-brand-blue/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-center gap-3">
          <p className="eyebrow">{eyebrow}</p>
          {phase !== undefined && (
            <StatusBadge variant={phase === 0 ? "live" : "review"}>
              {phase === 0 ? "ready" : `Phase ${phase}`}
            </StatusBadge>
          )}
        </div>
        <h1 className="mt-2.5 text-balance text-3xl font-semibold leading-tight text-ink sm:text-[40px]">
          {title}
        </h1>
        {titleKo && (
          <p className="mt-1.5 font-mono text-[12px] tracking-wide text-accent-soft">
            {titleKo}
          </p>
        )}
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
          {description}
        </p>
      </div>
    </div>
  );
}

export function ComingNext({ points }: { points: string[] }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface-sunk p-6">
      <p className="eyebrow">Coming next</p>
      <ul className="mt-3 space-y-2">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2.5 text-[14px] text-ink">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pin"
              aria-hidden
            />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

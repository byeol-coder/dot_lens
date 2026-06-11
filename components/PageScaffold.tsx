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
  phase: number;
}) {
  return (
    <div className="border-b border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex items-center gap-3">
          <p className="eyebrow">{eyebrow}</p>
          <StatusBadge variant={phase === 0 ? "live" : "review"}>
            {phase === 0 ? "ready" : `Phase ${phase}`}
          </StatusBadge>
        </div>
        <h1 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">
          {title}
        </h1>
        {titleKo && (
          <p className="mt-1 font-mono text-[12px] tracking-wide text-accent-soft">
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

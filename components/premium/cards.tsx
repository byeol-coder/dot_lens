import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ---- Section heading -------------------------------------------------- */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-2 text-balance text-[26px] font-semibold leading-tight text-ink sm:text-[32px]">
        {title}
      </h2>
      {intro && (
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{intro}</p>
      )}
    </div>
  );
}

/* ---- Feature highlight card ------------------------------------------ */
export function FeatureHighlightCard({
  icon,
  title,
  titleKo,
  body,
  accent = "blue",
  footer,
  className,
}: {
  icon?: ReactNode;
  title: string;
  titleKo?: string;
  body: string;
  accent?: "blue" | "cyan" | "green" | "pin";
  footer?: ReactNode;
  className?: string;
}) {
  const ring: Record<string, string> = {
    blue: "from-brand-blue/15 text-brand-blue",
    cyan: "from-brand-cyan/15 text-brand-cyan",
    green: "from-brand-green/15 text-brand-green",
    pin: "from-pin/15 text-pin",
  };
  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent-soft/50 hover:shadow-lift",
        className
      )}
    >
      {icon && (
        <span
          className={cn(
            "mb-3 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br to-transparent",
            ring[accent]
          )}
          aria-hidden
        >
          {icon}
        </span>
      )}
      <h3 className="text-[16px] font-semibold text-ink">{title}</h3>
      <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-muted">{body}</p>
      {footer && <div className="mt-4">{footer}</div>}
    </article>
  );
}

/* ---- Stat / impact card ---------------------------------------------- */
export function StatImpactCard({
  value,
  label,
  sub,
  className,
}: {
  value: string;
  label: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface p-5 shadow-card",
        className
      )}
    >
      <p className="font-display text-[34px] font-semibold leading-none spectrum-text">
        {value}
      </p>
      <p className="mt-2 text-[14px] font-medium text-ink">{label}</p>
      {sub && <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{sub}</p>}
    </div>
  );
}

/* ---- Gemini insight panel -------------------------------------------- */
export function GeminiInsightPanel({
  title = "Dot Lens insight",
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-accent/25 bg-accent-tint/60 p-4",
        className
      )}
    >
      <div className="spectrum-bar absolute inset-x-0 top-0 h-0.5 opacity-70" aria-hidden />
      <div className="flex items-center gap-2">
        <span
          className="grid h-6 w-6 place-items-center rounded-lg bg-accent font-mono text-[11px] font-semibold text-white"
          aria-hidden
        >
          G
        </span>
        <p className="font-mono text-[11px] uppercase tracking-eyebrow text-accent">
          {title}
        </p>
      </div>
      <div className="mt-2 text-[13.5px] leading-relaxed text-ink">{children}</div>
    </div>
  );
}

/* ---- Callout --------------------------------------------------------- */
export function Callout({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "warn" | "verify";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "border-line bg-surface-sunk text-ink",
    warn: "border-[#EBD9B6] bg-[#FBF3E2] text-warn",
    verify: "border-verify/30 bg-verify-tint text-verify",
  };
  return (
    <div className={cn("rounded-xl border px-4 py-3 text-[13.5px]", tones[tone], className)}>
      {children}
    </div>
  );
}

import { cn } from "@/lib/cn";

export type StatusVariant =
  | "verified"
  | "pending"
  | "review"
  | "draft"
  | "live";

const STYLES: Record<StatusVariant, { wrap: string; dot: string }> = {
  verified: { wrap: "bg-verify-tint text-verify", dot: "bg-verify" },
  pending: { wrap: "bg-[#FBF1DF] text-warn", dot: "bg-warn" },
  review: { wrap: "bg-accent-tint text-accent", dot: "bg-accent" },
  draft: { wrap: "bg-surface-sunk text-muted", dot: "bg-faint" },
  live: { wrap: "bg-accent text-white", dot: "bg-pin-soft" },
};

export function StatusBadge({
  variant = "draft",
  children,
  className,
}: {
  variant?: StatusVariant;
  children: React.ReactNode;
  className?: string;
}) {
  const s = STYLES[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium tracking-wide",
        s.wrap,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} aria-hidden />
      {children}
    </span>
  );
}

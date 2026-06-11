import { cn } from "@/lib/cn";

export function ScreenCard({
  eyebrow,
  title,
  action,
  children,
  className,
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-line bg-surface shadow-card",
        className
      )}
    >
      {(eyebrow || title || action) && (
        <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
          <div className="min-w-0">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && (
              <h2 className="mt-1 text-lg font-semibold text-ink">{title}</h2>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

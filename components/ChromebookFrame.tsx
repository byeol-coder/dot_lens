import { cn } from "@/lib/cn";

/**
 * A neutral laptop-style frame that evokes a Chromebook without any brand marks.
 * Wraps page content as the "screen".
 */
export function ChromebookFrame({
  urlLabel = "classroom · Dot Lens",
  children,
  className,
}: {
  urlLabel?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-3xl", className)}>
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-lift">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-line bg-surface-sunk px-4 py-2.5">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
          </div>
          <div className="flex-1">
            <div className="mx-auto flex max-w-sm items-center gap-2 rounded-full border border-line bg-surface px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-verify" aria-hidden />
              <span className="truncate font-mono text-[11px] text-muted">
                {urlLabel}
              </span>
            </div>
          </div>
          <div className="w-10" aria-hidden />
        </div>
        {/* Screen */}
        <div className="bg-paper p-5 sm:p-6">{children}</div>
      </div>
      {/* Hinge / base */}
      <div className="mx-auto mt-1 h-2 w-[88%] rounded-b-2xl bg-line/70" aria-hidden />
    </div>
  );
}

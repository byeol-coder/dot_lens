import { cn } from "@/lib/cn";

/**
 * A clean, premium laptop frame to present a Chromebook-native screen.
 * Decorative chrome only; children render as the screen content.
 */
export function ChromebookMockup({
  children,
  className,
  barLabel = "classroom.google.com",
}: {
  children: React.ReactNode;
  className?: string;
  barLabel?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      {/* Screen */}
      <div className="rounded-t-2xl border border-line bg-[#0f1729] p-2 shadow-lift">
        <div className="overflow-hidden rounded-xl bg-surface">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-line bg-surface-sunk px-3 py-2">
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
            </span>
            <span className="ml-2 flex-1 truncate rounded-md bg-surface px-3 py-1 font-mono text-[10.5px] text-faint">
              {barLabel}
            </span>
          </div>
          <div className="bg-paper">{children}</div>
        </div>
      </div>
      {/* Base / hinge */}
      <div className="mx-auto h-3 w-[104%] -translate-x-[2%] rounded-b-2xl border border-t-0 border-line bg-gradient-to-b from-[#dfe6f2] to-[#c6d0e0]" aria-hidden />
      <div className="mx-auto h-1.5 w-[56%] rounded-b-xl bg-[#b9c4d6]" aria-hidden />
    </div>
  );
}

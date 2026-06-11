import type { BrailleCell } from "@/types";
import { cn } from "@/lib/cn";

function Cell({ dots }: { dots: number[] }) {
  const order = [1, 4, 2, 5, 3, 6]; // 1,2,3 left column; 4,5,6 right column
  return (
    <span className="grid grid-cols-2 grid-rows-3 gap-[3px]" aria-hidden>
      {order.map((d) => (
        <span
          key={d}
          className={cn(
            "h-[6px] w-[6px] rounded-full",
            dots.includes(d) ? "bg-pin" : "bg-line"
          )}
        />
      ))}
    </span>
  );
}

export function BrailleCellsView({
  cells,
  text,
  className,
}: {
  cells: BrailleCell[];
  text?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-line bg-surface-sunk px-4 py-3",
        className
      )}
    >
      <div
        className="flex flex-wrap gap-[9px]"
        role="img"
        aria-label={text ? `Braille for: ${text}` : "Braille cells"}
      >
        {cells.length === 0 ? (
          <span className="text-[13px] text-faint">(empty)</span>
        ) : (
          cells.map((dots, i) => <Cell key={i} dots={dots} />)
        )}
      </div>
      {text && (
        <p className="mt-2 font-mono text-[12px] text-muted">{text}</p>
      )}
    </div>
  );
}

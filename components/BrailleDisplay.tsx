import { cn } from "@/lib/cn";

// Uncontracted English letters → raised dots (1–6). Phase 2 braille is English.
const LETTER: Record<string, number[]> = {
  a: [1], b: [1, 2], c: [1, 4], d: [1, 4, 5], e: [1, 5], f: [1, 2, 4],
  g: [1, 2, 4, 5], h: [1, 2, 5], i: [2, 4], j: [2, 4, 5], k: [1, 3],
  l: [1, 2, 3], m: [1, 3, 4], n: [1, 3, 4, 5], o: [1, 3, 5], p: [1, 2, 3, 4],
  q: [1, 2, 3, 4, 5], r: [1, 2, 3, 5], s: [2, 3, 4], t: [2, 3, 4, 5],
  u: [1, 3, 6], v: [1, 2, 3, 6], w: [2, 4, 5, 6], x: [1, 3, 4, 6],
  y: [1, 3, 4, 5, 6], z: [1, 3, 5, 6], " ": [],
};

const CELLS = 20;

function toCells(text: string): number[][] {
  const cells = text
    .toLowerCase()
    .split("")
    .map((ch) => LETTER[ch] ?? []);
  return cells.slice(0, CELLS);
}

function BrailleCell({ dots }: { dots: number[] }) {
  // positions 1..6 → grid order (1,2,3 left column; 4,5,6 right column)
  const order = [1, 4, 2, 5, 3, 6];
  return (
    <span className="grid grid-cols-2 grid-rows-3 gap-[3px]" aria-hidden>
      {order.map((d) => (
        <span
          key={d}
          className={cn(
            "h-[6px] w-[6px] rounded-full",
            dots.includes(d) ? "bg-[#F2C14E]" : "bg-[#283143]"
          )}
        />
      ))}
    </span>
  );
}

export function BrailleDisplay({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const cells = toCells(text);
  const padded = [...cells, ...Array(Math.max(0, CELLS - cells.length)).fill([])];

  return (
    <div
      className={cn(
        "rounded-2xl border border-[#222a3a] bg-[#0d1320] px-4 py-3",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6b7689]">
          Braille line · 20 cells
        </span>
        <span className="font-mono text-[11px] text-[#8a93a3]">{text}</span>
      </div>
      <div
        className="mt-2 flex gap-[9px] overflow-x-auto"
        role="img"
        aria-label={`Braille line showing: ${text}`}
      >
        {padded.map((dots, i) => (
          <BrailleCell key={i} dots={dots} />
        ))}
      </div>
    </div>
  );
}

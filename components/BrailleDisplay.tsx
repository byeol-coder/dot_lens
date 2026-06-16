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
  return text.toLowerCase().split("").map((ch) => LETTER[ch] ?? []).slice(0, CELLS);
}

function BrailleCell({ dots }: { dots: number[] }) {
  const order = [1, 4, 2, 5, 3, 6]; // 1,2,3 left column; 4,5,6 right column
  return (
    <span className="grid grid-cols-2 grid-rows-3 gap-[3px]" aria-hidden>
      {order.map((d) => {
        const on = dots.includes(d);
        return (
          <span
            key={d}
            className="h-[7px] w-[7px] rounded-full"
            style={{
              backgroundColor: on ? "#f3f4f6" : "#2b2c30",
              boxShadow: on ? "0 0 1.5px rgba(255,255,255,0.45)" : undefined,
            }}
          />
        );
      })}
    </span>
  );
}

/**
 * 20-cell refreshable braille line — bright lit dots on black, matching the
 * tactile field. Renders dots only; the device frame supplies the "TEXT 20"
 * label and layout.
 */
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
      className={cn("flex items-center justify-between gap-1", className)}
      role="img"
      aria-label={`Braille line showing: ${text}`}
    >
      {padded.map((dots, i) => (
        <BrailleCell key={i} dots={dots} />
      ))}
    </div>
  );
}

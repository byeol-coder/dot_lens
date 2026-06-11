import { cn } from "@/lib/cn";

// Uncontracted English letters → raised dots (1–6). Decorative only.
const LETTER: Record<string, number[]> = {
  a: [1], b: [1, 2], c: [1, 4], d: [1, 4, 5], e: [1, 5], f: [1, 2, 4],
  g: [1, 2, 4, 5], h: [1, 2, 5], i: [2, 4], j: [2, 4, 5], k: [1, 3],
  l: [1, 2, 3], m: [1, 3, 4], n: [1, 3, 4, 5], o: [1, 3, 5], p: [1, 2, 3, 4],
  q: [1, 2, 3, 4, 5], r: [1, 2, 3, 5], s: [2, 3, 4], t: [2, 3, 4, 5],
  u: [1, 3, 6], v: [1, 2, 3, 6], w: [2, 4, 5, 6], x: [1, 3, 4, 6],
  y: [1, 3, 4, 5, 6], z: [1, 3, 5, 6], " ": [],
};

function Cell({ dots }: { dots: number[] }) {
  // positions 1..6 → grid order (col-major: 1,2,3 left; 4,5,6 right)
  const order = [1, 4, 2, 5, 3, 6];
  return (
    <span className="grid grid-cols-2 grid-rows-3 gap-[3px]">
      {order.map((d) => (
        <span
          key={d}
          className={cn(
            "h-[5px] w-[5px] rounded-full",
            dots.includes(d) ? "bg-pin" : "bg-line"
          )}
        />
      ))}
    </span>
  );
}

export function Braille({
  word,
  className,
}: {
  word: string;
  className?: string;
}) {
  const cells = word.toLowerCase().split("").map((ch) => LETTER[ch] ?? []);
  return (
    <span aria-hidden className={cn("inline-flex items-center gap-[7px]", className)}>
      {cells.map((dots, i) => (
        <Cell key={i} dots={dots} />
      ))}
    </span>
  );
}

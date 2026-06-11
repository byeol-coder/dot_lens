import type { TactileGridData } from "@/types";
import { cn } from "@/lib/cn";

/**
 * Visual mirror of the Dot Pad's tactile graphic area.
 * The grid is decorative for assistive tech (aria-hidden); the meaning is
 * conveyed via the braille line and the tutor live region. A concise text
 * description is provided for sighted low-vision users via `title`.
 */
export function TactileGrid({
  matrix,
  objectName,
  className,
}: {
  matrix: TactileGridData;
  objectName?: string;
  className?: string;
}) {
  const cell = 10; // px per pin in the viewBox
  const w = matrix.cols * cell;
  const h = matrix.rows * cell;

  const raised: Array<[number, number]> = [];
  for (let y = 0; y < matrix.rows; y++) {
    const row = matrix.cells[y] ?? [];
    for (let x = 0; x < matrix.cols; x++) {
      if (row[x]) raised.push([x, y]);
    }
  }

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-[#222a3a] bg-[#0d1320] p-3 shadow-[inset_0_2px_22px_rgba(0,0,0,0.45)]",
        className
      )}
    >
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="block h-auto w-full"
        role="img"
        aria-hidden="true"
      >
        {objectName && <title>{`Tactile graphic: ${objectName}`}</title>}
        <defs>
          <pattern
            id="dp-lowered"
            width={cell}
            height={cell}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={cell / 2} cy={cell / 2} r={1.5} fill="#283143" />
          </pattern>
        </defs>
        {/* Lowered pins (entire field) */}
        <rect width={w} height={h} fill="url(#dp-lowered)" />
        {/* Raised pins */}
        {raised.map(([x, y]) => (
          <circle
            key={`${x}-${y}`}
            cx={x * cell + cell / 2}
            cy={y * cell + cell / 2}
            r={4.1}
            fill="#F2C14E"
          />
        ))}
      </svg>
    </div>
  );
}

import type { TactileGridData } from "@/types";
import { cn } from "@/lib/cn";

export type PinColor = "white" | "amber";

/**
 * Dot Pad 60×40 tactile field.
 * Props:
 *  pinColor   — "white" (device default) | "amber" (brand signature)
 *  scanSweep  — when true, a scanning beam animates across the field
 */
export function TactileGrid({
  matrix,
  objectName,
  pinColor = "white",
  scanSweep = false,
  className,
}: {
  matrix: TactileGridData;
  objectName?: string;
  pinColor?: PinColor;
  scanSweep?: boolean;
  className?: string;
}) {
  const cell = 10;
  const w = matrix.cols * cell;
  const h = matrix.rows * cell;

  const raised: Array<[number, number]> = [];
  for (let y = 0; y < matrix.rows; y++) {
    const row = matrix.cells[y] ?? [];
    for (let x = 0; x < matrix.cols; x++) {
      if (row[x]) raised.push([x, y]);
    }
  }

  const litFill   = pinColor === "amber" ? "#E0A12E" : "#f3f4f6";
  const glowColor = pinColor === "amber"
    ? "drop-shadow(0 0 1.4px rgba(224,161,46,0.55))"
    : "drop-shadow(0 0 1.1px rgba(255,255,255,0.40))";

  // unique id per instance to avoid SVG defs collision
  const uid = `dp-${pinColor}-${scanSweep ? "s" : "n"}`;

  return (
    <div className={cn("relative overflow-hidden rounded-md bg-black", className)}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="block h-auto w-full"
        role="img"
        aria-hidden="true"
      >
        {objectName && <title>{`Tactile graphic: ${objectName}`}</title>}

        <defs>
          <pattern id={`${uid}-low`} width={cell} height={cell} patternUnits="userSpaceOnUse">
            <circle cx={cell / 2} cy={cell / 2} r={1.35} fill="#2b2c30" />
          </pattern>

          {/* Scan-sweep gradient — tall horizontal band */}
          {scanSweep && (
            <linearGradient id={`${uid}-beam`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%"   stopColor={litFill} stopOpacity="0" />
              <stop offset="40%"  stopColor={litFill} stopOpacity="0.06" />
              <stop offset="50%"  stopColor={litFill} stopOpacity="0.18" />
              <stop offset="60%"  stopColor={litFill} stopOpacity="0.06" />
              <stop offset="100%" stopColor={litFill} stopOpacity="0" />
            </linearGradient>
          )}
        </defs>

        {/* full lowered-pin field */}
        <rect width={w} height={h} fill={`url(#${uid}-low)`} />

        {/* raised (lit) pins */}
        <g style={{ filter: glowColor }}>
          {raised.map(([x, y]) => (
            <circle
              key={`${x}-${y}`}
              cx={x * cell + cell / 2}
              cy={y * cell + cell / 2}
              r={4}
              fill={litFill}
            />
          ))}
        </g>

        {/* scan beam overlay — animates top to bottom */}
        {scanSweep && (
          <rect
            x={0}
            y={0}
            width={w}
            height={h * 0.28}
            fill={`url(#${uid}-beam)`}
            style={{
              animation: "scan-sweep 3.4s ease-in-out infinite",
              transformOrigin: `${w / 2}px 0`,
            }}
          />
        )}
      </svg>
    </div>
  );
}

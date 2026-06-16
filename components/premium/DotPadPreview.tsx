import type { TactileGridData } from "@/types";
import { DotPadScreen } from "@/components/premium/DotPadScreen";
import { cn } from "@/lib/cn";

/**
 * Presentation-only Dot Pad for hero/pitch compositions.
 * Uses DotPadScreen with controls hidden (static, no interaction needed).
 * The live interactive device lives in DotPadSimulator + DotPadScreen.
 */
export function DotPadPreview({
  matrix,
  brailleText = "water cycle",
  label,
  caption,
  className,
}: {
  matrix: TactileGridData;
  brailleText?: string;
  label?: string;
  caption?: string;
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      <DotPadScreen
        matrix={matrix}
        brailleText={brailleText}
        demoLabel={label}
        objectName={label}
        showControls={false}
      />
      {caption && (
        <p className="pt-2.5 text-center font-mono text-[10px] text-faint">
          {caption}
        </p>
      )}
    </div>
  );
}

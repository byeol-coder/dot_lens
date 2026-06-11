import type { ValueCard as ValueCardData } from "@/lib/constants";
import { Braille } from "@/components/Braille";

export function ValueCard({ data, index }: { data: ValueCardData; index: number }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-card transition-shadow hover:shadow-lift">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-faint">
          {String(index + 1).padStart(2, "0")}
        </span>
        <Braille word={data.brailleWord} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-ink">{data.title}</h3>
      <p className="font-mono text-[11px] tracking-wide text-accent-soft">
        {data.titleKo}
      </p>
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{data.body}</p>
    </article>
  );
}

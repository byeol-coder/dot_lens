"use client";

import { useSearchParams } from "next/navigation";
import { useT, type TKey } from "@/lib/i18n";
import { TeachingGuide } from "@/components/TeachingGuide";
import type { SAMPLE_AI_ANALYSES } from "@/lib/mockPlatformData";

type DiagramType = keyof typeof SAMPLE_AI_ANALYSES;

const DEMO_MAP: Record<string, { diagram: DiagramType; titleKey: TKey; altKey: TKey }> = {
  science: { diagram: "plant_parts", titleKey: "demo.science.title", altKey: "altdesc.plant" },
  math: { diagram: "shapes", titleKey: "demo.math.title", altKey: "altdesc.shapes" },
};

export function TeachingGuideView() {
  const { t } = useT();
  const params = useSearchParams();
  const demo = params.get("demo") ?? "";
  const mapped = DEMO_MAP[demo];
  const diagram: DiagramType = mapped?.diagram ?? "water_cycle";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 border-b border-line pb-6">
        <p className="eyebrow">{t("brand.name")} · {t("guide.title")}</p>
        <h1 className="mt-2 text-balance text-3xl font-semibold text-ink sm:text-4xl">
          {mapped ? t(mapped.titleKey) : t("guide.title")}
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
          {t("guide.description")}
        </p>
      </div>

      {/* Dot Pad alt description — always paired with the tactile preview */}
      {mapped && (
        <div className="mb-6 rounded-2xl border border-line bg-surface-sunk/60 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-muted">
            {t("preview.altHeading")}
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-ink">{t(mapped.altKey)}</p>
        </div>
      )}

      <TeachingGuide diagramType={diagram} />
    </div>
  );
}

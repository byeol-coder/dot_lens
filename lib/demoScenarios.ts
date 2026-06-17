import type { TKey } from "@/lib/i18n";

/**
 * Demo scenarios for live walkthroughs (classroom + India field demos).
 * Each references i18n keys so KR/EN copy stays native, not translated.
 * These always render from mock data — the flow never depends on a live API.
 */
export interface DemoScenario {
  id: "science" | "math" | "field";
  kind: "lesson" | "impact";
  icon: string;
  accent: "green" | "blue" | "pin";
  titleKey: TKey;
  audienceKey?: TKey;
  lineKeys: TKey[];
  /** Where the demo CTA leads. */
  href: string;
  ctaKey: TKey;
  /** Alt-description key for the tactile preview (lessons only). */
  altKey?: TKey;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "science",
    kind: "lesson",
    icon: "🌱",
    accent: "green",
    titleKey: "demo.science.title",
    audienceKey: "demo.science.audience",
    lineKeys: ["demo.science.line1", "demo.science.line2", "demo.science.line3"],
    href: "/teaching-guide?demo=science",
    ctaKey: "landing.primaryCta",
    altKey: "altdesc.plant",
  },
  {
    id: "math",
    kind: "lesson",
    icon: "△",
    accent: "blue",
    titleKey: "demo.math.title",
    audienceKey: "demo.math.audience",
    lineKeys: ["demo.math.line1", "demo.math.line2", "demo.math.line3"],
    href: "/teaching-guide?demo=math",
    ctaKey: "landing.primaryCta",
    altKey: "altdesc.shapes",
  },
  {
    id: "field",
    kind: "impact",
    icon: "🌏",
    accent: "pin",
    titleKey: "demo.fieldImpact.title",
    lineKeys: [
      "demo.fieldImpact.line1",
      "demo.fieldImpact.line2",
      "demo.fieldImpact.line3",
    ],
    href: "/field-data",
    ctaKey: "field.viewReport",
  },
];

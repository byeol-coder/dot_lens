import type { Metadata } from "next";
import { FieldDataPanel } from "@/components/FieldDataPanel";
import { KeyedPageHeader } from "@/components/KeyedPageHeader";

export const metadata: Metadata = {
  title: "Impact | Dot Lens",
  description: "Field data and impact metrics from Dot Lens deployments across India, Nigeria, and Zambia.",
};

export default function ImpactPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6" id="main-content">
      <KeyedPageHeader
        eyebrowKey="nav.impact"
        titleKey="field.title"
        descriptionKey="field.description"
      />
      <FieldDataPanel />
    </main>
  );
}

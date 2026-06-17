import { FieldDataPanel } from "@/components/FieldDataPanel";
import { KeyedPageHeader } from "@/components/KeyedPageHeader";

export const metadata = {
  title: "Field & Impact | Dot Lens",
  description: "Monitor teacher usage, champion teacher progress, and field impact across schools.",
};

export default function FieldDataPage() {
  return (
    <>
      <KeyedPageHeader
        eyebrowKey="term.fieldImpact"
        titleKey="field.title"
        descriptionKey="subtitle.field"
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <FieldDataPanel />
      </div>
    </>
  );
}

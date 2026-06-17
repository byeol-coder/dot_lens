import { DemoModePanel } from "@/components/DemoModePanel";
import { DemoPageHeader } from "@/components/DemoPageHeader";

export const metadata = {
  title: "Demo Mode | Dot Lens",
};

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <DemoPageHeader />
      <DemoModePanel />
    </div>
  );
}

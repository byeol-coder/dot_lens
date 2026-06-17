import { ChampionsPanel } from "@/components/ChampionsPanel";
import { KeyedPageHeader } from "@/components/KeyedPageHeader";

export const metadata = {
  title: "Champion Teachers | Dot Lens",
  description:
    "Recommend and grow local champion teachers from real usage data so tactile education sustains itself.",
};

export default function ChampionsPage() {
  return (
    <>
      <KeyedPageHeader
        eyebrowKey="nav.champions"
        titleKey="champion.title"
        descriptionKey="champion.description"
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <ChampionsPanel />
      </div>
    </>
  );
}

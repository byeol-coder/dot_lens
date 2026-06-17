import { Suspense } from "react";
import { TeachingGuideView } from "@/components/TeachingGuideView";

export const metadata = {
  title: "Teaching Guide | Dot Lens",
  description: "Step-by-step guide for teachers on how to use tactile materials in class.",
};

export default function TeachingGuidePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-10 sm:px-6" />}>
      <TeachingGuideView />
    </Suspense>
  );
}

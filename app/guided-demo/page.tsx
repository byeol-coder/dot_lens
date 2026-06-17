import type { Metadata } from "next";
import { GuidedDemo } from "@/components/GuidedDemo";

export const metadata: Metadata = {
  title: "Guided Demo | Dot Lens",
  description: "Experience the complete Dot Lens workflow in 8 guided steps — from classroom diagram to tactile lesson.",
};

export default function GuidedDemoPage() {
  return <GuidedDemo />;
}

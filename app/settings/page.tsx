import { PageHeader } from "@/components/PageScaffold";
import { AccessibilitySettings } from "@/components/AccessibilitySettings";
import { LocalizationPanel } from "@/components/LocalizationPanel";
import { LearnerProfileCard } from "@/components/LearnerProfileCard";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Settings"
        eyebrowKo="설정"
        title="Set the platform to match the teacher and learner"
        titleKo="교사와 학생에 맞게 플랫폼을 설정하세요"
        description="Display preferences apply live across the whole platform and are saved on this device."
        descriptionKo="화면 설정은 플랫폼 전체에 즉시 적용되며 이 기기에 저장됩니다."
      />
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
        <AccessibilitySettings />
        <LocalizationPanel />
        <LearnerProfileCard />
      </div>
    </>
  );
}

import { PageHeader } from "@/components/PageScaffold";
import { ScreenCard } from "@/components/ScreenCard";
import { AccessibilitySettings } from "@/components/AccessibilitySettings";

const LEARNER_SETTINGS = [
  { label: "Braille standard", labelKo: "점자 규격", value: "UEB Grade 2" },
  { label: "Braille language", labelKo: "점자 언어", value: "English" },
  { label: "Speech rate", labelKo: "말 속도", value: "Normal" },
  { label: "Hint frequency", labelKo: "힌트 빈도", value: "On request" },
];

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Settings · accessibility"
        title="Set the platform to match the teacher and learner"
        titleKo="교사와 학생에 맞게 플랫폼 설정"
        description="Display preferences below apply live across the whole platform; per-learner braille and speech profiles are illustrative in this phase."
      />
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
        <AccessibilitySettings />

        <ScreenCard eyebrow="Per-learner profile" title="Braille & speech">
          <dl className="divide-y divide-line">
            {LEARNER_SETTINGS.map((s) => (
              <div key={s.label} className="flex items-center justify-between py-3">
                <dt>
                  <span className="text-[14px] text-ink">{s.label}</span>
                  <span className="ml-2 font-mono text-[11px] text-faint">{s.labelKo}</span>
                </dt>
                <dd className="font-mono text-[13px] text-accent">{s.value}</dd>
              </div>
            ))}
          </dl>
        </ScreenCard>
      </div>
    </>
  );
}

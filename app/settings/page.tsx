import { PageHeader, ComingNext } from "@/components/PageScaffold";
import { ScreenCard } from "@/components/ScreenCard";

const SETTINGS = [
  { label: "Braille standard", labelKo: "점자 규격", value: "UEB Grade 2" },
  { label: "Braille language", labelKo: "점자 언어", value: "English" },
  { label: "Speech rate", labelKo: "말 속도", value: "Normal" },
  { label: "Hint frequency", labelKo: "힌트 빈도", value: "On request" },
  { label: "High contrast", labelKo: "고대비", value: "On" },
];

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Settings · accessibility"
        title="Set braille and speech to match the student"
        titleKo="학생에 맞게 점자와 음성 설정"
        description="Per-student accessibility preferences. Controls are illustrative in this phase."
        phase={2}
      />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <ScreenCard eyebrow="Preferences" title="Accessibility">
          <dl className="divide-y divide-line">
            {SETTINGS.map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between py-3"
              >
                <dt>
                  <span className="text-[14px] text-ink">{s.label}</span>
                  <span className="ml-2 font-mono text-[11px] text-faint">
                    {s.labelKo}
                  </span>
                </dt>
                <dd className="font-mono text-[13px] text-accent">{s.value}</dd>
              </div>
            ))}
          </dl>
        </ScreenCard>

        <div className="mt-6">
          <ComingNext
            points={[
              "Working toggles for braille grade, language, speech, and contrast.",
              "Live preview that applies changes immediately and announces them.",
            ]}
          />
        </div>
      </div>
    </>
  );
}

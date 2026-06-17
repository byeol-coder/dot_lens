"use client";

import { ScreenCard } from "@/components/ScreenCard";
import { useT, useLang } from "@/lib/i18n";

/** Per-learner accessibility profile — single language, no bilingual labels. */
export function LearnerProfileCard() {
  const { t } = useT();
  const { lang } = useLang();
  const ko = lang === "ko";
  const on = t("settings.on");

  const rows: { label: string; value: string }[] = [
    { label: t("settings.brailleStandard"), value: "UEB Grade 2" },
    { label: t("settings.brailleLanguage"), value: ko ? "영어" : "English" },
    { label: t("settings.speechRate"), value: ko ? "보통" : "Normal" },
    { label: t("settings.hintFrequency"), value: ko ? "요청 시" : "On request" },
    { label: t("settings.audioGuidance"), value: on },
    { label: t("settings.brailleDisplay"), value: ko ? "20칸" : "20-cell" },
    { label: t("settings.dotpadPreview"), value: on },
  ];

  return (
    <ScreenCard eyebrow={t("settings.learnerProfile")} title={t("settings.learnerProfile")}>
      <dl className="divide-y divide-line">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between py-3">
            <dt className="text-[14px] text-ink">{r.label}</dt>
            <dd className="font-mono text-[13px] text-accent">{r.value}</dd>
          </div>
        ))}
      </dl>
    </ScreenCard>
  );
}

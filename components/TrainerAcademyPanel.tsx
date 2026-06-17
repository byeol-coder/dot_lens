"use client";

import { useState } from "react";
import { WorldPartnerMap } from "@/components/WorldPartnerMap";
import {
  CREDENTIAL_TIERS,
  TRAINER_PIPELINE,
  PARTNER_STATUS_META,
  PARTNER_TYPE_LABEL,
  COUNTRY_PARTNERS,
  buildTrainerProfiles,
  programRollup,
  type TierKey,
  type CountryPartner,
  type TrainerProfile,
  type ProgramRollup,
} from "@/lib/certification";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const TIER_META: Record<TierKey, { mark: string; cls: string }> = {
  l1: { mark: "①", cls: "border-line bg-surface-sunk text-muted" },
  l2: { mark: "②", cls: "border-accent bg-accent-tint text-accent" },
  trainer: { mark: "★", cls: "border-verify bg-verify-tint text-verify" },
};

function tierName(key: TierKey, lang: "en" | "ko") {
  const t = CREDENTIAL_TIERS.find((c) => c.key === key)!;
  return lang === "ko" ? t.name.ko : t.name.en;
}

/* ── Headline rollup ─────────────────────────────────────────────────────── */
function Rollup({ r }: { r: ProgramRollup }) {
  const { lang } = useLang();
  const tr = (en: string, ko: string) => (lang === "ko" ? ko : en);
  const items = [
    { v: r.countries, label: tr("Countries", "참여 국가") },
    { v: r.activePartners, label: tr("Active partners", "활성 파트너") },
    { v: r.certifiedTrainers, label: tr("Certified trainers", "공인 트레이너") },
    { v: r.trainerCandidates, label: tr("Trainer candidates", "트레이너 후보") },
    { v: r.studentsReached, label: tr("Students reached", "도달 학생") },
  ];
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((it) => (
        <div key={it.label} className="rounded-2xl border border-line bg-surface p-4 shadow-card">
          <dd className="font-display text-[26px] font-semibold leading-none text-ink">{it.v}</dd>
          <dt className="mt-1.5 text-[12px] text-muted">{it.label}</dt>
        </div>
      ))}
    </dl>
  );
}

/* ── Credential ladder ───────────────────────────────────────────────────── */
function CredentialLadder() {
  const { lang } = useLang();
  const tr = (en: string, ko: string) => (lang === "ko" ? ko : en);
  return (
    <ol className="grid gap-4 lg:grid-cols-3" aria-label={tr("Credential ladder", "인증 사다리")}>
      {CREDENTIAL_TIERS.map((tier, i) => {
        const m = TIER_META[tier.key];
        const isTop = tier.key === "trainer";
        return (
          <li key={tier.key} className="relative">
            <article
              className={cn(
                "flex h-full flex-col rounded-2xl border bg-surface p-5 shadow-card",
                isTop ? "border-verify ring-1 ring-verify/40" : "border-line"
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-semibold",
                    m.cls
                  )}
                >
                  <span aria-hidden>{m.mark}</span>
                  {tr("Tier", "등급")} {tier.rung}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-eyebrow text-faint">
                  {tier.analog}
                </span>
              </div>
              <h3 className="mt-3 text-[16px] font-semibold leading-tight text-ink">
                {lang === "ko" ? tier.name.ko : tier.name.en}
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">
                {lang === "ko" ? tier.summary.ko : tier.summary.en}
              </p>

              <p className="mt-4 font-mono text-[10px] uppercase tracking-eyebrow text-accent">
                {tr("Requirements", "취득 요건")}
              </p>
              <ul className="mt-2 space-y-1.5">
                {tier.requirements.map((req, j) => (
                  <li key={j} className="flex items-start gap-2 text-[12.5px] text-ink">
                    <span className="mt-0.5 font-mono text-[11px] text-faint" aria-hidden>
                      {String(j + 1).padStart(2, "0")}
                    </span>
                    <span>
                      {lang === "ko" ? req.label.ko : req.label.en}
                      <span className="ml-1 text-faint">
                        · {lang === "ko" ? req.metric.ko : req.metric.en}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-4 font-mono text-[10px] uppercase tracking-eyebrow text-verify">
                {tr("Unlocks", "부여 권한")}
              </p>
              <ul className="mt-2 space-y-1">
                {tier.unlocks.map((u, k) => (
                  <li key={k} className="flex items-start gap-2 text-[12.5px] text-muted">
                    <span className="mt-0.5 font-bold text-verify" aria-hidden>+</span>
                    {lang === "ko" ? u.ko : u.en}
                  </li>
                ))}
              </ul>
            </article>
            {i < CREDENTIAL_TIERS.length - 1 && (
              <span
                className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-faint lg:block"
                aria-hidden
              >
                →
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ── Trainer application pipeline ────────────────────────────────────────── */
function Pipeline() {
  const { lang } = useLang();
  return (
    <ol
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6"
      aria-label={lang === "ko" ? "트레이너 신청 절차" : "Trainer application pipeline"}
    >
      {TRAINER_PIPELINE.map((s, i) => (
        <li
          key={s.key}
          className="flex h-full flex-col rounded-xl border border-line bg-surface p-3.5 shadow-card"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[12px] font-semibold text-accent">
              {String(s.step).padStart(2, "0")}
            </span>
            {i < TRAINER_PIPELINE.length - 1 && (
              <span className="text-faint" aria-hidden>→</span>
            )}
          </div>
          <h4 className="mt-1.5 text-[13.5px] font-semibold leading-tight text-ink">
            {lang === "ko" ? s.label.ko : s.label.en}
          </h4>
          <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
            {lang === "ko" ? s.detail.ko : s.detail.en}
          </p>
        </li>
      ))}
    </ol>
  );
}

/* ── Trainer directory ───────────────────────────────────────────────────── */
function TrainerDirectory({ trainers }: { trainers: TrainerProfile[] }) {
  const { lang } = useLang();
  const tr = (en: string, ko: string) => (lang === "ko" ? ko : en);
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
      <table className="w-full min-w-[640px] text-left text-[13px]">
        <caption className="sr-only">
          {tr("Trainer directory with credential tier and next step", "인증 등급과 다음 단계가 포함된 트레이너 디렉터리")}
        </caption>
        <thead>
          <tr className="border-b border-line text-[11px] uppercase tracking-eyebrow text-faint">
            <th scope="col" className="px-4 py-3 font-mono font-medium">{tr("Teacher", "교사")}</th>
            <th scope="col" className="px-4 py-3 font-mono font-medium">{tr("Country", "국가")}</th>
            <th scope="col" className="px-4 py-3 font-mono font-medium">{tr("Tier", "등급")}</th>
            <th scope="col" className="px-4 py-3 font-mono font-medium">{tr("Peers trained", "동료 교육")}</th>
            <th scope="col" className="px-4 py-3 font-mono font-medium">{tr("Next step", "다음 단계")}</th>
          </tr>
        </thead>
        <tbody>
          {trainers.map((t) => {
            const m = TIER_META[t.tier];
            return (
              <tr key={t.teacherId} className="border-b border-line/70 last:border-0">
                <th scope="row" className="px-4 py-3 font-medium text-ink">
                  {t.teacherName}
                  <span className="block text-[11px] font-normal text-faint">{t.school}</span>
                </th>
                <td className="px-4 py-3 text-muted">{t.country}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                      m.cls
                    )}
                  >
                    <span aria-hidden>{m.mark}</span>
                    {tierName(t.tier, lang)}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-ink">{t.peerTrainingCount}</td>
                <td className="px-4 py-3 text-muted">{lang === "ko" ? t.nextStep.ko : t.nextStep.en}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Country partner network ─────────────────────────────────────────────── */
function PartnerNetwork({ partners }: { partners: CountryPartner[] }) {
  const { lang } = useLang();
  const tr = (en: string, ko: string) => (lang === "ko" ? ko : en);
  const sorted = [...partners].sort(
    (a, b) => PARTNER_STATUS_META[b.status].order - PARTNER_STATUS_META[a.status].order
  );
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sorted.map((p) => {
        const sm = PARTNER_STATUS_META[p.status];
        return (
          <article key={p.partnerId} className="flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-card">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-mono text-[11px] uppercase tracking-eyebrow text-accent">
                  {lang === "ko" ? p.countryKo : p.country}
                </p>
                <h3 className="mt-0.5 truncate text-[15px] font-semibold text-ink">{p.org}</h3>
                <p className="truncate text-[12px] text-muted">
                  {p.region} · {lang === "ko" ? PARTNER_TYPE_LABEL[p.type].ko : PARTNER_TYPE_LABEL[p.type].en}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line bg-surface-sunk px-2.5 py-1 text-[11px] font-semibold text-ink">
                <span aria-hidden>{sm.mark}</span>
                {lang === "ko" ? sm.label.ko : sm.label.en}
              </span>
            </div>

            <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                { v: p.certifiedTrainers, l: tr("Trainers", "트레이너") },
                { v: p.trainerCandidates, l: tr("Candidates", "후보") },
                { v: p.activeTeachers, l: tr("Teachers", "교사") },
              ].map((s) => (
                <div key={s.l} className="rounded-xl bg-surface-sunk/70 py-2">
                  <dd className="font-display text-[18px] font-semibold text-ink">{s.v}</dd>
                  <dt className="text-[10.5px] text-muted">{s.l}</dt>
                </div>
              ))}
            </dl>

            <p className="mt-3 text-[12px] text-muted">
              <span className="text-faint">{tr("Lead trainer", "리드 트레이너")}: </span>
              {p.leadTrainer ?? tr("— to be appointed", "— 지정 예정")}
            </p>
          </article>
        );
      })}
    </div>
  );
}

/* ── Panel ───────────────────────────────────────────────────────────────── */
export function TrainerAcademyPanel() {
  const { lang } = useLang();
  const tr = (en: string, ko: string) => (lang === "ko" ? ko : en);
  const [partners] = useState<CountryPartner[]>(COUNTRY_PARTNERS);
  const [trainers] = useState<TrainerProfile[]>(() => buildTrainerProfiles());
  const [rollup] = useState<ProgramRollup>(() => programRollup());

  return (
    <div className="space-y-12">
      <Rollup r={rollup} />

      <section aria-labelledby="ladder-heading">
        <header className="mb-4">
          <p className="eyebrow">{tr("Credential ladder", "인증 사다리")}</p>
          <h2 id="ladder-heading" className="mt-1 text-[20px] font-semibold text-ink">
            {tr("How a teacher becomes a trainer", "교사가 트레이너가 되는 단계")}
          </h2>
          <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-muted">
            {tr(
              "Each tier is earned from real teaching evidence, not a one-off exam. The top tier — Certified Tactile Trainer — can train other teachers, the way a Google Certified Trainer can.",
              "각 등급은 단발성 시험이 아니라 실제 수업 근거로 취득합니다. 최상위 ‘공인 촉각 트레이너’는 Google 인증 트레이너처럼 다른 교사를 교육할 수 있습니다."
            )}
          </p>
        </header>
        <CredentialLadder />
      </section>

      <section aria-labelledby="pipeline-heading">
        <header className="mb-4">
          <p className="eyebrow">{tr("Trainer application", "트레이너 신청")}</p>
          <h2 id="pipeline-heading" className="mt-1 text-[20px] font-semibold text-ink">
            {tr("From application to recertification", "신청부터 재인증까지")}
          </h2>
          <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-muted">
            {tr(
              "An L2 teacher applies, passes a skills assessment, submits a training demo video, and — once approved — is listed and recertifies each year.",
              "L2 교사가 신청 후 역량 평가를 통과하고 교육 시연 영상을 제출하면, 승인 시 디렉터리에 등재되고 매년 재인증합니다."
            )}
          </p>
        </header>
        <Pipeline />
      </section>

      <section aria-labelledby="directory-heading">
        <header className="mb-4 flex items-baseline justify-between">
          <div>
            <p className="eyebrow">{tr("Trainer directory", "트레이너 디렉터리")}</p>
            <h2 id="directory-heading" className="mt-1 text-[20px] font-semibold text-ink">
              {tr("Trainers & candidates by tier", "등급별 트레이너·후보")}
            </h2>
          </div>
        </header>
        <TrainerDirectory trainers={trainers} />
      </section>

      <section aria-labelledby="partners-heading">
        <header className="mb-4">
          <p className="eyebrow">{tr("Country partner network", "각국 파트너 네트워크")}</p>
          <h2 id="partners-heading" className="mt-1 text-[20px] font-semibold text-ink">
            {tr("Where the program runs locally", "현지에서 운영되는 거점")}
          </h2>
          <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-muted">
            {tr(
              "Schools, NGOs, and mission organizations host the program in each country. As partners grow trainers, they move from prospective → onboarding → authorized center → regional hub.",
              "각국의 학교·비영리·선교 기관이 현지에서 프로그램을 운영합니다. 트레이너가 늘면 관심 → 온보딩 → 공인 센터 → 지역 허브로 성장합니다."
            )}
          </p>
        </header>
        <div className="space-y-6">
          <WorldPartnerMap partners={partners} />
          <PartnerNetwork partners={partners} />
        </div>
      </section>
    </div>
  );
}

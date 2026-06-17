"use client";

import { useEffect, useState } from "react";
import { dataSource } from "@/lib/dataSource";
import type { ChampionTeacherRecord } from "@/lib/mockPlatformData";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const STATUS_META: Record<
  ChampionTeacherRecord["championStatus"],
  { en: string; ko: string; cls: string; mark: string }
> = {
  champion: { en: "Champion", ko: "챔피언", cls: "border-verify bg-verify-tint text-verify", mark: "★" },
  candidate: { en: "Candidate", ko: "후보", cls: "border-accent bg-accent-tint text-accent", mark: "◐" },
  none: { en: "Active teacher", ko: "활동 교사", cls: "border-line bg-surface-sunk text-muted", mark: "○" },
};

/** Composite-score contributors, surfaced so a recommendation is explainable. */
function scoreFactors(t: ChampionTeacherRecord, lang: "en" | "ko") {
  const tr = (en: string, ko: string) => (lang === "ko" ? ko : en);
  return [
    { label: tr("Lessons used in class", "수업 활용"), value: `${t.totalLessonsUsed}/${t.totalLessonsCreated}`, weight: t.totalLessonsCreated ? t.totalLessonsUsed / t.totalLessonsCreated : 0 },
    { label: tr("Feedback rate", "피드백 입력률"), value: `${Math.round(t.feedbackRate * 100)}%`, weight: t.feedbackRate },
    { label: tr("Review pass rate", "검수 통과율"), value: `${Math.round(t.reviewPassRate * 100)}%`, weight: t.reviewPassRate },
    { label: tr("Workshops attended", "워크숍 참여"), value: `${t.workshopParticipation}`, weight: Math.min(1, t.workshopParticipation / 3) },
    { label: tr("Peers trained", "동료 교육"), value: `${t.peerTrainingCount}`, weight: Math.min(1, t.peerTrainingCount / 5) },
  ];
}

function recommendation(t: ChampionTeacherRecord, lang: "en" | "ko"): string {
  const tr = (en: string, ko: string) => (lang === "ko" ? ko : en);
  if (t.championStatus === "champion")
    return tr(
      `Already mentoring peers (${t.peerTrainingCount} trained). Keep as regional lead.`,
      `이미 동료 ${t.peerTrainingCount}명을 교육 중입니다. 지역 리더로 유지하세요.`
    );
  if (t.championStatus === "candidate")
    return tr(
      `Strong usage and review record — recommend for the next champion workshop.`,
      `활용·검수 실적이 우수합니다. 다음 챔피언 워크숍 대상으로 추천합니다.`
    );
  return tr(
    `Building momentum — encourage feedback logging and a first workshop.`,
    `성장 중입니다. 피드백 입력과 첫 워크숍 참여를 권장합니다.`
  );
}

function ChampionCard({ t }: { t: ChampionTeacherRecord }) {
  const { lang } = useLang();
  const meta = STATUS_META[t.championStatus];
  const factors = scoreFactors(t, lang);

  return (
    <article className="flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-card">
      <div className="flex items-start gap-3">
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-tint font-display text-[14px] font-semibold text-accent"
          aria-hidden
        >
          {t.avatarInitials}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-ink">{t.teacherName}</h3>
          <p className="truncate text-[12px] text-muted">
            {t.school} · {t.country}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
            meta.cls
          )}
        >
          <span aria-hidden>{meta.mark}</span>
          {lang === "ko" ? meta.ko : meta.en}
        </span>
      </div>

      {/* Composite score */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-mono uppercase tracking-eyebrow text-faint">
              {lang === "ko" ? "챔피언 점수" : "Champion score"}
            </span>
            <span className="font-mono font-semibold text-accent">{t.score}/100</span>
          </div>
          <div
            className="mt-1 h-2 overflow-hidden rounded-full bg-surface-sunk"
            role="meter"
            aria-valuenow={t.score}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${t.teacherName} champion score ${t.score} of 100`}
          >
            <div className="h-full rounded-full bg-accent" style={{ width: `${t.score}%` }} />
          </div>
        </div>
      </div>

      {/* Factor breakdown */}
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
        {factors.map((f) => (
          <div key={f.label} className="flex items-center justify-between gap-2">
            <dt className="truncate text-[12px] text-muted">{f.label}</dt>
            <dd className="font-mono text-[12px] font-medium text-ink">{f.value}</dd>
          </div>
        ))}
      </dl>

      {/* Recommendation */}
      <div className="mt-4 rounded-xl border border-line bg-surface-sunk/60 p-3">
        <p className="text-[12px] font-semibold text-ink">
          {lang === "ko" ? "추천 액션" : "Recommended action"}
        </p>
        <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">
          {recommendation(t, lang)}
        </p>
      </div>
    </article>
  );
}

export function ChampionsPanel() {
  const { lang } = useLang();
  const [teachers, setTeachers] = useState<ChampionTeacherRecord[] | null>(null);

  // Reads through the data-source abstraction (mock today, backend later).
  useEffect(() => {
    let alive = true;
    dataSource.getChampions().then((data) => {
      if (alive) setTeachers(data);
    });
    return () => {
      alive = false;
    };
  }, []);

  const tr = (en: string, ko: string) => (lang === "ko" ? ko : en);

  const champions = teachers?.filter((t) => t.championStatus === "champion") ?? [];
  const candidates = teachers?.filter((t) => t.championStatus === "candidate") ?? [];
  const growing = teachers?.filter((t) => t.championStatus === "none") ?? [];

  return (
    <div className="space-y-10">
      {/* Pathway explainer */}
      <section
        aria-labelledby="pathway-heading"
        className="rounded-2xl border border-line bg-surface p-6 shadow-card"
      >
        <h2 id="pathway-heading" className="text-[17px] font-semibold text-ink">
          {tr("The champion-teacher pathway", "챔피언 교사 양성 경로")}
        </h2>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          {tr(
            "Candidates are ranked from real usage — not surveys. Consistent teaching, feedback, review passes, and peer training move a teacher toward leading their own region.",
            "후보는 설문이 아니라 실제 활용 데이터로 선정됩니다. 꾸준한 수업·피드백·검수 통과·동료 교육이 교사를 지역 리더로 성장시킵니다."
          )}
        </p>
        <ol className="mt-4 flex flex-wrap items-center gap-2">
          {(["none", "candidate", "champion"] as const).map((st, i) => {
            const m = STATUS_META[st];
            return (
              <li key={st} className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-semibold",
                    m.cls
                  )}
                >
                  <span aria-hidden>{m.mark}</span>
                  {lang === "ko" ? m.ko : m.en}
                </span>
                {i < 2 && (
                  <span className="text-faint" aria-hidden>
                    →
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {!teachers && (
        <p className="text-[14px] text-muted" role="status">
          {tr("Loading champion data…", "챔피언 데이터를 불러오는 중…")}
        </p>
      )}

      {teachers && (
        <>
          {/* Recommended next champions */}
          <section aria-labelledby="rec-heading">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 id="rec-heading" className="text-[17px] font-semibold text-ink">
                {tr("Recommended for next champion workshop", "다음 챔피언 워크숍 추천 대상")}
              </h2>
              <span className="font-mono text-[12px] text-faint">
                {candidates.length} {tr("candidates", "후보")}
              </span>
            </div>
            {candidates.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {candidates.map((t) => (
                  <ChampionCard key={t.teacherId} t={t} />
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-line bg-surface-sunk/60 p-4 text-[13px] text-muted">
                {tr("No candidates yet. As teachers log lessons and feedback, candidates appear here.", "아직 후보가 없습니다. 교사가 수업과 피드백을 기록하면 후보가 표시됩니다.")}
              </p>
            )}
          </section>

          {/* Current champions */}
          <section aria-labelledby="champ-heading">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 id="champ-heading" className="text-[17px] font-semibold text-ink">
                {tr("Active champion teachers", "활동 중인 챔피언 교사")}
              </h2>
              <span className="font-mono text-[12px] text-faint">
                {champions.length} {tr("champions", "명")}
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {champions.map((t) => (
                <ChampionCard key={t.teacherId} t={t} />
              ))}
            </div>
          </section>

          {/* Growing teachers */}
          {growing.length > 0 && (
            <section aria-labelledby="grow-heading">
              <h2 id="grow-heading" className="mb-3 text-[17px] font-semibold text-ink">
                {tr("Growing teachers", "성장 중인 교사")}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {growing.map((t) => (
                  <ChampionCard key={t.teacherId} t={t} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

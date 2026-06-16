"use client";

import { CHAMPION_TEACHERS, LESSON_USAGE_DATA, FIELD_REPORTS, PLATFORM_STATS } from "@/lib/mockPlatformData";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

function RateBar({ value, label }: { value: number; label: string }) {
  const pct = Math.round(value * 100);
  return (
    <div>
      <div className="flex justify-between text-[12px] mb-1">
        <span className="text-muted">{label}</span>
        <span className="font-mono font-semibold text-ink">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-surface-sunk overflow-hidden" role="img" aria-label={`${label}: ${pct}%`}>
        <div
          className={cn("h-full rounded-full transition-all", pct >= 80 ? "bg-verify" : pct >= 60 ? "bg-accent" : "bg-warn")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function ChampionCard({ teacher }: { teacher: (typeof CHAMPION_TEACHERS)[0] }) {
  const { lang } = useLang();
  const badgeClass =
    teacher.championStatus === "champion"
      ? "bg-verify-tint text-verify border-verify/20"
      : teacher.championStatus === "candidate"
      ? "bg-pin-soft text-warn border-pin-soft"
      : "bg-surface-sunk text-muted border-line";

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-card space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent-tint text-[15px] font-semibold text-accent">
            {teacher.avatarInitials}
          </div>
          <div>
            <p className="font-semibold text-ink">{teacher.teacherName}</p>
            <p className="text-[12px] text-muted">{teacher.school}</p>
            <p className="text-[12px] text-muted">{teacher.country}</p>
          </div>
        </div>
        <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-semibold", badgeClass)}>
          {teacher.championStatus === "champion"
            ? "Champion"
            : teacher.championStatus === "candidate"
            ? lang === "ko" ? "후보" : "Candidate"
            : lang === "ko" ? "멤버" : "Member"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { v: teacher.totalLessonsCreated, l: lang === "ko" ? "생성" : "Created" },
          { v: teacher.totalLessonsUsed, l: lang === "ko" ? "수업 활용" : "Used" },
          { v: teacher.peerTrainingCount, l: lang === "ko" ? "동료 지원" : "Trained" },
        ].map(({ v, l }) => (
          <div key={l} className="rounded-xl bg-surface-sunk p-2">
            <p className="text-[18px] font-semibold text-ink">{v}</p>
            <p className="text-[11px] text-muted">{l}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <RateBar value={teacher.feedbackRate} label={lang === "ko" ? "피드백 입력률" : "Feedback Rate"} />
        <RateBar value={teacher.reviewPassRate} label={lang === "ko" ? "검수 통과율" : "Review Pass Rate"} />
      </div>

      <div className="flex items-center justify-between rounded-xl bg-surface-sunk px-3 py-2">
        <span className="text-[12px] text-muted">{lang === "ko" ? "워크숍 참여" : "Workshop Participation"}</span>
        <span className="font-mono text-[13px] font-semibold text-ink">{teacher.workshopParticipation}회</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="font-mono text-[12px] text-muted">{lang === "ko" ? "종합 점수" : "Champion Score"}</span>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-sunk">
            <div
              className={cn("h-full rounded-full", teacher.score >= 80 ? "bg-verify" : teacher.score >= 60 ? "bg-pin" : "bg-warn")}
              style={{ width: `${teacher.score}%` }}
            />
          </div>
          <span className="font-mono text-[13px] font-semibold text-ink">{teacher.score}</span>
        </div>
      </div>
    </div>
  );
}

function FieldReportCard({ report }: { report: (typeof FIELD_REPORTS)[0] }) {
  const { lang } = useLang();
  const date = new Date(report.date).toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-card space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-ink">{report.activistName}</p>
          <p className="text-[12px] text-muted">{report.region} · {report.country}</p>
          <p className="text-[11px] font-mono text-faint">{date}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-muted">{lang === "ko" ? "방문 학교" : "Schools"}</p>
          <p className="text-[20px] font-semibold text-ink">{report.schoolsVisited}</p>
        </div>
      </div>

      {report.issuesReported.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-warn">
            {lang === "ko" ? "현장 이슈" : "Issues Reported"}
          </p>
          <ul className="mt-1 space-y-1">
            {report.issuesReported.map((issue, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[12px] text-muted">
                <span className="mt-0.5 text-warn" aria-hidden>!</span>
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {report.workshopNeeds.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-accent">
            {lang === "ko" ? "워크숍 필요 항목" : "Workshop Needs"}
          </p>
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {report.workshopNeeds.map((need, i) => (
              <li key={i} className="rounded-full bg-accent-tint px-2.5 py-0.5 text-[11px] font-medium text-accent">
                {need}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="rounded-xl bg-surface-sunk p-3 text-[12px] italic leading-relaxed text-muted">
        "{report.notes}"
      </p>
    </div>
  );
}

export function FieldDataPanel() {
  const { lang } = useLang();

  const byCountry = LESSON_USAGE_DATA.reduce<Record<string, number>>((acc, l) => {
    acc[l.country] = (acc[l.country] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-10">
      {/* Platform Overview */}
      <section aria-labelledby="impact-heading">
        <h2 id="impact-heading" className="text-[17px] font-semibold text-ink">
          {lang === "ko" ? "플랫폼 영향력 현황" : "Platform Impact Overview"}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              v: PLATFORM_STATS.countriesActive,
              l: lang === "ko" ? "활동 국가" : "Countries Active",
              sub: "India · Nigeria · Zambia",
            },
            {
              v: PLATFORM_STATS.totalTeachers,
              l: lang === "ko" ? "참여 교사 수" : "Teachers",
              sub: lang === "ko" ? "3개국 18명" : "18 across 3 countries",
            },
            {
              v: PLATFORM_STATS.usedInClass,
              l: lang === "ko" ? "실제 수업 활용 자료" : "Lessons Used in Class",
              sub: `${Math.round((PLATFORM_STATS.usedInClass / PLATFORM_STATS.totalLessonsCreated) * 100)}% utilization`,
            },
            {
              v: Math.round(PLATFORM_STATS.expertReviewCompletionRate * 100) + "%",
              l: lang === "ko" ? "전문가 검수 완료율" : "Review Completion",
              sub: lang === "ko" ? "전문가 검수 완료" : "of submitted materials",
            },
          ].map(({ v, l, sub }) => (
            <div key={l} className="rounded-2xl border border-line bg-surface p-5 shadow-card">
              <p className="text-[12px] uppercase tracking-eyebrow text-muted">{l}</p>
              <p className="mt-1 text-3xl font-semibold text-ink">{v}</p>
              <p className="mt-0.5 text-[12px] text-muted">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* By Country */}
      <section aria-labelledby="country-heading">
        <h2 id="country-heading" className="text-[17px] font-semibold text-ink">
          {lang === "ko" ? "국가별 수업 자료 생성 현황" : "Lessons Created by Country"}
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {Object.entries(byCountry).map(([country, count]) => (
            <div key={country} className="rounded-2xl border border-line bg-surface px-6 py-4 shadow-card">
              <p className="text-[13px] font-semibold text-ink">{country}</p>
              <p className="text-2xl font-semibold text-accent">{count}</p>
              <p className="text-[11px] text-muted">{lang === "ko" ? "수업 자료" : "lessons"}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Champion Teachers */}
      <section aria-labelledby="champions-heading">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="champions-heading" className="text-[17px] font-semibold text-ink">
              {lang === "ko" ? "챔피언 교사 현황" : "Champion Teacher Program"}
            </h2>
            <p className="mt-1 text-[13px] text-muted">
              {lang === "ko"
                ? "플랫폼을 주도적으로 활용하고 동료를 이끄는 핵심 교사 후보 및 챔피언 교사입니다."
                : "Teachers who actively lead tactile education and help peers grow."}
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CHAMPION_TEACHERS.map((t) => (
            <ChampionCard key={t.teacherId} teacher={t} />
          ))}
        </div>

        {/* Champion criteria */}
        <div className="mt-6 rounded-2xl border border-line bg-surface p-5 shadow-card">
          <h3 className="text-[14px] font-semibold text-ink">
            {lang === "ko" ? "챔피언 교사 선정 기준" : "Champion Teacher Criteria"}
          </h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [lang === "ko" ? "10개 이상 수업 자료 생성" : "10+ lessons created", "verify"],
              [lang === "ko" ? "실제 수업 활용 기록" : "Used in actual classes", "verify"],
              [lang === "ko" ? "피드백 입력률 80% 이상" : "80%+ feedback rate", "accent"],
              [lang === "ko" ? "전문가 검수 통과율 80% 이상" : "80%+ review pass rate", "accent"],
              [lang === "ko" ? "동료 교사 지원 이력" : "Peer teacher training", "pin"],
              [lang === "ko" ? "워크숍 참여 2회 이상" : "2+ workshop attendances", "pin"],
            ].map(([text, color]) => (
              <li key={text as string} className="flex items-start gap-2 text-[12px]">
                <span
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0 rounded-full text-center text-[9px] font-bold text-white leading-4",
                    color === "verify" ? "bg-verify" : color === "accent" ? "bg-accent" : "bg-pin"
                  )}
                  aria-hidden
                >
                  ✓
                </span>
                <span className="text-muted">{text as string}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Field Reports */}
      <section aria-labelledby="field-reports-heading">
        <h2 id="field-reports-heading" className="text-[17px] font-semibold text-ink">
          {lang === "ko" ? "현장 활동 보고서" : "Field Activity Reports"}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {FIELD_REPORTS.map((r) => (
            <FieldReportCard key={r.reportId} report={r} />
          ))}
        </div>
      </section>
    </div>
  );
}

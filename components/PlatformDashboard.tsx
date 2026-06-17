"use client";

import { PLATFORM_STATS, CHAMPION_TEACHERS, LESSON_USAGE_DATA } from "@/lib/mockPlatformData";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import Link from "next/link";

function StatCard({
  label,
  labelKo,
  value,
  sub,
  accent,
}: {
  label: string;
  labelKo: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  const { lang } = useLang();
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface p-5 shadow-card",
        accent && "border-accent/20 bg-accent-tint"
      )}
    >
      <p className="text-[12px] font-medium uppercase tracking-eyebrow text-muted">
        {lang === "ko" ? labelKo : label}
      </p>
      <p className={cn("mt-1 text-3xl font-semibold", accent ? "text-accent" : "text-ink")}>
        {value}
      </p>
      {sub && <p className="mt-1 text-[12px] text-muted">{sub}</p>}
    </div>
  );
}

function SubjectBar({ subject, count, max }: { subject: string; count: number; max: number }) {
  const pct = Math.round((count / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-[13px] font-medium text-ink">{subject}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-sunk" role="img" aria-label={`${subject}: ${count} lessons`}>
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-right text-[12px] font-mono text-muted">{count}</span>
    </div>
  );
}

function ChampionRow({ teacher }: { teacher: (typeof CHAMPION_TEACHERS)[0] }) {
  const { lang } = useLang();
  const badgeClass =
    teacher.championStatus === "champion"
      ? "bg-verify-tint text-verify border-verify/20"
      : teacher.championStatus === "candidate"
      ? "bg-pin-soft text-warn border-pin-soft"
      : "bg-surface-sunk text-muted border-line";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-tint text-[13px] font-semibold text-accent">
        {teacher.avatarInitials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-ink">{teacher.teacherName}</p>
        <p className="truncate text-[11px] text-muted">
          {teacher.school} · {teacher.country}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span
          className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", badgeClass)}
        >
          {teacher.championStatus === "champion"
            ? lang === "ko" ? "챔피언" : "Champion"
            : teacher.championStatus === "candidate"
            ? lang === "ko" ? "후보" : "Candidate"
            : lang === "ko" ? "멤버" : "Member"}
        </span>
        <span className="text-[11px] font-mono text-muted">{lang === "ko" ? "점수" : "Score"} {teacher.score}</span>
      </div>
    </div>
  );
}

export function PlatformDashboard() {
  const { lang } = useLang();
  const stats = PLATFORM_STATS;
  const maxSubject = Math.max(...stats.topSubjects.map((s) => s.count));
  const recentLessons = LESSON_USAGE_DATA.slice(0, 4);

  return (
    <div className="space-y-10">
      {/* Stat overview */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          {lang === "ko" ? "플랫폼 현황" : "Platform Overview"}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard
            label="Lessons Created"
            labelKo="생성된 수업 자료"
            value={stats.totalLessonsCreated}
            accent
          />
          <StatCard
            label="Pending Review"
            labelKo="검수 대기"
            value={stats.pendingReview}
            sub={lang === "ko" ? "전문가 검수 필요" : "Needs expert attention"}
          />
          <StatCard
            label="Used in Class"
            labelKo="실제 수업 활용"
            value={stats.usedInClass}
            sub={lang === "ko" ? `${Math.round((stats.usedInClass / stats.totalLessonsCreated) * 100)}% 활용` : `${Math.round((stats.usedInClass / stats.totalLessonsCreated) * 100)}% utilisation`}
          />
          <StatCard label="Teachers" labelKo="참여 교사" value={stats.totalTeachers} />
          <StatCard
            label="Student Sessions"
            labelKo="학생 학습 세션"
            value={stats.totalStudentSessions}
          />
          <StatCard
            label="Countries Active"
            labelKo="활동 국가"
            value={stats.countriesActive}
            sub="India · Nigeria · Zambia"
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Subject breakdown */}
        <section aria-labelledby="subjects-heading" className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <h2 id="subjects-heading" className="text-[15px] font-semibold text-ink">
            {lang === "ko" ? "과목별 수업 자료" : "Lessons by Subject"}
          </h2>
          <div className="mt-4 space-y-3">
            {stats.topSubjects.map((s) => (
              <SubjectBar key={s.subject} subject={s.subject} count={s.count} max={maxSubject} />
            ))}
          </div>
        </section>

        {/* Recent feedback */}
        <section aria-labelledby="feedback-heading" className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <h2 id="feedback-heading" className="text-[15px] font-semibold text-ink">
            {lang === "ko" ? "최근 피드백" : "Recent Feedback"}
          </h2>
          <ul className="mt-4 space-y-3">
            {stats.recentFeedback.map((fb, i) => (
              <li key={i} className="rounded-xl border border-line bg-paper p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-semibold text-ink">{fb.teacherName}</p>
                  <span className="flex gap-0.5" aria-label={`${fb.score} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n} className={n <= fb.score ? "text-pin" : "text-line"} aria-hidden>
                        ★
                      </span>
                    ))}
                  </span>
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-muted">{fb.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Needs improvement */}
        <section aria-labelledby="improve-heading" className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <h2 id="improve-heading" className="text-[15px] font-semibold text-ink">
            {lang === "ko" ? "개선 필요 콘텐츠" : "Needs Improvement"}
          </h2>
          <ul className="mt-4 space-y-3">
            {stats.needsImprovement.map((item) => (
              <li key={item.lessonId} className="rounded-xl border border-warn/20 bg-pin-soft/30 p-3">
                <p className="text-[12px] font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-warn">{item.reason}</p>
              </li>
            ))}
          </ul>
          <Link
            href="/expert-review"
            className="mt-4 block text-center rounded-xl border border-line bg-paper py-2 text-[13px] font-medium text-muted hover:text-ink hover:bg-surface-sunk transition-colors"
          >
            {lang === "ko" ? "전문가 검수 대기열 보기" : "View Expert Review Queue"}
          </Link>
        </section>
      </div>

      {/* Champion Teachers */}
      <section aria-labelledby="champion-heading">
        <div className="flex items-center justify-between">
          <h2 id="champion-heading" className="text-[17px] font-semibold text-ink">
            {lang === "ko" ? "챔피언 교사" : "Champion Teachers"}
          </h2>
          <Link
            href="/field-data"
            className="text-[13px] font-medium text-accent hover:underline"
          >
            {lang === "ko" ? "전체 현장 데이터 →" : "Full field data →"}
          </Link>
        </div>
        <p className="mt-1 text-[13px] text-muted">
          {lang === "ko"
            ? "플랫폼을 적극 활용하고 동료 교사를 이끄는 핵심 교사들입니다."
            : "Teachers who lead by example and help others grow in tactile education."}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CHAMPION_TEACHERS.slice(0, 3).map((t) => (
            <ChampionRow key={t.teacherId} teacher={t} />
          ))}
        </div>
      </section>

      {/* Recent lessons */}
      <section aria-labelledby="recent-lessons-heading">
        <div className="flex items-center justify-between">
          <h2 id="recent-lessons-heading" className="text-[17px] font-semibold text-ink">
            {lang === "ko" ? "최근 수업 자료" : "Recent Lessons"}
          </h2>
          <Link href="/lesson-library" className="text-[13px] font-medium text-accent hover:underline">
            {lang === "ko" ? "모두 보기 →" : "View all →"}
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full text-left text-[13px]" aria-label={lang === "ko" ? "최근 수업 자료 목록" : "Recent lessons table"}>
            <thead className="bg-surface-sunk">
              <tr>
                {[
                  ["Teacher", "교사"],
                  ["Subject", "과목"],
                  ["Grade", "학년"],
                  ["Country", "국가"],
                  ["Students", "학생"],
                  ["Status", "상태"],
                ].map(([en, ko]) => (
                  <th key={en} scope="col" className="px-4 py-3 font-semibold text-muted">
                    {lang === "ko" ? ko : en}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {recentLessons.map((l) => (
                <tr key={l.lessonId} className="bg-surface hover:bg-surface-sunk transition-colors">
                  <td className="px-4 py-3 font-medium text-ink">{l.teacherName}</td>
                  <td className="px-4 py-3 text-muted">{l.subject}</td>
                  <td className="px-4 py-3 text-muted">{l.grade}</td>
                  <td className="px-4 py-3 text-muted">{l.country}</td>
                  <td className="px-4 py-3 text-muted">{l.studentCount > 0 ? l.studentCount : "—"}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={l.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const { lang } = useLang();
  const map: Record<string, { label: string; labelKo: string; cls: string }> = {
    used_in_class: { label: "Used in Class", labelKo: "수업 활용", cls: "bg-verify-tint text-verify border-verify/20" },
    approved: { label: "Approved", labelKo: "승인", cls: "bg-accent-tint text-accent border-accent/20" },
    pending_review: { label: "Pending Review", labelKo: "검수 대기", cls: "bg-pin-soft text-warn border-pin-soft" },
    draft: { label: "Draft", labelKo: "초안", cls: "bg-surface-sunk text-muted border-line" },
  };
  const entry = map[status] ?? { label: status, labelKo: status, cls: "bg-surface-sunk text-muted border-line" };
  return (
    <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", entry.cls)}>
      {lang === "ko" ? entry.labelKo : entry.label}
    </span>
  );
}

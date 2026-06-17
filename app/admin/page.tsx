"use client";

import { PageHeader, ComingNext } from "@/components/PageScaffold";
import { MonitoringDashboard } from "@/components/MonitoringDashboard";
import { useLang } from "@/lib/i18n";

const CONTROLS = [
  {
    title: { en: "Per-OU enablement", ko: "조직 단위별 활성화" },
    body: {
      en: "Disabled by default until an admin enables it for an organizational unit.",
      ko: "기본 비활성화 상태이며, 관리자가 조직 단위별로 활성화합니다.",
    },
  },
  {
    title: { en: "AI analysis", ko: "AI 분석" },
    body: {
      en: "Admins control whether visual analysis runs, and in which data region.",
      ko: "관리자가 시각 자료 분석 실행 여부와 데이터 처리 지역을 제어합니다.",
    },
  },
  {
    title: { en: "Data minimization", ko: "데이터 최소화" },
    body: {
      en: "Only the specific image or region needed is sent — no broad page scraping.",
      ko: "필요한 이미지나 영역만 전송됩니다 — 전체 페이지 스크래핑 없음.",
    },
  },
  {
    title: { en: "Retention", ko: "데이터 보관" },
    body: {
      en: "Tactile packages and session logs follow the school's policy window, then purge.",
      ko: "촉각 패키지와 세션 로그는 학교의 보관 정책 기간을 따른 후 삭제됩니다.",
    },
  },
];

export default function AdminPage() {
  const { lang } = useLang();

  return (
    <>
      <PageHeader
        eyebrow="Admin · controls"
        eyebrowKo="관리자 · 제어 설정"
        title="Privacy and admin controls"
        titleKo="개인정보 및 관리자 제어"
        description="Assumptions for deployment on managed Chromebooks. Wiring connects in a later phase."
        descriptionKo="관리형 Chromebook 배포 기준 설정입니다. 실제 연결은 이후 단계에서 구성됩니다."
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {CONTROLS.map((c) => (
            <article
              key={c.title.en}
              className="rounded-2xl border border-line bg-surface p-5 shadow-card"
            >
              <h2 className="text-[15px] font-semibold text-ink">
                {lang === "ko" ? c.title.ko : c.title.en}
              </h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                {lang === "ko" ? c.body.ko : c.body.en}
              </p>
            </article>
          ))}
        </div>

        {/* Data collection & basic monitoring */}
        <section className="mt-10" aria-labelledby="monitoring-heading">
          <h2 id="monitoring-heading" className="text-[17px] font-semibold text-ink">
            {lang === "ko" ? "데이터 수집 · 기본 모니터링" : "Data collection & basic monitoring"}
          </h2>
          <p className="mt-1 mb-5 text-[13px] text-muted">
            {lang === "ko"
              ? "사용량·오류·피드백을 로컬에 기록하고, 정의된 성과 기준 대비 현황을 보여줍니다. (개인정보 없는 익명 이벤트)"
              : "Usage, errors, and feedback are logged locally and measured against defined success criteria. (Anonymous events, no PII.)"}
          </p>
          <MonitoringDashboard />
        </section>

        <div className="mt-10">
          <ComingNext
            points={[
              "Scope review and minimized OAuth justifications.",
              "Data-region selector and retention window controls.",
              "Audit log of what was sent for analysis.",
            ]}
            pointsKo={[
              "범위 검토 및 최소화된 OAuth 권한 근거 제출",
              "데이터 처리 지역 선택 및 보관 기간 제어",
              "분석에 전송된 데이터의 감사 로그",
            ]}
          />
        </div>
      </div>
    </>
  );
}

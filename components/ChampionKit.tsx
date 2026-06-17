"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

type Bi = { en: string; ko: string };
const t = (en: string, ko: string): Bi => ({ en, ko });

/* ── Quick-start (10 minutes) ─────────────────────────────────────────────── */
const QUICKSTART: { title: Bi; body: Bi }[] = [
  {
    title: t("1 · Open the Tactile Builder", "1 · 촉각 빌더 열기"),
    body: t("Go to Tactile Builder and pick a template close to your diagram (process, bar chart, triangle, or blank).", "촉각 빌더로 이동해 만들 다이어그램과 가까운 템플릿(흐름도·막대그래프·삼각형·빈 수업)을 고릅니다."),
  },
  {
    title: t("2 · Shape each object", "2 · 객체 다듬기"),
    body: t("Select an object, choose its shape, and move the sliders to place it on the 60×40 grid. The preview updates live.", "객체를 선택하고 모양을 고른 뒤 슬라이더로 60×40 격자에 배치합니다. 미리보기가 실시간으로 갱신됩니다."),
  },
  {
    title: t("3 · Label & narrate", "3 · 라벨·설명 입력"),
    body: t("Write a short braille label (or tap 'auto'), then an F1 explanation and an F2 hint in the student's language.", "짧은 점자 라벨을 쓰거나 '자동'을 누르고, 학생 언어로 F1 설명과 F2 힌트를 입력합니다."),
  },
  {
    title: t("4 · Check the braille", "4 · 점자 확인"),
    body: t("Watch the Braille QA panel. Resolve any blocker (e.g. unmapped characters) before publishing.", "점자 검수 패널을 확인합니다. 게시 전 차단 항목(예: 매핑 안 된 문자)을 해결합니다."),
  },
  {
    title: t("5 · Try it, then publish", "5 · 체험 후 게시"),
    body: t("Press 'Try it interactively' and move with ←/→ and F1–F4. When it reads well, Publish to the library for review.", "'직접 체험하기'를 눌러 ←/→와 F1–F4로 이동해 봅니다. 잘 읽히면 라이브러리에 게시해 검수를 요청합니다."),
  },
];

/* ── 1-day workshop agenda ────────────────────────────────────────────────── */
const WORKSHOP: { time: string; title: Bi; detail: Bi }[] = [
  { time: "09:00", title: t("Why tactile learning", "촉각 학습의 이유"), detail: t("The gap blind & low-vision students face with diagrams; what the Dot Pad changes.", "시각장애 학생이 다이어그램에서 겪는 격차와 Dot Pad가 바꾸는 점.") },
  { time: "09:45", title: t("Feel it first", "먼저 만져보기"), detail: t("Hands-on: explore a built-in lesson with eyes closed using the six keys.", "실습: 눈을 감고 여섯 개 키로 내장 수업을 탐색.") },
  { time: "10:45", title: t("Build your first lesson", "첫 수업 만들기"), detail: t("Each participant builds a 3-object lesson from a template using the quick-start.", "참가자별로 퀵스타트를 따라 템플릿에서 객체 3개짜리 수업 제작.") },
  { time: "13:00", title: t("Braille & QA", "점자와 검수"), detail: t("How the QA layer works, what blockers mean, and the localization packs (e.g. Marathi).", "검수 레이어 작동 방식, 차단 항목의 의미, 현지화 팩(예: 마라티어).") },
  { time: "14:00", title: t("Review like a field reviewer", "현장 검수자처럼 검토"), detail: t("Pairs swap lessons and run the review checklist, leaving feedback.", "짝을 지어 수업을 교환하고 검수 체크리스트로 검토하며 피드백 작성.") },
  { time: "15:00", title: t("In the classroom", "교실에서"), detail: t("Sequencing a lesson, pacing, and supporting a student during exploration.", "수업 순서 구성, 속도 조절, 탐색 중 학생 지원.") },
  { time: "16:00", title: t("Plan & commit", "계획과 약속"), detail: t("Each champion commits to 2 lessons and a follow-up date; collect questions for the network.", "챔피언별로 수업 2개와 후속 일정을 약속하고, 네트워크에 전달할 질문 수집.") },
];

/* ── Review checklist ─────────────────────────────────────────────────────── */
const CHECKLIST: { group: Bi; items: Bi[] }[] = [
  {
    group: t("Tactile clarity", "촉각 명료성"),
    items: [
      t("Each object is distinguishable by touch (not crowded).", "각 객체가 손끝으로 구별된다(과밀하지 않다)."),
      t("The 'whole picture' view conveys the overall layout.", "'전체 그림' 보기가 전체 배치를 전달한다."),
      t("Shapes match the concept (e.g. arrows show direction).", "모양이 개념과 맞는다(예: 화살표가 방향을 보여준다)."),
    ],
  },
  {
    group: t("Braille", "점자"),
    items: [
      t("No unresolved blockers in the Braille QA panel.", "점자 검수 패널에 미해결 차단 항목이 없다."),
      t("Labels are short and fit the 20-cell line.", "라벨이 짧고 20칸 라인에 맞는다."),
      t("Language/standard matches the student.", "언어·규격이 학생에 맞는다."),
    ],
  },
  {
    group: t("Audio & guidance", "음성·안내"),
    items: [
      t("F1 explains what each object is.", "F1이 각 객체가 무엇인지 설명한다."),
      t("F2 hints help locate without giving the answer.", "F2 힌트가 답을 주지 않고 위치를 찾도록 돕는다."),
      t("The F4 summary captures the whole concept.", "F4 요약이 전체 개념을 담는다."),
    ],
  },
  {
    group: t("Accessibility & fit", "접근성·적합성"),
    items: [
      t("Works fully with keyboard (←/→, 1–4).", "키보드(←/→, 1–4)만으로 완전히 동작한다."),
      t("Difficulty matches the grade level.", "난이도가 학년 수준에 맞는다."),
      t("A quiz (F3) checks understanding, if appropriate.", "필요하다면 퀴즈(F3)로 이해도를 확인한다."),
    ],
  },
];

const TABS = [
  { key: "quickstart", label: t("Quick-start", "퀵스타트") },
  { key: "workshop", label: t("1-day workshop", "1일 워크숍") },
  { key: "checklist", label: t("Review checklist", "검수 체크리스트") },
] as const;
type TabKey = (typeof TABS)[number]["key"];

export function ChampionKit() {
  const { lang } = useLang();
  const L = (b: Bi) => (lang === "ko" ? b.ko : b.en);
  const [tab, setTab] = useState<TabKey>("quickstart");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const totalChecks = CHECKLIST.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="space-y-5">
      {/* Tabs + print */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex flex-wrap gap-2">
          {TABS.map((tb) => (
            <button
              key={tb.key}
              type="button"
              onClick={() => setTab(tb.key)}
              aria-pressed={tab === tb.key}
              className={cn(
                "rounded-xl border px-4 py-2 text-[13.5px] font-semibold transition-colors",
                tab === tb.key ? "border-accent bg-accent text-white" : "border-line bg-surface text-muted hover:bg-surface-sunk"
              )}
            >
              {L(tb.label)}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-xl border border-line bg-surface px-4 py-2 text-[13.5px] font-semibold text-ink hover:bg-surface-sunk"
        >
          {L(t("Print / Save as PDF", "인쇄 / PDF 저장"))}
        </button>
      </div>

      {/* Quick-start */}
      {tab === "quickstart" && (
        <section className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <p className="eyebrow">{L(t("Quick-start · 10 minutes", "퀵스타트 · 10분"))}</p>
          <h2 className="mt-1 text-[18px] font-semibold text-ink">{L(t("Build your first tactile lesson", "첫 촉각 수업 만들기"))}</h2>
          <ol className="mt-4 space-y-3">
            {QUICKSTART.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent-tint font-mono text-[12px] font-semibold text-accent">{i + 1}</span>
                <div>
                  <p className="text-[14px] font-semibold text-ink">{L(s.title)}</p>
                  <p className="mt-0.5 text-[13.5px] leading-relaxed text-muted">{L(s.body)}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href="/builder" className="mt-5 inline-block rounded-xl bg-accent px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-accent-soft print:hidden">
            {L(t("Open the Tactile Builder →", "촉각 빌더 열기 →"))}
          </Link>
        </section>
      )}

      {/* Workshop */}
      {tab === "workshop" && (
        <section className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <p className="eyebrow">{L(t("1-day champion workshop", "1일 챔피언 워크숍"))}</p>
          <h2 className="mt-1 text-[18px] font-semibold text-ink">{L(t("Run a hands-on training day", "실습 중심 교육 진행"))}</h2>
          <p className="mt-1 text-[13.5px] text-muted">{L(t("Suggested agenda for ~12 teachers, one facilitator, Chromebooks + one Dot Pad per pair.", "교사 약 12명, 진행자 1명, 짝당 Chromebook + Dot Pad 1대 기준 권장 일정."))}</p>
          <ul className="mt-4 divide-y divide-line">
            {WORKSHOP.map((w, i) => (
              <li key={i} className="flex gap-4 py-3">
                <span className="w-14 shrink-0 font-mono text-[13px] text-accent">{w.time}</span>
                <div>
                  <p className="text-[14px] font-semibold text-ink">{L(w.title)}</p>
                  <p className="mt-0.5 text-[13px] text-muted">{L(w.detail)}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Checklist */}
      {tab === "checklist" && (
        <section className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">{L(t("Review checklist", "검수 체크리스트"))}</p>
              <h2 className="mt-1 text-[18px] font-semibold text-ink">{L(t("Before a lesson reaches a student", "수업이 학생에게 닿기 전"))}</h2>
            </div>
            <span className="rounded-full bg-accent-tint px-3 py-1 font-mono text-[12px] font-semibold text-accent">
              {checkedCount}/{totalChecks}
            </span>
          </div>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {CHECKLIST.map((g, gi) => (
              <div key={gi}>
                <p className="font-mono text-[11px] uppercase tracking-eyebrow text-faint">{L(g.group)}</p>
                <ul className="mt-2 space-y-1.5">
                  {g.items.map((item, ii) => {
                    const id = `${gi}-${ii}`;
                    return (
                      <li key={id}>
                        <label className="flex items-start gap-2.5 text-[13.5px] text-ink">
                          <input
                            type="checkbox"
                            checked={!!checked[id]}
                            onChange={(e) => setChecked((c) => ({ ...c, [id]: e.target.checked }))}
                            className="mt-0.5"
                            style={{ accentColor: "#1F3A5F" }}
                          />
                          <span>{L(item)}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[12px] text-faint print:hidden">
            {L(t("Tip: run this list inside Field review → teacher-built lessons, then approve or request changes.", "팁: 현장 검수 → 교사 제작 수업에서 이 목록을 적용한 뒤 승인하거나 수정을 요청하세요."))}
          </p>
        </section>
      )}
    </div>
  );
}

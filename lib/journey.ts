/**
 * The Dot Lens operating loop — the structural spine of the whole platform.
 *
 *   Build → Review → Teach → Improve → Empower Local Teachers
 *
 * This is a real, ordered process (so numbered markers 01–05 are meaningful),
 * and it loops: "Empower" feeds new, more confident teachers back into "Build".
 * Every screen and role in the product maps onto one of these stages.
 */

import type { Lang } from "@/lib/i18n";

export type JourneyRole = "teacher" | "expert" | "activist" | "student" | "all";

export interface JourneyStage {
  /** 1-based order in the loop. */
  step: number;
  /** Stable key. */
  key: "build" | "review" | "teach" | "improve" | "empower";
  label: { en: string; ko: string };
  /** One-line "what happens here". */
  action: { en: string; ko: string };
  /** Why it matters in a low-resource / mission-field context. */
  detail: { en: string; ko: string };
  /** Who primarily drives this stage. */
  role: JourneyRole;
  /** Screen this stage maps to. */
  href: string;
  /** The headline metric this stage moves. */
  metricKey: string;
}

export const JOURNEY: JourneyStage[] = [
  {
    step: 1,
    key: "build",
    label: { en: "Build", ko: "제작" },
    action: {
      en: "Teachers turn a textbook diagram into a Dot Pad–ready tactile lesson.",
      ko: "교사가 교과서 그림을 Dot Pad용 촉각 수업 자료로 만듭니다.",
    },
    detail: {
      en: "Upload an image, let AI analyse it, generate the tactile graphic, and get a step-by-step teaching guide — no specialist software required.",
      ko: "이미지를 올리면 AI가 분석하고 촉각 그래픽과 단계별 수업 가이드를 생성합니다. 별도 전문 소프트웨어가 필요 없습니다.",
    },
    role: "teacher",
    href: "/teacher",
    metricKey: "lessonsCreated",
  },
  {
    step: 2,
    key: "review",
    label: { en: "Review", ko: "검수" },
    action: {
      en: "Tactile experts (TVIs) score readability and approve, or request changes.",
      ko: "촉각 전문가(TVI)가 가독성을 평가하고 승인하거나 보완을 요청합니다.",
    },
    detail: {
      en: "Quality is verified before a lesson reaches a blind student — clarity, tactile readability, and educational accuracy are scored, with concrete comments.",
      ko: "자료가 학생에게 닿기 전에 명료성·촉각 가독성·교육 정확성을 점수화하고 구체적 코멘트로 품질을 검증합니다.",
    },
    role: "expert",
    href: "/expert-review",
    metricKey: "reviewScore",
  },
  {
    step: 3,
    key: "teach",
    label: { en: "Teach", ko: "수업" },
    action: {
      en: "Students explore the graphic by touch with audio guidance and comprehension checks.",
      ko: "학생이 음성 안내와 이해도 확인 질문과 함께 촉각 자료를 손으로 탐색합니다.",
    },
    detail: {
      en: "The teaching guide tells the teacher how to introduce, sequence, and question — the methodology that's usually missing when content is shipped alone.",
      ko: "수업 가이드가 도입·탐색 순서·질문법을 알려줍니다. 자료만 전달될 때 늘 빠지던 ‘방법론’을 함께 제공합니다.",
    },
    role: "student",
    href: "/student",
    metricKey: "usedInClass",
  },
  {
    step: 4,
    key: "improve",
    label: { en: "Improve", ko: "개선" },
    action: {
      en: "Post-lesson feedback and field reports turn real usage into better materials.",
      ko: "수업 후 피드백과 현장 보고가 실제 활용을 더 나은 자료로 환류합니다.",
    },
    detail: {
      en: "Teacher confidence, student understanding, and reuse rates are tracked so weak lessons are fixed and strong ones are shared and reused.",
      ko: "교사 자신감·학생 이해도·재사용률을 추적해 약한 자료는 개선하고 좋은 자료는 공유·재사용합니다.",
    },
    role: "activist",
    href: "/field-data",
    metricKey: "reuseRate",
  },
  {
    step: 5,
    key: "empower",
    label: { en: "Empower Local Teachers", ko: "현지 교사 자립" },
    action: {
      en: "Consistent teachers become champions who train their peers — the loop runs without us.",
      ko: "꾸준한 교사가 동료를 가르치는 챔피언으로 성장해, 외부 지원 없이도 흐름이 돌아갑니다.",
    },
    detail: {
      en: "Champion teachers carry methodology forward locally, so the program is sustainable rather than dependent on outside delivery.",
      ko: "챔피언 교사가 현지에서 방법론을 이어가, 외부 전달에 의존하지 않는 지속 가능한 프로그램이 됩니다.",
    },
    role: "all",
    href: "/champions",
    metricKey: "champions",
  },
];

/** Convenience accessor for bilingual stage copy. */
export function stageText(
  stage: JourneyStage,
  field: "label" | "action" | "detail",
  lang: Lang
): string {
  return stage[field][lang];
}

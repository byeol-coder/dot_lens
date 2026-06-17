/**
 * Tactile Trainer certification & partner system.
 *
 * Modeled on the Google for Education certification ladder
 * (Certified Educator L1 → L2 → Certified Trainer), adapted for tactile
 * graphic education and a multi-country, mission-field context.
 *
 *   Individuals climb a credential ladder:
 *     L1 Foundations → L2 Advanced → Certified Tactile Trainer (can train peers)
 *
 *   Organizations form the delivery network:
 *     Prospective → Onboarding → Authorized Training Center → Regional Hub
 *
 * The "Certified Tactile Trainer" is the engine of the platform's Empower stage:
 * a local teacher credentialed to train other teachers, so each country can grow
 * its own trainers instead of depending on outside delivery.
 *
 * Mock data today; the shapes are backend-ready (see lib/dataSource.ts).
 */

import { CHAMPION_TEACHERS, type ChampionTeacherRecord } from "@/lib/mockPlatformData";

export type Bi = { en: string; ko: string };

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Credential ladder (individuals)
 * ────────────────────────────────────────────────────────────────────────── */

export type TierKey = "l1" | "l2" | "trainer";

export interface CredentialRequirement {
  label: Bi;
  /** How it is measured against a teacher record. */
  metric: Bi;
}

export interface CredentialTier {
  key: TierKey;
  /** 1-based rung. */
  rung: number;
  name: Bi;
  /** Google-ladder analog, shown as a reference chip. */
  analog: string;
  summary: Bi;
  requirements: CredentialRequirement[];
  /** What the credential unlocks. */
  unlocks: Bi[];
}

export const CREDENTIAL_TIERS: CredentialTier[] = [
  {
    key: "l1",
    rung: 1,
    name: { en: "Tactile Educator · Foundations", ko: "촉각 교육자 · 기초(L1)" },
    analog: "≈ Google Certified Educator L1",
    summary: {
      en: "Can create and teach a reviewed tactile lesson with confidence.",
      ko: "검수된 촉각 수업을 직접 만들고 가르칠 수 있습니다.",
    },
    requirements: [
      {
        label: { en: "Complete onboarding modules", ko: "온보딩 모듈 이수" },
        metric: { en: "Tactile literacy + platform basics", ko: "촉각 리터러시 + 플랫폼 기본" },
      },
      {
        label: { en: "Build 3 lessons, ≥1 expert-approved", ko: "수업 3개 제작, 1개 이상 전문가 승인" },
        metric: { en: "lessonsCreated ≥ 3 · ≥1 approved", ko: "제작 3개 이상 · 승인 1개 이상" },
      },
      {
        label: { en: "Teach ≥1 class and log feedback", ko: "1회 이상 수업 후 피드백 입력" },
        metric: { en: "usedInClass ≥ 1 · feedback logged", ko: "수업 활용 1회 이상 · 피드백 기록" },
      },
      {
        label: { en: "Pass the Foundations check", ko: "기초 평가 통과" },
        metric: { en: "Short knowledge check", ko: "단답 지식 확인" },
      },
    ],
    unlocks: [
      { en: "Publish lessons to the shared library", ko: "공유 라이브러리에 자료 게시" },
      { en: "Request expert review", ko: "전문가 검수 요청" },
    ],
  },
  {
    key: "l2",
    rung: 2,
    name: { en: "Tactile Educator · Advanced", ko: "촉각 교육자 · 심화(L2)" },
    analog: "≈ Google Certified Educator L2",
    summary: {
      en: "Sustains quality tactile teaching across multiple subjects.",
      ko: "여러 과목에 걸쳐 일관된 촉각 수업 품질을 유지합니다.",
    },
    requirements: [
      {
        label: { en: "Hold L1 Foundations", ko: "L1 기초 보유" },
        metric: { en: "tier = l1", ko: "등급 = L1" },
      },
      {
        label: { en: "10+ lessons across ≥2 subjects", ko: "2과목 이상에서 수업 10개 이상" },
        metric: { en: "lessonsCreated ≥ 10", ko: "제작 10개 이상" },
      },
      {
        label: { en: "Review pass rate ≥ 80%", ko: "검수 통과율 80% 이상" },
        metric: { en: "reviewPassRate ≥ 0.8", ko: "검수 통과율 ≥ 0.8" },
      },
      {
        label: { en: "Avg student understanding ≥ 4.0/5", ko: "학생 이해도 평균 4.0/5 이상" },
        metric: { en: "studentUnderstanding ≥ 4.0", ko: "이해도 ≥ 4.0" },
      },
    ],
    unlocks: [
      { en: "Mentor L1 teachers in your school", ko: "학교 내 L1 교사 멘토링" },
      { en: "Eligible to apply for Trainer", ko: "트레이너 신청 자격 부여" },
    ],
  },
  {
    key: "trainer",
    rung: 3,
    name: { en: "Certified Tactile Trainer", ko: "공인 촉각 트레이너" },
    analog: "≈ Google Certified Trainer",
    summary: {
      en: "Credentialed to train other teachers and deliver official workshops.",
      ko: "다른 교사를 교육하고 공식 워크숍을 진행할 수 있는 자격입니다.",
    },
    requirements: [
      {
        label: { en: "Hold L2 Advanced", ko: "L2 심화 보유" },
        metric: { en: "tier = l2", ko: "등급 = L2" },
      },
      {
        label: { en: "Complete the Trainer Course", ko: "트레이너 과정 이수" },
        metric: { en: "Adult learning + tactile facilitation", ko: "성인 학습 + 촉각 퍼실리테이션" },
      },
      {
        label: { en: "Pass the Trainer Skills Assessment", ko: "트레이너 역량 평가 통과" },
        metric: { en: "Assessment exam", ko: "역량 평가 시험" },
      },
      {
        label: { en: "Submit a training demo video", ko: "교육 시연 영상 제출" },
        metric: { en: "~3 min, reviewed", ko: "약 3분, 심사" },
      },
      {
        label: { en: "Train ≥5 peer teachers", ko: "동료 교사 5명 이상 교육" },
        metric: { en: "peerTrainingCount ≥ 5", ko: "동료 교육 5명 이상" },
      },
    ],
    unlocks: [
      { en: "Listed in the public Trainer Directory", ko: "공개 트레이너 디렉터리 등재" },
      { en: "Deliver official tactile-education workshops", ko: "공식 촉각 교육 워크숍 진행" },
      { en: "Represent a country partner & mentor candidates", ko: "각국 파트너 대표 및 후보 멘토링" },
    ],
  },
];

/* ──────────────────────────────────────────────────────────────────────────
 * 2. Trainer application pipeline (mirrors the Google Certified Trainer flow)
 * ────────────────────────────────────────────────────────────────────────── */

export type AppStageKey =
  | "apply"
  | "skills_assessment"
  | "demo_review"
  | "approved"
  | "active"
  | "recertify";

export interface ApplicationStage {
  key: AppStageKey;
  step: number;
  label: Bi;
  detail: Bi;
}

export const TRAINER_PIPELINE: ApplicationStage[] = [
  {
    key: "apply",
    step: 1,
    label: { en: "Apply", ko: "신청" },
    detail: {
      en: "L2 teacher submits an application with usage history and a country partner reference.",
      ko: "L2 교사가 활용 이력과 파트너 추천을 담아 신청합니다.",
    },
  },
  {
    key: "skills_assessment",
    step: 2,
    label: { en: "Skills assessment", ko: "역량 평가" },
    detail: {
      en: "Pass the Trainer Skills Assessment on tactile pedagogy and facilitation.",
      ko: "촉각 교수법·퍼실리테이션 역량 평가를 통과합니다.",
    },
  },
  {
    key: "demo_review",
    step: 3,
    label: { en: "Demo review", ko: "시연 심사" },
    detail: {
      en: "Submit a short training video; reviewers assess delivery against a rubric.",
      ko: "교육 시연 영상을 제출하고 평가 기준에 따라 심사받습니다.",
    },
  },
  {
    key: "approved",
    step: 4,
    label: { en: "Approved & listed", ko: "승인·등재" },
    detail: {
      en: "Certification granted for 12 months and added to the Trainer Directory.",
      ko: "12개월 인증이 부여되고 트레이너 디렉터리에 등재됩니다.",
    },
  },
  {
    key: "active",
    step: 5,
    label: { en: "Deliver training", ko: "교육 진행" },
    detail: {
      en: "Run official workshops, mentor candidates, and report training activity.",
      ko: "공식 워크숍을 진행하고 후보를 멘토링하며 활동을 보고합니다.",
    },
  },
  {
    key: "recertify",
    step: 6,
    label: { en: "Recertify yearly", ko: "연 1회 재인증" },
    detail: {
      en: "Renew annually by maintaining quality and continued training activity.",
      ko: "품질 유지와 지속적 교육 활동으로 매년 갱신합니다.",
    },
  },
];

/* ──────────────────────────────────────────────────────────────────────────
 * 3. Country partner network (organizations)
 * ────────────────────────────────────────────────────────────────────────── */

export type PartnerStatus = "prospective" | "onboarding" | "authorized" | "hub";
export type PartnerType = "school" | "ngo" | "mission" | "government" | "vendor";

export interface CountryPartner {
  partnerId: string;
  org: string;
  country: string;
  countryKo: string;
  region: string;
  type: PartnerType;
  status: PartnerStatus;
  certifiedTrainers: number;
  trainerCandidates: number;
  activeTeachers: number;
  studentsReached: number;
  leadTrainer: string | null;
  /** Approx. coordinates of the lead site (for the world map). */
  lat: number;
  lng: number;
  /** ISO date the partnership began (or prospect logged). */
  since: string;
}

export const COUNTRY_PARTNERS: CountryPartner[] = [
  {
    partnerId: "pt-kr",
    org: "Dot Inc. — Tactile Education HQ",
    country: "South Korea",
    countryKo: "대한민국",
    region: "Seoul",
    type: "vendor",
    status: "hub",
    certifiedTrainers: 4,
    trainerCandidates: 2,
    activeTeachers: 6,
    studentsReached: 0,
    leadTrainer: "Dr. Ji-yeon Kim (TVI)",
    lat: 37.57,
    lng: 126.98,
    since: "2025-09-01T00:00:00Z",
  },
  {
    partnerId: "pt-in",
    org: "Blind School Pune Network",
    country: "India",
    countryKo: "인도",
    region: "Maharashtra",
    type: "school",
    status: "authorized",
    certifiedTrainers: 1,
    trainerCandidates: 2,
    activeTeachers: 7,
    studentsReached: 96,
    leadTrainer: "Mrs. Anjali Sharma",
    lat: 18.52,
    lng: 73.86,
    since: "2026-02-01T00:00:00Z",
  },
  {
    partnerId: "pt-zm",
    org: "Mission Schools Lusaka",
    country: "Zambia",
    countryKo: "잠비아",
    region: "Lusaka Province",
    type: "mission",
    status: "onboarding",
    certifiedTrainers: 0,
    trainerCandidates: 1,
    activeTeachers: 3,
    studentsReached: 34,
    leadTrainer: "Rev. James Banda",
    lat: -15.39,
    lng: 28.32,
    since: "2026-05-10T00:00:00Z",
  },
  {
    partnerId: "pt-ng",
    org: "Special Education Centre Lagos",
    country: "Nigeria",
    countryKo: "나이지리아",
    region: "Lagos",
    type: "ngo",
    status: "onboarding",
    certifiedTrainers: 0,
    trainerCandidates: 1,
    activeTeachers: 2,
    studentsReached: 18,
    leadTrainer: null,
    lat: 6.52,
    lng: 3.38,
    since: "2026-05-22T00:00:00Z",
  },
  {
    partnerId: "pt-ph",
    org: "Resources for the Blind, Inc.",
    country: "Philippines",
    countryKo: "필리핀",
    region: "Metro Manila",
    type: "ngo",
    status: "prospective",
    certifiedTrainers: 0,
    trainerCandidates: 0,
    activeTeachers: 0,
    studentsReached: 0,
    leadTrainer: null,
    lat: 14.6,
    lng: 120.98,
    since: "2026-06-05T00:00:00Z",
  },
  {
    partnerId: "pt-ke",
    org: "Thika School for the Blind",
    country: "Kenya",
    countryKo: "케냐",
    region: "Kiambu",
    type: "school",
    status: "prospective",
    certifiedTrainers: 0,
    trainerCandidates: 0,
    activeTeachers: 0,
    studentsReached: 0,
    leadTrainer: null,
    lat: -1.04,
    lng: 37.08,
    since: "2026-06-12T00:00:00Z",
  },
];

export const PARTNER_STATUS_META: Record<
  PartnerStatus,
  { label: Bi; mark: string; order: number }
> = {
  prospective: { label: { en: "Prospective", ko: "관심" }, mark: "○", order: 0 },
  onboarding: { label: { en: "Onboarding", ko: "온보딩" }, mark: "◐", order: 1 },
  authorized: { label: { en: "Authorized center", ko: "공인 센터" }, mark: "◉", order: 2 },
  hub: { label: { en: "Regional hub", ko: "지역 허브" }, mark: "★", order: 3 },
};

export const PARTNER_TYPE_LABEL: Record<PartnerType, Bi> = {
  school: { en: "School", ko: "학교" },
  ngo: { en: "NGO", ko: "비영리" },
  mission: { en: "Mission", ko: "선교" },
  government: { en: "Government", ko: "정부" },
  vendor: { en: "Dot Inc.", ko: "닷" },
};

/* ──────────────────────────────────────────────────────────────────────────
 * 4. Map champion records → credential tier + current pipeline stage
 *    (so the directory and pipeline reflect real usage, not surveys)
 * ────────────────────────────────────────────────────────────────────────── */

export interface TrainerProfile extends ChampionTeacherRecord {
  tier: TierKey;
  /** Where they are in the trainer application pipeline. */
  stage: AppStageKey;
  /** The single gating requirement to advance, if not yet a trainer. */
  nextStep: Bi;
}

function deriveTier(t: ChampionTeacherRecord): TierKey {
  if (t.championStatus === "champion") return "trainer";
  // L2 if strong record; otherwise L1.
  if (t.totalLessonsCreated >= 10 && t.reviewPassRate >= 0.8) return "l2";
  return "l1";
}

function deriveStage(t: ChampionTeacherRecord, tier: TierKey): AppStageKey {
  if (tier === "trainer") return t.peerTrainingCount >= 5 ? "active" : "approved";
  if (tier === "l2") {
    if (t.workshopParticipation >= 1) return "skills_assessment";
    return "apply";
  }
  return "apply";
}

function deriveNextStep(t: ChampionTeacherRecord, tier: TierKey): Bi {
  if (tier === "trainer") {
    if (t.peerTrainingCount < 5)
      return { en: `Train ${5 - t.peerTrainingCount} more peers`, ko: `동료 ${5 - t.peerTrainingCount}명 추가 교육` };
    return { en: "Recertify on schedule", ko: "일정에 맞춰 재인증" };
  }
  if (tier === "l1")
    return { en: "Reach 10 lessons & 80% review pass for L2", ko: "L2 위해 수업 10개·검수 80% 달성" };
  // l2
  if (t.workshopParticipation < 1)
    return { en: "Complete the Trainer Course", ko: "트레이너 과정 이수" };
  return { en: "Pass skills assessment & submit demo video", ko: "역량 평가 통과 및 시연 영상 제출" };
}

export function buildTrainerProfiles(): TrainerProfile[] {
  return CHAMPION_TEACHERS.map((t) => {
    const tier = deriveTier(t);
    const stage = deriveStage(t, tier);
    return { ...t, tier, stage, nextStep: deriveNextStep(t, tier) };
  }).sort((a, b) => b.score - a.score);
}

/* Program-wide rollup for headline stats. */
export interface ProgramRollup {
  countries: number;
  activePartners: number;
  certifiedTrainers: number;
  trainerCandidates: number;
  studentsReached: number;
}

export function programRollup(): ProgramRollup {
  const activePartners = COUNTRY_PARTNERS.filter(
    (p) => p.status === "authorized" || p.status === "hub"
  ).length;
  return {
    countries: COUNTRY_PARTNERS.length,
    activePartners,
    certifiedTrainers: COUNTRY_PARTNERS.reduce((s, p) => s + p.certifiedTrainers, 0),
    trainerCandidates: COUNTRY_PARTNERS.reduce((s, p) => s + p.trainerCandidates, 0),
    studentsReached: COUNTRY_PARTNERS.reduce((s, p) => s + p.studentsReached, 0),
  };
}

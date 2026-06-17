/**
 * Data source abstraction.
 *
 * Every screen reads platform data through this module instead of importing the
 * mock arrays directly. Today it resolves the in-memory mock data; to go live,
 * implement the same `DataSource` interface against Supabase / Firebase / a REST
 * API and swap `activeSource` — no screen code has to change.
 *
 *   // Example future swap:
 *   // import { supabaseSource } from "./sources/supabase";
 *   // const activeSource: DataSource = supabaseSource;
 *
 * All methods are async so the live implementation can do real I/O.
 */

import {
  LESSON_USAGE_DATA,
  EXPERT_REVIEW_QUEUE,
  CHAMPION_TEACHERS,
  FIELD_REPORTS,
  PLATFORM_STATS,
  type LessonUsageRecord,
  type ExpertReviewRecord,
  type ChampionTeacherRecord,
  type FieldReport,
  type PlatformStats,
} from "@/lib/mockPlatformData";
import {
  COUNTRY_PARTNERS,
  buildTrainerProfiles,
  programRollup,
  type CountryPartner,
  type TrainerProfile,
  type ProgramRollup,
} from "@/lib/certification";

/* ── Derived metric shapes (computed from base records) ──────────────────── */

/** 콘텐츠 재사용률 — share of created lessons that are reused/used in class. */
export interface ReuseMetric {
  totalLessons: number;
  reusedLessons: number;
  reuseRate: number; // 0–1
  approvedReuseReady: number;
}

/** 교사 문의 유형 — workshop needs + reported issues, bucketed and counted. */
export interface InquiryTypeMetric {
  type: string;
  typeKo: string;
  count: number;
  /** Sources that contributed (region/school context). */
  examples: string[];
}

/** Aggregate impact rollup used by Dashboard + Field screens. */
export interface ImpactRollup {
  totalStudents: number;
  blindStudents: number;
  lowVisionStudents: number;
  dotPadSessions: number;
  avgTeacherConfidence: number; // 1–5
  avgStudentUnderstanding: number; // 1–5
  countriesActive: number;
}

export interface DataSource {
  getLessonUsage(): Promise<LessonUsageRecord[]>;
  getReviewQueue(): Promise<ExpertReviewRecord[]>;
  getChampions(): Promise<ChampionTeacherRecord[]>;
  getFieldReports(): Promise<FieldReport[]>;
  getPlatformStats(): Promise<PlatformStats>;
  // Derived selectors
  getReuseMetric(): Promise<ReuseMetric>;
  getInquiryTypes(): Promise<InquiryTypeMetric[]>;
  getImpactRollup(): Promise<ImpactRollup>;
  // Certification & trainer network
  getCountryPartners(): Promise<CountryPartner[]>;
  getTrainerProfiles(): Promise<TrainerProfile[]>;
  getProgramRollup(): Promise<ProgramRollup>;
}

/* ── Mock implementation (current) ───────────────────────────────────────── */

/** Simple keyword bucketing for inquiry/workshop text → a stable type. */
const INQUIRY_BUCKETS: Array<{
  type: string;
  typeKo: string;
  match: RegExp;
}> = [
  { type: "Teaching methodology", typeKo: "수업 방법론", match: /explain|technique|methodolog|how to use|sequence|introduc/i },
  { type: "Offline / connectivity", typeKo: "오프라인·연결성", match: /offline|connectiv|internet/i },
  { type: "Local language support", typeKo: "현지어 지원", match: /language|nyanja|local|audio record/i },
  { type: "Device & hardware", typeKo: "기기·하드웨어", match: /charg|cable|device|dot pad|hardware/i },
  { type: "Tactile design", typeKo: "촉각 디자인", match: /tactile|texture|arrow|line|diagram/i },
];

function bucketInquiry(text: string): { type: string; typeKo: string } {
  for (const b of INQUIRY_BUCKETS) {
    if (b.match.test(text)) return { type: b.type, typeKo: b.typeKo };
  }
  return { type: "Other", typeKo: "기타" };
}

export const mockSource: DataSource = {
  async getLessonUsage() {
    return LESSON_USAGE_DATA;
  },
  async getReviewQueue() {
    return EXPERT_REVIEW_QUEUE;
  },
  async getChampions() {
    return [...CHAMPION_TEACHERS].sort((a, b) => b.score - a.score);
  },
  async getFieldReports() {
    return FIELD_REPORTS;
  },
  async getPlatformStats() {
    return PLATFORM_STATS;
  },

  async getReuseMetric() {
    const total = LESSON_USAGE_DATA.length;
    const reused = LESSON_USAGE_DATA.filter((l) => l.usedInClass).length;
    const approvedReady = LESSON_USAGE_DATA.filter(
      (l) => l.status === "approved" || l.status === "used_in_class"
    ).length;
    return {
      totalLessons: total,
      reusedLessons: reused,
      reuseRate: total ? reused / total : 0,
      approvedReuseReady: approvedReady,
    };
  },

  async getInquiryTypes() {
    const tally = new Map<string, InquiryTypeMetric>();
    const ingest = (text: string, ctx: string) => {
      const { type, typeKo } = bucketInquiry(text);
      const cur = tally.get(type) ?? { type, typeKo, count: 0, examples: [] };
      cur.count += 1;
      if (cur.examples.length < 3 && !cur.examples.includes(ctx)) cur.examples.push(ctx);
      tally.set(type, cur);
    };
    for (const r of FIELD_REPORTS) {
      const ctx = `${r.region}, ${r.country}`;
      r.workshopNeeds.forEach((w) => ingest(w, ctx));
      r.issuesReported.forEach((i) => ingest(i, ctx));
    }
    // Teachers who flagged needing expert support also count as methodology inquiries.
    for (const l of LESSON_USAGE_DATA) {
      if (l.needsExpertSupport) ingest("explain technique", `${l.school}, ${l.country}`);
    }
    return [...tally.values()].sort((a, b) => b.count - a.count);
  },

  async getImpactRollup() {
    const used = LESSON_USAGE_DATA.filter((l) => l.usedInClass);
    const confidences = used.map((l) => l.teacherConfidenceScore).filter(Boolean);
    const understandings = used.map((l) => l.studentUnderstandingScore).filter(Boolean);
    const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
    return {
      totalStudents: used.reduce((s, l) => s + l.studentCount, 0),
      blindStudents: used.reduce((s, l) => s + l.blindStudentCount, 0),
      lowVisionStudents: used.reduce((s, l) => s + l.lowVisionStudentCount, 0),
      dotPadSessions: used.filter((l) => l.tactileOutputUsed).length,
      avgTeacherConfidence: Math.round(avg(confidences) * 10) / 10,
      avgStudentUnderstanding: Math.round(avg(understandings) * 10) / 10,
      countriesActive: new Set(LESSON_USAGE_DATA.map((l) => l.country)).size,
    };
  },

  async getCountryPartners() {
    return COUNTRY_PARTNERS;
  },
  async getTrainerProfiles() {
    return buildTrainerProfiles();
  },
  async getProgramRollup() {
    return programRollup();
  },
};

/** The active data source. Swap this line to go live. */
export const dataSource: DataSource = mockSource;

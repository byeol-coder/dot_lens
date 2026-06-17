export interface NavItem {
  href: string;
  label: string;
  labelKo: string;
  blurb: string;
  /** Stage in the operating loop this surface belongs to. */
  stage?: "build" | "review" | "teach" | "improve" | "empower" | "overview";
  role?: "teacher" | "expert" | "activist" | "student" | "all";
}

/** Ordered to mirror the operating loop: overview → build → review → teach → improve → empower. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", labelKo: "홈", blurb: "Platform overview and role entry points.", stage: "overview", role: "all" },
  { href: "/dashboard", label: "Dashboard", labelKo: "대시보드", blurb: "Platform-wide stats — lessons, teachers, impact.", stage: "overview", role: "all" },
  { href: "/teacher", label: "Create Lesson", labelKo: "수업 만들기", blurb: "Build a tactile-ready lesson in minutes.", stage: "build", role: "teacher" },
  { href: "/builder", label: "Tactile Builder", labelKo: "촉각 빌더", blurb: "Author a custom tactile lesson from your own material.", stage: "build", role: "teacher" },
  { href: "/expert-review", label: "Expert Review", labelKo: "전문가 검수", blurb: "Review and approve tactile materials.", stage: "review", role: "expert" },
  { href: "/student", label: "Student Learning", labelKo: "학생 학습", blurb: "Explore diagrams on Dot Pad with audio guidance.", stage: "teach", role: "student" },
  { href: "/field-data", label: "Field & Impact", labelKo: "현장·임팩트", blurb: "Monitor teacher usage and field impact.", stage: "improve", role: "activist" },
  { href: "/champions", label: "Champion Teachers", labelKo: "챔피언 교사", blurb: "Recommend and grow local champion teachers.", stage: "empower", role: "all" },
  { href: "/academy", label: "Trainer Academy", labelKo: "트레이너 아카데미", blurb: "Certify trainers and grow country partners.", stage: "empower", role: "all" },
  { href: "/champion-kit", label: "Champion Kit", labelKo: "챔피언 패키지", blurb: "Quick-start, workshop agenda, and review checklist.", stage: "empower", role: "all" },
  { href: "/lesson-library", label: "Lessons", labelKo: "수업 자료", blurb: "Browse and reuse approved lesson materials.", stage: "build", role: "all" },
  { href: "/settings", label: "Settings", labelKo: "설정", blurb: "Accessibility, language, and display options.", role: "all" },
];

/** Items shown in the top navigation bar (excludes Home). */
export const PRIMARY_NAV = NAV_ITEMS.filter((i) => i.href !== "/");

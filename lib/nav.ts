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

/* ---------------------------------------------------------------------------
 * Grouped navigation — three representative menus with submenus.
 * Organized by user (teacher → student/reviewer → operator) so the top bar
 * stays simple while every surface is one click away.
 * ------------------------------------------------------------------------- */

export interface NavGroup {
  label: string;
  labelKo: string;
  items: NavItem[];
}

/* ---------------------------------------------------------------------------
 * IA v2 — simple primary menu for first-time clarity, with secondary items
 * tucked under "More". Teacher / student / expert surfaces stay primary;
 * admin / scale / impact move into More.
 * ------------------------------------------------------------------------- */

/** Primary top-level menu (Home first, then the three core roles + library). */
export const MAIN_NAV: NavItem[] = [
  { href: "/", label: "Home", labelKo: "홈", blurb: "Start here." },
  { href: "/teacher", label: "Teacher", labelKo: "교사용", blurb: "Create accessible lessons from visual materials.", role: "teacher" },
  { href: "/student", label: "Student Demo", labelKo: "학생 체험", blurb: "Experience a lesson by touch, braille, and audio.", role: "student" },
  { href: "/review", label: "Expert Review", labelKo: "전문가 검토", blurb: "Review tactile materials before classroom use.", role: "expert" },
  { href: "/lesson-library", label: "Lesson Library", labelKo: "수업 자료실", blurb: "Browse and reuse approved lessons.", role: "all" },
];

/** Secondary menu under "More" — admin, scale, and impact surfaces. */
export const MORE_NAV: NavItem[] = [
  { href: "/field-data", label: "Field & Impact", labelKo: "현장 임팩트", blurb: "Adoption, training, and classroom impact across regions.", role: "activist" },
  { href: "/champions", label: "Champion Teachers", labelKo: "챔피언 교사", blurb: "Recognize and grow local champion teachers.", role: "all" },
  { href: "/academy", label: "Trainer Academy", labelKo: "트레이너 아카데미", blurb: "Certify trainers and grow country partners.", role: "all" },
  { href: "/champion-kit", label: "Champion Kit", labelKo: "챔피언 패키지", blurb: "Quick-start, workshop agenda, and review checklist.", role: "all" },
  { href: "/builder", label: "Tactile Builder", labelKo: "촉각 빌더", blurb: "Author a custom tactile lesson, object by object.", role: "teacher" },
  { href: "/settings", label: "Settings", labelKo: "설정", blurb: "Accessibility, language, and localization.", role: "all" },
];

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Teacher",
    labelKo: "교사",
    items: [
      { href: "/builder", label: "Tactile Builder", labelKo: "촉각 빌더", blurb: "Author a custom tactile lesson from your own material.", role: "teacher" },
      { href: "/teacher", label: "Create Lesson", labelKo: "수업 만들기", blurb: "Guided flow: upload material and convert it to tactile.", role: "teacher" },
      { href: "/lesson-library", label: "Lessons", labelKo: "수업 자료", blurb: "Browse, reuse, and explore approved lessons.", role: "all" },
    ],
  },
  {
    label: "Student & Review",
    labelKo: "학생·검수",
    items: [
      { href: "/student", label: "Student Learning", labelKo: "학생 학습", blurb: "Explore diagrams on the Dot Pad with audio guidance.", role: "student" },
      { href: "/review", label: "Review & Approve", labelKo: "검수·승인", blurb: "Field review of teacher-built lessons + braille QA.", role: "expert" },
    ],
  },
  {
    label: "Operate",
    labelKo: "운영",
    items: [
      { href: "/dashboard", label: "Dashboard", labelKo: "대시보드", blurb: "Platform-wide stats — lessons, teachers, impact.", role: "all" },
      { href: "/field-data", label: "Field & Impact", labelKo: "현장·임팩트", blurb: "Monitor teacher usage and field impact.", role: "activist" },
      { href: "/admin", label: "Admin & Monitoring", labelKo: "관리자·모니터링", blurb: "Privacy controls + usage, errors, and success criteria.", role: "all" },
      { href: "/champions", label: "Champion Teachers", labelKo: "챔피언 교사", blurb: "Recommend and grow local champion teachers.", role: "all" },
      { href: "/academy", label: "Trainer Academy", labelKo: "트레이너 아카데미", blurb: "Certify trainers and grow country partners.", role: "all" },
      { href: "/champion-kit", label: "Champion Kit", labelKo: "챔피언 패키지", blurb: "Quick-start, workshop agenda, and review checklist.", role: "all" },
      { href: "/settings", label: "Settings", labelKo: "설정", blurb: "Accessibility, language, and localization packs.", role: "all" },
    ],
  },
];

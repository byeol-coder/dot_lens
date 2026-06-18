export interface NavItem {
  href: string;
  label: string;
  labelKo: string;
  blurb: string;
  /** Stage in the operating loop this surface belongs to. */
  stage?: "build" | "review" | "teach" | "improve" | "empower" | "overview";
  role?: "teacher" | "expert" | "activist" | "student" | "all";
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", labelKo: "홈", blurb: "Platform overview and guided demo entry.", stage: "overview", role: "all" },
  { href: "/guided-demo", label: "Guided Demo", labelKo: "가이드 데모", blurb: "Walk through a complete Dot Lens lesson in 8 steps.", stage: "overview", role: "all" },
  { href: "/teacher", label: "Create Lesson", labelKo: "수업 만들기", blurb: "Build a tactile-ready lesson in minutes.", stage: "build", role: "teacher" },
  { href: "/impact", label: "Impact", labelKo: "임팩트", blurb: "Monitor teacher usage and field impact.", stage: "improve", role: "activist" },
  { href: "/settings", label: "Settings", labelKo: "설정", blurb: "Accessibility, language, and display options.", role: "all" },
];

/** Items shown in the top navigation bar (excludes Home — 4 items). */
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

/**
 * Dot Pad Classroom Operating Platform — primary 8-item navigation.
 * Positions Dot Lens as a production/operations tool, not a content library.
 */
export const MAIN_NAV: NavItem[] = [
  { href: "/",                  label: "Home",              labelKo: "홈",            blurb: "Platform overview and quick-action hub.",                          stage: "overview", role: "all" },
  { href: "/studio",            label: "Dot Lens Studio",   labelKo: "닷 렌즈 스튜디오", blurb: "Create tactile lessons from visual materials. Import from TIB.", stage: "build",    role: "teacher" },
  { href: "/student",           label: "Student Player",    labelKo: "학생 플레이어",  blurb: "Run a tactile lesson on Dot Pad with braille and audio guidance.", stage: "teach",    role: "student" },
  { href: "/review-console",    label: "Review Console",    labelKo: "검수 콘솔",      blurb: "Review AI-generated lessons before Dot Pad output.",              stage: "review",   role: "expert" },
  { href: "/classroom",         label: "Classroom Mode",    labelKo: "교실 모드",      blurb: "Sync and manage multiple Dot Pads during live classroom sessions.", stage: "teach",    role: "teacher" },
];

/**
 * Secondary "More" menu — device ops, impact analytics, and settings.
 */
export const MORE_NAV: NavItem[] = [
  { href: "/device-management", label: "Device Management", labelKo: "기기 관리",      blurb: "Connect, monitor, and control your Dot Pad fleet.",               stage: "teach",    role: "all" },
  { href: "/impact",            label: "Impact Dashboard",  labelKo: "임팩트 대시보드", blurb: "Field adoption, usage trends, and regional impact data.",          stage: "improve",  role: "activist" },
  { href: "/settings",          label: "Settings",          labelKo: "설정",           blurb: "Accessibility, localization packs, and display preferences.",      role: "all" },
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

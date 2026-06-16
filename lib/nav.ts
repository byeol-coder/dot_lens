export interface NavItem {
  href: string;
  label: string;
  labelKo: string;
  blurb: string;
  phase: number;
  role?: "teacher" | "expert" | "activist" | "student" | "all";
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", labelKo: "홈", blurb: "Platform overview and role entry points.", phase: 0, role: "all" },
  { href: "/dashboard", label: "Dashboard", labelKo: "대시보드", blurb: "Platform-wide stats — lessons, teachers, impact.", phase: 1, role: "all" },
  { href: "/teacher", label: "Teacher", labelKo: "교사 모드", blurb: "Build a tactile-ready lesson in minutes.", phase: 1, role: "teacher" },
  { href: "/student", label: "Student", labelKo: "학생 모드", blurb: "Explore diagrams on Dot Pad with audio guidance.", phase: 2, role: "student" },
  { href: "/expert-review", label: "Expert Review", labelKo: "전문가 검수", blurb: "Review and approve AI-generated tactile materials.", phase: 1, role: "expert" },
  { href: "/field-data", label: "Field Data", labelKo: "현장 데이터", blurb: "Monitor teacher usage and field impact.", phase: 1, role: "activist" },
  { href: "/lesson-library", label: "Lessons", labelKo: "수업 자료", blurb: "Browse and reuse approved lesson materials.", phase: 1, role: "all" },
  { href: "/settings", label: "Settings", labelKo: "설정", blurb: "Accessibility, language, and display options.", phase: 2, role: "all" },
  { href: "/pitch", label: "Partner Pitch", labelKo: "파트너 피치", blurb: "The case for partnership.", phase: 5, role: "all" },
];

/** Items shown in the top navigation bar (excludes Home). */
export const PRIMARY_NAV = NAV_ITEMS.filter((i) => i.href !== "/");

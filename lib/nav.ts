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

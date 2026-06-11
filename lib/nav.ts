export interface NavItem {
  href: string;
  label: string;
  labelKo: string;
  /** Short note shown on scaffold pages and the landing map. */
  blurb: string;
  /** Which phase this surface is slated for. */
  phase: number;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", labelKo: "홈", blurb: "Product overview and demo entry points.", phase: 0 },
  { href: "/teacher", label: "Teacher", labelKo: "교사", blurb: "Build a tactile-ready assignment in three steps.", phase: 1 },
  { href: "/student", label: "Student", labelKo: "학생", blurb: "Explore the diagram on the Dot Pad with Gemini.", phase: 2 },
  { href: "/dashboard", label: "Dashboard", labelKo: "대시보드", blurb: "Review who explored what — and where they got stuck.", phase: 3 },
  { href: "/review", label: "Braille QA", labelKo: "점자 검수", blurb: "Verify and approve braille before it reaches a student.", phase: 3 },
  { href: "/settings", label: "Settings", labelKo: "설정", blurb: "Braille standard, language, speech, and contrast.", phase: 2 },
  { href: "/admin", label: "Admin", labelKo: "관리자", blurb: "Privacy, data region, and per-OU controls.", phase: 4 },
  { href: "/pitch", label: "Partner Pitch", labelKo: "파트너 피치", blurb: "The three-slide case for collaboration.", phase: 5 },
];

/** Items shown in the top navigation bar (excludes Home, which is the wordmark). */
export const PRIMARY_NAV = NAV_ITEMS.filter((i) => i.href !== "/");

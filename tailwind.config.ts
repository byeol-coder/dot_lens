import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm "paper" surface — Chromebook-light, but not stark white
        paper: "#FBFAF6",
        surface: "#FFFFFF",
        "surface-sunk": "#F4F1E9",
        ink: "#1A2230",
        muted: "#5B6675",
        faint: "#8A93A3",
        line: "#E8E3D8",
        // Signature: the "raised pin" — carries the tactile motif everywhere
        pin: "#D99A2B",
        "pin-soft": "#F2DCA8",
        // Primary interactive — a calm ink-blue (deliberately not a brand blue)
        accent: "#1F3A5F",
        "accent-soft": "#33558A",
        "accent-tint": "#EAF0F7",
        // Braille QA "verified"
        verify: "#2F8F6B",
        "verify-tint": "#E6F3EC",
        warn: "#B26B16",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: [
          "var(--font-sans)",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "Noto Sans KR",
          "system-ui",
          "sans-serif",
        ],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
        "3xl": "28px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(26,34,48,0.04), 0 8px 24px rgba(26,34,48,0.06)",
        lift: "0 2px 4px rgba(26,34,48,0.05), 0 16px 40px rgba(26,34,48,0.10)",
        inset: "inset 0 2px 10px rgba(26,34,48,0.06)",
      },
      letterSpacing: {
        eyebrow: "0.18em",
      },
    },
  },
  plugins: [],
};

export default config;

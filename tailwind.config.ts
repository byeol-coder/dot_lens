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
        // Premium cool near-white surfaces with futuristic accent lighting
        paper: "#F6F8FC",
        surface: "#FFFFFF",
        "surface-sunk": "#EDF1F8",
        ink: "#0F1729",
        muted: "#566175",
        faint: "#8B97AC",
        line: "#E2E8F2",
        // Signature: the "raised pin" — the tactile motif, a warm accent on cool surfaces
        pin: "#E0A12E",
        "pin-soft": "#F4DCA6",
        // Primary interactive — a confident, credible blue
        accent: "#2550C8",
        "accent-soft": "#4B79E6",
        "accent-tint": "#E9F0FE",
        // Gemini-style spectrum (used in gradients / glow / pipeline, carefully)
        "brand-blue": "#3B82F6",
        "brand-cyan": "#22C3DA",
        "brand-green": "#22B07D",
        // Status
        verify: "#1FA971",
        "verify-tint": "#E4F4EC",
        warn: "#B26B16",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
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
        card: "0 1px 2px rgba(15,23,41,0.04), 0 10px 26px rgba(15,23,41,0.06)",
        lift: "0 2px 6px rgba(15,23,41,0.06), 0 22px 50px rgba(15,23,41,0.12)",
        inset: "inset 0 2px 12px rgba(15,23,41,0.06)",
        glow: "0 18px 60px -18px rgba(37,80,200,0.42)",
        "glow-soft": "0 14px 48px -16px rgba(34,195,218,0.32)",
      },
      letterSpacing: {
        eyebrow: "0.18em",
      },
      keyframes: {
        "scan-sweep": {
          "0%": { transform: "translateY(-120%)" },
          "100%": { transform: "translateY(420%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "scan-sweep": "scan-sweep 3.4s ease-in-out infinite",
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#07162f',
        deepnavy: '#040b19',
        spiritPurple: '#7c3aed',
        spiritPink: '#ec4899',
        spiritSky: '#38bdf8',
      },
      boxShadow: {
        glow: '0 18px 60px rgba(56,189,248,0.18)',
      },
    },
  },
  plugins: [],
}

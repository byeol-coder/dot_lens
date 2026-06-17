# Dot Lens with Gemini for Chromebook

**Gemini understands the lesson. Global Braille Layer verifies the braille. Dot Pad makes learning touchable.**

An AI-powered tactile learning demo for Google Classroom / Chromebook / Gemini / Dot Pad collaboration. This repository is the **Phase 0 foundation**: project structure, design system, shared types, mock constants, navigation shell, and a polished landing page. No backend, Dot Pad logic, or braille engine yet.

## Tech stack

- Next.js 14 (App Router) · TypeScript · React 18
- Tailwind CSS 3
- No real Google / Gemini / Dot Pad services — mock adapters arrive in later phases.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build        # production build (prerenders all routes)
npm run start        # serve the production build
npm run typecheck    # tsc --noEmit
```

> Fonts are loaded with `next/font/google` (Fraunces, Figtree, IBM Plex Mono) and self-host at build time. The first `dev`/`build` needs internet to fetch them.

## Routes

| Route        | Surface                         | Phase |
| ------------ | ------------------------------- | ----- |
| `/`          | Landing                         | 0 ✅  |
| `/teacher`   | Assignment builder              | 1     |
| `/builder`   | Custom tactile lesson builder   | ✅    |
| `/student`   | Tactile explorer                | 2     |
| `/settings`  | Accessibility settings          | 2     |
| `/dashboard` | Teacher dashboard               | 3     |
| `/admin`     | Privacy & admin controls        | 4     |
| `/pitch`     | Partner pitch mode              | 5     |

All routes are reachable now; non-landing routes are polished scaffolds with mock data and a "Coming next" block.

### Custom tactile builder (`/builder`)

Teachers author their own tactile lessons end to end — no coding:

- Start from a **template** (process/flow, bar chart, geometry, blank) or scratch.
- For each object, pick a **shape** and place it on the 60×40 grid with keyboard-accessible sliders, write a **braille label** (auto-suggested) plus F1 explanation / F2 hint.
- The **Global Braille QA** layer checks every label with the real engine and blocks publishing on untranslatable characters.
- **Try it interactively** in the same six-key Dot Pad explorer a student uses, then **publish** to the lesson library.
- Lessons persist in `localStorage` (`lib/customLessons.ts`) and replay through a generalized, scene-driven engine (`lib/lessonPlayer.ts`) — the same model as the built-in lessons, no longer hard-coded to the water cycle.

## Structure

```
app/
  layout.tsx            # fonts + AppShell
  page.tsx              # landing
  globals.css           # Tailwind layers, focus styles, tactile-motif utilities
  teacher|student|settings|dashboard|admin|pitch/page.tsx
components/
  AppShell.tsx          # skip link + nav + main + footer
  TopNavigation.tsx     # active-route nav (client)
  StatusBadge.tsx       # verified / pending / review / draft / live
  ScreenCard.tsx
  ChromebookFrame.tsx   # placeholder device frame (no Google logos)
  DotLensSidePanel.tsx  # placeholder
  DotPadSimulator.tsx   # placeholder
  GeminiTutorPanel.tsx  # placeholder
  ValueCard.tsx         # landing card w/ braille motif
  Braille.tsx           # decorative braille glyph renderer
  PageScaffold.tsx      # PageHeader + ComingNext
lib/
  constants.ts          # mock Water Cycle assignment, analysis, layer, braille job, progress
  nav.ts                # navigation config
  cn.ts                 # className helper
types/
  index.ts              # all shared domain types
styles/                 # reserved
```

## Shared types (`types/index.ts`)

`Assignment`, `VisualAnalysis`, `TactileObject`, `TactileLayer`, `DotPadState`, `DotPadKey`,
`StudentProgress`, `BrailleStandard`, `BrailleTranslationJob`, `BrailleQAIssue`, `BrailleReview`
(plus supporting types: `LocalizedText`, `TactileMode`, `Modality`, `BrailleSummary`, etc.).

## Design direction

- Warm "paper" surface (`#FBFAF6`), deep ink-blue accent (`#1F3A5F`), and a signature **amber "raised pin"** (`#D99A2B`) that carries the tactile/braille motif across the UI.
- Type: Fraunces (display) · Figtree (UI) · IBM Plex Mono (labels/data).
- Chromebook-inspired (light, rounded, soft shadows) with **no Google logos**.
- Accessibility-first: semantic HTML, visible focus rings, keyboard-navigable nav, ARIA labels, reduced-motion support, AA-minded contrast.

## Not in this phase (by design)

- API routes (`app/api/...`)
- Dot Pad interaction logic / live 60×40 matrix
- Braille translation & QA engine
- Real Google Classroom / Gemini / Dot Pad integrations

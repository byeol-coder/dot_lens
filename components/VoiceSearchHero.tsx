"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useLang } from "@/lib/i18n";
import { LESSON_CATALOG, type LessonEntry } from "@/lib/lessonLibrary";
import { syncLessonToAllDevices, getDevices, simulateFleet } from "@/lib/dotpadFleet";
import { cn } from "@/lib/cn";

/* ── types ── */
type Phase = "idle" | "listening" | "processing" | "found" | "sending" | "sent" | "no_match";

/* ── search ── */
function findBestLesson(query: string, lang: "ko" | "en"): LessonEntry | null {
  const words = query.toLowerCase().split(/[\s,]+/).filter((w) => w.length >= 2);
  if (!words.length) return null;
  let best: { lesson: LessonEntry; score: number } | null = null;
  for (const lesson of LESSON_CATALOG) {
    const title = (lang === "ko" ? lesson.title.ko : lesson.title.en).toLowerCase();
    const desc  = (lang === "ko" ? lesson.description.ko : lesson.description.en).toLowerCase();
    const objs  = lesson.objects.join(" ").toLowerCase();
    let score = 0;
    for (const w of words) {
      if (title.includes(w)) score += 4;
      else if (objs.includes(w)) score += 2;
      else if (desc.includes(w)) score += 1;
    }
    if (score > 0 && (!best || score > best.score)) best = { lesson, score };
  }
  return best?.lesson ?? null;
}

/* ── speech shim ── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRec = any;
function getSR(): (new () => AnyRec) | null {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/* ── suggestion chips ── */
const SUGGESTIONS = [
  { ko: "식물의 성장 과정", en: "Plant life cycle",    query_ko: "식물 성장", query_en: "plant growth" },
  { ko: "이차함수 그래프",  en: "Quadratic graph",     query_ko: "이차함수",   query_en: "quadratic" },
  { ko: "문장 성분 구조",  en: "Sentence structure",   query_ko: "문장 성분",  query_en: "sentence" },
  { ko: "지역 지도",       en: "Regional map",         query_ko: "지역 지도",  query_en: "region map" },
];

const SUBJECT_LABELS: Record<string, { ko: string; en: string }> = {
  korean:   { ko: "국어",   en: "Korean" },
  math:     { ko: "수학",   en: "Math" },
  science:  { ko: "과학",   en: "Science" },
  social:   { ko: "사회",   en: "Social" },
  art:      { ko: "미술",   en: "Art" },
  mobility: { ko: "보행이동", en: "Mobility" },
};

/* ═══════════════════════════════════════════════════════ */
export function VoiceSearchHero() {
  const { lang } = useLang();
  const L = useCallback((en: string, ko: string) => (lang === "ko" ? ko : en), [lang]);

  const [phase, setPhase]         = useState<Phase>("idle");
  const [inputText, setInputText] = useState("");
  const [result, setResult]       = useState<LessonEntry | null>(null);
  const recognitionRef            = useRef<AnyRec>(null);
  const inputRef                  = useRef<HTMLInputElement>(null);

  /* auto-reset after sent */
  useEffect(() => {
    if (phase !== "sent") return;
    const t = setTimeout(() => { setPhase("idle"); setResult(null); setInputText(""); }, 4000);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => () => { recognitionRef.current?.abort(); }, []);

  /* ── run search + send ── */
  const runSearch = useCallback(async (query: string) => {
    setPhase("processing");
    await new Promise((r) => setTimeout(r, 380));
    const match = findBestLesson(query, lang);
    if (!match) { setPhase("no_match"); return; }
    setResult(match);
    setPhase("found");
    await new Promise((r) => setTimeout(r, 700));
    setPhase("sending");
    if (getDevices().length === 0) simulateFleet(1);
    try { await syncLessonToAllDevices(match.id); } catch { /* demo-safe */ }
    setPhase("sent");
  }, [lang]);

  /* ── keyboard submit ── */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputText.trim()) {
      recognitionRef.current?.abort();
      runSearch(inputText.trim());
    }
  }, [inputText, runSearch]);

  /* ── voice ── */
  const startListening = useCallback(() => {
    const SR = getSR();
    if (!SR) { inputRef.current?.focus(); return; }
    recognitionRef.current?.abort();
    setInputText("");
    setResult(null);
    setPhase("listening");

    const r = new SR();
    r.continuous = false;
    r.interimResults = true;
    r.lang = lang === "ko" ? "ko-KR" : "en-US";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onresult = (e: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const text = Array.from(e.results as any[]).map((res: any) => res[0].transcript as string).join("");
      setInputText(text);
      if (e.results[e.results.length - 1].isFinal) {
        recognitionRef.current = null;
        runSearch(text);
      }
    };
    r.onerror = () => setPhase("idle");
    r.onend = () => { if (phase === "listening") setPhase("idle"); };
    r.start();
    recognitionRef.current = r;
  }, [lang, phase, runSearch]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setPhase("idle");
  }, []);

  const isActive = phase !== "idle" && phase !== "no_match";

  /* ── render ── */
  return (
    <section
      aria-label={L("Voice lesson search", "음성 수업 검색")}
      className="relative overflow-hidden border-b border-line/60"
    >
      {/* Soft gradient background — Gemini-style */}
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(145deg, rgba(219,234,254,0.85) 0%, rgba(224,242,254,0.60) 30%, rgba(240,249,255,0.35) 60%, rgba(248,250,252,0.15) 100%)",
        }}
      />
      {/* Subtle dot-pin texture */}
      <div className="pin-texture absolute inset-0 opacity-30" aria-hidden />

      <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:py-20">

        {/* ── Greeting ── */}
        <p
          className={cn(
            "text-[13px] font-medium uppercase tracking-widest transition-colors duration-300",
            isActive ? "text-accent" : "text-muted"
          )}
        >
          {L("AI Tactile Learning Platform", "AI 촉각 교육 플랫폼")}
        </p>
        <h2
          className="mt-3 text-balance text-[26px] font-semibold leading-tight text-ink transition-all duration-500 sm:text-[34px]"
          style={{ fontFamily: "var(--font-display, inherit)", letterSpacing: "-0.01em" }}
        >
          {L(
            "What would you like to learn today, Saetbyeol?",
            "샛별님, 무엇을 하고 싶으신가요?"
          )}
        </h2>

        {/* ── Search bar ── */}
        <div
          className={cn(
            "relative mt-8 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_4px_32px_rgba(37,99,235,0.10)] ring-1 transition-all duration-300 sm:px-5 sm:py-4",
            phase === "listening"
              ? "ring-red-400 shadow-[0_4px_32px_rgba(239,68,68,0.15)]"
              : isActive
              ? "ring-accent/60 shadow-[0_4px_32px_rgba(37,99,235,0.18)]"
              : "ring-line/60 hover:ring-accent/30"
          )}
        >
          {/* Dot icon left */}
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent"
            aria-hidden
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/>
              <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor"/>
              <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor"/>
              <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".4"/>
            </svg>
          </span>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              phase === "listening"
                ? L("Listening… speak now", "듣는 중… 말씀해 주세요")
                : L(
                    "Say or type a lesson topic — sent straight to Dot Pad",
                    "수업 주제를 말하거나 입력하면 바로 Dot Pad로 전송됩니다"
                  )
            }
            aria-label={L("Lesson search", "수업 자료 검색")}
            className="min-w-0 flex-1 bg-transparent text-[14px] font-medium text-ink placeholder:text-faint focus:outline-none sm:text-[15px]"
            disabled={phase === "processing" || phase === "sending"}
          />

          {/* Waveform bars during listening */}
          {phase === "listening" && (
            <span className="flex shrink-0 items-end gap-[2.5px] h-5 mr-1" aria-hidden>
              {[3, 5, 7, 5, 3].map((h, i) => (
                <span
                  key={i}
                  className="w-[3px] rounded-full bg-red-400"
                  style={{
                    height: `${h * 3}px`,
                    animation: `vs-bar 0.6s ${i * 0.1}s ease-in-out infinite alternate`,
                  }}
                />
              ))}
            </span>
          )}

          {/* Status text right of input */}
          {(phase === "processing" || phase === "sending") && (
            <span className="shrink-0 text-[12px] font-medium text-accent animate-pulse">
              {phase === "processing" ? L("Searching…", "검색 중…") : L("Sending…", "전송 중…")}
            </span>
          )}

          {/* Mic button */}
          <button
            type="button"
            onClick={phase === "listening" ? stopListening : startListening}
            disabled={phase === "processing" || phase === "sending"}
            aria-label={
              phase === "listening"
                ? L("Stop listening", "듣기 중지")
                : L("Start voice search", "음성 검색 시작")
            }
            className={cn(
              "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
              phase === "listening"
                ? "bg-red-500 text-white scale-110"
                : "bg-accent text-white hover:bg-accent-soft hover:scale-105 disabled:opacity-40"
            )}
          >
            {phase === "listening" && (
              <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-40" aria-hidden />
            )}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <rect x="6.5" y="1.5" width="5" height="8" rx="2.5" fill="currentColor" />
              <path d="M3 8.5a6 6 0 0012 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              <line x1="9" y1="14.5" x2="9" y2="17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <line x1="6" y1="17" x2="12" y2="17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ── Suggestion chips ── */}
        {phase === "idle" && (
          <div
            className="mt-4 flex flex-wrap items-center justify-center gap-2"
            aria-label={L("Quick search suggestions", "빠른 검색 제안")}
          >
            {SUGGESTIONS.map((s) => (
              <button
                key={s.ko}
                type="button"
                onClick={() => {
                  const q = lang === "ko" ? s.query_ko : s.query_en;
                  setInputText(q);
                  runSearch(q);
                }}
                className="rounded-full border border-line bg-white/80 px-3.5 py-1.5 text-[12.5px] font-medium text-ink/80 shadow-sm transition-all hover:border-accent/40 hover:bg-accent-tint/50 hover:text-accent"
              >
                {lang === "ko" ? s.ko : s.en}
              </button>
            ))}
          </div>
        )}

        {/* ── Result card ── */}
        {result && (phase === "found" || phase === "sending" || phase === "sent") && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white shadow-card text-left">
            <div className={cn(
              "px-4 py-2 text-[11.5px] font-semibold uppercase tracking-wide",
              phase === "sent" ? "bg-verify-tint/50 text-verify" : "bg-accent-tint/50 text-accent"
            )}>
              {phase === "sent"
                ? L("✓ Rendered on Dot Pad", "✓ Dot Pad 출력 완료")
                : phase === "sending"
                ? L("Sending to Dot Pad…", "Dot Pad로 전송 중…")
                : L("Found — sending in a moment…", "찾았습니다 — 곧 전송합니다…")}
            </div>
            <div className="p-4">
              <p className="text-[15px] font-semibold text-ink">
                {lang === "ko" ? result.title.ko : result.title.en}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold text-accent">
                  {SUBJECT_LABELS[result.subject]?.[lang] ?? result.subject}
                </span>
                <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px] font-medium text-muted">
                  {result.steps} {L("steps", "단계")}
                </span>
                <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px] font-medium text-muted">
                  {result.brailleLabel}
                </span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-muted line-clamp-2">
                {lang === "ko" ? result.description.ko : result.description.en}
              </p>
            </div>
          </div>
        )}

        {/* ── No match ── */}
        {phase === "no_match" && (
          <div className="mt-5 rounded-xl border border-line bg-white/80 px-4 py-3 text-[13px] text-muted shadow-sm">
            <span className="font-semibold text-ink">&ldquo;{inputText}&rdquo;</span>{" "}
            {L("— no lesson found. Try a different keyword.", "— 일치하는 수업 자료가 없습니다. 다른 키워드를 시도해보세요.")}
          </div>
        )}
      </div>

      {/* animation keyframes */}
      <style>{`
        @keyframes vs-bar {
          from { transform: scaleY(0.35); opacity: 0.6; }
          to   { transform: scaleY(1.0);  opacity: 1.0; }
        }
      `}</style>
    </section>
  );
}

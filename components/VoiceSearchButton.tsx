"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/cn";
import { useLang } from "@/lib/i18n";
import { LESSON_CATALOG, type LessonEntry } from "@/lib/lessonLibrary";
import { syncLessonToAllDevices, getDevices, simulateFleet } from "@/lib/dotpadFleet";

/* ── types ── */
type Phase =
  | "idle"
  | "listening"
  | "processing"
  | "found"
  | "sending"
  | "sent"
  | "no_match"
  | "unavailable";

/* ── lesson search ── */
function findBestLesson(query: string, lang: "ko" | "en"): LessonEntry | null {
  const words = query
    .toLowerCase()
    .split(/[\s,]+/)
    .filter((w) => w.length >= 2);
  if (!words.length) return null;

  let best: { lesson: LessonEntry; score: number } | null = null;

  for (const lesson of LESSON_CATALOG) {
    const title = (lang === "ko" ? lesson.title.ko : lesson.title.en).toLowerCase();
    const desc = (lang === "ko" ? lesson.description.ko : lesson.description.en).toLowerCase();
    const objs = lesson.objects.join(" ").toLowerCase();
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

/* ── label helpers ── */
const SUBJECT_LABELS: Record<string, { ko: string; en: string }> = {
  korean:   { ko: "국어",   en: "Korean" },
  math:     { ko: "수학",   en: "Math" },
  science:  { ko: "과학",   en: "Science" },
  social:   { ko: "사회",   en: "Social" },
  art:      { ko: "미술",   en: "Art" },
  mobility: { ko: "보행이동", en: "Mobility" },
};
const GRADE_LABELS: Record<string, { ko: string; en: string }> = {
  elementary: { ko: "초등",   en: "Elementary" },
  middle:     { ko: "중학교", en: "Middle" },
  high:       { ko: "고등학교", en: "High" },
};

/* ── SpeechRecognition shim — typed as any because the Web Speech API
     is not in every TS DOM lib version and vendor-prefixed on webkit ── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySpeechRecognition = any;
function getSpeechRecognition(): (new () => AnySpeechRecognition) | null {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/* ── main component ── */
export function VoiceSearchButton() {
  const { lang } = useLang();
  const [phase, setPhase] = useState<Phase>("idle");
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState<LessonEntry | null>(null);
  const recognitionRef = useRef<AnySpeechRecognition | null>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const L = useCallback(
    (en: string, ko: string) => (lang === "ko" ? ko : en),
    [lang]
  );

  /* auto-dismiss after sent */
  useEffect(() => {
    if (phase === "sent") {
      dismissTimer.current = setTimeout(() => {
        setPhase("idle");
        setTranscript("");
        setResult(null);
      }, 3500);
    }
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, [phase]);

  /* clean up on unmount */
  useEffect(() => () => { recognitionRef.current?.abort(); }, []);

  const dismiss = useCallback(() => {
    recognitionRef.current?.abort();
    setPhase("idle");
    setTranscript("");
    setResult(null);
  }, []);

  const startListening = useCallback(() => {
    const SR = getSpeechRecognition();
    if (!SR) { setPhase("unavailable"); return; }

    recognitionRef.current?.abort();
    setTranscript("");
    setResult(null);
    setPhase("listening");

    const r = new SR();
    r.continuous = false;
    r.interimResults = true;
    r.lang = lang === "ko" ? "ko-KR" : "en-US";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onresult = (e: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const text = Array.from(e.results as any[])
        .map((res: any) => res[0].transcript as string)
        .join("");
      setTranscript(text);

      if (e.results[e.results.length - 1].isFinal) {
        setPhase("processing");
        recognitionRef.current = null;

        setTimeout(() => {
          const match = findBestLesson(text, lang);
          if (!match) { setPhase("no_match"); return; }
          setResult(match);
          setPhase("found");

          /* wait 800ms then send */
          setTimeout(async () => {
            setPhase("sending");

            /* ensure at least one demo device exists */
            const devs = getDevices();
            if (devs.length === 0) simulateFleet(1);

            try {
              await syncLessonToAllDevices(match.id);
            } catch {
              /* non-fatal in demo — device sim always resolves */
            }
            setPhase("sent");
          }, 800);
        }, 400);
      }
    };

    r.onerror = () => setPhase("idle");
    r.onend = () => {
      if (phase === "listening") setPhase("idle");
    };

    r.start();
    recognitionRef.current = r;
  }, [lang, phase]);

  /* ── floating button ── */
  const micBtn = (
    <button
      type="button"
      onClick={phase === "idle" ? startListening : dismiss}
      aria-label={
        phase === "listening"
          ? L("Stop listening", "듣기 중지")
          : L("Voice search — speak to find a lesson", "음성 검색 — 말하면 수업 자료를 찾아줍니다")
      }
      aria-live="polite"
      className={cn(
        "relative flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all",
        phase === "idle" || phase === "sent"
          ? "bg-accent text-white hover:bg-accent-soft hover:scale-105 focus-visible:outline-accent"
          : phase === "listening"
          ? "bg-red-500 text-white scale-110"
          : "bg-surface-sunk text-muted cursor-default",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      )}
    >
      {/* listening pulse ring */}
      {phase === "listening" && (
        <span
          className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-40"
          aria-hidden
        />
      )}

      {phase === "idle" || phase === "unavailable" ? (
        /* mic icon */
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" />
          <path d="M5 11a7 7 0 0014 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="22" x2="16" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : phase === "listening" ? (
        /* waveform bars */
        <span className="flex items-end gap-[3px] h-5" aria-hidden>
          {[3, 5, 7, 5, 3].map((h, i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-white"
              style={{
                height: `${h * 3}px`,
                animation: `voice-bar 0.6s ${i * 0.1}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </span>
      ) : phase === "sent" ? (
        /* checkmark */
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
          <path d="M4 11l6 6L18 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        /* spinner */
        <svg className="animate-spin" width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2" strokeDasharray="30 20" />
        </svg>
      )}
    </button>
  );

  /* ── result overlay ── */
  const overlay = phase !== "idle" && (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-none absolute bottom-16 right-0 w-72 rounded-2xl border border-line bg-surface p-4 shadow-xl transition-all duration-300",
        "opacity-100 translate-y-0"
      )}
    >
      {/* transcript */}
      {(phase === "listening" || phase === "processing") && (
        <div className="space-y-2">
          <p className="eyebrow text-accent">
            {phase === "listening"
              ? L("Listening…", "듣는 중…")
              : L("Searching…", "검색 중…")}
          </p>
          <p className="min-h-[20px] text-[13px] font-medium text-ink">
            {transcript || (
              <span className="text-faint italic">
                {L('Say: "Find a lesson about…"', '"수업 자료 찾아줘" 라고 말해보세요')}
              </span>
            )}
          </p>
        </div>
      )}

      {/* found / sending / sent */}
      {result && (phase === "found" || phase === "sending" || phase === "sent") && (
        <div className="space-y-3">
          <p className="eyebrow text-accent">
            {phase === "sent"
              ? L("Sent to Dot Pad ✓", "Dot Pad 전송 완료 ✓")
              : phase === "sending"
              ? L("Sending to Dot Pad…", "Dot Pad로 전송 중…")
              : L("Found!", "찾았습니다!")}
          </p>

          <div className="rounded-xl border border-line bg-surface-sunk/60 p-3">
            <p className="text-[13px] font-semibold text-ink leading-tight">
              {lang === "ko" ? result.title.ko : result.title.en}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                {SUBJECT_LABELS[result.subject]?.[lang] ?? result.subject}
              </span>
              <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-medium text-muted border border-line">
                {GRADE_LABELS[result.grade]?.[lang] ?? result.grade}
              </span>
              <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-medium text-muted border border-line">
                {result.steps} {L("steps", "단계")}
              </span>
            </div>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted line-clamp-2">
              {lang === "ko" ? result.description.ko : result.description.en}
            </p>
          </div>

          {phase === "sent" && (
            <div className="flex items-center gap-2 rounded-lg bg-verify-tint/40 px-3 py-2 text-[12px] font-semibold text-verify">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2 7l4 4 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {L("Rendered on Dot Pad", "Dot Pad에 출력됨")}
            </div>
          )}
        </div>
      )}

      {/* no match */}
      {phase === "no_match" && (
        <div className="space-y-1">
          <p className="eyebrow text-warn">{L("No match", "검색 결과 없음")}</p>
          <p className="text-[12.5px] text-muted">
            {transcript
              ? `"${transcript}" — ${L("No lesson found. Try again.", "일치하는 수업 자료가 없습니다. 다시 말해보세요.")}`
              : L("No speech detected.", "음성이 인식되지 않았습니다.")}
          </p>
        </div>
      )}

      {/* unavailable */}
      {phase === "unavailable" && (
        <div className="space-y-1">
          <p className="eyebrow text-warn">{L("Voice unavailable", "음성 인식 불가")}</p>
          <p className="text-[12.5px] text-muted">
            {L(
              "Use Chrome or Edge for voice search.",
              "Chrome 또는 Edge에서 음성 검색을 사용할 수 있습니다."
            )}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* animation keyframes — injected inline once */}
      <style>{`
        @keyframes voice-bar {
          from { transform: scaleY(0.4); opacity: 0.7; }
          to   { transform: scaleY(1.0); opacity: 1.0; }
        }
      `}</style>

      {/* fixed container — sits above the AccessibilityBar (bottom-4) */}
      <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end print:hidden">
        {overlay}
        {micBtn}
      </div>
    </>
  );
}

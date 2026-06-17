"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export type FontScale = "sm" | "base" | "lg" | "xl";

interface A11yState {
  highContrast: boolean;
  fontScale: FontScale;
  reduceMotion: boolean;
}

interface A11yContextValue extends A11yState {
  setHighContrast: (v: boolean) => void;
  setFontScale: (v: FontScale) => void;
  setReduceMotion: (v: boolean) => void;
  /** Announce a transient status message to screen readers. */
  announce: (msg: string) => void;
}

const DEFAULT: A11yState = {
  highContrast: false,
  fontScale: "base",
  reduceMotion: false,
};

const STORAGE_KEY = "dotlens.a11y.v1";

const A11yContext = createContext<A11yContextValue>({
  ...DEFAULT,
  setHighContrast: () => {},
  setFontScale: () => {},
  setReduceMotion: () => {},
  announce: () => {},
});

export function useA11y() {
  return useContext(A11yContext);
}

export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<A11yState>(DEFAULT);
  const [liveMsg, setLiveMsg] = useState("");
  const [hydrated, setHydrated] = useState(false);

  // Load saved prefs once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {
      /* ignore corrupt prefs */
    }
    setHydrated(true);
  }, []);

  // Reflect state onto <html> + persist.
  useEffect(() => {
    if (!hydrated) return;
    const el = document.documentElement;
    el.setAttribute("data-contrast", state.highContrast ? "high" : "normal");
    el.setAttribute("data-font-scale", state.fontScale);
    el.setAttribute("data-reduce-motion", String(state.reduceMotion));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable — non-fatal */
    }
  }, [state, hydrated]);

  const announce = useCallback((msg: string) => {
    setLiveMsg("");
    // Force the live region to re-fire even for an identical message.
    requestAnimationFrame(() => setLiveMsg(msg));
  }, []);

  const value: A11yContextValue = {
    ...state,
    setHighContrast: (v) => setState((s) => ({ ...s, highContrast: v })),
    setFontScale: (v) => setState((s) => ({ ...s, fontScale: v })),
    setReduceMotion: (v) => setState((s) => ({ ...s, reduceMotion: v })),
    announce,
  };

  return (
    <A11yContext.Provider value={value}>
      {children}
      {/* Polite live region: status changes are read without stealing focus. */}
      <div
        aria-live="polite"
        role="status"
        className="sr-only"
        data-testid="a11y-live"
      >
        {liveMsg}
      </div>
    </A11yContext.Provider>
  );
}

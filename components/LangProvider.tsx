"use client";

import { useEffect, useState } from "react";
import { LangContext, type Lang } from "@/lib/i18n";

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  // Keep <html lang> in sync so screen readers announce in the right language.
  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang === "ko" ? "ko" : "en";
  }, [lang]);
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

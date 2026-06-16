"use client";

import { createContext, useContext } from "react";

export type Lang = "en" | "ko";

export const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
}>({ lang: "en", setLang: () => {} });

export function useLang() {
  return useContext(LangContext);
}

/** Pick the right string from a bilingual object. */
export function t(obj: { en: string; ko: string }, lang: Lang): string {
  return obj[lang];
}

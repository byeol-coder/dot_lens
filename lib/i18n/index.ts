"use client";

import { createContext, useContext } from "react";
import en from "./en";
import ko from "./ko";

export type Lang = "en" | "ko";

/** Translation key — any key defined in the dictionaries. */
export type TKey = keyof typeof en;

const DICT: Record<Lang, Record<TKey, string>> = { en, ko };

export const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
}>({ lang: "en", setLang: () => {} });

export function useLang() {
  return useContext(LangContext);
}

/**
 * Key-based translator hook. `t("landing.title")` returns the string for the
 * active language. Falls back to the key itself if missing (dev-visible).
 */
export function useT() {
  const { lang } = useLang();
  const table = DICT[lang];
  const t = (key: TKey): string => table[key] ?? en[key] ?? key;
  return { t, lang };
}

/** Resolve a key for a known language without a hook (e.g. metadata). */
export function tr(key: TKey, lang: Lang = "en"): string {
  return DICT[lang][key] ?? en[key] ?? key;
}

/** Backward-compatible: pick the right string from a bilingual object. */
export function t(obj: { en: string; ko: string }, lang: Lang): string {
  return obj[lang];
}

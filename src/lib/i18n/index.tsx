import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { en, type Dict } from "./en";
import { ms } from "./ms";

export type Lang = "en" | "ms";

const dictionaries: Record<Lang, Dict> = { en: en as unknown as Dict, ms };

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
}>({ lang: "en", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  // Default to English on first paint so SEO crawlers always see English copy.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("kova-lang");
    if (saved === "en" || saved === "ms") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = dictionaries[lang].meta.htmlLang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("kova-lang", l);
    } catch {
      /* ignore quota / private mode errors */
    }
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

export function useT(): Dict {
  const { lang } = useContext(LangContext);
  return dictionaries[lang];
}

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { en, type Dict } from "./en";
import { ms } from "./ms";

export type Lang = "en" | "ms";

const dictionaries: Record<Lang, Dict> = { en: en as unknown as Dict, ms };

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
}>({ lang: "en", setLang: () => {} });

/**
 * Language is URL-derived where possible so each language has a stable,
 * crawlable canonical:
 *
 *   /                EN   (default; what Google's first pass sees)
 *   /bidai           BM   (Malay landing — the URL itself carries the
 *                          primary search keyword)
 *   /blog, /blog/:s  shared; language falls back to the visitor's saved
 *                          preference so a BM visitor who clicks Journal
 *                          doesn't bounce back into English.
 *
 * Toggling the language on `/` or `/bidai` navigates between them — that's
 * what makes the BM page indexable as Malay. Toggling on /blog just flips
 * the in-page language; the URL stays put.
 */
export function LangProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isMalayUrl = pathname === "/bidai" || pathname.startsWith("/bidai/");

  // Stored preference — used as the fallback on language-neutral routes.
  const [storedLang, setStoredLang] = useState<Lang>("en");
  useEffect(() => {
    const saved = localStorage.getItem("kova-lang");
    if (saved === "en" || saved === "ms") setStoredLang(saved);
  }, []);

  const lang: Lang = isMalayUrl ? "ms" : pathname === "/" ? "en" : storedLang;

  // Mirror the active language to <html lang> for accessibility and SEO.
  useEffect(() => {
    document.documentElement.lang = dictionaries[lang].meta.htmlLang;
  }, [lang]);

  // Visiting /bidai becomes a vote for Malay on subsequent neutral routes.
  useEffect(() => {
    if (isMalayUrl && storedLang !== "ms") {
      setStoredLang("ms");
      try {
        localStorage.setItem("kova-lang", "ms");
      } catch {
        /* ignore quota / private-mode errors */
      }
    }
  }, [isMalayUrl, storedLang]);

  const setLang = (l: Lang) => {
    setStoredLang(l);
    try {
      localStorage.setItem("kova-lang", l);
    } catch {
      /* ignore */
    }

    // Navigate between the canonical EN/BM URLs when on the home route.
    // Anywhere else, just persist the preference — the URL stays put.
    if (l === "ms" && pathname === "/") navigate("/bidai");
    else if (l === "en" && isMalayUrl) navigate("/");
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

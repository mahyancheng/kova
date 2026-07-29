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
  const isEnglishUrl =
    pathname === "/" ||
    ["/roller", "/venetian", "/vertisheer", "/process", "/configurator", "/contact", "/blog"].includes(pathname) ||
    pathname.startsWith("/blog/");

  // Canonical language routes are authoritative. A saved preference must not
  // turn an English URL into Malay after hydration (or vice versa), because
  // that makes the rendered title/content disagree with the static metadata.
  const [storedLang, setStoredLang] = useState<Lang>("en");
  useEffect(() => {
    const saved = localStorage.getItem("kova-lang");
    if (saved === "en" || saved === "ms") setStoredLang(saved);
  }, []);
  const routeLang: Lang | null = isMalayUrl ? "ms" : isEnglishUrl ? "en" : null;
  const lang: Lang = routeLang ?? storedLang;

  // Mirror the active language to <html lang> and remember explicit language
  // routes for any genuinely language-neutral fallback URL.
  useEffect(() => {
    document.documentElement.lang = dictionaries[lang].meta.htmlLang;
    if (routeLang && routeLang !== storedLang) {
      setStoredLang(routeLang);
      try {
        localStorage.setItem("kova-lang", routeLang);
      } catch {
        /* ignore quota / private-mode errors */
      }
    }
  }, [lang, routeLang, storedLang]);

  const setLang = (l: Lang) => {
    setStoredLang(l);
    try {
      localStorage.setItem("kova-lang", l);
    } catch {
      /* ignore */
    }

    const pairs: Record<string, string> = {
      "/": "/bidai",
      "/roller": "/bidai/roller",
      "/venetian": "/bidai/venetian",
      "/vertisheer": "/bidai/vertisheer",
      "/process": "/bidai/proses",
      "/configurator": "/bidai/reka",
      "/contact": "/bidai/hubungi",
      "/blog": "/bidai/jurnal",
    };
    const reverse = Object.fromEntries(Object.entries(pairs).map(([enPath, msPath]) => [msPath, enPath]));
    let target = l === "ms" ? pairs[pathname] : reverse[pathname];
    if (l === "ms" && pathname.startsWith("/blog/")) target = pathname.replace("/blog/", "/bidai/jurnal/");
    if (l === "en" && pathname.startsWith("/bidai/jurnal/")) target = pathname.replace("/bidai/jurnal/", "/blog/");
    if (target) navigate(target);
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

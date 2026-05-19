import { useT } from "@/lib/i18n";

export function Footer() {
  const t = useT();
  return (
    <footer className="bg-[var(--color-cream)] border-t border-[var(--color-line)]">
      <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <a href="#top" className="inline-flex items-center gap-2.5">
              <span className="inline-block h-7 w-7">
                <svg viewBox="0 0 32 32" className="h-full w-full">
                  <rect
                    x="6"
                    y="5"
                    width="20"
                    height="22"
                    rx="1"
                    fill="none"
                    stroke="#1A1714"
                    strokeWidth="1.5"
                  />
                  <line x1="6" y1="11" x2="26" y2="11" stroke="#8B5A3C" strokeWidth="1.4" />
                  <line x1="6" y1="16" x2="26" y2="16" stroke="#8B5A3C" strokeWidth="1.4" />
                  <line x1="6" y1="21" x2="26" y2="21" stroke="#8B5A3C" strokeWidth="1.4" />
                </svg>
              </span>
              <span className="font-serif text-[1.05rem] tracking-tight">
                Kova<span className="text-[var(--color-clay)]">·</span>Sun Shade
              </span>
            </a>
            <p className="mt-6 max-w-sm text-[var(--color-ink-soft)] leading-relaxed text-[0.95rem]">
              {t.footer.tagline}
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {t.footer.cols.map((col) => (
              <div key={col.title}>
                <p className="eyebrow">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.items.map(([label, href]) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="text-[0.95rem] text-[var(--color-ink-soft)] hover:text-[var(--color-clay-deep)] transition-colors"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-[var(--color-line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[0.82rem] text-[var(--color-muted)]">
          <p>© {new Date().getFullYear()} Kova Sun Shade. {t.footer.copyA}</p>
          <p>
            {t.footer.copyB}
            <span className="italic">{t.footer.copyC}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

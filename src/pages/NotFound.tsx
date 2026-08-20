import { Link, useLocation } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { Reveal } from "@/components/Reveal";

export function NotFound() {
  const { pathname } = useLocation();

  // 智能识别：如果是马来语(BM)路径下的错误，返回 /bidai；否则返回英文主页 /
  const homeLink = pathname.startsWith("/bidai") ? "/bidai" : "/";
  const isBm = pathname.startsWith("/bidai");

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex flex-col items-center justify-center px-5 text-center">
      {/* 静态托管对不存在的路径也会返回 200，必须用 noindex 告诉 Google 别收录这些软 404 页 */}
      <Head>
        <title>{isBm ? "404 — Halaman Tidak Ditemui | Kova Sun Shade" : "404 — Page Not Found | Kova Sun Shade"}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Reveal>
        <span className="font-serif text-[clamp(5rem,3rem+8vw,10rem)] font-light leading-none text-[var(--color-clay-deep)] opacity-80">
          404
        </span>
        
        <h1 className="mt-4 font-serif text-[clamp(1.5rem,1.2rem+2vw,2.5rem)] text-[var(--color-ink)] leading-tight">
          {isBm ? "Halaman Tidak Ditemui" : "Page Not Found"}
        </h1>
        
        <p className="mt-4 max-w-md mx-auto text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">
          {isBm 
            ? "Maaf, halaman yang anda cari tidak wujud atau telah dialihkan." 
            : "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."
          }
        </p>
        
        <div className="mt-10">
          <Link
            to={homeLink}
            className="inline-flex items-center justify-center px-8 py-3 bg-[var(--color-ink)] text-[var(--color-cream)] rounded-md text-[0.88rem] uppercase tracking-wider font-medium hover:opacity-90 transition-opacity"
          >
            {isBm ? "Kembali Ke Laman Utama" : "Back to Home"}
          </Link>
        </div>
      </Reveal>
    </div>
  );
}

export default NotFound;
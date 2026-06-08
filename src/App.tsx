import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LangProvider } from "@/lib/i18n";
import { ConfiguratorProvider } from "@/lib/configurator/context";
import { ScrollManager } from "./components/ScrollManager";
import { SeoHead } from "./components/SeoHead";
import { JsonLd } from "./components/JsonLd";
import { Home } from "./pages/Home";

// Code-split the journal — visitors who only browse the landing never
// pay the cost of react-markdown + remark-gfm. ~45 KB gz off the home
// LCP path.
const Blog = lazy(() => import("./pages/Blog").then((m) => ({ default: m.Blog })));
const BlogPost = lazy(() =>
  import("./pages/BlogPost").then((m) => ({ default: m.BlogPost })),
);

function PageFallback() {
  // Cream wash that matches the brand background so the swap is silent.
  return <div className="min-h-screen bg-[var(--color-cream)]" />;
}

export default function App() {
  return (
    // Router is the outermost wrapper so LangProvider can derive the
    // active language from the URL (`/` → EN, `/bidai` → BM) and the
    // SeoHead can emit a per-route canonical + hreflang.
    <BrowserRouter>
      <LangProvider>
        <SeoHead />
        <JsonLd />
        <ConfiguratorProvider>
          <ScrollManager />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              {/* Malay landing — Google-friendly URL for the BM keyword set. */}
              <Route path="/bidai" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              {/* BM blog counterparts — same components, language follows URL. */}
              <Route path="/bidai/jurnal" element={<Blog />} />
              <Route path="/bidai/jurnal/:slug" element={<BlogPost />} />
              {/* Unknown path → land on home rather than a hard 404. */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </ConfiguratorProvider>
      </LangProvider>
    </BrowserRouter>
  );
}

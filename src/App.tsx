import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LangProvider } from "@/lib/i18n";
import { ConfiguratorProvider } from "@/lib/configurator/context";
import { ScrollManager } from "./components/ScrollManager";
import { SeoHead } from "./components/SeoHead";
import { Home } from "./pages/Home";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";

export default function App() {
  return (
    // Router is the outermost wrapper so LangProvider can derive the
    // active language from the URL (`/` → EN, `/bidai` → BM) and the
    // SeoHead can emit a per-route canonical + hreflang.
    <BrowserRouter>
      <LangProvider>
        <SeoHead />
        <ConfiguratorProvider>
          <ScrollManager />
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
        </ConfiguratorProvider>
      </LangProvider>
    </BrowserRouter>
  );
}

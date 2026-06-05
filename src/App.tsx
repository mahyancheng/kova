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
    <LangProvider>
      <SeoHead />
      <ConfiguratorProvider>
        <BrowserRouter>
          <ScrollManager />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            {/* Unknown path → land on home rather than a hard 404. */}
            <Route path="*" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </ConfiguratorProvider>
    </LangProvider>
  );
}

// src/App.tsx
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { LangProvider } from "@/lib/i18n";
import { ConfiguratorProvider } from "@/lib/configurator/context";
import { ScrollManager } from "./components/ScrollManager";
import { AnalyticsTracker } from "./components/AnalyticsTracker";
import { SeoHead } from "./components/SeoHead";
import { JsonLd } from "./components/JsonLd";

// ✅ 1. 引入你的 WhatsApp 悬浮窗组件（请确保路径与你实际保存的一致）
import WhatsAppChatWidget from "./components/WhatsAppChatWidget";

export default function App() {
  // ⚠️ 不要在这里再包一层 HelmetProvider！
  // vite-react-ssg 在构建和客户端启动时已经提供了自己的 HelmetProvider，
  // 多包一层会导致 <title>/<meta>/<link rel="canonical"> 被渲染进 <body> 而不是 <head>。
  return (
    <LangProvider>
      <SeoHead />
      <JsonLd />
      <ConfiguratorProvider>
        <ScrollManager />
        <AnalyticsTracker />

        {/* 这里的 Outlet 负责渲染所有子页面（Home, Roller 等） */}
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>

        {/* ✅ 2. 把全局挂件放在这里！它会伴随整个 App 的生命周期，不会随着页面切换而消失 */}
        <WhatsAppChatWidget phoneE164="60179778289" />

      </ConfiguratorProvider>
    </LangProvider>
  );
}
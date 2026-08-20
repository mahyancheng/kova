import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// vite-react-ssg (see main.tsx's ViteReactSSG({ routes })) already renders
// each route server-side at build time and bakes in its own <title>/meta
// via <SeoHead>, producing a real dist/<route>/index.html per page. An
// earlier regex-based post-build "prerenderStaticHead" plugin that used to
// live here duplicated that job by copying the home page's HTML shell over
// every other route and hand-patching its <head> — with real per-route SSR
// in place, that copy would have overwritten every other page's rendered
// body with the home page's. Removed; vite-react-ssg is the single source
// of truth for prerendered HTML now.
// 直接引入包，TypeScript 会自动将 ssgOptions 的类型合并到 Vite 的 UserConfig 中
import "vite-react-ssg";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ssgOptions: {
    dirStyle: 'nested'
  },
  // 👇 添加下面这段 build 配置
  build: {
    modulePreload: {
      polyfill: true, // 确保开启预加载
    },
  }
});
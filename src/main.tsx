// src/main.tsx
import { lazy } from 'react';
import { ViteReactSSG } from 'vite-react-ssg';
import type { LoaderFunctionArgs } from 'react-router-dom';
import App from './App';
// 首页 (Home) 作为首屏门面，必须保持直接引入！
import { Home } from './pages/Home';
import './index.css';
import { getPost, listPostPaths } from './lib/blog';

// --- 博客文章预渲染（SSG）---
// loader 在构建期抓取文章内容，让每篇文章的 HTML 直接包含正文（Google 无需跑 JS 就能读到）。
// 构建之后才发布的新文章：loader 在浏览器里返回 null，BlogPost 组件会退回客户端抓取（和以前一样）。
const blogPostLoader = (lang: 'en' | 'ms') =>
  async ({ params }: LoaderFunctionArgs) => {
    if (!params.slug) return null;
    return await getPost(params.slug, lang);
  };

// getStaticPaths 告诉 vite-react-ssg 要为哪些 slug 生成静态页面
const blogStaticPaths = (lang: 'en' | 'ms', prefix: string) => async () => {
  const rows = await listPostPaths();
  return rows.filter((r) => r.lang === lang).map((r) => `${prefix}/${r.slug}`);
};


// 将所有非首屏组件改为懒加载
const RollerPage = lazy(() => import('./pages/Roller').then(m => ({ default: m.RollerPage })));
const VenetianPage = lazy(() => import('./pages/Venetian').then(m => ({ default: m.VenetianPage })));
const VertiSheerPage = lazy(() => import('./pages/VertiSheer').then(m => ({ default: m.VertiSheerPage })));
const ProcessPage = lazy(() => import('./pages/ProcessPage').then(m => ({ default: m.ProcessPage })));
const ConfiguratorPage = lazy(() => import('./pages/ConfiguratorPage').then(m => ({ default: m.ConfiguratorPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const Blog = lazy(() => import('./pages/Blog').then(m => ({ default: m.Blog })));
const BlogPost = lazy(() => import('./pages/BlogPost').then(m => ({ default: m.BlogPost })));

// 1. 新增：将 404 页面放入懒加载，分离打包体积
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

// 使用嵌套路由结构：App 作为根节点，页面作为其 children
const routes = [
  {
    path: '/',
    element: <App />, 
    children: [
      { index: true, element: <Home /> }, 
      { path: 'roller', element: <RollerPage /> },
      { path: 'venetian', element: <VenetianPage /> },
      { path: 'vertisheer', element: <VertiSheerPage /> },
      { path: 'process', element: <ProcessPage /> },
      { path: 'configurator', element: <ConfiguratorPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'blog', element: <Blog /> },
      {
        path: 'blog/:slug',
        element: <BlogPost />,
        loader: blogPostLoader('en'),
        getStaticPaths: blogStaticPaths('en', '/blog'),
      },
      
      // Bahasa Malaysia (BM) Routes
      { path: 'bidai', element: <Home /> },
      { path: 'bidai/roller', element: <RollerPage /> },
      { path: 'bidai/venetian', element: <VenetianPage /> },
      { path: 'bidai/vertisheer', element: <VertiSheerPage /> },
      { path: 'bidai/proses', element: <ProcessPage /> },
      { path: 'bidai/reka', element: <ConfiguratorPage /> },
      { path: 'bidai/hubungi', element: <ContactPage /> },
      { path: 'bidai/jurnal', element: <Blog /> },
      {
        path: 'bidai/jurnal/:slug',
        element: <BlogPost />,
        loader: blogPostLoader('ms'),
        getStaticPaths: blogStaticPaths('ms', '/bidai/jurnal'),
      },
      
      // 2. 核心修改：当以上路由全都匹配不到时，渲染 NotFound 组件而不再是 Home
      { path: '*', element: <NotFound /> } 
    ]
  }
];

// 核心终极修复：必须命名为 createRoot ！！！
export const createRoot = ViteReactSSG({ routes });
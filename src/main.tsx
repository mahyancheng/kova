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
      
      // '404' 是一个真实、可枚举的路径，vite-react-ssg 会把它预渲染成
      // dist/404/index.html —— Apache 用 ErrorDocument 404 指向这个文件，
      // 这样直接访问一个不存在的网址时，返回的是真正的 HTTP 404 状态码 +
      // 这个页面的内容，而不是 200 状态码 + 首页内容（软 404，Google 会
      // 把它当成跟首页重复的内容，白白浪费抓取预算）。
      { path: '404', element: <NotFound /> },
      // 通配符仍然保留：处理 JS 已加载后，用户在站内点到坏链接的情况
      // （这时 Apache 层面已经返回过 200，只能靠客户端路由兜底）。
      { path: '*', element: <NotFound /> }
    ]
  }
];

// 核心终极修复：必须命名为 createRoot ！！！
export const createRoot = ViteReactSSG({ routes });
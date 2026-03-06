# Next.js SSR 集成指南 - 防止 FOUC 闪烁

## 问题描述

在使用 Next.js 服务端渲染 (SSR) 时，Layout 组件可能出现从黑色背景闪烁到白色背景的 FOUC (Flash of Unstyled Content) 问题。这是因为：

1. 服务端渲染时 `theme` prop 可能为 `undefined`
2. styled-components 样式在客户端水合 (hydration) 时才注入
3. 浏览器默认背景色或组件默认样式短暂显示

## 解决方案

### 1. 创建自定义 `_document.tsx`

在 Next.js 项目中创建 `pages/_document.tsx`（Pages Router）或配置 App Router 的样式提取：

```tsx
// pages/_document.tsx
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          {/* 防止 FOUC 的初始背景色 */}
          <style>{`
            html, body {
              background-color: #fff !important;
            }
          `}</style>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

### 2. App Router 配置 (Next.js 13+)

如果使用 App Router，创建 `app/layout.tsx`：

```tsx
// app/layout.tsx
import { StyledComponentsRegistry } from './registry';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 防止 FOUC：设置初始背景色 */}
        <style>{`
          html, body {
            background-color: #fff !important;
          }
        `}</style>
      </head>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
```

创建 `app/registry.tsx`：

```tsx
// app/registry.tsx
'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // 只在服务端创建样式表
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== 'undefined') {
    return <>{children}</>;
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}
```

### 3. next.config.js 配置

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 确保 styled-components 正确编译
  compiler: {
    styledComponents: true,
  },
  // 其他配置...
};

module.exports = nextConfig;
```

### 4. 组件使用建议

在使用 Layout 组件时，**始终明确指定 theme 属性**，避免依赖默认值：

```tsx
import { Layout } from '@zjpcy/simple-design';

// ✅ 推荐：明确指定 theme
function MyPage() {
  return (
    <Layout theme="light">
      <Layout.Header theme="light">Header</Layout.Header>
      <Layout.Sider theme="light">Sider</Layout.Sider>
      <Layout.Content theme="light">Content</Layout.Content>
    </Layout>
  );
}

// ❌ 避免：依赖默认值可能导致 SSR/CSR 不一致
function MyPage() {
  return (
    <Layout>
      <Layout.Header>Header</Layout.Header>
    </Layout>
  );
}
```

### 5. 使用 isMounted 模式（可选）

对于动态主题切换，可以使用 isMounted 模式避免 hydration 不匹配：

```tsx
'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@zjpcy/simple-design';

function SafeLayout({ theme = 'light', children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 服务端渲染时使用固定主题
  if (!mounted) {
    return (
      <Layout theme="light">
        <Layout.Header theme="light">...</Layout.Header>
        {children}
      </Layout>
    );
  }

  // 客户端使用实际主题
  return (
    <Layout theme={theme}>
      <Layout.Header theme={theme}>...</Layout.Header>
      {children}
    </Layout>
  );
}
```

### 6. CSS 变量覆盖（全局保护）

在全局 CSS 中添加保护：

```css
/* globals.css */

/* 防止 FOUC：确保 HTML 和 body 有默认亮色背景 */
html,
body {
  background-color: #fff !important;
}

/* Layout 组件 SSR 安全样式 */
.layout-wrapper,
.layout-header,
.layout-sider,
.layout-content,
.layout-footer {
  background-color: #fff;
}

/* Dark 主题通过 data 属性覆盖 */
[data-theme='dark'].layout-wrapper,
[data-theme='dark'].layout-header,
[data-theme='dark'].layout-sider,
[data-theme='dark'].layout-content,
[data-theme='dark'].layout-footer {
  background-color: transparent; /* 让 styled-components 接管 */
}
```

## 验证修复

1. **禁用 JavaScript 测试**：在浏览器开发者工具中禁用 JS，刷新页面，应该看到白色背景而不是黑色
2. **慢速网络测试**：使用 Chrome DevTools 的 Slow 3G 节流，观察是否还有闪烁
3. **SSR 验证**：查看页面源代码，确认样式已经内联在 HTML 中

## 常见问题

### Q: 为什么 FOUC 只出现在 Layout 组件？
A: Layout 组件使用了 styled-components 和复杂的主题条件渲染，SSR 时主题判断可能不一致。

### Q: 使用 CSS Modules 或 Tailwind 会更好吗？
A: 这些方案确实更 SSR 友好。styled-components 需要额外的配置（如上述 _document.tsx）才能完美支持 SSR。

### Q: 动态主题切换时如何处理？
A: 参考第 5 节的 isMounted 模式，确保服务端和客户端初始渲染一致，然后在客户端水合后切换主题。

## 相关链接

- [styled-components SSR 文档](https://styled-components.com/docs/advanced#server-side-rendering)
- [Next.js styled-components 示例](https://github.com/vercel/next.js/tree/canary/examples/with-styled-components)

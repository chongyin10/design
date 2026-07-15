# ZjpCy Design 组件库使用指南

## 1. 简介

ZjpCy Design（`@zjpcy/simple-design`）是一套基于 React 的现代化 UI 组件库，提供简洁、美观、易用的组件，适用于各类 Web 应用开发。

- 🎨 现代化设计风格，视觉语言统一
- ⚡️ 轻量高效
- 📱 响应式设计支持
- 🌐 国际化（i18n）支持
- 📝 TypeScript 支持，提供完整类型定义

## 2. 环境要求

- React >= 16.8
- React DOM >= 16.8
- TypeScript >= 4.0（推荐）

## 3. 安装

使用 npm、yarn 或 pnpm 安装：

```bash
# npm
npm i @zjpcy/simple-design

# yarn
yarn add @zjpcy/simple-design

# pnpm
pnpm add @zjpcy/simple-design
```

> 注意：本库将 React 作为 peer dependency，请确保你的项目已安装 `react` 和 `react-dom`。

## 4. 引入样式

组件库提供了一份聚合样式文件，直接引入即可：

```tsx
// 引入全部组件样式（推荐）
import '@zjpcy/simple-design/dist/es/index.css';
```

如果你需要覆盖主题变量，可以在引入组件样式之前引入 CSS 变量文件：

```tsx
// 引入 CSS 变量（可选，用于主题定制）
import '@zjpcy/simple-design/dist/variables.css';

// 引入全部组件样式
import '@zjpcy/simple-design/dist/es/index.css';
```

## 5. 快速开始

### 基础用法

```tsx
import React from 'react';
import { Button, message } from '@zjpcy/simple-design';

function App() {
  const handleClick = () => {
    message.success('Hello, ZjpCy Design!');
  };

  return (
    <Button variant="primary" onClick={handleClick}>
      Click Me
    </Button>
  );
}

export default App;
```

> 注意：Button 组件使用 `variant` 属性定义按钮类型，而不是 `type`。

## 6. 引入方式

### 全量引入

```tsx
import { Button, Flex, Table } from '@zjpcy/simple-design';
import '@zjpcy/simple-design/dist/es/index.css';
```

### 按需引入（JS 侧）

ESM 构建产物支持 Tree Shaking， bundler 会自动移除未使用的组件代码。样式目前统一打包在 `dist/es/index.css` 中，建议直接全量引入：

```tsx
import Button from '@zjpcy/simple-design/dist/es/components/Button';
import '@zjpcy/simple-design/dist/es/index.css';
```

> 注意：当前版本未提供组件级 CSS 文件，如需最小化样式体积，可在构建后使用 PurgeCSS 等工具按需处理。

## 7. 组件列表

### 通用组件

| 组件 | 说明 |
|------|------|
| `Button` | 按钮组件，支持多种变体 |
| `Icon` | 图标组件，支持 SVG |
| `Typography` | 文本排版组件 |

### 布局组件

| 组件 | 说明 |
|------|------|
| `Flex` | 弹性盒布局 |
| `Grid` / `Row` / `Col` | 24 栏栅格系统 |
| `Layout` | 页面布局结构（Header、Content、Footer、Sider） |
| `Space` | 间距组件 |
| `Splitter` | 可调整尺寸的分割面板 |

### 导航组件

| 组件 | 说明 |
|------|------|
| `Anchor` | 页面锚点导航 |
| `Breadcrumb` | 面包屑导航 |
| `Dropdown` | 下拉菜单 |
| `Menu` | 导航菜单 |
| `Pagination` | 分页组件 |
| `Steps` | 步骤条 |
| `Tabs` | 标签页 |
| `Top` | 回到顶部 |

### 表单组件

| 组件 | 说明 |
|------|------|
| `Cascader` | 级联选择器 |
| `Checkbox` | 多选框 |
| `ColorPicker` | 颜色选择器 |
| `DatePicker` / `DatePicker.RangePicker` | 日期选择 |
| `Form` | 表单容器，支持校验 |
| `Input` / `Input.Textarea` | 输入框 / 文本域 |
| `Radio` | 单选框 |
| `Rate` | 评分 |
| `Select` | 下拉选择器 |
| `Slider` | 滑动输入条 |
| `Switch` | 开关 |
| `TimePicker` / `TimePicker.RangePicker` | 时间选择 |
| `Transfer` | 穿梭框 |
| `TreeSelect` | 树形选择器 |
| `Upload` | 文件上传 |

### 数据展示组件

| 组件 | 说明 |
|------|------|
| `Calendar` | 日历 |
| `Card` | 卡片 |
| `Carousel` | 轮播图 |
| `Empty` | 空状态占位 |
| `Marquee` | 滚动文字 |
| `Masonry` | 瀑布流布局 |
| `Table` | 数据表格 |
| `Tag` | 标签 |
| `Tree` | 树形结构 |

### 反馈组件

| 组件 | 说明 |
|------|------|
| `Drawer` | 抽屉 |
| `Message` / `message` | 消息提示 |
| `Modal` | 对话框 |
| `Notification` | 通知提醒框 |
| `Popconfirm` | 气泡确认框 |
| `Progress` | 进度条 |
| `Spin` | 加载中 |
| `Tooltip` | 文字提示 |

### 工具组件

| 组件 | 说明 |
|------|------|
| `CopyToClipboard` | 复制到剪贴板 |
| `Divider` | 分割线 |
| `Label` | 标签 |

## 8. 国际化（i18n）

ZjpCy Design 支持多语言：

```tsx
import { I18nProvider } from '@zjpcy/simple-design';

function App() {
  return (
    <I18nProvider locale="zh-CN">
      <YourApp />
    </I18nProvider>
  );
}
```

支持的语言：`zh-CN`、`en-US`、`ja-JP`、`ko-KR`

## 9. 本地开发

如需本地开发或调试组件库，请按以下步骤操作：

1. 克隆仓库：
   ```bash
   git clone git@github.com:chongyin10/simple-design.git
   ```
2. 进入项目目录：
   ```bash
   cd simple-design
   ```
3. 安装依赖：
   ```bash
   npm install
   # 或 yarn install
   ```
4. 启动开发服务器：
   ```bash
   npm run dev
   # 或 yarn dev
   ```

## 10. 构建

```bash
# 构建组件库（类型 + CJS/ESM + CSS）
npm run build

# 只构建类型声明
npm run build:types

# 只使用 Rollup 构建
npm run build:rollup

# 构建文档站点（输出到 distweb/）
npm run build:web
```

## 11. 浏览器支持

- Chrome >= 80
- Firefox >= 75
- Safari >= 13
- Edge >= 80

## 12. 开源协议

MIT License © 2025 ZjpCy Design

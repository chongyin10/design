import { CSSProperties, ReactNode } from 'react';

/**
 * Layout 组件属性接口
 */
export interface LayoutProps {
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: CSSProperties;
  /** 是否包含 Sider（会影响布局） */
  hasSider?: boolean;
  /** 主题模式 */
  theme?: 'light' | 'dark';
  /** 子元素 */
  children?: ReactNode;
}

/**
 * Layout.Header 组件属性接口
 */
export interface LayoutHeaderProps {
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: CSSProperties;
  /** 子元素 */
  children?: ReactNode;
  /** 头部高度 */
  height?: string | number;
  /** 固定头部 */
  fixed?: boolean;
  /** 主题模式 */
  theme?: 'light' | 'dark';
}

/**
 * Layout.Content 组件属性接口
 */
export interface LayoutContentProps {
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: CSSProperties;
  /** 子元素 */
  children?: ReactNode;
  /** 主题模式 */
  theme?: 'light' | 'dark';
}

/**
 * Layout.Footer 组件属性接口
 */
export interface LayoutFooterProps {
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: CSSProperties;
  /** 子元素 */
  children?: ReactNode;
  /** 页脚高度 */
  height?: string | number;
  /** 固定页脚 */
  fixed?: boolean;
  /** 主题模式 */
  theme?: 'light' | 'dark';
}

/**
 * Layout.Sider 组件属性接口
 */
export interface LayoutSiderProps {
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: CSSProperties;
  /** 子元素 */
  children?: ReactNode;
  /** 侧边栏宽度 */
  width?: string | number;
  /** 收缩宽度 */
  collapsedWidth?: number;
  /** 是否可收缩 */
  collapsible?: boolean;
  /** 是否收缩 */
  collapsed?: boolean;
  /** 收缩/展开时的回调 */
  onCollapse?: (collapsed: boolean) => void;
  /** 收缩按钮的触发器 */
  trigger?: ReactNode;
  /** 收缩按钮位置，默认为 'bottom' */
  triggerPlacement?: 'top' | 'bottom';
  /** 是否使用完全收缩模式（收缩时宽度为0，并显示浮动展开按钮） */
  zeroWidthMode?: boolean;
  /** 是否处于嵌套布局中（用于内部计算，用户无需设置） */
  inNestedLayout?: boolean;
  /** 侧边栏位置（暂未实现，预留） */
  placement?: 'left' | 'right';
  /** 是否固定 */
  fixed?: boolean;
  /** 主题模式 */
  theme?: 'light' | 'dark';
}

/**
 * 布局配置接口
 */
export interface LayoutConfig {
  /** 默认主题配置 */
  theme: {
    headerBg: string;
    headerHeight: string;
    footerBg: string;
    footerHeight: string;
    siderBg: string;
    siderWidth: string;
    siderCollapsedWidth: string;
    contentBg: string;
  };
}

import React from 'react';

/**
 * 菜单项数据类型
 */
export interface MenuItem {
  /** 菜单项唯一标识 */
  key: string;
  /** 菜单项显示文本 */
  label: string;
  /** 菜单项图标 */
  icon?: React.ReactNode;
  /** 子菜单项数组 */
  children?: MenuItem[];
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 菜单模式类型
 */
export type MenuMode = 'horizontal' | 'vertical' | 'inline';

/**
 * Menu 组件 Props
 */
export interface MenuProps {
  /** 菜单模式 */
  mode?: MenuMode;
  /** 菜单项数组 */
  items: MenuItem[];
  /** 自定义 CSS 类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 当前选中的菜单项key */
  selectedKey?: string;
  /** 默认展开的菜单项key数组 */
  defaultOpenKeys?: string[];
  /** 展开的菜单项key数组（受控模式） */
  openKeys?: string[];
  /** 折叠状态，仅对 vertical 模式有效 */
  collapsed?: boolean;
  /** 菜单项点击回调函数 */
  onChange?: (info: MenuItem, key: string) => void;
  /** 展开/折叠回调函数 */
  onOpenChange?: (openKeys: string[]) => void;
}

/**
 * 菜单项组件 Props
 */
export interface MenuItemComponentProps {
  item: MenuItem;
  level: number;
  mode: MenuMode;
  collapsed?: boolean;
  openKeySet: Set<string>;
  selectedKey: string;
  onItemClick: (item: MenuItem, key: string) => void;
  onToggleOpen: (key: string) => void;
}

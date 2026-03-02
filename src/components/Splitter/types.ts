/**
 * Splitter 组件类型定义
 * 用于自由切分指定区域，支持水平和垂直分隔，支持多面板
 */

import React from 'react';

/**
 * 单个面板配置
 */
export interface SplitterPanel {
  /** 面板内容 */
  content: React.ReactNode;
  /** 面板默认大小（像素或百分比） */
  defaultSize?: number | string;
  /** 面板最小尺寸 */
  minSize?: number;
  /** 面板最大尺寸 */
  maxSize?: number;
  /** 是否禁用该面板相邻的分割条拖拽 */
  disabled?: boolean;
}

/**
 * Splitter 组件 Props
 */
export interface SplitterProps {
  /** 布局方向 */
  layout?: 'horizontal' | 'vertical';
  /**
   * 面板数组，支持多面板配置
   * 当提供 panels 时，优先使用 panels，忽略 left/right/top/bottom/children
   */
  panels?: SplitterPanel[];
  /**
   * 默认大小配置（像素或百分比）
   * 可以是单个值（用于2面板模式）或数组（用于多面板模式）
   * 默认为 '50%' 或 ['33%', '33%', '33%']
   */
  defaultSize?: number | string | (number | string)[];
  /**
   * 最小尺寸配置
   * 可以是单个值或数组
   */
  minSize?: number | number[];
  /**
   * 最大尺寸配置
   * 可以是单个值或数组
   */
  maxSize?: number | number[];
  /** 分割条大小（像素），默认为 10 */
  splitterSize?: number;
  /** 拖拽线颜色 */
  lineColor?: string;
  /** 拖拽线悬停/拖拽时的颜色 */
  lineHoverColor?: string;
  /** 是否禁用所有拖拽 */
  disabled?: boolean;
  /**
   * 拖拽时的回调
   * @param sizes - 所有面板的当前尺寸数组
   * @param index - 正在拖拽的分割条索引
   */
  onResize?: (sizes: number[], index: number) => void;
  /**
   * 拖拽结束后的回调
   * @param sizes - 所有面板的最终尺寸数组
   */
  onResizeEnd?: (sizes: number[]) => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** @deprecated 请使用 panels 或 children */
  left?: React.ReactNode;
  /** @deprecated 请使用 panels 或 children */
  right?: React.ReactNode;
  /** @deprecated 请使用 panels 或 children */
  top?: React.ReactNode;
  /** @deprecated 请使用 panels 或 children */
  bottom?: React.ReactNode;
  /**
   * 子元素数组
   * 用于2面板模式时传入 [面板1, 面板2]
   * 用于多面板模式时传入任意数量的面板
   */
  children?: React.ReactNode[];
}

/**
 * 单个拖拽状态
 */
export interface DragState {
  /** 是否正在拖拽 */
  isDragging: boolean;
  /** 拖拽开始时的鼠标/触摸位置 */
  startPosition: number;
  /** 拖拽开始时的各面板尺寸 */
  startSizes: number[];
  /** 容器尺寸 */
  containerSize: number;
  /** 正在拖拽的分割条索引 */
  splitterIndex: number;
}

/**
 * 面板尺寸信息
 */
export interface PanelSizeInfo {
  /** 面板索引 */
  index: number;
  /** 面板当前尺寸 */
  size: number;
  /** 面板最小尺寸 */
  minSize: number;
  /** 面板最大尺寸 */
  maxSize: number;
  /** 默认尺寸 */
  defaultSize: number | string;
}

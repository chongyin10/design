/**
 * Splitter 组件类型定义
 * 简洁版 - 仅通过 children 内联样式控制面板宽度
 */

import React from 'react';

/**
 * Splitter 组件 Props
 */
export interface SplitterProps {
  /** 布局方向 */
  layout?: 'horizontal' | 'vertical';
  /** 分割条大小（像素），默认为 10 */
  splitterSize?: number;
  /** 拖拽线颜色 */
  lineColor?: string;
  /** 拖拽线悬停/拖拽时的颜色 */
  lineHoverColor?: string;
  /** 是否禁用拖拽 */
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
  /**
   * 子元素数组
   * 通过内联样式 width/height 设置面板初始大小
   * 未设置宽度的面板将自动均分剩余空间
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
 * PanelContent 面板内容组件 Props
 */
export interface PanelContentProps {
  /** 面板标题 */
  title: string;
  /** 背景颜色 */
  color?: string;
  /** 子内容 */
  children?: React.ReactNode;
}

/**
 * 面板尺寸信息
 */
export interface PanelSizeInfo {
  /** 面板索引 */
  index: number;
  /** 面板当前尺寸 */
  size: number;
  /** 默认尺寸 */
  defaultSize: number | string;
}

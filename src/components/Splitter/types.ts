/**
 * Splitter 组件类型定义
 * 用于自由切分指定区域，支持水平和垂直分隔
 */

import React from 'react';

/**
 * Splitter 组件 Props
 */
export interface SplitterProps {
  /** 布局方向 */
  layout?: 'horizontal' | 'vertical';
  /** 左侧/上面板的默认大小（像素或百分比），默认为 '50%' */
  defaultSize?: number | string;
  /** 左侧/上面板的最小尺寸 */
  minSize?: number;
  /** 左侧/上面板的最大尺寸 */
  maxSize?: number;
  /** 分割条大小（像素），默认为 8 */
  splitterSize?: number;
  /** 拖拽线颜色 */
  lineColor?: string;
  /** 拖拽线悬停/拖拽时的颜色 */
  lineHoverColor?: string;
  /** 是否禁用拖拽 */
  disabled?: boolean;
  /** 拖拽时的回调，返回当前左侧面板的大小 */
  onResize?: (size: number) => void;
  /** 拖拽结束后的回调 */
  onResizeEnd?: (size: number) => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 左侧面板内容 */
  left?: React.ReactNode;
  /** 右侧面板内容 */
  right?: React.ReactNode;
  /** 上面板内容（垂直布局时使用） */
  top?: React.ReactNode;
  /** 下面板内容（垂直布局时使用） */
  bottom?: React.ReactNode;
  /** 子元素（替代 left/right/top/bottom） */
  children?: [React.ReactNode, React.ReactNode];
}

/**
 * 拖拽状态
 */
export interface DragState {
  /** 是否正在拖拽 */
  isDragging: boolean;
  /** 拖拽开始时的鼠标位置 */
  startPosition: number;
  /** 拖拽开始时的面板尺寸 */
  startSize: number;
  /** 容器尺寸 */
  containerSize: number;
}

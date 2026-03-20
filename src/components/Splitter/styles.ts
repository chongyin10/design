/**
 * Splitter 组件样式工具函数 - 简洁版
 */

import { CSSProperties } from 'react';

/**
 * 获取容器样式
 */
export const getContainerStyle = (
  layout: 'horizontal' | 'vertical',
  customStyle?: CSSProperties
): CSSProperties => {
  return {
    display: 'flex',
    flexDirection: layout === 'horizontal' ? 'row' : 'column',
    alignItems: 'stretch',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    background: 'var(--zjpcy-splitter-panel-bg)',
    borderRadius: 'var(--zjpcy-splitter-panel-radius)',
    ...customStyle,
  };
};

/**
 * 获取面板样式
 * @param size - 面板尺寸（像素）
 * @param layout - 布局方向
 * @param index - 面板索引
 * @param totalPanels - 面板总数
 */
export const getPanelStyle = (
  size: number,
  layout: 'horizontal' | 'vertical',
  index: number = 0,
  totalPanels: number = 2
): CSSProperties => {
  const baseStyle: CSSProperties = {
    position: 'relative',
    overflow: 'auto',
    flexShrink: 0,
    alignSelf: 'stretch',
    background: 'var(--zjpcy-splitter-panel-bg)',
  };

  if (layout === 'horizontal') {
    baseStyle.width = `${size}px`;
    baseStyle.height = 'auto';
    baseStyle.minHeight = '100%';
  } else {
    baseStyle.width = 'auto';
    baseStyle.minWidth = '100%';
    baseStyle.height = `${size}px`;
  }

  // 非最后一个面板添加阴影效果
  if (index < totalPanels - 1) {
    baseStyle.boxShadow = layout === 'horizontal'
      ? 'var(--zjpcy-splitter-panel-shadow)'
      : 'var(--zjpcy-splitter-panel-shadow-vertical)';
    baseStyle.zIndex = totalPanels - index;
  }

  return baseStyle;
};

/**
 * 获取分割条样式
 */
export const getSplitterBarStyle = (
  layout: 'horizontal' | 'vertical',
  splitterSize: number | undefined,
  disabled: boolean,
  index: number = 0
): CSSProperties => {
  const baseStyle: CSSProperties = {
    position: 'relative',
    flexShrink: 0,
    background: disabled ? 'var(--zjpcy-bg-color-light)' : 'var(--zjpcy-splitter-bar-bg)',
    cursor: disabled ? 'not-allowed' : layout === 'horizontal' ? 'col-resize' : 'row-resize',
    userSelect: 'none',
    touchAction: 'none',
    zIndex: 10 + index * 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--zjpcy-splitter-shadow-sm)',
    transition: 'all var(--zjpcy-transition-duration) var(--zjpcy-transition-timing-function)',
  };

  // 如果指定了自定义大小，使用它
  if (splitterSize !== undefined) {
    if (layout === 'horizontal') {
      baseStyle.width = `${splitterSize}px`;
      baseStyle.height = '100%';
    } else {
      baseStyle.width = '100%';
      baseStyle.height = `${splitterSize}px`;
    }
  }

  if (disabled) {
    baseStyle.opacity = 'var(--zjpcy-opacity-disabled)';
  }

  return baseStyle;
};

/**
 * 获取分割线样式
 */
export const getSplitterLineStyle = (
  layout: 'horizontal' | 'vertical',
  lineColor: string | undefined,
  lineHoverColor: string | undefined,
  isDragging: boolean,
  isActive: boolean = false
): CSSProperties => {
  const baseStyle: CSSProperties = {
    borderRadius: 'var(--zjpcy-border-radius-sm)',
    transition: 'all var(--zjpcy-transition-duration) var(--zjpcy-transition-timing-function)',
  };

  // 水平布局：垂直分割线
  if (layout === 'horizontal') {
    baseStyle.width = lineColor ? '2px' : 'var(--zjpcy-splitter-line-width)';
    baseStyle.height = lineColor ? '32px' : 'var(--zjpcy-splitter-line-length)';
    baseStyle.minHeight = 'var(--zjpcy-splitter-line-min-length)';
  } else {
    // 垂直布局：水平分割线
    baseStyle.width = lineColor ? '32px' : 'var(--zjpcy-splitter-line-length)';
    baseStyle.minWidth = 'var(--zjpcy-splitter-line-min-length)';
    baseStyle.height = lineColor ? '2px' : 'var(--zjpcy-splitter-line-width)';
  }

  // 颜色处理
  if (isActive && isDragging && lineHoverColor) {
    baseStyle.backgroundColor = lineHoverColor;
    baseStyle.boxShadow = 'var(--zjpcy-splitter-shadow-active)';
  } else if (isDragging && lineHoverColor) {
    baseStyle.backgroundColor = lineHoverColor;
    baseStyle.boxShadow = 'var(--zjpcy-splitter-shadow-md)';
  } else if (lineColor) {
    baseStyle.backgroundColor = lineColor;
  } else {
    baseStyle.background = 'var(--zjpcy-splitter-line-bg)';
  }

  return baseStyle;
};

// 引入 React 用于类型检查
import React from 'react';

/**
 * 从子元素解析宽度/高度配置
 * @param child - React 子元素
 * @param layout - 布局方向
 * @returns 宽度值（数字/百分比字符串）或 null（未设置）
 */
export const parseWidthFromChild = (
  child: React.ReactNode,
  layout: 'horizontal' | 'vertical'
): number | string | null => {
  // 检查是否是 React 元素
  if (!React.isValidElement(child)) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = child.props as any;
  const style = props?.style;
  if (!style) {
    return null;
  }

  // 根据布局方向获取对应样式属性
  const sizeProp = layout === 'horizontal' ? 'width' : 'height';
  const value = style[sizeProp];

  if (value === undefined || value === null || value === 'auto') {
    return null;
  }

  // 返回宽度值（可以是数字或字符串如 '200px', '30%'）
  return value;
};

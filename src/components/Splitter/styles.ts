/**
 * Splitter 组件样式工具函数
 * 使用 CSS 变量与现代化设计系统保持一致
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
    background: 'var(--idp-splitter-panel-bg)',
    borderRadius: 'var(--idp-splitter-panel-radius)',
    ...customStyle,
  };
};

/**
 * 获取面板样式
 */
export const getPanelStyle = (
  size: number,
  layout: 'horizontal' | 'vertical',
  isFirst: boolean = false
): CSSProperties => {
  const baseStyle: CSSProperties = {
    position: 'relative',
    overflow: 'auto',
    flexShrink: 0,
    alignSelf: 'stretch',
    background: 'var(--idp-splitter-panel-bg)',
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

  // 第一个面板添加阴影效果
  if (isFirst) {
    baseStyle.boxShadow = layout === 'horizontal'
      ? 'var(--idp-splitter-panel-shadow)'
      : 'var(--idp-splitter-panel-shadow-vertical)';
  }

  return baseStyle;
};

/**
 * 获取分割条样式
 * 使用 CSS 变量实现现代化渐变和阴影效果
 */
export const getSplitterBarStyle = (
  layout: 'horizontal' | 'vertical',
  splitterSize: number | undefined,
  disabled: boolean
): CSSProperties => {
  const baseStyle: CSSProperties = {
    position: 'relative',
    flexShrink: 0,
    background: disabled ? 'var(--idp-bg-color-light)' : 'var(--idp-splitter-bar-bg)',
    cursor: disabled ? 'not-allowed' : layout === 'horizontal' ? 'col-resize' : 'row-resize',
    userSelect: 'none',
    touchAction: 'none',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--idp-splitter-shadow-sm)',
    transition: 'all var(--idp-transition-duration) var(--idp-transition-timing-function)',
  };

  // 如果指定了自定义大小，使用它；否则依赖 CSS 变量
  if (splitterSize !== undefined) {
    if (layout === 'horizontal') {
      baseStyle.width = `${splitterSize}px`;
      baseStyle.height = '100%';
    } else {
      baseStyle.width = '100%';
      baseStyle.height = `${splitterSize}px`;
    }
  }

  // 禁用状态降低透明度
  if (disabled) {
    baseStyle.opacity = 'var(--idp-opacity-disabled)';
  }

  return baseStyle;
};

/**
 * 获取分割线样式
 * 支持自定义颜色和拖拽状态
 */
export const getSplitterLineStyle = (
  layout: 'horizontal' | 'vertical',
  lineColor: string | undefined,
  lineHoverColor: string | undefined,
  isDragging: boolean
): CSSProperties => {
  // 基础样式
  const baseStyle: CSSProperties = {
    borderRadius: 'var(--idp-border-radius-sm)',
    transition: 'all var(--idp-transition-duration) var(--idp-transition-timing-function)',
  };

  // 水平布局：垂直分割线
  if (layout === 'horizontal') {
    baseStyle.width = lineColor ? '2px' : 'var(--idp-splitter-line-width)';
    baseStyle.height = lineColor ? '32px' : 'var(--idp-splitter-line-length)';
    baseStyle.minHeight = 'var(--idp-splitter-line-min-length)';
  } else {
    // 垂直布局：水平分割线
    baseStyle.width = lineColor ? '32px' : 'var(--idp-splitter-line-length)';
    baseStyle.minWidth = 'var(--idp-splitter-line-min-length)';
    baseStyle.height = lineColor ? '2px' : 'var(--idp-splitter-line-width)';
  }

  // 颜色处理
  if (isDragging && lineHoverColor) {
    // 拖拽时使用自定义悬停色
    baseStyle.backgroundColor = lineHoverColor;
    baseStyle.boxShadow = 'var(--idp-splitter-shadow-active)';
  } else if (lineColor) {
    // 使用自定义颜色
    baseStyle.backgroundColor = lineColor;
  } else {
    // 使用 CSS 变量渐变
    baseStyle.background = layout === 'horizontal' 
      ? 'var(--idp-splitter-line-bg)' 
      : 'var(--idp-splitter-line-bg)';
  }

  return baseStyle;
};

/**
 * 获取拖拽遮罩层样式
 * 用于拖拽时覆盖整个页面防止事件穿透
 */
export const getDragOverlayStyle = (): CSSProperties => {
  return {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    cursor: 'inherit',
  };
};

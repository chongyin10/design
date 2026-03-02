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

  // 非最后一个面板添加阴影效果，营造层次感
  if (index < totalPanels - 1) {
    baseStyle.boxShadow = layout === 'horizontal'
      ? 'var(--idp-splitter-panel-shadow)'
      : 'var(--idp-splitter-panel-shadow-vertical)';
    baseStyle.zIndex = totalPanels - index; // 前面的面板层级更高
  }

  return baseStyle;
};

/**
 * 获取分割条样式
 * 使用 CSS 变量实现现代化渐变和阴影效果
 * @param layout - 布局方向
 * @param splitterSize - 分割条大小
 * @param disabled - 是否禁用
 * @param index - 分割条索引
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
    background: disabled ? 'var(--idp-bg-color-light)' : 'var(--idp-splitter-bar-bg)',
    cursor: disabled ? 'not-allowed' : layout === 'horizontal' ? 'col-resize' : 'row-resize',
    userSelect: 'none',
    touchAction: 'none',
    zIndex: 10 + index * 5, // 每个分割条有不同的层级，避免重叠问题
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
 * @param layout - 布局方向
 * @param lineColor - 线条颜色
 * @param lineHoverColor - 悬停颜色
 * @param isDragging - 是否正在拖拽
 * @param isActive - 是否激活状态（当前拖拽的分割条）
 */
export const getSplitterLineStyle = (
  layout: 'horizontal' | 'vertical',
  lineColor: string | undefined,
  lineHoverColor: string | undefined,
  isDragging: boolean,
  isActive: boolean = false
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
  if (isActive && isDragging && lineHoverColor) {
    // 拖拽时使用自定义悬停色
    baseStyle.backgroundColor = lineHoverColor;
    baseStyle.boxShadow = 'var(--idp-splitter-shadow-active)';
  } else if (isDragging && lineHoverColor) {
    baseStyle.backgroundColor = lineHoverColor;
    baseStyle.boxShadow = 'var(--idp-splitter-shadow-md)';
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

/**
 * 解析尺寸配置为数组
 * @param size - 尺寸配置（单值或数组）
 * @param count - 面板数量
 * @param defaultValue - 默认值
 */
export const parseSizeConfig = (
  size: number | string | (number | string)[] | undefined,
  count: number,
  defaultValue: number | string = '50%'
): (number | string)[] => {
  if (size === undefined) {
    // 生成默认等分尺寸
    const equalSize = `${100 / count}%`;
    return new Array(count).fill(equalSize);
  }

  if (Array.isArray(size)) {
    // 如果数组长度不够，用最后一个值填充
    const result = [...size];
    while (result.length < count) {
      result.push(result[result.length - 1] ?? defaultValue);
    }
    return result.slice(0, count);
  }

  // 单值，生成相同值的数组
  return new Array(count).fill(size);
};

/**
 * 解析数字配置为数组
 * @param value - 数值配置（单值或数组）
 * @param count - 面板数量
 * @param defaultValue - 默认值
 */
export const parseNumberConfig = (
  value: number | number[] | undefined,
  count: number,
  defaultValue: number
): number[] => {
  if (value === undefined) {
    return new Array(count).fill(defaultValue);
  }

  if (Array.isArray(value)) {
    const result = [...value];
    while (result.length < count) {
      result.push(result[result.length - 1] ?? defaultValue);
    }
    return result.slice(0, count);
  }

  return new Array(count).fill(value);
};

/**
 * 将尺寸值转换为像素
 * @param size - 尺寸值（数字或百分比字符串）
 * @param availableSpace - 可用空间
 */
export const parseSizeToPixels = (
  size: number | string,
  availableSpace: number
): number => {
  if (typeof size === 'number') return size;
  if (typeof size === 'string' && size.endsWith('%')) {
    const percentage = parseFloat(size) / 100;
    return availableSpace * percentage;
  }
  return parseFloat(size) || availableSpace / 2;
};

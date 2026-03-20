'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import './Splitter.css';
import { SplitterProps, DragState, PanelContentProps } from './types';
import {
  getContainerStyle,
  getPanelStyle,
  getSplitterBarStyle,
  getSplitterLineStyle,
  parseWidthFromChild,
} from './styles';

/**
 * 面板内容组件 - 用于快速创建带标题和样式的面板
 */
const PanelContent: React.FC<PanelContentProps> = ({ title, color, children }) => (
  <div style={{
    height: '100%',
    padding: 16,
    background: color || '#f0f2f5',
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
  }}>
    <h4 style={{ margin: '0 0 8px 0', fontSize: 14 }}>{title}</h4>
    {children && <div style={{ fontSize: 12, opacity: 0.8 }}>{children}</div>}
  </div>
);

/**
 * Splitter 主组件 - 简洁版
 * 仅通过 children 内联样式控制面板宽度
 * 未设置宽度的面板自动均分剩余空间
 */
export const Splitter: React.FC<SplitterProps> & {
  PanelContent: React.FC<PanelContentProps>;
} = ({
  layout = 'horizontal',
  splitterSize,
  lineColor,
  lineHoverColor,
  disabled = false,
  onResize,
  onResizeEnd,
  className = '',
  style,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [panelSizes, setPanelSizes] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [activeSplitterIndex, setActiveSplitterIndex] = useState<number>(-1);
  const dragStateRef = useRef<DragState>({
    isDragging: false,
    startPosition: 0,
    startSizes: [],
    containerSize: 0,
    splitterIndex: -1,
  });

  // 处理 children 为数组
  const childArray = useMemo<React.ReactNode[]>(() => {
    if (!children) return [];
    return React.Children.toArray(children);
  }, [children]);

  const panelCount = childArray.length;

  // 获取容器的宽度或高度
  const getContainerSize = useCallback((): number => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    return layout === 'horizontal' ? rect.width : rect.height;
  }, [layout]);

  // 获取分割条大小
  const getSplitterSizeValue = useCallback((): number => {
    if (splitterSize !== undefined) return splitterSize;
    const rootStyle = getComputedStyle(document.documentElement);
    const cssSize = rootStyle.getPropertyValue('--zjpcy-splitter-bar-size').trim();
    return parseInt(cssSize, 10) || 10;
  }, [splitterSize]);

  // 从 children 解析初始宽度配置
  const parseChildrenWidths = useCallback((): (number | string | null)[] => {
    return childArray.map(child => parseWidthFromChild(child, layout));
  }, [childArray, layout]);

  // 计算面板初始尺寸
  const calculateInitialSizes = useCallback((containerSize: number): number[] => {
    const splitterSizeValue = getSplitterSizeValue();
    const totalSplitterSize = splitterSizeValue * (panelCount - 1);
    const availableSpace = Math.max(0, containerSize - totalSplitterSize);

    const widths = parseChildrenWidths();
    const sizes: number[] = new Array(panelCount).fill(0);
    const unsetIndices: number[] = [];
    let usedSpace = 0;

    // 第一遍：处理已设置的宽度
    widths.forEach((width, index) => {
      if (width !== null) {
        const size = parseWidthToPixels(width, availableSpace);
        sizes[index] = size;
        usedSpace += size;
      } else {
        unsetIndices.push(index);
      }
    });

    // 第二遍：为未设置的面板均分剩余空间
    if (unsetIndices.length > 0) {
      const remainingSpace = Math.max(0, availableSpace - usedSpace);
      const equalSize = remainingSpace / unsetIndices.length;
      unsetIndices.forEach(index => {
        sizes[index] = equalSize;
      });
    }

    return sizes;
  }, [panelCount, getSplitterSizeValue, parseChildrenWidths]);

  // 初始化面板尺寸
  useEffect(() => {
    const containerSize = getContainerSize();
    if (containerSize > 0 && panelCount >= 2) {
      const sizes = calculateInitialSizes(containerSize);
      setPanelSizes(sizes);
    }
  }, [panelCount]);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      const containerSize = getContainerSize();
      if (containerSize > 0 && panelSizes.length > 0) {
        const splitterSizeValue = getSplitterSizeValue();
        const totalSplitterSize = splitterSizeValue * (panelCount - 1);
        const availableSpace = Math.max(0, containerSize - totalSplitterSize);

        // 保持当前比例
        const currentTotal = panelSizes.reduce((sum, s) => sum + s, 0);
        if (currentTotal > 0) {
          const ratio = availableSpace / currentTotal;
          setPanelSizes(prev => prev.map(s => s * ratio));
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [panelSizes, panelCount, getContainerSize, getSplitterSizeValue]);

  // 处理拖拽开始
  const handleDragStart = useCallback((index: number) => (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;

    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const startPosition = layout === 'horizontal' ? clientX : clientY;
    const containerSize = getContainerSize();

    dragStateRef.current = {
      isDragging: true,
      startPosition,
      startSizes: [...panelSizes],
      containerSize,
      splitterIndex: index,
    };

    setIsDragging(true);
    setActiveSplitterIndex(index);
  }, [disabled, layout, panelSizes, getContainerSize]);

  // 处理拖拽中
  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragStateRef.current.isDragging || disabled) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const currentPosition = layout === 'horizontal' ? clientX : clientY;

    const delta = currentPosition - dragStateRef.current.startPosition;
    const index = dragStateRef.current.splitterIndex;
    const startSizes = dragStateRef.current.startSizes;

    const leftStartSize = startSizes[index];
    const rightStartSize = startSizes[index + 1];

    // 计算新尺寸
    let newLeftSize = leftStartSize + delta;
    let newRightSize = rightStartSize - delta;

    // 应用最小约束（至少10px）
    const minSize = 10;
    if (newLeftSize < minSize) {
      newLeftSize = minSize;
      newRightSize = leftStartSize + rightStartSize - minSize;
    }
    if (newRightSize < minSize) {
      newRightSize = minSize;
      newLeftSize = leftStartSize + rightStartSize - minSize;
    }

    const newSizes = [...panelSizes];
    newSizes[index] = newLeftSize;
    newSizes[index + 1] = newRightSize;

    setPanelSizes(newSizes);
    onResize?.(newSizes, index);
  }, [disabled, layout, panelSizes, onResize]);

  // 处理拖拽结束
  const handleDragEnd = useCallback(() => {
    if (!dragStateRef.current.isDragging) return;

    dragStateRef.current.isDragging = false;
    setIsDragging(false);
    setActiveSplitterIndex(-1);
    onResizeEnd?.(panelSizes);
  }, [panelSizes, onResizeEnd]);

  // 添加/移除全局事件监听
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleDragMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd);

      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  // 如果没有足够面板，返回空
  if (panelCount < 2) {
    console.warn('Splitter requires at least 2 panels');
    return null;
  }

  const containerClassName = [
    'zjpcy-splitter',
    `zjpcy-splitter-${layout}`,
    isDragging ? 'zjpcy-splitter-dragging' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      className={containerClassName}
      style={getContainerStyle(layout, style)}
    >
      {childArray.map((child, index) => {
        const size = panelSizes[index] || 0;
        const isLast = index === panelCount - 1;

        return (
          <React.Fragment key={index}>
            {/* 面板 */}
            <div
              className="zjpcy-splitter__panel"
              style={getPanelStyle(size, layout, index, panelCount)}
            >
              {child}
            </div>

            {/* 分割条（最后一个面板后面不需要） */}
            {!isLast && (
              <div
                className={[
                  'zjpcy-splitter__bar',
                  activeSplitterIndex === index ? 'zjpcy-splitter__bar-dragging' : '',
                  disabled ? 'zjpcy-splitter__bar-disabled' : '',
                ].filter(Boolean).join(' ')}
                style={getSplitterBarStyle(layout, splitterSize, disabled, index)}
                onMouseDown={handleDragStart(index)}
                onTouchStart={handleDragStart(index)}
              >
                <div
                  className="zjpcy-splitter__line"
                  style={getSplitterLineStyle(
                    layout,
                    lineColor,
                    lineHoverColor,
                    isDragging,
                    activeSplitterIndex === index
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/**
 * 将宽度值转换为像素
 * @param width - 宽度值（数字或百分比字符串）
 * @param availableSpace - 可用空间
 * @returns 像素值
 */
function parseWidthToPixels(width: number | string, availableSpace: number): number {
  if (typeof width === 'number') return width;
  if (typeof width === 'string' && width.endsWith('%')) {
    const percentage = parseFloat(width) / 100;
    return availableSpace * percentage;
  }
  // 处理其他单位（px, rem等）
  const numericValue = parseFloat(width);
  if (!isNaN(numericValue)) {
    if (width.includes('px')) return numericValue;
    if (width.includes('rem')) return numericValue * 16; // 简化为 1rem = 16px
    if (width.includes('em')) return numericValue * 16;
    // 默认视为像素
    return numericValue;
  }
  return availableSpace / 2; // 默认一半
}

// 将 PanelContent 附加为 Splitter 的静态属性
Splitter.PanelContent = PanelContent;

export default Splitter;

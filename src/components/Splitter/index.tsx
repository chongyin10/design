import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import './Splitter.css';
import { SplitterProps, DragState, SplitterPanel } from './types';
import {
  getContainerStyle,
  getPanelStyle,
  getSplitterBarStyle,
  getSplitterLineStyle,
  parseSizeConfig,
  parseNumberConfig,
  parseSizeToPixels,
} from './styles';

/**
 * Splitter 主组件 - 自由切分指定区域为多部分
 * 支持水平和垂直分隔，可拖拽调整各区域大小，支持多面板
 */
export const Splitter: React.FC<SplitterProps> = ({
  layout = 'horizontal',
  panels: panelsProp,
  defaultSize = '50%',
  minSize = 50,
  maxSize = Infinity,
  splitterSize,
  lineColor,
  lineHoverColor,
  disabled = false,
  onResize,
  onResizeEnd,
  className = '',
  style,
  left,
  right,
  top,
  bottom,
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

  // 获取面板内容数组
  const panels = useMemo<React.ReactNode[]>(() => {
    // 优先使用 panels 配置
    if (panelsProp && panelsProp.length > 0) {
      return panelsProp.map(p => p.content);
    }

    // 兼容旧版 API
    if (layout === 'vertical') {
      if (top && bottom) return [top, bottom];
    } else {
      if (left && right) return [left, right];
    }

    // 使用 children
    if (children && Array.isArray(children)) {
      return children;
    }

    return [];
  }, [panelsProp, layout, left, right, top, bottom, children]);

  const panelCount = panels.length;

  // 获取面板配置（如果有）
  const getPanelConfig = useCallback((index: number): Partial<SplitterPanel> => {
    if (panelsProp && panelsProp[index]) {
      return panelsProp[index];
    }
    return {};
  }, [panelsProp]);

  // 计算容器尺寸
  const getContainerSize = useCallback((): number => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    return layout === 'horizontal' ? rect.width : rect.height;
  }, [layout]);

  // 获取分割条大小
  const getSplitterSizeValue = useCallback((): number => {
    if (splitterSize !== undefined) return splitterSize;
    const rootStyle = getComputedStyle(document.documentElement);
    const cssSize = rootStyle.getPropertyValue('--idp-splitter-bar-size').trim();
    return parseInt(cssSize, 10) || 10;
  }, [splitterSize]);

  // 初始化面板尺寸
  useEffect(() => {
    const containerSize = getContainerSize();
    if (containerSize > 0 && panelCount > 0) {
      const splitterSizeValue = getSplitterSizeValue();
      const totalSplitterSize = splitterSizeValue * (panelCount - 1);
      const availableSpace = Math.max(0, containerSize - totalSplitterSize);

      // 解析配置
      const defaultSizes = parseSizeConfig(defaultSize, panelCount, `${100 / panelCount}%`);
      const minSizes = parseNumberConfig(minSize, panelCount, 50);
      const maxSizes = parseNumberConfig(maxSize, panelCount, Infinity);

      // 获取面板特定的配置
      const panelDefaultSizes = panelsProp
        ? panelsProp.map((p) => p.defaultSize ?? defaultSizes[panelsProp.indexOf(p)])
        : defaultSizes;
      const panelMinSizes = panelsProp
        ? panelsProp.map((p) => p.minSize ?? minSizes[panelsProp.indexOf(p)])
        : minSizes;
      const panelMaxSizes = panelsProp
        ? panelsProp.map((p) => p.maxSize ?? maxSizes[panelsProp.indexOf(p)])
        : maxSizes;

      // 计算初始尺寸
      let initialSizes = panelDefaultSizes.map((size) =>
        parseSizeToPixels(size, availableSpace)
      );

      // 应用约束并处理百分比情况
      const totalSize = initialSizes.reduce((sum, s) => sum + s, 0);
      if (totalSize !== availableSpace && availableSpace > 0) {
        // 按比例调整
        const ratio = availableSpace / totalSize;
        initialSizes = initialSizes.map(s => s * ratio);
      }

      // 应用最小/最大约束
      initialSizes = initialSizes.map((size, index) =>
        Math.max(panelMinSizes[index], Math.min(panelMaxSizes[index], size))
      );

      setPanelSizes(initialSizes);
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

    // 检查该分割条是否被禁用
    const leftPanelConfig = getPanelConfig(index);
    const rightPanelConfig = getPanelConfig(index + 1);
    if (leftPanelConfig.disabled || rightPanelConfig.disabled) return;

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
  }, [disabled, layout, panelSizes, getContainerSize, getPanelConfig]);

  // 处理拖拽中
  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragStateRef.current.isDragging || disabled) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const currentPosition = layout === 'horizontal' ? clientX : clientY;

    const delta = currentPosition - dragStateRef.current.startPosition;
    const index = dragStateRef.current.splitterIndex;
    const startSizes = dragStateRef.current.startSizes;

    // 获取左右面板的最小/最大约束
    const minSizes = parseNumberConfig(minSize, panelCount, 50);
    const maxSizes = parseNumberConfig(maxSize, panelCount, Infinity);

    // 应用面板特定的约束
    const panelMinSizes = panelsProp
      ? panelsProp.map((p, i) => p.minSize ?? minSizes[i])
      : minSizes;
    const panelMaxSizes = panelsProp
      ? panelsProp.map((p, i) => p.maxSize ?? maxSizes[i])
      : maxSizes;

    const leftMin = panelMinSizes[index];
    const leftMax = panelMaxSizes[index];
    const rightMin = panelMinSizes[index + 1];
    const rightMax = panelMaxSizes[index + 1];

    const leftStartSize = startSizes[index];
    const rightStartSize = startSizes[index + 1];

    // 计算新尺寸
    let newLeftSize = leftStartSize + delta;
    let newRightSize = rightStartSize - delta;

    // 应用约束
    if (newLeftSize < leftMin) {
      newLeftSize = leftMin;
      newRightSize = leftStartSize + rightStartSize - leftMin;
    } else if (newLeftSize > leftMax) {
      newLeftSize = leftMax;
      newRightSize = leftStartSize + rightStartSize - leftMax;
    }

    if (newRightSize < rightMin) {
      newRightSize = rightMin;
      newLeftSize = leftStartSize + rightStartSize - rightMin;
    } else if (newRightSize > rightMax) {
      newRightSize = rightMax;
      newLeftSize = leftStartSize + rightStartSize - rightMax;
    }

    const newSizes = [...panelSizes];
    newSizes[index] = newLeftSize;
    newSizes[index + 1] = newRightSize;

    setPanelSizes(newSizes);
    onResize?.(newSizes, index);
  }, [disabled, layout, panelSizes, panelCount, minSize, maxSize, panelsProp, onResize]);

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

  // 如果没有面板，返回空
  if (panelCount < 2) {
    console.warn('Splitter requires at least 2 panels');
    return null;
  }

  const containerClassName = [
    'idp-splitter',
    `idp-splitter--${layout}`,
    isDragging ? 'idp-splitter--dragging' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      className={containerClassName}
      style={getContainerStyle(layout, style)}
    >
      {panels.map((panel, index) => {
        const size = panelSizes[index] || 0;
        const isLast = index === panelCount - 1;

        return (
          <React.Fragment key={index}>
            {/* 面板 */}
            <div
              className="idp-splitter__panel"
              style={getPanelStyle(size, layout, index, panelCount)}
            >
              {panel}
            </div>

            {/* 分割条（最后一个面板后面不需要） */}
            {!isLast && (
              <div
                className={[
                  'idp-splitter__bar',
                  activeSplitterIndex === index ? 'idp-splitter__bar--dragging' : '',
                  disabled || getPanelConfig(index).disabled || getPanelConfig(index + 1).disabled
                    ? 'idp-splitter__bar--disabled'
                    : '',
                ].filter(Boolean).join(' ')}
                style={getSplitterBarStyle(layout, splitterSize, disabled, index)}
                onMouseDown={handleDragStart(index)}
                onTouchStart={handleDragStart(index)}
              >
                <div
                  className="idp-splitter__line"
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

export default Splitter;

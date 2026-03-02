import React, { useState, useRef, useCallback, useEffect } from 'react';
import './Splitter.css';
import { SplitterProps, DragState } from './types';
import { getContainerStyle, getPanelStyle, getSplitterBarStyle, getSplitterLineStyle } from './styles';

/**
 * Splitter 主组件 - 自由切分指定区域为两部分
 * 支持水平和垂直分隔，可拖拽调整各区域大小
 */
export const Splitter: React.FC<SplitterProps> = ({
  layout = 'horizontal',
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
  const [panelSize, setPanelSize] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStateRef = useRef<DragState>({
    isDragging: false,
    startPosition: 0,
    startSize: 0,
    containerSize: 0,
  });

  // 获取两个面板的内容
  const firstPanel = layout === 'vertical' ? top ?? children?.[0] : left ?? children?.[0];
  const secondPanel = layout === 'vertical' ? bottom ?? children?.[1] : right ?? children?.[1];

  // 计算容器尺寸
  const getContainerSize = useCallback((): number => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    return layout === 'horizontal' ? rect.width : rect.height;
  }, [layout]);

  // 获取分割条大小
  const getSplitterSize = useCallback((): number => {
    if (splitterSize !== undefined) return splitterSize;
    // 从 CSS 变量获取默认值
    const rootStyle = getComputedStyle(document.documentElement);
    const cssSize = rootStyle.getPropertyValue('--idp-splitter-bar-size').trim();
    return parseInt(cssSize, 10) || 8;
  }, [splitterSize]);

  // 将尺寸值转换为像素
  const parseSizeToPixels = useCallback((size: number | string, availableSpace: number): number => {
    if (typeof size === 'number') return size;
    if (typeof size === 'string' && size.endsWith('%')) {
      const percentage = parseFloat(size) / 100;
      return availableSpace * percentage;
    }
    return parseFloat(size) || availableSpace / 2;
  }, []);

  // 初始化面板尺寸
  useEffect(() => {
    const containerSize = getContainerSize();
    if (containerSize > 0) {
      const splitterSizeValue = getSplitterSize();
      const initialSize = parseSizeToPixels(defaultSize, containerSize - splitterSizeValue);
      const clampedSize = Math.max(minSize, Math.min(maxSize, initialSize));
      setPanelSize(clampedSize);
    }
  }, []);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      const containerSize = getContainerSize();
      if (containerSize > 0) {
        const splitterSizeValue = getSplitterSize();
        const maxAvailable = Math.max(0, containerSize - splitterSizeValue);
        setPanelSize(prev => Math.min(prev, maxAvailable));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getContainerSize, getSplitterSize]);

  // 处理拖拽开始
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;

    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const startPosition = layout === 'horizontal' ? clientX : clientY;
    const containerSize = getContainerSize();

    dragStateRef.current = {
      isDragging: true,
      startPosition,
      startSize: panelSize,
      containerSize,
    };

    setIsDragging(true);
  }, [disabled, layout, panelSize, getContainerSize]);

  // 处理拖拽中
  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragStateRef.current.isDragging || disabled) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const currentPosition = layout === 'horizontal' ? clientX : clientY;

    const delta = currentPosition - dragStateRef.current.startPosition;
    const containerSize = dragStateRef.current.containerSize;
    const splitterSizeValue = getSplitterSize();
    const maxAvailable = Math.max(0, containerSize - splitterSizeValue);

    let newSize = dragStateRef.current.startSize + delta;

    // 应用约束
    newSize = Math.max(minSize, Math.min(maxSize, newSize));
    newSize = Math.max(0, Math.min(maxAvailable, newSize));

    setPanelSize(newSize);
    onResize?.(newSize);
  }, [disabled, layout, minSize, maxSize, getSplitterSize, onResize]);

  // 处理拖拽结束
  const handleDragEnd = useCallback(() => {
    if (!dragStateRef.current.isDragging) return;

    dragStateRef.current.isDragging = false;
    setIsDragging(false);
    onResizeEnd?.(panelSize);
  }, [panelSize, onResizeEnd]);

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

  // 计算第二个面板的尺寸
  const secondPanelSize = Math.max(0, getContainerSize() - getSplitterSize() - panelSize);

  const containerClassName = [
    'idp-splitter',
    `idp-splitter--${layout}`,
    isDragging ? 'idp-splitter--dragging' : '',
    className,
  ].filter(Boolean).join(' ');

  const barClassName = [
    'idp-splitter__bar',
    isDragging ? 'idp-splitter__bar--dragging' : '',
    disabled ? 'idp-splitter__bar--disabled' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      className={containerClassName}
      style={getContainerStyle(layout, style)}
    >
      {/* 第一个面板 */}
      <div
        className="idp-splitter__panel"
        style={getPanelStyle(panelSize, layout, true)}
      >
        {firstPanel}
      </div>

      {/* 分割条 */}
      <div
        className={barClassName}
        style={getSplitterBarStyle(layout, splitterSize, disabled)}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div
          className="idp-splitter__line"
          style={getSplitterLineStyle(layout, lineColor, lineHoverColor, isDragging)}
        />
      </div>

      {/* 第二个面板 */}
      <div
        className="idp-splitter__panel"
        style={getPanelStyle(secondPanelSize, layout, false)}
      >
        {secondPanel}
      </div>
    </div>
  );
};

export default Splitter;

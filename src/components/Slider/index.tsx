import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './Slider.css';
import { SliderProps } from './types';

export const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = 0,
  disabled = false,
  marks = {},
  showValue = false,
  trackColor = '#1890ff',
  handleColor = '#1890ff',
  gradient,
  onChange,
  onAfterChange,
  className = '',
  style
}) => {
  const [internalValue, setInternalValue] = useState<number>(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastValueRef = useRef<number>(value !== undefined ? value : defaultValue);
  const isControlled = value !== undefined;

  const currentValue = isControlled ? value : internalValue;

  // 同步 ref
  useEffect(() => {
    lastValueRef.current = currentValue;
  }, [currentValue]);

  const getPositionFromValue = useCallback((val: number) => {
    const ratio = (val - min) / (max - min);
    return Math.max(0, Math.min(1, ratio));
  }, [min, max]);

  const getValueFromPosition = useCallback((position: number) => {
    const ratio = Math.max(0, Math.min(1, position));
    const rawValue = min + ratio * (max - min);
    
    if (step > 0) {
      const steppedValue = Math.round(rawValue / step) * step;
      return Math.min(max, Math.max(min, steppedValue));
    }
    
    return Math.min(max, Math.max(min, rawValue));
  }, [min, max, step]);

  const getClientX = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      return e.touches[0].clientX;
    }
    return (e as MouseEvent).clientX;
  };

  // 优化：使用 RAF 限制更新频率，避免重复渲染
  const updateValueFromPosition = useCallback((clientX: number) => {
    if (!trackRef.current || disabled) return;

    // 取消之前的 RAF
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const rect = trackRef.current!.getBoundingClientRect();
      const position = (clientX - rect.left) / rect.width;
      const newValue = getValueFromPosition(position);
      
      // 只有当值真正变化时才更新
      if (newValue !== lastValueRef.current) {
        lastValueRef.current = newValue;
        
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(newValue);
      }
    });
  }, [disabled, isControlled, getValueFromPosition, onChange]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    setIsDragging(true);
    
    const clientX = getClientX(e as any);
    updateValueFromPosition(clientX);
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    const target = e.target as HTMLElement;
    if (target.classList.contains('slider-handle')) {
      return;
    }
    
    updateValueFromPosition(e.clientX);
    onAfterChange?.(currentValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    let newValue = currentValue;
    
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(min, currentValue - step);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(max, currentValue + step);
        break;
      case 'Home':
        newValue = min;
        break;
      case 'End':
        newValue = max;
        break;
      case 'PageDown':
        newValue = Math.max(min, currentValue - step * 10);
        break;
      case 'PageUp':
        newValue = Math.min(max, currentValue + step * 10);
        break;
      default:
        return;
    }
    
    e.preventDefault();
    
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
    onAfterChange?.(newValue);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const clientX = getClientX(e);
      updateValueFromPosition(clientX);
    };

    const handleEnd = () => {
      setIsDragging(false);
      // 清理 RAF
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      onAfterChange?.(lastValueRef.current);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
      // 清理 RAF
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isDragging, updateValueFromPosition, onAfterChange]);

  const position = getPositionFromValue(currentValue);

  // 缓存 marks 数组，避免每次渲染重新计算
  const markEntries = useMemo(() => {
    return Object.entries(marks)
      .map(([key, value]) => {
        const markValue = Number(key);
        const markConfig = typeof value === 'string'
          ? { trackColor: undefined, handleColor: undefined, mark: value }
          : value;
        
        return {
          value: markValue,
          label: markConfig.mark,
          trackColor: markConfig.trackColor,
          handleColor: markConfig.handleColor,
          position: getPositionFromValue(markValue)
        };
      })
      .sort((a, b) => a.value - b.value);
  }, [marks, getPositionFromValue]);

  // 获取当前值对应的分段配置
  const currentSegment = useMemo(() => {
    for (let i = 0; i < markEntries.length; i++) {
      const mark = markEntries[i];
      if (currentValue <= mark.value) {
        return {
          trackColor: mark.trackColor,
          handleColor: mark.handleColor,
          mark: mark.label
        };
      }
    }
    
    // 如果值大于所有标记点，使用最后一个标记点的配置
    const lastMark = markEntries[markEntries.length - 1];
    if (lastMark) {
      return {
        trackColor: lastMark.trackColor,
        handleColor: lastMark.handleColor,
        mark: lastMark.label
      };
    }
    
    return { trackColor: undefined, handleColor: undefined, mark: '' };
  }, [markEntries, currentValue]);
  
  // 获取 style 中的 CSS 变量值（如果存在）
  const styleTrackColor = style && (style as any)['--idp-slider-track-filled-bg'];
  const styleHandleColor = style && (style as any)['--idp-slider-handle-border'];
  
  // 判断是否可以使用 gradient
  const canUseGradient = gradient &&
    !currentSegment.trackColor &&
    !styleTrackColor &&
    trackColor === '#1890ff';
  
  // 优先级：marks > style > SliderProps > gradient > 默认
  const effectiveTrackColor = currentSegment.trackColor || styleTrackColor || trackColor;
  const effectiveHandleColor = currentSegment.handleColor || styleHandleColor || handleColor;

  return (
    <div
      className={`slider-container ${disabled ? 'disabled' : ''} ${isDragging ? 'dragging' : ''} ${className}`}
      style={{
        ['--idp-slider-track-filled-bg' as any]: effectiveTrackColor,
        ['--idp-slider-handle-border' as any]: `2px solid ${effectiveHandleColor}`,
        ...style
      }}
    >
      <div
        ref={trackRef}
        className="slider-track"
        onClick={handleTrackClick}
        role="presentation"
      >
        <div
          className="slider-track-filled"
          style={{
            width: `${position * 100}%`,
            ...(canUseGradient && gradient ? {
              background: `linear-gradient(to right, ${gradient.startColor}, ${gradient.endColor})`
            } : {})
          }}
        />
        <div
          className="slider-handle"
          style={{ left: `${position * 100}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          onKeyDown={handleKeyDown}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
        >
          <div className="slider-tooltip">
            {currentValue}
          </div>
        </div>
      </div>
      
      {markEntries.length > 0 && (
        <div className="slider-marks">
          {markEntries.map((mark) => (
            <div
              key={mark.value}
              className="slider-mark"
              style={{ 
                left: `${mark.position * 100}%`,
                color: mark.trackColor || undefined
              }}
            >
              {mark.label}
            </div>
          ))}
        </div>
      )}
      
      {showValue && (
        <div className="slider-value-display">
          当前值：{currentValue}
        </div>
      )}
    </div>
  );
};

export default Slider;
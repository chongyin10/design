'use client';

import React, { useState, useRef, useMemo, useCallback, useEffect, useLayoutEffect } from 'react';
import classNames from 'classnames';
import './Rate.css';
import { RateProps } from './types';
import Icon from '../Icon/Icon';

export const Rate: React.FC<RateProps> = ({
  value = 0,
  count = 5,
  allowHalf = true,
  disabled = false,
  color = '#1677ff',
  onChange,
  className = '',
  size = 24,
  chats
}) => {
  const [hoverValue, setHoverValue] = useState<number>(0);
  const starElementsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const lastHoverValueRef = useRef<number>(0);
  const isChatsMode = Array.isArray(chats) && chats.length >= count && chats.every(c => c != null && c !== '');
  
  // chats 模式下的选中状态
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [isHovering, setIsHovering] = useState(false);

  // 初始化ref数组
  if (starElementsRef.current.length !== count) {
    starElementsRef.current = Array(count).fill(null);
  }

  // 初始化选中状态
  useEffect(() => {
    if (isChatsMode) {
      // chats模式下，value是字符拼接的字符串（如'123'），直接使用其长度作为选中数量
      if (typeof value === 'string' && value.length > 0) {
        const selectedCount = Math.min(value.length, count);
        setSelectedChats(chats.slice(0, selectedCount));
      } else {
        setSelectedChats([]);
      }
    } else {
      setSelectedChats([]);
    }
  }, [value, isChatsMode, chats, count]);

  // 使用 useLayoutEffect 确保点击后状态立即同步
  useLayoutEffect(() => {
    // 如果 hoverValue 为 0，确保 isHovering 也为 false，避免状态不一致
    if (hoverValue === 0 && isHovering) {
      setIsHovering(false);
    }
  }, [hoverValue, isHovering]);

  // 直接计算当前显示的值，不要额外的state，避免更新延迟
  const currentValue: number = hoverValue || (isChatsMode ? selectedChats.length : parseFloat(Number(value).toFixed(1) || '0'));

  const handleRef = useCallback((index: number) => (el: HTMLSpanElement | null) => {
    starElementsRef.current[index] = el;
  }, []);

  // 使用useMemo缓存计算结果，避免重复计算
  const starStates = useMemo(() => {
    return Array.from({ length: count }).map((_, index) => {
      const starValue = index + 1;
      
      // 计算当前星星的状态
      let isFull = false;
      let isHalf = false;

      if (isChatsMode) {
        // chats模式下，根据hoverValue或selectedChats长度判断
        // hover时，显示hover及之前的星星；否则显示已选中的星星
        const displayCount = isHovering && hoverValue > 0 ? hoverValue : selectedChats.length;
        isFull = index < displayCount;
      } else {
        // 普通模式下正常计算
        if (currentValue >= starValue) {
          // 如果当前值大于等于星星的值，显示全星
          isFull = true;
        } else if (allowHalf && currentValue > index && currentValue < starValue) {
          // 如果在星星范围内且允许半星，显示半星
          isHalf = true;
        }
      }
      
      return {
        index,
        isHalf,
        isFull,
        iconType: isHalf ? 'half' : (isFull ? 'full' : 'empty'),
        iconColor: isFull || isHalf ? color : '#d9d9d9'
      };
    });
  }, [count, currentValue, allowHalf, color, isChatsMode, selectedChats.length, isHovering, hoverValue]);

  // 渲染星星图标或 chats 模式
  const renderStar = (star: any) => {
    // chats 模式：优先级最高，隐藏默认图标，只支持整星
    if (isChatsMode) {
      const chatText = chats[star.index];
      const isFull = star.isFull; // 使用计算好的isFull状态

      return (
        <span
          className="rate-chat-item"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            fontSize: 'inherit',
            backgroundColor: 'transparent',
            color: disabled ? 'inherit' : (isFull ? color : 'inherit'),
            cursor: disabled ? 'default' : 'pointer'
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.stopPropagation();
              const newValue = star.index + 1;
              if (newValue !== lastHoverValueRef.current) {
                lastHoverValueRef.current = newValue;
                setHoverValue(newValue);
              }
            }
          }}
          onClick={(e) => {
            if (!disabled) {
              e.stopPropagation();
              const newValue = star.index + 1;
              // 返回选中的字符拼接成的字符串
              if (chats && Array.isArray(chats) && chats.length >= 0) {
                const newSelectedChats = chats.slice(0, newValue);
                setSelectedChats(newSelectedChats);
                // 先更新内部状态，再触发 onChange，避免外部更新 value 导致的时序问题
                onChange?.(newSelectedChats.join(''));
              } else {
                onChange?.(newValue.toString());
              }
              // 点击后重置 hover 状态，包括 isHovering
              setHoverValue(0);
              lastHoverValueRef.current = 0;
              setIsHovering(false);
            }
          }}
        >
          {chatText}
        </span>
      );
    }

    // 默认星星模式
    return (
      <>
        {/* 背景空心图标 */}
        <Icon 
          type="starOutline" 
          size={size} 
          color="#d9d9d9"
          className="rate-star-bg"
        />
        
        {/* 左半区域 - 控制半星 */}
        <span
          className="rate-star-left"
          onMouseEnter={(e) => {
            if (!disabled && allowHalf) {
              e.stopPropagation();
              const newValue = star.index + 0.5;
              if (newValue !== lastHoverValueRef.current) {
                lastHoverValueRef.current = newValue;
                setHoverValue(newValue);
              }
            }
          }}
          onClick={(e) => {
            if (!disabled && allowHalf) {
              e.stopPropagation();
              onChange?.((star.index + 0.5).toString());
              // 点击后重置 hover 状态，包括 isHovering
              setHoverValue(0);
              lastHoverValueRef.current = 0;
              setIsHovering(false);
            }
          }}

        />
        
        {/* 右半区域 - 控制全星 */}
        <span
          className="rate-star-right"
          onMouseEnter={(e) => {
            if (!disabled) {
              e.stopPropagation();
              const newValue = star.index + 1;
              if (newValue !== lastHoverValueRef.current) {
                lastHoverValueRef.current = newValue;
                setHoverValue(newValue);
              }
            }
          }}
          onClick={(e) => {
            if (!disabled) {
              e.stopPropagation();
              if (isChatsMode) {
                const newSelectedChats = chats.slice(0, star.index + 1);
                onChange?.(newSelectedChats.join(''));
              } else {
                onChange?.((star.index + 1).toString());
              }
              // 点击后重置 hover 状态，包括 isHovering
              setHoverValue(0);
              lastHoverValueRef.current = 0;
              setIsHovering(false);
            }
          }}
        />
        
        {/* 前景实心图标，通过CSS控制显示区域 */}
        <span
          className={classNames('rate-star-fill', {
            'rate-star-fill-half': star.isHalf,
            'rate-star-fill-full': star.isFull,
            'rate-star-fill-empty': !star.isHalf && !star.isFull
          })}
          style={{ color: star.iconColor }}
        >
          <Icon 
            type="star" 
            size={size} 
            color={star.iconColor}
            className="rate-star-icon"
          />
        </span>
      </>
    );
  };

  return (
    <div
      className={classNames('rate', {
        'rate-disabled': disabled,
        'rate-chats-mode': isChatsMode,
        'rate-chats-mode-disabled': isChatsMode && disabled,
        'rate-star-mode': !isChatsMode
      }, className)}
      style={{
        '--rate-color': color,
      } as React.CSSProperties}
      onMouseEnter={() => {
        if (!disabled) {
          setIsHovering(true);
        }
      }}
      onMouseLeave={() => {
        if (!disabled) {
          setIsHovering(false);
          setHoverValue(0);
          lastHoverValueRef.current = 0;
        }
      }}
    >
      {starStates.map((star) => (
        <span
          key={star.index}
          ref={handleRef(star.index)}
          className="rate-star"
          style={{ fontSize: `${size}px` }}
        >
          {renderStar(star)}
        </span>
      ))}
    </div>
  );
};

export default Rate;
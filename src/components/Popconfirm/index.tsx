'use client';

import React, { useState, useRef, useEffect, cloneElement, ReactElement } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import Button from '../Button';
import Icon from '../Icon';
import { PopconfirmProps, PopconfirmPlacement } from './types';
import './Popconfirm.css';

const Popconfirm: React.FC<PopconfirmProps> = ({
  title = '确认删除吗？',
  description,
  okText = '确定',
  cancelText = '取消',
  okButtonProps = {},
  cancelButtonProps = {},
  onConfirm,
  onCancel,
  disabled = false,
  icon,
  type = 'warning',
  placement = 'top',
  showCancel = true,
  getContainer,
  className,
  style,
  children
}) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({ top: -9999, left: -9999 }); // 初始位置在视口外
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({}); // 箭头动态位置
  const [positionReady, setPositionReady] = useState(false); // 位置是否计算完成
  const [exiting, setExiting] = useState(false); // 退出动画状态
  const [actualPlacement, setActualPlacement] = useState<PopconfirmPlacement>(placement);
  const triggerRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPositionRef = useRef<{ top: number; left: number; arrowStyle: React.CSSProperties } | null>(null);
  // 缓存 popover 的稳定尺寸，滚动时使用缓存值避免 getBoundingClientRect 抖动
  const cachedPopoverSizeRef = useRef<{ width: number; height: number } | null>(null);

  // 位置翻转映射表
  const reversePlacementMap: Record<PopconfirmPlacement, PopconfirmPlacement> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
    topLeft: 'bottomLeft',
    topRight: 'bottomRight',
    bottomLeft: 'topLeft',
    bottomRight: 'topRight',
    leftTop: 'rightTop',
    leftBottom: 'rightBottom',
    rightTop: 'leftTop',
    rightBottom: 'leftBottom'
  };

  const placementMap: Record<PopconfirmPlacement, string> = {
    top: 'zjpcy-popconfirm-top',
    bottom: 'zjpcy-popconfirm-bottom',
    left: 'zjpcy-popconfirm-left',
    right: 'zjpcy-popconfirm-right',
    topLeft: 'zjpcy-popconfirm-topLeft',
    topRight: 'zjpcy-popconfirm-topRight',
    bottomLeft: 'zjpcy-popconfirm-bottomLeft',
    bottomRight: 'zjpcy-popconfirm-bottomRight',
    leftTop: 'zjpcy-popconfirm-leftTop',
    leftBottom: 'zjpcy-popconfirm-leftBottom',
    rightTop: 'zjpcy-popconfirm-rightTop',
    rightBottom: 'zjpcy-popconfirm-rightBottom'
  };

  const calculatePosition = (isScroll = false) => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const padding = 8;
    const viewportPadding = 10;

    // 获取 popover 尺寸：优先用缓存，滚动时必须用缓存
    let popoverWidth: number;
    let popoverHeight: number;

    if (isScroll && cachedPopoverSizeRef.current) {
      popoverWidth = cachedPopoverSizeRef.current.width;
      popoverHeight = cachedPopoverSizeRef.current.height;
    } else {
      const popoverRect = popoverRef.current.getBoundingClientRect();
      popoverWidth = popoverRect.width;
      popoverHeight = popoverRect.height;
      // 仅在非滚动时更新缓存
      if (popoverWidth > 0 && popoverHeight > 0) {
        cachedPopoverSizeRef.current = { width: popoverWidth, height: popoverHeight };
      }
    }

    if (popoverWidth <= 0 || popoverHeight <= 0) return;

    // 检测是否有足够空间，决定是否需要翻转
    let currentPlacement = placement;
    const spaceTop = triggerRect.top;
    const spaceBottom = window.innerHeight - triggerRect.bottom;
    const spaceLeft = triggerRect.left;
    const spaceRight = window.innerWidth - triggerRect.right;

    const needsFlip = (): boolean => {
      switch (placement) {
        case 'top':
        case 'topLeft':
        case 'topRight':
          return spaceTop < popoverHeight + padding + viewportPadding;
        case 'bottom':
        case 'bottomLeft':
        case 'bottomRight':
          return spaceBottom < popoverHeight + padding + viewportPadding;
        case 'left':
        case 'leftTop':
        case 'leftBottom':
          return spaceLeft < popoverWidth + padding + viewportPadding;
        case 'right':
        case 'rightTop':
        case 'rightBottom':
          return spaceRight < popoverWidth + padding + viewportPadding;
        default:
          return false;
      }
    };

    if (needsFlip()) {
      const flippedPlacement = reversePlacementMap[placement];
      const hasSpaceAfterFlip = (): boolean => {
        switch (flippedPlacement) {
          case 'bottom':
          case 'bottomLeft':
          case 'bottomRight':
            return spaceBottom >= popoverHeight + padding + viewportPadding;
          case 'top':
          case 'topLeft':
          case 'topRight':
            return spaceTop >= popoverHeight + padding + viewportPadding;
          case 'right':
          case 'rightTop':
          case 'rightBottom':
            return spaceRight >= popoverWidth + padding + viewportPadding;
          case 'left':
          case 'leftTop':
          case 'leftBottom':
            return spaceLeft >= popoverWidth + padding + viewportPadding;
          default:
            return true;
        }
      };
      if (hasSpaceAfterFlip()) {
        currentPlacement = flippedPlacement;
      }
    }

    setActualPlacement(currentPlacement);

    let top = 0;
    let left = 0;

    switch (currentPlacement) {
      case 'top':
      case 'topLeft':
      case 'topRight':
        top = triggerRect.top - popoverHeight - padding;
        left = triggerRect.left + (triggerRect.width - popoverWidth) / 2;
        if (currentPlacement === 'topLeft') {
          left = triggerRect.left;
        } else if (currentPlacement === 'topRight') {
          left = triggerRect.right - popoverWidth;
        }
        break;
      case 'bottom':
      case 'bottomLeft':
      case 'bottomRight':
        top = triggerRect.bottom + padding;
        left = triggerRect.left + (triggerRect.width - popoverWidth) / 2;
        if (currentPlacement === 'bottomLeft') {
          left = triggerRect.left;
        } else if (currentPlacement === 'bottomRight') {
          left = triggerRect.right - popoverWidth;
        }
        break;
      case 'left':
      case 'leftTop':
      case 'leftBottom':
        top = triggerRect.top + (triggerRect.height - popoverHeight) / 2;
        left = triggerRect.left - popoverWidth - padding;
        if (currentPlacement === 'leftTop') {
          top = triggerRect.top;
        } else if (currentPlacement === 'leftBottom') {
          top = triggerRect.bottom - popoverHeight;
        }
        break;
      case 'right':
      case 'rightTop':
      case 'rightBottom':
        top = triggerRect.top + (triggerRect.height - popoverHeight) / 2;
        left = triggerRect.right + padding;
        if (currentPlacement === 'rightTop') {
          top = triggerRect.top;
        } else if (currentPlacement === 'rightBottom') {
          top = triggerRect.bottom - popoverHeight;
        }
        break;
    }

    // 边界检测
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (left < viewportPadding) left = viewportPadding;
    if (left + popoverWidth > windowWidth - viewportPadding) {
      left = windowWidth - popoverWidth - viewportPadding;
    }
    if (top < viewportPadding) top = viewportPadding;
    if (top + popoverHeight > windowHeight - viewportPadding) {
      top = windowHeight - popoverHeight - viewportPadding;
    }

    // 计算箭头位置：让箭头始终指向触发器中心
    const arrowOffset = 5;
    let newArrowStyle: React.CSSProperties = {};

    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    const triggerCenterY = triggerRect.top + triggerRect.height / 2;

    const arrowLeft = triggerCenterX - left - arrowOffset;
    const arrowTop = triggerCenterY - top - arrowOffset;

    const isVertical = ['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight'].includes(currentPlacement);
    const isHorizontal = ['left', 'leftTop', 'leftBottom', 'right', 'rightTop', 'rightBottom'].includes(currentPlacement);

    if (isVertical) {
      newArrowStyle = {
        left: `${Math.max(arrowOffset, Math.min(arrowLeft, popoverWidth - arrowOffset))}px`
      };
      if (['top', 'topLeft', 'topRight'].includes(currentPlacement)) {
        newArrowStyle.bottom = `${-arrowOffset}px`;
      } else {
        newArrowStyle.top = `${-arrowOffset}px`;
      }
    } else if (isHorizontal) {
      newArrowStyle = {
        top: `${Math.max(arrowOffset, Math.min(arrowTop, popoverHeight - arrowOffset))}px`
      };
      if (['left', 'leftTop', 'leftBottom'].includes(currentPlacement)) {
        newArrowStyle.right = `${-arrowOffset}px`;
      } else {
        newArrowStyle.left = `${-arrowOffset}px`;
      }
    }

    const pos = { top, left };
    const isSame = lastPositionRef.current &&
      lastPositionRef.current.top === top &&
      lastPositionRef.current.left === left &&
      JSON.stringify(lastPositionRef.current.arrowStyle) === JSON.stringify(newArrowStyle);

    if (!isSame) {
      lastPositionRef.current = { top, left, arrowStyle: newArrowStyle };
      setPosition(pos);
      setArrowStyle(newArrowStyle);
    }
    setPositionReady(true);
  };

  const handleClick = (e: React.MouseEvent | any) => {
    if (disabled) return;
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    setVisible(true);
  };

  const handleConfirm = async () => {
    if (onConfirm) {
      setLoading(true);
      try {
        await onConfirm();
        closePopover();
      } finally {
        setLoading(false);
      }
    } else {
      closePopover();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    closePopover();
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      popoverRef.current &&
      !popoverRef.current.contains(e.target as Node) &&
      triggerRef.current &&
      !triggerRef.current.contains(e.target as Node)
    ) {
      closePopover();
    }
  };

  // 关闭弹出层（带退出动画）
  const closePopover = () => {
    // 清理之前的定时器
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
    }

    setExiting(true);
    // 动画持续时间（与CSS中的transition-duration保持一致）
    const animationDuration = 200;

    exitTimerRef.current = setTimeout(() => {
      setVisible(false);
      setExiting(false);
      setPositionReady(false);
      setPosition({ top: -9999, left: -9999 });
      setArrowStyle({});
      lastPositionRef.current = null;
      cachedPopoverSizeRef.current = null;
      exitTimerRef.current = null;
    }, animationDuration);
  };

  // 检测触发器是否在可视区域内
  const checkTriggerVisibility = () => {
    if (!triggerRef.current || !visible) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 检测触发器是否有部分离开可视区域（更严格的检测）
    const isPartiallyHidden =
      triggerRect.bottom < 0 ||
      triggerRect.top > viewportHeight ||
      triggerRect.right < 0 ||
      triggerRect.left > viewportWidth;

    if (isPartiallyHidden) {
      closePopover();
    }
  };

  useEffect(() => {
    if (visible) {
      // 使用双帧 rAF 确保 DOM 布局完成后再计算位置
      const rafId = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          calculatePosition();
        });
      });
      document.addEventListener('mousedown', handleClickOutside);

      // 监听滚动和窗口变化事件，重新计算位置并检测可见性
      let scrollRafId: number | null = null;
      const handleScroll = () => {
        if (scrollRafId) return;
        scrollRafId = requestAnimationFrame(() => {
          scrollRafId = null;
          calculatePosition(true);
          checkTriggerVisibility();
        });
      };
      const handleResize = () => calculatePosition(false);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(rafId);
        if (scrollRafId) cancelAnimationFrame(scrollRafId);
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [visible, placement]);

  // 当 placement 改变时重置 actualPlacement
  useEffect(() => {
    setActualPlacement(placement);
  }, [placement]);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
      }
    };
  }, []);

  const renderTrigger = () => {
    const child = children as ReactElement;
    const childProps = child.props || {};
    return (
      <span ref={triggerRef} style={{ display: 'inline-block' }}>
        {cloneElement(child, {
          ...childProps,
          onClick: handleClick
        } as any)}
      </span>
    );
  };

  // 根据类型获取默认图标
  const getDefaultIcon = () => {
    const iconMap = {
      info: { type: 'info-circle', color: '#1890ff' },
      success: { type: 'check-circle', color: '#52c41a' },
      warning: { type: 'warning-circle', color: '#faad14' },
      error: { type: 'close-circle', color: '#f5222d' },
      danger: { type: 'close-circle', color: '#f5222d' }
    };
    const config = iconMap[type];
    return <Icon type={config.type} size={18} color={config.color} />;
  };

  const renderPopover = () => {
    // 当 visible 为 false 且不在退出状态时，不渲染
    if (!visible && !exiting) return null;

    const popoverContent = (
      <div
        ref={popoverRef}
        className={classNames(
          'zjpcy-popconfirm',
          !exiting && positionReady && 'zjpcy-popconfirm-visible',
          placementMap[actualPlacement],
          `zjpcy-popconfirm--${type}`,
          className
        )}
        style={{ position: 'fixed', top: `${position.top}px`, left: `${position.left}px`, ...style }}
      >
        <div ref={arrowRef} className="zjpcy-popconfirm-arrow" style={arrowStyle}></div>
        <div className="zjpcy-popconfirm-inner">
          <div className="zjpcy-popconfirm-header">
            <span style={{ display: icon ? 'inline-block' : 'none'}} className="zjpcy-popconfirm-icon">{icon || getDefaultIcon()}</span>
            <span className="zjpcy-popconfirm-title">{title}</span>
          </div>
          {description && <div className="zjpcy-popconfirm-description">{description}</div>}
          <div className="zjpcy-popconfirm-actions">
            {showCancel && (
              <Button
                variant={cancelButtonProps.variant || 'secondary'}
                onClick={handleCancel}
                disabled={cancelButtonProps.disabled || loading}
                size="small"
              >
                {cancelText}
              </Button>
            )}
            <Button
              variant={okButtonProps.variant || 'primary'}
              onClick={handleConfirm}
              loading={okButtonProps.loading || loading}
              disabled={okButtonProps.disabled}
              size="small"
            >
              {okText}
            </Button>
          </div>
        </div>
      </div>
    );

    const containerFn = getContainer || (() => document.body);
    if (getContainer === false) {
      return popoverContent;
    } else {
      const container = containerFn();
      if (container) {
        return createPortal(popoverContent, container);
      }
      return popoverContent;
    }
  };

  return (
    <>
      {renderTrigger()}
      {renderPopover()}
    </>
  );
};

export default Popconfirm;
export type { PopconfirmProps, PopconfirmPlacement } from './types';

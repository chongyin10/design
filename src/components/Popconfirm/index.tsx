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
  getContainer = () => document.body,
  className,
  style,
  children
}) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({ top: -9999, left: -9999 }); // 初始位置在视口外
  const [positionReady, setPositionReady] = useState(false); // 位置是否计算完成
  const [exiting, setExiting] = useState(false); // 退出动画状态
  const [actualPlacement, setActualPlacement] = useState<PopconfirmPlacement>(placement);
  const triggerRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const calculatePosition = () => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const padding = 8;
    const viewportPadding = 10;

    // 检测是否有足够空间，决定是否需要翻转
    let currentPlacement = placement;
    const spaceTop = triggerRect.top;
    const spaceBottom = window.innerHeight - triggerRect.bottom;
    const spaceLeft = triggerRect.left;
    const spaceRight = window.innerWidth - triggerRect.right;

    // 根据placement检测空间是否足够
    const needsFlip = (): boolean => {
      switch (placement) {
        case 'top':
        case 'topLeft':
        case 'topRight':
          return spaceTop < popoverRect.height + padding + viewportPadding;
        case 'bottom':
        case 'bottomLeft':
        case 'bottomRight':
          return spaceBottom < popoverRect.height + padding + viewportPadding;
        case 'left':
        case 'leftTop':
        case 'leftBottom':
          return spaceLeft < popoverRect.width + padding + viewportPadding;
        case 'right':
        case 'rightTop':
        case 'rightBottom':
          return spaceRight < popoverRect.width + padding + viewportPadding;
        default:
          return false;
      }
    };

    // 如果需要翻转，检查翻转后是否有足够空间
    if (needsFlip()) {
      const flippedPlacement = reversePlacementMap[placement];
      const hasSpaceAfterFlip = (): boolean => {
        switch (flippedPlacement) {
          case 'bottom':
          case 'bottomLeft':
          case 'bottomRight':
            return spaceBottom >= popoverRect.height + padding + viewportPadding;
          case 'top':
          case 'topLeft':
          case 'topRight':
            return spaceTop >= popoverRect.height + padding + viewportPadding;
          case 'right':
          case 'rightTop':
          case 'rightBottom':
            return spaceRight >= popoverRect.width + padding + viewportPadding;
          case 'left':
          case 'leftTop':
          case 'leftBottom':
            return spaceLeft >= popoverRect.width + padding + viewportPadding;
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
        top = triggerRect.top - popoverRect.height - padding;
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        if (currentPlacement === 'topLeft') {
          left = triggerRect.left;
        } else if (currentPlacement === 'topRight') {
          left = triggerRect.right - popoverRect.width;
        }
        break;
      case 'bottom':
      case 'bottomLeft':
      case 'bottomRight':
        top = triggerRect.bottom + padding;
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        if (currentPlacement === 'bottomLeft') {
          left = triggerRect.left;
        } else if (currentPlacement === 'bottomRight') {
          left = triggerRect.right - popoverRect.width;
        }
        break;
      case 'left':
      case 'leftTop':
      case 'leftBottom':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.left - popoverRect.width - padding;
        if (currentPlacement === 'leftTop') {
          top = triggerRect.top;
        } else if (currentPlacement === 'leftBottom') {
          top = triggerRect.bottom - popoverRect.height;
        }
        break;
      case 'right':
      case 'rightTop':
      case 'rightBottom':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.right + padding;
        if (currentPlacement === 'rightTop') {
          top = triggerRect.top;
        } else if (currentPlacement === 'rightBottom') {
          top = triggerRect.bottom - popoverRect.height;
        }
        break;
    }

    // 边界检测
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (left < viewportPadding) left = viewportPadding;
    if (left + popoverRect.width > windowWidth - viewportPadding) {
      left = windowWidth - popoverRect.width - viewportPadding;
    }
    if (top < viewportPadding) top = viewportPadding;
    if (top + popoverRect.height > windowHeight - viewportPadding) {
      top = windowHeight - popoverRect.height - viewportPadding;
    }

    setPosition({ top, left });
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
      setTimeout(() => {
        calculatePosition();
      }, 0);
      document.addEventListener('mousedown', handleClickOutside);

      // 监听滚动和窗口变化事件，重新计算位置并检测可见性
      const handleScroll = () => {
        calculatePosition();
        checkTriggerVisibility();
      };
      const handleResize = () => calculatePosition();
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);

      return () => {
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
        <div className="zjpcy-popconfirm-arrow"></div>
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

    if (getContainer === false) {
      return popoverContent;
    } else {
      const container = typeof getContainer === 'function' ? getContainer() : getContainer;
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

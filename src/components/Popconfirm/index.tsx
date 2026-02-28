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
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const placementMap: Record<PopconfirmPlacement, string> = {
    top: 'idp-popconfirm-top',
    bottom: 'idp-popconfirm-bottom',
    left: 'idp-popconfirm-left',
    right: 'idp-popconfirm-right',
    topLeft: 'idp-popconfirm-topLeft',
    topRight: 'idp-popconfirm-topRight',
    bottomLeft: 'idp-popconfirm-bottomLeft',
    bottomRight: 'idp-popconfirm-bottomRight',
    leftTop: 'idp-popconfirm-leftTop',
    leftBottom: 'idp-popconfirm-leftBottom',
    rightTop: 'idp-popconfirm-rightTop',
    rightBottom: 'idp-popconfirm-rightBottom'
  };

  const calculatePosition = () => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const padding = 8;

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
      case 'topLeft':
      case 'topRight':
        top = triggerRect.top - popoverRect.height - padding;
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        if (placement === 'topLeft') {
          left = triggerRect.left;
        } else if (placement === 'topRight') {
          left = triggerRect.right - popoverRect.width;
        }
        break;
      case 'bottom':
      case 'bottomLeft':
      case 'bottomRight':
        top = triggerRect.bottom + padding;
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        if (placement === 'bottomLeft') {
          left = triggerRect.left;
        } else if (placement === 'bottomRight') {
          left = triggerRect.right - popoverRect.width;
        }
        break;
      case 'left':
      case 'leftTop':
      case 'leftBottom':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.left - popoverRect.width - padding;
        if (placement === 'leftTop') {
          top = triggerRect.top;
        } else if (placement === 'leftBottom') {
          top = triggerRect.bottom - popoverRect.height;
        }
        break;
      case 'right':
      case 'rightTop':
      case 'rightBottom':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.right + padding;
        if (placement === 'rightTop') {
          top = triggerRect.top;
        } else if (placement === 'rightBottom') {
          top = triggerRect.bottom - popoverRect.height;
        }
        break;
    }

    // 边界检测
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (left < 10) left = 10;
    if (left + popoverRect.width > windowWidth - 10) {
      left = windowWidth - popoverRect.width - 10;
    }
    if (top < 10) top = 10;
    if (top + popoverRect.height > windowHeight - 10) {
      top = windowHeight - popoverRect.height - 10;
    }

    setPosition({ top, left });
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
        setVisible(false);
      } finally {
        setLoading(false);
      }
    } else {
      setVisible(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setVisible(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      popoverRef.current &&
      !popoverRef.current.contains(e.target as Node) &&
      triggerRef.current &&
      !triggerRef.current.contains(e.target as Node)
    ) {
      setVisible(false);
    }
  };

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        calculatePosition();
      }, 0);
      document.addEventListener('mousedown', handleClickOutside);

      // 监听滚动和窗口变化事件，重新计算位置
      const handleScroll = () => calculatePosition();
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
    if (!visible) return null;

    const popoverContent = (
      <div
        ref={popoverRef}
        className={classNames(
          'idp-popconfirm',
          'idp-popconfirm-visible',
          placementMap[placement],
          `idp-popconfirm--${type}`,
          className
        )}
        style={{ position: 'fixed', top: `${position.top}px`, left: `${position.left}px`, ...style }}
      >
        <div className="idp-popconfirm-arrow"></div>
        <div className="idp-popconfirm-inner">
          <div className="idp-popconfirm-header">
            <span style={{ display: icon ? 'inline-block' : 'none'}} className="idp-popconfirm-icon">{icon || getDefaultIcon()}</span>
            <span className="idp-popconfirm-title">{title}</span>
          </div>
          {description && <div className="idp-popconfirm-description">{description}</div>}
          <div className="idp-popconfirm-actions">
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

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import Button from '../Button';
import Icon from '../Icon';
import Flex from '../Flex';
import { ModalProps } from './types';
import './Modal.css';

const Modal: React.FC<ModalProps> = ({
    visible,
    title = '标题',
    width = 600,
    height = 'auto',
    headerHeight = 40,
    footerHeight = 50,
    confirmLoading = false,
    direction = 'normal',
    top,
    triggerRef,
    onCancel,
    onOk,
    children,
    footer = null,
    bordered = false,
    className,
    style,
    okText = '确认',
    cancelText = '取消',
    getContainer = () => document.body,
    maskStyle,
    maskClassName,
    zIndex = 1000,
    contentClassName,
    contentStyle: externalContentStyle,
    destroyOnClose = false,
    loading = false,
    loadingIcon,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [originOffset, setOriginOffset] = useState({ x: 0, y: 0 });
    const lastClickPointRef = useRef<{ x: number; y: number } | null>(null);
    const animationDuration = 400; // 略长于最长的 CSS 动画 (0.35s)
    const contentDelay = 30; // 减少延迟，提升响应速度

    // 当设置了top时，direction参数仍然生效
    // 如果direction='center'且设置了top，动画会从水平中心、垂直top位置开始
    // 如果direction='normal'且设置了top，动画会从点击位置到窗口中心
    const effectiveDirection = direction;

    // 计算内容区域高度
    const getHeightValue = (heightValue: number | string): number => {
        if (typeof heightValue === 'number') {
            return heightValue;
        }
        const match = heightValue.match(/^(\d+)px$/);
        return match ? parseInt(match[1], 10) : 0;
    };

    // 获取触发器的中心位置
    const getTriggerCenter = (): { x: number; y: number } | null => {
        if (triggerRef?.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        }
        // 如果没有 triggerRef，使用最后点击位置
        const point = lastClickPointRef.current;
        if (point) {
            return point;
        }
        return null;
    };

    const getClickOriginOffset = () => {
        const triggerCenter = getTriggerCenter();
        if (!triggerCenter || typeof window === 'undefined') {
            return { x: 0, y: 0 };
        }
        
        // 当设置了 top 或 direction='normal' 时，都从触发器位置动画到目标位置
        if (top !== undefined || effectiveDirection === 'normal') {
            // 水平方向：触发器到视口中心的偏移
            const centerX = window.innerWidth / 2;
            // 垂直方向：触发器到 top 位置（如果有）或视口中心的偏移
            const targetY = top !== undefined ? top + (height ? getHeightValue(height) / 2 : 0) : window.innerHeight / 2;
            return {
                x: triggerCenter.x - centerX,
                y: triggerCenter.y - targetY
            };
        } else if (effectiveDirection === 'center') {
            // direction='center'：从窗口中心开始
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            return {
                x: triggerCenter.x - centerX,
                y: triggerCenter.y - centerY
            };
        }
        
        // 其他方向（角落模式）返回默认值
        return { x: 0, y: 0 };
    };

    useEffect(() => {
        const handleMouseDown = (event: MouseEvent) => {
            lastClickPointRef.current = { x: event.clientX, y: event.clientY };
        };
        document.addEventListener('mousedown', handleMouseDown, true);
        return () => {
            document.removeEventListener('mousedown', handleMouseDown, true);
        };
    }, []);

    useEffect(() => {
        if (visible) {
            const nextOffset = getClickOriginOffset();
            setOriginOffset(nextOffset);
            setIsClosing(false);
            // 同步设置可见性，避免延迟导致的卡顿
            setIsVisible(true);
            // 微小延迟确保内容动画流畅
            const contentTimer = setTimeout(() => {
                setShowContent(true);
            }, contentDelay);
            return () => clearTimeout(contentTimer);
        } else {
            setIsClosing(true);
            setShowContent(false);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setIsClosing(false);
            }, animationDuration);
            return () => clearTimeout(timer);
        }
    }, [visible, animationDuration, height, top, destroyOnClose]);

    const handleCancel = () => {
        setIsClosing(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setIsClosing(false);
            onCancel?.();
        }, animationDuration);
        return () => clearTimeout(timer);
    };

    const handleOk = () => {
        onOk?.();
    };

    const containerStyle: React.CSSProperties = {
        width: typeof width === 'number' ? `${width}px` : width,
        // height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
        top: top !== undefined ? `${top}px` : undefined,
        ['--zjpcy-modal-origin-x' as any]: `${originOffset.x}px`,
        ['--zjpcy-modal-origin-y' as any]: `${originOffset.y}px`,
        visibility: showContent ? 'visible' : 'hidden',
        ...style
    };

    const headerStyle: React.CSSProperties = {
        height: typeof headerHeight === 'number' ? `${headerHeight}px` : headerHeight
    };

    const containerHeight = height ? getHeightValue(height) : 0;
    const headerHeightValue = getHeightValue(headerHeight);
    const footerHeightValue = getHeightValue(footerHeight);
    const calculatedContentHeight = containerHeight > 0
        ? Math.max(0, containerHeight - headerHeightValue - footerHeightValue)
        : undefined;

    // 合并内容区域样式，优先级：style > width | height > className > 默认样式
    const contentStyle: React.CSSProperties = {
        ...externalContentStyle // 1. 内联 style 优先级最高
    };

    // 2. 如果外部没有设置 maxHeight，则检查 height 属性（排除 'auto' 等非数值）
    if (!contentStyle.maxHeight && height && height !== 'auto') {
        const resolvedHeight = getHeightValue(height);
        if (resolvedHeight > 0) {
            contentStyle.maxHeight = `${resolvedHeight}px`;
        }
    }

    // 3. 如果外部没有设置 maxHeight 且没有 height 属性，则使用计算的内容高度
    if (!contentStyle.maxHeight && calculatedContentHeight) {
        contentStyle.maxHeight = `${calculatedContentHeight}px`;
    }

    const footerStyle: React.CSSProperties = {
        height: typeof footerHeight === 'number' ? `${footerHeight}px` : footerHeight
    };

    // 渲染加载状态
    const renderLoading = () => {
        if (!loading) return null;

        if (loadingIcon) {
            return (
                <div className="zjpcy-modal-loading">
                    <div className="zjpcy-modal-loading-content">
                        {loadingIcon}
                    </div>
                </div>
            );
        }

        return (
            <div className="zjpcy-modal-loading">
                <div className="zjpcy-modal-loading-content">
                    <div className="zjpcy-modal-loading-spinner">
                        <svg viewBox="0 0 24 24" className="zjpcy-modal-loading-icon">
                            <circle
                                className="zjpcy-modal-loading-track"
                                cx="12"
                                cy="12"
                                r="10"
                                fill="none"
                                strokeWidth="2"
                            />
                            <circle
                                className="zjpcy-modal-loading-indicator"
                                cx="12"
                                cy="12"
                                r="10"
                                fill="none"
                                strokeWidth="2"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        );
    };

    // 渲染Modal内容
    const renderModalContent = () => {
        if (!isVisible && !isClosing) return null;

        // 合并遮罩层样式，添加zIndex
        const mergedMaskStyle = {
            zIndex,
            ...maskStyle
        };

        return (
            <div
                className={classNames(
                    'zjpcy-modal-overlay',
                    {
                        'zjpcy-modal-overlay--visible': isVisible && !isClosing,
                        'zjpcy-modal-overlay--closing': isClosing,
                        'zjpcy-modal-overlay--custom-top': top !== undefined
                    },
                    className,
                    maskClassName
                )}
                onClick={handleCancel}
                style={mergedMaskStyle}
            >
                <div
                    className={classNames(
                        'zjpcy-modal-container',
                        {
                            // 显示动画 - 延迟显示内容，确保遮罩层模糊效果先渲染
                            // 当设置了 top 或 direction='normal' 时，使用 normal 动画（从触发器位置开始）
                            'zjpcy-modal-container--normal': showContent && !isClosing && (effectiveDirection === 'normal' || top !== undefined),
                            'zjpcy-modal-container--center': showContent && !isClosing && effectiveDirection === 'center' && top === undefined,
                            'zjpcy-modal-container--top-right': showContent && !isClosing && effectiveDirection === 'top-right' && top === undefined,
                            'zjpcy-modal-container--bottom-right': showContent && !isClosing && effectiveDirection === 'bottom-right' && top === undefined,
                            'zjpcy-modal-container--bottom-left': showContent && !isClosing && effectiveDirection === 'bottom-left' && top === undefined,
                            
                            // 关闭状态
                            'zjpcy-modal-container--closing-normal': isClosing && (effectiveDirection === 'normal' || top !== undefined),
                            'zjpcy-modal-container--closing-center': isClosing && effectiveDirection === 'center' && top === undefined,
                            'zjpcy-modal-container--closing-top-right': isClosing && effectiveDirection === 'top-right' && top === undefined,
                            'zjpcy-modal-container--closing-bottom-right': isClosing && effectiveDirection === 'bottom-right' && top === undefined,
                            'zjpcy-modal-container--closing-bottom-left': isClosing && effectiveDirection === 'bottom-left' && top === undefined,
                            'zjpcy-modal-container--bordered': bordered,
                            'zjpcy-modal-container--has-height': height !== undefined
                        }
                    )}
                    style={containerStyle}
                    onClick={(e) => e.stopPropagation()}
                >
                    {renderLoading()}
                    <div
                        className="zjpcy-modal-header"
                        style={headerStyle}
                    >
                        <div className="zjpcy-modal-header__left">
                            <span className="zjpcy-modal-header__title">{title}</span>
                        </div>
                        <div className="zjpcy-modal-header__right">
                            <div className="zjpcy-modal-close-btn" onClick={handleCancel}>
                                <Icon
                                    type="close"
                                    size={20}
                                    color="currentColor"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 只在Modal可见时渲染内容，关闭后销毁DOM节点 */}
                    {isVisible && (
                        <div
                            className={classNames(
                                'zjpcy-modal-content',
                                contentClassName
                            )}
                            style={contentStyle}
                        >
                            {/* 当 destroyOnClose 为 true 且正在关闭动画时，不渲染子元素 */}
                            {!(destroyOnClose && isClosing) ? children : null}
                        </div>
                    )}

                    <Flex
                        className="zjpcy-modal-footer"
                        align="center"
                        justify="flex-end"
                        style={Object.assign({}, footerStyle, { padding: '10px' })}
                        gap={12}
                    >
                        {footer === null ? (
                            <Flex
                                className="zjpcy-modal-footer__actions"
                                justify="flex-end"
                                gap={12}
                            >
                                <Button variant="secondary" onClick={handleCancel} disabled={confirmLoading}>
                                    {cancelText || '取消'}
                                </Button>
                                <Button variant="primary" onClick={handleOk} loading={confirmLoading}>
                                    {okText || '确认'}
                                </Button>
                            </Flex>
                        ) : (
                            footer
                        )}
                    </Flex>
                </div>
            </div>
        );
    };

    // 渲染Modal内容
    const modalContent = renderModalContent();
    
    // 如果没有内容需要渲染，直接返回null
    if (!modalContent) {
        return null;
    }
    
    // 根据getContainer属性决定渲染方式
    if (getContainer === false) {
        // 挂载在当前DOM
        return modalContent;
    } else {
        // 获取挂载容器
        const container = typeof getContainer === 'function' ? getContainer() : getContainer;
        // 只有当container存在时才使用createPortal，否则直接渲染
        if (container) {
            // 使用createPortal挂载到指定容器
            return createPortal(modalContent, container);
        } else {
            return modalContent;
        }
    }
};

export default Modal;

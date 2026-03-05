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
    height = 300,
    headerHeight = 40,
    footerHeight = 40,
    confirmLoading = false,
    direction = 'normal',
    top,
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
    const animationDuration = 550;
    const contentDelay = 50; // 延迟显示内容，确保遮罩层模糊效果先渲染

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

    const getClickOriginOffset = () => {
        const point = lastClickPointRef.current;
        if (!point || typeof window === 'undefined') {
            return { x: 0, y: 0 };
        }
        const resolvedHeight = height ? getHeightValue(height) : 0;
        
        // 根据不同的direction和top设置，计算动画原点
        if (effectiveDirection === 'center' && top !== undefined) {
            // direction='center' 且设置了 top：水平居中，垂直从 top 位置开始
            const centerX = window.innerWidth / 2;
            const centerY = top + (resolvedHeight > 0 ? resolvedHeight / 2 : 0);
            return {
                x: point.x - centerX,
                y: point.y - centerY
            };
        } else if (effectiveDirection === 'center') {
            // direction='center' 但没有设置 top：从窗口中心开始
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            return {
                x: point.x - centerX,
                y: point.y - centerY
            };
        } else if (top !== undefined && resolvedHeight > 0) {
            // direction='normal' 且设置了 top：从点击位置到窗口中心
            const centerX = window.innerWidth / 2;
            const centerY = top + resolvedHeight / 2;
            return {
                x: point.x - centerX,
                y: point.y - centerY
            };
        } else {
            // direction='normal' 且没有设置 top：从点击位置到窗口中心
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            return {
                x: point.x - centerX,
                y: point.y - centerY
            };
        }
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
            // 使用 requestAnimationFrame 确保 DOM 创建和 CSS 类切换不在同一帧
            // 避免遮罩层闪动
            requestAnimationFrame(() => {
                setIsVisible(true);
            });
            // 先显示遮罩层（带模糊），延迟后再显示内容，避免闪动
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
        ['--idp-modal-origin-x' as any]: `${originOffset.x}px`,
        ['--idp-modal-origin-y' as any]: `${originOffset.y}px`,
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

    // 2. 如果外部没有设置 maxHeight，则检查 height 属性
    if (!contentStyle.maxHeight && height) {
        const resolvedHeight = getHeightValue(height);
        contentStyle.maxHeight = `${resolvedHeight}px`;
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
                <div className="idp-modal-loading">
                    <div className="idp-modal-loading-content">
                        {loadingIcon}
                    </div>
                </div>
            );
        }

        return (
            <div className="idp-modal-loading">
                <div className="idp-modal-loading-content">
                    <div className="idp-modal-loading-spinner">
                        <svg viewBox="0 0 24 24" className="idp-modal-loading-icon">
                            <circle
                                className="idp-modal-loading-track"
                                cx="12"
                                cy="12"
                                r="10"
                                fill="none"
                                strokeWidth="2"
                            />
                            <circle
                                className="idp-modal-loading-indicator"
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
                    'idp-modal-overlay',
                    {
                        'idp-modal-overlay--visible': isVisible && !isClosing,
                        'idp-modal-overlay--closing': isClosing,
                        'idp-modal-overlay--custom-top': top !== undefined
                    },
                    className,
                    maskClassName
                )}
                onClick={handleCancel}
                style={mergedMaskStyle}
            >
                <div
                    className={classNames(
                        'idp-modal-container',
                        {
                            // 显示动画 - 延迟显示内容，确保遮罩层模糊效果先渲染
                            'idp-modal-container--center-top': showContent && !isClosing && effectiveDirection === 'center' && top !== undefined,
                            'idp-modal-container--center': showContent && !isClosing && effectiveDirection === 'center' && top === undefined,
                            'idp-modal-container--top-right': showContent && !isClosing && effectiveDirection === 'top-right',
                            'idp-modal-container--bottom-right': showContent && !isClosing && effectiveDirection === 'bottom-right',
                            'idp-modal-container--bottom-left': showContent && !isClosing && effectiveDirection === 'bottom-left',
                            'idp-modal-container--normal': showContent && !isClosing && effectiveDirection === 'normal',
                            
                            // 关闭状态
                            'idp-modal-container--closing-center-top': isClosing && effectiveDirection === 'center' && top !== undefined,
                            'idp-modal-container--closing-center': isClosing && effectiveDirection === 'center' && top === undefined,
                            'idp-modal-container--closing-top-right': isClosing && effectiveDirection === 'top-right',
                            'idp-modal-container--closing-bottom-right': isClosing && effectiveDirection === 'bottom-right',
                            'idp-modal-container--closing-bottom-left': isClosing && effectiveDirection === 'bottom-left',
                            'idp-modal-container--closing-normal': isClosing && effectiveDirection === 'normal',
                            'idp-modal-container--bordered': bordered,
                            'idp-modal-container--has-height': height !== undefined
                        }
                    )}
                    style={containerStyle}
                    onClick={(e) => e.stopPropagation()}
                >
                    {renderLoading()}
                    <div
                        className="idp-modal-header"
                        style={headerStyle}
                    >
                        <div className="idp-modal-header__left">
                            <span className="idp-modal-header__title">{title}</span>
                        </div>
                        <div className="idp-modal-header__right">
                            <div className="idp-modal-close-btn" onClick={handleCancel}>
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
                                'idp-modal-content',
                                contentClassName
                            )}
                            style={contentStyle}
                        >
                            {/* 当 destroyOnClose 为 true 且正在关闭动画时，不渲染子元素 */}
                            {!(destroyOnClose && isClosing) ? children : null}
                        </div>
                    )}

                    <Flex
                        className="idp-modal-footer"
                        align="center"
                        justify="flex-end"
                        style={Object.assign({}, footerStyle, { padding: '0px 10px' })}
                        gap={12}
                    >
                        {footer === null ? (
                            <Flex
                                className="idp-modal-footer__actions"
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

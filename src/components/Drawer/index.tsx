import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import Icon from '../Icon';
import { DrawerProps, DrawerPlacement } from './types';
import './Drawer.css';
import Button from '../Button';

const Drawer: React.FC<DrawerProps> = ({
    open,
    title,
    width = 460,
    height = 300,
    placement = 'right',
    maskClosable = true,
    mask = true,
    onClose,
    children,
    className,
    style,
    maskStyle,
    maskClassName,
    contentClassName,
    contentStyle,
    header,
    headerClassName,
    headerStyle,
    footer,
    footerClassName,
    footerStyle,
    getContainer = false,
    destroyOnClose = false,
    closable = true,
    zIndex = 1000,
    loading = false,
    loadingIcon,
    resizable = false,
    resizeHandleSize = 8,
    minWidth = 460,
    minHeight = 150,
    onChange,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isOpening, setIsOpening] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const animationDuration = 300;

    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    // 拖拽相关状态
    const [currentWidth, setCurrentWidth] = useState<number>(typeof width === 'number' ? width : 460);
    const [currentHeight, setCurrentHeight] = useState<number>(typeof height === 'number' ? height : 300);
    const [isResizing, setIsResizing] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);
    const resizeStartPosRef = useRef({ x: 0, y: 0 });
    const resizeStartSizeRef = useRef({ width: 0, height: 0 });
    const currentSizeRef = useRef({ width: currentWidth, height: currentHeight });

    // 使用 ref 存储所有配置，避免闭包问题
    const configRef = useRef({
        placement,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        onChange,
    });

    // 同步 ref 与 state
    useEffect(() => {
        currentSizeRef.current = { width: currentWidth, height: currentHeight };
    }, [currentWidth, currentHeight]);

    // 同步配置 ref
    useEffect(() => {
        configRef.current = {
            placement,
            minWidth,
            maxWidth,
            minHeight,
            maxHeight,
            onChange,
        };
    }, [placement, minWidth, maxWidth, minHeight, maxHeight, onChange]);

    // 当props变化时更新尺寸
    useEffect(() => {
        if (typeof width === 'number') {
            setCurrentWidth(width);
        }
    }, [width]);

    useEffect(() => {
        if (typeof height === 'number') {
            setCurrentHeight(height);
        }
    }, [height]);

    useEffect(() => {
        if (open) {
            setIsClosing(false);
            setIsVisible(true);
            // 禁用body滚动
            document.body.style.overflow = 'hidden';
            // 使用 requestAnimationFrame 确保浏览器先渲染初始状态，再触发动画
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsOpening(true);
                });
            });
        } else {
            setIsOpening(false);
            setIsClosing(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setIsClosing(false);
            }, animationDuration);
            return () => clearTimeout(timer);
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [open, animationDuration]);

    const handleMaskClick = () => {
        if (maskClosable) {
            onClose();
        }
    };

    const handleCloseClick = () => {
        onClose();
    };

    // 获取尺寸值
    const getSizeValue = (size: number | string): string => {
        if (typeof size === 'number') {
            return `${size}px`;
        }
        return size;
    };

    // 根据placement获取当前尺寸
    const getCurrentSize = (): { width: number | string; height: number | string } => {
        if (resizable) {
            return {
                width: currentWidth,
                height: currentHeight,
            };
        }
        return { width, height };
    };

    // 根据placement获取样式
    const getDrawerStyle = (): React.CSSProperties => {
        const baseStyle: React.CSSProperties = {
            ...style,
            zIndex,
        };

        const size = getCurrentSize();

        switch (placement) {
            case 'left':
            case 'right':
                baseStyle.width = getSizeValue(size.width);
                baseStyle.height = '100%';
                break;
            case 'top':
            case 'bottom':
                baseStyle.height = getSizeValue(size.height);
                baseStyle.width = '100%';
                break;
        }

        // 拖拽时禁用过渡动画
        if (isResizing) {
            baseStyle.transition = 'none';
        }

        return baseStyle;
    };

    // 判断是否需要渲染拖拽手柄
    const shouldShowResizeHandle = resizable && isVisible;

    // 获取拖拽手柄的位置类名
    const getResizeHandleClassName = (): string => {
        switch (placement) {
            case 'left':
                return 'idp-drawer-resize-handle--right';
            case 'right':
                return 'idp-drawer-resize-handle--left';
            case 'top':
                return 'idp-drawer-resize-handle--bottom';
            case 'bottom':
                return 'idp-drawer-resize-handle--top';
            default:
                return '';
        }
    };

    // 获取拖拽手柄的光标样式
    const getResizeHandleCursor = (): string => {
        switch (placement) {
            case 'left':
            case 'right':
                return 'col-resize';
            case 'top':
            case 'bottom':
                return 'row-resize';
            default:
                return 'default';
        }
    };

    // 开始拖拽
    const handleResizeStart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // 读取最新的 state 值作为起始尺寸
        const startWidth = currentSizeRef.current.width;
        const startHeight = currentSizeRef.current.height;

        // 关键：先将当前尺寸设置到 DOM，避免 isResizing 变为 true 后样式丢失
        if (drawerRef.current) {
            const config = configRef.current;
            if (config.placement === 'left' || config.placement === 'right') {
                drawerRef.current.style.width = `${startWidth}px`;
            } else {
                drawerRef.current.style.height = `${startHeight}px`;
            }
        }

        setIsResizing(true);
        resizeStartPosRef.current = { x: e.clientX, y: e.clientY };
        resizeStartSizeRef.current = { width: startWidth, height: startHeight };
    }, []);

    // 拖拽中 - 同步更新 DOM 和 state，避免两者不同步
    const handleResizeMove = useCallback((e: MouseEvent) => {
        const config = configRef.current;

        const deltaX = e.clientX - resizeStartPosRef.current.x;
        const deltaY = e.clientY - resizeStartPosRef.current.y;

        let newWidth = resizeStartSizeRef.current.width;
        let newHeight = resizeStartSizeRef.current.height;

        if (config.placement === 'left') {
            const rawWidth = resizeStartSizeRef.current.width + deltaX;
            newWidth = Math.max(config.minWidth, Math.min(config.maxWidth, rawWidth));
            if (newWidth !== rawWidth) {
                resizeStartPosRef.current.x = e.clientX;
                resizeStartSizeRef.current.width = newWidth;
            }
        } else if (config.placement === 'right') {
            const rawWidth = resizeStartSizeRef.current.width - deltaX;
            newWidth = Math.max(config.minWidth, Math.min(config.maxWidth, rawWidth));
            if (newWidth !== rawWidth) {
                resizeStartPosRef.current.x = e.clientX;
                resizeStartSizeRef.current.width = newWidth;
            }
        } else if (config.placement === 'top') {
            const rawHeight = resizeStartSizeRef.current.height + deltaY;
            newHeight = Math.max(config.minHeight, Math.min(config.maxHeight, rawHeight));
            if (newHeight !== rawHeight) {
                resizeStartPosRef.current.y = e.clientY;
                resizeStartSizeRef.current.height = newHeight;
            }
        } else if (config.placement === 'bottom') {
            const rawHeight = resizeStartSizeRef.current.height - deltaY;
            newHeight = Math.max(config.minHeight, Math.min(config.maxHeight, rawHeight));
            if (newHeight !== rawHeight) {
                resizeStartPosRef.current.y = e.clientY;
                resizeStartSizeRef.current.height = newHeight;
            }
        }

        // 更新 ref
        currentSizeRef.current = { width: newWidth, height: newHeight };

        // 同时更新 state 和 DOM，保持同步
        setCurrentWidth(newWidth);
        setCurrentHeight(newHeight);
        config.onChange?.({ width: newWidth, height: newHeight });
    }, []);

    // 结束拖拽
    const handleResizeEnd = useCallback(() => {
        setIsResizing(false);
    }, []);

    // 添加/移除全局鼠标事件监听
    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleResizeMove);
            document.addEventListener('mouseup', handleResizeEnd);
        } else {
            document.removeEventListener('mousemove', handleResizeMove);
            document.removeEventListener('mouseup', handleResizeEnd);
        }

        return () => {
            document.removeEventListener('mousemove', handleResizeMove);
            document.removeEventListener('mouseup', handleResizeEnd);
        };
    }, [isResizing, handleResizeMove, handleResizeEnd]);

    // 渲染加载状态
    const renderLoading = () => {
        if (!loading) return null;

        return (
            <div className="idp-drawer-loading">
                {loadingIcon || (
                    <Icon type="loading" size="large" spin />
                )}
            </div>
        );
    };

    // 渲染头部
    const renderHeader = () => {
        // 如果header为false，不显示头部
        if (header === false) return null;

        // 如果有自定义头部内容，优先渲染自定义内容
        if (header) {
            return (
                <div
                    className={classNames('idp-drawer-header', headerClassName)}
                    style={headerStyle}
                >
                    {header}
                </div>
            );
        }

        // 默认头部：如果没有title且不可关闭，不渲染头部
        if (!title && !closable) return null;

        return (
            <div
                className={classNames('idp-drawer-header', headerClassName)}
                style={headerStyle}
            >
                <div className="idp-drawer-header__title">{title}</div>
                {closable && (
                    <button
                        className="idp-drawer-header__close"
                        onClick={handleCloseClick}
                        type="button"
                        aria-label="Close"
                    >
                        <Icon type="close" size={20} />
                    </button>
                )}
            </div>
        );
    };

    // 渲染拖拽手柄
    const renderResizeHandle = () => {
        if (!shouldShowResizeHandle) return null;

        return (
            <div
                className={classNames(
                    'idp-drawer-resize-handle',
                    getResizeHandleClassName()
                )}
                style={{
                    cursor: getResizeHandleCursor(),
                    [placement === 'left' || placement === 'right' ? 'width' : 'height']: resizeHandleSize,
                }}
                onMouseDown={handleResizeStart}
            />
        );
    };

    // 渲染内容
    const renderContent = () => {
        if (!isVisible && !isClosing) return null;

        const content = (
            <div
                className={classNames(
                    'idp-drawer-overlay',
                    {
                        'idp-drawer-overlay--visible': isOpening && !isClosing,
                        'idp-drawer-overlay--closing': isClosing,
                        'idp-drawer-overlay--resizing': isResizing,
                    },
                    maskClassName
                )}
                style={{
                    zIndex,
                    ...maskStyle,
                }}
                onClick={handleMaskClick}
            >
                <div
                    ref={drawerRef}
                    className={classNames(
                        'idp-drawer',
                        `idp-drawer--${placement}`,
                        {
                            'idp-drawer--visible': isOpening && !isClosing,
                            'idp-drawer--closing': isClosing,
                            'idp-drawer--no-mask': !mask,
                            'idp-drawer--resizing': isResizing,
                        },
                        className
                    )}
                    style={getDrawerStyle()}
                    onClick={(e) => e.stopPropagation()}
                >
                    {renderLoading()}
                    {renderHeader()}
                    <div
                        className={classNames('idp-drawer-content', contentClassName)}
                        style={contentStyle}
                    >
                        {!(destroyOnClose && isClosing) ? children : null}
                    </div>
                    {footer !== false && (
                        <div
                            className={classNames('idp-drawer-footer', footerClassName)}
                            style={footerStyle}
                        >
                            {footer || (
                                <>
                                    <Button onClick={handleCloseClick} type="button">取消</Button>
                                    <Button variant='primary' onClick={handleCloseClick} type="button">确认</Button>
                                </>
                            )}
                        </div>
                    )}
                    {renderResizeHandle()}
                </div>
            </div>
        );

        // 如果不显示遮罩层
        if (!mask) {
            return (
                <div
                    className={classNames(
                        'idp-drawer-wrapper',
                        {
                            'idp-drawer-wrapper--visible': isOpening && !isClosing,
                            'idp-drawer-wrapper--closing': isClosing,
                        }
                    )}
                    style={{ zIndex }}
                >
                    <div
                        ref={drawerRef}
                        className={classNames(
                            'idp-drawer',
                            `idp-drawer--${placement}`,
                            {
                                'idp-drawer--visible': isOpening && !isClosing,
                                'idp-drawer--closing': isClosing,
                                'idp-drawer--no-mask': !mask,
                                'idp-drawer--resizing': isResizing,
                            },
                            className
                        )}
                        style={getDrawerStyle()}
                    >
                        {renderLoading()}
                        {renderHeader()}
                        <div
                            className={classNames('idp-drawer-content', contentClassName)}
                            style={contentStyle}
                        >
                            {!(destroyOnClose && isClosing) ? children : null}
                        </div>
                        {footer !== false && (
                            <div
                                className={classNames('idp-drawer-footer', footerClassName)}
                                style={footerStyle}
                            >
                                {footer || (
                                    <>
                                        <button onClick={handleCloseClick} type="button">取消</button>
                                        <button onClick={handleCloseClick} type="button">确认</button>
                                    </>
                                )}
                            </div>
                        )}
                        {renderResizeHandle()}
                    </div>
                </div>
            );
        }

        return content;
    };

    const drawerContent = renderContent();

    if (!drawerContent) {
        return null;
    }

    // 根据getContainer决定渲染方式
    if (getContainer === false) {
        // 挂载在当前DOM
        return drawerContent;
    } else {
        // 获取挂载容器
        const container = typeof getContainer === 'function' ? getContainer() : getContainer;
        // 只有当container存在时才使用createPortal，否则直接渲染
        if (container) {
            return createPortal(drawerContent, container);
        } else {
            return drawerContent;
        }
    }
};

export default Drawer;
export type { DrawerProps, DrawerPlacement };

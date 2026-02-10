import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import Icon from '../Icon';
import { DrawerProps, DrawerPlacement } from './types';
import './Drawer.css';

const Drawer: React.FC<DrawerProps> = ({
    visible,
    title,
    width = 360,
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
    showHeader = true,
    header,
    headerClassName,
    headerStyle,
    showFooter = true,
    footer,
    footerClassName,
    footerStyle,
    getContainer = false,
    destroyOnClose = false,
    closable = true,
    zIndex = 1000,
    loading = false,
    loadingIcon,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isOpening, setIsOpening] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const animationDuration = 300;

    useEffect(() => {
        if (visible) {
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
    }, [visible, animationDuration]);

    const handleMaskClick = () => {
        if (maskClosable && onClose) {
            onClose();
        }
    };

    const handleCloseClick = () => {
        if (onClose) {
            onClose();
        }
    };

    // 获取尺寸值
    const getSizeValue = (size: number | string): string => {
        if (typeof size === 'number') {
            return `${size}px`;
        }
        return size;
    };

    // 根据placement获取样式
    const getDrawerStyle = (): React.CSSProperties => {
        const baseStyle: React.CSSProperties = {
            ...style,
            zIndex,
        };

        switch (placement) {
            case 'left':
            case 'right':
                baseStyle.width = getSizeValue(width);
                baseStyle.height = '100%';
                break;
            case 'top':
            case 'bottom':
                baseStyle.height = getSizeValue(height);
                baseStyle.width = '100%';
                break;
        }

        return baseStyle;
    };

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
        // 如果不显示头部，直接返回null
        if (!showHeader) return null;

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

        // 如果没有title且不可关闭，不渲染头部
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
                    className={classNames(
                        'idp-drawer',
                        `idp-drawer--${placement}`,
                        {
                            'idp-drawer--visible': isOpening && !isClosing,
                            'idp-drawer--closing': isClosing,
                            'idp-drawer--no-mask': !mask,
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
                    {showFooter && footer && (
                        <div
                            className={classNames('idp-drawer-footer', footerClassName)}
                            style={footerStyle}
                        >
                            {footer}
                        </div>
                    )}
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
                        className={classNames(
                            'idp-drawer',
                            `idp-drawer--${placement}`,
                            {
                                'idp-drawer--visible': isOpening && !isClosing,
                                'idp-drawer--closing': isClosing,
                                'idp-drawer--no-mask': !mask,
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
                        {showFooter && footer && (
                            <div
                                className={classNames('idp-drawer-footer', footerClassName)}
                                style={footerStyle}
                            >
                                {footer}
                            </div>
                        )}
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
